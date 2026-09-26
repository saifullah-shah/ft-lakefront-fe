import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@lakefront/content-model", "@lakefront/contracts"],
  poweredByHeader: false,
};

export default nextConfig;
