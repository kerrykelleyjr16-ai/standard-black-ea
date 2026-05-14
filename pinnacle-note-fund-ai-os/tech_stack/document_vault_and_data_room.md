# Document Vault and Data Room — The Pinnacle Note Fund AI OS

**Fund:** The Pinnacle Note Fund
**Document:** Document Vault Structure, Data Room Design, and DocuSign Workflows
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Platform Strategy

**Lean Stage (Current — Phase I through mid-Phase II):** Google Drive

Google Drive is the operating document system now. It is already connected via MCP, integrates cleanly with n8n, and requires no additional cost at the current scale. All folder structures, naming conventions, access rules, and workflows in this document are designed to run on Google Drive first.

**Institutional Stage (Phase II+ — when AUM exceeds $5M or first institutional LP):** Box

Box replaces Google Drive as the primary vault. Box provides enterprise-grade version control, granular folder-level permissions, watermarking on sensitive documents, detailed access audit logs, and tighter integration with DocuSign at the enterprise tier. When the transition occurs, all folder structures, naming conventions, and DocuSign workflows described here carry over — Box is a platform upgrade, not a redesign.

**Transition Trigger:** Either (1) first institutional LP (family office, RIA, registered fund) commits capital, or (2) AUM crosses $5M, whichever comes first. Agent 18 flags this threshold and initiates the migration plan.

---

## Global File Naming Convention

All files across the vault follow this naming standard:

```
[CATEGORY]-[IDENTIFIER]-[DESCRIPTION]-[YYYY-MM-DD].[ext]
```

**Category codes:**
| Code | Category |
|---|---|
| FUND | Fund entity documents |
| INV | Investor / LP documents |
| SUB | Subscription documents |
| SELL | Seller documents |
| TAPE | Loan tape files |
| COLL | Collateral files |
| TITLE | Title reports and policies |
| VAL | BPOs and valuations |
| SVC | Servicer reports |
| LGL | Legal files |
| FC | Foreclosure files |
| BK | Bankruptcy files |
| ADMIN | Fund admin and financial reports |
| TAX | Tax documents |
| AUDIT | Audit documents |
| COMP | Compliance reviews |
| RPT | Investor reports |
| DR | Data room items |
| VND | Vendor agreements |

**Examples:**
- `TAPE-2026-003-Pool-A-Seller-XYZ-2026-04-15.xlsx` — raw tape file
- `COLL-LOAN-2026-00042-Original-Note-2026-05-01.pdf` — original note for loan
- `SUB-LP-007-Signed-Subscription-Agreement-2026-03-20.pdf` — signed LP subscription
- `RPT-Q2-2026-Investor-Report-Final-2026-07-15.pdf` — quarterly investor report

**Rules:**
- No spaces in file names — use hyphens
- Dates always YYYY-MM-DD format
- Status suffixes where applicable: `-Draft`, `-Final`, `-Signed`, `-Executed`, `-Voided`
- Version suffixes where applicable: `-v1`, `-v2`, etc. (Final version has no version suffix)

---

## Security Classification Reference

| Level | Definition | Storage Rule |
|---|---|---|
| Public | Approved for external distribution | Google Drive / Box shared folders; cleared by Agent 14 |
| Internal | Fund operational data — team access only | Google Drive / Box — team permissions; no external sharing |
| Confidential | Sensitive fund and investor data | Restricted folder access; agent read requires explicit grant |
| Restricted | PII, wire instructions, AML/KYC docs, SSNs | Box only (institutional stage); Google Drive with strict permissions (lean stage); access logged every time; never emailed |

---

## Access Roles Reference

| Role | Personnel | Drive Access Level |
|---|---|---|
| Owner | Kerry Kelley Jr | All folders — full admin |
| Content Manager | Kody Kelley | Operational folders — add/edit; no delete |
| Content Manager (Limited) | TJ Henry | Team-shared folders only |
| Viewer | LP Investors | Data room folders — own investor folder only |
| Agent / n8n | Automated system | Write to designated folders via Google Drive API; reads per workflow |
| Auditor | Annual audit engagement (external) | Read-only — specific folders only; deprovisioned after engagement |

---

## Root Drive Structure

**Google Drive Shared Drive Name:** `Pinnacle Note Fund Operations`

All 18 folder categories live under this root drive. No personal "My Drive" — everything in the Shared Drive so ownership does not depend on any one person's Google account.

```
/Pinnacle Note Fund Operations
  /01 - Fund Documents
  /02 - Investor Documents
  /03 - Subscription Documents
  /04 - Seller Documents
  /05 - Loan Tapes
  /06 - Collateral Files
  /07 - Title Reports
  /08 - BPOs and Valuations
  /09 - Servicer Reports
  /10 - Legal Files
  /11 - Foreclosure and Bankruptcy
  /12 - Fund Admin Reports
  /13 - Tax Documents
  /14 - Audit Documents
  /15 - Compliance Reviews
  /16 - Investor Reporting
  /17 - Data Room
  /18 - Vendor Agreements
```

Numbered prefixes force alphabetical sort into the correct operational order. All subfolders follow a consistent pattern established per category below.

---

## Folder 01: Fund Documents

**Purpose:** Core entity documents for Kasino Family Holdings, Standard Black, the Pinnacle Note Fund entity, and any SPVs. The legal foundation of the fund.

**Subfolders:**
```
/01 - Fund Documents
  /Entity Formation
    /Kasino Family Holdings
    /Standard Black
    /Pinnacle Note Fund [Entity Name]
    /SPV-001 [Entity Name]
    /SPV-002 [Entity Name]
    ... (one subfolder per SPV as formed)
  /Operating Agreements
  /Fund Governing Documents
    /PPM - Private Placement Memorandum
    /LPA - Limited Partnership Agreement
    /Management Agreement
    /Investment Management Agreement
  /Regulatory Filings
    /Form D (SEC)
    /State Blue Sky Filings
  /EIN and Tax IDs
  /Bank Account Documentation
  /Registered Agent
```

