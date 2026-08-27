import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dxm.contentcenter.michelin.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ],
  },
};

export default nextConfig;
