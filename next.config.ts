import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/resume-optimizer',
  assetPrefix: '/resume-optimizer/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;