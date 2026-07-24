import { NextRequest, NextResponse } from "next/server";
import { loginPageUrl, safeAuthDestination } from "@/lib/auth-routing";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeAuthDestination(request.nextUrl.searchParams.get("next"));
  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const completeUrl = new URL("/auth/complete", request.nextUrl.origin);
      if (next) completeUrl.searchParams.set("next", next);
      return applyAuthCookies(NextResponse.redirect(completeUrl));
    }
  }

  return applyAuthCookies(NextResponse.redirect(loginPageUrl({ error: "callback", next })));
}
