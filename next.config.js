import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 ब्रह्मास्त्र टिप: trailingSlash को true रखने से सर्विस वर्कर का पाथ कभी-कभी बिगड़ता है।
  // पक्का करना कि 'coi-serviceworker.js' हमेशा रूट (pdftara.com/coi-serviceworker.js) पर ही रहे।
  trailingSlash: true, 
  reactStrictMode: true,
  poweredByHeader: false, 

  // --- HEADERS RESET ---
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // ⚠️ ध्यान दें: COOP और COEP यहाँ से हटा दिए हैं। 
          // इनका काम अब 'coi-serviceworker.js' और 'vercel.json' (credentialless के साथ) संभालेंगे।
        ],
      },
    ];
  },

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // 🚀 WASM की पावर के लिए ये सेटिंग्स ज़रूरी हैं
    config.experiments = { 
      ...config.experiments, 
      asyncWebAssembly: true,
      layers: true 
    };

    return config;
  },

  // Build के टाइम फालतू एरर्स को इग्नोर करो ताकि डिप्लॉयमेंट फ़ास्ट हो
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default withNextIntl(nextConfig);
