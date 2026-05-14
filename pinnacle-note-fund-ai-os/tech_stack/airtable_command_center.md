# Airtable Command Center — The Pinnacle Note Fund AI OS

**Fund:** The Pinnacle Note Fund
**Document:** Airtable Command Center Design
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Design Principles

**Airtable is the daily operating interface. Supabase is the source of truth.**

- Every record in Airtable originates from Supabase (written by agents via n8n)
- Human decisions made in Airtable (approvals, status updates, notes) are written back to Supabase by n8n
- If a field exists in both systems, Supabase wins on conflict
- Airtable is not used for financial calculations — those stay in Supabase and flow in as computed values
- Kerry, Kody, and TJ operate exclusively in Airtable — they never need to touch Supabase directly
- No record in Airtable should ever be the only copy of important data — Supabase always has the authoritative version

**Data Flow:**
```
Agent Session → Supabase (write) → n8n (sync trigger) → Airtable (record created/updated)
Kerry decision in Airtable → n8n webhook → Supabase (written back as human input)
```

---

## Workspace Structure

**Workspace Name:** Pinnacle Note Fund Operations

**10 Bases:**
1. Deal Pipeline
2. Loan Asset Registry
3. Seller CRM
4. Investor CRM
5. Exception Tracker
6. Vendor Management
7. Approval Queue
8. Compliance Calendar
9. Task Management
10. Investor Reporting

**7 Interfaces (cross-base dashboards):**
1. CEO/CIO Command Center
2. Acquisitions Dashboard
3. Underwriting Dashboard
4. Asset Management Dashboard
5. Investor Relations Dashboard
6. Compliance Dashboard
7. Treasury Dashboard

---

## Base 1: Deal Pipeline

**Purpose:** The acquisitions command center — tracks every tape from first receipt through bid, LOI, diligence authorization, and close. Kerry reviews bid recommendations here and initiates LOIs. The go/no-bid decision and bid price are surfaced from agent sessions in Supabase.

---

### Tables

#### 1A. Tape Log

| Field | Type | Notes |
|---|---|---|
| Tape ID | Single line text | Primary identifier — e.g., TAPE-2026-001 |
| Seller | Linked record → Seller CRM | Links to seller profile |
| Date Received | Date | |
| Loan Count | Number | |
| Total UPB | Currency | |
| Asset Mix | Single line text | e.g., "85% Income / 15% NPL" |
| Status | Single select | Received, Screening, Underwriting, Pricing, LOI Sent, Accepted, Rejected, Closed |
| Go / No-Bid | Single select | Go, No-Bid, Conditional Go |
| Data Quality Score | Number (0–100) | Agent 18 assigns during normalization |
| Data Quality Flags | Long text | List of quality issues Agent 18 flagged |
| Agent 18 Session | Single line text | Session ID reference |
| Agent 02 Screening | Long text | Screening summary from Agent 02 |
| Bid Deadline | Date | |
| Days to Deadline | Formula | `DATETIME_DIFF({Bid Deadline}, TODAY(), 'days')` |
| Deadline Alert | Formula | `IF({Days to Deadline} <= 3, "URGENT", IF({Days to Deadline} <= 7, "This Week", "OK"))` |
| Notes | Long text | Kerry notes on tape |
| Drive Link | URL | Google Drive folder for this tape |
| Last Updated | Last modified time | |

**Views:**
- **Active Tapes** — Filter: Status not in [Accepted, Rejected, Closed]. Sort: Days to Deadline ASC. Primary working view.
- **Bid Decisions Needed** — Filter: Go/No-Bid = Go AND Status = Pricing. Shows tapes ready for LOI authorization.
- **Deadline Watch** — Filter: Days to Deadline ≤ 7. Sort: Days to Deadline ASC. Color: Red if ≤ 3 days, Yellow if ≤ 7.
- **All Tapes (Archive)** — No filter. Sort: Date Received DESC. Full history.
- **Rejected / Pass** — Filter: Status = Rejected OR Go/No-Bid = No-Bid.

**Automations (n8n → Airtable):**
- When n8n receives Agent 18 normalization output → create/update Tape Log record
- When Agent 02 screening complete → update Go/No-Bid, Agent 02 Screening, Status = Screening
- When Agent 04 pricing complete → update Status = Pricing
- When Days to Deadline = 3 → n8n sends alert notification to Kerry

**Escalation Rules:**
- Bid deadline ≤ 3 days with no Go/No-Bid decision → URGENT flag; Agent 01 surfaces in daily briefing
- Data Quality Score < 60 → flag tape for Kerry review before screening proceeds

**Supabase Sync:** Mirrors `loan_tapes` table. Kerry's status changes written back to `loan_tapes.status` via n8n webhook on field change.

---

#### 1B. Pricing Summary

| Field | Type | Notes |
|---|---|---|
| Pricing ID | Single line text | e.g., PRICE-00001 |
| Tape | Linked record → Tape Log | |
| Pricing Date | Date | |
| Base IRR | Percent | |
| Base Bid % UPB | Percent | |
| Base Bid Amount | Currency | |
| Upside IRR | Percent | |
| Upside Bid Amount | Currency | |
| Downside IRR | Percent | |
| Downside Bid Amount | Currency | |
| Recommended Bid | Currency | Agent 04 recommendation |
| Max Bid | Currency | Walk-away price |
| Key Risks | Long text | |
| Agent 04 Session | Single line text | Session ID reference |
| Approved Bid | Currency | Kerry enters after reviewing |
| Bid Approval Status | Single select | Pending Review, Approved, Modified, Rejected |

**Views:**
- **Pending Bid Review** — Filter: Bid Approval Status = Pending Review. Kerry's action queue.
- **Approved Bids** — Filter: Bid Approval Status = Approved or Modified.
- **Pricing History** — All records. Sort: Pricing Date DESC.

**Automations:**
- Agent 04 pricing session complete → n8n creates Pricing Summary record and links to Tape Log
- Kerry changes Bid Approval Status to Approved → n8n creates `approvals` record in Supabase, triggers LOI workflow

**Supabase Sync:** Mirrors `pricing_models` table. Approved Bid written back to `loan_tapes` and `approvals`.

---

#### 1C. LOI Tracker

| Field | Type | Notes |
|---|---|---|
| LOI ID | Single line text | e.g., LOI-2026-001 |
| Tape | Linked record → Tape Log | |
| Seller | Linked record → Seller CRM | |
| LOI Sent Date | Date | |
| LOI Amount | Currency | Bid amount |
| LOI Expiration | Date | |
| Seller Response | Single select | Pending, Accepted, Rejected, Countered |
| Counter Amount | Currency | If seller countered |
| Counter Response | Single select | Accepted Counter, Rejected Counter, Walking |
| Outcome | Single select | Accepted, Rejected, Expired, Walking |
| Outcome Date | Date | |
| Diligence Auth | Checkbox | Kerry checks when authorizing full diligence |
| Notes | Long text | |
| DocuSign Status | Single select | Not Sent, Sent, Signed, Expired |

**Views:**
- **Open LOIs** — Filter: Outcome is empty. Sort: LOI Expiration ASC.
- **Accepted — Pending Diligence Auth** — Filter: Seller Response = Accepted AND Diligence Auth unchecked.
- **LOI History** — All records. Sort: LOI Sent Date DESC.

**Automations:**
- Agent 02 drafts LOI → n8n creates LOI Tracker record
- Kerry checks Diligence Auth → n8n creates Supabase `approvals` record, triggers diligence workflow (WF-02)
- LOI Expiration within 2 days → alert to Kerry

