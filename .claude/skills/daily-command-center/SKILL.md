# Skill: Daily Command Center

**Invoke when:** Kerry starts a work session and needs to orient, prioritize, and route the day's tasks.

---

## Inputs
- Today's date (or ask)
- Any pressing items Kerry mentions
- Optional: yesterday's open items

## Workflow

### Step 1 — Read Current State
Read these files before saying anything:
- `context/current-priorities.md`
- `context/goals.md`
- `decisions/log.md` (last 5 entries)
- `ai-os/AUTOMATION_REGISTRY.md` (any pending automations)

### Step 2 — Surface What Matters Today
Report:
- Top 3 active priorities and where each stands
- Any deadlines in the next 7 days
- Is today Thursday? → Weekly team check-in
- Is today the 25th? → Collect team payments
- Is today the 28th? → Payment due
- Any pending human approvals sitting in `ai-os/10-logs/approval_log.md`

### Step 3 — Route Today's Tasks
For each task Kerry raises, apply the AI Router:
- Build task → Claude Code
- Research task → Perplexity
- Strategy/review task → ChatGPT
- Log the routing decision

### Step 4 — Set the Day's Top 3
Ask Kerry: "What are your top 3 for today?" Lock them in. Reference them at session close.

### Step 5 — Session Close (when Kerry wraps up)
- What got done
- What's open
- Any decisions to log in `decisions/log.md`
- Any context files to update

## Output Format
Daily briefing: bullet list, no headers, max 10 lines. Then route tasks as they come.
