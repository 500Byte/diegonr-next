"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SwissContainer } from './Layout';
import { Magnetic } from './Magnetic';
import { cn } from '../lib/utils';
import { useTheme } from 'next-themes';

/**
 * NavigationError Component
 * 
 * Simplified navigation for error pages (404, etc.)
 * Does not depend on next-intl locale context.
 */

export const NavigationError: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setMounted(true);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
      scrolled 
        ? "bg-swiss-black/95 backdrop-blur-md py-4 border-b border-swiss-white/10" 
        : "bg-transparent py-8"
    )}>
      <SwissContainer>
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-12">
            <Magnetic strength={0.3}>
              <Link 
                href="/"
                className="w-10 h-10 border border-swiss-white rounded-full flex items-center justify-center font-medium text-xs cursor-pointer hover:bg-swiss-white hover:text-swiss-black transition-colors"
              >
                DN
              </Link>
            </Magnetic>
          </div>

          <button
            type="button"
            aria-label="Toggle theme"
            className="hidden md:flex items-center gap-2 text-[10px] tracking-widest uppercase cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-swiss-black rounded-sm"
            onClick={toggleTheme}
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">
              {!mounted ? 'THEME' : (theme === 'dark' ? 'LIGHT' : 'DARK')}
            </span>
            <div className={cn(
              "w-2 h-2 border border-swiss-white rounded-full transition-colors",
              !mounted ? "bg-transparent" : (theme === 'light' ? "bg-swiss-white" : "bg-transparent")
            )} />
          </button>

          <div className="flex gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            <Magnetic strength={0.2}>
              <Link
                href="/"
                className="text-xs font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] swiss-underline opacity-80 hover:opacity-100 transition-opacity py-3"
              >
                Home
              </Link>
            </Magnetic>
          </div>
        </div>
      </SwissContainer>
    </nav>
  );
};
