import { NextResponse } from "next/server";
import { getRecentInstagramPosts } from "@/lib/instagram";
import { getHomeHeroContent, getSiteBrand } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const [brand, hero, instagram] = await Promise.all([
    getSiteBrand(),
    getHomeHeroContent(),
    getRecentInstagramPosts().catch(() => [])
  ]);

  return NextResponse.json(
    { brand, hero, instagram },
    { headers: { "cache-control": "public, s-maxage=300, stale-while-revalidate=3600" } }
  );
}
