import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.pdftara.com' },
      { protocol: 'https', hostname: 'pdftara.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

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

    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: { fullySpecified: false },
    });

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^module$/,
        contextRegExp: /@bentopdf/,
      })
    );

    // WASM Experiments ko yahan se hata diya hai taaki koi conflict na ho
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false, // Disabled for testing ads
      layers: false, 
    };

    return config;
  },

  // --- HEADERS RESET ---
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // COOP aur COEP headers ko poori tarah hata diya hai
        ],
      },
    ];
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
