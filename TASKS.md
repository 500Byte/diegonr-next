# Tasks

## Active

- [ ] **[P0] Mobile Navigation** - Implement hamburger menu for viewports < 640px
  - Location: `src/components/Navigation.tsx`, lines 155-170
  - Issue: Navigation links overflow horizontally on mobile
  - Suggested: `/adapt`

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

- [ ] **Cursor Motion Preference** - Respect prefers-reduced-motion in CustomCursor

- [ ] **Dynamic Robots.txt** - Add sitemap reference to robots.ts

- [ ] **Bundle Analysis** - Run `npm run analyze` to check bundle size

## Waiting On

## Someday

- [ ] **BlogSection i18n** - Complete migration (uses Sanity data)
- [ ] **Vision section i18n** - Complete migration (static content)
- [ ] **NewsletterSignup i18n** - Complete form translations
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
