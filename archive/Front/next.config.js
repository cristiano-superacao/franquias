/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server runtime para APIs reais
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
