import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', 
  basePath: isProd ? '/resume-optimizer' : '', // <-- Update this to your new repo name
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;