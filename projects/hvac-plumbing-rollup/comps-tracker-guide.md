# HVAC/Plumbing Comps Tracker — Setup & Field Guide

**Created:** 2026-05-31
**File to import:** `comps-tracker-template.csv`
**Purpose:** One running log of every HVAC/plumbing business for sale in DFW and Phoenix. The goal isn't to act now — it's to **build pattern recognition** so that when the roll-up activates, you already *know* what cheap, clean, and dangerous look like.

---

## How to set it up (Google Sheets)
1. New Google Sheet → **File → Import → Upload** `comps-tracker-template.csv` → "Insert new sheet."
2. Freeze the header row (**View → Freeze → 1 row**).
3. Set the four computed columns as formulas (see below) so they auto-calculate.
4. Add a tab per metro if you prefer (DFW / Phoenix), or filter the single sheet by the **Metro** column.
5. Two example rows are included to show the format — delete them once you log your first real listings.

## Auto-calculate these (don't type them by hand)
Assuming the header row is row 1 and data starts row 2:
- **Asking Multiple (x)** = `Asking Price / EBITDA` → `=I2/K2`
- **EBITDA Margin %** = `EBITDA / Revenue` → `=K2/J2`
- **Est. FCF Yield %** = `EBITDA / Asking Price` (rough proxy before capex/debt) → `=K2/I2`

## Color-coding (Conditional Formatting — makes scanning instant)
- **Asking Multiple:** green ≤ 3.5x, yellow 3.5–4.5x, red > 4.5x
- **Top Customer %:** red if > 30% (concentration = loaded gun)
- **EBITDA Margin:** green ≥ 15%, red < 10%

---

## Field Guide (what each column means and why it's there)

| Column | What to capture | Why it matters |
|---|---|---|
| Date Logged | When you found it | Track market flow over time |
| Source | BizBuySell, broker, word-of-mouth | Know where deal flow comes from |
| Listing URL/Ref | Link or broker reference | Find it again |
| Business Name | Often "Confidential" pre-NDA | — |
| **Trade** | HVAC / Plumbing / Both | Stay in lane — nothing else |
| **Metro** | DFW / Phoenix | Your two target markets only |
| City/Submarket | Plano, Mesa, etc. | Density mapping for future bolt-ons |
| Years in Operation | Track record length | Older = more durable, more reviews |
| **Asking Price** | Listed price | The starting number (not the real value) |
| **Revenue (TTM)** | Trailing 12 months | Scale check |
| **EBITDA/SDE** | Real earnings (verify add-backs!) | The number everything keys off |
| EBITDA Margin % | *computed* | <10% is thin; 15%+ is healthy for trades |
| **Asking Multiple (x)** | *computed* | Your cheapness gauge — target 2.5–4x |
| Est. FCF Yield % | *computed* | Cash return on price; compare to alternatives |
| # Employees | Headcount | Scale + management depth |
| # Service Trucks | Fleet size | PE platforms screen for 5–10+ trucks |
| Recurring/Maintenance Contracts | Y/N + count | **The moat** — recurring revenue = durable cash |
| Top Customer % | % from biggest client | **>30% = major red flag** |
| Owner-Operator Dependent? | Does it die if owner leaves? | The acquirer's key inversion — you need it to survive without them |
| Mgmt Stays Post-Close? | Y/N/Unknown | Retainable management is critical |
| Real Estate Included? | Y/N | Changes valuation and financing |
| **Passes Quick Screen?** | Y/N | See disqualifiers below |
| Acquisition Analyzer Score | /30 | Run the skill once it clears the screen |
| **Status** | New / Reviewing / Contacted / Pass / Pursue / Revisit | Pipeline stage |
| Red Flags / Notes | Anything that stands out | Capture the gut read |
| Next Step | The one next action | Keeps it moving |

---

## Quick-Screen Disqualifiers (auto-"No" in Passes Quick Screen?)
Mark **N** and move on if any are true:
- Not HVAC or plumbing
- Not in DFW or Phoenix
- Revenue under $500K (too small for the model)
- Top customer > 30% of revenue (concentration risk)
- Asking multiple > 5x EBITDA with no clear justification
- Owner is the entire business with no retainable team
- No real financials / books "in the owner's head"

Everything that passes the screen → run through the **seven-step evaluation order** in `references/company-evaluation-frameworks.md`, then the **acquisition-analyzer scorecard**, then log the score and decision here.

## Discipline
- Log **everything**, including the ones you'd never buy. Reps build the instinct.
- Log every formal pass/pursue decision in `decisions/log.md` too.
- Review the sheet monthly — you'll start to *feel* the market's normal range without doing math.
