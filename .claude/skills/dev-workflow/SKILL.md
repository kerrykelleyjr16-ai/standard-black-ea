---
name: dev-workflow
description: Use when building any system, tool, automation, or integration for Standard Black — note business, entity ops, team coordination, MCP tools, or skills. Triggers when asked to build, create, implement, or automate anything in this workspace.
---

# Standard Black Dev Workflow

## Overview

Structured build process for everything Kerry builds inside this workspace. Enforces discipline — brainstorm before building, plan before coding, verify before calling complete — tailored to Standard Black's stack and business domains.

## When to Use

- Building or modifying a skill (`.claude/skills/`)
- Building an automation, MCP integration, or AI workflow
- Implementing any tool for note business, team ops, or entity management
- Any task where code or structured documents will be produced

## Core Workflow

Follow this sequence. Do not skip phases.

```
BRAINSTORM → PLAN → BUILD → VERIFY → LOG
```

### 1. Brainstorm
**REQUIRED SKILL:** `superpowers:brainstorming`

Before touching any file, invoke brainstorming. Clarify what's being built, why, and for which domain. Surface edge cases and integration points upfront.

### 2. Plan
**REQUIRED SKILL:** `superpowers:writing-plans`

For any build with 3+ steps, write a plan first. Identify files to create/edit, dependencies, and the order of operations.

### 3. Build
**REQUIRED SKILL:** `superpowers:test-driven-development` (for code)
**REQUIRED SKILL:** `superpowers:writing-skills` (for skill files)

For code: write the test first, watch it fail, then implement.
For skill files: establish baseline behavior first, then write the skill.

If blocked or something breaks mid-build:
**REQUIRED SKILL:** `superpowers:systematic-debugging`

### 4. Verify
**REQUIRED SKILL:** `superpowers:verification-before-completion`

Do not claim the task is complete without running verification. Confirm the output works as intended.

### 5. Log
Log meaningful decisions in `decisions/log.md`:
`[YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: ...`

---

## Standard Black Domain Map

| Domain | Location | Key Tools |
|---|---|---|
| Note business | `projects/` + `references/long-term-portfolio-playbook.md` | `note-investing-underwriter`, `note-underwriting` |
| Team ops | `context/team.md`, `projects/team-payment-structure/` | `business-task-manager`, `sop-builder` |
| Automation / AI | `.claude/skills/`, `ai-os/` | `automation-planner`, `mcp-integration-builder` |
| Entity / finance | `context/work.md`, `references/` | `finance-dashboard-builder`, `acquisition-analyzer` |
| Email / calendar | Gmail + Google Calendar (MCP live) | `email-draft-reviewer`, `meeting-prep` |
| Sales | Car sales workflow, ad creation | `car-sales-workflow`, `ad-creation` |

---

## Quick Rules

- Never build without brainstorming first — even for small tasks
- Skills live in `.claude/skills/skill-name/SKILL.md`
- Decisions get logged — no significant choice is undocumented
- MCP tools (Gmail, Calendar, Drive) are live — use them, don't simulate
- External content follows southern hospitality voice — warm, direct, not a press release
- Internal content is direct and applicable — lead with the answer

## Common Mistakes

| Mistake | Fix |
|---|---|
| Skipping brainstorm because task seems simple | Simple tasks have hidden complexity. Brainstorm always. |
| Creating a skill without testing baseline behavior | Untested skills have gaps. Follow `superpowers:writing-skills`. |
| Claiming complete without verifying output | Run `superpowers:verification-before-completion` first. |
| Writing to wrong domain folder | Check domain map above before creating files. |
| Not logging a decision | If it changed direction, it gets logged. |