**File Naming:**
```
FUND-[ENTITY]-[DOCUMENT TYPE]-[STATUS]-[DATE].[ext]
Examples:
  FUND-PNF-LPA-Executed-2026-03-01.pdf
  FUND-SPV001-Operating-Agreement-Executed-2026-04-10.pdf
  FUND-PNF-Form-D-Filed-2026-03-15.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- No access: Kody, TJ, investors, agents
- Auditor: Read-only during engagement (Entity Formation, Operating Agreements only)

**Security Level:** Restricted (EIN, bank docs) / Confidential (governing docs)

**Responsible Agents:** Agent 18 (tracks document existence; logs file metadata to Supabase `documents` table)

**Human Approval Required Before Release:** All governing documents require Kerry sign-off before any LP or counterparty receives a copy

**Compliance / Legal Review Required:** PPM, LPA, Management Agreement — legal counsel review required before finalizing. Agent 14 compliance review before distribution to any prospect or LP.

---

## Folder 02: Investor Documents

**Purpose:** Individual investor folders — one per LP. Contains the full investor file: signed documents, KYC/AML records, K-1s, wire instructions (Restricted — Box only at institutional stage), and communication history.

**Subfolders:**
```
/02 - Investor Documents
  /LP-001 - [Investor Full Name or Entity]
    /KYC-AML
    /Accreditation Verification
    /Subscription Agreement (signed)
    /Wire Instructions (RESTRICTED - 1Password only at lean stage)
    /K-1s and Tax Documents
    /Distribution Notices (signed)
    /Communications
  /LP-002 - [Investor Full Name or Entity]
    ... (same structure)
  /_Template - New Investor Folder
    (blank folder structure to copy for each new LP)
```

**File Naming:**
```
INV-[LP-ID]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  INV-LP001-Accreditation-Verification-2026-03-10.pdf
  INV-LP001-K1-FY2026-2027-02-01.pdf
  INV-LP001-Distribution-Notice-Q1-2026-Signed-2026-04-15.pdf
```

**Access Permissions:**
- Owner: Kerry (full access to all LP folders)
- Controller (future): Read access to all LP folders
- LP Investors: Read-only access to their own folder ONLY — Google Drive share at folder level
- No access: Kody, TJ (unless specifically authorized by Kerry)
- Agent 16 / n8n: Write access to Communications subfolder only

**Security Level:** Restricted (KYC/AML, wire instructions, accreditation docs) / Confidential (signed agreements, K-1s)

**Responsible Agents:** Agent 16 (communication history), Agent 17 (K-1s, distribution notices filed here), Agent 18 (grants/revokes LP access to their folder; logs access events)

**Human Approval Required:** Wire instruction documents — Kerry must verbally confirm before any wire executed (never emailed; 1Password secure share only at lean stage; Box with watermarking at institutional stage)

**Compliance / Legal Review Required:** KYC/AML documentation — legal standard for accredited investor verification must be followed. Agent 14 reviews accreditation methodology annually.

---

## Folder 03: Subscription Documents

**Purpose:** All LP subscription agreements — drafts, sent envelopes, and executed documents. Centralized here in addition to each LP's individual folder (filed in both for redundancy).

**Subfolders:**
```
/03 - Subscription Documents
  /Templates
    /Subscription Agreement Template (current version)
    /Subscription Agreement Template (prior versions)
  /In Progress
    /[LP-ID] - [Name] - Sent [Date]
  /Executed
    /LP-001 - [Name] - Executed [Date]
    /LP-002 - [Name] - Executed [Date]
    ... (one file per LP)
  /Voided
    /[LP-ID] - [Name] - Voided [Date]
```

**File Naming:**
```
SUB-[LP-ID]-[STATUS]-[DATE].[ext]
Examples:
  SUB-LP001-Subscription-Agreement-Signed-2026-03-20.pdf
  SUB-LP003-Subscription-Agreement-Draft-v2-2026-04-01.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Agent 16 / n8n: Write to In Progress; read Executed
- Investor: Read-only to their own executed document only (linked from their LP folder)

**Security Level:** Confidential

**Responsible Agents:** Agent 16 (drafts subscription; routes to DocuSign), Agent 14 (compliance review of subscription template before use with any new LP)

**Human Approval Required:** Kerry countersignature required on every subscription agreement via DocuSign

**Compliance / Legal Review Required:** Subscription agreement template requires legal counsel and Agent 14 review before first use and after any material amendment.

---

## Folder 04: Seller Documents

**Purpose:** All documents related to tape sellers — NDAs, purchase and sale agreements (PSAs), executed LOIs, and seller-level correspondence. One subfolder per seller.

**Subfolders:**
```
/04 - Seller Documents
  /SEL-001 - [Seller Company Name]
    /NDA
    /LOIs
    /Purchase and Sale Agreements
    /Correspondence
  /SEL-002 - [Seller Company Name]
    ... (same structure)
  /Templates
    /NDA Template (current)
    /LOI Template (current)
    /PSA Template (current)
```

**File Naming:**
```
SELL-[SEL-ID]-[DOCUMENT TYPE]-[TAPE-ID or DATE].[ext]
Examples:
  SELL-SEL001-NDA-Executed-2026-02-10.pdf
  SELL-SEL001-LOI-TAPE-2026-003-Sent-2026-04-20.pdf
  SELL-SEL001-PSA-TAPE-2026-003-Executed-2026-05-05.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add; no delete
- Agent 02 / n8n: Write (LOI drafts filed here automatically)
- Sellers: No direct access — documents shared via DocuSign only

**Security Level:** Confidential (LOIs, PSAs) / Internal (NDA, correspondence)

**Responsible Agents:** Agent 02 (files LOI drafts, correspondence summaries), Agent 05 (PSA reference during diligence)

**Human Approval Required:** Kerry must approve LOI before Agent 02 routes to DocuSign for execution. PSA requires Kerry signature.

**Compliance / Legal Review Required:** PSA templates — legal counsel review. Agent 14 reviews LOI template for any representations or warranties language quarterly.

---

## Folder 05: Loan Tapes

**Purpose:** Raw tape files received from sellers — Excel, CSV, and PDF formats. One folder per tape, organized by year and quarter. These are the input files Agent 18 normalizes.

**Subfolders:**
```
/05 - Loan Tapes
  /2026
    /Q1-2026
      /TAPE-2026-001 - [Seller Name] - [Date]
        /Raw Files (original files exactly as received)
        /Normalized (Agent 18 output)
        /Correspondence
    /Q2-2026
      /TAPE-2026-002 - [Seller Name] - [Date]
        /Raw Files
        /Normalized
        /Correspondence
    ... (continue per tape)
  /2027
    ... (same structure)
```

**File Naming:**
```
TAPE-[TAPE-ID]-[TYPE]-[DATE].[ext]
Raw:        TAPE-2026-003-Raw-Pool-Tape-2026-04-15.xlsx
Normalized: TAPE-2026-003-Normalized-2026-04-16.csv
Screening:  TAPE-2026-003-Agent02-Screening-Report-2026-04-17.pdf
Pricing:    TAPE-2026-003-Agent04-Pricing-Model-2026-04-18.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add raw files; read normalized
- Agent 18 / n8n: Write to Raw Files (inbound), write Normalized output
- Agent 02, 03, 04 / n8n: Read access per workflow

