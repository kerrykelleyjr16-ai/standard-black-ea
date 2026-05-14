# Skill: Code Review Coordinator

**Invoke when:** Claude Code has built something that needs ChatGPT's review before finalizing — any automation, workflow, agent logic, or complex prompt.

---

## Inputs
- What was built (file path or pasted content)
- What it's supposed to do
- Any specific concerns to check

## Workflow

### Step 1 — Package the Review Request
Prepare a review brief for ChatGPT containing:
1. What this is (automation / workflow / agent / prompt / script)
2. What it's supposed to do
3. What to check (logic, security, edge cases, business alignment)
4. Any constraints (no external sends without approval, no PII in files, etc.)

### Step 2 — Generate the ChatGPT Prompt
Output a ready-to-paste prompt for ChatGPT:

```
Review this [TYPE] built for Standard Black / Kasino Family Holdings.

Context:
- Purpose: [WHAT IT DOES]
- Domain: [NOTE BUSINESS / TEAM OPS / AUTOMATION]
- Constraints: No external sends without human approval. No PII in markdown. Logs must be append-only.

[PASTE CONTENT HERE]

Review for:
1. Logic errors or gaps
2. Security issues (credentials, PII, external sends)
3. Edge cases not handled
4. Business logic alignment
5. Improvements or simplifications

Return: Specific line-by-line feedback, not general observations.
```

### Step 3 — Receive and Apply Feedback
When Kerry pastes ChatGPT's feedback back:
- Categorize each item: Critical / Important / Minor
- Apply Critical and Important items immediately
- Flag Minor items for Kerry's decision
- Log what changed in `ai-os/12-reviews/[date]-[topic]-review.md`

### Step 4 — Final Check
After applying fixes, run `/secure` on anything touching external systems or sensitive data.

## Output Format
- Review brief (ready to paste into ChatGPT)
- After feedback received: change log with critical / important / minor breakdown
