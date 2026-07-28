import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ MASTER SEO FIX: Har URL ke peeche '/' lagna pakka hai. 
  // Isse Google ko "Page with redirect" error nahi milega.
  trailingSlash: true, 

  reactStrictMode: true,
  poweredByHeader: false, // Security ke liye branding hata di

  // --- GLOBAL HEADERS ---
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // SEO Tip: HSTS header search engines ko batata hai ki site secure hai
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  // --- WEBPACK CONFIG FOR WASM & PERFORMANCE ---
  webpack: (config, { isServer }) => {
    // Canvas aur encoding ke aliases
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // 🚀 WASM SUPPORT: PDF processing ke liye sabse zaroori
    config.experiments = { 
      ...config.experiments, 
      asyncWebAssembly: true,
      layers: true 
    };

    // Server-side par WASM ki handling
    if (isServer) {
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }

    return config;
  },

  // --- BUILD OPTIMIZATIONS ---
  // Build ke time errors ignore karo taaki jaldi deploy ho (Jaisa tune manga tha)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  // NEXT-INTL OPTIMIZATION:
  // Isse Google ko language redirect mein dikkat nahi hogi
  swcMinify: true,
};

export default withNextIntl(nextConfig);