**Security Level:** Confidential (loan-level borrower data in tapes)

**Responsible Agents:** Agent 18 (primary — normalization and data quality), Agent 02 (screening), Agent 03 (UW reads normalized file), Agent 04 (pricing reads normalized file)

**Human Approval Required:** None at tape receipt. Agent 18 handles normalization autonomously. Go/no-bid recommendation requires Kerry approval before LOI is sent.

**Compliance / Legal Review Required:** Tapes containing borrower PII — Agent 18 flags any PII fields (SSN, full DOB) found in raw tape files. PII fields are masked in the normalized output stored in Supabase.

---

## Folder 06: Collateral Files

**Purpose:** Loan-level collateral document packages — original notes, allonges, mortgage/deed of trust, assignments, and chain of title documents. One folder per loan. This is the core legal file for every note the fund owns or is evaluating.

**Subfolders:**
```
/06 - Collateral Files
  /Active Pipeline (Pre-Close)
    /[TAPE-ID]
      /[LOAN-ID] - [Property Address]
        /Original Note
        /Allonges
        /Mortgage or Deed of Trust
        /Assignments
        /Chain of Title
        /Miscellaneous
  /Active Portfolio (Boarded)
    /[LOAN-ID] - [Property Address]
      /Original Note
      /Allonges
      /Mortgage or Deed of Trust
      /Assignments
      /Chain of Title
      /Endorsements
      /Miscellaneous
  /Resolved
    /[LOAN-ID] - [Property Address] - [Resolution Type] - [Date]
      (same structure — archived)
```

**File Naming:**
```
COLL-[LOAN-ID]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  COLL-LOAN-2026-00042-Original-Note-2026-05-01.pdf
  COLL-LOAN-2026-00042-Assignment-1-of-3-2026-05-01.pdf
  COLL-LOAN-2026-00042-Mortgage-2018-06-15.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add
- Agent 05 / n8n: Read (diligence review)
- Agent 09 / n8n: Read (boarding QA)
- Agent 07 / n8n: Read (NPL strategy — chain of title for legal proceedings)
- Title companies / attorneys: No Drive access — documents shared via DocuSign or secure email only

**Security Level:** Confidential

**Responsible Agents:** Agent 05 (reviews all collateral documents during diligence; logs inventory to Supabase `collateral_documents` table), Agent 09 (boarding QA — confirms all required documents received), Agent 18 (logs file metadata to Supabase when new files are uploaded)

**Human Approval Required:** Wire authorization (closing) requires Kerry + Controller dual approval before any wire is sent, regardless of collateral file completeness

**Compliance / Legal Review Required:** Chain of title gaps, note endorsement defects — Agent 05 flags; legal counsel reviews any Critical title/assignment exception before closing proceeds.

---

## Folder 07: Title Reports

**Purpose:** Title search reports, title commitments, and final title insurance policies per loan. Critical for confirming lien position, ownership, and existing encumbrances. Agent 05 reviews; title policy is the closing deliverable.

**Subfolders:**
```
/07 - Title Reports
  /Pre-Close (Pipeline)
    /[TAPE-ID]
      /[LOAN-ID] - [Property Address]
        /Title Search
        /Title Commitment
        /Lien Search
        /HOA Search
  /Post-Close (Portfolio)
    /[LOAN-ID] - [Property Address]
      /Title Commitment
      /Title Policy (Final)
      /Endorsements
      /Lien Search
  /Templates
    /Title Review Checklist
```

**File Naming:**
```
TITLE-[LOAN-ID]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  TITLE-LOAN-2026-00042-Title-Search-2026-04-28.pdf
  TITLE-LOAN-2026-00042-Title-Commitment-2026-05-02.pdf
  TITLE-LOAN-2026-00042-Title-Policy-Final-2026-05-10.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add
- Agent 05 / n8n: Read
- Agent 07 / n8n: Read (for foreclosure — confirm title chain for FC filing)

**Security Level:** Confidential

**Responsible Agents:** Agent 05 (primary reviewer — flags title exceptions, lien priority issues, HOA delinquencies), Agent 07 (reads title chain for NPL legal strategy)

**Human Approval Required:** Any Critical title exception (lien priority dispute, undisclosed encumbrance) blocks closing until Kerry approves waiver or seller resolves

**Compliance / Legal Review Required:** Title defects flagged as Critical require legal counsel sign-off before closing proceeds. Agent 14 reviews title insurance adequacy standards annually.

---

## Folder 08: BPOs and Valuations

**Purpose:** All property valuations — BPOs (Broker Price Opinions), appraisals, AVM reports, and tax assessments. One folder per loan. Agent 03 and Agent 04 use these as primary inputs for underwriting and pricing. Agent 13 uses for portfolio-level stress testing.

**Subfolders:**
```
/08 - BPOs and Valuations
  /[LOAN-ID] - [Property Address]
    /BPOs
      /[LOAN-ID]-BPO-[Date]-[Provider].pdf
    /Appraisals
      /[LOAN-ID]-Appraisal-[Date]-[Appraiser].pdf
    /AVM Reports
      /[LOAN-ID]-AVM-PropStream-[Date].pdf
      /[LOAN-ID]-AVM-HouseCanary-[Date].pdf (Phase 6)
    /Tax Assessments
      /[LOAN-ID]-Tax-Assessment-[Year].pdf
```

**File Naming:**
```
VAL-[LOAN-ID]-[TYPE]-[PROVIDER]-[DATE].[ext]
Examples:
  VAL-LOAN-2026-00042-BPO-ABC-Realty-2026-04-25.pdf
  VAL-LOAN-2026-00042-AVM-PropStream-2026-04-16.pdf
  VAL-LOAN-2026-00042-Appraisal-John-Smith-MAI-2026-05-05.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add
- Agent 03, 04, 05, 07, 13 / n8n: Read per workflow

**Security Level:** Internal

**Responsible Agents:** Agent 03 (reads AVM for LTV calculation in UW review), Agent 04 (reads AVM/BPO for IRR pricing model), Agent 05 (uses BPO/tax data during diligence), Agent 07 (uses valuation for exit strategy in NPL), Agent 13 (reads portfolio valuations for stress test inputs), Agent 18 (writes PropStream AVM files during tape normalization)

**Human Approval Required:** Any valuation used in an IC memo for CEO/CIO pricing approval requires Kerry review of the valuation source and date

**Compliance / Legal Review Required:** None at the individual valuation level. Agent 14 reviews valuation methodology standards annually (AVM vs. BPO vs. appraisal thresholds per loan size and type).

---

## Folder 09: Servicer Reports

**Purpose:** Monthly remittance reports, boarding confirmations, and servicer communications from all loan servicers. Agent 06 processes these monthly. The remittance report is the source document for all cashflow entries.

**Subfolders:**
```
/09 - Servicer Reports
  /[SERVICER CODE] - [Servicer Name]
    /Remittance Reports
      /2026
        /2026-01 - [Servicer]-Remittance-2026-01.xlsx
        /2026-02 - [Servicer]-Remittance-2026-02.xlsx
        ... (one file per month)
    /Boarding Confirmations
      /[LOAN-ID]-Boarding-Confirmation-[Date].pdf
    /Servicer Correspondence
      /[Date]-[Subject-Short].pdf
    /Boarding Packages (Outbound)
      /[LOAN-ID]-Boarding-Package-Sent-[Date].pdf
