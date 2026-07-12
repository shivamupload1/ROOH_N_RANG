import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  turbopack: { root: path.join(__dirname, "../..") },
  transpilePackages: ["@rooh/database"],
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  async redirects() {
    return [
      { source: "/", destination: "/index.html", permanent: false },
      { source: "/main", destination: "/main.html", permanent: false },
      { source: "/featured-stories", destination: "/featured-stories.html", permanent: false },
      { source: "/stories/bharat-mehak", destination: "/featured-story-bharat-mehak.html", permanent: false },
      { source: "/stories/meera-arjun", destination: "/featured-story-meera-arjun.html", permanent: false },
      {
        source: "/client-login",
        destination: `${process.env.NEXT_PUBLIC_GALLERY_URL || "http://localhost:3002"}/client-login`,
        permanent: false
      },
      {
        source: "/client-gallery",
        destination: `${process.env.NEXT_PUBLIC_GALLERY_URL || "http://localhost:3002"}/client-login`,
        permanent: false
      },
      {
        source: "/gallery/:path*",
        destination: `${process.env.NEXT_PUBLIC_GALLERY_URL || "http://localhost:3002"}/gallery/:path*`,
        permanent: false
      },
      {
        source: "/admin",
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}/admin`,
        permanent: false
      },
      {
        source: "/admin/:path*",
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001"}/admin/:path*`,
        permanent: false
      }
    ];
  }
};

export default nextConfig;
