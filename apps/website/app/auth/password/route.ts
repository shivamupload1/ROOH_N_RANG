import { NextRequest, NextResponse } from "next/server";
import { loginPageUrl, safeAuthDestination } from "@/lib/auth-routing";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const next = safeAuthDestination(String(formData.get("next") || ""));
  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);

  if (!email || !password) {
    return NextResponse.redirect(loginPageUrl({ error: "required", next }), 303);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const code = /confirm/i.test(error.message) ? "verify-required" : "credentials";
    return applyAuthCookies(NextResponse.redirect(loginPageUrl({ error: code, next }), 303));
  }

  const completeUrl = new URL("/auth/complete", request.nextUrl.origin);
  if (next) completeUrl.searchParams.set("next", next);
  return applyAuthCookies(NextResponse.redirect(completeUrl, 303));
}
