import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "js9h3pgrk0.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
