/**
 * Robots.txt Generation
 * Configures crawling rules for search engines
 */

import { MetadataRoute } from 'next';

// Static export ke liye zaroori hai
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/', 
          '/_next/static/', // Zaroori hai taaki Google CSS/JS padh sake
          '/favicon.ico',
        ],
        disallow: [
          '/api/',       // Private API routes
          '/admin/',     // Agar koi admin panel hai toh
          '/*?*',        // Search parameters wale pages (crawl budget bachane ke liye)
        ],
      },
      {
        // AI Bots ko block karna chaho toh (Optional)
        userAgent: ['GPTBot', 'CCBot'],
        disallow: ['/'],
      }
    ],
    // ASLI DOMAIN AUR SITEMAP LINK
    sitemap: 'https://www.pdftara.com/sitemap.xml',
  };
}