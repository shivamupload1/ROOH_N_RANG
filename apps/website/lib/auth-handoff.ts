import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

export function handoffTokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createAuthHandoff(input: {
  userId: string;
  destination: "ADMIN" | "GALLERY";
  returnPath: string;
}) {
  const token = randomBytes(32).toString("base64url");
  await prisma.authHandoff.create({
    data: {
      tokenHash: handoffTokenHash(token),
      userId: input.userId,
      destination: input.destination,
      returnPath: input.returnPath,
      expiresAt: new Date(Date.now() + 90_000)
    }
  });
  return token;
}
