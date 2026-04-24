# Tasks

## Active

- [ ] **[P2] Touch Targets** - Increase interactive element hit areas to 44x44px
  - Location: Navigation and Footer components
  - Standard: WCAG Target Size (Minimum) 2.5.8
  - Run: `npm run dev` → inspect touch areas

- [ ] **[P2] Image Alt Text** - Add descriptive alt to project and blog images
  - Files: `projects/[id]/page.tsx:150`, `blog/[id]/page.tsx:144`, `blog/page.tsx:78`
  - Improves accessibility score

- [ ] **[P2] Minimum Typography Size** - Review 8-10px text sizes for mobile readability
  - Files: BlogSection, Works, About sections
  - Some elements may be hard to read on mobile

- [ ] **[P3] Blog Schema Consistency** - Clarify category (string) vs tags (array)
  - File: `sanity/schemaTypes/blogPostType.ts`
  - Technical debt: current implementation is confusing

- [ ] **[P3] Dynamic Robots.txt** - Add sitemap reference to robots.ts
  - Improves SEO crawling

- [ ] **[P3] Bundle Analysis** - Run `npm run analyze` to check bundle size
  - Identify opportunities for code splitting

## Waiting On

## Someday

- [ ] **PWA Complete** - Service worker with Workbox, full manifest
  - Nice-to-have feature for offline access

- [ ] **Social Preview Testing** - Verify OG images on Twitter/Facebook/LinkedIn
  - Manual testing when content changes

## Done

### April 2026

- [x] ~~**Playwright Test Suite**~~ (2026-04-24)
  - 11 smoke tests covering all critical pages in ES/EN
  - Tests verify: 200 status, no 500 errors, no critical console errors
  - Pages covered: Home, About, Projects, Blog, Contact (both locales)
  - Fixed i18n JSON syntax error in `messages/en.json`
  - Added missing `"use client"` directive to `ContactForm.tsx`
  - Commits: `7dc62e5`

- [x] ~~**Next.js 16 Proxy Migration**~~ (2026-04-24)
  - Renamed `middleware.ts` → `proxy.ts` per Next.js 16 convention
  - Removed redundant no-cache headers from proxy (handled by next.config.mjs)
  - Commits: `7dc62e5`, `8cd40b0`

- [x] ~~**Cache Headers Cleanup**~~ (2026-04-24)
  - Removed invalid `incrementalCacheHandlerPath` from next.config.mjs
  - Removed problematic `/_next/:path*` Cache-Control rule (Next.js warning)
  - Keep `/:path*` rule for dynamic pages in development
  - Commits: `7dc62e5`, `a5b2d87`

- [x] ~~**i18n Complete Implementation - All Phases**~~ (2026-04-24)
  - Phase 1: BlogSection & Marquees → `ba6a46e`
  - Phase 2: Content pages (about, contact, blog, services, projects) → `e790c61`
  - Phase 3: Detail pages (blog/[id], projects/[id], services/[id]) → `282286e`
  - Phase 4: ContactForm with full validation & options → `df636bc`
  - Phase 5: Cleanup GitHubStats & SocialActivityFeed → `18b0308`
  - Phase 6: OG route localization → `ad55b92`
  - Total: 14 namespaces, ~120 translation keys
  - Coverage: 100% of user-facing content
  - Approach: Voz impersonal, technical precision

- [x] ~~**Remove GitHubStats & SocialActivityFeed**~~ (2026-04-24)
  - Deleted components: `GitHubStats.tsx`, `SocialActivityFeed.tsx`
  - Removed from `about/page.tsx`
  - Removed unused translation keys: `presence_title`, `presence_description`
  - Components not aligned with portfolio strategy

- [x] ~~**Copy Update: Design Engineer Positioning**~~ (2026-04-24)
  - Repositioned from "Solutions Architect & Full-Stack Developer" to "Design Engineer"
  - Updated years: 5+ → 8+ years experience
  - Voz impersonal absoluta (no tú/Usted)
  - Términos estándar: PROYECTOS, SERVICIOS, ABOUT
  - Files: `messages/es.json`, `messages/en.json`, `Vision.tsx`, `page.tsx`

- [x] ~~**Vision Section i18n**~~ (2026-04-24)
  - Migrated static content to i18n system
  - Fixed: Component now uses `useTranslations` hook
  - All labels, headings, tabs, and content are now translatable
  - Content in `/messages/es.json` and `/messages/en.json`
  - Labels: `[04 — PRINCIPLES]` / `[05 — PRINCIPIOS]` (corrected numbering)

- [x] ~~**BlogSection i18n**~~ (2026-04-24)
  - Complete migration of BlogSection component
  - Uses `useTranslations('BlogSection')` for all content
  - Part of Phase 1 i18n implementation

### Pre-April 2026 (Archived)

*See git history for detailed commit logs. Key milestones:*

- i18n Full Implementation - Routes: `/es` and `/en`, language toggle, dynamic metadata
- Copy Audit & Documentation
- Multi-language Audit (next-intl with /en routes)
- Navigation Semantics, Keyboard Nav & Focus States
- Contact Form ARIA, Hero Performance, Typography Readability
- Mobile Touch Targets, Theming Consistency, Documentation Sync
- CMS Field Resilience, Project URL Field, Animation Easing
- SEO & Metadata, Sanity Schema Validation, Sanity Blog Published
- Sanity API Version, Sanity GROQ Projections, Sanity Documentation
- Hook Order Fixes, Contact Metadata Escape
- Remove Preloader, Remove Obsolete Files
- Static Generation Support, Hydration Warning Fix
- Theme Toggle ARIA, Transfer Audit Report
- Agent Skills Guidelines, P0 Mobile Navigation
- Animation Timing & Motion Preferences

### Disabled / Not Needed

- [x] ~~**NewsletterSignup**~~ (2026-04-24) - Disabled, not needed for current strategy
  - Commented out in `contact/page.tsx`
  - Component deleted from codebase
  - Can be re-enabled if strategy changes
