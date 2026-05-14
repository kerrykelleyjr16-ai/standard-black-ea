# ChatGPT / Codex — Review & Architecture Protocol

How to use ChatGPT as the strategic architect and reviewer in this AI-OS.

---

## When to Use ChatGPT

- Before building any major system, agent, or automation
- When reviewing architecture, prompts, or business logic
- When debugging complex reasoning or workflow design
- As a second opinion before major decisions
- When writing investment strategy, fund structure, or LP materials

---

## How to Run a Review Session

### For Architecture Review (pre-build)
Paste this into ChatGPT before Claude Code builds:

```
I'm building [DESCRIBE WHAT YOU'RE BUILDING] for Standard Black / Kasino Family Holdings.

Context:
- Company: Standard Black (multi-industry operating company, Phase I build)
- Primary focus: Real estate note fund platform
- Entity structure: Kasino Family Holdings → Standard Black
- Mission: Build generational ownership. Long-range Rockefeller-style family office.

What I need you to review:
[PASTE PLAN, PROMPT, OR SPEC HERE]

Review for:
1. Logic gaps or missing steps
2. Security or risk issues
3. Prompt quality and clarity
4. Business logic alignment
5. Anything I'm missing

Return: Specific changes, not general feedback.
```

### For Code Review (post-build)
```
Review this [code / workflow / automation] built by Claude Code.

[PASTE OUTPUT HERE]

Check for:
1. Logic errors
2. Security vulnerabilities
3. Edge cases not handled
4. Simplifications or improvements
5. Anything that could break in production

Return: Line-specific feedback.
```

---

## Logging Reviews

After every ChatGPT review session:
1. Paste key feedback into `12-reviews/[date]-[topic]-review.md`
2. Log the decision in `10-logs/decision_log.md`
3. Route approved changes back to Claude Code with `/build`

---

## ChatGPT Limitations to Know
- No file system access — always paste context manually
- Knowledge cutoff — verify current tool pricing/APIs with Perplexity first
- No memory between sessions — always paste relevant context at the start
