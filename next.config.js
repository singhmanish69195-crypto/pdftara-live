import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    // 1. intlMiddleware को चलाने दो (ये अपने आप 'as-needed' हैंडल करेगा)
    const response = intlMiddleware(request);

    // 2. WASM Security Headers (तेरे PDF Tools के लिए ज़रूरी)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return response;
}

export const config = {
    // matcher को सही रखो ताकि फालतू फाइलों पर न चले
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
