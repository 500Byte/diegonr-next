# Architecture

## High-Level Overview
This project is a modern web application built on **Next.js (App Router)**. It serves as a portfolio and service catalog, emphasizing high performance, SEO optimization, and rich interactive animations.

## Data Flow & CMS Integration
1. **Content Storage**: Content is defined using Markdoc (`.mdoc`) and stored in the local file system under the `/content` directory.
2. **CMS Admin**: **Keystatic** is used as the Git-based CMS. It is configured in `keystatic.config.ts` and accessible via `/keystatic`. In production, it uses **Keystatic Cloud** for authentication.
3. **Data Fetching**: Next.js Server Components (`app/(website)/page.tsx`) fetch data directly from the filesystem (or GitHub in production) using utility functions from `src/lib/keystatic.ts` (e.g., `getAllProjects()`).
4. **Rendering**: The fetched data is passed as props to Client Components (`_sections/*`) for rendering and animation.

## UI & Animation Architecture
- **Tailwind CSS**: Used for all structural styling, responsive design, and base visual aesthetics. Configured with a "Swiss" monochrome design system (`swiss-black`, `swiss-white`).
- **GSAP**: The primary animation engine. Integrated into React using `@gsap/react` to manage timelines and scroll-triggered animations safely within component lifecycles.
- **Lenis**: Provides smooth scrolling across the website routes. Wrapped in `LenisProvider` at the `(website)` layout level (not global, to avoid affecting the Keystatic admin).

## Component Hierarchy
- **Root Layout (`src/app/layout.tsx`)**: Wraps in `ThemeProvider`, fonts, and global `<head>` metadata. Shared by all routes.
- **Website Layout (`src/app/(website)/layout.tsx`)**: Wraps website routes in `LenisProvider`, `Navigation`, `Footer`, `Preloader`, `CustomCursor`, analytics, and structured data. Isolates these from `/keystatic` and `/api`.
- **Pages (`src/app/(website)/*/page.tsx`)**: Server-side entry points. Responsible for data fetching and passing props.
- **Sections (`src/app/(website)/_sections/`)**: Colocated page sections for the home page. Contain `"use client"` directives for GSAP animations. **Private to the home page — not shared globally.**
- **UI Components (`src/components/ui/`)**: Pure, reusable visual elements (e.g., `marquee-banner.tsx`, `barcode.tsx`).
- **Shared Components (`src/components/`)**: Components used across multiple pages (e.g., `Navigation`, `Footer`, `PageHeader`).

## Directory Structure Rules

### Colocation Principle
Page-specific components live next to their page, prefixed with `_` to signal they are private:
```
src/app/(website)/
├── _sections/        # Home page sections (Hero, About, Works, etc.)
├── page.tsx          # Home page (imports from ./_sections/)
├── projects/
│   └── page.tsx
└── blog/
    └── page.tsx
```

### What goes where
| Directory | Purpose | Rule |
|---|---|---|
| `src/app/` | Routes, layouts, pages | Only Next.js routing files |
| `src/app/(website)/_sections/` | Home page sections | Only imported by `(website)/page.tsx` |
| `src/components/` | Shared, reusable components | Must be used by 2+ pages |
| `src/components/ui/` | Atomic UI primitives | Stateless, composable |
| `src/lib/` | Service connectors & utilities | Keystatic, analytics, utils |
| `src/types/` | Shared TypeScript interfaces | Data models for Keystatic content |

### Anti-patterns (prohibited)
1. **No global `src/sections/` or `src/data/` directories.** Colocate with the consuming route.
2. **No extracting arrays < 20 lines to dedicated files.** Inline until the component exceeds 150 lines or the data is used in 3+ places.
3. **No barrel files (`index.ts` re-exports)** except in `src/types/`.
4. **No route groups without layout conflicts.** Don't create `(group)` unless routes need different providers/layouts.
5. **No premature `"use client"` on components that only display static content.** Wrap interactive parts in minimal client boundaries.
