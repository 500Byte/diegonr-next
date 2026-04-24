# Tasks

## Active

- [ ] **[P2] Touch Targets** - Increase interactive element hit areas to 44x44px
  - Location: Navigation and Footer components
  - Standard: WCAG Target Size (Minimum) 2.5.8
  - Suggested: `/polish`

- [ ] **Image Alt Text** - Add descriptive alt to project and blog images
  - Files: `projects/[id]/page.tsx:150`, `blog/[id]/page.tsx:144`, `blog/page.tsx:78`

- [ ] **Minimum Typography Size** - Review 8-10px text sizes for mobile readability
  - Files: BlogSection, Works, About sections

- [ ] **Blog Schema Consistency** - Clarify category (string) vs tags (array)
  - File: `sanity/schemaTypes/blogPostType.ts`

- [ ] **Test Suite** - Add basic smoke tests with Vitest/Playwright

- [x] ~~**Cursor Motion Preference**~~ (2026-04-22) - Already implemented in CustomCursor

- [ ] **Dynamic Robots.txt** - Add sitemap reference to robots.ts

- [ ] **Bundle Analysis** - Run `npm run analyze` to check bundle size

## Waiting On

## Someday

- [ ] **BlogSection i18n** - Complete migration (uses Sanity data)
- [x] ~~**NewsletterSignup**~~ (2026-04-24) - Disabled, not needed for current strategy
  - Commented out in `contact/page.tsx`
  - Component remains in codebase but inactive
- [ ] **PWA Complete** - Service worker with Workbox, full manifest
- [ ] **Social Preview Testing** - Verify OG images on Twitter/Facebook/LinkedIn

## Done

- [x] ~~**i18n Full Implementation**~~ (2026-04-22)
  - Routes: `/es` and `/en`, language toggle, dynamic metadata
  - Commits: eefc246, 934a76f, 2c71801, 5d51db8

- [x] ~~**Copy Audit & Documentation**~~ (2026-04-22)
  - Created COPYS.md with all copy documented

- [x] ~~**Multi-language Audit**~~ (2026-04-22)
  - Decision: Full next-intl with /en routes

- [x] ~~**Navigation Semantics**~~ (2026-04-22)
- [x] ~~**Keyboard Nav & Focus States**~~ (2026-04-22)
- [x] ~~**Contact Form ARIA**~~ (2026-04-22)
- [x] ~~**Hero Performance**~~ (2026-04-22)
- [x] ~~**Typography Readability**~~ (2026-04-22)
- [x] ~~**Mobile Touch Targets**~~ (2026-04-22)
- [x] ~~**Theming Consistency**~~ (2026-04-22)
- [x] ~~**Documentation Sync**~~ (2026-04-22)
- [x] ~~**CMS Field Resilience**~~ (2026-04-22)
- [x] ~~**Project URL Field**~~ (2026-04-22)
- [x] ~~**Animation Easing**~~ (2026-04-22)
- [x] ~~**SEO & Metadata**~~ (2026-04-22)
- [x] ~~**Sanity Schema Validation**~~ (2026-04-22)
- [x] ~~**Sanity Blog Published**~~ (2026-04-22)
- [x] ~~**Sanity API Version**~~ (2026-04-22)
- [x] ~~**Sanity GROQ Projections**~~ (2026-04-22)
- [x] ~~**Sanity Documentation**~~ (2026-04-22)
- [x] ~~**Hook Order Fixes**~~ (2026-04-22)
- [x] ~~**Contact Metadata Escape**~~ (2026-04-22)
- [x] ~~**Remove Preloader**~~ (2026-04-22)
- [x] ~~**Remove Obsolete Files**~~ (2026-04-22)
- [x] ~~**Static Generation Support**~~ (2026-04-22)
- [x] ~~**Hydration Warning Fix**~~ (2026-04-22)
- [x] ~~**Theme Toggle ARIA**~~ (2026-04-22)
- [x] ~~**Transfer Audit Report**~~ (2026-04-22)
- [x] ~~**Agent Skills Guidelines**~~ (2026-04-22)
- [x] ~~**P0 Mobile Navigation**~~ (2026-04-22)
  - Fullscreen mobile menu with GSAP animations
  - Panel reveal, staggered links, text scramble hover effect
  - Theme toggle, language switcher, contact info in footer
  - Commit: ab3a0df

- [x] ~~**Animation Timing & Motion Preferences**~~ (2026-04-22)
  - Fixed Hero delay: 2000ms → 300ms (no more waiting for removed preloader)
  - Added prefers-reduced-motion checks to all GSAP components
  - ScrollTrigger animations now use once: true (play once, not reverse)
  - MobileMenu skips animations when reduced motion preferred
  - Commit: 6f2c75d

- [x] ~~**Vision Section i18n**~~ (2026-04-24)
  - Migrated static content to i18n system
  - Fixed: Component now uses `useTranslations` hook
  - All labels, headings, tabs, and content are now translatable
  - Content in `/messages/es.json` and `/messages/en.json`
  - Labels: `[04 — PRINCIPLES]` / `[05 — PRINCIPIOS]` (corrected numbering)

- [x] ~~**Copy Update: Design Engineer Positioning**~~ (2026-04-24)
  - Repositioned from "Solutions Architect & Full-Stack Developer" to "Design Engineer"
  - Updated years: 5+ → 8+ years experience
  - Voz impersonal absoluta (no tú/Usted)
  - Términos estándar: PROYECTOS, SERVICIOS, ABOUT
  - Files: `messages/es.json`, `messages/en.json`, `Vision.tsx`, `page.tsx`

- [x] ~~**Remove GitHubStats & SocialActivityFeed**~~ (2026-04-24)
  - Deleted components: `GitHubStats.tsx`, `SocialActivityFeed.tsx`
  - Removed from `about/page.tsx`
  - Removed unused translation keys: `presence_title`, `presence_description`
  - Components not aligned with portfolio strategy

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