**Supabase Sync:** Mirrors `loan_tapes` LOI fields. Diligence Auth checkbox written to `approvals` table.

---

#### 1D. Closing Tracker

| Field | Type | Notes |
|---|---|---|
| Close ID | Single line text | |
| Tape | Linked record → Tape Log | |
| Target Close Date | Date | |
| Wire Amount | Currency | |
| Wire Auth Status | Single select | Pending, Dual Approved, Wired, Confirmed |
| Wire Date | Date | |
| Boarding Status | Single select | Pending, In Progress, Cleared, Held |
| Loans Boarded | Number | |
| Loans Held | Number | Count with boarding exceptions |
| Closing Package Drive Link | URL | |
| Notes | Long text | |

**Views:**
- **Active Closings** — Filter: Wire Auth Status not in [Confirmed]. Sort: Target Close Date ASC.
- **Boarding Queue** — Filter: Wire Auth Status = Wired. Shows loans needing QA.

**Supabase Sync:** Mirrors `loan_tapes` closing fields + `boarding_exceptions` summary counts.

---

**Responsible Agents:** Agent 02 (screening, LOI), Agent 03 (feeds underwriting to tape), Agent 04 (pricing), Agent 05 (closing readiness), Agent 09 (boarding), Agent 18 (normalization, data quality)

**Cross-Base Links:**
- Tape Log → Loan Asset Registry (when loan is boarded)
- LOI Tracker → Approval Queue (LOI authorization, wire authorization)
- Seller → Seller CRM

---

## Base 2: Loan Asset Registry

**Purpose:** The live portfolio — every note the fund owns, with current performance status, workout stage, and servicing health. This is where Kody monitors the book daily. Agent 06 updates it monthly from servicer remittance data; Agent 07 owns NPL records; Agent 09 handles boarding.

---

### Tables

#### 2A. Active Portfolio

| Field | Type | Notes |
|---|---|---|
| Loan ID | Single line text | e.g., LOAN-2026-00001 |
| Property Address | Single line text | |
| City | Single line text | |
| State | Single line text | |
| Servicer | Linked record → Vendor Management | |
| SPV | Single line text | Acquiring entity |
| Purchase Price | Currency | |
| Current UPB | Currency | |
| Property Value (AVM) | Currency | Most recent AVM |
| Current LTV | Percent | Calculated: UPB / AVM |
| Current ITV | Percent | Calculated: Purchase Price / AVM |
| Classification | Single select | Income, NPL, REO |
| Payment Status | Single select | Current, 30, 60, 90, 120+, Bankruptcy, REO, Paid Off |
| Last Payment Date | Date | |
| Months Paid (12) | Number | Payments in trailing 12 months |
| Delinquency Days | Number | |
| Health Score | Number (0–100) | Agent 03 UW score |
| Boarding Date | Date | |
| Workout Strategy | Single select | Reinstatement, Modification, DIL, Short Sale, Foreclosure, REO Sale |
| Resolution Status | Single select | Active, Resolved |
| Drive Loan File | URL | Google Drive loan file folder |
| Notes | Long text | |
| Last Updated | Last modified time | |

**Views:**
- **Full Portfolio** — All active loans. Sort: State, then Loan ID.
- **Performing (Income)** — Filter: Classification = Income AND Payment Status = Current.
- **Watch List** — Filter: Payment Status in [30, 60] OR Health Score < 65. Color rows by severity.
- **NPL Active** — Filter: Classification = NPL AND Resolution Status = Active.
- **By Servicer** — Group by: Servicer. Shows delinquency rates per servicer.
- **By State** — Group by: State. Geographic concentration view.
- **REO** — Filter: Payment Status = REO.
- **Resolved / Paid Off** — Filter: Resolution Status = Resolved OR Payment Status = Paid Off.

**Automations:**
- Agent 06 monthly session complete → n8n updates Payment Status, Last Payment Date, Delinquency Days, Months Paid
- Payment Status changes to 60+ → n8n creates record in Approval Queue (NPL strategy review required)
- Health Score drops below 60 → n8n creates alert record in Approval Queue

**Escalation Rules:**
- Any loan moving to 60+ days delinquent → automatic escalation to CEO/CIO via Approval Queue
- Health Score < 50 → flag for Agent 07 NPL review session
- REO status → immediate CEO/CIO notification

**Supabase Sync:** Mirrors `loans` table. Agent-driven updates flow Supabase → n8n → Airtable. Human notes written back to `loans.notes`.

---

#### 2B. NPL Strategy Tracker

| Field | Type | Notes |
|---|---|---|
| Workout ID | Single line text | e.g., WRK-00001 |
| Loan | Linked record → Active Portfolio | |
| Resolution Path | Single select | Reinstatement, Modification, DIL, Short Sale, Foreclosure, REO Sale |
| Strategy Approved Date | Date | |
| Borrower Response | Single select | Responsive, Unresponsive, Hostile, Cooperative |
| Current Legal Milestone | Single line text | |
| Next Legal Deadline | Date | |
| Days to Legal Deadline | Formula | `DATETIME_DIFF({Next Legal Deadline}, TODAY(), 'days')` |
| FC Attorney | Single line text | |
| Modification Type | Single select | Rate Reduction, Term Extension, Principal Deferral, Combination |
| Mod Final Status | Single select | Pending, Trial, Permanent, Failed |
| REO List Price | Currency | |
| REO Sale Price | Currency | |
| Resolution Outcome | Single select | Reinstatement, Modification, DIL, Short Sale, FC Sale, REO Sale, Payoff |
| Loss Severity % | Percent | Actual loss / UPB |
| Agent 07 Session | Single line text | |
| Notes | Long text | |

**Views:**
- **Active Workouts** — Filter: Resolution Outcome is empty. Sort: Next Legal Deadline ASC.
- **Deadline Alert** — Filter: Days to Legal Deadline ≤ 14. Color: Red if ≤ 7 days.
- **By Resolution Path** — Group by: Resolution Path.
- **Modification Pipeline** — Filter: Resolution Path = Modification. Sort by Mod Final Status.
- **REO Pipeline** — Filter: Resolution Path = REO Sale OR Resolution Outcome = REO Sale.
- **Resolved** — Filter: Resolution Outcome is not empty.

**Automations:**
- Agent 07 session complete → n8n creates/updates NPL Strategy record
- Next Legal Deadline within 7 days → alert to Kerry
- Resolution Outcome filled → n8n updates `loans.resolution_status` in Supabase

**Responsible Agents:** Agent 07 (strategy and milestones), Agent 08 (attorney/vendor performance on NPL cases)

**Supabase Sync:** Mirrors `npl_workouts` table. Legal milestone updates from Agent 07 sessions.

---

#### 2C. Cashflow Monitor

| Field | Type | Notes |
|---|---|---|
| Loan ID | Single line text | |
| Loan | Linked record → Active Portfolio | |
| Month | Single line text | e.g., 2026-05 |
| Expected Payment | Currency | Scheduled payment |
| Actual Payment | Currency | From remittance report |
| Variance | Formula | `{Actual Payment} - {Expected Payment}` |
| Collection Status | Single select | On Time, Late, Missed, Partial |
| 30-Day Forecast | Currency | Agent 06 projection |
| 60-Day Forecast | Currency | Agent 06 projection |
| 90-Day Forecast | Currency | Agent 06 projection |
| Servicer Report Date | Date | Date report processed |
| Notes | Long text | |

