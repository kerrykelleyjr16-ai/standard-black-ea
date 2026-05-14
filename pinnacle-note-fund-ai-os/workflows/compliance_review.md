# Workflow: Compliance Review

**Workflow ID:** WF-07
**Trigger:** Any investor-facing, marketing, or public-facing material is created or updated
**Owner:** Agent 14 (Compliance, Marketing Review & Disclosure)
**Estimated Duration:** 2–5 business days (routine); same day (urgent)

---

## Purpose

Ensure that every piece of content the fund sends to investors, prospective investors, or the public has been reviewed for regulatory compliance, factual accuracy, and proper disclosure — before it goes out. No material bypasses this workflow.

---

## Trigger Conditions

Any of the following events:
- New investor marketing material created (pitch deck, one-pager, email campaign)
- Investor report drafted (per WF-05)
- Distribution notice prepared (per WF-06)
- Website content added or updated
- Social media content planned
- PPM or subscription agreement updated
- DDQ or RFP response drafted
- Any public statement or press release prepared
- Any new disclosure requirement identified

---

## Inputs

- Draft material from originating agent (Agent 16, 17, or CEO/CIO)
- Fund documents: PPM, LPA (for disclosure cross-reference)
- Performance data from Agent 10 (for track record or return claims)
- Conflicts register from Agent 15 (for conflict disclosures)
- Prior-approved materials (for consistency check)
- Regulatory guidance: SEC Reg D, Investment Advisers Act standards, state requirements

---

## Workflow Steps

### Step 1 — Material Submission (Originating Agent or CEO/CIO)
- Originating party routes draft material to Agent 14 with:
  - Document type
  - Intended audience (prospective investors, current investors, public)
  - Intended delivery channel (email, data room, website, in-person)
  - Urgency (standard 2-day review or same-day urgent)
- Submission logged in compliance log with date and version number

### Step 2 — Initial Intake Review (Agent 14)
- Confirm material is within compliance review scope
- Identify: document type, regulatory framework that applies
- Assign review checklist based on document type:
  - Marketing material: Reg D compliance, performance claims, risk disclosures, benchmark disclosure
  - Investor report: NAV accuracy, performance presentation, distribution language, forward-looking statement disclaimers
  - DDQ/RFP: consistency with approved response library, factual accuracy
  - Website/social media: Reg D solicitation rules, performance advertising restrictions

### Step 3 — Performance & Financial Data Verification (Agent 14 → Agent 10)
- If material contains any performance data, return figures, NAV references, or distribution references:
  - Agent 14 requests confirmation from Agent 10 that numbers are accurate and from audited/reconciled source
  - **No performance claim may be cleared without Agent 10 verification**

### Step 4 — Conflicts Disclosure Verification (Agent 14 → Agent 15)
- Review material for: any related-party references, fee disclosure, allocation conflict disclosure, vendor conflict disclosure
- Agent 15 confirms: all required conflict disclosures are current and included
- If material discloses a new conflict not previously in the conflicts register → flag to CEO/CIO before proceeding

### Step 5 — Compliance Review (Agent 14)
- Complete full review against checklist:

**Marketing Material Checklist:**
- [ ] No guarantee of returns language
- [ ] No "safe" or "risk-free" language
- [ ] No unsubstantiated performance claims
- [ ] Past performance disclaimer present (if any performance data shown)
- [ ] Benchmark clearly identified and appropriate (if used)
- [ ] Gross vs. net return distinction clear
- [ ] All fees disclosed
- [ ] Material conflicts disclosed
- [ ] Risk factors included or referenced
- [ ] Accredited investor / Reg D compliance confirmed (if applicable)

**Investor Report Checklist:**
- [ ] NAV verified against Agent 10 confirmation
- [ ] Performance data mathematically accurate
- [ ] Forward-looking statement disclaimer present
- [ ] Distribution language accurate and does not imply guaranteed future distributions
- [ ] No prohibited language

**DDQ/RFP Checklist:**
- [ ] All answers consistent with approved response library
- [ ] No factual claims that cannot be independently verified
- [ ] Performance data confirmed by Agent 10

### Step 6 — Findings Delivery (Agent 14)
- Produce written compliance review memo:
  - Issues found (by category)
  - Required edits (specific language changes)
  - Recommended additions (disclosures or qualifications)
  - Items cleared with no issue
- Route memo to originating agent for revision

### Step 7 — Revision & Re-Review (Agent 14)
- Originating agent incorporates required edits
- Routes revised version back to Agent 14
- Agent 14 confirms: all required edits incorporated
- Agent 14 issues clearance memo: "Cleared for CEO/CIO approval — version [X], date [Y]"

### Step 8 — Fund Counsel or Compliance Consultant Review (when required)
- Required for: new PPM or LPA, new material risk factors, novel regulatory questions, new disclosure categories
- Agent 14 identifies when outside review is required and routes to CEO/CIO for authorization
- **CEO/CIO must authorize engagement of outside counsel for review**
- Outside review results incorporated before clearance

### Step 9 — CEO/CIO Final Approval
- **HUMAN APPROVAL REQUIRED**
- CEO/CIO reviews: cleared material + compliance clearance memo
- Options:
  - Approve for release
  - Request additional revisions
  - Approve with noted modifications
- Approval logged in compliance log and approval log

### Step 10 — Release Authorization (Agent 16 or CEO/CIO)
- CEO/CIO or Agent 16 (per Agent 14's clearance memo) releases material through appropriate channel
- Compliance log updated: material name, version, clearance date, approval date, release date

---

## Outputs

- Compliance review memo (findings + required edits)
- Clearance memo (per version, when cleared)
- Revised material (from originating agent)
- CEO/CIO approval record
- Released material

---

## Human Approvals Required

| Decision Point | Approver | Type |
|---|---|---|
| Outside counsel engagement for review | CEO/CIO | Authorization |
| Material release | CEO/CIO | Final approval — required for all materials |
| Any new disclosure category | CEO/CIO | Policy decision |

---

## Logs Updated

- `/logs/compliance_log.md` — Material submitted, reviewed, findings, clearance date, CEO/CIO approval, release date
- `/logs/approval_log.md` — CEO/CIO approval record
- `/logs/decision_log.md` — Any new disclosure decisions or compliance policy changes

---

## Prohibited Actions (Hard Stops)

The following trigger an automatic halt in this workflow and immediate CEO/CIO escalation:

- Performance data in material that does not match Agent 10 records
- Guaranteed or assured return language in any form
- Solicitation of non-accredited investors (unless Rule 506(c) verified)
- Material omission of a known, material risk factor
- Social media post referencing fund performance without prior review
