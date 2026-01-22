/**
 * Site configuration
 */
export const siteConfig = {
  name: 'PDFTara',
  // Updated Description for better ranking (SEO Optimized)
  description: 'The Ultimate Free PDF Toolkit – 100% Secure & Private. Process files instantly in your browser (No Uploads). Merge, Split, Compress & Convert PDFs faster than ever.',
  
  // URL Fixed for Sitemap
  url: 'https://www.pdftara.com', 
  
  ogImage: '/images/og-image.png',
  
  // Is section ko update kiya hai taaki error na aaye
  links: {
    github: '', 
  } as any,
  
  creator: 'PDFTara Team',
  
  keywords: [
    'PDF tools',
    'PDF editor',
    'merge PDF',
    'split PDF',
    'compress PDF',
    'convert PDF',
    'free PDF tools',
    'online PDF editor',
    'browser-based PDF',
    'private PDF processing',
    'secure pdf converter', 
    'no upload pdf tools',  
  ],
  
  // SEO-related settings
  seo: {
    titleTemplate: '%s | PDFTara',
    defaultTitle: 'PDFTara - Professional PDF Tools',
    twitterHandle: '@PDFTara', 
    locale: 'en_US',
  },
};

/**
 * Navigation configuration
 */
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Tools', href: '/tools' },
    { title: 'About', href: '/about' },
    { title: 'FAQ', href: '/faq' },
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy' },
    { title: 'Terms', href: '/terms' },
    { title: 'Contact', href: '/contact' },
  ],
};