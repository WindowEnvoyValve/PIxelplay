/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/hardware",
        destination: "/specs",
        permanent: true,
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  async redirects() {
    return [
      {
        source: "/hardware",
        destination: "/specs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