```

**File Naming:**
```
SVC-[SERVICER CODE]-[DOCUMENT TYPE]-[YYYY-MM].[ext]
Examples:
  SVC-FCINV-Remittance-2026-05.xlsx
  SVC-FCINV-LOAN-2026-00042-Boarding-Confirmation-2026-05-12.pdf
  SVC-FCINV-Correspondence-2026-05-08-Data-Correction-Request.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add
- Agent 06 / n8n: Read (monthly processing trigger)
- Agent 08 / n8n: Read (servicer performance review)
- Servicers: No Drive access — they email/portal-submit reports; team uploads to Drive

**Security Level:** Confidential (contains loan-level borrower payment data)

**Responsible Agents:** Agent 06 (primary — processes remittance reports monthly; writes cashflow actuals to Supabase), Agent 08 (reads for servicer performance scoring), Agent 09 (reads boarding confirmations for QA check)

**Human Approval Required:** None for routine remittance processing. Servicer report anomalies (large variance, missing report) surface to Kerry via Airtable

**Compliance / Legal Review Required:** None at individual report level. Agent 15 confirms remittance report receipt and processing completeness in quarterly control test.

---

## Folder 10: Legal Files

**Purpose:** General legal matters — entity legal correspondence, regulatory inquiries, general counsel communications, and miscellaneous legal documents that do not belong in Foreclosure/Bankruptcy or Vendor Agreements.

**Subfolders:**
```
/10 - Legal Files
  /Entity Legal
    /Formation Legal Correspondence
    /Regulatory Correspondence
  /Fund Legal
    /SEC / Regulatory
    /Investor Disputes (if any)
    /General Counsel Correspondence
  /Loan-Level Legal (Non-FC/BK)
    /[LOAN-ID] - [Property Address]
      /Quiet Title
      /Deed-in-Lieu
      /Short Sale Agreements
      /Other Legal Matters
  /Templates
    /Demand Letter Template
    /Legal Hold Notice Template
```

**File Naming:**
```
LGL-[IDENTIFIER]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  LGL-FUND-SEC-Inquiry-Response-2026-06-01.pdf
  LGL-LOAN-2026-00042-DIL-Agreement-Executed-2026-08-15.pdf
  LGL-FUND-General-Counsel-Engagement-Letter-2026-02-01.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Controller (future): Read — regulatory, fund legal
- Legal counsel: Documents shared via DocuSign or secure email only; no Drive access
- No access: Kody, TJ (unless Kerry explicitly grants for a specific matter)

**Security Level:** Restricted (regulatory correspondence, investor disputes) / Confidential (general legal)

**Responsible Agents:** Agent 07 (deed-in-lieu and short sale agreements via DocuSign), Agent 14 (regulatory correspondence review), Agent 15 (legal matter logging to audit trail)

**Human Approval Required:** All executed legal documents require Kerry signature. Responses to regulatory inquiries require Kerry review + legal counsel sign-off before submission.

**Compliance / Legal Review Required:** All regulatory correspondence. Any document making representations on behalf of the fund. Short sale and DIL agreements — legal counsel review before execution.

---

## Folder 11: Foreclosure and Bankruptcy

**Purpose:** Active and resolved foreclosure cases and bankruptcy proceedings — by loan. Contains all court filings, attorney correspondence, legal milestones, and outcome documents. Agent 07 tracks; FC attorneys submit documents.

**Subfolders:**
```
/11 - Foreclosure and Bankruptcy
  /Active Foreclosures
    /[LOAN-ID] - [Property Address] - FC
      /FC Filing Documents
      /Court Orders
      /Attorney Correspondence
      /Property Inspection Reports
      /FC Sale Documents
      /REO Documents (post-FC sale if property acquired)
  /Active Bankruptcies
    /[LOAN-ID] - [Property Address] - BK[Chapter]
      /BK Filing Documents
      /Proof of Claim
      /Relief from Stay Motion
      /Plan Documents
      /Court Orders
      /Attorney Correspondence
  /Resolved
    /FC-Resolved
      /[LOAN-ID] - [Property Address] - [Outcome] - [Date]
    /BK-Resolved
      /[LOAN-ID] - [Property Address] - [Outcome] - [Date]
```

**File Naming:**
```
FC-[LOAN-ID]-[DOCUMENT TYPE]-[DATE].[ext]
BK-[LOAN-ID]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  FC-LOAN-2026-00042-Complaint-Filed-2026-07-01.pdf
  FC-LOAN-2026-00042-Judgment-2026-11-15.pdf
  BK-LOAN-2026-00042-Proof-of-Claim-2026-06-01.pdf
  BK-LOAN-2026-00042-Relief-from-Stay-Granted-2026-07-20.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add (operational updates only)
- Agent 07 / n8n: Read (strategy and milestone tracking)
- FC attorneys: No Drive access — documents exchanged via email and filed here by team

**Security Level:** Confidential

**Responsible Agents:** Agent 07 (primary — creates and tracks workout records in Supabase; reads legal filings from Drive), Agent 15 (reads legal matters log in quarterly audit), Agent 01 (reads upcoming legal deadlines for daily briefing)

**Human Approval Required:** FC filing authorization requires CEO/CIO approval in Approval Queue before attorney is instructed to file. Any settlement offer or DIL authorization requires CEO/CIO approval.

**Compliance / Legal Review Required:** All FC and BK strategy decisions are reviewed by FC attorney (external counsel). Agent 14 reviews compliance with state-specific FC timelines and requirements annually.

---

## Folder 12: Fund Admin Reports

**Purpose:** Monthly financial statements, NAV confirmations, capital account statements, and fund-level financial reports. Agent 10 produces these; Controller reviews. The financial record of the fund.

