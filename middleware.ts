import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🔥 1. FORCE REDIRECT: अगर URL में /en है, तो उसे हटाओ और Root पर भेजो
    if (pathname === '/en' || pathname.startsWith('/en/')) {
        const newPathname = pathname.replace(/^\/en/, '') || '/';
        const url = request.nextUrl.clone();
        url.pathname = newPathname;
        
        const response = NextResponse.redirect(url, 301);
        
        // ब्राउज़र को बोलो कि English की पुरानी कुकी हटा दे, वरना ये बार-बार /en लाएगा
        response.cookies.set('NEXT_LOCALE', 'en'); 
        return response;
    }

    // 2. intlMiddleware को चलाओ
    const response = intlMiddleware(request);

    // 3. Security Headers for WASM (PDF Tools के लिए ज़रूरी)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return response;
}

export const config = {
    // matcher को "Strict" रखा है ताकि सैटमैप और फाइलों में गड़बड़ न हो
    matcher: [
        '/',
        '/(ja|ko|es|fr|de|zh|pt)/:path*',
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
