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
        hostname: "img.clerk.com",
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
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "pub-764b2f9992e44491998ffd3f90e860c7.r2.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload", // Forza HTTPS
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN", // Previene Clickjacking (nessuno può mettere il tuo sito in un iframe)
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Previene MIME-sniffing
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin", // Privacy sui link in uscita
          },
        ],
      },
    ];
  },
};

export default nextConfig;
