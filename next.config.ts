import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export', // Tells Next.js to build static HTML/CSS/JS files
  basePath: isProd ? '/JobAssistant' : '', // Tells Next.js your repository name
  images: {
    unoptimized: true, // GitHub Pages doesn't support Next.js dynamic image optimization
  },
};

export default nextConfig;