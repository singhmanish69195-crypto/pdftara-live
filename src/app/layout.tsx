import type { Metadata } from 'next';
import '@/app/globals.css';

// 1. Metadata Base
export const metadata: Metadata = {
  metadataBase: new URL('https://www.pdftara.com'),
  
  title: {
    default: 'PDFTara - Free Online PDF Tools | Merge, Split & Compress PDF',
    template: '%s | PDFTara - Secure & Free'
  },
  
  description: 'The best free online PDF tools to merge, split, compress, and convert PDFs. 100% private & secure - files are processed locally in your browser and never uploaded to servers.',
  
  keywords: [
    'PDF tools', 'free pdf editor', 'merge pdf online', 'split pdf', 'compress pdf', 
    'convert pdf to word', 'jpg to pdf', 'secure pdf tools', 'offline pdf editor'
  ],

  authors: [{ name: 'PDFTara Team', url: 'https://www.pdftara.com' }],
  creator: 'PDFTara',
  publisher: 'PDFTara',

  // Canonical aur Language Alternates
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
      'es-ES': '/es',
      'hi-IN': '/hi',
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
    url: 'https://www.pdftara.com',
    siteName: 'PDFTara',
    title: 'PDFTara - 100% Free & Private PDF Tools',
    description: 'Process PDFs directly in your browser. No uploads, no waiting, completely secure.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'PDFTara - Free & Secure PDF Tools',
    description: 'Merge, Split, and Convert PDFs instantly in your browser.',
  },

  verification: {
    // IMPORTANT: Yahan apna asli GSC code daalna
    google: 'GSC_KA_ASLI_CODE_YAHAN_DALO', 
  },

  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// YAHAN FIX KIYA HAI: Params ab Promise hai
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // <-- Type fix: Promise add kiya
}) {
  
  // Params ko await karke locale nikala
  const { locale } = await params;

  return (
    <html lang={locale || 'en'} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <style dangerouslySetInnerHTML={{ __html: 'html{scrollbar-gutter:stable}' }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}