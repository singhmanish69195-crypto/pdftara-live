import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

// Required for static export
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // Sirf API ko hide rakho
          '/admin/', // Agar koi admin panel hai toh use hide rakho
        ],
      },
    ],
    // Ensure siteConfig.url is "https://www.pdftara.com"
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
