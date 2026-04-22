# Tasks

## Critical (Priority 0)
*Accessibility & WCAG compliance*

✅ **All Priority 0 tasks completed** - See Done section for details

## High (Priority 1)
*Performance & UX refinement*

✅ **All Priority 1 tasks completed** - See Done section for details

## Medium (Priority 2)
*System integrity & maintenance*

✅ **All Priority 2 tasks completed** - See Done section for details

## Low (Priority 3)
*Polish & optimization*

- [ ] **Animation Easing** - Replace default eases with custom expo.out or custom-bezier
- [ ] **SEO & Metadata** - Double-check metadataBase and OG images absolute URLs
- [ ] **Sanity: Schema Validation** - Add required() validation to title, slug, year fields
- [ ] **Sanity: Blog Posts Active** - Add filter for published/draft status
- [ ] **Sanity: API Version** - Update to '2025-01-01'
- [ ] **Sanity: GROQ Projections** - Use projections for list queries to reduce payload

## Done
*Completed items move here*

### Priority 0 (Critical) - Accessibility
- [x] ~~**Fix Navigation Semantics**~~ - Converted language/theme toggle to `<button>` with aria-label and aria-pressed (2026-04-22)
- [x] ~~**Keyboard Nav & Focus States**~~ - Added focus-visible:outline-none and focus-visible:ring to all interactive elements (2026-04-22)
- [x] ~~**Contact Form ARIA**~~ - Added aria-live="polite" region for screen reader announcements (2026-04-22)

### Priority 1 (High) - Performance & UX
- [x] ~~**Hero Performance**~~ - Implemented throttling (100ms) + RAF for mouse tracking to reduce re-renders (2026-04-22)
- [x] ~~**Typography Readability**~~ - Changed text-[9px] to text-xs (12px) in Navigation links (2026-04-22)
- [x] ~~**Mobile Touch Targets**~~ - Increased padding from py-2 to py-3 (12px) for 44px+ hit area (2026-04-22)
- [x] ~~**Theming Consistency**~~ - Added --color-error CSS variable, replaced text-red-400 (10 files) (2026-04-22)

### Priority 2 (Medium) - System Integrity
- [x] ~~**Documentation Sync**~~ - Updated DEPENDENCIES.md with missing packages (2026-04-22)
- [x] ~~**CMS Field Resilience**~~ - Added null-safety to Works, Services, BlogSection components (2026-04-22)
- [x] ~~**Project URL Field**~~ - Simplified project.url from object to direct string (2026-04-22)

### Documentation Updates
- [x] ~~Documentation: SANITY.md~~ - Created comprehensive CMS documentation (2026-04-22)
- [x] ~~Documentation: Cross-references~~ - Updated ARCHITECTURE, CODING_STANDARDS, DEPENDENCIES (2026-04-22)
- [x] ~~AGENTS.md: Commands~~ - Added type-check, lint:fix, preview commands (2026-04-22)
- [x] ~~DEPLOYMENT.md: compatibility_date~~ - Added quarterly update comment (2026-04-22)
- [x] ~~DEPLOYMENT.md: wrangler types~~ - Added wrangler types and .dev.vars sections (2026-04-22)
- [x] ~~AGENTS.md + CONTRIBUTING.md~~ - Added atomic commit policy (conventional commits) (2026-04-22)