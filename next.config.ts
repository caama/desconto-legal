import type { NextConfig } from 'next'
import PWA from 'next-pwa'

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
      }
    ],
    qualities: [50, 75, 100],
  },
}

PWA({
  dest: 'public',
})

export default nextConfig
