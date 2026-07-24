import { NextRequest, NextResponse } from "next/server";
import { loginPageUrl, safeAuthDestination } from "@/lib/auth-routing";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(request: NextRequest) {
  const next = safeAuthDestination(request.nextUrl.searchParams.get("next"));
  const callbackUrl = new URL("/auth/callback", request.nextUrl.origin);
  if (next) callbackUrl.searchParams.set("next", next);

  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
      queryParams: {
        prompt: "select_account"
      }
    }
  });

  if (error || !data.url) {
    return applyAuthCookies(NextResponse.redirect(loginPageUrl({ error: "google", next })));
  }

  return applyAuthCookies(NextResponse.redirect(data.url));
}
