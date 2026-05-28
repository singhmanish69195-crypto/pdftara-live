"use client";

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export function GoogleScripts() {
  const pathname = usePathname();
  
  const isAdmin = pathname.includes('/admin') || pathname.includes('/dashboard') || pathname.includes('/login');

  if (isAdmin) return null;

  return (
    <>
      {/* --- GOOGLE ANALYTICS (Isse Next.js Script se chalne do) --- */}
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
      
      {/* AdSense ko yahan se hata diya hai, layout mein standard tag use karenge */}
    </>
  );
}
