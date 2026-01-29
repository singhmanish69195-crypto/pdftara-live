import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { localeConfig, type Locale, locales } from '@/lib/i18n/config';
import { generateHomeMetadata } from '@/lib/seo';
import { fontVariables } from '@/lib/fonts';
import { SkipLink } from '@/components/common/SkipLink';
import '@/app/globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  const metadata = await generateHomeMetadata(validLocale);

  // --- 🌍 MULTI-LANGUAGE SEO ENGINE (9 Languages) ---
  const seoData: Record<string, { title: string; desc: string }> = {
    en: { title: "Free PDF Editor & Tools (2026) - No Watermark, No Signup", desc: "The #1 Free PDF Toolkit. Merge, Split, Compress & Edit PDFs entirely in your browser. 100% Private, No Watermark, No Sign-up." },
    hi: { title: "फ्री PDF एडिटर और टूल्स (2026) - बिना वॉटरमार्क, कोई साइनअप नहीं", desc: "नंबर 1 फ्री पीडीएफ टूलकिट। ब्राउज़र में पीडीएफ मर्ज, स्प्लिट, कंप्रेस और एडिट करें। 100% सुरक्षित और मुफ्त।" },
    ja: { title: "無料PDFエディター＆ツール (2026) - ウォーターマークなし、登録不要", desc: "ナンバーワンの無料PDFツールキット。ブラウザでPDFの結合、分割、圧縮、編集。100%プライベート。" },
    ko: { title: "무료 PDF 편집기 및 도구 (2026) - 워터마크 없음, 가입 없음", desc: "최고의 무료 PDF 도구 모음. 브라우저에서 바로 PDF 병합, 분할, 압축 및 편집. 100% 안전." },
    es: { title: "Editor de PDF gratuito y herramientas (2026) - Sin marca de agua", desc: "El kit de herramientas PDF gratuito n.º 1. Combine, divida, comprima y edite archivos PDF. 100% privado." },
    fr: { title: "Éditeur PDF gratuit et outils (2026) - Sans filigrane", desc: "La boîte d'outils PDF gratuite n°1. Fusionnez, divisez, compressez et modifiez des PDF. 100 % privé." },
    de: { title: "Kostenloser PDF-Editor & Tools (2026) - Ohne Wasserzeichen", desc: "Das PDF-Toolkit Nr. 1. PDFs im Browser zusammenführen, teilen, komprimieren und bearbeiten. 100 % privat." },
    zh: { title: "免费 PDF 编辑器和工具 (2026) - 无水印，无需注册", desc: "排名第一的免费 PDF 工具包。在浏览器中合并、拆分、压缩和编辑 PDF。100% 私密。" },
    pt: { title: "Editor de PDF Gratuito e Ferramentas (2026) - Sem Marca d'Água", desc: "O kit de ferramentas PDF gratuito nº 1. Mescle, divida, comprima e edite PDFs no navegador. 100% privado." }
  };

  const currentSeo = seoData[validLocale] || seoData['en'];

  return {
    ...metadata,
    metadataBase: new URL('https://www.pdftara.com/'),
    title: {
      default: `${currentSeo.title} | PDFTara`,
      template: `%s | PDFTara - Free PDF Tools (2026)`, 
    },
    description: currentSeo.desc,
    
    // HREFLANG TAGS: Google ko batane ke liye ki site multi-language hai
    alternates: {
      canonical: `https://www.pdftara.com/${validLocale}`,
      languages: locales.reduce((acc, l) => {
        acc[l] = `https://www.pdftara.com/${l}`;
        return acc;
      }, {} as Record<string, string>),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    openGraph: {
      ...metadata.openGraph,
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://www.pdftara.com/${validLocale}`,
      siteName: 'PDFTara',
      images: [{ url: '/og-image-home.jpg', width: 1200, height: 630 }]
    }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const direction = localeConfig[locale as Locale]?.direction || 'ltr';

  // --- ⭐⭐⭐⭐⭐ 5-STAR RATING SCHEMA ---
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'PDFTara Free PDF Tools',
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Web, Windows, macOS, Android, iOS',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'ratingCount': '18540',
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale} dir={direction} className={fontVariables}>
        <head>
           <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </head>
        <body className="min-h-screen bg-background text-foreground antialiased font-sans">
          <SkipLink targetId="main-content">Skip to main content</SkipLink>
          <main id="main-content">{children}</main>
        </body>
      </html>
    </NextIntlClientProvider>
  );
}