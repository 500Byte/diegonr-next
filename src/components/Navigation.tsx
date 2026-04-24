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
import { MobileMenu } from './MobileMenu';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      "fixed top-0 left-0 w-full z-[100]",
      !isMenuOpen && "transition-all duration-500",
      isMenuOpen ? "bg-swiss-black py-4 border-b border-swiss-white/10 text-swiss-white" : (
        scrolled 
          ? "bg-swiss-black/95 backdrop-blur-md py-4 border-b border-swiss-white/10" 
          : "bg-transparent py-8"
      ),
      isMenuOpen ? "transform-none" : (visible ? "translate-y-0" : "-translate-y-full")
    )}>
      <SwissContainer className="relative z-[210]">
        <div className="flex justify-between items-center h-12">
            <div className="flex items-center gap-12 relative z-[220]">
<Magnetic strength={0.3}>
                <Link 
                  href="/"
                  className="relative z-[250] min-w-11 min-h-11 rounded-full flex items-center justify-center cursor-pointer hover:bg-swiss-white hover:text-swiss-black transition-colors"
                  onClick={(e) => {
                    if (pathname === `/${locale}`) {
                      e.preventDefault();
                      scrollTo('#home');
                    }
                  }}
                  aria-label={t('brand')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 488 488" fill="currentColor">
                    <path d="M138.423 178.122v139.286a121.312 121.312 0 0 0 100.897-69.659c-18.512-39.774-57.179-66.357-100.897-69.627ZM379.435 339.96h-9.123c-51.16 0-96.989-27.535-121.368-71.533A139.528 139.528 0 0 1 129.3 335.991h-9.121V159.539h9.121a139.562 139.562 0 0 1 128.389 84.63c17.314 44.323 57.289 73.765 103.502 77.208V168.675h18.244V339.96ZM244 18.244C119.519 18.244 18.244 119.52 18.244 244S119.52 469.756 244 469.756 469.756 368.481 469.756 244 368.481 18.244 244 18.244ZM244 488C109.458 488 0 378.543 0 244S109.458 0 244 0c134.543 0 244 109.457 244 244S378.543 488 244 488Z"/>
                  </svg>
                </Link>
              </Magnetic>
            <div className="hidden lg:flex gap-4 text-[10px] tracking-widest uppercase">
              <button
                type="button"
                aria-label={t('aria.change_language')}
                aria-pressed={locale === 'es'}
                className={cn(
                  "p-3 min-h-[44px] flex items-center justify-center cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm",
                  locale === 'es' ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
                )}
                onClick={() => locale !== 'es' && toggleLanguage()}
              >
                {t('language_es')}
              </button>
              <span className="opacity-20 self-center" aria-hidden="true">/</span>
              <button
                type="button"
                aria-label={t('aria.change_language')}
                aria-pressed={locale === 'en'}
                className={cn(
                  "p-3 min-h-[44px] flex items-center justify-center cursor-pointer transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm",
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
            className="hidden md:flex items-center gap-2 p-3 min-h-[44px] text-[10px] tracking-widest uppercase cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm"
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

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileMenu 
              navItems={navItems} 
              isMenuOpen={visible} 
              onOpenChange={setIsMenuOpen}
            />
          </div>
        </div>
      </SwissContainer>
    </nav>
  );
};
