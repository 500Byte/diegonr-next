import { gsap } from "@/lib/gsap";

/**
 * Swiss-Brutalist Page Transition - SIMPLIFIED VERSION
 * 
 * Clean, working transitions without layout issues
 */

export interface TransitionContainers {
  current: HTMLElement;
  next: HTMLElement;
}

/**
 * Simple crossfade with slide transition
 * Current fades out while next fades in
 */
export function simpleTransition({ current, next }: TransitionContainers): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Check for reduced motion preference
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return tl;
  }

  // Setup next container - start hidden below
  gsap.set(next, {
    opacity: 0,
    y: 50,
  });

  // Animate current out
  tl.to(current, {
    opacity: 0,
    y: -30,
    duration: 0.4,
    ease: "power2.in",
  }, 0);

  // Animate next in
  tl.to(next, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
  }, 0.2);

  return tl;
}

/**
 * Diagonal wipe transition using clip-path
 */
export function diagonalWipeTransition({ current, next }: TransitionContainers): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Check for reduced motion preference
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return tl;
  }

  // Setup next container with clip-path
  gsap.set(next, {
    clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
    opacity: 1,
  });

  // Current fades and scales slightly
  tl.to(current, {
    opacity: 0.3,
    scale: 0.98,
    duration: 0.5,
    ease: "power2.inOut",
  }, 0);

  // Reveal next with diagonal wipe
  tl.to(next, {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    duration: 0.6,
    ease: "power3.inOut",
  }, 0.1);

  // Reset current
  tl.set(current, {
    opacity: 0,
  }, 0.7);

  return tl;
}

/**
 * Block reveal transition - simplified
 */
export function blockRevealTransition({ current, next }: TransitionContainers): gsap.core.Timeline {
  const tl = gsap.timeline();

  // Check for reduced motion preference
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return tl;
  }

  // Setup next - hidden
  gsap.set(next, {
    opacity: 0,
  });

  // Current fades to grayscale
  tl.to(current, {
    opacity: 0.2,
    filter: "grayscale(100%)",
    duration: 0.3,
    ease: "power2.in",
  }, 0);

  // Flash effect
  tl.to(current, {
    opacity: 0,
    duration: 0.1,
    ease: "steps(1)",
  }, 0.3);

  // Next fades in
  tl.to(next, {
    opacity: 1,
    duration: 0.3,
    ease: "power2.out",
  }, 0.35);

  return tl;
}
