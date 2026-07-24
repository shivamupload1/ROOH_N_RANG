const LOCAL_WEBSITE = "http://localhost:3000";
const LOCAL_ADMIN = "http://localhost:3001";
const LOCAL_GALLERY = "http://localhost:3002";

function origin(value: string | undefined, fallback: string) {
  try {
    return new URL(value || fallback).origin;
  } catch {
    return fallback;
  }
}

export function authOrigins() {
  const production = process.env.NODE_ENV === "production";

  return {
    website: origin(
      process.env.WEBSITE_URL || process.env.NEXT_PUBLIC_WEBSITE_URL,
      production ? "https://rooh-n-rang.vercel.app" : LOCAL_WEBSITE
    ),
    admin: origin(
      process.env.ADMIN_URL || process.env.NEXT_PUBLIC_ADMIN_URL,
      production ? "https://rooh-n-rang-admin.vercel.app" : LOCAL_ADMIN
    ),
    gallery: origin(
      process.env.GALLERY_URL || process.env.NEXT_PUBLIC_GALLERY_URL,
      production ? "https://rooh-n-rang-gallery.vercel.app" : LOCAL_GALLERY
    )
  };
}

export function safeAuthDestination(candidate: string | null | undefined) {
  const origins = authOrigins();
  const fallback = `${origins.website}/profile`;
  const raw = String(candidate || "").trim();

  if (!raw) return "";

  try {
    const url = raw.startsWith("/") ? new URL(raw, origins.website) : new URL(raw);
    const allowedOrigins = new Set(Object.values(origins));

    if (!allowedOrigins.has(url.origin) || !["http:", "https:"].includes(url.protocol)) {
      return fallback;
    }

    return `${url.origin}${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

export function loginPageUrl(params?: { error?: string; status?: string; next?: string }) {
  const url = new URL("/main.html", authOrigins().website);
  if (params?.error) url.searchParams.set("login", params.error);
  if (params?.status) url.searchParams.set("auth", params.status);
  if (params?.next) url.searchParams.set("next", params.next);
  url.hash = "login";
  return url;
}

export function defaultDestination(role: "ADMIN" | "CLIENT" | "GUEST") {
  const origins = authOrigins();
  if (role === "ADMIN") return `${origins.admin}/admin`;
  if (role === "CLIENT") return `${origins.gallery}/profile`;
  return `${origins.website}/profile`;
}

export function handoffDestination(destination: string) {
  const origins = authOrigins();
  const url = new URL(destination);
  if (url.origin === origins.admin) return "ADMIN";
  if (url.origin === origins.gallery) return "GALLERY";
  return "WEBSITE";
}
