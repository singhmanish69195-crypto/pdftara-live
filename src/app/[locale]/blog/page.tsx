import Link from "next/link";
import posts from "@/data/posts.json";
import { Header } from "@/components/layout/Header"; // Header import add kiya (zaroori hai)
import { Footer } from "@/components/layout/Footer"; 
import { type Locale } from '@/lib/i18n/config';

// Helper function: Reading time calculate karne ke liye
function getReadingTime(content: string) {
  if (!content) return "1 min read"; // Safety check
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export default async function BlogHome({ params }: { params: Promise<{ locale: string }> }) {
  
  const { locale } = await params;
  const currentLocale = locale as Locale;
  
  // --- FIX: TypeScript Error Solution ---
  // Yahan humne code ko bola: "Bhai posts ko any[] maan le, check mat kar"
  const safePosts = (posts || []) as any[];
  
  // Posts ko naye se purane order mein karna
  const allPosts = safePosts.slice().reverse();
  
  // Pehla post "Featured" hoga, baaki "Grid" mein aayenge
  const featuredPost = allPosts[0];
  const gridPosts = allPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      
      {/* HEADER ADD KIYA - Page structure sahi rahega */}
      <Header locale={currentLocale} />

      <main className="flex-1 py-16 md:py-24 px-6 font-sans selection:bg-blue-100">
        <div className="max-w-7xl mx-auto">
          
          {/* --- HERO SECTION --- */}
          <header className="max-w-5xl mx-auto mb-24 text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               Knowledge Hub
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-8xl font-[1000] text-[#0f172a] leading-[0.95] tracking-tighter mb-8">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                PDF Workflow.
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Expert tutorials, industry insights, and tips to make you 10x more productive with documents.
            </p>
          </header>

          {/* --- FEATURED POST (Hero Section) --- */}
          {featuredPost && (
            <div className="mb-24">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-4">
                  Latest Story <span className="h-[1px] flex-1 bg-slate-200"></span>
               </h3>
               <Link href={`/${locale}/blog/${featuredPost.slug}`} className="group block">
                  <article className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    {/* Featured Image */}
                    <div className="relative h-[400px] lg:h-auto overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                      <img 
                        src={featuredPost.image || "https://placehold.co/1200x630/e2e8f0/1e293b?text=Featured+Article"} 
                        alt={featuredPost.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-8 left-8 z-20">
                        <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Featured Content */}
                    <div className="p-10 lg:p-16 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                        <span className="text-blue-600">{featuredPost.date}</span>
                        <span>•</span>
                        <span>{getReadingTime(featuredPost.content || "")}</span>
                      </div>
                      
                      <h2 className="text-3xl lg:text-5xl font-[900] text-slate-900 leading-[1.1] mb-6 group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="text-slate-500 text-lg leading-relaxed mb-8 line-clamp-3">
                        {(featuredPost.content || "").replace(/<[^>]*>/g, '').substring(0, 200)}...
                      </p>

                      <div className="flex items-center gap-3 mt-auto">
                         <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">👷‍♂️</div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-slate-400">Written by</span>
                            <span className="text-xs font-bold text-slate-900">PDFTara Team</span>
                         </div>
                      </div>
                    </div>
                  </article>
               </Link>
            </div>
          )}

          {/* --- STANDARD GRID (Baaki Articles) --- */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {gridPosts.map((post: any) => (
                <Link href={`/${locale}/blog/${post.slug}`} key={post.slug} className="group flex flex-col h-full">
                  <article className="flex flex-col h-full">
                    
                    {/* Image Card */}
                    <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm mb-8 group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                      <div className="absolute inset-0 bg-slate-900/5 z-10 group-hover:bg-transparent transition-colors"></div>
                      <img 
                        src={post.image || "https://placehold.co/600x400/e2e8f0/1e293b?text=Article"} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                         <span className="bg-white/95 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                           Article
                         </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 px-2">
                      <div className="flex items-center gap-3 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-blue-600">{getReadingTime(post.content || "")}</span>
                      </div>

                      <h2 className="text-2xl font-[900] text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
                        {(post.content || "").replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>

                      <div className="mt-auto flex items-center text-slate-900 font-bold text-xs uppercase tracking-wider group-hover:underline decoration-blue-500 decoration-2 underline-offset-4">
                        Read Article 
                        <svg className="ml-2 w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* --- EMPTY STATE (Jab posts delete ho gaye hon) --- */}
          {allPosts.length === 0 && (
            <div className="text-center py-40 border-4 border-dashed border-slate-100 rounded-[4rem]">
              <p className="text-slate-300 font-black text-4xl italic uppercase">No Posts Yet</p>
              <p className="text-slate-400 mt-2">New content is coming soon.</p>
            </div>
          )}

        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer locale={currentLocale} />
    </div>
  );
}