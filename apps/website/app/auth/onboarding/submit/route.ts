import { NextRequest, NextResponse } from "next/server";
import { safeAuthDestination } from "@/lib/auth-routing";
import { ensureAppUser } from "@/lib/auth-user";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const phone = String(formData.get("phone") || "").trim();
  const next = safeAuthDestination(String(formData.get("next") || ""));
  const onboardingUrl = new URL("/auth/onboarding", request.nextUrl.origin);
  if (next) onboardingUrl.searchParams.set("next", next);

  if (phone.length < 7 || phone.length > 24) {
    onboardingUrl.searchParams.set("error", "phone");
    return NextResponse.redirect(onboardingUrl, 303);
  }

  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.redirect(new URL("/main.html?login=session#login", request.nextUrl.origin), 303);
  }

  const { data, error } = await supabase.auth.updateUser({
    data: {
      ...userData.user.user_metadata,
      phone
    }
  });

  if (error || !data.user) {
    onboardingUrl.searchParams.set("error", "phone");
    return applyAuthCookies(NextResponse.redirect(onboardingUrl, 303));
  }

  await ensureAppUser(data.user);
  const completeUrl = new URL("/auth/complete", request.nextUrl.origin);
  if (next) completeUrl.searchParams.set("next", next);
  return applyAuthCookies(NextResponse.redirect(completeUrl, 303));
}
