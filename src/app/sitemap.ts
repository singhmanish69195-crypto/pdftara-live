/**
 * PDFTARA SITEMAP - VERSION 8.0 (THE FINAL FIX)
 * Purpose: Sync with 'trailingSlash: false' & 'localePrefix: as-needed'
 * FIX: Removed /en/ from default links and stripped trailing slashes.
 */

import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gqyqmhgannypuracasdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxeXFtaGdhbm55cHVyYWNhc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzkwMDYsImV4cCI6MjA4NDc1NTAwNn0.8dlJNPu6jjQt4vcQiaWfypFuB8fSBpv0F3yI1VkMQE4';

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

/**
 * 🔥 FIX: Smart URL Builder
 * 1. Default Locale (en) ke liye path mein '/en' nahi jodega.
 * 2. Aakhir mein '/' (slash) kabhi nahi lagayega.
 */
const buildUrl = (locale: string, path: string) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  const localeSegment = locale === 'en' ? '' : `/${locale}`;
  const pathSegment = cleanPath ? `/${cleanPath}` : '';
  
  // Example: pdftara.com/about (for en) OR pdftara.com/ja/about (for ja)
  return `${BASE_URL}${localeSegment}${pathSegment}`;
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
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, buildUrl(l, page.path)])),
            'x-default': buildUrl('en', page.path),
          },
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
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, buildUrl(l, toolField)])),
            'x-default': buildUrl('en', toolField),
          },
        },
      });
    }
  }

  // PHASE 3: DYNAMIC BLOG POSTS
  const { data: posts, error } = await supabase.from('posts').select('slug'); 

  if (!error && posts) {
    for (const post of posts) {
      if (!post.slug) continue; 
      for (const locale of locales) {
        const blogField = `blog/${post.slug}`;
        allEntries.push({
          url: buildUrl(locale, blogField),
          lastModified,
          changeFrequency: 'daily',
          priority: PRIORITY.blogPost,
          alternates: {
            languages: {
              ...Object.fromEntries(locales.map((l) => [l, buildUrl(l, blogField)])),
              'x-default': buildUrl('en', blogField),
            },
          },
        });
      }
    }
  }

  return allEntries;
}
