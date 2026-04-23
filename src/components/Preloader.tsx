"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldSkip, setShouldSkip] = useState(false);
  const startTimeRef = useRef<number>(0);
  const minDuration = 800; // Minimum 800ms
  const maxDuration = 3000; // Maximum 3s

  useEffect(() => {
    // Check if user has seen preloader this session
    const hasSeenPreloader = sessionStorage.getItem('hasSeenPreloader');
    
    if (hasSeenPreloader) {
      // Skip preloader for returning users in same session
      setShouldSkip(true);
      setIsComplete(true);
      setProgress(100);
      // Dispatch event immediately so Hero can animate
      window.dispatchEvent(
        new CustomEvent("page-reveal", {
          detail: { phase: "hero" },
        })
      );
      return;
    }

    startTimeRef.current = Date.now();
    
    // Track loading progress
    let imagesLoaded = 0;
    let totalImages = 0;
    let loadTimeout: NodeJS.Timeout;

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      // Calculate image loading progress
      const imageProgress = totalImages > 0 ? (imagesLoaded / totalImages) * 100 : 0;
      
      // Calculate time-based progress (ensures minimum duration)
      const timeProgress = Math.min((elapsed / minDuration) * 100, 100);
      
      // Take the maximum of both (we wait for both images and minimum time)
      const currentProgress = Math.max(imageProgress, timeProgress);
      
      setProgress(Math.min(currentProgress, 99)); // Cap at 99% until fully complete
      
      // Check if we should complete
      const imagesComplete = totalImages === 0 || imagesLoaded >= totalImages;
      const timeComplete = elapsed >= minDuration;
      const maxTimeReached = elapsed >= maxDuration;
      
      if ((imagesComplete && timeComplete) || maxTimeReached) {
        setProgress(100);
        setIsComplete(true);
        // Mark as seen for this session
        sessionStorage.setItem('hasSeenPreloader', 'true');
        clearTimeout(loadTimeout);
      } else {
        loadTimeout = setTimeout(updateProgress, 50);
      }
    };

    // Count images
    const countImages = () => {
      const images = document.querySelectorAll('img');
      totalImages = images.length;
      
      if (totalImages === 0) {
        updateProgress();
        return;
      }

      images.forEach((img) => {
        if (img.complete) {
          imagesLoaded++;
        } else {
          img.addEventListener('load', () => {
            imagesLoaded++;
          });
          img.addEventListener('error', () => {
            imagesLoaded++; // Count errors as loaded to not block
          });
        }
      });

      updateProgress();
    };

    // Start counting when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', countImages);
    } else {
      countImages();
    }

    return () => {
      clearTimeout(loadTimeout);
      document.removeEventListener('DOMContentLoaded', countImages);
    };
  }, []);

  // Exit animation when complete
  useEffect(() => {
    if (!isComplete) return;

    // If skipping, don't animate just remove
    if (shouldSkip) {
      if (containerRef.current) {
        containerRef.current.style.display = "none";
      }
      return;
    }

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Dispatch event for Hero to start animating
          window.dispatchEvent(
            new CustomEvent("page-reveal", {
              detail: { phase: "hero" },
            })
          );
        },
      });

      // Animate progress bar to full width first
      tl.to(progressRef.current, {
        scaleX: 1,
        duration: 0.2,
        ease: "power2.out",
      });

      // Slide up and out
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.8,
          ease: "expo.inOut",
        },
        "+=0.1"
      );

      // Remove from DOM after animation
      tl.set(containerRef.current, {
        display: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isComplete, shouldSkip]);

  // Respect reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Skip preloader animation for reduced motion users
      setProgress(100);
      setIsComplete(true);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-swiss-black flex flex-col items-center justify-center touch-none"
      style={{ willChange: "transform" }}
    >
      {/* Progress Bar Container */}
      <div className="w-48 md:w-64 h-[2px] bg-white/10 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-white origin-left"
          style={{
            transform: `scaleX(${progress / 100})`,
            willChange: "transform",
          }}
        />
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 font-mono text-xs text-white/60 tracking-widest">
        {Math.round(progress)}%
      </div>
    </div>
  );
};
