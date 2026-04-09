# Architecture

## High-Level Overview
This project is a modern web application built on **Next.js (App Router)**. It serves as a portfolio and service catalog, emphasizing high performance, SEO optimization, and rich interactive animations.

## Data Flow & CMS Integration
1. **Content Storage**: Content is defined using Markdoc (`.mdoc`) and stored in the local file system under the `/content` directory.
2. **CMS Admin**: **Keystatic** is used as the Git-based CMS. It is configured in `keystatic.config.ts` and likely accessible via a route like `/keystatic`.
3. **Data Fetching**: Next.js Server Components (`app/page.tsx`) fetch data directly from the filesystem using utility functions from `src/lib/keystatic.ts` (e.g., `getAllProjects()`).
4. **Rendering**: The fetched data is passed as static props to Client Components (`src/sections/*`) for rendering and animation.

## UI & Animation Architecture
- **Tailwind CSS**: Used for all structural styling, responsive design, and base visual aesthetics. Configured with a "Swiss" monochrome design system (`swiss-black`, `swiss-white`).
- **GSAP**: The primary animation engine. Integrated into React using `@gsap/react` to manage timelines and scroll-triggered animations safely within component lifecycles.
- **Lenis**: Provides smooth scrolling across the application. Wrapped in a global `LenisProvider` at the root layout.

## Component Hierarchy
- **Layouts (`src/app/layout.tsx`)**: Wraps the application in providers (`ThemeProvider`, `LenisProvider`) and global UI elements (`Navigation`, `CustomCursor`, `Footer`).
- **Pages (`src/app/page.tsx`)**: Server-side entry points. Responsible for aggregating data.
- **Sections (`src/sections/`)**: Large logical blocks of a page (e.g., `Hero`, `Works`). They usually contain the `"use client"` directive to handle complex GSAP animations.
- **UI Components (`src/components/ui/`)**: Pure, stateless, reusable visual elements (e.g., `magnetic-button.tsx`, `marquee-banner.tsx`).
