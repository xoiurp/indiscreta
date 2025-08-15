/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporariamente ignorar erros de TypeScript durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporariamente ignorar erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.myshopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'indiscreta.shop',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig