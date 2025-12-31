/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server runtime para APIs reais (Railway)
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