**Views:**
- **Current Month** — Filter: Month = current month.
- **Misses / Shorts** — Filter: Collection Status in [Missed, Partial]. Sort: Variance ASC.
- **12-Month History by Loan** — Group by: Loan. Sort: Month DESC.

**Automations:**
- Agent 06 monthly session complete → n8n creates Cashflow Monitor record per loan for the month
- Variance < -$500 → flag in Approval Queue for review

**Supabase Sync:** Mirrors `cash_activity` (remittance category, per loan) + Agent 06 forecast output.

---

**Cross-Base Links:**
- Active Portfolio → Exception Tracker (open exceptions per loan)
- Active Portfolio → Approval Queue (open approvals per loan)
- NPL Strategy Tracker → Vendor Management (FC attorney)

---

## Base 3: Seller CRM

**Purpose:** Full seller relationship management — contact history, tape volume, responsiveness, and relationship health. Agent 02 manages seller records; Kerry uses this for relationship decisions and pipeline planning.

---

### Tables

#### 3A. Sellers

| Field | Type | Notes |
|---|---|---|
| Seller ID | Single line text | e.g., SEL-001 |
| Company Name | Single line text | |
| Primary Contact | Single line text | |
| Email | Email | |
| Phone | Phone | |
| State | Single line text | Primary state of operation |
| Relationship Status | Single select | Active, Warm, Cold, Blacklisted |
| Total Tapes Received | Count | Rollup from Tape History |
| Total UPB Sourced | Rollup | Sum from Tape History |
| Last Tape Date | Rollup | Most recent tape received |
| Go / No-Bid Rate | Percent | % of tapes that got a Go recommendation |
| Closed Deals Count | Number | Tapes that resulted in close |
| Avg Data Quality Score | Rollup | Average Agent 18 quality score |
| Notes | Long text | Kerry relationship notes |
| Drive Folder | URL | Seller folder in Google Drive |

**Views:**
- **Active Sellers** — Filter: Relationship Status = Active. Sort: Last Tape Date DESC.
- **Top Producers** — Sort: Total UPB Sourced DESC.
- **Quality Ranking** — Sort: Avg Data Quality Score DESC.
- **All Sellers** — No filter. Full directory.

**Automations:**
- New seller created in Supabase → n8n creates Seller record in Airtable
- Seller's avg data quality score drops below 65 → status flag for Kerry review

**Supabase Sync:** Mirrors `sellers` table.

---

#### 3B. Tape History

| Field | Type | Notes |
|---|---|---|
| Tape | Linked record → Deal Pipeline / Tape Log | |
| Seller | Linked record → Sellers | |
| Date Received | Date | |
| Loan Count | Number | |
| Total UPB | Currency | |
| Go / No-Bid | Single select | |
| Outcome | Single select | Closed, Rejected, Expired, In Progress |
| Data Quality Score | Number | |
| Notes | Long text | |

**Views:**
- **By Seller** — Group by: Seller.
- **Closed Deals** — Filter: Outcome = Closed.
- **Recent (90 Days)** — Filter: Date Received in last 90 days.

**Supabase Sync:** Mirrors `loan_tapes` table (seller-filtered view).

---

#### 3C. Seller Communication Log

| Field | Type | Notes |
|---|---|---|
| Seller | Linked record → Sellers | |
| Date | Date | |
| Contact Type | Single select | Email, Call, Meeting, Text |
| Summary | Long text | What was discussed |
| Follow-Up Required | Checkbox | |
| Follow-Up Date | Date | |
| Handled By | Single select | Kerry, Agent 02 |
| Outcome | Single line text | |

**Views:**
- **Pending Follow-Ups** — Filter: Follow-Up Required checked AND Follow-Up Date ≤ today.
- **By Seller** — Group by: Seller. Chronological history.
- **Recent (30 Days)** — Filter: Date in last 30 days.

**Automations:**
- Follow-Up Date = today → Airtable automation sends reminder notification to Kerry

**Responsible Agents:** Agent 02 (creates seller records and communication log entries during tape intake and seller outreach)

---

## Base 4: Investor CRM

**Purpose:** Full LP relationship management — prospect pipeline, onboarding status, contributions, capital account summary, and communication log. Agent 16 manages investor records; Agent 17 reads for reporting. Kerry uses this to manage LP relationships and capital raising.

---

### Tables

#### 4A. Investors

| Field | Type | Notes |
|---|---|---|
| Investor ID | Single line text | e.g., LP-001 |
| First Name | Single line text | |
| Last Name | Single line text | |
| Entity Name | Single line text | If investing via entity |
| Investor Type | Single select | Individual, Trust, LLC, LP |
| Email | Email | |
| Phone | Phone | |
| State | Single line text | |
| Accredited Status | Single select | Verified, Pending, Not Verified |
| Onboarding Status | Single select | Prospect, Onboarding, Active, Inactive |
| Pipeline Stage | Single select | Prospect, Soft Commit, Signed, Funded |
| Committed Amount | Currency | |
| Funded Amount | Currency | |
| Capital Balance | Currency | From Agent 10 NAV output |
| Preferred Return (Accrued) | Currency | |
| Total Distributions Received | Currency | |
| KYC / AML Cleared | Checkbox | |
| Subscription Signed | Checkbox | |
| First Contribution Date | Date | |
| Current IRR | Percent | From Agent 10 |
| Current MOIC | Number | From Agent 10 |
| Notes | Long text | Kerry relationship notes |

**Views:**
- **Active LPs** — Filter: Onboarding Status = Active. Sort: Funded Amount DESC.
- **Capital Raise Pipeline** — Filter: Onboarding Status in [Prospect, Onboarding]. Sort: Pipeline Stage, then Committed Amount DESC.
- **Soft Commits (Not Yet Signed)** — Filter: Pipeline Stage = Soft Commit.
- **Onboarding In Progress** — Filter: KYC cleared OR Subscription signed but Onboarding Status = Onboarding.
- **All Investors** — Full directory. Sort: Investor ID.

**Automations:**
- Agent 16 session updates investor record → n8n updates Airtable Investor record
- Subscription signed in DocuSign → n8n marks Subscription Signed = checked, moves Pipeline Stage to Funded
- Monthly NAV cycle complete → n8n updates Capital Balance, Preferred Return, IRR, MOIC per investor

**Supabase Sync:** Mirrors `investors` and `capital_accounts` tables. Human notes written back to `investors.communication_log`.

---

#### 4B. Investor Pipeline

| Field | Type | Notes |
|---|---|---|
| Investor | Linked record → Investors | |
| Stage | Single select | Initial Contact, Intro Call, Fund Overview Sent, DDQ Response, Soft Commit, Docs Sent, Funded |
| Stage Date | Date | Date entered current stage |
| Days in Stage | Formula | `DATETIME_DIFF(TODAY(), {Stage Date}, 'days')` |
| Committed Amount | Currency | |
| Anticipated Close | Date | Expected funding date |
| Lead Source | Single select | Referral, Network, Event, Other |
| Referred By | Single line text | |
| Follow-Up Date | Date | |
| Agent 16 Notes | Long text | |

**Views:**
- **Active Pipeline** — Filter: Stage not in [Funded]. Sort: Days in Stage DESC.
- **Closing This Month** — Filter: Anticipated Close in current month.
- **Stale (30+ Days in Stage)** — Filter: Days in Stage > 30. Color: Red.
- **Referral Tracker** — Group by: Lead Source.

**Automations:**
- Anticipated Close within 7 days → alert to Kerry
- Days in Stage > 45 → flag for Agent 16 follow-up session

