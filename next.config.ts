import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const dest = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    if (!dest) {
      return [];
    }
    return [
      {
        source: "/graphql",
        destination: dest,
      },
    ];
  },
};

export default nextConfig;
