import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { loginPageUrl, safeAuthDestination } from "@/lib/auth-routing";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

const signupSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(24),
  password: z.string().min(8).max(128)
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const next = safeAuthDestination(String(formData.get("next") || ""));
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return NextResponse.redirect(loginPageUrl({ error: "signup-details", next }), 303);
  }

  const callbackUrl = new URL("/auth/callback", request.nextUrl.origin);
  if (next) callbackUrl.searchParams.set("next", next);
  const { supabase, applyAuthCookies } = createSupabaseRouteClient(request);
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: callbackUrl.toString(),
      data: {
        full_name: parsed.data.name,
        phone: parsed.data.phone
      }
    }
  });

  if (error) {
    return applyAuthCookies(NextResponse.redirect(loginPageUrl({ error: "signup", next }), 303));
  }

  if (data.session) {
    const completeUrl = new URL("/auth/complete", request.nextUrl.origin);
    if (next) completeUrl.searchParams.set("next", next);
    return applyAuthCookies(NextResponse.redirect(completeUrl, 303));
  }

  return applyAuthCookies(NextResponse.redirect(loginPageUrl({ status: "verify", next }), 303));
}
