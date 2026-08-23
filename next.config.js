/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['next-themes'],
  // Type errors now FAIL the build. This was set to `true` during an earlier
  // Vercel firefight, which meant `strict: true` in tsconfig bought nothing —
  // the compiler complained and shipped anyway. Two real errors had been
  // sitting in main because of it (a broken next-themes type stub, and a
  // ToastProvider importing the uninstalled `sonner`). Both are fixed; this
  // keeps the next one from going unnoticed.
  typescript: {
    ignoreBuildErrors: false,
  },
  // ESLint stays advisory for now. The project has never linted in CI, so
  // flipping this in the same change would fail the build on pre-existing
  // style findings unrelated to type safety. Tighten it separately, after an
  // audit of what it actually reports.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
