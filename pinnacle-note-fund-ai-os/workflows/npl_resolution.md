# Workflow: NPL Resolution

**Workflow ID:** WF-04
**Trigger:** Loan classified as NPL at acquisition OR performing loan transitions to NPL status
**Owner:** Agent 07 (Workout, Loss Mitigation & REO)
**Estimated Duration:** 30 days to 36 months (resolution path-dependent)

---

## Purpose

Develop a documented resolution strategy for every non-performing loan within 30 days of entry into workout, execute the strategy with human-approved legal and servicing actions, track performance to resolution, and maximize recovery — whether through reinstatement, modification, short sale, deed-in-lieu, foreclosure, or REO disposition.

---

## Trigger Conditions

- Loan acquired as NPL — immediate entry into this workflow at boarding
- Performing loan reaches 90+ days delinquent without cure plan — Agent 06 initiates handoff to Agent 07
- Loan in modification or RPL status re-defaults — Agent 06 triggers workflow re-entry

---

## Inputs

- Loan data: UPB, purchase price, note, mortgage, title status
- Servicer NPL file: payment history, delinquency, borrower contact log, escrow, tax status, insurance status
- Legal status: foreclosure stage, bankruptcy case information
- Property data: most recent AVM/BPO, inspection report, vacancy status
- Recovery model from Agent 04
- Agent 07's NPL resolution framework

---

## Workflow Steps

### Step 1 — NPL Intake & File Assembly (Agent 07)
- Confirm loan receipt from Agent 06 (transition) or Agent 05 (new acquisition boarding)
- Assign NPL asset ID
- Assemble file: all available loan, borrower, collateral, and legal data
- Identify data gaps: escalate missing items to Agent 09 (QA) and Agent 08 (Servicer)
- **Timeline:** within 5 business days of NPL entry

### Step 2 — Borrower Contact Assessment (Agent 07)
- Review servicer borrower contact log: number of attempts, methods, dates, responses
- Classify borrower contactability: Responsive / Limited / No Contact
- **If responsive:** flag for potential reinstatement or modification pathway
- **If no contact:** flag for foreclosure pathway evaluation
- Direct servicer to increase contact frequency if needed (CEO/CIO approval required for servicing instructions)

### Step 3 — Resolution Strategy Development (Agent 07)
- Review all available data: borrower contactability, property value, equity position, legal status, legal cost estimate, tax/lien exposure
- Select resolution path: Reinstatement, Modification, Short Sale, Deed-in-Lieu, Foreclosure, or Note Sale
- Document rationale for selected path
- Produce NPL Action Plan using `/templates/npl_action_plan_template.md`
- Route action plan to Agent 04 for recovery model confirmation
- Route action plan to CEO/CIO for approval
- **Timeline:** within 30 days of NPL entry

### Step 4 — CEO/CIO Strategy Approval
- **HUMAN APPROVAL REQUIRED**
- CEO/CIO reviews NPL action plan
- Approves resolution path or requests modification
- All legal actions (foreclosure referral, loss mitigation instructions, short sale approval) require specific CEO/CIO authorization
- Decision logged in `/logs/decision_log.md` and `/logs/approval_log.md`

### Step 5A — Reinstatement / Modification Path (if selected)
- Agent 07 coordinates with Agent 08 (Servicer) to facilitate borrower contact
- **Reinstatement:** servicer communicates reinstatement quote; borrower pays all arrears
  - No human approval required for reinstatement unless amount is material
- **Modification:** servicer prepares modification terms (rate, term, principal reduction)
  - **HUMAN APPROVAL REQUIRED** for all modification terms before offering to borrower
- Agent 07 monitors: payment compliance under new terms
- If borrower defaults on modification → re-enter this workflow at Step 3

### Step 5B — Short Sale / DIL Path (if selected)
- Agent 08 coordinates with servicer to engage borrower
- Agent 04 provides updated BPO and minimum acceptable net to fund
- **HUMAN APPROVAL REQUIRED:** CEO/CIO approves minimum net proceeds before offer is communicated
- Servicer facilitates short sale or deed-in-lieu process
- Agent 05 reviews closing documents before authorization
- **HUMAN APPROVAL REQUIRED:** CEO/CIO authorizes acceptance of offer
- Agent 10 records disposition and confirms proceeds received

### Step 5C — Foreclosure Path (if selected)
- **HUMAN APPROVAL REQUIRED:** CEO/CIO authorizes foreclosure referral
- Agent 08 instructs servicer to refer loan to foreclosure counsel
- Agent 07 tracks: referral date, filing date, publication, redemption period, sale date
- Agent 08 monitors counsel performance against state timeline benchmarks
- **HUMAN APPROVAL REQUIRED:** CEO/CIO authorizes bid at foreclosure sale
- Agent 07 updates timeline and cost estimates monthly
- **If borrower files bankruptcy:** Agent 08 coordinates with bankruptcy counsel; Agent 07 updates resolution timeline

### Step 5D — REO Management (if foreclosure results in fund taking title)
- Agent 07 coordinates property preservation activation with Agent 08 (servicer/vendor)
- **HUMAN APPROVAL REQUIRED:** CEO/CIO authorizes REO listing and listing price
- Agent 07 produces REO disposition plan: agent selection, pricing, timeline
- Agent 08 monitors property preservation vendor and listing activity
- **HUMAN APPROVAL REQUIRED:** CEO/CIO approves offer acceptance
- Agent 10 records REO disposition proceeds

### Step 6 — Recovery Model Update (Agent 04)
- Agent 04 updates recovery model based on:
  - Resolution path chosen
  - Updated property value
  - Legal cost actuals vs. estimates
  - Timeline update
- Delivers updated recovery projection to Agent 07 and Agent 13 (Risk) monthly

### Step 7 — Risk & Treasury Impact Tracking (Agents 13 + 11)
- Agent 13: updates NPL risk exposure in portfolio risk dashboard
- Agent 11: tracks legal cost cash impact; confirms reserves are adequate
- Any cash impact material enough to affect distributions → escalate to CEO/CIO

### Step 8 — Resolution Confirmation & Close-Out (Agent 07)
- Resolution event occurs: reinstatement completed, modification performing, sale closed, foreclosure completed, REO sold
- Agent 07 documents outcome: resolution method, recovery amount, timeline actual vs. model
- Agent 10 records final accounting entry (gain/loss on disposition)
- Agent 13 removes loan from NPL risk tracker
- Agent 07 delivers post-resolution summary to Agent 17 for investor reporting

---

## Outputs

- NPL action plan (per loan, using template)
- Monthly NPL status report
- Legal cost and timeline actuals (monthly)
- Updated recovery model (monthly)
- REO disposition plan (if applicable)
- Post-resolution summary

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| NPL resolution strategy | CEO/CIO | Approval before any action |
| Modification terms | CEO/CIO | Before offering to borrower |
| Short sale minimum net | CEO/CIO | Before communicating to borrower |
| Short sale or DIL acceptance | CEO/CIO | Before authorizing closing |
| Foreclosure referral | CEO/CIO | Legal authorization |
| Bid at foreclosure sale | CEO/CIO | Investment decision |
| REO listing price | CEO/CIO | Authorization |
| REO offer acceptance | CEO/CIO | Authorization |

---

## Logs Updated

- `/logs/decision_log.md` — Strategy selection, all approvals, resolution outcome
- `/logs/approval_log.md` — All legal and disposition approvals
- `/logs/exception_log.md` — Any servicer or legal exceptions during resolution
