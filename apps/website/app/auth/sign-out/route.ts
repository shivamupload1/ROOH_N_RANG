import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function GET(request: NextRequest) {
  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);
  await supabase.auth.signOut();
  return applyAuthCookies(NextResponse.redirect(new URL("/main.html", request.nextUrl.origin)));
}
