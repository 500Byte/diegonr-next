# GEMINI.md Skill Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `GEMINI.md` to formally document and enforce the usage of the Agent Skill system (Superpowers).

**Architecture:** Add a new technical section for Skill Integration and a Tool Mapping reference.

**Tech Stack:** Markdown

---

### Task 1: Update GEMINI.md with Agent Skill Integration

**Files:**
- Modify: `GEMINI.md`

- [ ] **Step 1: Read GEMINI.md to ensure context for insertion**

- [ ] **Step 2: Add "Agent Skill Integration" section after "Critical Rules"**

```markdown
## Agent Skill Integration

This repository utilizes a structured Skill system (Superpowers) to ensure high-quality, consistent, and verified contributions.

- **Mandatory Skill Activation**: Before performing any task or if there is even a 1% chance a skill applies, you **MUST** invoke `activate_skill(name="using-superpowers")`.
- **Brainstorming Hard Gate**: Any creative work, feature implementation, or complex refactoring **MUST** start with the `brainstorming` skill. No implementation actions should be taken until a design is approved.
- **Priority of Instructions**: 
  1. User direct requests and project-specific docs (`AGENTS.md`, `GEMINI.md`).
  2. Loaded Skills (Superpowers).
  3. Default system prompt.

## Technical Tool Mapping

When following skill instructions, map abstract tool names to their Gemini CLI equivalents:

| Abstract Tool | Gemini CLI Tool |
| :--- | :--- |
| `Skill` / `skill` | `activate_skill` |
| `Read` | `read` |
| `Edit` | `edit` |
| `Bash` | `bash` |
| `Write` | `write` |
| `TodoWrite` | `todowrite` |
| `Grep` | `grep` |
| `Glob` | `glob` |

Skills-provided documentation and plans should be stored in `docs/superpowers/specs/` and `docs/superpowers/plans/` respectively.
```

- [ ] **Step 3: Verify content formatting**

- [ ] **Step 4: Commit the changes**

```bash
git add GEMINI.md
git commit -m "docs: integrate agent skill system and tool mapping in GEMINI.md"
```
