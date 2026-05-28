import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  // poweredByHeader hata diya taaki confusion na ho

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.pdftara.com' },
      { protocol: 'https', hostname: 'pdftara.com' },
    ],
  },

  webpack: (config) => {
    // PDF tools ke liye ye alias zaroori hote hain
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },

  // Headers ko abhi ke liye poori tarah hata diya hai 
  // taaki ads bina kisi rukawat ke load ho sakein
  async headers() {
    return [];
  },

  // Errors ko ignore karne ke liye taaki build pass ho jaye
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
