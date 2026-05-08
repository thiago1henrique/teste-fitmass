import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options',           value: 'DENY' },
  { key: 'X-Content-Type-Options',    value: 'nosniff' },
  { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // CSP omitted intentionally: Amplify/Cognito/AppSync use multi-level AWS subdomains
  // (e.g. cognito-idp.us-east-1.amazonaws.com, <id>.appsync-api.us-east-1.amazonaws.com)
  // that cannot be safely covered by a single CSP wildcard without breaking auth.
  // Add CSP via Content-Security-Policy-Report-Only first, audit violations, then enforce.
]

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling native-addon packages — they must be loaded at runtime
  // from node_modules so the platform-correct binary (Linux on Lambda) is used.
  serverExternalPackages: ['sharp'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fitmass.com.br',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
