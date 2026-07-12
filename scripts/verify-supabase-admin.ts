import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

function loadEnvironment() {
  const source = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const value = match[2].trim().replace(/^['"]|['"]$/g, "");
    process.env[match[1]] = value;
  }
}

async function main() {
  loadEnvironment();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!url || !key || !email || !password) {
    throw new Error("Supabase URL, publishable key, and admin credentials are required.");
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw new Error(error?.message || "Supabase admin sign-in failed.");
  }

  const prisma = new PrismaClient();
  try {
    const admin = await prisma.user.findFirst({
      where: { email: { equals: data.user.email || email, mode: "insensitive" }, role: "ADMIN" },
      select: { id: true, role: true }
    });
    if (!admin) throw new Error("The matching application admin record was not found.");
    await prisma.user.update({ where: { id: admin.id }, data: { authUserId: data.user.id } });
    console.log(JSON.stringify({ auth: true, role: admin.role, linked: true }));
  } finally {
    await prisma.$disconnect();
    await supabase.auth.signOut();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Supabase admin verification failed");
  process.exit(1);
});
