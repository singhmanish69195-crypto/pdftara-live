import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,

  // --- HEADERS KA KHEL (YAHAN HAI FIX) ---
  async headers() {
    return [
      {
        // 1. Sabhi pages ke liye (Homepage, Blog, etc.)
        // In par koi COOP/COEP nahi hoga, Ads mast chalenge
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        // 2. Sirf Tools waale pages ke liye (Jahan WASM ki zaroorat hai)
        // Note: Check karo aapke tools ka path kya hai. 
        // Agar /en/merge-pdf hai toh ye niche wala pattern sahi hai.
        source: '/:locale/(merge-pdf|split-pdf|compress-pdf|word-to-pdf|pdf-to-word|pdf-to-cbz)/:path*', 
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // 'require-corp' se behtar hai ads ke liye
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
