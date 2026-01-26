import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from '@/lib/i18n/config';

export const routing = defineRouting({
  // Saari languages ki list
  locales,

  // Default language (English)
  defaultLocale,

  /**
   * IMPORTANT FIX:
   * 'as-needed' use karne se pdftara.com/en/ ki jagah seedha pdftara.com/ khulega.
   * Isse ek redirect kam ho jayega. 
   * Agar aapko 'always' hi pasand hai, toh neeche wala sitemap fix zaroor karna.
   */
  localePrefix: 'as-needed', 

  // Isse pakka hota hai ki trailing slash handle ho
  domains: [] 
});