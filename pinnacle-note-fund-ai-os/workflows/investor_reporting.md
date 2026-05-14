# Workflow: Investor Reporting

**Workflow ID:** WF-05
**Trigger:** Monthly or quarterly reporting cycle (per fund documents and investor agreements)
**Owner:** Agent 17 (DDQ, Data Room & Investor Reporting)
**Estimated Duration:** 10–15 business days from NAV package receipt to distribution

---

## Purpose

Produce an accurate, compliance-reviewed, CEO/CIO-approved investor report and distribute it to all investors on schedule. Every number in the report is verified against source documents. Every statement in the report has been reviewed for compliance risk. Nothing goes out without proper approval.

---

## Trigger Conditions

- Monthly or quarterly reporting date per fund calendar
- Annual audited financial statement availability
- Special circumstances requiring off-cycle investor communication (material events, distribution notices)

---

## Inputs

- NAV package from fund administrator
- Portfolio data: performing collections, delinquency data (Agent 06), NPL status (Agent 07)
- Risk summary (Agent 13)
- Distribution data (Agent 11)
- Compliance review availability (Agent 14)
- Investor contact list and delivery preferences (Agent 16)

---

## Workflow Steps

### Step 1 — Reporting Calendar Confirmation (Agent 01)
- Agent 01 confirms reporting cycle start date and all input deadlines
- Agent 17 sends input request to all contributing agents with specific deadlines:
  - Agent 06: Performing portfolio summary
  - Agent 07: NPL/workout summary
  - Agent 10: NAV and capital account confirmation
  - Agent 11: Distribution data (if applicable)
  - Agent 13: Risk summary and stress test results
- **Deadline for all inputs:** T+10 business days from servicer report receipt (adjust per fund calendar)

### Step 2 — NAV Package Review (Agent 10)
- Agent 10 receives fund admin NAV package
- Reviews: capital accounts, income allocation, fee calculations, cash reconciliation
- Confirms NAV or flags discrepancies
- Delivers: controller sign-off on NAV to Agent 17
- **Timeline:** within 5 business days of NAV package receipt

### Step 3 — Portfolio Input Collection (Agents 06, 07)
- Agent 06 delivers: collections, delinquency, watchlist update, cashflow data
- Agent 07 delivers: NPL status by loan, resolution progress, legal timeline, recovery update
- Both confirm data accuracy against servicer reports

### Step 4 — Risk Summary Preparation (Agent 13)
- Agent 13 delivers: concentration risk, default migration, liquidity risk, stress test results, risk limit status
- Produces a 1-page risk narrative suitable for investor report inclusion

### Step 5 — Investor Report Draft (Agent 17)
- Assemble all inputs
- Draft investor report using `/templates/investor_report_template.md`
- Sections: reporting period header, NAV, contributions, distributions, portfolio composition (Performing/RPL/NPL mix), geographic exposure, new acquisitions, resolutions, watchlist, risk summary, manager commentary, disclosures
- Internal review: confirm all numbers cross-reference to source documents
- **Timeline:** draft complete within 3 business days of receiving all inputs

### Step 6 — Compliance Review (Agent 14)
- Agent 17 routes draft to Agent 14
- Agent 14 reviews: performance language, NAV presentation, risk disclosure adequacy, forward-looking statements, distribution language, any track record claims
- Delivers: written review findings and required edits
- Agent 17 incorporates edits and re-routes if material changes are required
- Agent 14 confirms final clearance
- **Timeline:** 2 business days

### Step 7 — CEO/CIO Review & Approval
- **HUMAN APPROVAL REQUIRED**
- CEO/CIO reviews complete report
- Reviews compliance clearance confirmation
- Options:
  - Approve for distribution
  - Request specific revisions
  - Approve with minor changes noted
- CEO/CIO approval documented in approval log
- **Timeline:** 2 business days

### Step 8 — Distribution (Agent 16)
- Agent 16 receives approved report
- Distributes to each investor per their delivery preferences (email, data room, portal)
- Confirms delivery (read receipts where possible, or confirmation of upload)
- Updates investor CRM: report delivered, date, method
- Logs distribution in compliance log

### Step 9 — Investor Questions Management (Agent 16 → Agent 17 → Agent 14 → CEO/CIO)
- Agent 16 receives and triages investor questions arising from the report
- Questions requiring substantive answers: Agent 17 drafts; Agent 14 reviews; CEO/CIO approves before delivery
- Simple administrative questions: Agent 16 handles with CEO/CIO awareness
- All investor questions and responses logged in decision log

---

## Outputs

- Draft investor report (Agent 17)
- Compliance-cleared investor report (Agent 14 + Agent 17)
- CEO/CIO-approved investor report
- Distributed report (Agent 16)
- Delivery confirmation
- Investor questions log

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| NAV released to investors | CEO/CIO | Financial authorization |
| Investor report released | CEO/CIO | Communications authorization |
| Investor question responses (substantive) | CEO/CIO | Communications authorization |
| Manager commentary language | CEO/CIO | Content approval |

---

## Logs Updated

- `/logs/compliance_log.md` — Compliance review and clearance record
- `/logs/approval_log.md` — CEO/CIO approval record
- `/logs/decision_log.md` — Distribution confirmation and investor question log
