import Script from 'next/script';
import type { Metadata } from 'next';
import '@/app/globals.css';
import { GoogleScripts } from '@/components/GoogleScripts';

// 🚀 PDFTARA MASTER METADATA - ALL URLS END WITH '/'
export const metadata: Metadata = {
  metadataBase: new URL('https://www.pdftara.com/'),

  title: {
    default: 'PDFTara - Free Private PDF Tools',
    template: '%s' 
  },

  description: 'Secure browser-based tools to merge, split and compress PDFs. All processing is done locally for maximum privacy.',

  keywords: [
    'PDF tools', 'PDFTara', 'merge pdf', 'split pdf', 'compress pdf', 'secure pdf tools', 'no upload pdf editor', 'private pdf'
  ],

  authors: [{ name: 'PDFTara Team', url: 'https://www.pdftara.com/' }],
  creator: 'PDFTara.com',
  publisher: 'PDFTara.com',

  // ✅ KING FIX: Har language page ke end mein '/' lagaya hai
  alternates: {
    canonical: 'https://www.pdftara.com/', // Main Canonical
    languages: {
      'en': 'https://www.pdftara.com/en/',
      'es': 'https://www.pdftara.com/es/',
      'fr': 'https://www.pdftara.com/fr/',
      'de': 'https://www.pdftara.com/de/',
      'it': 'https://www.pdftara.com/it/',
      'pt': 'https://www.pdftara.com/pt/',
      'ru': 'https://www.pdftara.com/ru/',
      'hi': 'https://www.pdftara.com/hi/',
      'ja': 'https://www.pdftara.com/ja/',
      'ko': 'https://www.pdftara.com/ko/',
      'zh': 'https://www.pdftara.com/zh/',
      'ar': 'https://www.pdftara.com/ar/',
      'vi': 'https://www.pdftara.com/vi/',
      'id': 'https://www.pdftara.com/id/',
      'ro': 'https://www.pdftara.com/ro/',
      'zh-TW': 'https://www.pdftara.com/zh-TW/',
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
    siteName: 'PDFTara',
    title: 'PDFTara - Free & Private PDF Tools',
    description: 'Merge and edit PDFs securely in your browser. No uploads, maximum security.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    url: 'https://www.pdftara.com/',
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
        {/* 🚀 WASM OPTIMIZATION 1: LibreOffice Preload */}
        <link 
          rel="preload" 
          href="/libreoffice-wasm/soffice.wasm.gz" 
          as="fetch" 
          type="application/wasm" 
          crossOrigin="anonymous" 
        />

        {/* 🚀 WASM OPTIMIZATION 2: PyMuPDF Preload */}
        <link 
          rel="preload" 
          href="/pymupdf-wasm/pymupdf.wasm" 
          as="fetch" 
          type="application/wasm" 
          crossOrigin="anonymous" 
        />

        {/* 🚀 COI Service Worker: Multithreading support */}
        <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />

        {/* 🚀 Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4129411618696895"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Verification Tags */}
        <meta name="naver-site-verification" content="a7f730f5caea31ec4ce5bcb4ebc46ea1a51d1f5a" />
        <meta name="google-adsense-account" content="ca-pub-4129411618696895" />
        <meta name="p:domain_verify" content="4047b6a7242d326afbebdff67d9377fd" />
        
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        <style dangerouslySetInnerHTML={{ __html: 'html{scrollbar-gutter:stable}' }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <GoogleScripts />
        {children}
      </body>
    </html>
  );
}
