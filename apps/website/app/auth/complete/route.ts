import { NextRequest, NextResponse } from "next/server";
import { createAuthHandoff } from "@/lib/auth-handoff";
import {
  authOrigins,
  defaultDestination,
  handoffDestination,
  loginPageUrl,
  safeAuthDestination
} from "@/lib/auth-routing";
import { ensureAppUser } from "@/lib/auth-user";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

function destinationPath(destination: string) {
  const url = new URL(destination);
  return `${url.pathname}${url.search}${url.hash}`;
}

export async function GET(request: NextRequest) {
  const requestedDestination = safeAuthDestination(request.nextUrl.searchParams.get("next"));
  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return applyAuthCookies(NextResponse.redirect(loginPageUrl({ error: "session", next: requestedDestination })));
  }

  const appUser = await ensureAppUser(data.user);
  if (appUser.role === "GUEST" && !appUser.phone) {
    const onboardingUrl = new URL("/auth/onboarding", request.nextUrl.origin);
    if (requestedDestination) onboardingUrl.searchParams.set("next", requestedDestination);
    return applyAuthCookies(NextResponse.redirect(onboardingUrl));
  }

  let destination = requestedDestination || defaultDestination(appUser.role);
  const type = handoffDestination(destination);

  if (type === "ADMIN" && appUser.role !== "ADMIN") {
    destination = defaultDestination(appUser.role);
  }

  const resolvedType = handoffDestination(destination);
  if (resolvedType === "WEBSITE") {
    return applyAuthCookies(NextResponse.redirect(destination));
  }

  const token = await createAuthHandoff({
    userId: appUser.id,
    destination: resolvedType,
    returnPath: destinationPath(destination)
  });
  const targetOrigin = resolvedType === "ADMIN" ? authOrigins().admin : authOrigins().gallery;
  const handoffUrl = new URL("/auth/handoff", targetOrigin);
  handoffUrl.searchParams.set("code", token);

  const response = NextResponse.redirect(handoffUrl);
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return applyAuthCookies(response);
}
