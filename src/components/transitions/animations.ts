import { gsap } from "@/lib/gsap";

/**
 * Swiss-Brutalist Page Transition
 * 
 * Combines multiple techniques from Codrops tutorial:
 * - Block reveal (grid-based)
 * - Clip-path geometric reveal
 * - Hard flash cut
 * 
 * Duration: 0.8s total
 * Easing: steps(6) for digital/mechanical feel + expo.out for final settle
 * 
 * Timeline:
 * - 0-600ms: Current page scales down and slides left
 * - 100-800ms: Next page clip-path diagonal reveal
 * - 400-600ms: White flash overlay (15% opacity)
 * 
 * @param containers - Object containing current and next page containers
 * @returns GSAP timeline for the transition
 */

export interface TransitionContainers {
  current: HTMLElement;
  next: HTMLElement;
}

/** Z-index layers for transitions */
const Z_INDEX = {
  CURRENT: 10,
  NEXT: 20,
  OVERLAY: 25,
  FLASH: 30,
} as const;

/**
 * Default Swiss-Brutalist Transition
 * Geometric clip-path reveal with block elements
 */
export function swissBrutalistTransition({ current, next }: TransitionContainers): gsap.core.Timeline {
  const tl = gsap.timeline();
  let flash: HTMLDivElement | null = null;

  // Check for reduced motion preference
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return tl; // Return empty timeline
  }

  // Cleanup function to ensure flash is always removed
  const cleanup = () => {
    if (flash && flash.parentNode) {
      flash.remove();
      flash = null;
    }
  };

  // Setup next container - hidden behind blocks
  gsap.set(next, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100dvh",
    zIndex: Z_INDEX.NEXT,
    clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", // Hidden from left
    opacity: 1,
    willChange: "clip-path, transform",
  });

  // PHASE 1: Current page slides out with scale
  tl.to(current, {
    x: "-20%",
    scale: 0.95,
    opacity: 0.3,
    duration: 0.6,
    ease: "power2.inOut",
  }, 0);

  // PHASE 2: Geometric reveal - diagonal wipe
  // Starts from top-left corner, expands diagonally
  tl.to(next, {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    duration: 0.7,
    ease: "power4.inOut",
  }, 0.1);

  // PHASE 3: Subtle flash effect (white overlay)
  flash = document.createElement("div");
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    background: var(--text-primary, #ffffff);
    z-index: ${Z_INDEX.FLASH};
    pointer-events: none;
    opacity: 0;
  `;
  document.body.appendChild(flash);

  tl.to(flash, {
    opacity: 0.15,
    duration: 0.05,
    ease: "steps(1)",
  }, 0.4);

  tl.to(flash, {
    opacity: 0,
    duration: 0.15,
    ease: "power2.out",
    onComplete: cleanup,
  }, 0.45);

  // Ensure cleanup on timeline completion or interruption
  tl.eventCallback("onComplete", cleanup);
  tl.eventCallback("onInterrupt", cleanup);

  return tl;
}

/**
 * Alternative: Hard Block Grid Reveal
 * Divides screen into 4x4 grid blocks that reveal in random sequence
 * 
 * Duration: 800ms total
 * 
 * Timeline:
 * - 0-400ms: Current page fades to grayscale
 * - 200-700ms: 16 blocks scale from 0 to 1 (staggered 80ms, random order)
 * - 600ms: Next page becomes visible
 * - 700-800ms: Blocks fade out and cleanup
 * 
 * @param containers - Object containing current and next page containers
 * @returns GSAP timeline for the transition
 */
export function blockGridTransition({ current, next }: TransitionContainers): gsap.core.Timeline {
  const tl = gsap.timeline();
  const wrapper = current.parentElement;
  
  if (!wrapper) return tl;

  // Check for reduced motion preference
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return tl; // Return empty timeline
  }

  // Create block overlay
  const blockOverlay = document.createElement("div");
  blockOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100dvh;
    z-index: ${Z_INDEX.OVERLAY};
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    pointer-events: none;
  `;

  // Create 16 blocks
  const blocks: HTMLDivElement[] = [];
  for (let i = 0; i < 16; i++) {
    const block = document.createElement("div");
    block.style.cssText = `
      background: var(--text-primary, #ffffff);
      transform: scale(0);
      transform-origin: center;
    `;
    blockOverlay.appendChild(block);
    blocks.push(block);
  }

  wrapper.appendChild(blockOverlay);

  // Cleanup function
  const cleanup = () => {
    if (blockOverlay.parentNode) {
      blockOverlay.remove();
    }
  };

  // Setup next container
  gsap.set(next, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100dvh",
    zIndex: Z_INDEX.NEXT,
    opacity: 0,
  });

  // Animate current out
  tl.to(current, {
    opacity: 0.2,
    filter: "grayscale(100%)",
    duration: 0.4,
    ease: "power2.in",
  }, 0);

  // Reveal blocks in sequence
  tl.to(blocks, {
    scale: 1,
    duration: 0.15,
    stagger: {
      each: 0.08,
      from: "random",
    },
    ease: "steps(2)",
  }, 0.2);

  // Show next page
  tl.set(next, { opacity: 1 }, 0.6);

  // Remove blocks
  tl.to(blockOverlay, {
    opacity: 0,
    duration: 0.1,
    onComplete: cleanup,
  }, 0.7);

  // Ensure cleanup on timeline completion or interruption
  tl.eventCallback("onComplete", cleanup);
  tl.eventCallback("onInterrupt", cleanup);

  return tl;
}

/**
 * Scan Line Transition
 * Horizontal scan line reveals content from bottom to top
 *
 * Duration: 650ms total
 *
 * Timeline:
 * - 0-600ms: Current page slides up with slight skew distortion
 * - 150-650ms: Next page clip-path reveal from bottom
 *
 * @param containers - Object containing current and next page containers
 * @returns GSAP timeline for the transition
 */
export function scanLineTransition({ current, next }: TransitionContainers): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Check for reduced motion preference
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return tl; // Return empty timeline
  }

  // Setup next with scan mask
  gsap.set(next, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100dvh",
    zIndex: Z_INDEX.NEXT,
    clipPath: "inset(100% 0 0 0)",
    willChange: "clip-path",
  });

  // Current slides up with distortion
  tl.to(current, {
    y: "-100%",
    skewY: -2,
    opacity: 0.5,
    duration: 0.6,
    ease: "power3.in",
  }, 0);

  // Scan line reveals next
  tl.to(next, {
    clipPath: "inset(0% 0 0 0)",
    duration: 0.5,
    ease: "power2.out",
  }, 0.15);

  return tl;
}
