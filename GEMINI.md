# Project Context

## Overview
- **i18n**: Prepared for ES/EN toggle (only Spanish content currently populated in Sanity).
A modern, animated personal portfolio and professional services website built for a Full-Stack Developer & Solutions Architect. It features high-end GSAP animations, a custom Sanity Cloud CMS integration, and a sophisticated monochromatic/Swiss design system.

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript/JavaScript
- Styling: Tailwind CSS v4
- Animation: GSAP 3, @gsap/react, Lenis (smooth scrolling)
- CMS: Sanity (next-sanity, @portabletext/react, @sanity/image-url)
- Hosting: Cloudflare Pages (via OpenNext)
- Package Manager: npm

- **Architecture Patterns**
  - **Next.js App Router**: Utilizes the `src/app` directory. Pages are Server Components by default.
  - **Client Components**: Interactive sections and animated components use `"use client"` directives.
  - **Colocation**: Page-specific sections live in `_`-prefixed directories next to their page.
  - **CMS Integration**: Content is managed via Sanity and fetched as typed documents via GROQ queries. Images are served and transformed using Sanity's image pipeline.

## Code Conventions
- **Component Exports**: Predominantly named exports (`export function Component()`).
- **Path Aliases**: Intensive use of `@/` path aliases pointing to the `src/` directory.
- **Animation logic**: Encapsulated within `useGSAP` hooks with explicit `scope` references.

## File Organization
- `src/app/`: Next.js routing and page definitions.
- `src/app/(website)/_sections/`: Home page sections, colocated and private.
- `src/components/`: Shared UI components, layouts, and providers.
- `src/lib/`: Utility functions, Sanity data fetchers (`sanity.ts`), analytics.
- `src/types/`: Shared TypeScript interfaces for Sanity content models.
- `sanity/`: Standalone Sanity Studio project.

## Critical Rules
- Avoid using `"use client"` on top-level pages; reserve it for specific interactive components or sections that require hooks (`useRef`, `useGSAP`, `useEffect`).
- Follow the existing pattern of separating data fetching (in server-side `page.tsx`) and passing data as props to client-side `<Section />` components.
- **DO NOT** create global directories (`src/sections/`, `src/data/`, `src/constants/`) for single-page content. Use colocation.
- **DO NOT** extract small static arrays to separate files. Inline them in the consuming component.
