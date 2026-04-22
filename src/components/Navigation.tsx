"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SwissContainer } from './Layout';
import { Magnetic } from './Magnetic';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';
import { scrollTo } from '@/lib/lenis';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Navigation');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 0);

      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        if (currentScrollY > 400) {
          setVisible(false);
        }
      } else {
        setVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    setMounted(true);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, path: string) => {
    if (pathname === `/${locale}` && path === '/') {
      e.preventDefault();
      scrollTo(`#${id}`);
    } else if (path !== '/') {
      // It's a page link, let Next.js Link handle it
    } else {
      e.preventDefault();
      router.push('/');
      setTimeout(() => {
        scrollTo(`#${id}`);
      }, 500);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    const newLocale = locale === 'es' ? 'en' : 'es';
    // Persist preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-locale', newLocale);
    }
    router.replace('/', { locale: newLocale });
  };

  const navItems = [
    { label: t('menu_items.about'), id: 'about', path: '/about' as const },
    { label: t('menu_items.projects'), id: 'works', path: '/projects' as const },
    { label: t('menu_items.services'), id: 'services', path: '/services' as const },
    { label: t('menu_items.blog'), id: 'blog', path: '/blog' as const },
    { label: t('menu_items.contact'), id: 'contact', path: '/contact' as const }
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
      scrolled 
        ? "bg-swiss-black/95 backdrop-blur-md py-4 border-b border-swiss-white/10" 
        : "bg-transparent py-8",
      visible ? "translate-y-0" : "-translate-y-full"
    )}>
      <SwissContainer>
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-12">
            <Magnetic strength={0.3}>
              <Link 
                href="/"
                className="w-10 h-10 border border-swiss-white rounded-full flex items-center justify-center font-medium text-xs cursor-pointer hover:bg-swiss-white hover:text-swiss-black transition-colors"
                onClick={(e) => {
                  if (pathname === `/${locale}`) {
                    e.preventDefault();
                    scrollTo('#home');
                  }
                }}
              >
                {t('brand')}
              </Link>
            </Magnetic>
            <div className="hidden lg:flex gap-4 text-[10px] tracking-widest uppercase">
              <button
                type="button"
                aria-label={t('aria.change_language')}
                aria-pressed={locale === 'es'}
                className={cn(
                  "cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm",
                  locale === 'es' ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
                )}
                onClick={() => locale !== 'es' && toggleLanguage()}
              >
                {t('language_es')}
              </button>
              <span className="opacity-20" aria-hidden="true">/</span>
              <button
                type="button"
                aria-label={t('aria.change_language')}
                aria-pressed={locale === 'en'}
                className={cn(
                  "cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm",
                  locale === 'en' ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
                )}
                onClick={() => locale !== 'en' && toggleLanguage()}
              >
                {t('language_en')}
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label={t('aria.toggle_theme')}
            className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm"
            onClick={toggleTheme}
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
              {!mounted ? t('theme_dark') : (theme === 'dark' ? t('theme_light') : t('theme_dark'))}
            </span>
            <div className={cn(
              "w-2 h-2 border border-swiss-white rounded-full transition-colors",
              !mounted ? "bg-transparent" : (theme === 'light' ? "bg-swiss-white" : "bg-transparent")
            )} />
          </button>

          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {navItems.map((item) => (
              <Magnetic key={item.id} strength={0.2}>
                <Link
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.id, item.path)}
                  className={cn(
                    "text-xs font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] swiss-underline opacity-80 hover:opacity-100 transition-opacity py-3",
                    pathname.includes(item.path) && "opacity-100 after:w-full"
                  )}
                >
                  {item.label}
                </Link>
              </Magnetic>
            ))}
          </div>
        </div>
      </SwissContainer>
    </nav>
  );
};
