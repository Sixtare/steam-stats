import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: "/",
      },
      {
        source: "/library",
        destination: "/",
      },
      {
        source: "/comparisons",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;
