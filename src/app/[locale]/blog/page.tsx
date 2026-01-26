/**
 * BLOG HOME COMPONENT - PDFTara.com
 * Features: Multi-language Support, Supabase Integration, SEO Optimized
 * Line Count Target: ~180 Lines for full functionality
 */

import Link from "next/link";
import { supabase } from "@/lib/supabase"; 
import { Header } from "@/components/layout/Header"; 
import { Footer } from "@/components/layout/Footer"; 
import { type Locale } from '@/lib/i18n/config';
import type { Metadata } from 'next';

/**
 * SEO METADATA GENERATION
 * Helps Google understand the purpose of this page across all locales.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const domain = 'https://www.pdftara.com';
  
  return {
    title: 'Blog - Professional PDF Tools & Industry Insights | PDFTara.com',
    description: 'Master your PDF workflow with expert tutorials, productivity tips, and secure document processing guides on PDFTara.com.',
    alternates: {
      canonical: `${domain}/${locale}/blog/`,
    },
    openGraph: {
      title: 'PDFTara Blog - Master Your Document Workflow',
      description: 'Expert insights for PDF productivity.',
      url: `${domain}/${locale}/blog/`,
      siteName: 'PDFTara.com',
      images: [{ url: '/og-image.jpg' }],
      type: 'website',
    }
  };
}

/**
 * HELPER: Calculates estimated reading time based on word count.
 */
function getReadingTime(content: string) {
  if (!content) return "1 min read"; 
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

/**
 * HELPER: Formats date string into a human-readable format.
 * Example: January 24, 2026
 */
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * MAIN COMPONENT: BlogHome
 * Handles dynamic data fetching and localized UI rendering.
 */
export default async function BlogHome({ params }: { params: Promise<{ locale: string }> }) {
  
  const { locale } = await params;
  const currentLocale = locale as Locale;
  
  // FETCHING PUBLISHED POSTS FROM SUPABASE
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published') // Only show live posts
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
  }

  const allPosts = posts || [];
  const featuredPost = allPosts[0];
  const gridPosts = allPosts.slice(1);

  // SCHEMA MARKUP FOR GOOGLE INDEXING (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PDFTara Blog',
    description: 'Expert tutorials for PDF tools.',
    publisher: {
      '@type': 'Organization',
      name: 'PDFTara',
      logo: { '@type': 'ImageObject', url: 'https://www.pdftara.com/logo.png' }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      
      {/* Google Ranking Helper Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header locale={currentLocale} />

      <main className="flex-1 py-16 md:py-24 px-6 font-sans selection:bg-blue-100">
        <div className="max-w-7xl mx-auto">
          
          {/* --- HERO SECTION --- */}
          <header className="max-w-5xl mx-auto mb-24 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               Knowledge Hub
            </div>

            <h1 className="text-5xl md:text-8xl font-[1000] text-[#0f172a] leading-[0.95] tracking-tighter mb-8">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                PDF Workflow.
              </span>
            </h1>

            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Expert tutorials, industry insights, and tips to make you 10x more productive with documents.
            </p>
          </header>

          {/* --- FEATURED POST --- */}
          {featuredPost && (
            <div className="mb-24">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-4">
                  Latest Story <span className="h-[1px] flex-1 bg-slate-200"></span>
               </h3>
               {/* Fixed Multi-language Link with Trailing Slash */}
               <Link href={`/${locale}/blog/${featuredPost.slug}/`} className="group block">
                  <article className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                    <div className="relative h-[400px] lg:h-auto overflow-hidden">
                      <img 
                        src={featuredPost.image || "https://www.pdftara.com/og-default.jpg"} 
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-8 left-8 z-20">
                        <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">Featured</span>
                      </div>
                    </div>

                    <div className="p-10 lg:p-16 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                        <span className="text-blue-600">{formatDate(featuredPost.date)}</span>
                        <span>•</span>
                        <span>{getReadingTime(featuredPost.content || "")}</span>
                      </div>
                      <h2 className="text-3xl lg:text-5xl font-[900] text-slate-900 leading-[1.1] mb-6 group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-500 text-lg leading-relaxed mb-8 line-clamp-3 font-medium">
                        {(featuredPost.content || "").replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>
                      {/* READ MORE FEATURE */}
                      <div className="mt-auto flex items-center text-blue-600 font-black uppercase text-xs tracking-widest group-hover:translate-x-3 transition-transform">
                        Read Full Story →
                      </div>
                    </div>
                  </article>
               </Link>
            </div>
          )}

          {/* --- STANDARD GRID --- */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {gridPosts.map((post: any) => (
                <Link href={`/${locale}/blog/${post.slug}/`} key={post.slug} className="group flex flex-col h-full">
                  <article className="flex flex-col h-full bg-white rounded-[2.5rem] p-4 border border-slate-50 hover:border-blue-100 transition-all shadow-sm">
                    <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden mb-8">
                      <img src={post.image || "https://www.pdftara.com/og-default.jpg"} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div className="flex flex-col flex-1 px-4 pb-6">
                      <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{formatDate(post.date)}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-blue-600">{getReadingTime(post.content || "")}</span>
                      </div>
                      <h2 className="text-2xl font-[900] text-slate-900 leading-tight mb-4 group-hover:text-blue-600 line-clamp-2">{post.title}</h2>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                        {(post.content || "").replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      {/* READ MORE CTA */}
                      <div className="mt-auto text-blue-600 font-bold text-xs uppercase tracking-wider group-hover:underline underline-offset-8">
                        Read More →
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* --- EMPTY STATE --- */}
          {allPosts.length === 0 && (
            <div className="text-center py-40 border-4 border-dashed border-slate-100 rounded-[4rem]">
              <p className="text-slate-300 font-black text-4xl italic uppercase tracking-tighter">No Posts Found</p>
            </div>
          )}

        </div>
      </main>

      <Footer locale={currentLocale} />
    </div>
  );
}