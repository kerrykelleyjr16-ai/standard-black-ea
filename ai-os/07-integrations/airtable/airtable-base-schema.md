# Airtable Base Schema
# Standard Black — All 10 Bases

**Source:** `pinnacle-note-fund-ai-os/tech_stack/airtable_command_center.md`
**Phase I:** Build bases 1–4. Remaining when deal volume requires.

---

## Base 1: Deal Pipeline — BUILD FIRST

**Tables:**
- 1A. Tape Log — every tape received from first contact to close
- 1B. Pricing Summary — bid models and Kerry's approved bid
- 1C. LOI Tracker — letters of intent, seller responses
- 1D. Closing Tracker — wire authorization and loan boarding

**Key fields in Tape Log:**
Tape ID, Seller (linked → Seller CRM), Date Received, Loan Count, Total UPB, Asset Mix, Status, Go/No-Bid, Bid Deadline, Days to Deadline (formula), Deadline Alert (formula), Notes, Drive Link

**Status flow:** Received → Screening → Underwriting → Pricing → LOI Sent → Accepted / Rejected / Closed

**Phase I note:** Kerry enters tape data manually after each tape received. Claude Code can generate the IC memo and paste key fields into this base.

---

## Base 2: Seller CRM — BUILD SECOND

**Tables:**
- 3A. Sellers — full contact record per seller
- 3B. Tape History — every tape linked to its seller
- 3C. Seller Communication Log — every call, email, and follow-up

**Key fields in Sellers:**
Seller ID, Company Name, Primary Contact, Email, Phone, State, Relationship Status, Total Tapes Received (rollup), Total UPB Sourced (rollup), Last Tape Date (rollup), Go/No-Bid Rate, Closed Deals Count, Notes

**Relationship status options:** Active, Warm, Cold, Blacklisted

**Phase I note:** Kerry builds this as he meets sellers, brokers, and servicers. Claude Code / crm-manager skill feeds into this.

---

## Base 3: Approval Queue — BUILD THIRD

**Tables:**
- 7A. Open Approvals — every pending decision requiring Kerry's sign-off
- 7B. Completed Approvals — archive of every decision made

**Key fields in Open Approvals:**
Approval ID, Approval Type, Item Description, Requested By, Request Date, Amount, Priority (URGENT / High / Normal), Expires, Kerry Decision (Pending / Approved / Rejected), Rejection Reason, Decision Date

**Approval types:** LOI, Closing, Wire, Distribution, Investment, Compliance, Legal, Vendor Contract, NPL Strategy, Other

**Escalation rule:** Wire ≥ $50,000 requires dual approval (Secondary Approver field must also be Approved)

---

## Base 4: Task Management — BUILD FOURTH

**Tables:**
- 9A. Agent Sessions — log of every Claude Code skill session run on a deal
- 9B. Human Task Queue — Kerry, Kody, and TJ task assignments
- 9C. Workflow Status — health of all active workflows

**Key fields in Human Task Queue:**
Task Name, Category, Assigned To (Kerry / Kody / TJ), Due Date, Days Until Due (formula), Priority, Status, Related Record, Notes

**Phase I note:** This replaces the informal iMessage/text task tracking. Every assigned task lives here.

---

## Base 5: Exception Tracker — BUILD WHEN FIRST DEAL IS IN DILIGENCE

**Tables:**
- 5A. Diligence Exceptions — issues found during title, legal, collateral review
- 5B. Boarding Exceptions — issues found during loan boarding with servicer
- 5C. Exception Dashboard — daily snapshot of open exception counts

---

## Base 6: Loan Asset Registry — BUILD WHEN FIRST LOAN IS CLOSED

**Tables:**
- 2A. Active Portfolio — every note the fund owns
- 2B. NPL Strategy Tracker — workout strategy per non-performing loan
- 2C. Cashflow Monitor — monthly expected vs. actual collections per loan

---

## Base 7: Vendor Management — BUILD WHEN FIRST SERVICER IS ENGAGED

**Tables:**
- 6A. Vendor Registry — all servicers, attorneys, title companies, BPO providers
- 6B. Servicer Tracker — remittance schedules, SLA performance
- 6C. Vendor Issues — issues logged against each vendor
- 6D. Monthly Scorecards — SLA score per vendor per month

---

## Base 8: Compliance Calendar — PHASE I LIGHT VERSION

**Tables (simplified for Phase I):**
- 8B. Regulatory & Operational Deadlines — any regulatory or reporting deadlines
- 8C. Control Tests — placeholder for Phase II governance controls

---

## Bases 9–10: Investor CRM + Reporting — PHASE II

Build when capital raising begins. Full schema in `airtable_command_center.md` sections 4 and 10.

---

## Interface Build Order (after bases are live)

1. CEO/CIO Command Center — Kerry's morning briefing
2. Acquisitions Dashboard — deal pipeline view
3. Task Management — team task view

Remaining 4 interfaces: Phase II when portfolio is live.

---

## Permissions Summary

| Person | Role | Access |
|---|---|---|
| Kerry | Owner | Full admin on all bases |
| Kody | Creator | Deal Pipeline, Loan Asset, Exception, Vendor, Task Management |
| TJ | Commenter | Task Management (Human Queue), Loan Asset (read-only) |
