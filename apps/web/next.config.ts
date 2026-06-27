import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // The Next app lives in apps/web, but dependencies are hoisted at the monorepo root.
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
