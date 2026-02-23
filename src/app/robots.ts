/**
 * PDFTARA ROBOTS CONFIGURATION - ULTIMATE FIX
 * 🏆 Purpose: Fix Bing Blocking & Enable Fast Auto-Indexing
 */

import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',             // Poori site allow hai
          '/en/blog',      // Saare blog posts allow hain
          '/en/tools',     // Saare tools allow hain
          '/_next/static/', 
        ],
        disallow: [
          '/api/',         // Private
          '/admin/',       // Private
          '/cgi-bin/',     // Server folders
          // '/*?*'  <-- Yeh hata diya hai, ab tools block nahi honge
        ],
      },
      {
        // AI scrapers ko block rakha hai taaki content safe rahe
        userAgent: ['GPTBot', 'CCBot', 'ChatGPT-User', 'anthropic-ai'],
        disallow: ['/'],
      }
    ],
    // Sitemap sabse zaroori hai automatic indexing ke liye
    sitemap: 'https://www.pdftara.com/sitemap.xml',
  }
}
