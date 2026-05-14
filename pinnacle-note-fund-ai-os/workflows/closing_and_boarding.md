# Workflow: Closing & Boarding

**Workflow ID:** WF-02
**Trigger:** Seller accepts bid / LOI is countersigned
**Owner:** Agent 05 (Diligence, Collateral & Closing)
**Estimated Duration:** 10–30 business days (depending on tape size and collateral complexity)

---

## Purpose

Take a signed LOI through full diligence, fund the acquisition, and board all loans to the servicer with complete, verified data. Nothing closes without complete diligence. No wire is sent without dual human approval.

---

## Trigger Conditions

- Seller countersigns LOI
- CEO/CIO authorizes Agent 05 to begin formal diligence

---

## Inputs

- Executed LOI
- Seller collateral files: notes, mortgages, assignments, allonges, title reports
- Preliminary pricing model from Agent 04
- Fund SPV and entity setup (confirmed by Agent 10)
- Fund cash availability and wire instructions (from Agent 11)
- Servicer onboarding instructions

---

## Workflow Steps

### Step 1 — Diligence Authorization (CEO/CIO → Agent 05)
- **HUMAN APPROVAL REQUIRED**
- CEO/CIO authorizes formal diligence phase
- Agent 05 requests collateral files from seller (via standard document request list)
- Agent 05 opens diligence tracker — all loans receive unique asset ID
- Diligence deadline confirmed: typically 15–30 days from LOI execution

### Step 2 — Collateral Document Review (Agent 05)
- Review each loan: note, mortgage/DOT, assignment chain, allonges, endorsements
- Confirm: original note is properly endorsed; full assignment chain recorded; title report confirms first lien (or applicable lien priority)
- Review: tax records, insurance certificates, bankruptcy/foreclosure status from tape and updated sources
- Produce: exception list per loan using `/templates/exception_tracker_template.md`
- Severity classification: Critical, Major, Minor, Informational
- **If Critical exceptions identified:** halt closing on those loans; escalate to CEO/CIO immediately
- **Timeline:** continuous during diligence period

### Step 3 — Exception Resolution (Agent 05 + Agent 02 + Seller)
- Agent 05 delivers exception list to Agent 02 for seller communication
- Agent 02 routes required information to CEO/CIO before formal seller request
- Seller provides cures, additional documentation, or price adjustments for uncured exceptions
- Agent 05 tracks exception status daily
- **If major exceptions not cured by deadline:** escalate to CEO/CIO for decision (waiver or walk)

### Step 4 — Updated Pricing (Agent 04)
- Agent 04 updates pricing model for any price adjustments due to diligence exceptions
- Confirms revised bid is still within return thresholds
- Routes revised IC memo section to Agent 01 if material change

### Step 5 — SPV & Accounting Setup (Agent 10)
- Confirm the correct SPV will hold the loans (per fund entity structure)
- Confirm accounting entries are prepared for purchase: UPB, purchase price, discount, acquisition costs
- Confirm fund administrator is notified of pending acquisition for capital account tracking
- Deliver SPV confirmation to Agent 05 and Agent 11

### Step 6 — Closing Readiness Confirmation (Agent 05)
- Confirm all documents are in order: complete, signed, endorsed, assigned
- Confirm all critical and major exceptions are resolved or waived (with CEO/CIO authorization)
- Produce: closing readiness confirmation memo
- Deliver to: Agent 11 (Cash Controls), Agent 10 (Controller), Agent 01 (COO)

### Step 7 — Wire Authorization Checklist (Agent 11)
- Receive closing readiness confirmation from Agent 05
- Confirm: purchase price, wire amount, wire instructions (independently verified — not from seller email)
- Confirm: reserve impact assessed
- Confirm: facility draw authorized if leveraged acquisition (coordinate with Agent 12)
- Produce: wire authorization checklist — all items confirmed checked
- Route wire checklist to CEO/CIO for dual approval

### Step 8 — Wire Execution
- **DUAL HUMAN APPROVAL REQUIRED: CEO + Controller**
- No wire may be initiated by any agent
- CEO and Controller both authorize wire
- Wire executed by authorized human
- Wire confirmation received and logged

### Step 9 — Servicer Boarding Coordination (Agent 08)
- Agent 08 delivers boarding package to servicer: loan data file, collateral copies, escrow setup instructions, payment history
- Confirms boarding timeline with servicer
- Receives boarding confirmation from servicer

### Step 10 — Boarding QA (Agent 09)
- Agent 09 receives boarding confirmation and reviews servicer system data
- Confirms: UPB, rate, payment schedule, escrow setup, property data, borrower data all match closing package
- Identifies any boarding defects: logs in exception tracker
- Routes boarding defects to Agent 08 for servicer correction
- **Timeline:** within 10 business days of boarding

### Step 11 — Portfolio Monitoring Activation
- Performing loans: handed off to Agent 06 (Performing Portfolio) for ongoing monitoring
- NPLs: handed off to Agent 07 (Workout) for resolution strategy development
- Both agents confirm receipt and assign asset IDs in their tracking systems

---

## Outputs

- Complete diligence file (per loan)
- Exception tracker (resolved and documented)
- Closing readiness confirmation
- Wire authorization checklist
- Wire confirmation
- Boarding package delivered
- Boarding QA report
- Portfolio monitoring activation confirmation

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| Formal diligence authorization | CEO/CIO | Go authorization |
| Exception waiver (critical or major) | CEO/CIO | Written approval with rationale |
| Price revision due to diligence exceptions | CEO/CIO | Investment decision |
| Wire authorization | CEO + Controller (dual) | Mandatory — no exceptions |

---

## Logs Updated

- `/logs/decision_log.md` — Diligence authorization, exception waivers, wire authorization
- `/logs/approval_log.md` — CEO/CIO and Controller wire approval
- `/logs/exception_log.md` — All exceptions identified and resolution status
- `/logs/audit_log.md` — Wire execution confirmation

---

## Post-Close → Proceed To

Performing loans: **WF-03: Monthly Portfolio Management**
NPLs: **WF-04: NPL Resolution**
