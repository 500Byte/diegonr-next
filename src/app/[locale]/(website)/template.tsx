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
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Page Entrance Animation - only if container exists
    if (container.current) {
      gsap.fromTo(
        container.current,
        { 
          opacity: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all"
        }
      );
    }

    // Scroll to top on change
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return (
    <div 
      ref={container} 
      className="template-wrapper bg-swiss-black"
    >
      {children}
    </div>
  );
}
