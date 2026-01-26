/**
 * Sitemap Generation with Supabase Integration
 * Purpose: Generates a dynamic sitemap.xml with multi-language support.
 * Fix: Forces trailing slashes on all URLs to eliminate GSC redirect errors.
 * Author: PDFTara Dev Team
 */

import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { createClient } from '@supabase/supabase-js';

// 1. SUPABASE DATABASE CONFIGURATION
// These keys allow the sitemap to fetch live blog slugs dynamically.
const supabaseUrl = 'https://gqyqmhgannypuracasdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeXFtaGdhbm55cHVyYWNhc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzkwMDYsImV4cCI6MjA4NDc1NTAwNn0.8dlJNPu6jjQt4vcQiaWfypFuB8fSBpv0F3yI1VkMQE4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sitemap revalidation interval set to 1 hour (3600 seconds)
export const revalidate = 3600; 

// Base Production URL
const BASE_URL = 'https://www.pdftara.com/';

/**
 * SEO PRIORITY CONFIGURATION
 * Helps search engines understand the importance of different pages.
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
 * STATIC PAGES LIST
 * All non-dynamic pages that exist across all supported locales.
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
 * CRITICAL HELPER: buildUrl
 * Ensures every generated URL ends with a trailing slash (/).
 * This must match next.config.js trailingSlash: true to stop redirects.
 */
const buildUrl = (locale: string, path: string) => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const normalizedPath = cleanPath ? `${cleanPath}/` : '';
  return `${BASE_URL}/${locale}/${normalizedPath}`;
};

/**
 * CORE SITEMAP GENERATOR
 * Fetches dynamic data and constructs the final sitemap array.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  // PHASE 1: GENERATE ENTRIES FOR STATIC PAGES
  // Iterates through static pages for every active locale.
  for (const page of STATIC_PAGES) {
    for (const locale of locales) {
      const finalUrl = buildUrl(locale, page.path);
      allEntries.push({
        url: finalUrl,
        lastModified,
        changeFrequency: page.changeFreq as any,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, buildUrl(l, page.path)])
          ),
        },
      });
    }
  }

  // PHASE 2: GENERATE ENTRIES FOR PDF TOOLS
  // Fetches tool metadata and maps them to localized URLs.
  const tools = getAllTools();
  for (const tool of tools) {
    for (const locale of locales) {
      const toolField = `/tools/${tool.slug}`;
      const finalToolUrl = buildUrl(locale, toolField);
      allEntries.push({
        url: finalToolUrl,
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

  // PHASE 3: GENERATE ENTRIES FOR BLOG POSTS (SUPABASE)
  // Only fetches posts with 'published' status to avoid 404 errors.
  const { data: posts, error } = await supabase
    .from('posts') 
    .select('slug, updated_at')
    .eq('status', 'published');

  if (posts && !error) {
    for (const post of posts) {
      for (const locale of locales) {
        const blogField = `/blog/${post.slug}`;
        const finalBlogUrl = buildUrl(locale, blogField);
        allEntries.push({
          url: finalBlogUrl,
          lastModified: post.updated_at ? new Date(post.updated_at) : lastModified,
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
  }

  // RETURN FINALIZED SITEMAP ARRAY TO NEXT.JS
  // This array is automatically converted to sitemap.xml by the framework.
  return allEntries;
}

/**
 * SITEMAP STATISTICS HELPER
 * Returns the total count of localized URLs present in the current build.
 */
export function getSitemapUrlCount(): number {
  const toolsCount = getAllTools().length;
  const baseCount = STATIC_PAGES.length + toolsCount;
  return baseCount * locales.length;
}