import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/app",
        destination: "/app.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
