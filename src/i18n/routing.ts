import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation'; // Yahan change kiya hai

export const routing = defineRouting({
  // 🔥 Isse TypeScript ko pata chalta hai ki ye languages fix hain.
  locales: ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'pt'] as const,

  // Default language
  defaultLocale: 'en',

  /**
   * 'always' = /en/ hamesha dikhega (Google ke liye best)
   */
  localePrefix: 'always'
});

// Yahan bhi 'createNavigation' use karna hai
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
