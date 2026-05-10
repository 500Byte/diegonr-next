# Documentation Coherence Alignment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `GEMINI.md` and `AGENTS.md` with the current state of the codebase (Next.js v16, test directories, and technical stack).

**Architecture:** Documentation updates to ensure the agent's "mental model" matches the physical files and dependencies.

**Tech Stack:** Markdown

---

### Task 1: Update AGENTS.md for Test Directory and Tech Precision

**Files:**
- Modify: `AGENTS.md`

- [ ] **Step 1: Read AGENTS.md to identify lines for replacement**

- [ ] **Step 2: Update "Testing Instructions" to remove generic "tests/" references**

```markdown
## Testing Instructions
The project uses **Playwright** for end-to-end and smoke testing.
- Run all tests: `npx playwright test`
- Run tests in UI mode: `npx playwright test --ui`
- View test report: `npx playwright show-report`
- **Location**: E2E tests are located exclusively in the `e2e/` directory.
- **Requirement**: New features or major UI updates should include a basic smoke test in `e2e/smoke.spec.ts` or a new spec file.
```

- [ ] **Step 3: Update "Project Overview" to mention Next.js 16**

```markdown
## Project Overview
A modern, animated personal portfolio and professional services website built for a **Design Engineer / Full-Stack** using Next.js 16 (Canary/Future). It features high-end GSAP animations, custom Sanity Cloud CMS integration, and a sophisticated Swiss-Brutalist design system.
```

- [ ] **Step 4: Commit AGENTS.md changes**

```bash
git add AGENTS.md
git commit -m "docs: align AGENTS.md with Next.js 16 and exact test directory"
```

---

### Task 2: Update GEMINI.md for Version and Tech Consistency

**Files:**
- Modify: `GEMINI.md`

- [ ] **Step 1: Update "Tech Stack" section to specify Next.js 16**

```markdown
## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript/JavaScript
- Styling: Tailwind CSS v4
...
```

- [ ] **Step 2: Add "Transitions" to animation conventions**

```markdown
- **Animation logic**: Encapsulated within `useGSAP` hooks with explicit `scope` references. Shared transitions are located in `src/components/transitions/`.
```

- [ ] **Step 3: Commit GEMINI.md changes**

```bash
git add GEMINI.md
git commit -m "docs: update GEMINI.md tech stack and animation conventions"
```
