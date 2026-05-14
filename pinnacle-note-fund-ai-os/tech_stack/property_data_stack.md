# Property Data and Valuation Stack
# The Pinnacle Note Fund AI Operating System

**Document Version:** 1.0
**Last Updated:** 2026-05-08
**Maintained By:** Agent 18 (Data, Automation, Dashboards, Security)
**Primary Users:** Agents 03, 04, 07, 08, 13, 17 | Kerry Kelley Jr (final approval authority)

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Staged Data Stack](#staged-data-stack)
3. [Data Field Catalog](#data-field-catalog)
4. [Source Profiles](#source-profiles)
5. [Verification Hierarchy](#verification-hierarchy)
6. [Valuation Standard Decision Matrix](#valuation-standard-decision-matrix)
7. [Conflict Resolution Protocol](#conflict-resolution-protocol)
8. [Value Maintenance and Update Schedule](#value-maintenance-and-update-schedule)
9. [Use Case Requirements](#use-case-requirements)
10. [Agent Assignments](#agent-assignments)
11. [Supabase Integration](#supabase-integration)
12. [Stage Transition Criteria](#stage-transition-criteria)

---

## Architecture Overview

Property data is the foundation of every underwriting decision, pricing model, risk metric, and investor disclosure in the fund. Every loan in the portfolio is secured by real property — the accuracy and currency of property data directly determines the fund's ability to price correctly, manage risk, and recover capital.

**Core principle:** No acquisition, bid submission, loss mitigation strategy, or foreclosure filing may proceed on the basis of AVM data alone. AVM is a screening tool. Human-reviewed BPO or appraisal is required before any consequential decision.

**Data flows into Supabase as the single source of truth.** All agents, Airtable, Power BI, and n8n read from Supabase. No agent holds property data in memory or in local state beyond a single session.

---

## Staged Data Stack

### Stage 1 — Lean Operations (Fund Launch through ~$5M AUM)

**Tools:** PropStream | County Records | BPO Vendors

| Tool | Role | Access Method | Cost Model |
|---|---|---|---|
| PropStream | Primary property lookup, AVM, skip tracing, MLS history, comps, tax status | Web UI + API | Monthly subscription |
| County Records | Ground truth for ownership, legal description, tax assessment, recorded liens | Manual pull (county recorder/assessor websites) | Free (manual) |
| BPO Vendors | Physical condition, occupancy, market value estimate, interior condition (if accessible) | Email/phone order; report PDF → Drive | Per-order fee ($75–$150 typical) |

**Stage 1 limitations:**
- No bulk API pull for tape screening — PropStream manual lookup per loan
- BPO orders placed manually by operations (Kody or TJ); results filed manually
- County record data entered manually into Supabase
- AVM confidence scores are PropStream's own model — treat as directional only

---

### Stage 2 — Growth Operations (~$5M–$25M AUM)

**Tools:** ATTOM | HouseCanary | Title Data Providers

| Tool | Role | Access Method | Cost Model |
|---|---|---|---|
| ATTOM | Deed/mortgage transaction history, distressed property data, neighborhood analytics, tax assessment history | REST API | Per-record or monthly volume |
| HouseCanary | High-confidence AVM, AVM confidence score (0–100), rental valuation, market trend data, risk metrics | REST API | Per-record or monthly volume |
| Title Data Providers (DataTree, First American DataTree, or equivalent) | Full title chain, open mortgage/lien search, judgment search, HOA liens | REST API or batch pull | Per-search or annual license |

**Stage 2 additions:**
- Automated bulk property lookup for tape screening via n8n (Automation 01)
- HouseCanary confidence score used as a threshold gate for AVM acceptability
- Title data pulled automatically at pre-closing stage before every acquisition
- ATTOM transaction history used to flag recent distressed sales and validate collateral chain

---

### Stage 3 — Institutional Operations ($25M+ AUM)

**Tools:** Direct API integrations into Supabase | Automated valuation monitoring | Risk-adjusted property scoring

| Capability | Description | Trigger |
|---|---|---|
| Direct API → Supabase | n8n pulls ATTOM + HouseCanary on automated schedules; data written directly to `property_valuations` and `properties` tables | Automated (no manual pull) |
| Automated valuation monitoring | n8n monitors portfolio AVMs quarterly; flags any loan where AVM has moved >10% since last review | Quarterly cron + ad hoc trigger |
| Risk-adjusted property scoring | Agent 13 runs composite scoring model on every property using AVM, HouseCanary risk metrics, state FC timeline, geographic concentration, and condition grade | Quarterly + at any acquisition |

**Stage 3 additions:**
- Zero manual property data entry — all sourced via API
- AVM confidence thresholds enforced programmatically before any workflow proceeds
- Geographic concentration risk alerts automated via Agent 13
- LP-facing portfolio data backed by ATTOM + HouseCanary data with full audit trail

---

## Data Field Catalog

The following fields are required in the `properties` and `property_valuations` tables in Supabase. Each field has a designated primary source, a fallback source, the stage at which it becomes available via API (vs. manual), and the required verification method.

### Property Identification Fields

| Field | Primary Source | Fallback | Stage Available via API | Verification |
|---|---|---|---|---|
| APN (Assessor Parcel Number) | County Assessor | PropStream | Stage 3 (ATTOM) | Cross-check county record |
| Full legal description | County Recorder deed | PropStream | Stage 3 (ATTOM) | Deed document |
| Street address (standardized) | PropStream | County records | Stage 1 | USPS standardization |
| Property type | PropStream | ATTOM | Stage 2 | Agent 03 review |
| Year built | County Assessor | PropStream | Stage 2 | County records |
| Square footage (GLA) | County Assessor | PropStream | Stage 2 | County records; BPO if discrepancy |
| Lot size | County Assessor | PropStream | Stage 2 | County records |
| Bedrooms / Bathrooms | PropStream | County Assessor | Stage 2 | BPO confirmation |
| Legal vesting (ownership type) | County Recorder deed | PropStream | Stage 3 (DataTree) | Deed document |
| Current owner of record | County Recorder | PropStream | Stage 3 (DataTree) | Deed document |

---

### Valuation Fields

| Field | Primary Source | Fallback | Stage Available via API | Verification |
|---|---|---|---|---|
| AVM value | HouseCanary | PropStream AVM | Stage 2 (HC); Stage 1 (PropStream) | Confidence score check |
| AVM confidence score (0–100) | HouseCanary | PropStream (no score — treat as 60) | Stage 2 | Score must be ≥70 for tape use; ≥85 for pricing |
| AVM value date | HouseCanary | PropStream | Stage 2 | Must be within 90 days |
| BPO value | BPO vendor report | N/A | Manual all stages | Licensed agent signature |
| BPO date | BPO vendor report | N/A | Manual all stages | Must be within 120 days |
| BPO type (exterior / interior) | BPO vendor report | N/A | Manual all stages | Interior required for NPL |
| BPO condition grade (C1–C6) | BPO vendor report | N/A | Manual all stages | Agent 03/07 review |
| Appraisal value | Licensed appraiser (FIRREA) | N/A | Never (manual always) | Appraiser license + URAR form |
| Appraisal date | Appraisal report | N/A | Never (manual always) | Must be within 6 months |
| Tax assessed value | County Assessor | ATTOM | Stage 2 | Annual county record |
| Last sale price | County Recorder | ATTOM | Stage 2 | Deed/HUD-1 |
| Last sale date | County Recorder | ATTOM | Stage 2 | Deed document |
| Estimated repair cost | BPO vendor or contractor bid | Agent 07 estimate | Manual | Required for REO/NPL |
| After Repair Value (ARV) | BPO vendor (with repairs noted) | Agent 07 model | Manual | Required for REO strategy |

---

### Encumbrance and Lien Fields

| Field | Primary Source | Fallback | Stage Available via API | Verification |
|---|---|---|---|---|
| Lien position of fund note | Title search | County Recorder | Stage 3 (DataTree) | Title company confirmation |
| Outstanding senior lien balance | Servicer payoff statement | County records | Manual | Required before FC filing |
| Outstanding senior lien holder | County Recorder | ATTOM | Stage 2 | Deed of trust / mortgage |
| Tax lien status | County Tax Collector | PropStream | Stage 1 | County records |
| Delinquent tax amount | County Tax Collector | PropStream | Stage 1 | County records |
| HOA lien status | Title search | PropStream | Stage 3 (DataTree) | HOA payoff statement |
| HOA monthly fee | HOA or BPO vendor | PropStream | Stage 1 | HOA docs |
| Judgment liens | Title search | County records | Stage 3 (DataTree) | Title commitment |
| Code violations / municipal liens | County/City records | Manual research | Manual | Municipal lien search |

---

### Condition and Occupancy Fields

| Field | Primary Source | Fallback | Stage Available via API | Verification |
|---|---|---|---|---|
| Occupancy status (owner / tenant / vacant) | BPO vendor observation | Servicer report | Manual | BPO required; drive-by minimum |
| Property condition grade | BPO vendor (C1–C6 scale) | Agent 07 estimate | Manual | Interior BPO for NPL |
| Estimated deferred maintenance | BPO vendor | Contractor bid | Manual | Required for NPL workout |
| Hazard / casualty damage | BPO vendor | Insurance claim | Manual | Required before REO listing |
| Code violation count | Municipal search | BPO vendor notes | Manual | Municipal search required for FC |

---

### Market and Geographic Fields

| Field | Primary Source | Fallback | Stage Available via API | Verification |
|---|---|---|---|---|
| FEMA flood zone designation | FEMA FIRM / HouseCanary | PropStream | Stage 2 | Required at underwriting |
| State foreclosure timeline (judicial / non-judicial) | Agent 07 state matrix | Counsel | Manual (internal table) | Legal counsel for each state |
| Average FC timeline (months) | Agent 07 state matrix | Public data | Manual (internal table) | Review annually |
| County absorption rate | HouseCanary | PropStream | Stage 2 | 90-day look-back |
| Median days on market | HouseCanary | PropStream | Stage 2 | 90-day look-back |
| Local market trend (appreciating / stable / declining) | HouseCanary | PropStream | Stage 2 | Required for pricing |
| Comparable sales (3–6 sales, 1-mile, 6-month) | BPO vendor | HouseCanary | Stage 2 | Required for BPO and appraisal |
| Rental market rate (monthly) | HouseCanary | PropStream | Stage 2 | Used in rental valuation model |
| Geographic concentration flag | Agent 13 model | Manual | Stage 3 | Quarterly portfolio review |

---

## Source Profiles

### PropStream
- **What it does:** Consumer-grade property intelligence platform. Owner lookup, basic property data, MLS history, tax status, AVM, skip tracing, distressed property filters.
- **Strengths:** Cheap, fast, broad coverage, good for tape screening volume.
- **Limitations:** AVM has no published confidence score or methodology disclosure. Not suitable for final pricing. Not FIRREA compliant.
- **Acceptable uses:** Initial tape screening, owner verification, skip tracing, tax status check, directional AVM before BPO order.
- **Not acceptable for:** Final bid pricing, IC memo valuation, LP reporting, any regulatory or compliance purpose.

### County Records
- **What it does:** Ground truth for ownership, legal description, deed history, recorded liens, tax assessment, judgment recording.
- **Strengths:** Authoritative. Used by title companies. No model error.
- **Limitations:** Manual pull in Stage 1–2. Not all counties have online access. Recording lag can be 30–90 days.
- **Acceptable uses:** Ownership verification, lien position confirmation, legal description, tax status.
- **Not acceptable for:** Market value (tax assessed ≠ market value).

### BPO Vendors
- **What it does:** Licensed real estate agents provide a written broker price opinion — exterior or interior — with three comparable sales, condition grade, occupancy status, and market commentary.
- **Types:**
  - **Exterior BPO:** Drive-by only. Condition estimate from street. Sufficient for performing loans and initial NPL assessment.
  - **Interior BPO:** Full interior inspection. Required for NPL with significant loss exposure, REO, or any dispute.
- **Turnaround:** 3–7 business days. Rush orders 24–48 hours (at premium).
- **Acceptable uses:** Acquisition due diligence, NPL workout valuation, REO disposition pricing, annual portfolio review.
- **Not acceptable for:** Substitute for appraisal when appraisal is required. BPO is an opinion, not a regulated appraisal.
- **Ordering protocol:** All BPO orders placed by Agent 05 (Stage 1: Kody manually) via email to vendor panel. Order logged in Supabase `vendor_orders` table. Report filed to Google Drive `/05 - Due Diligence / BPOs/` upon receipt.

### ATTOM
- **What it does:** Institutional-grade property data API. Deed and mortgage transaction history, tax assessment history, neighborhood analytics, distressed property data, AVM.
- **Strengths:** API-first. Deep transaction history. Used by institutional funds and data providers.
- **Acceptable uses:** Bulk tape enrichment, transaction history verification, ATTOM AVM as supplement to HouseCanary.
- **Stage:** Available Stage 2+.

### HouseCanary
- **What it does:** AVM with published confidence score (0–100), market trend data, rental valuation, risk metrics, comparable sales.
- **Strengths:** Most transparent AVM in the market. Confidence score makes it suitable for threshold-based automation. Rental valuation model supports income analysis.
- **Acceptable uses:** Tape screening threshold gate (confidence ≥70), pricing support (confidence ≥85), portfolio monitoring, rental income underwriting.
- **Not acceptable for:** Substituting for BPO when BPO is required. Not FIRREA compliant.
- **Stage:** Available Stage 2+.

### Title Data Providers (DataTree / First American / equivalent)
- **What it does:** Full title chain search, open mortgage/lien search, judgment search, HOA lien search. Programmatic title plant access.
- **Strengths:** API access to recorded documents without manual county research.
- **Acceptable uses:** Pre-closing lien search, lien position verification, title chain review before acquisition.
- **Not acceptable for:** Substituting for a full title commitment from a licensed title company in any closing.
- **Stage:** Available Stage 3+. In Stage 1–2, title searches ordered manually through title company.

---

## Verification Hierarchy

When multiple sources provide a value for the same field, apply this hierarchy. Higher rank overrides lower rank. If two sources of equal rank conflict, the conflict resolution protocol applies.

| Rank | Source | Notes |
|---|---|---|
| 1 | Licensed appraisal (URAR, FIRREA compliant) | Highest authority. Required at acquisition >$250k UPB. |
| 2 | Interior BPO (licensed agent, interior access) | Full condition visibility. Required for NPL/REO. |
| 3 | Exterior BPO (licensed agent, drive-by) | Condition estimate only. Acceptable for performing loans. |
| 4 | HouseCanary AVM (confidence ≥85) | Quantified model. Acceptable for portfolio monitoring and screening. |
| 5 | ATTOM AVM | Use as supplement to HouseCanary. |
| 6 | PropStream AVM | Directional only. Screening use. |
| 7 | Tax assessed value | Lagging indicator. Do not use for market value. Use only to flag outliers. |
| 8 | Last sale price (adjusted) | Historical data point. Apply market appreciation/depreciation adjustment. |

**Rule:** When ranking conflicts, always use the conservative (lower) value for LTV calculation. Never use the optimistic value to make a deal work.

---

## Valuation Standard Decision Matrix

Use this matrix to determine which valuation standard is required at each decision point. These are hard minimums — a higher standard is always acceptable.

### When AVM is Acceptable

AVM (HouseCanary confidence ≥70 for Stage 2+; PropStream for Stage 1) is acceptable for:

| Scenario | Condition | AVM Source Required |
|---|---|---|
| Initial tape screening (pre-bid) | All loans | PropStream (Stage 1); HouseCanary (Stage 2+) |
| Portfolio monitoring — performing loans | Between scheduled BPO cycles | HouseCanary ≥70 confidence |
| Portfolio monitoring — re-performing loans | 12+ consecutive on-time payments post-modification | HouseCanary ≥70 confidence |
| Low-exposure performing loans | UPB ≤$100k AND calculated LTV ≤50% using AVM | HouseCanary ≥85 confidence |
| Market trend analysis | General portfolio analytics only | Any source |

**AVM is never acceptable for:** Any bid submission. Any IC memo. Any loss reserve calculation. Any LP reporting valuation. Any FC bid calculation.

---

### When BPO is Required (Minimum Standard)

An exterior BPO is the minimum required for:

| Scenario | BPO Type | Timing |
|---|---|---|
| Any acquisition — bid submission | Exterior | Before IC memo is drafted |
| Any loan >$75k UPB at acquisition | Exterior | Before bid submission |
| Loans entering delinquency (60+ days past due) | Exterior | Within 30 days of 60-day delinquency |
| Loans entering NPL workout | Exterior (interior if accessible) | Within 30 days of NPL classification |
| REO acquisition at FC sale | Interior (request access) | Before first list price set |
| Annual portfolio review — performing loans | Exterior | Annually for all performing loans |
| LTV between 50–75% based on most recent AVM | Exterior | Before any valuation-dependent decision |
| Any property in a declining market (>5% annual depreciation per HouseCanary) | Exterior | Quarterly |
| Appraisal is aged >12 months on any performing loan | Exterior | Before any decision relying on valuation |

An **interior BPO** is required for:

| Scenario | Timing |
|---|---|
| NPL with potential loss exposure (estimated loss >$25k) | Before workout strategy finalized |
| REO with any indication of interior damage or deferred maintenance | Before first list price set |
| Any loan where borrower reports property damage | Within 30 days |
| Short sale negotiation (floor validation) | Before short sale approval |

---

### When Appraisal is Required

A licensed appraisal (FIRREA-compliant, URAR form, certified or licensed appraiser) is required for:

| Scenario | Timing |
|---|---|
| Individual note acquisition with UPB >$250k | Before IC memo approval |
| Pre-foreclosure filing where senior position is disputed | Before legal filing |
| REO with estimated repair/improvement cost >$50k | Before capital deployment decision |
| Disputed property value in contested loss mitigation | Before settlement agreement |
| Any institutional LP capital raise — sampling requirement | Per LP's due diligence requirements |
| BPO and AVM conflict by >20% on any loan >$150k UPB | Before any consequential decision |
| Commercial or mixed-use property collateral (if fund expands beyond residential) | At acquisition |

---

## Conflict Resolution Protocol

When two or more sources provide materially different values for the same property, apply this protocol:

**Step 1 — Define materiality threshold:**
- Difference of <10%: Use higher-ranked source. Log in `property_valuations` table with note.
- Difference of 10–20%: Flag for Agent 03 or Agent 13 review. Use conservative (lower) value pending resolution.
- Difference of >20%: Escalate to human review. Halt any valuation-dependent workflow. Order next tier of valuation (BPO if using AVM; appraisal if using BPO).

**Step 2 — Apply source ranking:**
Use the verification hierarchy (Section 5). Higher rank wins if difference is <10%.

**Step 3 — Order resolution valuation if required:**
- Two sources conflict by >10%: Order or upgrade to the next higher standard.
- Two BPOs conflict: Order appraisal.
- AVM and BPO conflict by >15%: BPO governs. Flag for Agent 13 risk review.
- Three sources all diverge: Escalate to Kerry with all three values and a recommendation.

**Step 4 — Always use conservative value for LTV:**
Regardless of which value is selected as "correct," LTV calculations always use the lower defensible value. Document the rationale in `property_valuations.conflict_notes`.

**Step 5 — Log everything:**
All valuations — AVM, BPO, appraisal — are stored in the `property_valuations` table with source, date, value, confidence score (if applicable), and any conflict flags. The resolution decision and rationale are logged in `agent_logs` and the `decisions/log.md` file.

**Hard rules:**
- Never average two conflicting values.
- Never select the higher value to hit a target LTV.
- Any conflict on a loan >$150k UPB requires Agent 13 review before the workflow resumes.
- Any conflict requiring appraisal requires Kerry approval before appraisal is ordered (cost gate).

---

## Value Maintenance and Update Schedule

Property values are not static. Market conditions, property condition, and new sales data change the collateral value of every loan in the portfolio continuously. Values must be maintained on a defined schedule.

### Performing Loans

| Loan Status | AVM Update | BPO Update | Trigger-Based Update |
|---|---|---|---|
| Current (0–29 days) | Quarterly (automated in Stage 3) | Annually | Any market shock >10% in county |
| Watch list (30–59 days) | Monthly | Semi-annually | Borrower reports damage; natural disaster |
| Re-performing (12+ months) | Quarterly | Annually | Reversion to delinquency |

### Non-Performing Loans

| Loan Stage | AVM Update | BPO Update | Trigger-Based Update |
|---|---|---|---|
| NPL — workout active | Monthly | At NPL classification; every 6 months | Change in occupancy; natural disaster |
| NPL — legal/FC pending | Monthly | At FC filing; every 6 months | Judge orders sale; creditor challenge |
| NPL — FC sale scheduled | Real-time monitoring (PropStream alerts) | 30 days before FC sale | Any lien discovery |

### REO

| REO Stage | AVM Update | BPO Update | Trigger-Based Update |
|---|---|---|---|
| REO — pre-listing | N/A | At REO acquisition (interior) | Vandalism, weather event |
| REO — listed | N/A | Every 90 days until sold | Price reduction consideration; offer received |
| REO — under contract | N/A | At contract (for validation) | Contract falls through (re-list triggers new BPO) |

### Portfolio-Level Valuation

| Event | Valuation Action |
|---|---|
| Quarterly investor reporting | Full portfolio AVM refresh via HouseCanary API (Stage 2+); PropStream manual (Stage 1) |
| Annual fund review | BPO on all performing loans; appraisal on any loan flagged in risk review |
| New LP capital raise | Appraisal sampling per LP requirements; full BPO on all NPL/REO collateral |
| Significant market event (>10% regional price move) | Agent 13 triggers emergency portfolio re-screening within 48 hours |

---

## Use Case Requirements

### 1. Credit Underwriting (Agent 03)

**Goal:** Determine whether a loan meets the fund's buy box and what price supports an acceptable LTV.

**Required fields:**
- AVM value (with confidence score) — tape screening
- BPO value (exterior, minimum) — required before IC memo
- BPO condition grade (C1–C6) — condition adjustment to value
- BPO occupancy status — vacant properties require additional analysis
- Lien position of fund note — confirmed via title search
- Outstanding senior lien balance — from servicer payoff statement
- Tax lien status and delinquent amount — from county records
- HOA lien status — from title search
- Comparable sales (3–6, from BPO) — comps validation
- State FC timeline — from Agent 07 state matrix
- Flood zone designation — from HouseCanary (Stage 2) or FEMA.gov (Stage 1)

**Calculations:**
- **LTV** = (Fund Note UPB + Senior Lien Balance) / BPO Value
- **ITV** = (Investment Amount / BPO Value) — for NPL pricing
- **Loss estimate** = BPO Value × (1 - State FC Recovery Rate) - Senior Liens - FC Costs - Carry

**Decision gate:** BPO must be received and reviewed by Agent 03 before IC memo is drafted. AVM is used for tape screening only.

**Buy box enforcement:** LTV ≤75% for income notes; ITV ≤65% for workout notes.

---

### 2. Tape Screening (Agent 04)

**Goal:** Rapidly assess a tape of 10–500 loans and filter to a qualified sub-tape for detailed underwriting.

**Required fields (per loan on tape):**
- Address — for PropStream lookup
- Property type — filter to eligible types (SFR, 2–4 unit, condo with fee title)
- State — geographic eligibility and FC timeline filter
- AVM (PropStream Stage 1; HouseCanary Stage 2+) — directional LTV filter
- Tax assessed value — secondary AVM sanity check
- County — geographic concentration filter

**Tape screening logic (n8n Automation 01):**
1. Pull all loans from tape into Supabase `tape_loans` table
2. For each loan, call PropStream (Stage 1) or HouseCanary (Stage 2+) for AVM
3. Calculate directional LTV using AVM
4. Apply buy box filters: LTV, property type, state eligibility, minimum UPB
5. Flag loans that pass all filters; flag reason for exclusion on all others
6. Agent 04 reviews qualified sub-tape and prepares bid analysis
7. BPO ordered on any loan included in final bid submission

**AVM use in tape screening:** Acceptable. Confidence score ≥70 (HouseCanary Stage 2+). PropStream AVM treated as directional with no confidence floor (Stage 1).

**Do not:** Submit a bid based on tape screening AVM without BPO on the specific loans being bid.

---

### 3. Pricing (Agent 04)

**Goal:** Determine the maximum purchase price for each loan that produces a target yield, given collateral value and recovery scenarios.

**Required fields:**
- BPO value (exterior minimum; interior preferred for NPL) — pricing anchor
- BPO condition grade — condition adjustment (C3: no adjustment; C4: -5%; C5: -10%; C6: -20%)
- Comparable sales from BPO — comps validation
- County absorption rate — days to sell in liquidation scenario
- Local market trend — appreciation/depreciation adjustment to BPO
- State FC timeline — months to recover in FC scenario
- Estimated FC costs — attorney, carrying, taxes during FC
- Senior lien balance — reduction to net recovery
- AVM confidence score (HouseCanary Stage 2+) — secondary check; if AVM >10% above BPO, flag for review

**Pricing model (NPL):**
```
Net Recovery Value = BPO × Condition Adjustment × Market Trend Factor
                    - Senior Liens
                    - Delinquent Taxes
                    - FC Costs (state-specific)
                    - REO Carrying Costs (estimated months × monthly cost)

ITV = Purchase Price / Net Recovery Value

Maximum Purchase Price = Net Recovery Value × Target ITV (≤65%)
```

**Pricing model (Income/Performing):**
```
Yield = (Annual P&I / Purchase Price)
Maximum Purchase Price = Annual P&I / Target Yield

LTV Check: (Purchase Price + Senior Liens) / BPO ≤ 75%
```

**AVM use in pricing:** Not acceptable as a standalone pricing input. AVM used as secondary sanity check only. BPO governs. If AVM and BPO differ by >10%, flag for Agent 13 review before bid submission.

---

### 4. NPL Workout (Agent 07)

**Goal:** Determine the right resolution strategy (reinstatement, modification, short sale, DIL, FC) and set appropriate financial thresholds for each.

**Required fields:**
- BPO value (interior preferred; exterior minimum) — determines all settlement floors
- BPO condition grade and estimated repair costs — affects short sale and DIL value
- Occupancy status — vacant properties require different timeline and vandalism risk consideration
- Senior lien balance — affects net proceeds in any disposition
- Delinquent taxes — paid at closing in any sale or DIL
- HOA status — affects marketability and sale proceeds
- State FC timeline — determines urgency and FC cost estimate
- Local absorption rate — how long to sell in current market
- ARV (if applicable) — needed if repair plan considered

**Workout thresholds set by Agent 07:**

| Resolution Type | Financial Floor |
|---|---|
| Reinstatement | Face value of all arrears + fees — no negotiation below face |
| Modification | Minimum payment that achieves NPV ≥ liquidation value |
| Short sale approval | Net proceeds ≥ (BPO × 85%) - repair estimates - selling costs - senior liens - taxes |
| Deed-in-Lieu acceptance | Net value received ≥ short sale floor; property must be delivered vacant and in acceptable condition |
| Foreclosure | Initiated when no other resolution achieves minimum recovery threshold |

**Human approval required:** All workout strategy decisions require Kerry approval before Agent 07 communicates any offer or terms to servicer or counsel.

**Value update trigger:** If BPO is >120 days old when workout strategy is being finalized, order new exterior BPO before proceeding.

---

### 5. Foreclosure Analysis (Agent 07 + Agent 08)

**Goal:** Determine whether to proceed to foreclosure, set the FC bid, and manage the timeline to minimize carrying costs.

**Required fields:**
- Current BPO (exterior; interior if REO scenario expected) — determines FC bid floor
- Senior lien balance — required to assess whether FC is economically viable
- Outstanding delinquent taxes — must be current or paid at FC
- HOA super-priority lien status (by state) — determines if HOA can wipe the fund's lien
- Title search results — confirm no intervening liens that affect position
- State FC timeline (months, judicial vs. non-judicial) — determines carry period and cost
- County-specific FC process and statutory redemption period — state-specific rules
- Estimated FC costs (attorney, sheriff/trustee, filing fees) — per counsel

**FC bid calculation:**

```
FC Bid = MIN(
    Note balance (outstanding UPB + accrued interest + fees),
    Liquidation Value - Bidding Cushion
)

Liquidation Value = BPO
                  × Condition Adjustment
                  × Distressed Sale Discount (state-specific; typically 80–90% of BPO)
                  - Estimated Senior Liens (if any)
                  - Estimated Delinquent Taxes
                  - Estimated FC Carrying Costs (months × monthly rate)
                  - Estimated REO Selling Costs (6–8% of BPO)
```

**Human approval required:** FC filing and FC bid both require Kerry approval. Agent 07 prepares analysis; Agent 08 coordinates with FC counsel. Kerry approves before counsel files.

**Value update at FC sale:** BPO must be no older than 90 days at the time FC sale is scheduled. If aged, order update before FC bid is set.

---

### 6. REO Disposition (Agent 07)

**Goal:** Maximize net recovery on properties acquired through foreclosure or deed-in-lieu.

**Required fields:**
- Interior BPO (required — fund now owns property) — current as-is value and condition grade
- Estimated repair costs (contractor bid preferred; BPO estimate acceptable for initial strategy) — determines repair vs. sell-as-is decision
- ARV (from BPO vendor, with assumed repairs) — repair decision threshold
- Local absorption rate and median days on market — listing strategy
- Comparable sales — pricing validation
- HOA status and monthly fees — ongoing cost during carry
- Property taxes (current or delinquent) — must be current before listing

**Disposition strategy matrix:**

| Condition | Strategy |
|---|---|
| C1–C3 (good to average) | Retail listing via agent — maximize net proceeds |
| C4 (below average; moderate repairs) | Assess repair vs. wholesale: if ARV - Repair Cost > 80% BPO → repair and list; otherwise wholesale |
| C5–C6 (poor; significant repairs) | Wholesale to investor network or auction — minimize carry time |
| Tenant-occupied (cooperative) | Keep tenant, sell occupied (adjust for tenant discount) |
| Tenant-occupied (hostile or unlawful detainer required) | Evict first, then reassess condition and strategy |

**Pricing update cadence:** BPO updated every 90 days until sold. If days on market exceed 60, Agent 07 triggers price reduction analysis and presents recommendation to Kerry.

**Human approval required:** Listing price, price reductions, and final sale approval all require Kerry review. Agent 07 prepares analysis and recommendation; Kerry approves before agent executes.

---

### 7. Risk Management (Agent 13)

**Goal:** Monitor portfolio-level collateral risk and stress-test the portfolio against market scenarios.

**Required fields (portfolio-level):**
- Current AVM for all properties (refreshed quarterly) — weighted average LTV calculation
- BPO values (most recent) — used in quarterly fair value estimate
- Geographic distribution (by state, county, MSA) — concentration risk analysis
- Property type distribution — sector concentration risk
- Vintage distribution (by origination year) — cohort performance tracking
- LTV distribution — risk band segmentation (LTV <50%, 50–65%, 65–75%, >75%)
- Market trend data by county (HouseCanary Stage 2+) — early warning on depreciating markets
- Flood zone exposure — climate and insurance risk

**Stress test scenarios (quarterly):**

| Scenario | Property Value Shock | Expected Outcome |
|---|---|---|
| Mild correction | -10% uniform | LTV distribution shift; identify loans crossing 75% LTV |
| Moderate correction | -20% uniform | Full portfolio LTV re-band; flag breaches of risk limits |
| Severe correction | -30% uniform | Loss reserve adequacy; identify loans with negative equity |
| Geographic stress | -25% in any single state with >20% concentration | Geographic concentration risk |
| Rapid depreciation | -15% in any county with HouseCanary declining trend | Early warning system |

**Risk limit triggers:**
- Portfolio weighted average LTV >65%: Alert to Kerry + Agent 16 (investor relations)
- Any single state >30% of portfolio by UPB: Halt new acquisitions in that state pending review
- Any individual loan LTV >85%: Immediate escalation to Kerry; remediation plan within 30 days
- More than 20% of portfolio in declining markets: Portfolio review meeting

**Human approval required:** All risk limit breach responses require Kerry decision. Agent 13 flags and recommends; Kerry approves the response.

---

### 8. Investor Reporting (Agent 17)

**Goal:** Provide LPs with accurate, auditable, conservative collateral valuations in quarterly and annual reports.

**Required fields for reporting:**
- Carrying value (cost basis at acquisition) — per `loans` table
- Current BPO value (most recent within 12 months) — fair value estimate
- Current AVM (HouseCanary, confidence ≥70) — secondary valuation reference
- Weighted average LTV (by UPB) — portfolio-level metric
- Unrealized gain/loss (BPO vs. cost basis) — fair value disclosure
- Geographic concentration (top 5 states by UPB) — concentration disclosure
- Valuation date for each BPO used in reporting — disclosure of staleness risk

**Reporting rules:**
- **No individual property data disclosed to LPs** unless separately managed account agreement requires it.
- **Valuation basis disclosed in every report:** "Collateral values based on broker price opinions (BPOs) or automated valuation models (AVMs) as indicated. BPOs are opinions of value, not appraisals."
- **Conservative principle applies:** If BPO and AVM differ, use lower value in LP-facing reporting.
- **Fair value footnote required:** Any property where most recent BPO is >12 months old must be footnoted as "estimated using AVM; BPO scheduled for renewal."
- **No unrealized gains recognized in distribution calculations:** Distributions based on cash flow only. Unrealized gains are informational only in LP reports.

**Human approval required:** All LP reports require Kerry review and approval before distribution. Agent 17 drafts; Kerry reviews; DocuSign transmittal only after Kerry signs approval record in Supabase.

---

## Agent Assignments

| Agent | Property Data Role |
|---|---|
| Agent 03 (Credit Underwriting) | Underwrites individual loans; reviews BPO; calculates LTV; approves collateral for IC memo |
| Agent 04 (Pricing + Tape Analytics) | Runs tape screening; builds pricing models; calls PropStream/HouseCanary APIs in Stage 2+ |
| Agent 05 (Diligence, Collateral, Closing) | Orders BPOs; coordinates title searches; receives and files valuation documents |
| Agent 07 (Workout, Loss Mitigation, REO) | Uses valuation to set workout thresholds; manages REO disposition strategy |
| Agent 08 (Servicer + Counsel Oversight) | Coordinates with FC counsel on FC bid; uses valuation in FC strategy |
| Agent 09 (QA + Exceptions) | Audits valuation data in Supabase; flags missing or aged valuations |
| Agent 13 (Risk + Stress Testing) | Portfolio-level valuation monitoring; stress tests; geographic concentration analysis |
| Agent 15 (Conflicts, Audit, Governance) | Reviews valuation methodology; ensures consistency; flags any manipulation of values |
| Agent 17 (Investor Relations + Reporting) | Uses portfolio valuations in LP reports; prepares fair value disclosures |
| Agent 18 (Data + Automation) | Manages API integrations; automates AVM pulls; maintains data quality in Supabase |

---

## Supabase Integration

Property data is stored across three primary tables. All agents, n8n, Airtable, and Power BI read from these tables. No external system holds the master record.

### `properties` table
Stores static and semi-static property characteristics. Updated when material property data changes (renovations, lot subdivision, etc.).

**Key fields:** `property_id`, `loan_id` (FK), `apn`, `address`, `property_type`, `year_built`, `sqft`, `bedrooms`, `bathrooms`, `lot_size`, `flood_zone`, `state`, `county`

**RLS:** `agent_service` and `n8n_service` can INSERT and UPDATE. `powerbi_readonly` and `auditor_readonly` SELECT only.

### `property_valuations` table
Stores every valuation event — AVM pull, BPO receipt, appraisal receipt. Append-only for audit purposes. New valuation = new row. No UPDATE or DELETE.

**Key fields:** `valuation_id`, `property_id` (FK), `loan_id` (FK), `valuation_type` (AVM/BPO/Appraisal), `source` (PropStream/HouseCanary/ATTOM/Vendor name), `value`, `confidence_score`, `valuation_date`, `bpo_type` (exterior/interior), `condition_grade`, `comparable_sales_json`, `conflict_flag`, `conflict_notes`, `ordered_by` (agent ID), `received_date`, `file_path` (Google Drive link)

**RLS:** INSERT by `agent_service` and `n8n_service`. No UPDATE or DELETE by any role (append-only enforced via RLS policy).

### `property_encumbrances` table
Stores lien and encumbrance data. Updated when new information is received from title search or county records.

**Key fields:** `encumbrance_id`, `property_id` (FK), `loan_id` (FK), `encumbrance_type` (senior_mortgage/tax_lien/hoa_lien/judgment/code_violation), `holder`, `balance`, `as_of_date`, `source`, `verified_by`, `file_path`

**RLS:** `agent_service` INSERT and UPDATE. `n8n_service` INSERT. `powerbi_readonly` and `auditor_readonly` SELECT only.

---

## Stage Transition Criteria

Moving between stages is a deliberate decision based on AUM growth, operational capacity, and cost-benefit. Do not move to the next stage prematurely — manual processes are more reliable than automated ones that are not yet validated.

### Stage 1 → Stage 2 Trigger

| Criterion | Threshold |
|---|---|
| AUM | $5M or 50+ loans in portfolio |
| Tape volume | Reviewing tapes of 100+ loans regularly |
| BPO order volume | >5 BPOs per month (justifies ATTOM + HouseCanary subscription) |
| Operational bottleneck | Manual PropStream lookups are a measurable constraint on tape throughput |

**Actions at Stage 2 transition:**
1. Sign ATTOM API agreement
2. Sign HouseCanary API agreement
3. Sign DataTree or equivalent title data agreement
4. Build n8n Automation 01 (tape enrichment) using new API credentials
5. Configure HouseCanary confidence score threshold gates in n8n
6. Archive PropStream as backup; keep subscription active

### Stage 2 → Stage 3 Trigger

| Criterion | Threshold |
|---|---|
| AUM | $25M or first institutional LP onboarded |
| Valuation volume | >20 quarterly AVM refreshes (manual too slow) |
| Risk monitoring | Monthly monitoring reports now material to LP commitments |
| Operational capacity | Agent 18 automation handles 80%+ of data pipeline with minimal human intervention |

**Actions at Stage 3 transition:**
1. Implement direct API → Supabase automated writes via n8n scheduled workflows
2. Build Agent 13 risk-adjusted property scoring model
3. Implement automated valuation monitoring with HouseCanary API
4. Establish quarterly automated portfolio valuation refresh (full AVM sweep)
5. Implement geographic concentration alerts in Power BI
6. Engage independent valuation consultant for annual review of methodology

---

*This document governs all property data decisions in The Pinnacle Note Fund. Any deviation from valuation standards or verification hierarchy requires documented justification approved by Kerry Kelley Jr and logged in `decisions/log.md`.*
