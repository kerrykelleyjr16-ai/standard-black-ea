# Skill: Business Task Manager

**Invoke when:** Kerry needs to capture, prioritize, assign, or track tasks across Standard Black, the note business, or team operations.

---

## Inputs
- Task(s) to add, update, or review
- Optional: domain (note business / Standard Black brand / team ops / entity structure)
- Optional: owner (Kerry / Kody / TJ)

## Workflow

### Step 1 — Capture
For each task, collect:
- What is it? (specific, not vague)
- Who owns it? (one name)
- What does done look like?
- When is it due? (specific date)

If any of the four are missing, ask before proceeding.

### Step 2 — Prioritize
Score each task:
- Is this tied to a current Q2 goal? (high)
- Does it unblock someone else? (high)
- Is there a hard deadline? (high)
- Is it a recurring admin task? (low)

### Step 3 — Assign
Route to the right owner:
- Open-ended strategy or capital decisions → Kerry
- Defined execution tasks with a playbook → TJ
- Operating company tasks being developed → Kody

### Step 4 — Log
Any task with money, legal, or external communication implications gets flagged for human approval (check `ai-os/HUMAN_APPROVAL_RULES.md`).

Log significant task decisions in `decisions/log.md`.

### Step 5 — Report
Return a clean task list:
| Task | Owner | Due | Priority | Status |
|---|---|---|---|---|

## Output Format
Task table + any flags for approval or blockers. Plain and direct.
