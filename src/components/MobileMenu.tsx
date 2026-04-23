"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { gsap } from "@/lib/gsap";
import { useTranslations, useLocale } from "next-intl";
import { scrollTo } from "@/lib/lenis";
import { Magnetic } from "./Magnetic";


interface MobileMenuProps {
  navItems: Array<{
    label: string;
    id: string;
    path: string;
  }>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const locale = useLocale();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLanguage = () => {
    const newLocale = locale === "es" ? "en" : "es";
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-locale", newLocale);
    }
    window.location.href = pathname.replace(`/${locale}`, `/${newLocale}`);
  };

  // Bloquear scroll cuando menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP Animation - Open Menu
  useEffect(() => {
    if (!menuRef.current || !panelRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });

      // Fase 1: Panel background reveal
      tl.fromTo(
        panelRef.current,
        { scaleX: 0, transformOrigin: "right" },
        { scaleX: 1, duration: 0.4, ease: "expo.inOut" }
      );

      // Fase 2: Números entran desde izquierda
      tl.fromTo(
        numbersRef.current.filter(Boolean),
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "expo.out" },
        "-=0.2"
      );

      // Fase 3: Links desde abajo con stagger
      tl.fromTo(
        linksRef.current.filter(Boolean),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "expo.out" },
        "-=0.4"
      );

      // Fase 4: Footer aparece
      tl.fromTo(
        footerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "expo.out" },
        "-=0.3"
      );

      // Fase 5: Close button
      tl.fromTo(
        closeBtnRef.current,
        { rotate: -90, opacity: 0, scale: 0.8 },
        { rotate: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
        "-=0.5"
      );

      if (isOpen) {
        tl.play();
      } else {
        tl.reverse();
      }
    }, menuRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Keyboard navigation: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string, path: string) => {
    setIsOpen(false);
    
    if (pathname === `/${locale}` && path === "/") {
      e.preventDefault();
      setTimeout(() => scrollTo(`#${id}`), 300);
    } else if (path !== "/") {
      // Page link, let navigation handle it
    } else {
      e.preventDefault();
      setTimeout(() => {
        window.location.href = `/${locale}`;
        setTimeout(() => scrollTo(`#${id}`), 600);
      }, 300);
    }
  };

  const getLinkIndex = (index: number) => {
    return String(index + 1).padStart(2, "0");
  };

  // Text scramble effect on hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, originalText: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const element = e.currentTarget.querySelector(".link-text") as HTMLElement;
    if (!element) return;

    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((_, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  };

  return (
    <>
      {/* Mobile Menu Trigger - Hamburger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="md:hidden flex flex-col gap-[6px] p-3 -mr-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
        aria-label={t("aria.open_menu")}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span className="w-6 h-[2px] bg-swiss-white transition-all duration-300 origin-left" />
        <span className="w-6 h-[2px] bg-swiss-white transition-all duration-300" />
        <span className="w-4 h-[2px] bg-swiss-white transition-all duration-300 origin-left" />
      </button>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-[200] pointer-events-none",
          isOpen && "pointer-events-auto"
        )}
        aria-hidden={!isOpen}
      >
        {/* Background Panel */}
        <div
          ref={panelRef}
          className="absolute inset-0 bg-swiss-black"
        />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-6 border-b border-swiss-white/10">
            <Magnetic strength={0.3}>
              <a
                href={`/${locale}`}
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 border border-swiss-white rounded-full flex items-center justify-center font-medium text-xs cursor-pointer hover:bg-swiss-white hover:text-swiss-black transition-colors"
              >
                {t("brand")}
              </a>
            </Magnetic>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
              aria-label={t("aria.close_menu")}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="stroke-swiss-white"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
          </div>

          {/* Links Container */}
          <div className="flex-1 flex flex-col justify-center px-6 py-12">
            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname.includes(item.path);
                const originalText = item.label;

                return (
                  <div key={item.id} className="relative flex items-baseline gap-4 overflow-hidden">
                    {/* Index Number */}
                    <span
                      ref={(el) => { numbersRef.current[index] = el; }}
                      className="font-mono text-xs text-swiss-white/40 tracking-widest pt-2"
                    >
                      [{getLinkIndex(index)}]
                    </span>

                    {/* Link */}
                    <a
                      ref={(el) => { linksRef.current[index] = el; }}
                      href={item.path}
                      onClick={(e) => handleLinkClick(e, item.id, item.path)}
                      onMouseEnter={(e) => handleMouseEnter(e, originalText)}
                      className={cn(
                        "group relative font-black text-4xl sm:text-5xl uppercase tracking-tighter",
                        "transition-all duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-sm",
                        isActive ? "text-swiss-white" : "text-swiss-white/60 hover:text-swiss-white"
                      )}
                    >
                      {/* Brackets animados para activo */}
                      {isActive && (
                        <>
                          <span className="absolute -left-4 animate-pulse text-swiss-white/60">[</span>
                          <span className="absolute -right-4 animate-pulse text-swiss-white/60">]</span>
                        </>
                      )}
                      
                      <span className="link-text relative">
                        {originalText}
                        {/* Underline animation */}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-swiss-white transition-all duration-500 group-hover:w-full" />
                      </span>
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div
            ref={footerRef}
            className="px-6 py-6 border-t border-swiss-white/10"
          >
            {/* Divider line animation */}
            <div className="w-full h-px bg-swiss-white/20 mb-6 origin-left scale-x-100" />

            <div className="flex flex-col gap-6">
              {/* Language Toggle */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={t("aria.change_language")}
                  className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase"
                >
                  <span className={cn(
                    "transition-opacity cursor-pointer",
                    locale === "es" ? "text-swiss-white font-bold" : "text-swiss-white/40 hover:text-swiss-white/60"
                  )}>
                    ES
                  </span>
                  <span className="text-swiss-white/20">/</span>
                  <span className={cn(
                    "transition-opacity cursor-pointer",
                    locale === "en" ? "text-swiss-white font-bold" : "text-swiss-white/40 hover:text-swiss-white/60"
                  )}>
                    EN
                  </span>
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={t("aria.toggle_theme")}
                className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase group"
              >
                <span className="text-swiss-white/60 group-hover:text-swiss-white transition-colors">
                  {!mounted ? t("theme_dark") : theme === "dark" ? t("theme_light") : t("theme_dark")}
                </span>
                <div className={cn(
                  "w-3 h-3 border border-swiss-white rounded-full transition-colors",
                  !mounted ? "bg-transparent" : theme === "light" ? "bg-swiss-white" : "bg-transparent"
                )} />
              </button>

              {/* Contact Info */}
              <div className="flex flex-col gap-2 text-xs font-mono tracking-widest text-swiss-white/40">
                <a
                  href="mailto:hello@diegonr.com"
                  className="hover:text-swiss-white transition-colors"
                >
                  HELLO@DIEGONR.COM
                </a>
                <span>MADRID, ES</span>
              </div>

              {/* Social Links */}
              <div className="flex gap-6">
                <a
                  href="https://github.com/500byte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono tracking-widest uppercase text-swiss-white/40 hover:text-swiss-white transition-colors"
                >
                  GITHUB
                </a>
                <a
                  href="https://linkedin.com/in/diegonr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono tracking-widest uppercase text-swiss-white/40 hover:text-swiss-white transition-colors"
                >
                  LINKEDIN
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
