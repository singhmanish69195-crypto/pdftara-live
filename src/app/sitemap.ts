/**
 * Sitemap Generation
 * Generates sitemap.xml for all pages across all locales shamil karte hue articles
 */

import { MetadataRoute } from 'next';
import { locales, type Locale } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';

// Static export ke liye zaroori hai
export const dynamic = 'force-static';

/**
 * APNA ASLI DOMAIN
 */
const BASE_URL = 'https://www.pdftara.com';

/**
 * Priority values
 */
const PRIORITY = {
  home: 1.0,
  tools: 0.9,
  toolPage: 0.8,
  blogPost: 0.9, // Articles ko high priority di hai ranking ke liye
  blogHome: 0.7,
  static: 0.5,
} as const;

/**
 * Change frequency
 */
const CHANGE_FREQUENCY = {
  home: 'daily',
  tools: 'weekly',
  toolPage: 'weekly',
  blogPost: 'daily', 
  static: 'monthly',
} as const;

/**
 * Static pages across all locales
 */
const STATIC_PAGES = [
  { path: '', priority: PRIORITY.home, changeFrequency: CHANGE_FREQUENCY.home },
  { path: '/tools', priority: PRIORITY.tools, changeFrequency: CHANGE_FREQUENCY.tools },
  { path: '/blog', priority: PRIORITY.blogHome, changeFrequency: CHANGE_FREQUENCY.home },
  { path: '/about', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/faq', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/contact', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/privacy', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/terms', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
  { path: '/disclaimer', priority: PRIORITY.static, changeFrequency: CHANGE_FREQUENCY.static },
];

/**
 * YAHAN APNE BLOG ARTICLES KE NAAM (SLUGS) DALO
 * Jaise: how-to-merge-pdf-files-offline
 */
const BLOG_POSTS = [
  'how-to-merge-pdf-files-offline',
  'best-free-pdf-tools-2026',
  'secure-way-to-edit-pdf-online',
  // Naye blog ka naam yahan add karte rehna...
];

/**
 * Generate sitemap entries for a specific locale
 */
function generateLocaleEntries(locale: Locale, lastModified: Date): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  
  // 1. Add static pages (Jaise: /en/blog)
  for (const page of STATIC_PAGES) {
    entries.push({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified,
      changeFrequency: page.changeFrequency as any,
      priority: page.priority,
    });
  }
  
  // 2. Add individual tool pages (Jaise: /en/tools/merge-pdf)
  const tools = getAllTools();
  for (const tool of tools) {
    entries.push({
      url: `${BASE_URL}/${locale}/tools/${tool.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: PRIORITY.toolPage,
    });
  }

  // 3. Add Individual Blog Articles (Jaise: /en/blog/how-to-merge-pdf)
  for (const postSlug of BLOG_POSTS) {
    entries.push({
      url: `${BASE_URL}/${locale}/blog/${postSlug}`,
      lastModified,
      changeFrequency: 'daily',
      priority: PRIORITY.blogPost,
    });
  }
  
  return entries;
}

/**
 * Generate the complete sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];
  
  // Har ek language ke liye links generate honge
  for (const locale of locales) {
    const localeEntries = generateLocaleEntries(locale as Locale, lastModified);
    allEntries.push(...localeEntries);
  }
  
  return allEntries;
}

/**
 * Get total number of URLs
 */
export function getSitemapUrlCount(): number {
  const toolsCount = getAllTools().length;
  return (STATIC_PAGES.length + toolsCount + BLOG_POSTS.length) * locales.length;
}