**Subfolders:**
```
/12 - Fund Admin Reports
  /Financial Statements
    /2026
      /2026-01-Financial-Statements.pdf
      /2026-02-Financial-Statements.pdf
      ... (one per month)
  /NAV Reports
    /2026
      /2026-01-NAV-Confirmation.pdf
      ... (one per month)
  /Capital Account Statements
    /2026
      /2026-Q1-Capital-Account-Statements.pdf
      ... (one per quarter — combined all LPs)
  /Facility Reports
    /2026
      /2026-05-Facility-Covenant-Report.pdf
  /Management Reports
    /2026
      /2026-Q1-Management-Report.pdf
```

**File Naming:**
```
ADMIN-[REPORT TYPE]-[YYYY-MM or YYYY-QN].[ext]
Examples:
  ADMIN-Financial-Statements-2026-05.pdf
  ADMIN-NAV-Confirmation-2026-05.pdf
  ADMIN-Capital-Account-Statements-2026-Q1.pdf
  ADMIN-Facility-Covenant-Report-2026-05.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Controller (future): Read + add
- Agent 10, 11, 12 / n8n: Write (reports filed automatically after approval)
- Auditor: Read-only during annual audit engagement
- Investors: No access — they receive their individual statements via Investor Reporting folder

**Security Level:** Confidential

**Responsible Agents:** Agent 10 (financial statements, NAV, capital accounts), Agent 11 (distribution reconciliation reports), Agent 12 (facility covenant reports)

**Human Approval Required:** Monthly NAV confirmation requires Kerry (CEO/CIO) sign-off in Approval Queue before capital account statements are finalized. Agent 10 session output is the draft; Kerry approval makes it official.

**Compliance / Legal Review Required:** Annual financial statements — external audit (when required). Agent 14 reviews financial statement format for LP disclosure adequacy quarterly.

---

## Folder 13: Tax Documents

**Purpose:** All tax-related documents — K-1s, fund-level tax returns, 1099s, and tax work product. Agent 10 tracks delivery; CPA/tax counsel prepares. One of the highest-sensitivity folders.

**Subfolders:**
```
/13 - Tax Documents
  /K-1s
    /FY2026
      /LP-001 - [Name] - K1-FY2026.pdf
      /LP-002 - [Name] - K1-FY2026.pdf
      ... (one per LP)
    /FY2027
      ... (same structure)
  /Fund Tax Returns
    /FY2026-Partnership-Return-1065.pdf
    /FY2026-State-Returns
      /[State]-FY2026-State-Return.pdf
  /1099s
    /FY2026
      /1099-[Vendor or Payee]-FY2026.pdf
  /Tax Work Product
    /CPA-Correspondence
    /Cost Basis Schedules
  /State Tax Filings
    /[State]-[Year]-Filing.pdf
```

**File Naming:**
```
TAX-[TYPE]-[ENTITY OR LP-ID]-[YEAR].[ext]
Examples:
  TAX-K1-LP001-FY2026.pdf
  TAX-1065-PNF-FY2026.pdf
  TAX-1099-SEL001-FY2026.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Controller (future): Read + add
- CPA / Tax counsel: Documents shared via DocuSign or secure portal only; no Drive access
- Investors: Each LP's K-1 shared individually via DocuSign or Drive share to their investor folder; no LP sees another LP's K-1
- Agent 10 / n8n: Read (for tax tracking in Supabase); no write to this folder — tax documents filed by CPA or Kerry directly

**Security Level:** Restricted (K-1s contain investor SSNs and income data) / Confidential (fund returns, 1099s)

**Responsible Agents:** Agent 10 (tracks K-1 delivery status in Supabase; reads for NAV and accounting), Agent 17 (references K-1 delivery in investor communication cycle), Agent 15 (confirms K-1 delivery completeness in quarterly control test)

**Human Approval Required:** K-1s — Kerry must approve distribution to investors (confirmed via Approval Queue). Fund tax return — Kerry signature required before filing.

**Compliance / Legal Review Required:** All tax returns — CPA review and sign-off. K-1 accuracy confirmed by CPA before delivery. Agent 14 reviews K-1 delivery process and timeline compliance annually.

---

## Folder 14: Audit Documents

**Purpose:** Annual audit work product — PBC (Prepared by Client) documents, auditor requests, financial statement drafts, and final audited statements. Separate from tax documents. Auditor access is granted here specifically and deprovisioned after engagement closes.

**Subfolders:**
```
/14 - Audit Documents
  /FY2026 Audit
    /Engagement Letter
    /PBC Requests and Responses
    /Draft Financial Statements
    /Final Audited Statements
    /Management Representation Letter
    /Auditor Correspondence
  /FY2027 Audit
    ... (same structure)
  /Prior Years (Archive)
```

**File Naming:**
```
AUDIT-[YEAR]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  AUDIT-FY2026-Engagement-Letter-2026-10-01.pdf
  AUDIT-FY2026-PBC-Request-01-2026-11-01.pdf
  AUDIT-FY2026-Draft-Financial-Statements-v1-2026-12-01.pdf
  AUDIT-FY2026-Final-Audited-Statements-2027-02-15.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Controller (future): Read + add
- External auditor: Content Manager access to their year's subfolder ONLY; deprovisioned within 5 business days of audit close
- No access: Kody, TJ, investors, agents (agents do not need to access this folder)

**Security Level:** Confidential

**Responsible Agents:** Agent 15 (confirms audit log completeness and audit trail integrity for auditor; logs audit-related actions in Supabase `audit_log`)

**Human Approval Required:** Management Representation Letter — Kerry signature required. Final audited statements — Kerry reviews before delivery to any LP.

**Compliance / Legal Review Required:** All draft financial statements — external auditor review. Management Representation Letter — legal counsel review of any representations made.

---

## Folder 15: Compliance Reviews

**Purpose:** Agent 14 compliance review records — all materials reviewed, clearance determinations, and supporting documentation. The compliance file for every investor-facing and regulatory document the fund produces.

**Subfolders:**
```
/15 - Compliance Reviews
  /Cleared Materials
    /2026
      /[COMP-ID]-[Material Name]-Cleared-[Date].pdf
  /Not Cleared
    /2026
      /[COMP-ID]-[Material Name]-Not-Cleared-[Date].pdf
  /Under Review
    /[COMP-ID]-[Material Name]-Under-Review-[Date].pdf
  /Review Checklists and Templates
    /Compliance Review Checklist (current)
    /Material Submission Template
  /Annual Compliance Reports
    /2026-Annual-Compliance-Report.pdf
