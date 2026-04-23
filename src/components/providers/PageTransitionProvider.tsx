"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "@/lib/gsap";

interface PageTransitionContextType {
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

export function PageTransitionProvider({
  children,
}: PageTransitionProviderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isFirstRender = useRef(true);

  // Handle link clicks for custom transition
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip if reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");

      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Skip external links
      if (
        href.startsWith("http") &&
        !href.startsWith(window.location.origin)
      ) {
        return;
      }

      // Skip anchors
      if (href.startsWith("#")) return;

      // Skip links with target
      if (link.getAttribute("target") === "_blank") return;

      e.preventDefault();

      if (isTransitioning) return;

      navigate(href);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isTransitioning]);

  const navigate = useCallback(
    async (href: string) => {
      if (!wrapperRef.current || isTransitioning) return;

      // Same page, just scroll to top
      if (href === window.location.pathname) {
        window.scrollTo(0, 0);
        return;
      }

      setIsTransitioning(true);

      // Kill all ScrollTriggers before transition
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.globalTimeline.clear();

      const currentContainer = wrapperRef.current.firstElementChild as HTMLElement;
      if (!currentContainer) {
        window.location.href = href;
        return;
      }

      try {
        // Fetch new page
        const response = await fetch(href);
        const html = await response.text();

        // Parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Extract the new content
        const newContent = doc.querySelector("main");
        if (!newContent) {
          window.location.href = href;
          return;
        }

        // Create clone container for new page
        const nextContainer = currentContainer.cloneNode(false) as HTMLElement;
        nextContainer.innerHTML = newContent.innerHTML;

        // Set initial state for new container (hidden below)
        gsap.set(nextContainer, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          minHeight: "100vh",
          clipPath: "inset(100% 0% 0% 0%)",
          opacity: 1,
          zIndex: 10,
        });

        // Add new container to DOM
        wrapperRef.current.appendChild(nextContainer);

        // Update URL
        window.history.pushState({}, "", href);

        // Run transition animation
        const tl = gsap.timeline({
          onComplete: () => {
            // Remove old container
            currentContainer.remove();

            // Reset new container styles
            gsap.set(nextContainer, {
              clearProps: "all",
            });

            // Refresh ScrollTrigger
            ScrollTrigger.refresh();

            setIsTransitioning(false);

            // Dispatch event for page components
            window.dispatchEvent(new Event("page-transition-complete"));
          },
        });

        // Animate current page out (slide up + fade)
        tl.to(
          currentContainer,
          {
            y: "-30vh",
            opacity: 0.6,
            duration: 0.8,
            ease: "power2.inOut",
          },
          0
        );

        // Animate new page in (clip-path reveal from bottom)
        tl.fromTo(
          nextContainer,
          {
            clipPath: "inset(100% 0% 0% 0%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.8,
            ease: "power2.inOut",
          },
          0
        );
      } catch (error) {
        console.error("Page transition failed:", error);
        // Fallback to normal navigation
        window.location.href = href;
      }
    },
    [isTransitioning]
  );

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning }}>
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </PageTransitionContext.Provider>
  );
}
