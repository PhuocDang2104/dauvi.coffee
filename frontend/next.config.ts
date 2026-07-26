import type { NextConfig } from "next";

const backendProxyOrigin = process.env.BACKEND_PROXY_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async rewrites() {
    if (!backendProxyOrigin) return [];
    return [
      {
        source: "/backend-api/:path*",
        destination: `${backendProxyOrigin}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
