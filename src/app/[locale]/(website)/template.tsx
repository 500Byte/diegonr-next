"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useRef } from "react";
import { usePathname } from "next/navigation";
import { scrollTo } from "@/lib/lenis";

export default function Template({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(() => {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Page Entrance Animation
    gsap.fromTo(
      container.current,
      { 
        y: "100vh",
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
        clearProps: "all"
      }
    );

    // Scroll to top on change
    window.scrollTo(0, 0);
    scrollTo(0, { immediate: true });
  }, [pathname]);

  return (
    <div 
      ref={container} 
      className="template-wrapper bg-swiss-black"
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
}
