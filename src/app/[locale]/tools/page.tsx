import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { generateToolsListMetadata } from '@/lib/seo';
import ToolsPageClient from './ToolsPageClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const t = await getTranslations({ locale: validLocale, namespace: 'metadata' });

  // Base metadata generate karo
  const metadata = await generateToolsListMetadata(validLocale, {
    title: t('tools.title'),
    description: t('tools.description'),
  });

  // ✅ MASTER SEO FIX: Is specific page ke liye Canonical aur Alternates pakke karo
  return {
    ...metadata,
    alternates: {
      // Is page ka asli URL (Slash ke saath)
      canonical: `https://www.pdftara.com/${validLocale}/tools/`,
      // Saari languages ke liye alternate links (Hreflang - Sab slash ke saath)
      languages: Object.fromEntries(
        locales.map((l) => [l, `https://www.pdftara.com/${l}/tools/`])
      ),
    },
  };
}

interface ToolsPageProps {
  params: Promise<{ locale: string }>;
}

function ToolsPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-[hsl(var(--color-muted-foreground))]">
        Loading...
      </div>
    </div>
  );
}

export default async function ToolsPage({ params }: ToolsPageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Get localized content for tools
  const { tools } = await import('@/config/tools');
  const { getToolContent } = await import('@/config/tool-content');

  const localizedToolContent = tools.reduce((acc, tool) => {
    const content = getToolContent(locale as Locale, tool.id);
    if (content) {
      acc[tool.id] = {
        title: content.title,
        description: content.metaDescription
      };
    }
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

  return (
    <Suspense fallback={<ToolsPageFallback />}>
      <ToolsPageClient locale={locale as Locale} localizedToolContent={localizedToolContent} />
    </Suspense>
  );
}
