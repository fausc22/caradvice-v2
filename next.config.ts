import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.caradvice.com.ar",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
