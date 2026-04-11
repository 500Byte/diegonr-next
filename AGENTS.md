# Agent Guidance

## Build & Development Commands
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Run linter: `npm run lint`

## TypeScript Configuration
- Targeting ES2022 with `esnext` modules.
- Strict mode is enabled (`"strict": true`), but ESLint rules for `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` are currently disabled.
- Path aliases: `@/*` maps to `./src/*`.

## Code Style

### Imports & Exports
- **Exports**: Named exports are the strong preference for components and utilities (e.g., `export function Hero()`). Default exports are mostly used for Next.js mandatory files (`page.tsx`, `layout.tsx`) and config files.
- **Imports**: Group third-party library imports first (React, GSAP), followed by local alias imports (`@/components/...`), and relative imports last.

### Naming Conventions
- **Components/Sections**: PascalCase files (`Hero.tsx`, `About.tsx`).
- **UI Components**: kebab-case files (`marquee-banner.tsx`, `magnetic-button.tsx`).
- **Functions/Hooks**: camelCase.

### Component Patterns
- **Server Components**: Used for data fetching (e.g., fetch Prismic documents in `page.tsx`). They pass data down to sections.
- **Client Components**: Declared with `"use client"`. Heavy use of `useRef` for GSAP targeting and `useState`/`useEffect` for interaction.

### Error Handling
- Next.js default error boundaries (`error.tsx`, `not-found.tsx` usually present in App Router).
- Unhandled Promise rejections should be caught in data fetching layers.

### State Management
- Local state via React `useState`.
- Global UI state like theme via `next-themes` (`ThemeProvider`).
- Smooth scroll state managed by Lenis (`LenisProvider`).

## Module Structure
- `src/app/`: Next.js pages and layouts.
- `src/app/(website)/_sections/`: Home page sections (Hero, About, Works, etc.). Colocated, private to the home page.
- `src/components/`: Shared components used across multiple pages (Navigation, Footer, PageHeader).
- `src/components/ui/`: Reusable, atomic UI components (kebab-case).
- `src/components/animations/`: Specific animation wrappers.
- `src/components/providers/`: Context providers (Lenis, Theme).
- `src/lib/`: Utilities (`utils.ts`, `lenis.ts`, `prismic.ts`, `analytics.tsx`).
- `src/types/`: Shared TypeScript interfaces for Prismic document models.
- `customtypes/`: JSON schemas for Prismic Custom Types (managed via Slice Machine).

## Key Design Patterns
- **Animations**: Uses GSAP `useGSAP` hook for React-safe animations. Always pass a `scope` (usually a ref to the section container) to `useGSAP` to avoid global selector conflicts.
- **Headless CMS**: Content is managed via **Prismic CMS**. Data is fetched using the native `@prismicio/client` and helpers.
  - Documents are accessed via `doc.data.field_name`.
  - Rich Text is rendered using the `<DocumentRenderer />` component.
- **Colocation**: Page-specific components live next to their page in `_`-prefixed directories. Only truly shared components go in `src/components/`.

## Anti-Patterns (DO NOT)
- **DO NOT** create global directories like `src/sections/`, `src/data/`, or `src/constants/` for code used by a single page.
- **DO NOT** extract static arrays under 20 lines to separate files. Inline them in the consuming component.
- **DO NOT** create barrel files (`index.ts` re-exports) except in `src/types/`.
- **DO NOT** add `"use client"` to components that only render static content. Encapsulate interactivity in minimal client wrappers.
- **DO NOT** create route groups `(group)` unless there is a real layout conflict between routes.

## Deployment & Secrets
- **Hosting**: The project is deployed as a **Cloudflare Worker Service** via OpenNext.
- **Secrets Management**: Sensitive variables (Prismic, GitHub, etc.) are managed via Cloudflare Worker secrets.
- **Synchronization**: To sync local `.env` values to production, use the `wrangler secret put` command for the `diegonr-next` service.

## Testing
- No testing framework is currently configured in `package.json`.

## Documentation
- Refer to `/docs` directory for architectural and coding standards.
