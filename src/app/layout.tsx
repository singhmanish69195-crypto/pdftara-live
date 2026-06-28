import Script from 'next/script';
import type { Metadata } from 'next';
import '@/app/globals.css';
import { GoogleScripts } from '@/components/GoogleScripts';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pdftara.com/'),

  title: {
    default: 'PDFTara - Free Private PDF Tools',
    template: '%s | PDFTara'
  },

  description:
    'Secure browser-based tools to merge, split and compress PDFs.',

  keywords: [
    'PDF tools',
    'PDFTara',
    'merge pdf',
    'split pdf',
    'compress pdf',
    'secure pdf tools',
    'no upload pdf editor'
  ],

  authors: [
    {
      name: 'PDFTara Team',
      url: 'https://www.pdftara.com/'
    }
  ],

  creator: 'PDFTara.com',
  publisher: 'PDFTara.com',

  alternates: {
    canonical: 'https://www.pdftara.com/',
    languages: {
      'en-US': '/en/',
      'zh-TW': '/zh-TW/',
      'es-ES': '/es/',
      'hi-IN': '/hi-IN/',
      'ko-KR': '/ko/',
      'ja-JP': '/ja/',
    },
  },

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

  openGraph: {
    type: 'website',
    url: 'https://www.pdftara.com/',
    siteName: 'PDFTara',

    title: 'PDFTara - Free & Private PDF Tools',

    description:
      'Merge and edit PDFs securely in your browser. No uploads.',

    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630
      }
    ],
  },

  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {

  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>

        {/* 🚀 COI Service Worker */}
        <Script
          src="/coi-serviceworker.js"
          strategy="beforeInteractive"
        />

        {/* 🚀 Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4129411618696895"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Verification Tags */}
        <meta
          name="naver-site-verification"
          content="a7f730f5caea31ec4ce5bcb4ebc46ea1a51d1f5a"
        />

        <meta
          name="google-adsense-account"
          content="ca-pub-4129411618696895"
        />

        {/* Pinterest Verification Tag */}
        <meta 
          name="p:domain_verify" 
          content="4047b6a7242d326afbebdff67d9377fd"
        />

        <meta name="color-scheme" content="light dark" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        <style
          dangerouslySetInnerHTML={{
            __html: 'html{scrollbar-gutter:stable}'
          }}
        />
      </head>

      <body className="min-h-screen bg-background text-foreground antialiased">

        {/* Analytics / Other Scripts */}
        <GoogleScripts />

        {children}

      </body>
    </html>
  );
}
