import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/config';

/**
 * Root Page - Server Side Redirect
 * Isse Google ko "Page with redirect" wala error nahi aayega
 * Kyunki ye seedha server se redirect maarta hai bina blank screen dikhaye.
 */
export default function RootPage() {
  // Client-side browser language check karne ki zaroorat nahi hai yahan
  // Kyunki Next-Intl Middleware ye kaam background mein khud kar leta hai.
  
  // Seedha default locale (/en/) par bhejo
  // Isse URL hamesha consistent rahega: https://www.pdftara.com/en/
  redirect(`/${defaultLocale}/`);
}