---

#### 4C. Investor Communication Log

| Field | Type | Notes |
|---|---|---|
| Investor | Linked record → Investors | |
| Date | Date | |
| Contact Type | Single select | Email, Call, Meeting, Report Sent, Distribution Notice |
| Summary | Long text | |
| Agent | Single line text | Agent 16 session or human |
| Follow-Up Required | Checkbox | |
| Follow-Up Date | Date | |

**Views:**
- **Pending Follow-Ups** — Filter: Follow-Up Required checked AND Follow-Up Date ≤ today.
- **By Investor** — Group by: Investor.
- **Recent (30 Days)** — Filter: Date in last 30 days.

**Responsible Agents:** Agent 16 (CRM updates, communication log, onboarding workflow), Agent 17 (reads investor list for report distribution)

---

## Base 5: Exception Tracker

**Purpose:** Single view of every open exception across diligence and boarding — Critical and Major exceptions surface immediately to Kerry. Agent 05 logs diligence exceptions; Agent 09 logs boarding exceptions. This base is the primary governance tool before any loan closes or boards.

---

### Tables

#### 5A. Diligence Exceptions

| Field | Type | Notes |
|---|---|---|
| Exception ID | Single line text | e.g., EXC-D-00001 |
| Tape | Linked record → Deal Pipeline / Tape Log | |
| Loan ID | Single line text | Reference to specific loan |
| Exception Type | Single select | Title, Lien, Document, Property, Payment, Legal, Other |
| Severity | Single select | Critical, Major, Minor |
| Description | Long text | |
| Financial Impact | Currency | Estimated exposure |
| Legal Impact | Single line text | |
| Required Resolution | Long text | |
| Owner | Single select | Seller, Attorney, Title Co, Fund |
| Deadline | Date | |
| Days to Deadline | Formula | `DATETIME_DIFF({Deadline}, TODAY(), 'days')` |
| Status | Single select | Open, In Progress, Resolved, Waived, Seller Resolved |
| Blocks Closing | Checkbox | |
| Resolution Notes | Long text | |
| Resolved Date | Date | |
| Agent 05 Session | Single line text | |

**Views:**
- **Critical Open** — Filter: Severity = Critical AND Status in [Open, In Progress]. Color rows red.
- **Major Open** — Filter: Severity = Major AND Status in [Open, In Progress].
- **Blocks Closing** — Filter: Blocks Closing checked AND Status not in [Resolved, Waived].
- **Deadline Watch** — Filter: Status in [Open, In Progress] AND Days to Deadline ≤ 7. Sort: Days to Deadline ASC.
- **By Tape** — Group by: Tape.
- **Resolved** — Filter: Status in [Resolved, Waived, Seller Resolved].

**Automations:**
- Agent 05 creates new Critical exception → n8n immediately creates Approval Queue record for CEO/CIO review
- Agent 05 creates new Major exception → n8n creates Approval Queue record
- Exception deadline ≤ 3 days and status = Open → alert to Kerry
- Exception status updated to Resolved → n8n updates `diligence_exceptions` in Supabase

**Escalation Rules:**
- Critical exception, Blocks Closing = true → no closing proceeds without explicit CEO/CIO approval in Approval Queue
- Financial Impact > $10,000 → auto-escalate to CEO/CIO regardless of severity level

**Supabase Sync:** Mirrors `diligence_exceptions` table. Status updates written back by n8n.

---

#### 5B. Boarding Exceptions

| Field | Type | Notes |
|---|---|---|
| Exception ID | Single line text | e.g., EXC-B-00001 |
| Loan | Linked record → Loan Asset Registry / Active Portfolio | |
| Exception Type | Single select | Document, Data, Servicer, Payment, Other |
| Severity | Single select | Critical, Major, Minor |
| Description | Long text | |
| Required Resolution | Long text | |
| Owner | Single select | Servicer, Seller, Attorney, Fund |
| Deadline | Date | |
| Status | Single select | Open, In Progress, Resolved, Waived |
| Blocks Boarding | Checkbox | |
| QA Cleared | Checkbox | |
| Resolution Notes | Long text | |
| Agent 09 Session | Single line text | |

**Views:**
- **Blocking Boarding** — Filter: Blocks Boarding checked AND QA Cleared unchecked.
- **Open Exceptions** — Filter: Status in [Open, In Progress].
- **By Loan** — Group by: Loan.
- **Resolved** — Filter: Status in [Resolved, Waived] OR QA Cleared checked.

**Automations:**
- Agent 09 creates boarding exception → n8n creates Airtable record
- Blocking Boarding exception is resolved → n8n re-triggers Agent 09 QA check

**Supabase Sync:** Mirrors `boarding_exceptions` table.

---

#### 5C. Exception Dashboard (Summary)

| Field | Type | Notes |
|---|---|---|
| Summary ID | Auto number | |
| Date | Date | Snapshot date |
| Total Open Critical | Number | Rollup or formula |
| Total Open Major | Number | |
| Total Open Minor | Number | |
| Closing Blocked Count | Number | |
| Boarding Blocked Count | Number | |
| Oldest Open Exception | Date | |
| Notes | Long text | |

**Views:**
- **Current Snapshot** — Single record view. Updated daily by n8n.

**Automations:**
- Daily at 7:00 AM → n8n queries Supabase for exception counts → writes snapshot to this table

**Responsible Agents:** Agent 05 (diligence exceptions), Agent 09 (boarding exceptions), Agent 01 (reads for daily briefing)

---

## Base 6: Vendor Management

**Purpose:** All third-party vendors — servicers, attorneys, title companies, BPO providers, inspectors. Agent 08 tracks performance and issues. Kerry uses this for vendor governance decisions. Monthly scorecards surface SLA compliance and issue trends.

---

### Tables

#### 6A. Vendor Registry

| Field | Type | Notes |
|---|---|---|
| Vendor ID | Single line text | e.g., VND-001 |
| Company Name | Single line text | |
| Vendor Type | Single select | Servicer, Title, Attorney, BPO, Inspector, Other |
| Primary Contact | Single line text | |
| Email | Email | |
| Phone | Phone | |
| Licensed States | Multiple select | States where vendor is active |
| Status | Single select | Active, Probation, Terminated |
| Contract Start | Date | |
| Contract End | Date | |
| Days to Contract Expiry | Formula | `DATETIME_DIFF({Contract End}, TODAY(), 'days')` |
| Current SLA Score | Number | From latest scorecard |
| Open Issues Count | Count | Rollup from Vendor Issues |
| Notes | Long text | |
| Contract Drive Link | URL | |

**Views:**
- **Active Vendors** — Filter: Status = Active.
- **Contracts Expiring (90 Days)** — Filter: Days to Contract Expiry ≤ 90.
- **Probation** — Filter: Status = Probation.
- **By Type** — Group by: Vendor Type.
- **SLA Rankings** — Sort: Current SLA Score ASC. (Lowest SLA at top — worst performers first.)

**Automations:**
- Contract expiring in 90 days → Approval Queue record created for renewal decision
- Vendor SLA Score falls below 70 → status automatically moved to Probation; Approval Queue alert

**Supabase Sync:** Mirrors `vendors` table.

---

#### 6B. Servicer Tracker

