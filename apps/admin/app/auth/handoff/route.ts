import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { identityCookie } from "@/lib/identity-session";
import { prisma } from "@/lib/db";

function websiteLoginUrl(error?: string) {
  const fallback = process.env.NODE_ENV === "production"
    ? "https://rooh-n-rang.vercel.app"
    : "http://localhost:3000";
  const website = process.env.WEBSITE_URL || process.env.NEXT_PUBLIC_WEBSITE_URL || fallback;
  const url = new URL("/main.html", website);
  url.searchParams.set("next", `${process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}/admin`);
  if (error) url.searchParams.set("login", error);
  url.hash = "login";
  return url;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code") || "";
  const tokenHash = createHash("sha256").update(code).digest("hex");
  const handoff = code
    ? await prisma.authHandoff.findUnique({
        where: { tokenHash },
        include: { user: true }
      })
    : null;

  if (
    !handoff ||
    handoff.destination !== "ADMIN" ||
    handoff.consumedAt ||
    handoff.expiresAt.getTime() <= Date.now() ||
    handoff.user.role !== "ADMIN" ||
    !handoff.user.authUserId
  ) {
    return NextResponse.redirect(websiteLoginUrl("access"));
  }

  const consumed = await prisma.authHandoff.updateMany({
    where: { id: handoff.id, consumedAt: null },
    data: { consumedAt: new Date() }
  });
  if (consumed.count !== 1) {
    return NextResponse.redirect(websiteLoginUrl("session"));
  }

  const cookie = identityCookie({
    userId: handoff.user.id,
    authUserId: handoff.user.authUserId,
    email: handoff.user.email,
    name: handoff.user.name,
    role: handoff.user.role
  });
  const returnPath = handoff.returnPath.startsWith("/admin") ? handoff.returnPath : "/admin";
  const response = NextResponse.redirect(new URL(returnPath, request.nextUrl.origin));
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
