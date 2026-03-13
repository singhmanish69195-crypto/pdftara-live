'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
// 🔥 FIX 1: next/link की जगह अपनी routing वाला Link इस्तेमाल करें
import { Link, useRouter } from '@/i18n/routing'; 
import { useTranslations } from 'next-intl';
import { Search, Menu, X } from 'lucide-react';
import { type Locale } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { RecentFilesDropdown } from '@/components/common/RecentFilesDropdown';
import { searchTools, SearchResult } from '@/lib/utils/search';
import { getToolContent } from '@/config/tool-content';
import { getAllTools } from '@/config/tools';

export interface HeaderProps {
  locale: Locale;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ locale, showSearch = true }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localizedTools, setLocalizedTools] = useState<Record<string, { title: string; description: string }>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allTools = getAllTools();
    const contentMap: Record<string, { title: string; description: string }> = {};
    allTools.forEach(tool => {
      const content = getToolContent(locale, tool.id);
      if (content) {
        contentMap[tool.id] = { title: content.title, description: content.metaDescription };
      }
    });
    setLocalizedTools(contentMap);
  }, [locale]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery, localizedTools);
      setSearchResults(results.slice(0, 8));
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, localizedTools]);

  const navigateToTool = useCallback((slug: string) => {
    // 🔥 FIX 2: Locale prefix की ज़रूरत नहीं है, routing अपने आप हैंडल करेगी
    router.push(`/tools/${slug}`); 
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigateToTool(searchResults[selectedIndex].tool.slug);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  }, [searchResults, selectedIndex, navigateToTool]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  // 🔥 FIX 3: NavItems से manual locale हटा दिया
  const navItems = [
    { href: '/', label: t('navigation.home') },
    { href: '/tools', label: t('navigation.tools') },
    { href: '/about', label: t('navigation.about') },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className={`flex items-center gap-2 ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
            {/* 🔥 FIX 4: Logo Link को clean कर दिया */}
            <Link href="/" className="group flex items-center gap-2.5 text-xl font-bold" aria-label={t('brand')}>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xl font-bold"><span className="text-gray-900 dark:text-white">PDF</span><span className="text-blue-600">Tara</span></span>
            </Link>
          </div>

          <nav className={`hidden lg:flex items-center gap-1 ${isSearchOpen ? 'opacity-0' : 'opacity-100'}`}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={`flex items-center gap-2 ${isSearchOpen ? 'flex-1 justify-end' : ''}`}>
            {showSearch && (
              <div className="relative" ref={searchContainerRef}>
                {isSearchOpen ? (
                  <div className="relative w-full sm:w-72 md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input ref={searchInputRef} type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search tools..." className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border shadow-xl focus:ring-2 focus:ring-blue-500" />
                    <Button variant="ghost" size="sm" onClick={handleSearchToggle} className="absolute right-1 top-1/2 -translate-y-1/2"><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <Button variant="ghost" onClick={handleSearchToggle} className="text-gray-500"><Search className="h-5 w-5" /></Button>
                )}
              </div>
            )}
            <RecentFilesDropdown locale={locale} translations={{ title: t('recentFiles.title'), empty: t('recentFiles.empty'), clearAll: t('recentFiles.clearAll'), processedWith: t('recentFiles.processedWith') }} />
            <div id="language-selector-slot" />
            <Button variant="ghost" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="lg:hidden bg-white border-b p-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block py-4 text-lg font-bold text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
