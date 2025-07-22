/** @type {import('next').NextConfig} */
onst nextConfig = {
  output: 'export',
  basePath: '/foodies',
  assetPrefix: '/foodies/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig
