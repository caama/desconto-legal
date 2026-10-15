import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-descontolegal.caama.org.br',
      },
      {
        protocol: 'https',
        hostname: 'cdn-descontolegal-dev.caama.org.br',
      },
    ],
    unoptimized: true,
    deviceSizes: [640, 828, 1080],
    qualities: [50, 75, 100],
  },
}

export default nextConfig
