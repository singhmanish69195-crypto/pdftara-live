import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 🔥 Sabhi languages list
  locales: ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'pt'] as const,

  // Default bhasha English (en) rahegi
  defaultLocale: 'en',

  /**
   * 🔥 FIX 1: 'as-needed' ka matlab hai ki English (default) ke liye 
   * URL mein '/en' bilkul nahi dikhega.
   */
  localePrefix: 'as-needed',

  /**
   * 🔥 FIX 2: Sabse Zaruri! 'localeDetection: false' karne se 
   * browser aapko apne aap '/en' par redirect nahi karega.
   * Iske bina URL bar-bar '/en' par chala jata hai.
   */
  localeDetection: false
});

// Navigation helpers jo hum poore app mein use karte hain
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
