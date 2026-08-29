import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return { beforeFiles: [
      { source: "/index.html", destination: "/" },
      { source: "/pages/:slug.html", destination: "/pages/:slug" },
    ] };
  },
};

export default nextConfig;
