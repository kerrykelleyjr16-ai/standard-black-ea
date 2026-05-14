# Skill: Note Investing Underwriter

**Invoke when:** Kerry has a note deal, tape, or specific asset to evaluate. Runs the full 8-step underwriting workflow and produces an IC memo.

---

## Inputs
- Asset details (UPB, property address, borrower status, lien position, state)
- Tape file or asset info Kerry provides
- Target sleeve: Income (performing/reperforming) or Workout (NPL)

## Buy-Box Reference

### Income Sleeve (Performing / Reperforming)
- 1st lien position only
- UPB: $30K–$300K
- Max LTV at purchase: 70% of current conservative BPO
- Occupancy: Owner-occupied preferred
- Borrower: Paying or recently reperforming (12+ months)
- Target yield: 10–14% cash-on-cash

### Workout Sleeve
- 1st lien position only
- UPB: $20K–$200K
- Max purchase price: 50% of conservative BPO
- State: Non-judicial preferred or short judicial timeline
- Borrower: Non-paying, in default
- Target IRR: 15%+

## 8-Step Underwriting Workflow

### Step 1 — Tape Screen
- Does it meet buy-box? (lien, UPB, geography, LTV)
- Flag anything outside parameters — stop if disqualified
- Output: Pass / Conditional Pass / Reject with reason

### Step 2 — Collateral & Enforceability
- Confirm 1st lien position
- Note instrument type (mortgage vs. deed of trust)
- Judicial vs. non-judicial state
- Any red flags on enforceability?

### Step 3 — Valuation
- Request or estimate BPO / AVM
- Apply conservative haircut (use lower of AVM / BPO / last sale)
- Calculate purchase price at target LTV

### Step 4 — Title, Tax, Lien & Encumbrance Review
- Outstanding property taxes
- HOA liens
- Junior liens or encumbrances
- Probate issues
- Municipal violations

### Step 5 — Borrower & Servicing Reality Check
- Payment history (last 12–24 months)
- Borrower contact status
- Servicer commentary if available
- Bankruptcy history

### Step 6 — Legal Timeline & Cost Model
- State foreclosure timeline (reference `pinnacle-note-fund-ai-os/policies/`)
- Estimated legal fees by state
- Estimated holding costs during foreclosure
- REO disposition timeline if worst case

### Step 7 — Financial Model
| Metric | Target | This Deal |
|---|---|---|
| Purchase price | — | |
| UPB | — | |
| BPO / Value | — | |
| LTV at purchase | <70% Income / <50% Workout | |
| Monthly P&I | — | |
| Cash-on-cash yield | 10–14% | |
| IRR (with scenarios) | 15%+ Workout | |
| Max bid | — | |

Run three scenarios: base case, stress case, worst case.

### Step 8 — IC Memo
Produce a one-page Investment Committee memo:
- Asset summary
- Buy-box fit: Yes / Conditional / No
- Key risks
- Financial model summary
- Recommendation: Bid / Pass / Counter
- Proposed bid price

## Output Format
IC memo — one page, clean, decision-ready. Kerry reviews and approves before any bid is submitted.