```

**File Naming:**
```
COMP-[COMP-ID]-[MATERIAL TYPE]-[STATUS]-[DATE].[ext]
Examples:
  COMP-COMP0001-Q1-2026-Investor-Report-Cleared-2026-07-10.pdf
  COMP-COMP0002-PPM-Amendment-Not-Cleared-2026-05-15.pdf
  COMP-COMP0003-Fund-Pitch-Deck-Cleared-Conditions-2026-04-20.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody: No access
- Agent 14 / n8n: Read + write (primary user — creates review records, files clearance documents)
- Agent 15 / n8n: Read (quarterly audit of compliance review completeness)

**Security Level:** Internal

**Responsible Agents:** Agent 14 (primary — files review output here; writes review metadata to Supabase `compliance_reviews`), Agent 15 (reads for quarterly governance audit)

**Human Approval Required:** Cleared with Conditions materials require Kerry sign-off in Approval Queue before distribution proceeds

**Compliance / Legal Review Required:** Annual compliance report — Agent 14 drafts; Kerry reviews and approves. Agent 15 confirms all required materials were reviewed in quarterly control test.

---

## Folder 16: Investor Reporting

**Purpose:** All investor-facing reports — quarterly reports, annual reports, and special communications. Separate from individual investor folders (those are in Folder 02). This is the master archive of all reporting deliverables.

**Subfolders:**
```
/16 - Investor Reporting
  /Quarterly Reports
    /2026-Q1
      /[RPT-ID]-Q1-2026-Investor-Report-Draft.pdf
      /[RPT-ID]-Q1-2026-Investor-Report-Final.pdf
      /[RPT-ID]-Q1-2026-Compliance-Clearance.pdf
    /2026-Q2
      ... (same structure)
  /Annual Reports
    /2026-Annual-Report-Draft.pdf
    /2026-Annual-Report-Final.pdf
  /Special Communications
    /[DATE]-[TOPIC]-Draft.pdf
    /[DATE]-[TOPIC]-Final.pdf
  /Report Templates
    /Quarterly-Report-Template-Current.docx
    /Annual-Report-Template-Current.docx
```

**File Naming:**
```
RPT-[PERIOD]-[TYPE]-[STATUS]-[DATE].[ext]
Examples:
  RPT-2026-Q1-Investor-Report-Draft-2026-07-01.pdf
  RPT-2026-Q1-Investor-Report-Final-2026-07-15.pdf
  RPT-2026-Annual-Report-Final-2027-02-28.pdf
  RPT-2026-05-Special-Communication-Capital-Call-Final-2026-05-10.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody: No access
- Agent 17 / n8n: Write (files draft and final reports)
- Agent 14 / n8n: Read (compliance review of drafts)
- Investors: No access to this folder — they receive their copy via DocuSign or shared link to their LP folder

**Security Level:** Confidential (drafts) / Internal (final, after distribution)

**Responsible Agents:** Agent 17 (primary — generates reports, files drafts and finals), Agent 14 (compliance clearance), Agent 18 (logs report metadata to Supabase `investor_reports`)

**Human Approval Required:** Every investor report (draft → compliance review → CEO/CIO approval → distribution). No report distributed without documented Kerry approval in Approval Queue.

**Compliance / Legal Review Required:** All quarterly and annual reports require Agent 14 compliance review for accuracy of representations, risk disclosures, and performance metrics. Special communications — Agent 14 review + Kerry approval.

---

## Folder 17: Data Room

**Purpose:** The investor data room — curated documents provided to prospective and active LPs for due diligence. Organized by audience: prospects see a limited set; active LPs see their full data room. Access is LP-specific, managed by Agent 18 via Google Drive sharing API.

**Subfolders:**
```
/17 - Data Room
  /Prospect Data Room (Pre-Subscription)
    /Fund Overview
      /Fund-Overview-Deck-[Date].pdf
      /Investment-Strategy-Summary-[Date].pdf
    /PPM and Offering Documents
      /PPM-[Date].pdf
      /Subscription-Agreement-Template.pdf
    /Team and Track Record
      /Team-Bios-[Date].pdf
    /References and Third Parties
      /Auditor-Engagement-Letter.pdf
      /Legal-Counsel-Engagement.pdf
  /Active LP Data Room
    /Quarterly Reports
      /[RPT-ID]-Q1-2026-Investor-Report-Final.pdf
      ... (all distributed reports)
    /Financial Statements
      /[ADMIN-ID]-Financial-Statements-[Date].pdf
    /NAV History
      /NAV-History-[Date].pdf
    /Portfolio Summary (No Borrower PII)
      /Portfolio-Summary-[YYYY-QN].pdf
    /Legal and Compliance
      /LPA-[Date].pdf
      /Management-Agreement-[Date].pdf
    /Tax Documents
      (linked to individual LP folder — LPs do not share this subfolder)
  /Internal (Not for LP Distribution)
    /Borrower-Level Data (RESTRICTED — never in LP data room)
    /Full Loan Tape Files
    /Internal Financial Models
```

**File Naming:**
```
DR-[AUDIENCE]-[DOCUMENT TYPE]-[DATE].[ext]
Examples:
  DR-Prospect-Fund-Overview-2026-05-01.pdf
  DR-LP-Q1-2026-Investor-Report-Final.pdf
  DR-LP-NAV-History-2026-05-01.pdf
  DR-LP-Portfolio-Summary-2026-Q1.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Agent 18 / n8n: Manages sharing — grants/revokes prospect and LP access via Drive API
- Prospects: Read-only to Prospect Data Room folder only; time-limited share link (30 days)
- Active LPs: Read-only to Active LP Data Room; cannot download (Box watermarking at institutional stage)
- No "Anyone with link" sharing on any data room document

**Security Level:** Internal (prospect data room — post-compliance clearance) / Confidential (LP data room)

**Responsible Agents:** Agent 17 (adds new quarterly reports, NAV updates, portfolio summaries to active LP data room), Agent 18 (manages access permissions; logs access events to Supabase `data_room_access_log`), Agent 14 (compliance clearance on every document before it enters the data room), Agent 15 (audits data room access in quarterly control test — confirms sharing matches authorized investor list)

**Human Approval Required:** Every document entering the data room requires Kerry review. No document goes into the LP data room without documented CEO/CIO approval in Approval Queue.

**Compliance / Legal Review Required:** All documents in the Prospect Data Room — Agent 14 compliance review required before any prospective LP receives access. PPM and offering documents — legal counsel review at creation and after any amendment.

---

## Folder 18: Vendor Agreements

**Purpose:** All executed vendor contracts — servicer MSAs, attorney retainer letters, title company agreements, BPO providers, and any other third-party service providers. Agent 08 tracks; n8n files executed documents from DocuSign.

