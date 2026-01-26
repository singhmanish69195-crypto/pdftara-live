import type { Metadata } from 'next';
import '@/app/globals.css';

// 1. Metadata Configuration - Fixed for SEO and Branding
export const metadata: Metadata = {
  metadataBase: new URL('https://www.pdftara.com/'),
  
  title: {
    default: 'PDFTara.com - Free Online PDF Tools | Merge, Split & Compress',
    template: '%s | PDFTara.com - Secure & Free'
  },
  
  description: 'PDFTara.com offers the best free online PDF tools to merge, split, compress, and convert PDFs. 100% private & secure browser-based processing.',
  
  keywords: [
    'PDF tools', 'PDFTara.com', 'merge pdf online', 'split pdf', 'compress pdf', 
    'convert pdf to word', 'secure pdf tools', 'no upload pdf editor'
  ],

  authors: [{ name: 'PDFTara Team', url: 'https://www.pdftara.com/' }],
  creator: 'PDFTara.com',
  publisher: 'PDFTara.com',

  // Canonical aur Alternates Fix: Forced trailing slashes to prevent redirects
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
    siteName: 'PDFTara.com',
    title: 'PDFTara.com - 100% Free & Private PDF Tools',
    description: 'Process PDFs directly in your browser. No uploads, completely secure.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'PDFTara.com - Free & Secure PDF Tools',
    description: 'Merge, Split, and Convert PDFs instantly in your browser.',
  },

  verification: {
    // IMPORTANT: Yahan apna asli GSC code daalna mat bhulna
    google: 'GSC_KA_ASLI_CODE_YAHAN_DALO', 
  },

  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

/**
 * Root Layout Component
 * Handles locale detection and global styles
 */
export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
}) {
  
  // Dynamic params ko await karna Next.js 15+ ke liye zaroori hai
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {/* Scrollbar gutter prevents layout shift on load */}
        <style dangerouslySetInnerHTML={{ __html: 'html{scrollbar-gutter:stable}' }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}