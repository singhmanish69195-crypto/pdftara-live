/**
 * PDFTARA ROBOTS CONFIGURATION - VERSION 2.0
 * 🏆 Purpose: Ultimate SEO Crawling & Indexing Optimization
 * This file ensures Google finds all blog posts and tools while blocking scrapers.
 */

import { MetadataRoute } from 'next';

// Performance fix: Next.js will build this file once at build time
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Sabhi Search Engines (Google, Bing, etc.) ke liye
        userAgent: '*',
        allow: [
          '/', 
          '/_next/static/', 
          '/favicon.ico',
          '/en/blog/', // Explicitly allowing blog for faster discovery
          '/tools/',   // Explicitly allowing tools
        ],
        disallow: [
          '/api/',     // API hide karna security ke liye zaroori hai
          '/admin/',   // Admin panel block
          '/*?*',      // Search parameters block taaki crawl budget waste na ho
        ],
      },
      {
        // AI Bots ko block kar rahe hain taaki tera content chori na ho
        userAgent: ['GPTBot', 'CCBot', 'ChatGPT-User', 'anthropic-ai'],
        disallow: ['/'],
      }
    ],
    // Asli HTTPS domain ke saath sitemap ka rasta
    sitemap: 'https://www.pdftara.com/sitemap.xml',
  };
}