**Subfolders:**
```
/18 - Vendor Agreements
  /Servicers
    /[VND-ID] - [Servicer Name]
      /MSA (Master Servicing Agreement)
      /Amendments
      /Correspondence
  /Foreclosure Attorneys
    /[VND-ID] - [Attorney / Firm Name]
      /Engagement Letter or Retainer
      /Amendments
      /State Authorizations
  /Title Companies
    /[VND-ID] - [Title Company Name]
      /Service Agreement
      /Amendments
  /BPO Providers
    /[VND-ID] - [Provider Name]
      /Service Agreement
  /Inspectors
    /[VND-ID] - [Inspector Name]
      /Service Agreement
  /Other Vendors
    /[VND-ID] - [Vendor Name]
      /Agreement
  /Templates
    /Servicer-MSA-Template-Current.docx
    /Attorney-Engagement-Template.docx
    /Vendor-Agreement-Template.docx
```

**File Naming:**
```
VND-[VND-ID]-[VENDOR NAME]-[DOCUMENT TYPE]-[STATUS]-[DATE].[ext]
Examples:
  VND-VND001-FirstChoice-MSA-Executed-2026-03-01.pdf
  VND-VND002-Smith-Law-FC-Engagement-Letter-Executed-2026-04-15.pdf
  VND-VND001-FirstChoice-MSA-Amendment-1-Executed-2026-08-01.pdf
```

**Access Permissions:**
- Owner: Kerry (full)
- Kody (Content Manager): Read + add correspondence only
- Agent 08 / n8n: Read (vendor scorecard, issue tracking)
- Vendors: No Drive access — agreements shared and executed via DocuSign only

**Security Level:** Confidential

**Responsible Agents:** Agent 08 (reads vendor agreements for SLA terms and contract review dates; logs metadata to Supabase), Agent 18 (files executed DocuSign documents to correct vendor subfolder via n8n workflow)

**Human Approval Required:** All new vendor agreements require Kerry approval before DocuSign is initiated. Contract renewals require Kerry review and re-approval.

**Compliance / Legal Review Required:** Servicer MSAs and attorney retainer agreements — legal counsel review before execution. Agent 14 reviews all vendor agreement templates annually for compliance with fund policies.

---

## DocuSign Workflows

DocuSign is the execution engine for all legally binding documents. n8n orchestrates the envelope — Kerry never manually creates DocuSign envelopes; every envelope is triggered by a workflow event and routed via n8n.

---

### DocuSign Workflow 1: NDAs

**Trigger:** Kerry or Agent 02 initiates NDA with a new prospect seller or investor

**Template:** `NDA - Standard Black / Pinnacle Note Fund - [Counterparty Type]`

**Signers and Order:**
1. Counterparty signs first (name, email pulled from Seller CRM or Investor CRM in Supabase)
2. Kerry countersigns (Kerry Kelley Jr — CEO/CIO)

**Pre-fill Fields (n8n populates from Supabase):**
- Counterparty legal name
- Counterparty address
- Date
- Effective date
- Fund entity name

**Envelope Settings:**
- Expiration: 14 days
- Reminder: Day 3, Day 7 after sending

**Completion Webhook (DocuSign → n8n → Google Drive):**
- Completed envelope → n8n downloads PDF
- Files to: `/04 - Seller Documents/[SEL-ID] - [Seller Name]/NDA/` (sellers) or `/02 - Investor Documents/[LP-ID]/` (investors)
- File name: `SELL-[SEL-ID]-NDA-Executed-[Date].pdf` or `INV-[LP-ID]-NDA-Executed-[Date].pdf`
- n8n updates Supabase: `sellers.nda_executed = true` or `investors.nda_executed = true` (date logged)

**Approval Required:** No additional approval — Kerry countersignature IS the approval

**Notes:** NDA must be fully executed before any tape file, borrower data, or fund-level financial information is shared with a counterparty.

---

### DocuSign Workflow 2: Subscription Documents

**Trigger:** Agent 16 session output — investor onboarding stage reaches "Docs Ready" in Investor CRM → n8n triggers subscription envelope

**Prerequisite:** Agent 14 compliance review of subscription agreement template must be current (within last 90 days). If not, n8n holds and creates compliance review task before proceeding.

**Template:** `LP Subscription Agreement - Pinnacle Note Fund`

**Signers and Order:**
1. Investor signs all required pages (signature, initials, accreditation certification)
2. Kerry countersigns (Kerry Kelley Jr — CEO/CIO, General Partner)

**Pre-fill Fields (n8n populates from Supabase `investors` table):**
- Investor legal name
- Entity name (if applicable)
- Address
- Committed investment amount
- Payment schedule (lump sum or installment)
- Investor type
- Date

**Envelope Settings:**
- Expiration: 30 days (longer than NDA — investors need time to review)
- Reminder: Day 7, Day 14, Day 25
- Enable "Wet Ink" language note if required by state

**Completion Webhook (DocuSign → n8n → Google Drive → Supabase):**
- Completed envelope → n8n downloads PDF
- Files to: `/03 - Subscription Documents/Executed/[LP-ID]-[Name]/`
- Also copied to: `/02 - Investor Documents/[LP-ID]/Subscription Agreement/`
- File name: `SUB-[LP-ID]-Subscription-Agreement-Signed-[Date].pdf`
- n8n updates Supabase: `investors.subscription_signed = true`, `investors.onboarding_status = Active`, `investors.pipeline_stage = Funded` (after capital confirmed)
- n8n creates `approvals` record confirming subscription completion for Kerry log
- n8n updates Airtable Investor CRM record

**Approval Required:** Kerry countersignature in DocuSign is the formal approval. No separate Approval Queue item — the countersignature is the record.

**Notes:** Capital calls and wire instructions are NOT in the DocuSign envelope. Wire instructions are communicated separately via 1Password secure share (lean stage) or Box secure link (institutional stage) after subscription is executed.

---

### DocuSign Workflow 3: Investor Acknowledgments

**Used for:**
- Quarterly and annual distribution notices
- Material change notices (fee amendment, strategy change, GP change)
- Annual investor certification (accreditation re-verification)
- Capital call notices (when applicable)

**Template (variable):** One template per acknowledgment type — Agent 17 selects the correct template via n8n based on the document type field in `investor_reports` or `distributions` table.

**Signers:**
- Annual certification: Investor signs only (acknowledging accredited status)
- Distribution notices requiring signature: Kerry signs first (authorizing); investor acknowledges
- Material change: Investor signs (acknowledging receipt); Kerry has already approved via Approval Queue

**Pre-fill Fields (n8n populates):**
- Investor name
- Distribution amount (if distribution notice)
- Period
- Fund performance summary data (pulled from Supabase NAV and distribution tables)

