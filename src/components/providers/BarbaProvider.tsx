"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

interface BarbaProviderProps {
  children: React.ReactNode;
}

export const BarbaProvider: React.FC<BarbaProviderProps> = ({ children }) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Skip Barba for users who prefer reduced motion
      return;
    }

    // Dynamically import barba only on client side
    import("@barba/core").then((barbaModule) => {
      // Barba exports an object with init method, not a factory function
      const barba = barbaModule.default || barbaModule;

      // Initialize Barba
      barba.init({
      // Prevent on external links
      prevent: ({ href }: { href: string }) => {
        if (
          href.indexOf("http") > -1 &&
          href.indexOf(window.location.host) === -1
        ) {
          return true;
        }
        return false;
      },

      // Transitions
      transitions: [
        {
          name: "fade-slide",
          sync: false,
          async leave({ current }: { current: { container: HTMLElement } }) {
            // Animate current page out
            await gsap.to(current.container, {
              opacity: 0,
              y: -20,
              duration: 0.4,
              ease: "power2.inOut",
            });
          },
          async enter({ next }: { next: { container: HTMLElement } }) {
            // Set initial state
            gsap.set(next.container, {
              opacity: 0,
              y: 20,
            });

            // Animate new page in
            await gsap.to(next.container, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            });

            // Refresh ScrollTrigger after transition
            ScrollTrigger.refresh();
          },
        },
      ],

      // Views for page-specific logic
      views: [
        {
          namespace: "home",
          beforeEnter() {
            // Reset scroll position
            window.scrollTo(0, 0);
          },
          afterEnter() {
            // Refresh ScrollTrigger
            ScrollTrigger.refresh();
          },
        },
        {
          namespace: "default",
          beforeEnter() {
            window.scrollTo(0, 0);
          },
          afterEnter() {
            ScrollTrigger.refresh();
          },
        },
      ],
    });

      // Cleanup
      return () => {
        barba.destroy();
      };
    });
  }, []);

  return <>{children}</>;
};
