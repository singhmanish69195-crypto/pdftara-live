import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. GLOBAL REDIRECTS (Non-WWW to WWW Enforcement)
  // Ensures all traffic lands on the primary canonical domain
  // This helps Google avoid indexing multiple versions of the same page
  async redirects() {
    return [
      {
        // Source: Any path coming from pdftara.com (non-www)
        source: '/:path*',
        has: [{ type: 'host', value: 'pdftara.com' }],
        destination: 'https://www.pdftara.com/:path*',
        permanent: true,
      },
    ];
  },

  // 2. TRAILING SLASH ENFORCEMENT (SEO Optimization)
  // Forces all URLs to end with / (e.g., /blog/ instead of /blog)
  // This matches your sitemap and prevents GSC redirect errors.
  trailingSlash: true,

  // 3. PERFORMANCE & SEO BOOSTERS
  poweredByHeader: false,
  reactStrictMode: true,

  // 4. SERVER ACTIONS (PDF Upload Limits)
  // Allowing large PDF files (up to 50MB) for processing tools
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // 5. WEBPACK CONFIGURATION (WASM & PDF Libraries Fix)
  // Essential for browser-side PDF processing tools
  // This handles filesystem fallbacks and WebAssembly experiments
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        module: false,
        url: false,
        worker_threads: false,
      };
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      'module': false,
    };

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^module$/,
        contextRegExp: /@bentopdf/,
      })
    );

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },

  // 6. IMAGE OPTIMIZATION (Vercel & Static Compatibility)
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days caching duration
  },

  // 7. SECURITY & CACHING HEADERS
  async headers() {
    return [
      {
        // Static Assets Caching (1 Year)
        source: '/:path*.(ico|jpg|jpeg|png|gif|svg|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // JS and CSS Caching (1 Year)
        source: '/:path*.(js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // General Security Headers for all application pages
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // 8. DEVELOPMENT & BUILD SETTINGS
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  compiler: {
    // Remove console.logs in production environments but keep errors
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default withNextIntl(nextConfig);
