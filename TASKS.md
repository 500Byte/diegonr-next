# Tasks

## Active

### P1 - Important (Fix before major sharing)

- [ ] **Image Alt Text** - Add descriptive alt to project and blog images
  - Files: `projects/[id]/page.tsx:150`, `blog/[id]/page.tsx:144`, `blog/page.tsx:78`
  - Impact: Screen readers can't describe images

- [ ] **Minimum Typography Size** - Review 8-10px text sizes
  - Files: BlogSection, Works, About sections
  - Impact: Mobile readability, consider 12px minimum

- [ ] **Blog Schema Consistency** - Clarify category (string) vs tags (array)
  - File: `sanity/schemaTypes/blogPostType.ts`
  - Impact: Content model confusion

### P2 - Enhancement (Nice to have)

- [ ] **Test Suite** - Add basic smoke tests with Vitest/Playwright
- [ ] **Cursor Motion Preference** - Respect prefers-reduced-motion in CustomCursor
- [ ] **Dynamic Robots.txt** - Add sitemap reference to robots.ts

### P3 - Future Polish

- [ ] **Bundle Analysis** - Run `npm run analyze` to check bundle size
- [ ] **PWA Complete** - Service worker with Workbox, full manifest
- [ ] **Social Preview Testing** - Verify OG images on Twitter/Facebook/LinkedIn

### i18n Implementation (Option B - Selected)
*Proper i18n with next-intl, ~12-16 hours, 1.5-2 days*

**Status**: DECIDED - Implementing Option B (full next-intl with /en routes)

#### Day 1 - Setup & UI Translations

- [ ] **i18n: Install & Configure** - Install next-intl, create config files
  - Install: `npm install next-intl`
  - Create: `src/i18n/config.ts`, `src/i18n/routing.ts`
  - Create: `src/middleware.ts` for locale routing
  - Est: 30 min

- [ ] **i18n: Create Translation Files** - Set up messages/es.json and messages/en.json
  - Navigation, Hero, Footer, Contact translations
  - Metadata translations
  - Est: 2-3 hours

- [ ] **i18n: Update Root Layout** - Integrate NextIntlClientProvider
  - Modify `src/app/layout.tsx`
  - Add generateStaticParams for locales
  - Est: 1 hour

- [ ] **i18n: Migrate Navigation & Footer** - Use useTranslations hook
  - Update Navigation with next-intl Link and toggle
  - Update Footer with translated strings
  - Est: 1-2 hours

#### Day 2 - Content & Testing

- [ ] **i18n: Dynamic Sanity Content** - Create locale-aware field selection
  - Create: `src/lib/i18n.ts` helper for field selection
  - Update services/[id]/page.tsx
  - Update projects/[id]/page.tsx
  - Est: 2-3 hours

- [ ] **i18n: Migrate All Sections** - Update _sections/* components
  - Hero, Works, Services, BlogSection, About, Vision
  - Use useTranslations for all static text
  - Est: 2-3 hours

- [ ] **i18n: Dynamic Metadata** - Update generateMetadata for all pages
  - Home, About, Projects, Services, Blog, Contact
  - Use getTranslations from next-intl/server
  - Est: 1 hour

- [ ] **i18n: Folder Restructure** - Move to [locale]/(website) structure
  - Create: `src/app/[locale]/(website)/`
  - Move all pages to new structure
  - Update imports and paths
  - Est: 30 min

- [ ] **i18n: Testing & Validation** - Full test suite
  - Toggle switches language correctly
  - URLs show /en for English
  - No hydration mismatches
  - Sanity content changes per locale
  - All links work in both languages
  - Est: 1-2 hours

### Recently Completed

- [x] ~~**Copy Audit & Documentation**~~ - COPYS.md verified and completed (2026-04-22)
  - **Status**: ✅ Complete - All copy documented and structured
  - **Added**: NewsletterSignup component (17 copy entries)
  - **Created**: Verification checklist with 16 files for i18n migration
  - **Version**: 1.1 (213 lines added)

- [x] **Multi-language Audit** - ✅ COMPLETED - See `docs/I18N_AUDIT.md`
  - **Status**: Audit complete, Option B selected for implementation
  - **Decision**: Full next-intl implementation with /en routes
  - **Timeline**: 1.5-2 days (12-16 hours estimated)

---

## Done

### Recently Completed (2026-04-22)

- [x] ~~**Navigation Semantics**~~ - Converted toggles to `<button>` with aria-label
- [x] ~~**Keyboard Nav & Focus States**~~ - Added focus-visible states
- [x] ~~**Contact Form ARIA**~~ - Added aria-live region
- [x] ~~**Hero Performance**~~ - Implemented throttling + RAF
- [x] ~~**Typography Readability**~~ - Changed text-[9px] to text-xs
- [x] ~~**Mobile Touch Targets**~~ - Increased padding to py-3
- [x] ~~**Theming Consistency**~~ - Added --color-error variable
- [x] ~~**Documentation Sync**~~ - Updated DEPENDENCIES.md
- [x] ~~**CMS Field Resilience**~~ - Added null-safety to sections
- [x] ~~**Project URL Field**~~ - Simplified to direct string
- [x] ~~**Animation Easing**~~ - Replaced power2.out with expo.out
- [x] ~~**SEO & Metadata**~~ - Added metadataBase
- [x] ~~**Sanity Schema Validation**~~ - Added required() fields
- [x] ~~**Sanity Blog Published**~~ - Added published boolean filter
- [x] ~~**Sanity API Version**~~ - Updated to '2025-01-01'
- [x] ~~**Sanity GROQ Projections**~~ - Reduced payload ~60-80%
- [x] ~~**Documentation**~~ - Created SANITY.md, updated all docs

---

## 📊 Project Status

**Overall Score: 85% - Very Good**

| Dimension | Score | Status |
|-----------|-------|--------|
| Code/Architecture | 9/10 | ✅ Excellent |
| Performance | 8/10 | ✅ Optimized |
| Design/UI | 9/10 | ✅ Distinctive |
| Accessibility | 7/10 | ⚠️ Minor fixes needed |
| SEO | 8/10 | ✅ Complete |
| Documentation | 10/10 | ✅ Exceptional |

**Ready for Production**: All critical items completed. 18 total improvements tracked (9 quick wins + 9 i18n implementation tasks).
