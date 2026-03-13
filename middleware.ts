import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🔥 1. JOOTA MAAR REDIRECT: अगर URL में /en है, तो उसे लात मारो
    // ये SEO के लिए सबसे बेस्ट है, Google को 301 (Permanent) मैसेज जाएगा
    if (pathname === '/en' || pathname.startsWith('/en/')) {
        const newPathname = pathname.replace(/^\/en/, '') || '/';
        const url = new URL(newPathname, request.url);
        
        const response = NextResponse.redirect(url, 301);
        
        // पुरानी कुकी को डिलीट करो, ये ही सबसे बड़ी जड़ है `/en` की
        response.cookies.delete('NEXT_LOCALE'); 
        return response;
    }

    // 2. intlMiddleware चलाओ (ये बाकी भाषाओं ja, ko, hi आदि को संभालेगा)
    const response = intlMiddleware(request);

    // 3. WASM Security Headers (तेरे PDF Tools को चलाने के लिए)
    // ये headers हर हाल में होने चाहिए वरना Tools लोड नहीं होंगे
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return response;
}

export const config = {
    // 🔥 MATCH KRNE KA SAHI TARIKA:
    // ये matcher सुनिश्चित करता है कि फालतू फाइलों (images, api) को छोड़कर सब पर चले
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
