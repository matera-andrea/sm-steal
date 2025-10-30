import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icons8.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "brandfetch.com",
      },
      {
        protocol: "https",
        hostname: "pub-764b2f9992e44491998ffd3f90e860c7.r2.dev",
      },
    ],
  },
};

export default nextConfig;
