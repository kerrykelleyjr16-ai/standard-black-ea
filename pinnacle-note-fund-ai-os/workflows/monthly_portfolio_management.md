# Workflow: Monthly Portfolio Management

**Workflow ID:** WF-03
**Trigger:** Monthly servicer report received (typically 15th–25th of each month)
**Owner:** Agent 06 (Performing Portfolio) and Agent 07 (Workout) — coordinated by Agent 01
**Estimated Duration:** 10–15 business days from servicer report receipt to investor report distribution

---

## Purpose

Convert monthly servicer data into a complete, reviewed, approved, and distributed portfolio management cycle — covering collections, delinquency monitoring, NPL updates, exception tracking, accounting reconciliation, risk reporting, and investor reporting.

---

## Trigger Conditions

- Primary servicer delivers monthly remittance and delinquency report
- Special servicer delivers NPL status update
- Fund administrator delivers NAV package

---

## Inputs

- Monthly servicer remittance and delinquency report
- Special servicer NPL status report
- Fund administrator NAV package
- Prior month's watchlist and exception tracker
- Tax and insurance confirmation data (from servicer)

---

## Workflow Steps

### Step 1 — Data Import & Validation (Agent 18)
- Receive servicer report
- Import and normalize data against fund data dictionary
- Validate: payment data, UPB balances, escrow data, delinquency classification
- Flag any data discrepancies or missing fields to Agent 06 and Agent 09
- Deliver validated data set to Agent 06 and Agent 07
- **Timeline:** within 48 hours of servicer report receipt

### Step 2 — Performing Portfolio Review (Agent 06)
- Review all performing and RPL loans: payment status, UPB movement, escrow, taxes, insurance
- Identify: new delinquencies (30/60/90+ days)
- Identify: escrow shortages, tax delinquencies, insurance lapses
- Update watchlist: add any loans showing early deterioration
- Prepare cashflow forecast (next 3 months) for Agent 11
- Flag any loans for workout handoff to Agent 07
- **Timeline:** within 5 business days of receiving validated data

### Step 3 — NPL / Workout Portfolio Review (Agent 07)
- Review all NPLs: legal status updates, borrower contact status, resolution strategy currency
- Update timeline estimates for each NPL
- Flag any legal deadlines within 30 days to Agent 01 for escalation
- Flag any REO properties ready for disposition to CEO/CIO
- Update recovery projections with Agent 04
- **Timeline:** within 5 business days of receiving validated data

### Step 4 — Exception Review (Agent 09)
- Review any servicer reporting errors flagged by Agent 18 or Agent 06
- Update exception tracker: status of all open exceptions
- Escalate any Critical or Major exceptions unresolved past deadline
- Deliver updated exception summary to Agent 01 and Agent 08

### Step 5 — Servicer Performance Review (Agent 08)
- Review servicer report for SLA compliance: remittance timing, data completeness, escrow accuracy
- Confirm tax payments made on schedule
- Confirm insurance status current on all escrowed loans
- Log any SLA issues in vendor issue log
- Escalate any material servicer failures to Agent 01 and CEO/CIO

### Step 6 — Risk Report Update (Agent 13)
- Update portfolio risk dashboard using new data from Agents 06 and 07
- Run monthly stress test
- Update: delinquency migration analysis, concentration risk, legal timeline risk, liquidity risk
- Flag any new risk limit breaches to Agent 01 and CEO/CIO
- Produce risk section for investor report
- **Timeline:** within 7 business days of servicer report receipt

### Step 7 — Controller Reconciliation (Agent 10)
- Receive NAV package from fund administrator
- Reconcile: capital accounts, income allocation, fee calculations, cash reconciliation
- Confirm: SPV accounting entries match servicer remittance data
- Flag any NAV discrepancies to Agent 08 (fund admin oversight) and CEO/CIO
- Produce controller sign-off on NAV
- **Timeline:** within 5 business days of NAV package receipt

### Step 8 — Treasury & Liquidity Review (Agent 11)
- Receive confirmed NAV from Agent 10
- Receive cashflow forecast from Agent 06
- Confirm cash position across all accounts
- Determine: distribution capacity (if distribution cycle)
- Produce: 3-month forward cash model
- Flag any liquidity concerns to Agent 01 and CEO/CIO

### Step 9 — Investor Report Drafting (Agent 17)
- Collect inputs: portfolio update (Agent 06), NPL update (Agent 07), NAV (Agent 10), distributions (Agent 11), risk summary (Agent 13)
- Draft investor report using `/templates/investor_report_template.md`
- **Timeline:** draft complete within 10 business days of servicer report receipt

### Step 10 — Compliance Review (Agent 14)
- Receive investor report draft from Agent 17
- Review: performance language, NAV presentation, forward-looking statements, risk disclosures, distribution language
- Provide written findings and required edits
- Confirm: no prohibited language, no unsubstantiated claims
- Return cleared draft to Agent 17
- **Timeline:** within 2 business days of receiving draft

### Step 11 — CEO/CIO Final Review & Approval
- **HUMAN APPROVAL REQUIRED**
- CEO/CIO reviews: complete investor report, risk report, exception summary, financial reconciliation, distribution analysis
- Decisions:
  - Approve report for distribution
  - Request revisions
  - Approve distribution (if applicable — separate authorization per WF-06)
- **Timeline:** within 2 business days of receiving cleared draft

### Step 12 — Report Distribution (Agent 16)
- Receive approved report from CEO/CIO
- Distribute to all investors per delivery method and timing preferences in investor CRM
- Confirm delivery
- Log distribution in compliance log

---

## Outputs

- Validated servicer data set (Agent 18)
- Monthly portfolio monitoring report (Agent 06)
- NPL status report (Agent 07)
- Exception summary (Agent 09)
- Servicer performance review (Agent 08)
- Risk dashboard update (Agent 13)
- NAV confirmation (Agent 10)
- Treasury / liquidity analysis (Agent 11)
- Investor report — approved and distributed (Agent 17 → Agent 16)

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| Any workout handoff requiring legal action | CEO/CIO | Legal authorization |
| NAV release to investors | CEO/CIO | Financial approval |
| Investor report release | CEO/CIO | Communications approval |
| Distribution authorization | CEO + Controller (dual) | Per WF-06 |

---

## Logs Updated

- `/logs/decision_log.md` — All material monthly decisions
- `/logs/exception_log.md` — Exception status updates
- `/logs/compliance_log.md` — Investor report review and approval
- `/logs/vendor_issue_log.md` — Servicer performance issues
- `/logs/approval_log.md` — CEO/CIO approvals for report and distribution
