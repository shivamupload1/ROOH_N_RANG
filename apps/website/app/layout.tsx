import type { Metadata } from "next";
import "./globals.css";
import { getSiteBrand } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getSiteBrand();
  return {
    title: { default: `${brand.name} | Wedding Photography`, template: `%s | ${brand.name}` },
    description: "Wedding photography, cinematic films, and private online gallery delivery.",
    metadataBase: new URL(process.env.WEBSITE_URL || "http://localhost:3000")
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
