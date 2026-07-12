import { prisma } from "@/lib/db";

export async function getRecentInstagramPosts() {
  return prisma.instagramPost.findMany({
    where: { isActive: true },
    orderBy: [{ postedAt: "desc" }, { syncedAt: "desc" }],
    take: 3,
    select: { id: true, permalink: true, mediaType: true, mediaUrl: true, thumbnailUrl: true, caption: true }
  });
}
