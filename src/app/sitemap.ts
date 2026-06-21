/**
 * PDFTARA SITEMAP - VERSION 7.0 (PERFORMANCE & SEO FIX)
 * Purpose: Fix "Temporary processing error" and ensure all 14 languages are linked.
 */

import { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getAllTools } from '@/config/tools';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qsyesrmjddqcsledxtva.supabase.co';
const supabaseAnonKey = 'sb_publishable_uhzhKdRqKdB5gcXdnxgFsg_tsP875JG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 🔥 FIX: force-dynamic ki jagah revalidate use karein (Har 1 ghante mein update hoga)
// Isse Google ko sitemap turant milega bina kisi error ke.
export const revalidate = 3600; 

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
  return cleanPath ? `${BASE_URL}/${locale}/${cleanPath}` : `${BASE_URL}/${locale}`;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const allEntries: MetadataRoute.Sitemap = [];

  // PHASE 1: STATIC PAGES (Home, Tools, Contact etc.)
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

  // PHASE 2: TOOLS (PDF Converter, Split etc.)
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
