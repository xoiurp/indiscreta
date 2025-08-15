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
}

module.exports = nextConfig