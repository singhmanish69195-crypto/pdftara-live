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

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true, 
    };

    return config;
  },

  // --- HEADERS FIX (Sabse Main Part) ---
  async headers() {
    return [
      {
        // Sabhi pages ke liye normal headers (Taaki Ads na rukein)
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        // WASM Headers sirf tool pages par lagayenge (Specific Paths)
        // Agar aapke tools ka path alag hai toh use yahan add karein
        source: '/:locale/(merge-pdf|split-pdf|compress-pdf|pdf-to-word|word-to-pdf)/:path*', 
        headers: [
          { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
