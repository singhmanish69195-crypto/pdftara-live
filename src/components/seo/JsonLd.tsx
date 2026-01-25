/**
 * JSON-LD Structured Data Component
 * Renders schema.org structured data as a single script tag
 */

import React from 'react';

interface JsonLdProps {
  data: object | object[];
}

/**
 * Renders JSON-LD structured data as a single script tag
 */
export function JsonLd({ data }: JsonLdProps) {
  // Sabhi schemas ko ek array mein consolidate kar rahe hain
  const schemas = Array.isArray(data) ? data : [data];
  
  if (schemas.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Sabko ek hi script tag mein stringify kar rahe hain
        __html: JSON.stringify(schemas.length === 1 ? schemas[0] : schemas),
      }}
    />
  );
}

interface ToolPageJsonLdProps {
  softwareApplication: any; // 'any' taaki hum fields check kar sakein
  faqPage?: object | null;
  breadcrumb?: object;
}

/**
 * Renders all JSON-LD structured data for a tool page with safety checks
 */
export function ToolPageJsonLd({ 
  softwareApplication, 
  faqPage, 
  breadcrumb 
}: ToolPageJsonLdProps) {
  
  // CRITICAL FIX: SoftwareApplication mein jo fields missing thi wo yahan add kar rahe hain
  const validatedSoftwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "operatingSystem": "Windows, MacOS, Android, iOS, Web", // Default value for error fix
    "applicationCategory": "UtilitiesApplication",        // Default value for error fix
    ...softwareApplication, // Ye tere purane data ko overwrite nahi karega agar wo pehle se wahan hain
    "offers": softwareApplication.offers || {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const schemas: object[] = [validatedSoftwareApp];
  
  if (faqPage) {
    schemas.push(faqPage);
  }
  
  if (breadcrumb) {
    schemas.push(breadcrumb);
  }
  
  // Sabko ek sath bhej rahe hain
  return <JsonLd data={schemas} />;
}

export default JsonLd;