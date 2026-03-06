/**
 * PDFTARA SITEMAP - VERSION 6.0 (BULLETPROOF FIX)
 * Purpose: Instant Auto-Indexing & Multi-Language SEO
 * FIX: Removed missing columns (updated_at, created_at) to prevent crashes.
 */

import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { createClient } from '@supabase/supabase-js';

// --- 1. SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://gqyqmhgannypuracasdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeXFtaGdhbm55cHVyYWNhc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzkwMDYsImV4cCI6MjA4NDc1NTAwNn0.8dlJNPu6jjQt4vcQiaWfypFuB8fSBpv0F3yI1VkMQE4';

/**
 * 🔥 FIX 1: BYPASS NEXT.JS FETCH CACHE
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => {
      return fetch(url, { ...options, cache: 'no-store' }); 
    },
  },
});

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

const BASE_URL = 'https://www.pdftara.com';

const PRIORITY = {
  home: 1.0,
  tools: 0.9,
  toolPage: 0.8,
  blogPost: 0.9, 
  blogHome: 0.7,
  static: 0.5,
} as const;

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

const buildUrl = (locale: string, path: string) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const segment = cleanPath ? `${cleanPath}/` : '';
  return `${BASE_URL}/${locale}/${segment}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  // PHASE 1: STATIC PAGES
  for (const page of STATIC_PAGES) {
    for (const locale of locales) {
      allEntries.push({
        url: buildUrl(locale, page.path),
        lastModified,
        changeFrequency: page.changeFreq as any,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, buildUrl(l, page.path)])),
        },
      });
    }
  }

  // PHASE 2: TOOLS
  const tools = getAllTools();
  for (const tool of tools) {
    for (const locale of locales) {
      const toolField = `tools/${tool.slug}`;
      allEntries.push({
        url: buildUrl(locale, toolField),
        lastModified,
        changeFrequency: 'weekly',
        priority: PRIORITY.toolPage,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, buildUrl(l, toolField)])),
        },
      });
    }
  }

  // PHASE 3: DYNAMIC BLOG POSTS
  // 🔥 FIX: Ab sirf 'slug' mang rahe hain taaki koi column missing ka error na aaye
  const { data: posts, error } = await supabase
    .from('posts') 
    .select('slug'); 

  if (error) {
    console.error("❌ SITEMAP SUPABASE ERROR:", error.message);
  }

  if (posts && posts.length > 0) {
    for (const post of posts) {
      
      if (!post.slug) continue; 

      for (const locale of locales) {
        const blogField = `blog/${post.slug}`;
        allEntries.push({
          url: buildUrl(locale, blogField),
          lastModified: lastModified, // Directly using current date
          changeFrequency: 'daily',
          priority: PRIORITY.blogPost,
          alternates: {
            languages: Object.fromEntries(locales.map((l) => [l, buildUrl(l, blogField)])),
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
