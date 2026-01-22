import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  // Title Format: Main Keyword | Secondary Keyword | Brand Name
  title: {
    default: 'PDFTara - Free Online PDF Tools | Merge, Split & Compress PDF',
    template: '%s |PDFTara - Secure & Free'
  },
  
  // Power-packed Description for High Click-Through Rate (CTR)
  description: 'The best free online PDF tools to merge, split, compress, and convert PDFs. 100% private & secure - files are processed locally in your browser and never uploaded to servers.',
  
  // High Ranking Keywords for Global SEO
  keywords: [
    'PDF tools', 
    'free pdf editor', 
    'merge pdf online', 
    'split pdf', 
    'compress pdf', 
    'convert pdf to word', 
    'jpg to pdf', 
    'secure pdf tools', 
    'offline pdf editor', 
    'browser based pdf tools'
  ],

  // Author & Creator Info
  authors: [{ name: 'PDFTara Team', url: 'https://PDFTara.com' }],
  creator: 'PDFTara',
  publisher: 'PDFTara',

  // Robot Instructions (Zaruri hai indexing ke liye)
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

  // Social Media Sharing (Open Graph)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://PDFTara.com',
    siteName: 'PDFTara',
    title: 'PDFTara - 100% Free & Private PDF Tools',
    description: 'Process PDFs directly in your browser. No uploads, no waiting, completely secure. Try the best free PDF tools now.',
    images: [
      {
        url: '/og-image.jpg', // Make sure to add an image at public/og-image.jpg
        width: 1200,
        height: 630,
        alt: 'PDFTara - Professional PDF Tools',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'PDFTara - Free & Secure PDF Tools',
    description: 'Merge, Split, and Convert PDFs instantly in your browser. No file uploads required.',
    // images: ['/twitter-image.jpg'], // Uncomment if you have an image
  },

  // Verification for Search Engines
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE', // Yahan Google Search Console ka code dalna padega baad mein
  },

  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

// Root layout - provides the basic HTML structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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