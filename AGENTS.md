# AGENTS.md

## Project Overview
A modern, animated personal portfolio and professional services website built for a **Design Engineer / Full-Stack** using Next.js 16 (Canary/Future). It features high-end GSAP animations, custom Sanity Cloud CMS integration, and a sophisticated Swiss-Brutalist design system.

## Agent Role: The Design Engineer
As an agent in this repository, you are not just a coder; you are a **Design Engineer / Full-Stack**. Your goal is to ensure every change follows the **"Architecture through Automation"** principle. Prioritize system-wide quality, automated verification, and performance over quick fixes.

## Technical Principles: "Architecture through Automation"
This repository follows a strict automation-first mindset. All contributions must respect:
- **Performance & Quality Standards**: Every UI change must prioritize high-performance benchmarks (Core Web Vitals), technical SEO, and accessibility (WCAG) as core architectural requirements.
- **Structured Data Integration**: Components must be designed to consume deterministic, structured data models, ensuring a strict decoupling between presentation logic and data source.
- **Systematic Scalability**: Prioritize programmatic, reusable solutions and automated workflows over manual, repetitive implementation tasks.

## Build & Development Commands
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm run start`
- Run linter: `npm run lint`
- Auto-fix lint errors: `npm run lint:fix`
- TypeScript check: `npm run type-check`
- Preview build (Cloudflare): `npm run preview`

## Testing Instructions
The project uses **Playwright** for end-to-end and smoke testing.
- Run all tests: `npx playwright test`
- Run tests in UI mode: `npx playwright test --ui`
- View test report: `npx playwright show-report`
- **Location**: E2E tests are located exclusively in the `e2e/` directory.
- **Requirement**: New features or major UI updates should include a basic smoke test in `e2e/smoke.spec.ts` or a new spec file.

## Localization (i18n) Workflow
The project implements a "Dual-Layer i18n" strategy:
1. **Routing & Static UI**: Managed by `next-intl` via the `[locale]` dynamic segment.
   - Translation files: `messages/es.json` and `messages/en.json`.
   - **Requirement**: Always update both files when adding or modifying UI strings.
2. **CMS Content**: Sanity fields use a field-level localization pattern: `{field}_{locale}`.
   - Example: `title_es`, `title_en`, `description_es`, `description_en`.
   - **Requirement**: When fetching data in `src/lib/sanity.ts`, ensure you handle the locale suffix correctly.

## TypeScript Configuration
- Targeting ES2022 with `esnext` modules.
- Strict mode is enabled (`"strict": true`).
- Path aliases: `@/*` maps to `./src/*`.

## Code Style & Architecture

### Component Patterns
- **Server Components**: Used for data fetching (Sanity GROQ queries in `page.tsx`).
- **Client Components**: Declared with `"use client"`. Used for GSAP animations, interactions, and providers.
- **Colocation**: Page-specific components live in `_`-prefixed directories next to their page (e.g., `src/app/[locale]/(website)/_sections/`).

### Animations (GSAP)
- Use the `useGSAP` hook for React-safe animations.
- **Scope**: Always pass a `scope` (ref to the container) to `useGSAP`.
- **Motion**: Respect `prefers-reduced-motion`.
- **Easing**: Prefer industrial/mechanical eases (`power4.out`, `expo.out`) over organic bounces.

### Anti-Patterns (DO NOT)
- **DO NOT** create global directories like `src/sections/` for single-page content. Use colocation.
- **DO NOT** extract small static arrays to separate files. Inline them.
- **DO NOT** add `"use client"` to top-level pages. Reserve it for interactive sub-components.

## Git Commits (Conventional Commits)
Follow [Conventional Commits](https://www.conventionalcommits.org/) with atomic commits.
- Format: `<type>[optional scope]: <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

## Deployment
- **Hosting**: Cloudflare Workers via OpenNext.
- **CI/CD**: GitHub Actions (lint → type-check → build → deploy).
- **Secrets**: Managed via GitHub Secrets and Wrangler.

---
*Refer to DESIGN.md for visual specifications and docs/ for deep architecture details.*
