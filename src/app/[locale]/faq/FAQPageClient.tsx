'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Search, ArrowRight, HelpCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type Locale } from '@/lib/i18n/config';

interface FAQPageClientProps {
  locale: Locale;
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPageClient({ locale }: FAQPageClientProps) {
  const t = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Hardcoded FAQs for Stability & AdSense
  const faqs: FAQItem[] = [
    // General
    {
      category: 'general',
      question: 'IsPDFTara really free to use?',
      answer: 'Yes,PDFTara is completely free to use. You can merge, split, compress, and convert as many files as you want without any hidden charges or subscriptions.',
    },
    {
      category: 'general',
      question: 'Do I need to create an account?',
      answer: 'No, you do not need to register or create an account. Our tools are open for everyone to use instantly.',
    },
    // Privacy & Security
    {
      category: 'privacy',
      question: 'Are my files uploaded to your server?',
      answer: 'No! We use advanced client-side technology (WebAssembly). Your files are processed directly in your web browser and never leave your device. This ensures 100% privacy.',
    },
    {
      category: 'privacy',
      question: 'How long do you keep my files?',
      answer: 'Since we never upload your files, we do not store them. Once you close the browser tab, the processed data is automatically cleared from your browser memory.',
    },
    // Technical
    {
      category: 'technical',
      question: 'What file formats do you support?',
      answer: 'We support standard PDF files for all operations. For conversions, we support JPG, PNG, and standard image formats.',
    },
    {
      category: 'technical',
      question: 'Why is the processing speed so fast?',
      answer: 'Because we process files locally on your computer instead of uploading them to a slow server. The speed depends on your device\'s performance.',
    },
    {
      category: 'technical',
      question: 'Does it work on Mobile and Tablet?',
      answer: 'Yes,PDFTara is fully responsive and works on all modern devices including iPhones, Android phones, iPads, and Tablets.',
    },
    // Troubleshooting
    {
      category: 'troubleshooting',
      question: 'Why did my conversion fail?',
      answer: 'Ensure your file is not password protected and is a valid PDF. Also, check if you have enough free RAM on your device for large files.',
    },
  ];

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'general', label: 'General' },
    { key: 'privacy', label: 'Privacy & Safety' },
    { key: 'technical', label: 'Technical' },
    { key: 'troubleshooting', label: 'Troubleshooting' },
  ];

  // Filter Logic
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6 text-blue-600">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                How can we help?
              </h1>
              <p className="text-xl text-slate-500 mb-10">
                Find answers to common questions about {t('brand')} features, security, and usage.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto shadow-xl shadow-blue-100/50 rounded-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-[#fafafa]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-10 justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === cat.key
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              {filteredFaqs.length > 0 ? (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                    >
                      <button
                        className="w-full px-8 py-6 text-left flex items-center justify-between gap-6"
                        onClick={() => toggleItem(index)}
                      >
                        <span className="font-bold text-lg text-slate-800">
                          {faq.question}
                        </span>
                        <div className={`flex-shrink-0 transition-transform duration-300 ${expandedItems.has(index) ? 'rotate-180' : ''}`}>
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        </div>
                      </button>
                      
                      <div 
                        className={`px-8 transition-all duration-300 ease-in-out ${
                          expandedItems.has(index) ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-slate-600 leading-relaxed text-base border-t border-slate-50 pt-4">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No results found for "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-blue-600 font-bold hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-white border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-slate-500 mb-8 text-lg">
                Can't find the answer you're looking for? Please chat to our friendly team.
              </p>
              <Link href={`/${locale}/contact`}>
                <Button variant="primary" size="lg" className="rounded-full px-8">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}