"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { usePathname } from "next/navigation";

/**
 * Template component that remounts on every navigation
 * Used for page transition animations
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!containerRef.current) return;

    // Skip if reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      // Page enter animation - fade and slide up
      gsap.fromTo(
        containerRef.current,
        { 
          opacity: 0, 
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div 
      ref={containerRef}
      style={{ opacity: 0 }} // Start hidden, GSAP will animate in
    >
      {children}
    </div>
  );
}
