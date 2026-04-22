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

**Ready for Production**: All critical items completed. 9 post-launch improvements in Active.
