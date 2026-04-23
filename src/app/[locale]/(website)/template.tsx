"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";
import { usePathname } from "next/navigation";

interface CrossfadeTemplateProps {
  children: React.ReactNode;
}

/**
 * Crossfade Template - True Card Stack Transition
 * 
 * Both old and new pages coexist during animation.
 * Old page slides back and fades, new page slides in from right.
 */
export default function CrossfadeTemplate({ children }: CrossfadeTemplateProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const oldRef = useRef<HTMLDivElement>(null);
  const newRef = useRef<HTMLDivElement>(null);
  
  const [oldChildren, setOldChildren] = useState<React.ReactNode | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const prevPathRef = useRef(pathname);
  const childrenRef = useRef<React.ReactNode>(children);

  // Store current children before they change
  useEffect(() => {
    if (!isExiting) {
      childrenRef.current = children;
    }
  }, [children, isExiting]);

  // Handle navigation
  useEffect(() => {
    if (pathname === prevPathRef.current) return;

    // Skip if reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevPathRef.current = pathname;
      return;
    }

    // Start exit animation with old content
    setOldChildren(childrenRef.current);
    setIsExiting(true);

    // Wait for DOM update then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              setIsExiting(false);
              setOldChildren(null);
              ScrollTrigger.refresh();
            },
          });

          // OLD PAGE: Push back and slide left
          if (oldRef.current) {
            tl.to(oldRef.current, {
              x: "-35%",
              scale: 0.92,
              opacity: 0.35,
              filter: "grayscale(100%) brightness(0.4)",
              duration: 0.7,
              ease: "power3.inOut",
            }, 0);
          }

          // NEW PAGE: Slide in from right
          if (newRef.current) {
            gsap.set(newRef.current, {
              x: "100%",
            });

            tl.to(newRef.current, {
              x: "0%",
              duration: 0.7,
              ease: "power3.inOut",
            }, 0);
          }

        }, containerRef);
      });
    });

    prevPathRef.current = pathname;
  }, [pathname]);

  // Entry animation on first load (after preloader)
  useEffect(() => {
    if (!newRef.current || isExiting) return;
    
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(newRef.current, { opacity: 1, x: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        newRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out",
          delay: 0.1,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Old page layer */}
      {isExiting && oldChildren && (
        <div
          ref={oldRef}
          className="fixed inset-0 w-full h-full overflow-auto"
          style={{
            zIndex: 10,
            willChange: "transform, opacity, filter",
            pointerEvents: "none",
          }}
        >
          {oldChildren}
        </div>
      )}

      {/* New page layer */}
      <div
        ref={newRef}
        className="relative w-full min-h-screen"
        style={{
          zIndex: isExiting ? 20 : 1,
          willChange: isExiting ? "transform" : "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
