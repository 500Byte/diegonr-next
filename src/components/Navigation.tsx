"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SwissContainer } from './Layout';
import { Magnetic } from './Magnetic';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';
import { scrollTo } from '@/lib/lenis';

export const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [language, setLanguage] = useState<'ES' | 'EN'>('ES');
  const [mounted, setMounted] = useState(false);
  const lastScrollY = useRef(0);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

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
    if (pathname === '/' && path === '/') {
      e.preventDefault();
      scrollTo(`#${id}`);
    } else if (path !== '/') {
      // It's a page link, let Next.js Link handle it
    } else {
      e.preventDefault();
      router.push('/');
      setTimeout(() => {
        scrollTo(`#${id}`);
      }, 500); // Give it more time for Next.js navigation
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { label: 'Sobre mí', id: 'about', path: '/about' },
    { label: 'Proyectos', id: 'works', path: '/projects' },
    { label: 'Servicios', id: 'services', path: '/services' },
    { label: 'Blog', id: 'blog', path: '/blog' },
    { label: 'Contacto', id: 'contact', path: '/contact' }
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
                  if (pathname === '/') {
                    e.preventDefault();
                    scrollTo('#home');
                  }
                }}
              >
                DN
              </Link>
            </Magnetic>
            <div className="hidden lg:flex gap-4 text-[10px] tracking-widest uppercase">
              <Magnetic strength={0.2}>
                <span 
                  className={cn(
                    "cursor-pointer transition-opacity",
                    language === 'ES' ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
                  )}
                  onClick={() => setLanguage('ES')}
                >
                  ES
                </span>
              </Magnetic>
              <span className="opacity-20">/</span>
              <Magnetic strength={0.2}>
                <span 
                  className={cn(
                    "cursor-pointer transition-opacity",
                    language === 'EN' ? "opacity-100 font-bold" : "opacity-40 hover:opacity-80"
                  )}
                  onClick={() => setLanguage('EN')}
                >
                  EN
                </span>
              </Magnetic>
            </div>
          </div>

          <Magnetic strength={0.2}>
            <div 
              className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase cursor-pointer group"
              onClick={toggleTheme}
            >
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                {!mounted ? 'THEME' : (theme === 'dark' ? 'LIGHT' : 'DARK')}
              </span>
              <div className={cn(
                "w-2 h-2 border border-swiss-white rounded-full transition-colors",
                !mounted ? "bg-transparent" : (theme === 'light' ? "bg-swiss-white" : "bg-transparent")
              )} />
            </div>
          </Magnetic>

          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {navItems.map((item) => (
              <Magnetic key={item.id} strength={0.2}>
                <Link
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.id, item.path)}
                  className={cn(
                    "text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] swiss-underline opacity-80 hover:opacity-100 transition-opacity py-2",
                    pathname === item.path && "opacity-100 after:w-full"
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
