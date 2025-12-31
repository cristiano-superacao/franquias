/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server runtime para APIs reais (Railway)
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
