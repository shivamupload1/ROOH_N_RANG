import fs from "node:fs";
import path from "node:path";
import { Prisma, PrismaClient } from "@prisma/client";

function unquote(value: string) {
  const trimmed = value.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
}

function readEnvironment() {
  const source = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  const values = new Map<string, string>();
  const databaseUrls: string[] = [];

  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const value = unquote(match[2]);
    values.set(match[1], value);
    if (match[1] === "DATABASE_URL" && value) databaseUrls.push(value);
  }

  return { values, databaseUrls };
}

function hostOf(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

async function main() {
  const { values, databaseUrls } = readEnvironment();
  const sourceUrl = values.get("LEGACY_DATABASE_URL") || databaseUrls.find((value) => hostOf(value).includes("neon.tech"));
  const targetUrl = values.get("DIRECT_URL") || databaseUrls.find((value) => hostOf(value).includes("supabase.com"));

  if (!sourceUrl || !targetUrl) {
    throw new Error("Both the legacy Neon URL and Supabase target URL are required.");
  }

  if (hostOf(sourceUrl) === hostOf(targetUrl)) {
    throw new Error("Source and target databases must be different.");
  }

  const source = new PrismaClient({ datasourceUrl: sourceUrl });
  const target = new PrismaClient({ datasourceUrl: targetUrl });

  try {
    const users = await source.user.findMany({
      select: { id: true, name: true, email: true, phone: true, passwordHash: true, role: true, createdAt: true, updatedAt: true }
    });
    const clients = await source.client.findMany();
    const driveAccounts = await source.driveAccount.findMany();
    const events = await source.event.findMany();
    const albums = await source.album.findMany();
    const mediaFiles = await source.mediaFile.findMany();
    const favorites = await source.favorite.findMany();
    const downloads = await source.download.findMany();
    const inquiries = await source.inquiry.findMany();
    const websiteContent = await source.websiteContent.findMany();
    const settings = await source.settings.findMany();

    await target.user.createMany({ data: users, skipDuplicates: true });
    await target.client.createMany({ data: clients, skipDuplicates: true });
    await target.driveAccount.createMany({ data: driveAccounts, skipDuplicates: true });
    await target.event.createMany({ data: events, skipDuplicates: true });
    await target.album.createMany({ data: albums, skipDuplicates: true });
    await target.mediaFile.createMany({ data: mediaFiles, skipDuplicates: true });
    await target.favorite.createMany({ data: favorites, skipDuplicates: true });
    await target.download.createMany({ data: downloads, skipDuplicates: true });
    await target.inquiry.createMany({ data: inquiries, skipDuplicates: true });
    await target.websiteContent.createMany({
      data: websiteContent.map((item) => ({
        ...item,
        value: item.value === null ? Prisma.JsonNull : (item.value as Prisma.InputJsonValue)
      })),
      skipDuplicates: true
    });
    await target.settings.createMany({
      data: settings.map((item) => ({
        ...item,
        value: item.value === null ? Prisma.JsonNull : (item.value as Prisma.InputJsonValue)
      })),
      skipDuplicates: true
    });

    const sourceCounts = {
      users: users.length,
      clients: clients.length,
      driveAccounts: driveAccounts.length,
      events: events.length,
      albums: albums.length,
      mediaFiles: mediaFiles.length,
      favorites: favorites.length,
      downloads: downloads.length,
      inquiries: inquiries.length,
      websiteContent: websiteContent.length,
      settings: settings.length
    };

    const targetCounts = {
      users: await target.user.count(),
      clients: await target.client.count(),
      driveAccounts: await target.driveAccount.count(),
      events: await target.event.count(),
      albums: await target.album.count(),
      mediaFiles: await target.mediaFile.count(),
      favorites: await target.favorite.count(),
      downloads: await target.download.count(),
      inquiries: await target.inquiry.count(),
      websiteContent: await target.websiteContent.count(),
      settings: await target.settings.count()
    };

    console.log(JSON.stringify({ source: sourceCounts, target: targetCounts }, null, 2));
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Migration failed");
  process.exit(1);
});
