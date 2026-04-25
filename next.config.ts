import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set workspace root to this project directory.
    // Prevents the "multiple lockfiles" warning caused by a package-lock.json
    // sitting in the parent home directory (~/).
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
