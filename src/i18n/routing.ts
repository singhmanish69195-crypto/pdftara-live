import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 1. Sabhi languages ki list
  locales: ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'pt'] as const,

  // 2. Default language hamesha English rahegi
  defaultLocale: 'en',

  /**
   * 🔥 SABSE ZARURI FIX:
   * 'as-needed' ka matlab hai ki English (default) ke liye 
   * URL mein '/en' bilkul nahi aayega.
   */
  localePrefix: 'as-needed',

  /**
   * 🔥 AUTOMATIC REDIRECT BAND:
   * 'localeDetection: false' karne se browser zabardasti 
   * user ko '/en' par nahi bhejega.
   */
  localeDetection: false
});

// Navigation helpers jo hum poore app mein use karte hain
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
