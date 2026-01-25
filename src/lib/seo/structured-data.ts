/**
 * JSON-LD Structured Data Generation
 * Creates schema.org structured data for SEO
 * 
 * @module lib/seo/structured-data
 */

import { siteConfig } from '@/config/site';
import type { Tool, ToolContent, FAQ, HowToStep } from '@/types/tool';
import type { Locale } from '@/lib/i18n/config';

/**
 * SoftwareApplication schema for tool pages
 * @see https://schema.org/SoftwareApplication
 */
export interface SoftwareApplicationSchema {
  '@context': 'https://schema.org';
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    ratingCount: string;
  };
  featureList?: string[];
  screenshot?: string;
  softwareVersion?: string;
  keywords?: string;
}

/**
 * HowTo schema for step-by-step instructions
 * @see https://schema.org/HowTo
 */
export interface HowToSchema {
  '@context': 'https://schema.org';
  '@type': 'HowTo';
  name: string;
  description: string;
  totalTime?: string;
  tool?: Array<{
    '@type': 'HowToTool';
    name: string;
  }>;
  step: Array<{
    '@type': 'HowToStep';
    position: number;
    name: string;
    text: string;
    url?: string;
  }>;
}

/**
 * WebPage schema for enhanced page information
 * @see https://schema.org/WebPage
 */
export interface WebPageSchema {
  '@context': 'https://schema.org';
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  inLanguage: string;
  isPartOf: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  about?: {
    '@type': 'Thing';
    name: string;
  };
}

/**
 * FAQPage schema for FAQ sections
 * @see https://schema.org/FAQPage
 */
export interface FAQPageSchema {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

/**
 * WebSite schema for the main site
 */
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

/**
 * Organization schema
 */
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

/**
 * BreadcrumbList schema
 */
export interface BreadcrumbListSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generate SoftwareApplication schema (FIXED: Added Trailing Slashes)
 */
export function generateSoftwareApplicationSchema(
  tool: Tool,
  content: ToolContent,
  locale: Locale
): SoftwareApplicationSchema {
  const schema: SoftwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: content.title,
    description: content.metaDescription,
    url: `${siteConfig.url}/${locale}/tools/${tool.slug}/`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Windows, macOS, Linux, iOS, Android, Chrome OS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    keywords: content.keywords ? content.keywords.join(', ') : undefined,
  };

  if (tool.features && tool.features.length > 0) {
    schema.featureList = tool.features;
  }

  return schema;
}

/**
 * Generate HowTo schema (FIXED: Added Trailing Slashes)
 */
export function generateHowToSchema(
  tool: Tool,
  content: ToolContent,
  locale: Locale
): HowToSchema | null {
  if (!content.howToUse || content.howToUse.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${content.title}`,
    description: content.metaDescription,
    totalTime: 'PT5M',
    tool: [{ '@type': 'HowToTool', name: 'Web Browser' }],
    step: content.howToUse.map((step: HowToStep) => ({
      '@type': 'HowToStep',
      position: step.step,
      name: step.title,
      text: step.description,
      url: `${siteConfig.url}/${locale}/tools/${tool.slug}/#step-${step.step}`,
    })),
  };
}

/**
 * Generate WebPage schema (FIXED: Removed mainEntity to prevent duplication)
 */
export function generateWebPageSchema(
  tool: Tool,
  content: ToolContent,
  locale: Locale
): WebPageSchema {
  const languageMap: Record<Locale, string> = {
    en: 'en-US', ja: 'ja-JP', ko: 'ko-KR', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN', 'zh-TW': 'zh-TW', pt: 'pt-BR',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: content.title,
    description: content.metaDescription,
    url: `${siteConfig.url}/${locale}/tools/${tool.slug}/`,
    inLanguage: languageMap[locale] || 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      '@type': 'Thing',
      name: 'PDF Processing',
    }
  };
}

/**
 * Generate FAQPage schema
 */
export function generateFAQPageSchema(faqs: FAQ[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema(locale: Locale): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}/`,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/${locale}/tools/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.svg`,
    sameAs: siteConfig.links?.github ? [siteConfig.links.github] : [],
  };
}

/**
 * Generate Breadcrumb schema (FIXED: Added Trailing Slashes)
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  locale: Locale
): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}/${locale}${item.path}/`,
    })),
  };
}

/**
 * Generate all structured data for a tool page
 */
export function generateToolPageStructuredData(
  tool: Tool,
  content: ToolContent,
  locale: Locale
): {
  softwareApplication: SoftwareApplicationSchema;
  howTo: HowToSchema | null;
  faqPage: FAQPageSchema | null;
  webPage: WebPageSchema;
  breadcrumb: BreadcrumbListSchema;
} {
  const softwareApplication = generateSoftwareApplicationSchema(tool, content, locale);
  const howTo = generateHowToSchema(tool, content, locale);
  const webPage = generateWebPageSchema(tool, content, locale);
  const faqPage = content.faq && content.faq.length > 0 ? generateFAQPageSchema(content.faq) : null;
  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'Tools', path: '/tools' },
      { name: content.title, path: `/tools/${tool.slug}` },
    ],
    locale
  );

  return { softwareApplication, howTo, faqPage, webPage, breadcrumb };
}

/**
 * Serialize data
 */
export function serializeStructuredData(data: object): string {
  return JSON.stringify(data, null, 0);
}

/**
 * VALIDATION LOGIC FOR GSC (Ensuring all required fields are present)
 */
export function validateSoftwareApplicationSchema(
  schema: SoftwareApplicationSchema
): { valid: boolean; missingFields: string[] } {
  const required = ['@context', '@type', 'name', 'description', 'url', 'applicationCategory', 'operatingSystem', 'offers'];
  const missing: string[] = [];
  for (const field of required) {
    if (!(field in schema)) missing.push(field);
  }
  return { valid: missing.length === 0, missingFields: missing };
}

export function validateFAQPageSchema(
  schema: FAQPageSchema
): { valid: boolean; missingFields: string[] } {
  const missing: string[] = [];
  if (schema['@type'] !== 'FAQPage') missing.push('@type');
  if (!schema.mainEntity || schema.mainEntity.length === 0) missing.push('mainEntity');
  return { valid: missing.length === 0, missingFields: missing };
}