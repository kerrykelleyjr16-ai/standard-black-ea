# Workflow: Tape Intake to Bid

**Workflow ID:** WF-01
**Trigger:** Seller submits a loan tape (email, data room link, or direct file delivery)
**Owner:** Agent 02 (Acquisitions & Seller Relations)
**Estimated Duration:** 5–10 business days (depending on tape size and data quality)

---

## Purpose

Transform an inbound loan tape from a raw seller submission into a fully underwritten, priced, and diligence-screened bid that the CEO/CIO can approve, reject, or revise with confidence.

---

## Trigger Conditions

- Seller sends tape to the fund's designated intake channel
- CEO/CIO requests Agent 02 to reach out proactively to a known seller
- Market opportunity identified that requires rapid tape analysis

---

## Inputs

- Raw loan tape (Excel, CSV, or system export)
- Seller profile (from Agent 02 CRM — or initiate new profile if first-time seller)
- Buy box criteria (`/policies/buy_box.md`)
- Current market pricing context (from Agent 04)
- Fund concentration limits (`/policies/risk_limits.md`)

---

## Workflow Steps

### Step 1 — Tape Receipt & Seller Profiling (Agent 02)
- Log tape receipt in acquisitions pipeline
- Confirm seller identity and CRM profile exists or create new seller record
- Perform initial seller quality assessment: known seller, new seller, broker, distressed seller
- Acknowledge receipt to seller (CEO/CIO approves any substantive response)

### Step 2 — Data Normalization (Agent 18)
- Receive tape from Agent 02
- Normalize all fields to fund data dictionary
- Compute data quality score
- Return normalized tape and data quality report to Agent 02
- **If data quality score <60%:** halt and return tape to Agent 02 to request seller correction before proceeding
- **Timeline:** ≤24 hours

### Step 3 — Tape Screening (Agent 02)
- Screen normalized tape against buy box (`/policies/buy_box.md`)
- Complete tape screening template (`/templates/tape_screening_template.md`)
- Score tape: asset type fit, lien position, geography, UPB range, status distribution, LTV profile, data completeness
- Flag red flags: off-strategy assets, geographic overconcentration, unrealistic seller pricing expectations
- Produce: initial bid/no-bid recommendation
- **If no-bid:** route to CEO/CIO for final confirmation; notify seller professionally; log decision
- **If bid:** advance to Step 4
- **Timeline:** ≤2 business days after normalized tape received

### Step 4 — Concentration Risk Screen (Agent 13)
- Agent 02 routes tape to Agent 13 for concentration risk pre-screen
- Agent 13 evaluates: state exposure, seller concentration, NPL allocation impact
- Agent 13 delivers: green / amber / red signal with explanation
- **If red:** flag to CEO/CIO before advancing to underwriting
- **Timeline:** ≤1 business day

### Step 5 — Loan-Level Underwriting (Agent 03)
- Agent 02 hands off normalized tape and screening summary to Agent 03
- Agent 03 underwrites each loan using note underwriting template
- Agent 03 assigns: health score (1–10), classification (Income/Workout/Watchlist/Pass)
- Agent 03 identifies missing data — routes to Agent 05 for collateral data and to Agent 02 for seller data requests
- Agent 03 delivers: pool-level credit summary and per-loan underwriting files
- **Timeline:** ≤3 business days (small pool); ≤5 business days (large pool)

### Step 6 — Collateral Screening (Agent 05)
- Agent 05 reviews available collateral data: property type, title status flags, tax status, legal status indicators from tape
- Flags any loans requiring additional diligence before closing
- Delivers: collateral pre-screen summary and missing document list to Agents 03 and 04
- **Note:** Full document review happens post-bid acceptance; this step is pre-bid screening only

### Step 7 — Pricing & Scenario Modeling (Agent 04)
- Receives credit summary from Agent 03 and collateral inputs from Agent 05
- Builds loan-level cash flow models
- Calculates: IRR, yield, MOIC, cash-on-cash for base, upside, and downside scenarios
- Calculates: recommended bid and maximum bid
- Delivers: pricing summary and IC memo pricing section
- Confirms facility impact with Agent 12 if leveraged acquisition is contemplated
- **Timeline:** ≤2 business days after Agent 03 delivers

### Step 8 — IC Memo Preparation (Agent 01 coordinates)
- Agent 01 assembles IC memo components from Agents 02, 03, 04, 05, 13
- IC memo template: `/templates/ic_memo_template.md`
- IC memo sections: deal summary, seller summary, pool summary, investment thesis, sleeve classification, asset stratification, pricing summary, expected returns, downside case, key risks, diligence issues, legal issues, servicing issues, risk limits compliance, recommendation
- Agent 01 routes completed IC memo to approval queue

### Step 9 — CEO/CIO Review & Decision
- **HUMAN APPROVAL REQUIRED**
- CEO/CIO reviews complete IC memo
- Decision options:
  - **Approve bid:** authorize LOI submission at recommended bid or modified amount
  - **Approve with revision:** authorize LOI at a different price point; agent updates model
  - **Pass:** no bid; Agent 02 notifies seller; decision logged
  - **Request more information:** specific diligence items or pricing scenarios requested
- All decisions logged in `/logs/decision_log.md` and `/logs/approval_log.md`

### Step 10 — LOI Submission (Agent 02)
- **HUMAN APPROVAL REQUIRED** (CEO/CIO authorization per Step 9)
- Agent 02 prepares LOI draft
- LOI reviewed by Agent 14 (Compliance) if it contains non-standard terms
- CEO/CIO signs or authorizes LOI
- LOI submitted to seller
- LOI status tracked in acquisitions pipeline

---

## Outputs

- Tape screening summary (Agent 02)
- Loan-level underwriting files (Agent 03)
- Collateral pre-screen summary (Agent 05)
- Pricing model and bid recommendation (Agent 04)
- IC memo (Agent 01, assembled)
- CEO/CIO approval record
- Signed LOI (if approved)

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| No-bid confirmation on seller | CEO/CIO | Confirmation |
| Concentration risk red signal | CEO/CIO | Go/No-Go before underwriting |
| IC memo approval / bid authorization | CEO/CIO | Investment decision — required |
| LOI submission | CEO/CIO | Execution authorization |

---

## Logs Updated

- `/logs/decision_log.md` — Tape receipt, screening result, IC memo decision, LOI status
- `/logs/approval_log.md` — CEO/CIO approval record for all investment decisions

---

## If Bid Accepted → Proceed To

**WF-02: Closing & Boarding Workflow**
