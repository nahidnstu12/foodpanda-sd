import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
