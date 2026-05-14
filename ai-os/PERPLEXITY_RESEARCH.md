# Perplexity — Research Protocol

How to use Perplexity as the research and verification engine in this AI-OS.

---

## When to Use Perplexity

- Before building any integration — verify current pricing, API docs, and availability
- Before recommending a tool — confirm it still exists and does what you think it does
- Market research on note sellers, servicers, competitors
- State-specific foreclosure law and timeline research
- Finding current best practices before coding or automating anything

---

## Standard Research Prompts

### Tool/Integration Research
```
Research [TOOL NAME] for use in a small real estate note fund.

I need:
1. Current pricing (as of today)
2. API availability and documentation link
3. Key features relevant to [USE CASE]
4. Known limitations or complaints
5. Alternatives worth comparing

Source everything. I want citations.
```

### Market Research
```
Research the current market for [residential mortgage notes / NPLs / reperforming loans]:

1. Who are the primary tape sellers right now?
2. What are typical bid-to-cover ratios?
3. Current pricing trends (UPB discount ranges)
4. Best platforms to source deals (PaperStac, NotesDirect, etc.)
5. Any regulatory changes in the last 12 months affecting note buyers

Source everything.
```

### State Foreclosure Research
```
Research [STATE NAME] foreclosure process for residential mortgage note investors:

1. Judicial vs. non-judicial
2. Average timeline from NOD to REO
3. Estimated legal costs
4. Any recent law changes
5. Recommended local counsel or resources

Source everything.
```

---

## Logging Research

After every Perplexity research session:
1. Save the key findings in `01-context/research-[date]-[topic].md`
2. Note the date — Perplexity results age fast
3. Route verified findings to ChatGPT for architecture or Claude Code for building

---

## Perplexity Limitations to Know
- Results can still be wrong — cross-reference critical legal or financial data
- Pricing info is time-sensitive — re-verify before acting
- Always note the date of the research when saving findings
