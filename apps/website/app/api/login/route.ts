import { NextResponse } from "next/server";

function appUrl(value: string | undefined, fallback: string) {
  return (value || fallback).replace(/\/$/, "");
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return NextResponse.redirect(new URL("/main.html?login=required", request.url), 303);
  }

  const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminUrl = appUrl(process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL, "http://localhost:3001");
  const galleryUrl = appUrl(process.env.GALLERY_URL || process.env.NEXT_PUBLIC_GALLERY_URL, "http://localhost:3002");
  const destination = email === adminEmail ? `${adminUrl}/api/login` : `${galleryUrl}/api/login`;

  return NextResponse.redirect(destination, 307);
}
