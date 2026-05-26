"use client"; // Ye line sabse zaruri hai error hatane ke liye

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function GoogleScripts() {
  const pathname = usePathname();
  
  // Admin pages par ads na dikhane ke liye aapka logic
  const isAdmin = pathname.includes('/admin') || pathname.includes('/dashboard') || pathname.includes('/login');

  if (isAdmin) return null;

  return (
    <>
      {/* --- GOOGLE ADSENSE --- */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4129411618696895"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* --- GOOGLE ANALYTICS --- */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-E215JB8PYT"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-E215JB8PYT');
        `}
      </Script>
    </>
  );
}
