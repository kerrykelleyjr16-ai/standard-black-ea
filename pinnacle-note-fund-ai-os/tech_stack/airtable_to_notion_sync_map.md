# Airtable → Notion Sync Map
## Standard Black | Kasino Family Holdings

---

## Core Rule

**Airtable is the system of record. Notion is the human-readable layer.**

Data flows one direction: Airtable → Notion. Nothing written in Notion feeds back into Airtable. If a record is wrong, fix it in Airtable. The Notion version updates on the next sync.

---

## What Syncs vs. What Stays in Airtable

### Deals Table

| Field | Syncs to Notion? | Notes |
|---|---|---|
| Deal Name | Yes — summary only | Appears as deal entry in Notion Deal History |
| Status | Yes | Shown on deal summary page |
| Note Type | Yes | Shown on deal summary |
| UPB | Yes — rounded/summarized | Show as "$500K" not raw number |
| Purchase Price | No | Stays in Airtable only |
| Property Value | No | Stays in Airtable only |
| LTV | No | Stays in Airtable only |
| Bid Deadline | Yes — date only | For visibility on pipeline page |
| Assigned Owner | Yes | Accountability context |
| Approval Status | Yes — status only | "Approved / Pending / Not Started" |
| Next Action | Yes | Shown on deal summary |
| Next Action Date | Yes | Shown on deal summary |
| Closing Costs | No | Stays in Airtable only |
| Rehab Estimate | No | Stays in Airtable only |
| Kerry's Notes | No | Private — never synced |
| Exit Strategy | No | Stays in Airtable only |

**What appears in Notion:** Deal name, status, UPB (summarized), deadline, owner, approval status, next action.
**What stays in Airtable only:** All financial modeling, Kerry's notes, pricing details, closing costs.

---

### Contacts Table

| Field | Syncs to Notion? | Notes |
|---|---|---|
| Full Name | No | PII — stays in Airtable |
| Company | Yes — company name only | For vendor directory |
| Contact Type | Yes — type only | Seller / Servicer / Broker |
| Email | No | PII — stays in Airtable |
| Phone | No | PII — stays in Airtable |
| Next Follow-Up Date | No | Operational — stays in Airtable |
| Notes | No | Private |
| Status | No | Operational |

**What appears in Notion:** Vendor directory page — company names and types only. No individual contacts.
**What stays in Airtable only:** All PII, contact details, follow-up schedules, individual records.

---

### Companies Table

| Field | Syncs to Notion? | Notes |
|---|---|---|
| Company Name | Yes — for vendor directory | Appears as vendor entry in Notion |
| Company Type | Yes | Seller / Servicer / Broker / Legal / Vendor |
| State | Yes | For reference |
| Website | Yes | For team reference |
| Primary Contact | No | PII — stays in Airtable |
| Phone | No | PII — stays in Airtable |
| Notes | No | Private |
| Relationship Status | No | Operational |

**What appears in Notion:** Company name, type, state, website.
**What stays in Airtable only:** Primary contacts, phone numbers, relationship notes.

---

### Tasks Table

| Field | Syncs to Notion? | Notes |
|---|---|---|
| Task Name | No | Operational — stays in Airtable |
| Owner | No | Operational |
| Status | No | Operational |
| Due Date | No | Operational |
| Related Deal | No | Operational |
| Priority | No | Operational |

**What appears in Notion:** Nothing from Tasks. Tasks are operational — they live in Airtable and are surfaced through Airtable view links on the Airtable Dashboard Links Notion page.
**Why:** Task data changes daily. Syncing it would require constant manual updates and it adds no value in Notion's format.

---

### Documents Table

| Field | Syncs to Notion? | Notes |
|---|---|---|
| Document Name | Yes — for SOP Library only | When the document is an SOP |
| Document Type | Yes — SOP types only | |
| Related Deal | No | Stays in Airtable |
| Storage Location | No | Operational |
| Status | No | Operational |
| Confidential flag | No | Never synced |

**What appears in Notion:** SOP documents (pasted into SOP Library page). Everything else stays in Airtable.
**What stays in Airtable only:** Loan documents, tape files, IC memos, anything Confidential, financial records.

---

### Investors Table

**Nothing from the Investors table syncs to Notion. Ever.**

| Field | Syncs to Notion? |
|---|---|
| Investor Name | No |
| Committed Amount | No |
| Accreditation Status | No |
| Contact Information | No |
| Distribution Records | No |
| K-1 Information | No |
| All other fields | No |

The Investors table is in a separate Airtable base accessible only to Kerry. It does not appear anywhere in Notion.

---

### Automations Table

| Field | Syncs to Notion? | Notes |
|---|---|---|
| Automation Name | Yes | Appears in Automation Status page |
| Tool | Yes | |
| Trigger | Yes — plain English summary | Not the raw technical trigger |
| Action | Yes — plain English | |
| Status | Yes | Active / Planned / Paused |
| Last Tested | Yes | |
| Risk Level | No | Internal |
| Phase | Yes | |

**What appears in Notion:** Human-readable automation status table (see automation_status_template.md).

---

## Sync Frequency and Method

### Phase I — Manual Sync (Current)

Manual sync happens during the weekly Friday review session.

**What gets copied:**
- Closed deal outcomes (summary only — no financial details)
- New companies added (name, type, state, website)
- New SOPs created (full content pasted into SOP Library)
- Decisions made (pasted into Decision Log)
- Automation status updates

**Time required:** 10–15 minutes per week.

**Who does it:** Kerry (or Claude Code prompted to generate the Notion content from Airtable data).

---

### Phase II — Zapier Sync (After Zapier Phase I is fully live)

| Zap ID | Trigger | Notion Action |
|---|---|---|
| NOTION-ZAP-01 | Deal Status = Closed-Won in Airtable | Create summary page in Notion Deal History |
| NOTION-ZAP-02 | New SOP page created in Notion | Send Slack notification to team |
| NOTION-ZAP-03 | New company added in Airtable | Add entry to Notion Vendor Directory |

**Requirement:** Airtable Team plan active + Notion API integration enabled.
**Do not build until:** All 7 Zapier Phase I automations are active and tested.

---

## Fields That Are Never Synced — Under Any Circumstances

- Borrower names, addresses, SSNs, or any borrower PII
- Investor names, committed capital, accreditation status
- Loan-level financial modeling (UPB detail, purchase price, exit projections)
- Servicer remittance data
- Any document flagged Confidential in Airtable
- API keys, passwords, or access credentials
- Raw tape files
- Kerry's private notes on deals
- Legal documents, opinions, or correspondence
- Financial statements or tax records

---

## Dashboards Safe for Notion

These Airtable views can be embedded in Notion as shareable links (read-only, no login required):

| Dashboard | Airtable View | Safe for Kody? | Safe for TJ? |
|---|---|---|---|
| Active Pipeline | Deals → Active Pipeline | Yes | Yes |
| Kody's Task Queue | Tasks → Kody's Queue | Yes | No |
| TJ's Task Queue | Tasks → TJ's Queue | No (his queue) | Yes |
| Deadline Watch | Deals → Deadline Watch | Yes | No |
| Overdue Tasks | Tasks → Overdue | Yes | Yes |

**How to embed:** In Airtable, click Share → Create a shared view link → Set to read-only → Paste the URL into the Airtable Dashboard Links page in Notion.
