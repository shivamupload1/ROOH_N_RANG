import { createHmac, timingSafeEqual } from "node:crypto";
import { DriveAccountStatus, MediaType } from "@prisma/client";
import { google } from "googleapis";
import { decrypt, encrypt } from "@/lib/crypto";
import { prisma } from "@/lib/db";

const DRIVE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email"
];

type OAuthState = {
  driveAccountId: string;
  ts: number;
};

function appUrl() {
  return process.env.APP_URL || "http://localhost:3000";
}

function oauthConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${appUrl()}/api/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required.");
  }

  return { clientId, clientSecret, redirectUri };
}

function signingSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required to sign Google OAuth state.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", signingSecret()).update(value).digest("base64url");
}

function encodeState(state: OAuthState) {
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeState(value: string): OAuthState {
  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    throw new Error("Invalid OAuth state.");
  }

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) {
    throw new Error("Invalid OAuth state signature.");
  }

  const state = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as OAuthState;

  if (!state.driveAccountId || Date.now() - state.ts > 1000 * 60 * 15) {
    throw new Error("OAuth state expired.");
  }

  return state;
}

export function createOAuthClient() {
  const { clientId, clientSecret, redirectUri } = oauthConfig();
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getAuthUrl(driveAccountId: string) {
  const oauth2Client = createOAuthClient();

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: DRIVE_SCOPES,
    state: encodeState({ driveAccountId, ts: Date.now() })
  });
}

export async function handleOAuthCallback(code: string, stateValue: string) {
  const state = decodeState(stateValue);
  const oauth2Client = createOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const profile = await oauth2.userinfo.get();

  await prisma.driveAccount.update({
    where: { id: state.driveAccountId },
    data: {
      googleEmail: profile.data.email || undefined,
      encryptedAccessToken: tokens.access_token ? encrypt(tokens.access_token) : undefined,
      encryptedRefreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : undefined,
      tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      status: DriveAccountStatus.CONNECTED
    }
  });

  return state.driveAccountId;
}

async function authorizedClient(driveAccountId: string) {
  const account = await prisma.driveAccount.findUnique({ where: { id: driveAccountId } });

  if (!account) {
    throw new Error("Drive account not found.");
  }

  if (!account?.encryptedRefreshToken) {
    await prisma.driveAccount.update({
      where: { id: driveAccountId },
      data: { status: DriveAccountStatus.REVOKED }
    });
    throw new Error("Drive account is not connected.");
  }

  const oauth2Client = createOAuthClient();
  const currentAccessToken = account.encryptedAccessToken ? decrypt(account.encryptedAccessToken) : undefined;

  oauth2Client.setCredentials({
    access_token: currentAccessToken,
    refresh_token: decrypt(account.encryptedRefreshToken),
    expiry_date: account.tokenExpiry?.getTime()
  });

  try {
    const token = await oauth2Client.getAccessToken();

    if (token.token && token.token !== currentAccessToken) {
      await prisma.driveAccount.update({
        where: { id: driveAccountId },
        data: {
          encryptedAccessToken: encrypt(token.token),
          status: DriveAccountStatus.CONNECTED
        }
      });
    }
  } catch {
    await prisma.driveAccount.update({
      where: { id: driveAccountId },
      data: {
        status: account.tokenExpiry && account.tokenExpiry.getTime() < Date.now() ? DriveAccountStatus.EXPIRED : DriveAccountStatus.REVOKED
      }
    });

    throw new Error("Google Drive connection expired or was revoked. Reconnect the account and try again.");
  }

  return { account, oauth2Client };
}

export async function createFolder(driveAccountId: string, name: string, parentFolderId?: string | null) {
  const { oauth2Client } = await authorizedClient(driveAccountId);
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const response = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: parentFolderId ? [parentFolderId] : undefined
    },
    fields: "id,name"
  });

  return response.data;
}

export async function listFiles(driveAccountId: string, folderId: string) {
  const { account, oauth2Client } = await authorizedClient(driveAccountId);
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const response = await drive.files.list({
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: account.sharedDriveId ? "drive" : "default",
    driveId: account.sharedDriveId || undefined,
    q: `'${folderId}' in parents and trashed = false`,
    pageSize: 100,
    orderBy: "folder,name_natural",
    fields: "files(id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,imageMediaMetadata,videoMediaMetadata)"
  });

  return response.data.files || [];
}

export async function getFileMetadata(driveAccountId: string, fileId: string) {
  const { oauth2Client } = await authorizedClient(driveAccountId);
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const response = await drive.files.get({
    fileId,
    supportsAllDrives: true,
    fields: "id,name,mimeType,size,thumbnailLink,webViewLink,webContentLink,imageMediaMetadata,videoMediaMetadata"
  });

  return response.data;
}

export async function importFilesFromFolder(
  driveAccountId: string,
  eventId: string,
  albumId: string | null,
  folderId: string
) {
  const files = await listFiles(driveAccountId, folderId);
  const imported = [];

  for (const file of files) {
    if (!file.id || !file.name || !file.mimeType) {
      continue;
    }

    const mediaType = file.mimeType.startsWith("video/") ? MediaType.VIDEO : MediaType.PHOTO;

    if (!file.mimeType.startsWith("image/") && !file.mimeType.startsWith("video/")) {
      continue;
    }

    const media = await prisma.mediaFile.upsert({
      where: {
        driveAccountId_driveFileId: {
          driveAccountId,
          driveFileId: file.id
        }
      },
      update: {
        eventId,
        albumId,
        fileName: file.name,
        mimeType: file.mimeType,
        fileSize: file.size ? BigInt(file.size) : null,
        mediaType,
        thumbnailUrl: file.thumbnailLink || null,
        previewUrl: file.webViewLink || file.webContentLink || null
      },
      create: {
        eventId,
        albumId,
        driveAccountId,
        driveFileId: file.id,
        fileName: file.name,
        mimeType: file.mimeType,
        fileSize: file.size ? BigInt(file.size) : null,
        mediaType,
        thumbnailUrl: file.thumbnailLink || null,
        previewUrl: file.webViewLink || file.webContentLink || null
      }
    });

    imported.push(media);
  }

  return imported;
}
