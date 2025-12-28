/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // basePath: '/franquias', // descomente se for necessário para subpasta do GitHub Pages
  images: { unoptimized: true }, // para evitar erros de otimização de imagens no export
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
