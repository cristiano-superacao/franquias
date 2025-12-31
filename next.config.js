/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server runtime para APIs reais (Railway)
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
