import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin workspace root so Next.js doesn't pick up parent lockfiles
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
