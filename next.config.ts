import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
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
  cacheComponents: true,
  // AWS Amplify exposes console environment variables during the BUILD phase
  // (`npm run build`) but NOT to the SSR/compute Lambda at runtime. Server-only
  // vars (no NEXT_PUBLIC_ prefix) stay as runtime `process.env` lookups, which are
  // undefined on the Lambda — that's why PAGARME_SECRET_KEY was "ausente" in prod
  // while NEXT_PUBLIC_PAGARME_PUBLIC_KEY (inlined at build) worked. Listing the
  // server secrets here inlines their build-time value into the bundle via webpack
  // DefinePlugin. They are only referenced in server route handlers, so the value
  // never ships to the client.
  env: {
    PAGARME_SECRET_KEY: process.env.PAGARME_SECRET_KEY ?? '',
    PAGAR_ME_ACCOUNT_ID: process.env.PAGAR_ME_ACCOUNT_ID ?? '',
    AMPLIFY_USERPOOL_ID: process.env.AMPLIFY_USERPOOL_ID ?? '',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ?? '',
  },
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
        hostname: '*.s3.*.amazonaws.com',
      },
    ],
  },
}

export default nextConfig
