import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "@/lib/db";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function ensureAppUser(authUser: SupabaseUser) {
  const email = text(authUser.email).toLowerCase();
  if (!email) {
    throw new Error("A verified email address is required.");
  }

  const metadata = authUser.user_metadata || {};
  const name = text(metadata.full_name || metadata.name);
  const phone = text(metadata.phone);
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ authUserId: authUser.id }, { email: { equals: email, mode: "insensitive" } }]
    }
  });

  if (existing) {
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        authUserId: authUser.id,
        name: existing.name || name || null,
        phone: existing.phone || phone || null
      }
    });
  }

  return prisma.user.create({
    data: {
      authUserId: authUser.id,
      email,
      name: name || null,
      phone: phone || null,
      role: "GUEST"
    }
  });
}
