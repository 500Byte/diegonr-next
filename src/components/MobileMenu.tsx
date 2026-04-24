"use client";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";
import { scrollTo, pauseLenis, resumeLenis } from "@/lib/lenis";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Magnetic } from "./Magnetic";

interface MobileMenuProps {
  navItems: Array<{
    label: string;
    id: string;
    path: string;
  }>;
  isMenuOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ navItems, isMenuOpen, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      pauseLenis();
    } else {
      document.body.style.overflow = "";
      resumeLenis();
    }

    return () => {
      document.body.style.overflow = "";
      resumeLenis();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isMenuOpen === false && isOpen === true) {
      setIsOpen(false);
    }
  }, [isMenuOpen, isOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      // Page link - let navigation handle it
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

  useGSAP(() => {
    if (!overlayRef.current) return;

    const overlay = overlayRef.current;
    const links = linksRef.current.filter(Boolean);
    const numbers = numbersRef.current.filter(Boolean);

    if (isOpen) {
      gsap.set(overlay, { display: "block" });
      
      const tl = gsap.timeline();
      
      tl.set(overlay, { opacity: 0 })
        .set(links, { opacity: 0, y: 30 })
        .set(numbers, { opacity: 0, x: -20 })
        .set(footerRef.current, { opacity: 0, y: 20 });

      tl.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          numbers,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: "power3.out",
          },
          "-=0.2"
        )
        .to(
          links,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .to(
          footerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .add(() => {
          if (onOpenChange) onOpenChange(true);
        }, 0);
    } else {
      const tl = gsap.timeline();

      tl.to(links, {
        opacity: 0,
        y: -20,
        duration: 0.2,
        stagger: 0.03,
        ease: "power3.in",
      })
        .to(
          numbers,
          {
            opacity: 0,
            x: 20,
            duration: 0.15,
            stagger: 0.02,
            ease: "power3.in",
          },
          "-=0.15"
        )
        .to(
          footerRef.current,
          {
            opacity: 0,
            y: -10,
            duration: 0.15,
            ease: "power3.in",
          },
          "-=0.1"
        )
        .to(
          overlay,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power3.in",
            onComplete: () => {
              gsap.set(overlay, { display: "none" });
              if (onOpenChange) onOpenChange(false);
            },
          },
          "-=0.05"
        );
    }
  }, { scope: overlayRef, dependencies: [isOpen] });

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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[210] min-w-[44px] min-h-[44px] flex flex-col gap-[6px] p-3 -m-3 items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded-sm"
        aria-label={isOpen ? t("aria.close_menu") : t("aria.open_menu")}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span className={cn(
          "w-6 h-[2px] bg-swiss-white transition-all duration-300 origin-center",
          isOpen && "rotate-45 translate-y-[8px]"
        )} />
        <span className={cn(
          "w-6 h-[2px] bg-swiss-white transition-all duration-300",
          isOpen && "opacity-0"
        )} />
        <span className={cn(
          "w-6 h-[2px] bg-swiss-white transition-all duration-300 origin-center",
          isOpen ? "-rotate-45 -translate-y-[8px] w-6" : "w-4 self-start"
        )} />
      </button>

      <div
        ref={overlayRef}
        id="mobile-menu"
        className="fixed inset-0 z-[200] bg-swiss-black"
        style={{ display: "none" }}
        aria-hidden={!isOpen}
      >
        <div className="relative z-10 h-full flex flex-col pt-24">
          <div className="flex-1 flex flex-col justify-start px-6 pt-8 pb-12">
            <nav className="space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname.includes(item.path);
                const originalText = item.label;

                return (
                  <div key={item.id} className="relative flex items-baseline gap-4 overflow-hidden">
                    <span
                      ref={(el) => { numbersRef.current[index] = el; }}
                      className="font-mono text-xs text-swiss-white/40 tracking-widest pt-2"
                    >
                      [{getLinkIndex(index)}]
                    </span>

                    <a
                      ref={(el) => { linksRef.current[index] = el; }}
                      href={item.path}
                      onClick={(e) => handleLinkClick(e, item.id, item.path)}
                      onMouseEnter={(e) => handleMouseEnter(e, originalText)}
                      className={cn(
                        "group relative font-black text-4xl sm:text-5xl uppercase tracking-tighter",
                        "transition-colors duration-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-sm",
                        isActive ? "text-swiss-white" : "text-swiss-white/60 hover:text-swiss-white"
                      )}
                    >
                      {isActive && (
                        <>
                          <span className="absolute -left-4 animate-pulse text-swiss-white/60">[</span>
                          <span className="absolute -right-4 animate-pulse text-swiss-white/60">]</span>
                        </>
                      )}
                      
                      <span className="link-text relative">
                        {originalText}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-swiss-white transition-all duration-500 group-hover:w-full" />
                      </span>
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>

          <div
            ref={footerRef}
            className="px-6 py-6 border-t border-swiss-white/10"
          >
            <div className="w-full h-px bg-swiss-white/20 mb-6" />

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={t("aria.change_language")}
                  className="flex items-center gap-2 p-3 min-h-[44px] -m-3 text-xs font-mono tracking-widest uppercase"
                >
                  <span className={cn(
                    "transition-colors cursor-pointer",
                    locale === "es" ? "text-swiss-white font-bold" : "text-swiss-white/40 hover:text-swiss-white/60"
                  )}>
                    ES
                  </span>
                  <span className="text-swiss-white/20">/</span>
                  <span className={cn(
                    "transition-colors cursor-pointer",
                    locale === "en" ? "text-swiss-white font-bold" : "text-swiss-white/40 hover:text-swiss-white/60"
                  )}>
                    EN
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={t("aria.toggle_theme")}
                className="flex items-center gap-3 p-3 min-h-[44px] -m-3 text-xs font-mono tracking-widest uppercase group"
              >
                <span className="text-swiss-white/60 group-hover:text-swiss-white transition-colors">
                  {!mounted ? t("theme_dark") : theme === "dark" ? t("theme_light") : t("theme_dark")}
                </span>
                <div className={cn(
                  "w-3 h-3 border border-swiss-white rounded-full transition-colors",
                  !mounted ? "bg-transparent" : theme === "light" ? "bg-swiss-white" : "bg-transparent"
                )} />
              </button>

              <div className="flex flex-col gap-2 text-xs font-mono tracking-widest text-swiss-white/40">
                <a
                  href="mailto:hello@diegonr.com"
                  className="hover:text-swiss-white transition-colors"
                >
                  HELLO@DIEGONR.COM
                </a>
                <span>SANTA MARTA, CO</span>
              </div>

              <div className="flex gap-6">
                <a
                  href="https://github.com/500byte"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 -m-3 text-xs font-mono tracking-widest uppercase text-swiss-white/40 hover:text-swiss-white transition-colors"
                >
                  GITHUB
                </a>
                <a
                  href="https://linkedin.com/in/diegonr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 -m-3 text-xs font-mono tracking-widest uppercase text-swiss-white/40 hover:text-swiss-white transition-colors"
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