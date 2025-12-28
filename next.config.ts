import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Build er somoy ESLint error thakle seta ignore korbe
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript-er kono error thakle seta ignore korbe
    ignoreBuildErrors: true,
  },
};

export default nextConfig;