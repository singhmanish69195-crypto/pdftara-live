import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 🔥 FIX: Matcher ko thoda aur "Strict" kiya hai.
  // Ye sirf unhi pages ko catch karega jo asli hain.
  // Isse sitemap.xml, robots.txt aur static files par redirect error nahi aayega.
  matcher: [
    // 1. Sabse pehle root '/' ko pakdo
    '/',

    // 2. Phir saare locales ko pakdo (en, ja, ko, etc.)
    '/(ja|ko|es|fr|de|zh|pt)/:path*',

    // 3. Phir un paths ko pakdo jinmein locale nahi hai (as-needed logic)
    // Lekin api, _next, aur static files (.ico, .png, etc.) ko chhod do.
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
