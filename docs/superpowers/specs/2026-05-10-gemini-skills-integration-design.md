# Design Spec: GEMINI.md Skill Integration
Date: 2026-05-10
Topic: Integrating Agent Skill system into GEMINI.md

## Overview
Update the project's `GEMINI.md` to formally document and enforce the usage of the Agent Skill system (Superpowers). This ensures the agent follows structured workflows for brainstorming, designing, and implementing features.

## Proposed Changes

### 1. New Section: "Agent Skill Integration"
This section will define the core operational mandates for the agent:
- **Mandatory Skill Activation**: Requirement to invoke `using-superpowers` at the start of any interaction or when ambiguity arises (1% rule).
- **Hard Gates**: Enforcement of the `brainstorming` skill before any implementation or code modification.
- **Workflow Priority**: User instructions (AGENTS.md, etc.) > Skills > Default System Prompt.

### 2. New Section: "Technical Tool Mapping"
A reference guide to map abstract tool names used in skills to the actual Gemini CLI tools:
- `Skill` / `skill` -> `activate_skill`
- `Read` -> `read`
- `Edit` -> `edit`
- `Bash` -> `bash`
- `Write` -> `write`
- `TodoWrite` -> `todowrite`

### 3. Critical Rules Update
Add a rule regarding the strict adherence to skill-provided checklists and documentation paths (`docs/superpowers/specs/`).

## Architecture & Data Flow
The skills are loaded via the `activate_skill` tool. Once loaded, they provide specific instructions that override or augment the agent's default behavior for the duration of the task.

## Verification Plan
1. Manually verify `GEMINI.md` content after update.
2. Ensure the agent can correctly reference the new section in future interactions.