| Field | Type | Notes |
|---|---|---|
| Vendor | Linked record → Vendor Registry | |
| Servicer Code | Single line text | Short code (e.g., FCINV) |
| Remittance Day | Number | Day of month remittance due |
| Reporting Frequency | Single select | Monthly, Quarterly |
| Active Loan Count | Number | From Agent 06 monthly update |
| Active UPB | Currency | |
| Avg Collection Rate | Percent | Trailing 3-month |
| SLA Response Hours | Number | |
| Last Report Date | Date | |
| Last Report Status | Single select | On Time, Late, Missing |
| Portal URL | URL | |
| Notes | Long text | |

**Views:**
- **All Servicers** — No filter. Sort: Active UPB DESC.
- **Late / Missing Reports** — Filter: Last Report Status in [Late, Missing].

**Automations:**
- Agent 06 monthly session complete → n8n updates Active Loan Count, Active UPB, Avg Collection Rate, Last Report Date

**Supabase Sync:** Mirrors `servicers` table.

---

#### 6C. Vendor Issues

| Field | Type | Notes |
|---|---|---|
| Issue ID | Single line text | e.g., VIL-00001 |
| Vendor | Linked record → Vendor Registry | |
| Issue Date | Date | |
| Issue Type | Single select | SLA Miss, Error, Communication, Billing, Other |
| Severity | Single select | Critical, Major, Minor |
| Description | Long text | |
| Financial Impact | Currency | If applicable |
| Resolution Required | Long text | |
| Status | Single select | Open, In Progress, Resolved, Escalated |
| Resolved Date | Date | |
| Agent 08 Session | Single line text | |
| Notes | Long text | |

**Views:**
- **Open Issues** — Filter: Status in [Open, In Progress, Escalated]. Sort: Severity DESC.
- **Critical Issues** — Filter: Severity = Critical.
- **By Vendor** — Group by: Vendor. Shows issue concentration.
- **Resolved** — Filter: Status = Resolved.

**Automations:**
- Critical vendor issue created → Approval Queue alert to Kerry
- Agent 08 session complete → n8n creates/updates Vendor Issues records

---

#### 6D. Monthly Scorecards

| Field | Type | Notes |
|---|---|---|
| Scorecard ID | Single line text | |
| Vendor | Linked record → Vendor Registry | |
| Month | Single line text | e.g., 2026-05 |
| SLA Score (0–100) | Number | Agent 08 assigns |
| Communication Score | Number | |
| Accuracy Score | Number | |
| Overall Score | Number | |
| Issues Count | Number | |
| Meets Threshold | Checkbox | Overall Score ≥ 70 = checked |
| Agent 08 Notes | Long text | |

**Views:**
- **Current Month** — Filter: Month = current month. Group by: Vendor.
- **Below Threshold** — Filter: Meets Threshold unchecked. Sort: Overall Score ASC.
- **Historical Trend (by Vendor)** — Group by: Vendor. Sort: Month DESC.

**Automations:**
- Agent 08 monthly scorecard session → n8n creates Scorecard record per vendor

**Responsible Agents:** Agent 08 (primary — issues, scorecards), Agent 07 (attorney/vendor in NPL cases)

---

## Base 7: Approval Queue

**Purpose:** The CEO/CIO action center — every consequential decision requiring Kerry's authorization surfaces here. This is the most operationally critical base. No LOI is sent, no wire is executed, no investor communication is released without an Approved record here. This base drives the Approval Queue panel in the Executive Interface.

---

### Tables

#### 7A. Open Approvals

| Field | Type | Notes |
|---|---|---|
| Approval ID | Single line text | e.g., APR-00001 |
| Approval Type | Single select | LOI, Closing, Wire, Distribution, Investment, Compliance, Legal, Vendor Contract, NPL Strategy, Other |
| Item Description | Long text | What is being approved |
| Requested By | Single line text | Agent name or human |
| Request Date | Date + Time | |
| Amount | Currency | Dollar amount if applicable |
| Reference | Single line text | Loan ID, Tape ID, Investor ID, etc. |
| Priority | Single select | URGENT, High, Normal |
| Expires | Date + Time | Approval expiration |
| Hours Until Expiry | Formula | Time until expiration |
| Kerry Decision | Single select | Pending, Approved, Rejected |
| Secondary Approver | Single line text | For wire dual-approval |
| Secondary Decision | Single select | Pending, Approved, Rejected |
| Conditions | Long text | Any conditions attached |
| Rejection Reason | Long text | If rejected |
| Decision Date | Date + Time | |
| Notes | Long text | |
| Compliance Review | Linked record → Compliance Calendar | For materials requiring compliance clearance |

**Views:**
- **Action Required Today** — Filter: Kerry Decision = Pending. Sort: Priority DESC, then Request Date ASC. This is Kerry's primary view every morning.
- **URGENT** — Filter: Priority = URGENT. Color rows red.
- **Wire Approvals** — Filter: Approval Type = Wire AND Kerry Decision = Approved AND Secondary Decision = Pending. Shows wires awaiting dual-approval.
- **Expiring Soon** — Filter: Kerry Decision = Pending AND Hours Until Expiry ≤ 24.
- **Pending Secondary** — Filter: Secondary Approver is not empty AND Secondary Decision = Pending.

**Automations (n8n → Airtable):**
- Any agent creates an `approvals` record in Supabase → n8n immediately creates Open Approvals record in Airtable
- New URGENT approval → n8n sends immediate notification to Kerry

**Automations (Airtable → n8n):**
- Kerry changes Kerry Decision to Approved → n8n webhook fires → writes `status = Approved` to `approvals` in Supabase → downstream workflow continues
- Kerry changes Kerry Decision to Rejected → n8n writes rejection to Supabase → notifies requesting agent/workflow
- Approval expires (Hours Until Expiry = 0) → n8n marks expired in Supabase, sends alert to Kerry

**Escalation Rules:**
- Any URGENT approval not actioned within 2 hours → Agent 01 re-surfaces in next briefing cycle
- Wire approval ≥ $50,000 → dual approval required (Secondary Approver must also approve before wire executes)
- Compliance approval with no secondary review → blocked from proceeding

**Supabase Sync:** Mirrors `approvals` table. This base is the human-input layer — every Kerry decision is the authoritative source; n8n writes it immediately back to Supabase `approvals.status`.

---

#### 7B. Completed Approvals

| Field | Type | Notes |
|---|---|---|
| Approval ID | Single line text | |
| Approval Type | Single select | |
| Item Description | Long text | |
| Decision | Single select | Approved, Rejected, Expired |
| Decision Date | Date | |
| Amount | Currency | |
| Approved By | Single line text | |
| Notes | Long text | |

**Views:**
- **Approved This Month** — Filter: Decision = Approved AND Decision Date in current month.
- **Rejected** — Filter: Decision = Rejected. Sort: Decision Date DESC.
- **By Type** — Group by: Approval Type. Sort: Decision Date DESC.
- **Full History** — All records. Sort: Decision Date DESC.

**Automations:**
- When Kerry Decision = Approved or Rejected in Open Approvals → n8n moves record to Completed Approvals after 24 hours (or immediately on rejection)

**Responsible Agents:** All 18 agents create approval requests. No agent updates status — only Kerry and designated secondary approver.

---

## Base 8: Compliance Calendar

**Purpose:** Compliance review queue, regulatory deadline tracking, and Agent 15 quarterly control test schedule. Agent 14 manages material reviews; Agent 15 manages audit controls. Kerry uses this to ensure nothing falls through the cracks on the regulatory and governance side.

---

### Tables

#### 8A. Compliance Review Queue

