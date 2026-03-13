import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. GLOBAL REDIRECTS (WWW Enforcement)
  // Sirf non-www se www par bhejna hai. 
  // /en wala kaam middleware handle karega, yahan mat likhna warna loop ban jayega.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'pdftara.com' }],
        destination: 'https://www.pdftara.com/:path*',
        permanent: true,
      },
    ];
  },

  // 2. TRAILING SLASH (SEO Optimization)
  // Agar tu ise true rakh raha hai, to sitemap mein bhi links ke peeche '/' hona chahiye.
  trailingSlash: true,

  // 3. PERFORMANCE & SEO BOOSTERS
  poweredByHeader: false,
  reactStrictMode: true,

  // 4. SERVER ACTIONS (PDF Upload Limits - 50MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // 5. WEBPACK CONFIGURATION (WASM & PDF Libraries Fix)
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

  // 6. IMAGE OPTIMIZATION
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  // 7. SECURITY & CACHING HEADERS
  async headers() {
    return [
      {
        source: '/:path*.(ico|jpg|jpeg|png|gif|svg|webp|avif|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*.(js|css)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
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

  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default withNextIntl(nextConfig);
