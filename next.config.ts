import type { NextConfig } from "next";
import { systemPaths } from "@/constants/paths";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: systemPaths.home,
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