| Field | Type | Notes |
|---|---|---|
| Review ID | Single line text | e.g., COMP-00001 |
| Material Name | Single line text | |
| Material Type | Single select | Investor Report, Pitch Deck, DDQ Response, Marketing Material, Distribution Notice, Other |
| Submitted By | Single line text | Agent or human |
| Submitted Date | Date | |
| Drive File Link | URL | |
| Review Status | Single select | Pending, Under Review, Cleared, Not Cleared, Cleared with Conditions |
| Agent 14 Review Date | Date | |
| Issues Found | Long text | |
| Conditions | Long text | |
| CEO/CIO Approval | Linked record → Approval Queue | |
| Clearance Date | Date | |
| Notes | Long text | |

**Views:**
- **Pending Review** — Filter: Review Status in [Pending, Under Review]. Sort: Submitted Date ASC.
- **Cleared This Cycle** — Filter: Review Status = Cleared AND Submitted Date in current quarter.
- **Not Cleared / Issues** — Filter: Review Status = Not Cleared.
- **Pending CEO Approval** — Filter: CEO/CIO Approval is linked AND Review Status = Cleared with Conditions.
- **Full History** — All records. Sort: Submitted Date DESC.

**Automations:**
- Agent 14 submits material to `compliance_queue` in Supabase → n8n creates Compliance Review Queue record
- Agent 14 writes review result to Supabase → n8n updates Review Status in Airtable
- Cleared with Conditions → n8n creates Approval Queue record for CEO/CIO final sign-off
- Material pending review > 5 business days → alert to Kerry

**Escalation Rules:**
- Any investor-facing material released without Cleared status → blocked by n8n; Approval Queue alert
- Not Cleared material → immediate CEO/CIO notification

**Supabase Sync:** Mirrors `compliance_reviews` table.

---

#### 8B. Regulatory & Operational Deadlines

| Field | Type | Notes |
|---|---|---|
| Deadline ID | Auto number | |
| Deadline Name | Single line text | e.g., "Q2 Investor Report Distribution" |
| Category | Single select | Investor Reporting, Tax, Regulatory, Facility, Legal, Operational |
| Due Date | Date | |
| Days Until Due | Formula | `DATETIME_DIFF({Due Date}, TODAY(), 'days')` |
| Responsible Agent | Single line text | e.g., Agent 17, Agent 14 |
| Responsible Human | Single select | Kerry, Kody, TJ, Controller |
| Status | Single select | Upcoming, In Progress, Complete, Missed |
| Completion Date | Date | |
| Notes | Long text | |
| Recurring | Checkbox | |
| Recurrence Frequency | Single select | Monthly, Quarterly, Annually |

**Views:**
- **This Month** — Filter: Days Until Due ≤ 30 AND Status not = Complete.
- **This Week** — Filter: Days Until Due ≤ 7.
- **OVERDUE** — Filter: Days Until Due < 0 AND Status not = Complete. Color rows red.
- **By Category** — Group by: Category.
- **Full Calendar** — All records. Sort: Due Date ASC.

**Automations:**
- Deadline within 14 days → Approval Queue record created for awareness
- Deadline missed (Due Date passed, Status not Complete) → URGENT alert to Kerry
- Recurring deadline completed → n8n creates next occurrence deadline record

---

#### 8C. Agent 15 Control Tests

| Field | Type | Notes |
|---|---|---|
| Test ID | Single line text | e.g., CTRL-2026-Q2 |
| Test Period | Single line text | e.g., Q2 2026 |
| Test Date | Date | |
| Controls Tested | Number | Total controls in scope |
| Controls Passed | Number | |
| Controls Failed | Number | |
| Pass Rate | Formula | `{Controls Passed} / {Controls Tested}` |
| Target | Percent | 100% |
| Status | Single select | Scheduled, In Progress, Complete, Failed |
| MFA Audit | Single select | Pass, Fail, N/A |
| RLS Audit | Single select | Pass, Fail, N/A |
| API Key Rotation | Single select | Pass, Fail, N/A |
| Session Log Completeness | Single select | Pass, Fail, N/A |
| RBAC Audit | Single select | Pass, Fail, N/A |
| Audit Log Integrity | Single select | Pass, Fail, N/A |
| Wire Dual-Approval | Single select | Pass, Fail, N/A |
| Data Room Access | Single select | Pass, Fail, N/A |
| Agent 15 Session | Single line text | |
| Report Drive Link | URL | |
| CEO/CIO Review | Linked record → Approval Queue | |
| Notes | Long text | |

**Views:**
- **Current Quarter** — Filter: Test Period = current quarter.
- **Failed Controls** — Filter: any control = Fail.
- **History** — All records. Sort: Test Date DESC.

**Automations:**
- Agent 15 quarterly test session complete → n8n creates/updates Control Test record
- Any control = Fail → URGENT Approval Queue record created

**Responsible Agents:** Agent 14 (compliance reviews), Agent 15 (control tests, audit trail)

---

## Base 9: Task Management

**Purpose:** The operating system visibility layer — every agent task and human task tracked in one place. Agent 01 reads this for the daily CEO/CIO briefing. Kerry and the team use this to see what's running, what's pending, and what needs human input.

---

### Tables

#### 9A. Agent Sessions

| Field | Type | Notes |
|---|---|---|
| Task ID | Single line text | e.g., TASK-00001 |
| Agent Number | Number | 1–18 |
| Agent Name | Single line text | |
| Workflow | Single line text | e.g., WF-01, WF-03, Manual |
| Task Type | Single line text | e.g., Tape Normalization, UW Review |
| Reference | Single line text | Loan ID, Tape ID, etc. |
| Status | Single select | Pending, Running, Complete, Failed, Awaiting Approval |
| Started | Date + Time | |
| Completed | Date + Time | |
| Duration (min) | Number | |
| Output Summary | Long text | Plain-language summary of agent output |
| Escalation Required | Checkbox | |
| Escalation Reason | Single line text | |
| Notes | Long text | |

**Views:**
- **Active Now** — Filter: Status in [Pending, Running]. Sort: Started DESC.
- **Awaiting Approval** — Filter: Status = Awaiting Approval. (These need Kerry action.)
- **Failed** — Filter: Status = Failed. Color rows red.
- **Completed Today** — Filter: Completed = today.
- **By Agent** — Group by: Agent Name. Sort: Started DESC.
- **Escalation Queue** — Filter: Escalation Required checked.
- **Recent 7 Days** — Filter: Started in last 7 days. Sort: Started DESC.

**Automations:**
- n8n creates `agent_tasks` in Supabase → immediately creates Agent Sessions record in Airtable
- Session Status changes to Failed → URGENT Approval Queue alert to Kerry
- Escalation Required checked → creates Approval Queue record
- Session completes → n8n updates Status, Completed, Duration, Output Summary

**Supabase Sync:** Mirrors `agent_tasks` table. Read-only in Airtable (all writes come from n8n).

---

#### 9B. Human Task Queue

| Field | Type | Notes |
|---|---|---|
| Task ID | Auto number | |
| Task Name | Single line text | |
| Category | Single select | Decision Required, Document Review, Data Entry, Follow-Up, Meeting, Other |
| Assigned To | Single select | Kerry, Kody, TJ |
| Due Date | Date | |
| Days Until Due | Formula | `DATETIME_DIFF({Due Date}, TODAY(), 'days')` |
| Priority | Single select | URGENT, High, Normal, Low |
| Status | Single select | Not Started, In Progress, Complete, Blocked |
| Related Record | Single line text | Reference ID (loan, tape, investor, etc.) |
| Notes | Long text | |
| Created By | Single line text | Agent or human |

