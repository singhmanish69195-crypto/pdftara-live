'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Shield, 
  Lock, 
  FileCheck, 
  Globe, 
  Share2, 
  Send, 
  Star, 
  Twitter, 
  Award, 
  CheckCircle2,
  TrendingUp,
  Youtube 
} from 'lucide-react';
import { type Locale, locales, localeConfig, getLocalizedPath } from '@/lib/i18n/config';
import { saveLanguagePreference } from './LanguageSelector';

export interface FooterProps {
  locale: Locale;
}

// Custom Star Component for high-quality feel
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-[#FFB400] text-[#FFB400]' : i < rating ? 'fill-[#FFB400] text-[#FFB400] opacity-50' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = useTranslations('common');
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();

  const reviewPlatforms = [
    {
      name: "Capterra",
      rating: 5,
      url: "https://www.capterra.in/software/1106945/PDFTara",
      logo: (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <path d="M20 0L37.3205 10V30L20 40L2.67949 30V10L20 0Z" fill="#0052FF"/>
          <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="white" fillOpacity="0.2"/>
          <path d="M15 18L20 13L25 18L20 23L15 18Z" fill="white"/>
        </svg>
      )
    },
    {
      name: "GetApp",
      rating: 4.5,
      url: "https://www.getapp.com/all-software/a/pdftara/",
      logo: (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <rect width="40" height="40" rx="8" fill="#172B4D"/>
          <path d="M12 12H28V28H12V12Z" fill="white" fillOpacity="0.1"/>
          <path d="M20 12L28 20L20 28L12 20L20 12Z" fill="#36B37E"/>
        </svg>
      )
    },
    {
      name: "Software Advice",
      rating: 4.8,
      url: "https://www.softwareadvice.com/product/559122-PDFTara/",
      logo: (
        <svg viewBox="0 0 40 40" className="w-8 h-8">
          <circle cx="20" cy="20" r="20" fill="#00AEEF"/>
          <path d="M15 20L20 15L25 20L20 25L15 20Z" fill="white"/>
          <circle cx="20" cy="20" r="12" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none"/>
        </svg>
      )
    }
  ];

  const footerLinks = [
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/faq`, label: t('navigation.faq') },
    { href: `/${locale}/privacy`, label: t('navigation.privacy') },
    { href: `/${locale}/contact`, label: t('navigation.contact') },
  ];

  const handleLanguageChange = (newLocale: Locale) => {
    saveLanguagePreference(newLocale);
    const newPath = getLocalizedPath(pathname, newLocale);
    router.push(newPath);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'PDFTara',
      text: 'Professional PDF tools - Free & Private!',
      url: typeof window !== 'undefined' ? window.location.origin : '',
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { console.log(err); }
    }
  };

  return (
    <footer className="w-full border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] pt-16 pb-8">
      <div className="container mx-auto px-4">
        
        {/* REVIEWS GRID: LightPDF Style - Mobile Responsive */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-xl font-extrabold text-[hsl(var(--color-foreground))] uppercase tracking-widest mb-2">
              Verified Reviews & Ratings
            </h2>
            <p className="text-[hsl(var(--color-muted-foreground))] text-sm">Join thousands of users who trust PDFTara for their daily document needs.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewPlatforms.map((item) => (
              <a 
                key={item.name} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-2xl bg-[hsl(var(--color-card))] border border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))] transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="transition-transform group-hover:scale-110 duration-300">
                    {item.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[hsl(var(--color-foreground))] tracking-tight">{item.name}</h4>
                    <StarRating rating={item.rating} />
                  </div>
                </div>
                <div className="text-[10px] font-bold text-[hsl(var(--color-primary))] uppercase bg-[hsl(var(--color-primary)/0.1)] px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  Review
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 flex flex-col gap-6">
            <Link href={`/${locale}`} className="group flex items-center gap-2.5 text-xl font-bold text-[hsl(var(--color-foreground))]">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--color-primary))] text-white shadow-md transition-transform group-hover:scale-105">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span>PDFTara</span>
            </Link>
            <p className="text-sm text-[hsl(var(--color-muted-foreground))] leading-relaxed max-w-xs">
              Secure, private, and 100% free PDF tools. No installation, no data tracking.
            </p>
            <button onClick={handleShare} className="flex items-center w-fit gap-2 px-4 py-2 rounded-full border border-[hsl(var(--color-border))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-primary))] hover:text-white transition-all text-xs font-bold uppercase">
              <Share2 className="w-4 h-4" /> Share App
            </button>
          </div>

          {/* Links Column */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-6">Company</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-primary))] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-2">Trusted Verification</h3>
            <div className="flex flex-col gap-3">
              <div className="px-4 py-2 bg-[#E67E22] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm border-b-2 border-orange-800">
                <CheckCircle2 className="w-4 h-4" /> Registered MSME India
              </div>
              <a href="https://www.crunchbase.com/organization/pdftara" target="_blank" className="px-4 py-2 bg-[#0284c7] text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm border-b-2 border-sky-900">
                <Shield className="w-4 h-4" /> Crunchbase Verified
              </a>
            </div>
          </div>

          {/* Security Section */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[hsl(var(--color-foreground))] mb-6">Privacy First</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-green-500/10 text-green-600"><Lock className="w-4 h-4"/></div>
                <span className="text-xs font-medium text-[hsl(var(--color-muted-foreground))]">Files never leave your browser</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600"><Shield className="w-4 h-4"/></div>
                <span className="text-xs font-medium text-[hsl(var(--color-muted-foreground))]">GDPR & ISO compliant workflow</span>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="py-6 border-t border-[hsl(var(--color-border))]">
          <div className="flex flex-wrap gap-2">
            {locales.map((loc) => (
              <button key={loc} onClick={() => handleLanguageChange(loc)} className={`px-4 py-1.5 text-xs rounded-full transition-all ${loc === locale ? 'bg-[hsl(var(--color-primary))] text-white font-bold' : 'bg-[hsl(var(--color-muted))] text-[hsl(var(--color-muted-foreground))] hover:bg-[hsl(var(--color-primary)/0.1)]'}`}>
                {localeConfig[loc].nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Final Copyright */}
        <div className="pt-8 border-t border-[hsl(var(--color-border))] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(var(--color-muted-foreground))]">&copy; {currentYear} PDFTara. Global Document Solutions.</p>
          <div className="flex gap-6">
            <Link href={`/${locale}/privacy`} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]">Privacy Policy</Link>
            <Link href={`/${locale}/terms`} className="text-xs text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
