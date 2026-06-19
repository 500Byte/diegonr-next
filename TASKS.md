# Tasks

## Active

### Roadmap: Portfolio Expansion
- [ ] **Step 1: Research & Drafting**
  - Audit GitHub repos for AutoQA, Scrapers, and Plugins to select the best candidates.
  - Draft technical descriptions in Markdown for the selected projects.
  - Identify key metrics/results for each tool.
- [ ] **Step 2: Visual & UI Prep**
  - Design terminal-style screenshots or technical flowcharts for the project gallery.
  - Define the "Tools/Lab" UI pattern in the project listing.
- [ ] **Step 3: CMS & Content Sync**
  - Create/Update project documents in Sanity for the selected tools.
  - Link GitHub repositories as the primary "Source Code" CTA.
- [ ] **Step 4: Validation**
  - Verify that the new "Engineering" projects display correctly in the frontend.
  - Run Playwright smoke tests on the updated portfolio pages.

### Maintenance
- [x] **High: Skip Link for Main Content** (2026-06-19)
  - Add skip link as first focusable element
  - Improves keyboard navigation WCAG compliance
- [x] **Medium: Button Types Missing** (2026-06-19)
  - Add `type="button"` to non-submit buttons
  - Files: `Footer.tsx:77`, `Vision.tsx:52`, `offline/page.tsx:38`
- [x] **Medium: Dead Links in Footer** (2026-06-19)
  - Fix `href="#"` to real URLs or remove
  - Files: `Footer.tsx:46-47` (Twitter, Instagram placeholder links)
- [x] **Medium: CSS Duplicate Selector** (2026-06-19)
  - Fix duplicate `.light` selector in `src/index.css:24-35`
  - Remove redundant lines 31-35
- [ ] **Medium: GROQ Fields (revisar uso real)**
  - Add `description_en` to projects query if used in UI
  - Add `excerpt` to blog posts query if used in UI
  - File: `src/lib/sanity.ts`
  - ⚠️ Only if these fields are actually used in the frontend
- [ ] **Low: Update Outdated Dependencies**
  - Optional: `npm update` for patch versions
  - Priority: lucide-react (major), typescript, @types/node
- [ ] **Low: Scroll-margin-top on Anchor Links**
  - Add `scroll-margin-top` to headings with id attributes
  - Improves anchor navigation UX

## Waiting On

## Someday

### Backlog
- [ ] **Signature Project: Headless Architecture Showcase** - Recreate a legacy landing using Next.js + WordPress Headless.
- [ ] **GitHub Open Source Section** - Design a dedicated UI area for personal plugins and scripts.

## Done

### May 2026

- [x] ~~**Comprehensive Rebranding & IA Alignment**~~ (2026-05-10)
  - Updated identity from "Solutions Architect" to "Design Engineer / Full-Stack" site-wide.
  - Refined narrative to emphasize "Architecture through Automation" and Orbidi accomplishments.
  - Integrated WordPress into the core technical stack (Hero, About, Marquees).
  - Synchronized Sanity CMS services with new engineering focus (Content Architecture, Design Systems Engineering, Automation & Tooling).
  - Upgraded AGENTS.md and GEMINI.md to Gold Standard for AI operational guidance and Skill Integration.
  - Updated metadata, SEO keywords, and Open Graph routes for total consistency.
  - Aligned documentation with Next.js 16 and exact E2E test directories.
  - Established Task Management Taxonomy (Roadmap, Maintenance, Backlog).
  - Files: `messages/es.json`, `messages/en.json`, `AGENTS.md`, `GEMINI.md`, `About.tsx`, `Hero.tsx`, `services/page.tsx`, `og/route.tsx`.

### April 2026

- [x] ~~**Establecer logo**~~ (2026-04-24)
- [x] ~~**[P2] Minimum Typography Size**~~ (2026-04-24)
- [x] ~~**[P2] Image Alt Text**~~ (2026-04-24)
- [x] ~~**[P2] Touch Targets**~~ (2026-04-24)
- [x] ~~**Playwright Test Suite**~~ (2026-04-24)
- [x] ~~**Next.js 16 Proxy Migration**~~ (2026-04-24)
- [x] ~~**Cache Headers Cleanup**~~ (2026-04-24)
- [x] ~~**i18n Complete Implementation - All Phases**~~ (2026-04-24)
- [x] ~~**Remove GitHubStats & Social Activity Feed**~~ (2026-04-24)
- [x] ~~**Copy Update: Design Engineer Positioning**~~ (2026-04-24)
- [x] ~~**Vision Section i18n**~~ (2026-04-24)
- [x] ~~**BlogSection i18n**~~ (2026-04-24)

### Disabled / Not Needed

- [x] ~~**PWA Complete**~~ (2026-04-24)
- [x] ~~**Social Preview Testing**~~ (2026-04-24)
- [x] ~~**NewsletterSignup**~~ (2026-04-24)
