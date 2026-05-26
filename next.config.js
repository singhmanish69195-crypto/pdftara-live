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

  // 1. IMAGE OPTIMIZATION
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.pdftara.com' },
      { protocol: 'https', hostname: 'pdftara.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },

  // 2. WEBPACK CONFIG (SABSE ZAROORI FIX)
  webpack: (config, { isServer, webpack }) => {
    
    // --- CANVAS FIX (Isko condition se bahar rakha hai taaki build time pe error na aaye) ---
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

    // next-intl parsing fix: Jo 'import(t)' wala error aa raha tha uske liye
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
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
      layers: true, // WASM aur complex builds ke liye helpful hai
    };

    return config;
  },

  // 3. SECURITY HEADERS
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // BUILD SETTINGS
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);