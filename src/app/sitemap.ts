/**
 * Sitemap Generation
 * Generates sitemap.xml with alternate language links for SEO optimization
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
  blogPost: 0.9,
  blogHome: 0.7,
  static: 0.5,
} as const;

/**
 * Static pages across all locales
 */
const STATIC_PAGES = [
  { path: '', priority: PRIORITY.home, changeFreq: 'daily' },
  { path: '/tools', priority: PRIORITY.tools, changeFreq: 'weekly' },
  { path: '/blog', priority: PRIORITY.blogHome, changeFreq: 'daily' },
  { path: '/about', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: '/faq', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: '/contact', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: '/privacy', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: '/terms', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: '/disclaimer', priority: PRIORITY.static, changeFreq: 'monthly' },
];

/**
 * BLOG ARTICLES SLUGS
 */
const BLOG_POSTS = [
  'how-to-merge-pdf-files-offline',
  'best-free-pdf-tools-2026',
  'secure-way-to-edit-pdf-online',
];

/**
 * Helper to build URL with trailing slash to avoid 301 redirects
 */
const buildUrl = (locale: string, path: string) => {
  const fullPath = path ? `${path}/` : '/';
  return `${BASE_URL}/${locale}${fullPath}`;
};

/**
 * Generate the complete sitemap with alternates
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  // 1. ADD STATIC PAGES
  for (const page of STATIC_PAGES) {
    for (const locale of locales) {
      allEntries.push({
        url: buildUrl(locale, page.path),
        lastModified,
        changeFrequency: page.changeFreq as any,
        priority: page.priority,
        // Alternate links bata rahe hain Google ko (Hreflang fix)
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, buildUrl(l, page.path)])
          ),
        },
      });
    }
  }

  // 2. ADD TOOL PAGES
  const tools = getAllTools();
  for (const tool of tools) {
    for (const locale of locales) {
      const toolField = `/tools/${tool.slug}`;
      allEntries.push({
        url: buildUrl(locale, toolField),
        lastModified,
        changeFrequency: 'weekly',
        priority: PRIORITY.toolPage,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, buildUrl(l, toolField)])
          ),
        },
      });
    }
  }

  // 3. ADD BLOG POSTS
  for (const postSlug of BLOG_POSTS) {
    for (const locale of locales) {
      const blogField = `/blog/${postSlug}`;
      allEntries.push({
        url: buildUrl(locale, blogField),
        lastModified,
        changeFrequency: 'daily',
        priority: PRIORITY.blogPost,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, buildUrl(l, blogField)])
          ),
        },
      });
    }
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