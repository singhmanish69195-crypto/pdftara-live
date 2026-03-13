import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 🔥 SEO Safe Redirect: /en को हमेशा के लिए हटा दो
    if (pathname === '/en' || pathname.startsWith('/en/')) {
        const newPathname = pathname.replace(/^\/en/, '') || '/';
        const url = new URL(newPathname, request.url);
        // 301 redirect गूगल को बताता है कि ये परमानेंट बदलाव है (Best for SEO)
        return NextResponse.redirect(url, 301);
    }

    const response = intlMiddleware(request);

    // Security Headers for WASM
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return response;
}

export const config = {
    matcher: [
        // सिर्फ ज़रूरी पेजों को स्कैन करो, फालतू फाइलों को छोड़ दो
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
