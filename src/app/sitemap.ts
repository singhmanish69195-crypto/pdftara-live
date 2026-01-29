/**
 * Sitemap Generation with Supabase Integration - VERSION 3.1
 * Purpose: Generates a dynamic sitemap.xml with multi-language support.
 * 
 * FIX LOG: 
 * 1. Removed 'status' filter because the column does not exist in the database.
 * 2. Optimized Supabase fetch to ensure blog posts appear in sitemap.xml.
 */

import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { createClient } from '@supabase/supabase-js';

/**
 * 1. SUPABASE DATABASE CONFIGURATION
 */
const supabaseUrl = 'https://gqyqmhgannypuracasdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeXFtaGdhbm55cHVyYWNhc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzkwMDYsImV4cCI6MjA4NDc1NTAwNn0.8dlJNPu6jjQt4vcQiaWfypFuB8fSBpv0F3yI1VkMQE4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * CACHE SETTINGS
 */
export const revalidate = 3600; 

/**
 * BASE PRODUCTION URL
 */
const BASE_URL = 'https://www.pdftara.com';

/**
 * SEO PRIORITY CONFIGURATION
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
 * STATIC PAGES REGISTRY
 */
const STATIC_PAGES = [
  { path: '', priority: PRIORITY.home, changeFreq: 'daily' },
  { path: 'tools', priority: PRIORITY.tools, changeFreq: 'weekly' },
  { path: 'blog', priority: PRIORITY.blogHome, changeFreq: 'daily' },
  { path: 'about', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: 'faq', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: 'contact', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: 'privacy', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: 'terms', priority: PRIORITY.static, changeFreq: 'monthly' },
  { path: 'disclaimer', priority: PRIORITY.static, changeFreq: 'monthly' },
];

/**
 * CRITICAL HELPER: buildUrl
 */
const buildUrl = (locale: string, path: string) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const segment = cleanPath ? `${cleanPath}/` : '';
  return `${BASE_URL}/${locale}/${segment}`;
};

/**
 * CORE SITEMAP GENERATOR
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  /**
   * PHASE 1: STATIC PAGES
   */
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

  /**
   * PHASE 2: PDF TOOLS PAGES
   */
  const tools = getAllTools();
  for (const tool of tools) {
    for (const locale of locales) {
      const toolField = `tools/${tool.slug}`;
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

  /**
   * PHASE 3: BLOG POSTS (FIXED FETCH)
   * Removed 'status' filter because column is missing in DB.
   */
  const { data: posts, error } = await supabase
    .from('posts') 
    .select('slug'); // Sirf slug fetch kar rahe hain kyunki Dashboard mein wahi dikh raha hai.

  if (posts && !error) {
    for (const post of posts) {
      for (const locale of locales) {
        const blogField = `blog/${post.slug}`;
        const finalBlogUrl = buildUrl(locale, blogField);
        allEntries.push({
          url: finalBlogUrl,
          lastModified, // Default modified date
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

  return allEntries;
}

export function getSitemapUrlCount(): number {
  const toolsCount = getAllTools().length;
  const baseCount = STATIC_PAGES.length + toolsCount;
  return baseCount * locales.length;
}

/**
 * -------------------------------------------------------------------------
 * END OF SITEMAP FILE
 * -------------------------------------------------------------------------
 */