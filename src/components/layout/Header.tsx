'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Menu, X, Command } from 'lucide-react';
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

  // Load localized tool content on mount
  useEffect(() => {
    const allTools = getAllTools();
    const contentMap: Record<string, { title: string; description: string }> = {};

    allTools.forEach(tool => {
      const content = getToolContent(locale, tool.id);
      if (content) {
        contentMap[tool.id] = {
          title: content.title,
          description: content.metaDescription
        };
      }
    });

    setLocalizedTools(contentMap);
  }, [locale]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery, localizedTools);
      setSearchResults(results.slice(0, 8));
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchQuery, localizedTools]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  // Handle keyboard navigation
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
      } else if (searchResults.length > 0) {
        navigateToTool(searchResults[0].tool.slug);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchResults, selectedIndex]);

  const navigateToTool = useCallback((slug: string) => {
    router.push(`/${locale}/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [locale, router]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const getToolIcon = (category: string) => {
    const icons: Record<string, string> = {
      'edit-annotate': '✏️',
      'convert-to-pdf': '📄',
      'convert-from-pdf': '🖼️',
      'organize-manage': '📁',
      'optimize-repair': '🔧',
      'secure-pdf': '🔒',
    };
    return icons[category] || '📄';
  };

  const navItems = [
    { href: `/${locale}`, label: t('navigation.home') },
    { href: `/${locale}/tools`, label: t('navigation.tools') },
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/blog`, label: 'Blog' },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled || isMobileMenuOpen
        ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm'
        : 'bg-transparent border-transparent'
        }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo - Hidden when search is open on mobile */}
          <div className={`flex items-center gap-2 transition-opacity ${isSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
            <Link
              href={`/${locale}`}
              className="group flex items-center gap-2.5 text-xl font-bold transition-opacity"
              aria-label={t('brand')}
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-xl tracking-tight font-bold">
                <span className="text-gray-900 dark:text-white">PDF</span>
                <span className="text-blue-600">Tara</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-1 rounded-full border border-gray-200 dark:border-gray-800 bg-white/50 p-1.5 backdrop-blur-sm shadow-sm transition-all ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className={`flex items-center gap-2 sm:gap-3 ${isSearchOpen ? 'flex-1 justify-end' : ''}`}>
            {showSearch && (
              <div className={`relative ${isSearchOpen ? 'w-full' : ''}`} ref={searchContainerRef}>
                {isSearchOpen ? (
                  <div className="flex items-center w-full animate-in fade-in slide-in-from-right-4 duration-200">
                    {/* Fixed Width on Tablet/Laptop, Responsive on Mobile */}
                    <div className="relative w-full sm:w-72 md:w-96">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('search.placeholder') || 'Search tools...'}
                        className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        autoComplete="off"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSearchToggle}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>

                      {/* Search Results */}
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                          <ul className="py-2 max-h-[60vh] overflow-y-auto">
                            {searchResults.map((result, index) => {
                              const localized = localizedTools[result.tool.id];
                              return (
                                <li key={result.tool.id}>
                                  <button
                                    onClick={() => navigateToTool(result.tool.slug)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${index === selectedIndex ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                                  >
                                    <span className="text-xl">{getToolIcon(result.tool.category)}</span>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold text-sm truncate">{localized?.title || result.tool.id}</div>
                                      <div className="text-xs text-gray-400 truncate">{localized?.description}</div>
                                    </div>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchToggle}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Search className="h-5 w-5" />
                    <span className="ml-2 hidden lg:inline-block text-[10px] font-bold border border-gray-200 rounded-md px-1.5 py-0.5 opacity-50">⌘K</span>
                  </Button>
                )}
              </div>
            )}

            {/* Recent Files - Hide when search is full width on small screens */}
            <div className={`${isSearchOpen ? 'hidden sm:block' : 'block'}`}>
              <RecentFilesDropdown
                locale={locale}
                translations={{
                  title: t('recentFiles.title') || 'Recent Files',
                  empty: t('recentFiles.empty') || 'No recent files',
                  clearAll: t('recentFiles.clearAll') || 'Clear all',
                  processedWith: t('recentFiles.processedWith') || 'Processed with',
                }}
              />
            </div>

            <div id="language-selector-slot" className={`${isSearchOpen ? 'hidden md:block' : 'block'}`} />

            {/* Mobile Menu Toggle - Hide when search is open */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${isSearchOpen ? 'hidden' : 'block'}`}
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <ul className="p-4 space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-4 text-lg font-black text-gray-900 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
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