**Views:**
- **Kerry's Queue** — Filter: Assigned To = Kerry AND Status not = Complete. Sort: Priority DESC, Days Until Due ASC.
- **Kody's Queue** — Filter: Assigned To = Kody AND Status not = Complete.
- **TJ's Queue** — Filter: Assigned To = TJ AND Status not = Complete.
- **URGENT** — Filter: Priority = URGENT AND Status not = Complete.
- **Overdue** — Filter: Days Until Due < 0 AND Status not = Complete.
- **Completed This Week** — Filter: Status = Complete AND Due Date in last 7 days.

**Automations:**
- n8n creates human task (from agent escalation or scheduled trigger) → creates Human Task record
- Task overdue → daily alert to assigned team member
- URGENT task created → immediate notification

---

#### 9C. Workflow Status

| Field | Type | Notes |
|---|---|---|
| Workflow ID | Single line text | e.g., WF-01 |
| Workflow Name | Single line text | e.g., Tape Intake |
| Last Run | Date + Time | |
| Last Run Status | Single select | Success, Partial, Failed, Never Run |
| Next Scheduled | Date + Time | |
| Run Count (30 Days) | Number | |
| Error Count (30 Days) | Number | |
| Notes | Long text | |

**Views:**
- **All Workflows** — No filter. Single row per workflow. Kerry sees health of all 6 core workflows at a glance.
- **Failed / Needs Attention** — Filter: Last Run Status in [Failed, Partial].

**Automations:**
- n8n updates this record after every workflow run with Last Run, Last Run Status, Next Scheduled

**Responsible Agents:** Agent 01 (reads all sessions for daily briefing), all agents (tasks created for their sessions)

---

## Base 10: Investor Reporting

**Purpose:** Quarterly investor report lifecycle — from generation through compliance review, CEO/CIO approval, and distribution. Agent 17 manages the reporting cycle; Agent 14 clears materials; Kerry approves and authorizes distribution. Also tracks the data room.

---

### Tables

#### 10A. Report Tracker

| Field | Type | Notes |
|---|---|---|
| Report ID | Single line text | e.g., RPT-2026-Q1 |
| Report Type | Single select | Quarterly, Annual, Special |
| Period | Single line text | e.g., Q1 2026 |
| Period End | Date | |
| Status | Single select | Pending Generation, Draft, Under Compliance Review, Approved, Distributed |
| Generated Date | Date | |
| Agent 17 Session | Single line text | |
| Drive File Link | URL | |
| Compliance Review | Linked record → Compliance Calendar | |
| Compliance Cleared | Checkbox | |
| CEO/CIO Approval | Linked record → Approval Queue | |
| Approved Date | Date | |
| Distribution Date | Date | |
| LP Count | Number | How many investors received it |
| Power BI PDF Exported | Checkbox | |
| Notes | Long text | |

**Views:**
- **Current Cycle** — Filter: Status not = Distributed. Shows active report in progress.
- **Awaiting My Approval** — Filter: Compliance Cleared checked AND CEO/CIO Approval linked AND Approved Date is empty.
- **History** — All records. Sort: Period End DESC.

**Automations:**
- Agent 17 generates report → n8n creates Report Tracker record, moves Status to Draft
- Compliance cleared → n8n checks Compliance Cleared, creates Approval Queue record
- Kerry approves → n8n moves Status to Approved, triggers Power BI PDF export + distribution
- Distribution complete → n8n marks Status = Distributed, fills LP Count, Distribution Date

**Supabase Sync:** Mirrors `investor_reports` table.

---

#### 10B. Distribution Tracker

| Field | Type | Notes |
|---|---|---|
| Distribution ID | Single line text | e.g., DIST-2026-Q1-LP001 |
| Event ID | Single line text | Groups all LP rows for one distribution |
| Investor | Linked record → Investor CRM | |
| Distribution Date | Date | |
| Period | Single line text | |
| Total Amount | Currency | |
| Preferred Return Paid | Currency | |
| Return of Capital | Currency | |
| Residual LP Share | Currency | |
| Wire Status | Single select | Pending, Confirmed, Failed |
| Wire Date | Date | |
| Tax Document Prepared | Checkbox | |
| Distribution Notice Sent | Checkbox | |
| Notes | Long text | |

**Views:**
- **Current Event** — Filter: Event ID = [most recent event ID].
- **Pending Wires** — Filter: Wire Status = Pending.
- **Failed Wires** — Filter: Wire Status = Failed.
- **By Investor** — Group by: Investor. Full distribution history per LP.
- **Full History** — All records. Sort: Distribution Date DESC.

**Automations:**
- Agent 11 calculates distribution → n8n creates one Distribution Tracker record per LP
- Wire confirmed → n8n updates Wire Status = Confirmed, Wire Date
- Failed wire → URGENT Approval Queue alert

**Supabase Sync:** Mirrors `distributions` table.

---

#### 10C. Data Room

| Field | Type | Notes |
|---|---|---|
| Item ID | Single line text | e.g., DR-00001 |
| Document Name | Single line text | |
| Document Type | Single select | Fund Overview, PPM, Subscription Agreement, Financial Statement, Tax Document, Due Diligence, Other |
| Period | Single line text | |
| Drive Link | URL | |
| Access Level | Single select | All LPs, Specific LPs, Internal Only |
| Published Date | Date | |
| Expiration Date | Date | |
| Is Active | Checkbox | |
| Notes | Long text | |

**Views:**
- **Active Documents** — Filter: Is Active checked.
- **Expiring (30 Days)** — Filter: Expiration Date within 30 days.
- **By Type** — Group by: Document Type.

**Automations:**
- Agent 17 publishes new document → n8n creates Data Room record
- Document expiring in 14 days → alert to Kerry

**Responsible Agents:** Agent 17 (report lifecycle, data room), Agent 14 (compliance clearance), Agent 16 (investor-facing communication of report availability)

---

## Interfaces (Cross-Base Dashboards)

Airtable Interfaces pull records from multiple bases into a single visual layout. Kerry sees the right information in context without switching bases. Each interface is read-only aggregation — actions still happen in the source base.

---

### Interface 1: CEO/CIO Command Center

**Purpose:** Kerry's morning briefing — everything requiring his attention or decision, in one screen.

**Sections:**

| Section | Source | Content |
|---|---|---|
| Open Approvals | Approval Queue Base | All Pending approvals, sorted URGENT first. Decision buttons directly in interface. |
| Active Tapes | Deal Pipeline | Tapes with status ≠ Closed/Rejected. Days to deadline highlighted. |
| Critical Exceptions | Exception Tracker | All open Critical exceptions across diligence and boarding. |
| Agent Activity (Today) | Task Management | Agent sessions started today — status, output summary. |
| Failed Sessions | Task Management | Any agent sessions with status = Failed (last 48 hours). |
| Portfolio Health | Loan Asset Registry | Count of loans by payment status. Watch list count. NPL count. |
| Upcoming Deadlines | Compliance Calendar | Deadlines in next 14 days across all categories. |
| Pending Compliance Reviews | Compliance Calendar | Materials waiting for Agent 14 review or CEO/CIO approval. |

**Key Design Rule:** Approval Queue section uses interface buttons — Kerry approves/rejects directly without leaving the interface. n8n webhook fires on button click.

---

### Interface 2: Acquisitions Dashboard

**Purpose:** Full view of the deal pipeline — active tapes, LOIs, bid recommendations, and closing status. Kerry and Kody use this for acquisitions meetings.

