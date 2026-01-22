/**
 * Robots.txt Generation
 * Configures crawling rules for search engines
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */

import { MetadataRoute } from 'next';

// Static export ke liye zaroori hai
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Humne disallow hata diya hai taaki Google aapki saari CSS aur JS padh sake
        // Isse "Mobile Friendly" hone ka score badhta hai
        disallow: [
          '/api/', // Private data ko hide rakhne ke liye
        ],
      },
    ],
    // YE LINK EKDUM SAHI HONA CHAHIYE
    sitemap: 'https://www.pdftara.com/sitemap.xml',
  };
}
