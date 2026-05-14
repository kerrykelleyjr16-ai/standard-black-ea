# Airtable CRM / Deal Pipeline Schema
# Standard Black — Pinnacle Note Fund Operations
# Phase I Build: Unified Command Center

---

## Table A: Deals

The core table. Every tape, asset, or deal opportunity lives here from first contact through close.

| Field | Type | Options / Notes |
|---|---|---|
| Deal Name | Single line text | Primary field. e.g., "TAPE-2026-001 — Smith Portfolio" |
| Seller / Source | Linked record | → Contacts table |
| Asset Type | Single select | Residential, Commercial, Mixed |
| Note Type | Single select | Performing, Reperforming, NPL, REO |
| Status | Single select | New Intake, Screening, Underwriting, Pricing, LOI Sent, Diligence, Closing, Closed-Won, Rejected, On Hold |
| Priority | Single select | URGENT, High, Normal, Low |
| UPB | Currency | Unpaid principal balance |
| Purchase Price | Currency | Target or actual purchase price |
| Property Value | Currency | BPO or AVM |
| LTV | Formula | `{Purchase Price} / {Property Value}` |
| Yield | Percent | Cash-on-cash target |
| IRR | Percent | Internal rate of return target |
| State | Single line text | Property state |
| County | Single line text | Property county |
| Borrower Status | Single select | Paying, Reperforming, Non-Paying, Unknown, Bankruptcy |
| Payment Status | Single select | Current, 30, 60, 90, 120+, Bankruptcy, Foreclosure, REO |
| Due Diligence Status | Single select | Not Started, In Progress, Clear, Exceptions Found, Blocked |
| Assigned Owner | Single select | Kerry, Kody, TJ |
| Next Action | Single line text | What happens next |
| Next Action Date | Date | When it happens |
| Bid Deadline | Date | Hard deadline for bid submission |
| Days to Deadline | Formula | `DATETIME_DIFF({Bid Deadline}, TODAY(), 'days')` |
| Deadline Alert | Formula | `IF({Days to Deadline} <= 3, "URGENT", IF({Days to Deadline} <= 7, "This Week", "OK"))` |
| Documents | Attachment | Upload tape files, IC memos |
| Drive Link | URL | Google Drive folder for this deal |
| IC Memo | Long text | Paste from note-investing-underwriter skill |
| Risk Score | Single select | Low, Medium, High, Critical |
| AI Health Score | Number | 0–100, from underwriting skill |
| Approval Status | Single select | Not Required, Pending, Approved, Rejected |
| Go / No-Bid | Single select | Go, No-Bid, Conditional Go |
| Notes | Long text | Kerry + team notes |

### Views
- **New Intake** — Filter: Status = New Intake. Sort: Date created DESC
- **Active Underwriting** — Filter: Status = Underwriting
- **Needs Diligence** — Filter: Due Diligence Status = Not Started AND Status = Diligence
- **Approved Deals** — Filter: Approval Status = Approved
- **Rejected Deals** — Filter: Status = Rejected OR Go/No-Bid = No-Bid
- **Closing Pipeline** — Filter: Status = Closing. Sort: Bid Deadline ASC
- **Owned Notes** — Filter: Status = Closed-Won
- **High Priority** — Filter: Priority in [URGENT, High]. Sort: Deadline Alert
- **By State** — Group by: State
- **By Seller** — Group by: Seller/Source

---

## Table B: Contacts

Every person in the ecosystem — sellers, brokers, servicers, attorneys, investors.

| Field | Type | Options / Notes |
|---|---|---|
| Name | Single line text | Primary field |
| Company | Linked record | → Companies table |
| Role | Single line text | Title or role at their company |
| Email | Email | |
| Phone | Phone | |
| Contact Type | Single select | Seller, Broker, Servicer, Attorney, Investor, Vendor, Team, Other |
| Relationship Strength | Single select | Strong, Warm, Cold, New, Inactive |
| Source | Single line text | How Kerry found them |
| Last Contact Date | Date | |
| Next Follow-Up Date | Date | |
| Days Until Follow-Up | Formula | `DATETIME_DIFF({Next Follow-Up Date}, TODAY(), 'days')` |
| Linked Deals | Linked record | → Deals table |
| Total UPB Sourced | Rollup | Sum of UPB from linked deals |
| Closed Deals | Count | Count of linked deals with Status = Closed-Won |
| Notes | Long text | Kerry relationship notes |

### Views
- **Sellers** — Filter: Contact Type = Seller. Sort: Last Contact Date DESC
- **Investors** — Filter: Contact Type = Investor. Sort: Relationship Strength
- **Servicers** — Filter: Contact Type = Servicer
- **Attorneys** — Filter: Contact Type = Attorney. Group by: State (via linked company)
- **Vendors** — Filter: Contact Type = Vendor
- **Follow-Up Due** — Filter: Next Follow-Up Date ≤ today. Sort: Days Until Follow-Up ASC. Color: Red if overdue

---

## Table C: Companies

Every organization — seller shops, servicers, law firms, funds.

| Field | Type | Options / Notes |
|---|---|---|
| Company Name | Single line text | Primary field |
| Company Type | Single select | Seller, Servicer, Law Firm, Title Company, BPO, Fund, Bank, Other |
| Website | URL | |
| Main Contact | Linked record | → Contacts table |
| State | Single line text | Primary operating state |
| Relationship Status | Single select | Active, Warm, Cold, Blacklisted |
| Linked Contacts | Linked record | → Contacts (multiple) |
| Linked Deals | Linked record | → Deals (multiple) |
| Total UPB Volume | Rollup | Sum of UPB from linked deals |
| Notes | Long text | |

