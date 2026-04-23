import type { TransitionContainers } from "./animations";
import { swissBrutalistTransition, blockGridTransition, scanLineTransition } from "./animations";

/**
 * Transition Registry
 * Maps route combinations to transition functions
 */

export type TransitionType = "default" | "blocks" | "scan";

export interface TransitionConfig {
  from?: string;
  to?: string;
  type: TransitionType;
}

// Registry of transitions
const transitionRegistry: TransitionConfig[] = [
  // Default transition for most navigations
  { type: "default" },
  
  // Specific route combinations
  { from: "/", to: "/about", type: "blocks" },
  { from: "/about", to: "/", type: "scan" },
  { from: "/", to: "/projects", type: "default" },
  { from: "/projects", to: "/", type: "scan" },
];

/**
 * Get transition function based on current and next routes
 */
export function getTransition(
  currentPath: string,
  nextPath: string
): (containers: TransitionContainers) => gsap.core.Timeline {
  // Find specific transition
  const specific = transitionRegistry.find(
    (t) => t.from === currentPath && t.to === nextPath
  );

  if (specific) {
    return getTransitionByType(specific.type);
  }

  // Fallback to default
  return getTransitionByType("default");
}

/**
 * Get transition by type
 */
function getTransitionByType(type: TransitionType) {
  switch (type) {
    case "blocks":
      return blockGridTransition;
    case "scan":
      return scanLineTransition;
    case "default":
    default:
      return swissBrutalistTransition;
  }
}