**Sections:**

| Section | Source | Content |
|---|---|---|
| Pipeline Overview | Deal Pipeline | Count of tapes by status. Total UPB in pipeline. |
| Bid Queue | Deal Pipeline / Pricing | Tapes with Pricing complete, awaiting Kerry bid approval. |
| Active LOIs | Deal Pipeline / LOI Tracker | Open LOIs. Days to expiration. Seller response status. |
| Deadline Watch | Deal Pipeline | All tapes with bid deadline ≤ 7 days. |
| Active Closings | Deal Pipeline / Closing Tracker | Tapes in closing. Wire auth status. Boarding status. |
| Seller Activity | Seller CRM | Recent tape volume by seller. New sellers. |
| Last 30 Days (Won/Lost) | Deal Pipeline | Tapes accepted vs. rejected in last 30 days. Win rate. |

---

### Interface 3: Underwriting Dashboard

**Purpose:** Underwriting queue — health scores, classifications, exceptions, and boarding QA status. Used by Kody (Operations) and Kerry for deal reviews.

**Sections:**

| Section | Source | Content |
|---|---|---|
| UW Queue | Deal Pipeline | Tapes in Underwriting status. Loan count. Avg health score. |
| Health Score Distribution | Loan Asset Registry | Count of loans by classification (Income / Borderline / NPL) and health score range. |
| Open Diligence Exceptions | Exception Tracker | All open Critical + Major diligence exceptions. Grouped by tape. |
| Boarding Pipeline | Deal Pipeline / Closing Tracker | Loans in boarding. QA cleared count vs. held count. |
| Open Boarding Exceptions | Exception Tracker | Boarding exceptions blocking QA clearance. |
| Agent Session Status | Task Management | Agent 03 (UW), Agent 05 (Diligence), Agent 09 (Boarding) — recent sessions. |

---

### Interface 4: Asset Management Dashboard

**Purpose:** Portfolio health — performing loans, watch list, NPL strategy, servicer performance. Kody's primary daily view.

**Sections:**

| Section | Source | Content |
|---|---|---|
| Portfolio Summary | Loan Asset Registry | Total UPB, loan count, classification mix, avg LTV. |
| Payment Status | Loan Asset Registry | Count of loans by payment status (Current / 30 / 60 / 90 / 120+ / BK / REO). |
| Watch List | Loan Asset Registry | All loans with payment status 30+ OR health score < 65. |
| NPL Active Workouts | Loan Asset Registry / NPL Strategy | Active NPL loans by resolution path. Next legal deadlines. |
| Servicer Performance | Vendor Management | Avg SLA score per servicer. Late/missing report count. |
| Monthly Collections | Loan Asset Registry / Cashflow | Expected vs. actual collections. Current month variance. |
| Agent Activity | Task Management | Agent 06, 07, 08 recent sessions. |

---

### Interface 5: Investor Relations Dashboard

**Purpose:** LP pipeline, onboarding status, communication queue, and capital account summary. Kerry uses this for investor relationship management.

**Sections:**

| Section | Source | Content |
|---|---|---|
| LP Pipeline | Investor CRM | Prospects and active pipeline. Stage breakdown. Total committed capital. |
| Onboarding Queue | Investor CRM | Investors in Onboarding status. KYC/subscription status. |
| Capital Summary | Investor CRM | Total funded capital. Total preferred return accrued. Total distributions paid. |
| Follow-Up Queue | Investor CRM / Communication | Communication log items with pending follow-ups. |
| Distribution Status | Investor Reporting | Current distribution event — wire status per LP. |
| Report Cycle Status | Investor Reporting | Current quarterly report — stage in lifecycle. |
| Data Room (Recent) | Investor Reporting | Most recently published data room documents. |

---

### Interface 6: Compliance Dashboard

**Purpose:** Compliance review queue, regulatory deadlines, and Agent 15 control test results. Agent 14's work product and Agent 15's governance output visible to Kerry in one view.

**Sections:**

| Section | Source | Content |
|---|---|---|
| Compliance Queue | Compliance Calendar | All materials pending Agent 14 review. Days since submitted. |
| Not Cleared Items | Compliance Calendar | Materials with issues — requires Kerry attention. |
| Regulatory Deadlines | Compliance Calendar | All deadlines in next 30 days. Overdue deadlines highlighted red. |
| Quarterly Control Test | Compliance Calendar | Most recent Agent 15 control test results. Pass/fail by control. |
| Failed Controls | Compliance Calendar | Any failed controls — URGENT flag. |
| Approval Pending (Compliance) | Approval Queue | Compliance-type approvals waiting Kerry decision. |

---

### Interface 7: Treasury Dashboard

**Purpose:** Cash position, distributions, facility utilization, and financial statement status. Kerry and Controller (when hired) use this for treasury and financial oversight.

**Sections:**

| Section | Source | Content |
|---|---|---|
| Cash Position | Loan Asset Registry / Cashflow | Total cash collected (current month). Expected collections (next 30 days). |
| Active Distributions | Investor Reporting | Current distribution event. Total amount. Wire status summary. |
| Wire Approvals Pending | Approval Queue | All Wire-type approvals awaiting dual approval. |
| Collections Variance | Loan Asset Registry | Expected vs. actual this month. Biggest misses. |
| NPL Cash Impact | Loan Asset Registry | Estimated cash impact of active NPL resolutions. |
| Agent Activity | Task Management | Agent 10 (NAV/Accounting), Agent 11 (Distributions), Agent 12 (Facility) — recent sessions. |

---

## Airtable Permissions

| Role | Access Level | Bases |
|---|---|---|
| Kerry (Workspace Owner) | Full admin | All 10 bases |
| Kody (Creator) | Can build views and automations; cannot create/delete bases | Deal Pipeline, Loan Asset, Exception Tracker, Vendor Management, Task Management |
| TJ (Commenter) | Can comment and view assigned records; cannot edit core fields | Task Management (Human Queue), Loan Asset (read-only views) |
| No public view links | Disabled on all bases | — |
| No "Anyone with link" sharing | Disabled workspace-wide | — |

---

## Global Sync Rules

1. **Supabase → Airtable (n8n push):** Agent session output → Supabase write → n8n trigger → Airtable record created or updated. This is the primary direction of data flow.

2. **Airtable → Supabase (n8n webhook):** Human decisions (Kerry approval, status change, notes) → n8n webhook on field change → Supabase write. Only specific human-input fields flow this direction.

3. **Fields that sync Airtable → Supabase:**
   - Approval Queue: Kerry Decision, Secondary Decision, Conditions, Rejection Reason
   - Deal Pipeline: Tape notes, Approved Bid, Diligence Auth checkbox
   - Loan Asset: Human notes on loan records
   - Compliance Calendar: CEO/CIO approval decisions
   - Exception Tracker: Resolution Notes, Status updates by human

4. **Fields that never sync from Airtable → Supabase:** Computed formula fields, rollups, view filters, interface layout settings.

5. **Conflict resolution:** If a field has a value in both systems and they differ, Supabase wins. n8n re-pushes the Supabase value during the next sync cycle.

6. **Sync frequency:**
   - Approval Queue: Real-time (webhook on every `approvals` INSERT in Supabase)
   - Deal Pipeline / Exception Tracker: On-event (n8n triggers on agent session complete)
   - Loan Asset Registry: Monthly (after Agent 06 portfolio review cycle)
   - Daily snapshots: Agent 01 daily briefing triggers a full status refresh of key records at 6:00 AM CT