### Views
- **Active Companies** — Filter: Relationship Status = Active
- **By Type** — Group by: Company Type
- **Blacklisted** — Filter: Relationship Status = Blacklisted

---

## Table D: Tasks

Every task for the team — AI-generated or manually created.

| Field | Type | Options / Notes |
|---|---|---|
| Task Name | Single line text | Primary field |
| Department | Single select | Acquisitions, Underwriting, Diligence, Closing, Portfolio, Compliance, Team Ops, Admin |
| Related Deal | Linked record | → Deals |
| Related Contact | Linked record | → Contacts |
| Owner | Single select | Kerry, Kody, TJ |
| Priority | Single select | URGENT, High, Normal, Low |
| Status | Single select | Not Started, In Progress, Complete, Blocked, Cancelled |
| Due Date | Date | |
| Days Until Due | Formula | `DATETIME_DIFF({Due Date}, TODAY(), 'days')` |
| AI Agent Assigned | Single line text | Which skill or agent produced/assigned this task |
| Approval Required? | Checkbox | |
| Notes | Long text | |

### Views
- **My Tasks (Kerry)** — Filter: Owner = Kerry AND Status not in [Complete, Cancelled]. Sort: Priority DESC, Days Until Due ASC
- **Kody's Tasks** — Filter: Owner = Kody AND Status not in [Complete, Cancelled]
- **TJ's Tasks** — Filter: Owner = TJ AND Status not in [Complete, Cancelled]
- **Due Today** — Filter: Due Date = today
- **Overdue** — Filter: Days Until Due < 0 AND Status not in [Complete, Cancelled]. Color: Red
- **Waiting on Approval** — Filter: Approval Required? = checked AND Status = Blocked
- **By Department** — Group by: Department
- **By Agent** — Group by: AI Agent Assigned

---

## Table E: Automations

Registry of every automation — planned, active, or deactivated.

| Field | Type | Options / Notes |
|---|---|---|
| Automation Name | Single line text | Primary field |
| Department | Single select | Acquisitions, Underwriting, Diligence, Portfolio, Compliance, Team Ops, Admin |
| Trigger | Single line text | What starts it |
| Input Source | Single select | Airtable, Zapier, n8n, Google Sheets, Drive, Manual |
| AI Agent / Skill Used | Single line text | Which Claude skill handles it |
| Tools Used | Single line text | e.g., Zapier → Slack |
| Output | Single line text | What it produces |
| Human Approval Required? | Checkbox | |
| Risk Level | Single select | Low, Medium, High, Critical |
| Status | Single select | Draft, Active, Paused, Deactivated |
| Last Tested | Date | |
| Notes | Long text | |

### Views
- **Active Automations** — Filter: Status = Active. Sort: Risk Level DESC
- **Draft Automations** — Filter: Status = Draft
- **Needs Testing** — Filter: Last Tested is empty OR Status = Draft
- **High Risk** — Filter: Risk Level in [High, Critical]
- **Approval Required** — Filter: Human Approval Required? = checked

---

## Table F: Documents

Track every document — tape files, IC memos, legal docs, SOPs.

| Field | Type | Options / Notes |
|---|---|---|
| Document Name | Single line text | Primary field |
| Document Type | Single select | Tape File, IC Memo, LOI, Title Report, Legal Doc, SOP, Template, Compliance, Other |
| Related Deal | Linked record | → Deals |
| Related Contact | Linked record | → Contacts |
| Related Company | Linked record | → Companies |
| Storage Location | Single select | Google Drive, Airtable Attachment, Notion, Local |
| Drive Link | URL | |
| Status | Single select | Draft, Final, Expired, Archived |
| Last Updated | Date | |
| Notes | Long text | |

### Views
- **By Deal** — Group by: Related Deal
- **Active Docs** — Filter: Status = Final
- **IC Memos** — Filter: Document Type = IC Memo
- **Expired** — Filter: Status = Expired

---

## Table G: Investors / Capital Sources

LP pipeline and capital raising relationships. Build now, use at Phase II fund launch.

| Field | Type | Options / Notes |
|---|---|---|
| Name | Single line text | Primary field |
| Type | Single select | Individual, Family Office, Fund, IRA, Trust, LLC, Other |
| Email | Email | |
| Phone | Phone | |
| Company | Linked record | → Companies |
| Accredited? | Single select | Verified, Pending, Not Verified, N/A |
| Target Investment Size | Currency | |
| Relationship Stage | Single select | Prospect, Intro Made, Deck Sent, Soft Commit, Docs Sent, Funded, Inactive |
| Last Contact | Date | |
| Next Follow-Up | Date | |
| Linked Deals | Linked record | → Deals |
| Notes | Long text | Kerry relationship notes |

### Views
- **Active Pipeline** — Filter: Relationship Stage not in [Funded, Inactive]. Sort: Target Investment Size DESC
- **Soft Commits** — Filter: Relationship Stage = Soft Commit
- **Follow-Up Due** — Filter: Next Follow-Up ≤ today
- **All Investors** — No filter. Sort: Relationship Stage
