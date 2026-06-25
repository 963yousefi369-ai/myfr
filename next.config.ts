import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from 'next'
import path from 'path'

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8000' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8000' },
      { protocol: 'http', hostname: 'backend', port: '8000' },
      { protocol: 'http', hostname: '0.0.0.0' },
      { protocol: 'http', hostname: '95.38.161.104' },
      { protocol: 'http', hostname: '95.38.161.205' },
      { protocol: 'https', hostname: 'farzam.runflare.run' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${API_URL}/media/:path*`,
      },
    ]
  },
  async redirects() {
    return process.env.NODE_ENV === 'production'
      ? [
          {
            source: '/editor',
            destination: '/404',
            permanent: false,
          },
        ]
      : [];
  },
}
export default withPayload(nextConfig)
