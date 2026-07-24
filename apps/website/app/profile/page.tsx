import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Images, LogOut, UserRound } from "lucide-react";
import { authOrigins } from "@/lib/auth-routing";
import { ensureAppUser } from "@/lib/auth-user";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function VisitorProfilePage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/main.html?login=session&next=%2Fprofile#login");
  }

  const appUser = await ensureAppUser(data.user);
  if (appUser.role === "ADMIN") {
    redirect(`${authOrigins().admin}/admin`);
  }

  const accesses = await prisma.userGalleryAccess.findMany({
    where: { userId: appUser.id },
    include: {
      event: {
        include: {
          client: true,
          _count: { select: { mediaFiles: true } }
        }
      }
    },
    orderBy: { lastAccessedAt: "desc" }
  });

  return (
    <main className="visitor-profile">
      <header className="visitor-profile__header">
        <Link href="/main.html" className="visitor-profile__brand">ROOH <i>N</i> RANG</Link>
        <Link href="/auth/sign-out" className="visitor-profile__logout"><LogOut size={16} /> Sign out</Link>
      </header>
      <section className="visitor-profile__intro">
        <div className="visitor-profile__avatar"><UserRound size={23} /></div>
        <p>{appUser.role === "CLIENT" ? "Client profile" : "Visitor profile"}</p>
        <h1>{appUser.name || "Your profile"}</h1>
        <span>{appUser.email}{appUser.phone ? ` / ${appUser.phone}` : ""}</span>
      </section>
      <section className="visitor-profile__galleries">
        <div>
          <p>Private archive</p>
          <h2>Your galleries</h2>
          <span>Every gallery asks for its studio PIN when a new access session begins.</span>
        </div>
        {accesses.length === 0 ? (
          <div className="visitor-profile__empty">
            <Images size={25} />
            <h3>No gallery opened yet</h3>
            <p>Use the unique gallery link shared by the studio, then sign in and enter its four digit PIN.</p>
          </div>
        ) : (
          <div className="visitor-profile__grid">
            {accesses.map(({ event, lastAccessedAt }) => (
              <Link key={event.id} href={`${authOrigins().gallery}/gallery/${event.slug}/lock`} className="visitor-profile__gallery">
                <span>{event.client.name}</span>
                <h3>{event.name}</h3>
                <p>{event.city || "Private gallery"} / {event._count.mediaFiles} photographs</p>
                <small>Last opened {lastAccessedAt.toLocaleDateString("en-GB")}</small>
                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
