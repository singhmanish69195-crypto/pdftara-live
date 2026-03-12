import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // 🔥 Sabhi languages ko yahan list kiya hai.
  // GSC mein dikh rahe 'zh-TW' ke liye hum 'zh' use karenge jo universal hai.
  locales: ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'pt'] as const,

  // Default bhasha English (en) rahegi
  defaultLocale: 'en',

  /**
   * 🔥 FIX: 'as-needed' ka use kiya hai.
   * Isse default language (English) ke liye URL mein '/en' ki zarurat nahi hogi.
   * Example: pdftara.com seedha khulega, koi redirect nahi hoga. 
   * Isse GSC ka "Page with redirect" wala error root page se khatam ho jayega.
   */
  localePrefix: 'as-needed'
});

// Navigation helpers jo hum poore app mein use karte hain
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