**Envelope Settings:**
- Expiration: 30 days for certifications; 14 days for distribution notices
- Reminder: Day 7, Day 21 (certifications); Day 5, Day 10 (distribution notices)

**Completion Webhook (DocuSign → n8n → Google Drive → Supabase):**
- Completed → filed in `/02 - Investor Documents/[LP-ID]/[Document Type]/`
- File name: `INV-[LP-ID]-[Document Type]-Signed-[Date].pdf`
- n8n updates Supabase: `distributions.distribution_notice_sent = true` (for distribution notices)
- n8n updates Airtable Distribution Tracker: Notice Sent = checked

**Approval Required:** Kerry approval in Approval Queue BEFORE n8n initiates any investor acknowledgment envelope. The approval record is the authorization for the batch send.

**Notes:** Annual certification envelopes are sent as a batch (n8n loops through all active investors in Supabase `investors` table, creates one envelope per investor). Batch is triggered once per year, Q1.

---

### DocuSign Workflow 4: Vendor Agreements

**Used for:**
- New servicer MSA execution
- Attorney engagement letters
- Title company agreements
- BPO provider agreements
- Any third-party service agreement

**Trigger:** Kerry approves new vendor engagement in Approval Queue → n8n triggers vendor agreement envelope

**Template:** Selected by vendor type (Servicer MSA, Attorney Engagement, General Vendor Agreement) — Agent 08 or Kerry designates template during vendor onboarding in Airtable Vendor Registry.

**Signers and Order:**
1. Vendor authorized representative signs first
2. Kerry countersigns (Kerry Kelley Jr — CEO/CIO, Standard Black / Pinnacle Note Fund)

**Pre-fill Fields (n8n populates from Supabase `vendors` table):**
- Vendor legal entity name
- Vendor address
- Primary contact name and title
- Agreement effective date
- Key terms (fees, SLA standards, state authorizations — for servicer MSA)
- Governing state

**Envelope Settings:**
- Expiration: 14 days
- Reminder: Day 5, Day 10

**Completion Webhook (DocuSign → n8n → Google Drive → Supabase):**
- Completed → n8n downloads PDF
- Files to: `/18 - Vendor Agreements/[Vendor Type]/[VND-ID] - [Vendor Name]/`
- File name: `VND-[VND-ID]-[Vendor Name]-[Agreement Type]-Executed-[Date].pdf`
- n8n updates Supabase: `vendors.status = Active`, `vendors.contract_start = [Date]`
- n8n updates Airtable Vendor Registry record

**Approval Required:** CEO/CIO Approval Queue item must be Approved before envelope is sent. This is the authorization gate — the DocuSign envelope is the execution step.

**Notes:** Amendments to existing agreements use the same workflow with a separate template tagged "Amendment." Amendment requires a new Approval Queue authorization even if the original agreement is still active.

---

### DocuSign Workflow 5: Internal Approvals and Closing Documents

**Used for:**
- Closing packages (loan purchase — wire authorization and acknowledgment)
- Deed-in-Lieu agreements
- Short Sale approval documents
- LP distribution declarations (Kerry formal declaration of distribution)
- Facility draw requests requiring signature

**Trigger:** Varies by document type — all triggered after a corresponding Approval Queue record is marked Approved by Kerry.

**Closing Package Workflow:**
1. Agent 05 confirms closing readiness (all exceptions resolved or waived, collateral package complete)
2. n8n creates Approval Queue record: LOI Acceptance → Closing Authorization
3. Kerry approves in Approval Queue
4. n8n triggers closing envelope:
   - Signer 1: Kerry (CEO/CIO — authorizing the wire and purchase)
   - Signer 2: Controller / secondary approver (dual authorization for wires ≥ $50,000)
5. Completion → filed in `/06 - Collateral Files/Active Pipeline/[TAPE-ID]/[LOAN-ID]/`

**Deed-in-Lieu Workflow:**
1. Agent 07 recommends DIL; n8n creates Approval Queue record
2. Kerry approves
3. n8n triggers DIL envelope:
   - Signer 1: Borrower (name/email from `loans` table in Supabase — agent 07 confirms contact info)
   - Signer 2: Kerry (countersigns on behalf of fund)
4. Completion → filed in `/10 - Legal Files/Loan-Level Legal/[LOAN-ID]/Deed-in-Lieu/`

**Distribution Declaration Workflow:**
1. Agent 11 calculates distribution; Agent 10 confirms NAV
2. n8n creates Approval Queue record
3. Kerry approves distribution amount
4. n8n creates distribution declaration envelope — Kerry signs formal distribution declaration
5. Completion → filed in `/12 - Fund Admin Reports/Distributions/`

**Envelope Settings:**
- All internal/closing documents: 7-day expiration (tighter — these are time-sensitive)
- No reminders to external parties (internal signing only for most)

**Completion Webhook (DocuSign → n8n → Google Drive → Supabase):**
- Completed → filed per document type (paths above)
- n8n updates Supabase with executed status per workflow
- Closing: `loans.acquisition_status = Active`, `cash_activity` row created for wire
- DIL: `npl_workouts.resolution_path = DIL`, `legal_matters` record updated
- Distribution: `distributions.wire_status = Pending` (awaiting actual wire confirmation from bank)

**Approval Required:** All workflows in this category require Approval Queue authorization BEFORE DocuSign envelope is created. The approval is the decision; the DocuSign is the execution record.

---

## Google Drive to Box Migration Checklist

When the institutional stage trigger is reached, execute this migration:

- [ ] Create Box Enterprise account; configure admin users
- [ ] Export Google Drive folder structure exactly to Box (same naming convention, same folder hierarchy)
- [ ] Migrate all existing files (use Box's Google Drive migration tool or rclone)
- [ ] Verify all files transferred with intact metadata and naming
- [ ] Update n8n integrations: replace Google Drive API credentials with Box API credentials
- [ ] Update DocuSign completion webhooks: file destination switches from Google Drive to Box
- [ ] Enable Box watermarking on Investor Documents, Data Room, and Subscription Documents folders
- [ ] Configure Box Shield (DLP) for Restricted classification folders
- [ ] Migrate all sharing links: revoke old Google Drive links; re-share via Box with same access levels
- [ ] Update Agent 18 system prompt: replace Google Drive references with Box
- [ ] Update Supabase `documents` table: update `drive_path` and `drive_file_id` fields with Box equivalents
- [ ] Confirm Airtable Drive Link fields: update to Box URLs
- [ ] Run Agent 15 migration audit: confirm all access permissions match pre-migration state
- [ ] Decommission Google Drive shared drive (archive read-only for 90 days before full deletion)
