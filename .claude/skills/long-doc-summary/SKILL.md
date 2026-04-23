# Skill: Long Document Summary

## Trigger
Use this skill when Kerry needs to extract the essential content from a long document — course material, reports, playbooks, legal documents, articles, or research. Delivers a tiered summary so Kerry gets what he needs without reading the whole thing.

## Inputs Needed
- The document (paste text, share file, or describe the source)
- Context: what is this document and why is Kerry reading it?
- Priority: what does Kerry most need to extract? (key decisions, action items, concepts, or general overview)

---

## Workflow

1. **Identify document type** — course lesson, legal doc, market report, business plan, article, etc.
2. **Scan for structure** — headings, sections, key arguments
3. **Extract the core** — thesis, main points, action items, critical terms
4. **Build tiered summary** — see format below
5. **Flag for Kerry** — anything that requires a decision, follow-up, or deeper read

---

## Output Format (Tiered Summary)

### TL;DR
[3 sentences max. What is this document, what's the main point, and what should Kerry take away from it?]

---

### Key Points
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4]
- [Point 5]
*(Add more only if genuinely important — don't pad)*

---

### Action Items
*(Only include if the document contains specific actions, next steps, or decisions)*
- [ ] [Action] — [Who / When]
- [ ] [Action] — [Who / When]

---

### Key Terms / Concepts to Know
*(Only for technical, legal, or educational documents)*
- **[Term]:** [Plain-English definition]
- **[Term]:** [Plain-English definition]

---

### Worth Revisiting
*(Specific sections, quotes, or passages Kerry should go back and read directly)*
- "[Quote or section title]" — [Why it matters]

---

## Document-Type Notes

### Course Material (Desi Arnez / Note Investing)
- Focus on: workflow steps, buy-box criteria, underwriting rules, red flags, and any formulas or checklists
- Flag anything that should be added to the `note-underwriting` skill or an SOP
- Note which lesson it came from so Kerry can reference it later

### Legal Documents
- Focus on: obligations, deadlines, rights, definitions, and anything that requires Kerry's signature or decision
- Do NOT interpret legal advice — flag anything material for legal counsel review
- Plain-English the key clauses

### Market Reports / Research
- Focus on: the headline finding, supporting data, and what it means for Kerry's specific situation
- Cut the filler — reports are usually 20% signal, 80% padding

### Business Plans / Proposals
- Focus on: what's being asked, the economics, the timeline, and the risks
- Flag anything that needs a decision or response

---

## Output Calibration
- Short doc (under 5 pages): deliver full tiered summary
- Medium doc (5–20 pages): TL;DR + key points + action items only, flag sections worth reading directly
- Long doc (20+ pages): chapter-by-chapter bullet summary + overall TL;DR + action items
