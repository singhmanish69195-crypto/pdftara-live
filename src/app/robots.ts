/**
 * PDFTARA ROBOTS CONFIGURATION - ULTIMATE FIX
 * 🏆 Purpose: Clean, Fast Auto-Indexing for All Languages
 */

import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',             // Poori site ke har language (/en, /es, /fr sab) ko allow karega
          '/_next/static/', // Next.js ke design aur scripts ko Google ko padhne dega (Zaroori hai)
        ],
        disallow: [
          '/api/',         // Backend APIs ko block karna sahi hai
          '/admin/',       // Admin panel block
          '/cgi-bin/',     // Server folders block
          // Query parameters ko block na karein, jaisa tune theek socha hai
        ],
      },
      {
        // AI scrapers ko block rakha hai (Content chori hone se bachega)
        userAgent: ['GPTBot', 'CCBot', 'ChatGPT-User', 'anthropic-ai'],
        disallow: ['/'],
      }
    ],
    // Sitemap sabse zaroori hai
    sitemap: 'https://www.pdftara.com/sitemap.xml',
  }
}
