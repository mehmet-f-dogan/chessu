/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

module.exports = nextConfig;
