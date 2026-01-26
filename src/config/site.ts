/**
 * Site configuration
 */
export const siteConfig = {
  // Brand name mein .com add kiya hai taaki Google "Missing .com" na dikhaye
  name: 'PDFTara.com', 
  
  description: 'The Ultimate Free PDF Toolkit – 100% Secure & Private. Process files instantly in your browser (No Uploads). Merge, Split, Compress & Convert PDFs faster than ever.',
  
  // URL ke peeche '/' lagaya hai taaki trailingSlash config se match kare
  url: 'https://www.pdftara.com/', 
  
  ogImage: '/images/og-image.png',
  
  links: {
    github: '', 
  } as any,
  
  creator: 'PDFTara Team',
  
  keywords: [
    'PDF tools', 'PDF editor', 'merge PDF', 'split PDF', 'compress PDF', 'convert PDF',
    'free PDF tools', 'online PDF editor', 'browser-based PDF', 'private PDF processing',
    'secure pdf converter', 'no upload pdf tools',  
  ],
  
  seo: {
    // Title template mein bhi .com dala hai
    titleTemplate: '%s | PDFTara.com',
    defaultTitle: 'PDFTara.com - Professional Free Online PDF Tools',
    twitterHandle: '@PDFTara', 
    locale: 'en_US',
  },
};

/**
 * Navigation configuration
 * Note: Href ke peeche '/' lagaya hai redirects zero karne ke liye
 */
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'Tools', href: '/tools/' },
    { title: 'About', href: '/about/' },
    { title: 'FAQ', href: '/faq/' },
    { title: 'Blog', href: '/blog/' }, // Blog link bhi add kar diya
  ],
  footerNav: [
    { title: 'Privacy', href: '/privacy/' },
    { title: 'Terms', href: '/terms/' },
    { title: 'Contact', href: '/contact/' },
    { title: 'Disclaimer', href: '/disclaimer/' },
  ],
};