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
  Star, 
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Award
} from 'lucide-react';
import { type Locale, locales, localeConfig, getLocalizedPath } from '@/lib/i18n/config';
import { saveLanguagePreference } from './LanguageSelector';

export interface FooterProps {
  locale: Locale;
}

// Custom Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5 mt-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-[#FFB400] text-[#FFB400]' : 'text-gray-200'}`} 
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
      desc: "Top Rated Adobe Alternative",
      url: "https://www.capterra.in/software/1106945/PDFTara",
      logo: "/images/capterra.png"
    },
    {
      name: "GetApp",
      rating: 4.5,
      desc: "Best Secure Document Tool",
      url: "https://www.getapp.com/all-software/a/pdftara/",
      logo: "/images/getapp.png"
    },
    {
      name: "Software Advice",
      rating: 4.8,
      desc: "Highest Rated for Privacy",
      url: "https://www.softwareadvice.com/product/559122-PDFTara/",
      logo: "/images/software_advice.png"
    }
  ];

  const handleLanguageChange = (newLocale: Locale) => {
    saveLanguagePreference(newLocale);
    const newPath = getLocalizedPath(pathname, newLocale);
    router.push(newPath);
  };

  return (
    <footer className="w-full border-t border-gray-100 bg-white pt-16 pb-8" role="contentinfo">
      <div className="container mx-auto px-4">
        
        {/* REVIEWS GRID: High Quality International Layout */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase mb-2">Trusted Globally</h2>
            <p className="text-gray-500 text-sm font-medium italic">"The professional free alternative to Adobe Acrobat Pro"</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewPlatforms.map((item) => (
              <a 
                key={item.name} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-xl transition-all duration-300 bg-gray-50/30"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-white rounded-xl shadow-sm p-2 flex items-center justify-center">
                  <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800 text-sm">{item.name}</span>
                    <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-blue-500" />
                  </div>
                  <StarRating rating={item.rating} />
                  <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tight">{item.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 flex flex-col gap-6">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 text-2xl font-black text-gray-900 italic">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg">
                <img src="/images/logo.png" alt="PDFTara" className="w-6 h-6 invert brightness-0" />
              </div>
              <span>PDF<span className="text-blue-600 not-italic">tara</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Enterprise-grade PDF tools. 100% Secure, No Cloud Uploads, Always Free.
            </p>
            <div className="flex items-center gap-4">
               <a href="https://x.com/ManishS99961475" target="_blank" className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
               </a>
               <Link href={`/${locale}/contact`} className="text-xs font-bold uppercase tracking-widest text-blue-600 hover:underline">Get Help</Link>
            </div>
          </div>

          {/* Resources */}
          <div className="flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Resources</h3>
            <ul className="flex flex-col gap-4">
              {['About Us', 'Privacy Policy', 'Contact Support', 'Cookies'].map((item) => (
                <li key={item}>
                  <Link href={`/${locale}/${item.toLowerCase().replace(' ', '-')}`} className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification (Udyam & Crunchbase) */}
          <div className="flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-100 rounded-2xl shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-[10px] font-black text-orange-900 uppercase">Registered MSME India</p>
                  <p className="text-[9px] font-bold text-orange-600">UDYAM-UP-69-0015414</p>
                </div>
              </div>
              <a href="https://www.crunchbase.com/organization/pdftara" target="_blank" className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-100 rounded-2xl shadow-sm hover:bg-sky-100 transition-all">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <div>
                  <p className="text-[10px] font-black text-sky-900 uppercase">Crunchbase Verified</p>
                  <p className="text-[9px] font-bold text-sky-600">Rank: #5,328,545</p>
                </div>
              </a>
            </div>
          </div>

          {/* Privacy Standards */}
          <div className="flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Compliance</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-3 border border-gray-100 rounded-2xl">
                <Shield className="w-5 h-5 text-green-600 mb-1" />
                <span className="text-[9px] font-black text-gray-500 uppercase">GDPR Ready</span>
              </div>
              <div className="flex flex-col items-center p-3 border border-gray-100 rounded-2xl">
                <Award className="w-5 h-5 text-purple-600 mb-1" />
                <span className="text-[9px] font-black text-gray-500 uppercase">ISO 27001</span>
              </div>
            </div>
            <p className="mt-4 text-[10px] text-gray-400 leading-tight font-medium">
              *All processing happens on your device. We never store or see your files.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-1.5">
            {locales.map((loc) => (
              <button 
                key={loc} 
                onClick={() => handleLanguageChange(loc)} 
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${loc === locale ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:text-gray-900'}`}
              >
                {localeConfig[loc].nativeName}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase">
            &copy; {currentYear} PDFTARA — SECURE DOCUMENT REVOLUTION.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
