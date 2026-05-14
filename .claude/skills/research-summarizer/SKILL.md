# Skill: Research Summarizer

**Invoke when:** Kerry has research output from Perplexity, a report, article, or web findings and needs it structured into actionable intelligence.

---

## Inputs
- Raw research (paste Perplexity output, article text, or describe the topic)
- What Kerry needs to decide or build based on this research
- Domain: note business / Standard Black / team ops / entity structure / market

## Workflow

### Step 1 — Identify What This Research Is For
- What decision does this inform?
- What's being built based on this?
- Who needs to act on it?

### Step 2 — Extract the Signal
Pull out:
- The core finding (what is actually true / current)
- Key data points (prices, timelines, rates, names)
- Anything that changes what we'd do
- Anything outdated or unverified

### Step 3 — Flag Risks and Gaps
- Is any of this information time-sensitive?
- Is there anything that needs verification before acting?
- Are there conflicting sources?

### Step 4 — Route to Action
Based on findings:
- If it informs a build → route to `/build` with the findings as context
- If it changes a strategy → route to `/architect` with ChatGPT
- If it reveals a risk → flag for Kerry's review
- If it's a reference only → save to `ai-os/01-context/`

### Step 5 — Save the Summary
Save to `ai-os/01-context/research-[YYYY-MM-DD]-[topic].md` with:
- Date of research
- Source(s)
- Key findings
- Action items
- Expiration note (when this info should be re-verified)

## Output Format
- TL;DR (2 sentences max)
- Key findings (bullets)
- Action items (bullets with owner)
- Risks or gaps (if any)
- Expiration: re-verify by [date]
