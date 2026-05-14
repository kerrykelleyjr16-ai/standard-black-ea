# Workflow: Distribution Process

**Workflow ID:** WF-06
**Trigger:** Distribution cycle date (per fund documents) or CEO/CIO decision to declare a distribution
**Owner:** Agent 11 (Cash Controls, Distributions & Treasury)
**Estimated Duration:** 5–10 business days from distribution authorization to wires cleared

---

## Purpose

Execute fund distributions with complete accuracy, proper authorization, and a fully documented audit trail. No distribution goes out before the waterfall is confirmed, reserves are set, NAV is reconciled, and dual human approval is in place. Every dollar is traceable from portfolio cashflows to investor accounts.

---

## Trigger Conditions

- Scheduled distribution date per fund calendar (e.g., quarterly distributions)
- CEO/CIO decision to declare an interim distribution
- NAV confirmation received and distribution capacity confirmed

---

## Inputs

- Confirmed NAV (from Agent 10)
- Collections and cashflow data (from Agent 06)
- Legal cost and expense actuals (from Agents 07, 08)
- Distribution policy (`/policies/distribution_policy.md`)
- Waterfall structure (from fund documents / LPA)
- Investor capital account data (from Agent 10)
- Investor wire instructions (on file — verified independently)

---

## Workflow Steps

### Step 1 — Distribution Authorization Decision (CEO/CIO)
- **HUMAN APPROVAL REQUIRED — first gate**
- CEO/CIO decides to declare a distribution for the period
- Authorizes Agent 11 to begin distribution calculation
- Logged in approval log

### Step 2 — NAV & Capital Account Confirmation (Agent 10)
- Confirm final NAV for the period is signed off (per WF-05)
- Confirm each investor's capital account balance is current and accurate
- Confirm: management fees, preferred return accrual, and incentive fee (if applicable) are properly calculated
- Deliver confirmed capital account schedule to Agent 11

### Step 3 — Available Cash Confirmation (Agent 11)
- Confirm actual cash balances across all fund and SPV accounts
- Subtract: minimum operating reserve (per `/policies/distribution_policy.md`)
- Subtract: estimated expenses for next 30 days (legal, servicing, property expenses)
- Subtract: any facility repayment obligation due within 30 days
- Calculate: distributable cash available
- **If distributable cash is insufficient for intended distribution:** halt; escalate to CEO/CIO with analysis

### Step 4 — Reserve Adequacy Confirmation (Agent 11)
- Confirm: cash remaining after distribution meets minimum reserve requirements
- Confirm: no known capital call obligation that would require cash retention
- Confirm: no pending legal cost that would impair liquidity post-distribution
- Deliver reserve adequacy confirmation memo to CEO/CIO

### Step 5 — Waterfall Calculation (Agent 11)
- Apply distribution waterfall per LPA:
  - Return of capital (if applicable per policy)
  - Preferred return (per annum rate, confirmed with Agent 10)
  - GP catch-up (if applicable)
  - Residual split (GP/LP)
- Produce per-investor distribution amounts
- Produce per-investor tax withholding (if applicable — confirm with Agent 10 / tax advisor)
- Deliver waterfall calculation to Agent 10 for verification

### Step 6 — Fund Administrator Confirmation (Agent 08 oversight)
- Fund administrator independently confirms distribution amounts against their capital account records
- Any discrepancy → halt distribution; escalate to Agent 10 and CEO/CIO for resolution before proceeding

### Step 7 — Investor Distribution Notice Draft (Agent 11 → Agent 14 → Agent 16)
- Agent 11 produces draft distribution notice (amounts, tax allocations, payment date)
- Agent 14 reviews distribution notice language: compliance with fund documents, proper disclosures
- CEO/CIO approves investor notice content
- Agent 16 distributes approved notices to investors per delivery preferences
- **Timeline:** notices out at least 2 business days before payment date (per policy)

### Step 8 — Wire Authorization Checklist (Agent 11)
- Produce complete wire authorization checklist:
  - [ ] NAV confirmed (Agent 10 sign-off)
  - [ ] Available cash confirmed
  - [ ] Reserve adequacy confirmed
  - [ ] Waterfall calculation verified by fund admin
  - [ ] Per-investor amounts confirmed
  - [ ] Wire instructions verified independently (not from investor email — from file on record)
  - [ ] Investor distribution notices delivered
  - [ ] CEO/CIO approval obtained
  - [ ] Controller approval obtained
- Checklist delivered to CEO and Controller for dual sign-off

### Step 9 — Dual Approval — CEO/CIO + Controller
- **DUAL HUMAN APPROVAL REQUIRED — mandatory; no exceptions**
- CEO/CIO reviews and signs wire authorization checklist
- Controller reviews and signs wire authorization checklist
- Both signatures required before any wire is initiated
- Approvals logged in approval log with timestamp

### Step 10 — Wire Execution
- **Executed by authorized human only — agent does not initiate wires**
- Authorized team member executes wires per the approved checklist
- Each wire confirmed as sent
- Wire confirmations received and logged

### Step 11 — Post-Distribution Reconciliation (Agents 10 + 11)
- Confirm all wires received by investors (follow up on any failed or returned wires immediately)
- Agent 10: records distribution in capital accounts — reduces each investor's contributed capital or distributable income per LPA
- Agent 11: confirms cash reconciliation post-distribution
- Distribution log updated

---

## Outputs

- Waterfall calculation (Agent 11)
- Capital account distribution schedule (Agent 10)
- Reserve adequacy memo (Agent 11)
- Wire authorization checklist
- Dual-approved authorization record
- Distribution notices (delivered to investors)
- Wire confirmations
- Post-distribution capital account update

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| Distribution declaration | CEO/CIO | First authorization |
| Distribution notice language | CEO/CIO | Communications authorization |
| Wire authorization | CEO + Controller (dual) | Mandatory — hard stop |

---

## Logs Updated

- `/logs/decision_log.md` — Distribution declaration and all approvals
- `/logs/approval_log.md` — Dual approval record with timestamps
- `/logs/audit_log.md` — Wire execution confirmation and reconciliation
- `/logs/compliance_log.md` — Distribution notice review and approval
