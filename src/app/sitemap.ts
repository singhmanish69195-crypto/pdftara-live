/**
 * PDFTARA SITEMAP - VERSION 9.0 (GOD MODE FIX)
 * Purpose: 100% Sync with 'as-needed' locale and NO trailing slashes.
 * FIX: Forces clean URLs and prevents Vercel caching issues.
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

// 🔥 Sabse Zaruri Settings: Cache bilkul band
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

const BASE_URL = 'https://www.pdftara.com';

const STATIC_PAGES = [
  { path: '', priority: 1.0, changeFreq: 'daily' },
  { path: 'tools', priority: 0.9, changeFreq: 'weekly' },
  { path: 'blog', priority: 0.8, changeFreq: 'daily' },
  { path: 'about', priority: 0.5, changeFreq: 'monthly' },
  { path: 'faq', priority: 0.5, changeFreq: 'monthly' },
  { path: 'contact', priority: 0.5, changeFreq: 'monthly' },
  { path: 'privacy', priority: 0.5, changeFreq: 'monthly' },
  { path: 'terms', priority: 0.5, changeFreq: 'monthly' },
  { path: 'disclaimer', priority: 0.5, changeFreq: 'monthly' },
];

/**
 * 🔥 SUPER CLEAN URL BUILDER
 * 1. English (en) locale ke liye /en ko bilkul gayab kar dega.
 * 2. Aakhir se '/' (slash) ko 100% nikaal dega.
 */
const buildUrl = (locale: string, path: string) => {
  const cleanPath = path.replace(/^\/+|\/+$/g, ''); // Path se aage peeche ke slash hatao
  const localeSegment = locale === 'en' ? '' : `/${locale}`;
  const pathSegment = cleanPath ? `/${cleanPath}` : '';
  
  const finalUrl = `${BASE_URL}${localeSegment}${pathSegment}`;
  return finalUrl.replace(/\/+$/, ""); // Ensure no trailing slash at the very end
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  // 1. STATIC PAGES
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

  // 2. TOOLS
  const tools = getAllTools();
  for (const tool of tools) {
    for (const locale of locales) {
      const toolField = `tools/${tool.slug}`;
      allEntries.push({
        url: buildUrl(locale, toolField),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, buildUrl(l, toolField)])),
            'x-default': buildUrl('en', toolField),
          },
        },
      });
    }
  }

  // 3. BLOG POSTS (Dynamic)
  const { data: posts } = await supabase.from('posts').select('slug'); 

  if (posts) {
    for (const post of posts) {
      if (!post.slug) continue; 
      for (const locale of locales) {
        const blogField = `blog/${post.slug}`;
        allEntries.push({
          url: buildUrl(locale, blogField),
          lastModified,
          changeFrequency: 'daily',
          priority: 0.9,
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
