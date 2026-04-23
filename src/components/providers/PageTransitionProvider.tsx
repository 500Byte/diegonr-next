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
import { getTransition } from "@/components/transitions/registry";

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

      const currentPath = window.location.pathname;

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

        // Add new container to DOM (initial styling handled by transition)
        wrapperRef.current.appendChild(nextContainer);

        // Update URL
        window.history.pushState({}, "", href);

        // Get transition from registry
        const transitionFn = getTransition(currentPath, href);

        // Run transition animation
        const tl = transitionFn({ current: currentContainer, next: nextContainer });

        // Wait for animation to complete
        await tl.then();

        // Cleanup
        currentContainer.remove();
        gsap.set(nextContainer, { clearProps: "all" });
        ScrollTrigger.refresh();
        setIsTransitioning(false);

        // Dispatch event for page components
        window.dispatchEvent(new Event("page-transition-complete"));
      } catch (error) {
        console.error("Page transition failed:", error);
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
