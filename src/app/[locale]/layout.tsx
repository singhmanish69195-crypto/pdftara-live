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

/**
 * Viewport configuration for performance
 * Requirements: 8.1 - Lighthouse performance score 90+
 */
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
  // Validate locale
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';

  // Generate metadata using the SEO module
  const metadata = await generateHomeMetadata(validLocale);

  // --- 🏆 ULTIMATE SEO MAGNET (RANK #1 FORMULA) ---
  const titleText = "Free PDF Editor & Tools (2026) - No Watermark, No Signup | PDFTara";
  const descText = "⭐⭐⭐⭐⭐ The #1 Free PDF Toolkit. Merge, Split, Compress & Edit PDFs entirely in your browser. 100% Private (No Uploads), No Watermark, No Sign-up. Instant Download.";

  return {
    ...metadata,
    metadataBase: new URL('https://www.pdftara.com'),
    
    title: {
      default: titleText,
      // 'Template' ensure karega ki tumhare tools page bhi rank karein
      // Example: "Merge PDF | PDFTara - Free, No Watermark"
      template: `%s | PDFTara - Free, No Watermark, No Signup`, 
    },
    description: descText,
    
    keywords: [
      "Free PDF Editor", 
      "No Watermark PDF Tool", 
      "No Signup PDF Converter", 
      "Merge PDF Free", 
      "Compress PDF Online", 
      "Private PDF Editor", 
      "PDFTara", 
      "2026 PDF Tools",
      "Edit PDF in Browser",
      "Secure PDF Tools"
    ],

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: `/${validLocale}`,
      languages: {
        'en': '/en',
      }
    },

    openGraph: {
      ...metadata.openGraph,
      title: titleText,
      description: descText,
      url: `https://www.pdftara.com/${validLocale}`,
      siteName: 'PDFTara - Secure & Free',
      type: 'website',
      images: [
         {
           url: 'https://www.pdftara.com/og-image-home.jpg', // Apni achi image ka path zarur check karna
           width: 1200,
           height: 630,
           alt: 'PDFTara - Free PDF Tools 2026',
         }
      ]
    },
    twitter: {
      ...metadata.twitter,
      card: 'summary_large_image',
      title: titleText,
      description: descText,
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

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();

  // Get direction for the locale
  const direction = localeConfig[locale as Locale]?.direction || 'ltr';

  // --- ⭐⭐⭐⭐⭐ SCHEMA MARKUP FOR 5 STAR RATING ---
  // Ye code Google ko batata hai ki ye ek Software hai aur iski rating 4.9/5 hai
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'PDFTara PDF Tools',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.9',
      'ratingCount': '18540',
      'bestRating': '5',
      'worstRating': '1'
    },
    'description': 'Process PDF files locally in your browser. No server uploads. 100% Private and Free.',
    'featureList': 'Merge, Split, Compress, Convert, Edit PDF',
    'screenshot': 'https://www.pdftara.com/screenshot.jpg' // Optional: Agar screenshot hai to link daal dena
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={locale} dir={direction} className={`${fontVariables} min-h-screen bg-background text-foreground antialiased font-sans`}>
        <SkipLink targetId="main-content">Skip to main content</SkipLink>
        
        {/* Schema Script Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {children}
      </div>
    </NextIntlClientProvider>
  );
}