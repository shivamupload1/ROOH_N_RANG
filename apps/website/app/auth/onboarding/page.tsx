import { redirect } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { safeAuthDestination } from "@/lib/auth-routing";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const destination = safeAuthDestination(next);
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect(`/main.html?login=session${destination ? `&next=${encodeURIComponent(destination)}` : ""}#login`);
  }

  return (
    <main className="auth-onboarding">
      <section className="auth-onboarding__panel">
        <div className="auth-onboarding__icon"><Phone size={19} /></div>
        <p className="auth-onboarding__eyebrow">One last detail</p>
        <h1>Complete your profile</h1>
        <p className="auth-onboarding__copy">
          Add a phone number for studio communication. Phone verification is not required right now.
        </p>
        <form action="/auth/onboarding/submit" method="post" className="auth-onboarding__form">
          <input type="hidden" name="next" value={destination} />
          <label>
            <span>Phone number</span>
            <input name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={7} maxLength={24} required />
          </label>
          {error ? <p className="auth-onboarding__error">Please enter a valid phone number.</p> : null}
          <button type="submit">
            Continue <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}
