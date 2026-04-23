"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Skip animation on initial load (preloader handles that)
    if (prevPathRef.current === pathname) {
      prevPathRef.current = pathname;
      return;
    }

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevPathRef.current = pathname;
      return;
    }

    const ctx = gsap.context(() => {
      setIsAnimating(true);

      // Page enter animation
      const tl = gsap.timeline({
        onComplete: () => {
          setIsAnimating(false);
          ScrollTrigger.refresh();
        },
      });

      // Start from invisible and slightly down
      gsap.set(containerRef.current, {
        opacity: 0,
        y: 20,
      });

      // Animate in
      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    });

    prevPathRef.current = pathname;

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        opacity: isAnimating ? 0 : 1,
        willChange: isAnimating ? "transform, opacity" : "auto",
      }}
    >
      {children}
    </div>
  );
}
