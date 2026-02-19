import type { NextConfig } from "next";

// NOTE: Main configuration lives in next.config.js.
// This file exists to satisfy Next.js 15 TypeScript config detection.
// Keep settings in sync with next.config.js.
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
