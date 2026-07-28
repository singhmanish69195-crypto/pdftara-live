import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { localeConfig, type Locale, locales } from '@/lib/i18n/config';
import { generateHomeMetadata } from '@/lib/seo';
import { fontVariables } from '@/lib/fonts';
import { SkipLink } from '@/components/common/SkipLink';
import { GoogleScripts } from '@/components/GoogleScripts'; 

// CSS Path fix
import '../globals.css';

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

  const seoData: Record<string, { title: string; desc: string }> = {
    en: { title: "PDFTara - Free Private PDF Tools", desc: "Merge, split and compress PDFs securely in your browser." },
    hi: { title: "PDFTara - फ्री प्राइवेट PDF टूल्स", desc: "ब्राउज़र में सुरक्षित रूप से PDF मर्ज और कंप्रेस करें।" },
    ja: { title: "PDFTara - 無料のプライベートPDFツール", desc: "ブラウザでPDFを安全に結合、分割、圧縮します।" },
    ko: { title: "PDFTara - 무료 개인용 PDF 도구", desc: "브라우저에서 안전하게 PDF를 병합, 분할 및 압축하세요." },
    es: { title: "PDFTara - Herramientas PDF gratuitas", desc: "Combine y comprima PDF de forma segura en su navegador." },
    fr: { title: "PDFTara - Outils PDF gratuits et privés", desc: "Fusionnez et compressez des PDF en toute segurança." },
    de: { title: "PDFTara - Kostenlose PDF-Tools", desc: "PDFs sicher im Browser zusammenführen und komprimieren." },
    zh: { title: "PDFTara - 免费私密 PDF 工具", desc: "在浏览器中安全地合并、拆分 और壓縮 PDF।" },
    pt: { title: "PDFTara - Ferramentas PDF Gratuitas", desc: "Mescle e comprimi PDFs com segurança no seu navegador." },
    ar: { title: "PDFTara - أدوات PDF مجانية", desc: "دمج وضغط ملفات PDF بأمان في متصفحك." },
    it: { title: "PDFTara - Strumenti PDF gratuiti", desc: "Unisci e comprimi PDF in modo sicuro nel tuo browser." },
    ro: { title: "PDFTara - Instrumente PDF gratuite", desc: "Combinați și comprimați PDF-urile în siguranță." },
    vi: { title: "PDFTara - Công cụ PDF miễn phí", desc: "Ghép và nén PDF an toàn ngay trên trình duyệt." },
    "zh-TW": { title: "PDFTara - 免費私密 PDF 工具", desc: "在瀏覽器中安全地合併、拆分และ壓縮 PDF।" }
  };

  const currentSeo = seoData[validLocale] || seoData['en'];

  return {
    ...metadata,
    metadataBase: new URL('https://www.pdftara.com/'),
    title: { default: currentSeo.title, template: `%s` }, 
    description: currentSeo.desc,
    alternates: {
      // ✅ FIX: Layout mein sirf locale base canonical rakho. 
      // Individual tool pages apne 'page.tsx' mein apna full canonical URL override karenge.
      canonical: `https://www.pdftara.com/${validLocale}/`,
      languages: locales.reduce((acc, l) => { 
        acc[l] = `https://www.pdftara.com/${l}/`; 
        return acc; 
      }, {} as Record<string, string>),
    },
    verification: {
      google: 'ca-pub-4129411618696895',
      other: {
        'msvalidate.01': 'BING_VERIFICATION_CODE', 
        'naver-site-verification': 'a7f730f5caea31ec4ce5bcb4ebc46ea1a51d1f5a',
      },
    },
    robots: { 
      index: true, 
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      }
    },
    openGraph: {
      ...metadata.openGraph,
      title: currentSeo.title,
      description: currentSeo.desc,
      url: `https://www.pdftara.com/${validLocale}/`,
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

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'PDFTara Free PDF Tools',
    'url': 'https://www.pdftara.com/',
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Web, Windows, macOS, Android, iOS',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'aggregateRating': { '@type': 'AggregateRating', 'ratingValue': '4.9', 'ratingCount': '18540', 'bestRating': '5', 'worstRating': '1' }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'PDFTara',
    'url': 'https://www.pdftara.com/',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://www.pdftara.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang={locale} dir={direction} className={fontVariables} suppressHydrationWarning>
      <head>
        {/* WASM Fix - All multithreading support */}
        <script src="/coi-serviceworker.js"></script>
        
        {/* Google AdSense - Global */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4129411618696895"
          crossOrigin="anonymous"
        ></script>

        {/* SEO Verifications */}
        <meta name="naver-site-verification" content="a7f730f5caea31ec4ce5bcb4ebc46ea1a51d1f5a" />
        <meta name="google-adsense-account" content="ca-pub-4129411618696895" />
        <meta name="msvalidate.01" content="BING_VERIFICATION_CODE" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <GoogleScripts />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SkipLink targetId="main-content">Skip to main content</SkipLink>
          <div className="relative flex min-h-screen flex-col">
            {/* Main content wrapper */}
            <main id="main-content" className="flex-1">
              {children}
            </main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
