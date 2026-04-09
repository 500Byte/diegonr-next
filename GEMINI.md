# Project Context

## Overview
A modern, animated personal portfolio and professional services website built for a Full-Stack Developer & Solutions Architect. It features high-end GSAP animations, a custom Keystatic CMS integration, and a sophisticated monochromatic/Swiss design system.

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript/JavaScript
- Styling: Tailwind CSS v4
- Animation: GSAP 3, @gsap/react, Lenis (smooth scrolling)
- CMS: Keystatic (local storage)
- Package Manager: npm

## Architecture Patterns
- **Next.js App Router**: Utilizes the `src/app` directory. Pages are Server Components by default (e.g., `app/page.tsx` fetches CMS data asynchronously).
- **Client Components**: Interactive sections and animated components use `"use client"` directives (e.g., `src/sections/Hero.tsx`).
- **CMS Integration**: Content is managed via Keystatic and stored locally as Markdoc (`.mdoc`) files in the `content/` directory.

## Code Conventions
- **Component Exports**: Predominantly named exports (`export function Component()`).
- **Path Aliases**: Intensive use of `@/` path aliases pointing to the `src/` directory.
- **Animation logic**: Encapsulated within `useGSAP` hooks with explicit `scope` references.

## File Organization
- `src/app/`: Next.js routing and page definitions.
- `src/components/`: Shared UI components, layouts, and providers.
- `src/sections/`: Large, page-level structural blocks (Hero, About, Works).
- `src/lib/`: Utility functions and Keystatic data fetchers.
- `content/`: CMS data (projects, services, posts).

## Critical Rules
- Avoid using `"use client"` on top-level pages; reserve it for specific interactive components or sections that require hooks (`useRef`, `useGSAP`, `useEffect`).
- Follow the existing pattern of separating data fetching (in server-side `page.tsx`) and passing data as props to client-side `<Section />` components.
