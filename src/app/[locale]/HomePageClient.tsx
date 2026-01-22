'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  ArrowRight, Zap, Wrench, Lock, Sparkles, Edit, 
  FileImage, FolderOpen, Settings, ShieldCheck, 
  Star, CheckCircle2, HelpCircle, LayoutDashboard,
  ShieldAlert, MousePointer2
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAllTools, getToolsByCategory, getPopularTools } from '@/config/tools';
import { type Locale } from '@/lib/i18n/config';
import { type ToolCategory } from '@/types/tool';

interface HomePageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

export default function HomePageClient({ locale, localizedToolContent }: HomePageClientProps) {
  const t = useTranslations();
  const allTools = getAllTools();
  const popularTools = getPopularTools();

  const features = [
    {
      icon: ShieldCheck,
      titleKey: 'home.features.privacy.title',
      descriptionKey: 'home.features.privacy.description',
      color: 'text-green-500',
    },
    {
      icon: Zap,
      titleKey: 'home.features.free.title',
      descriptionKey: 'home.features.free.description',
      color: 'text-yellow-500',
    },
    {
      icon: Wrench,
      titleKey: 'home.features.powerful.title',
      descriptionKey: 'home.features.powerful.description',
      color: 'text-blue-500',
    },
  ];

  const categoryIcons: Record<ToolCategory, typeof Edit> = {
    'edit-annotate': Edit,
    'convert-to-pdf': FileImage,
    'convert-from-pdf': FileImage,
    'organize-manage': FolderOpen,
    'optimize-repair': Settings,
    'secure-pdf': ShieldCheck,
  };

  const categoryTranslationKeys: Record<ToolCategory, string> = {
    'edit-annotate': 'editAnnotate',
    'convert-to-pdf': 'convertToPdf',
    'convert-from-pdf': 'convertFromPdf',
    'organize-manage': 'organizeManage',
    'optimize-repair': 'optimizeRepair',
    'secure-pdf': 'securePdf',
  };

  const categoryOrder: ToolCategory[] = [
    'edit-annotate',
    'convert-to-pdf',
    'convert-from-pdf',
    'organize-manage',
    'optimize-repair',
    'secure-pdf',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(var(--color-background))]">
      <Header locale={locale} />

      <main id="main-content" className="flex-1 relative outline-none" tabIndex={-1}>
        {/* --- MODERN HERO SECTION --- */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-36 overflow-hidden">
          {/* Advanced Mesh Gradient Background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 rounded-full blur-3xl opacity-60" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-ping" />
              <span className="text-xs font-semibold tracking-wide uppercase text-gray-600 dark:text-gray-300">
                100% Private • No Files Uploaded
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              {t('home.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 pb-2">
                {t('home.hero.highlight')}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')} — fast, secure, and works entirely in your browser.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={`/${locale}/tools`}>
                <Button variant="primary" size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
                <ShieldAlert className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Safe for enterprise</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION (SEO CONTENT) --- */}
        <section className="py-20 bg-gray-50/50 dark:bg-gray-900/20 border-y border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How PDFTara Works?</h2>
              <p className="text-gray-500">Processing PDFs has never been this secure and easy.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: MousePointer2, title: "1. Select Tool", desc: "Choose from 20+ professional PDF tools like Merge, Split, or Edit." },
                { icon: LayoutDashboard, title: "2. Process Local", desc: "Your files are processed in your browser. They never touch our servers." },
                { icon: CheckCircle2, title: "3. Save Result", desc: "Download your processed PDF instantly with 100% original quality." }
              ].map((step, i) => (
                <div key={i} className="relative text-center group">
                  <div className="mx-auto w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:-translate-y-2 transition-transform">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Tools */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold border border-blue-100 dark:border-blue-800">
                <Star className="h-4 w-4 fill-current" />
                {t('home.popularTools.badge')}
              </div>
              <h2 className="text-4xl font-bold mb-4">{t('home.popularTools.title')}</h2>
              <p className="text-gray-500 max-w-xl mx-auto">{t('home.popularTools.description')}</p>
            </div>
            <ToolGrid tools={popularTools} locale={locale} localizedToolContent={localizedToolContent} />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 text-center md:text-left">
              <div>
                <h2 className="text-4xl font-bold mb-3">{t('home.categoriesSection.title')}</h2>
                <p className="text-gray-500">{t('home.categoriesSection.description', { count: allTools.length })}</p>
              </div>
              <Link href={`/${locale}/tools`}>
                <Button variant="outline" className="rounded-xl px-8 h-12 hover:bg-blue-600 hover:text-white transition-all">
                  Browse All Tools
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryOrder.map((category) => {
                const categoryTools = getToolsByCategory(category);
                const Icon = categoryIcons[category];
                return (
                  <Link key={category} href={`/${locale}/tools?category=${category}`} className="group">
                    <Card className="p-8 h-full bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-blue-500/50 transition-all rounded-3xl">
                      <div className="flex flex-col h-full">
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="h-7 w-7 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                          {t(`home.categories.${categoryTranslationKeys[category]}`)}
                        </h3>
                        <p className="text-gray-500 text-sm flex-grow mb-6">
                          {t(`home.categoriesDescription.${categoryTranslationKeys[category]}`)}
                        </p>
                        <div className="text-sm font-bold text-blue-600 flex items-center gap-1">
                          {categoryTools.length} Tools Available <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 border-t border-gray-100 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Pro Tools", val: allTools.length + "+" },
                { label: "Cost", val: "FREE" },
                { label: "Languages", val: "9+" },
                { label: "Privacy", val: "100%" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-extrabold text-blue-600 mb-2">{stat.val}</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}