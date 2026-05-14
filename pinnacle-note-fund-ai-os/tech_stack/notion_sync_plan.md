# Notion Sync Plan
# Standard Black — Company Brain Architecture

**Role:** Notion = human-readable company brain. Airtable = structured operating database.
**Date:** 2026-05-09

---

## Design Principle

Airtable and Notion serve different purposes. They should not duplicate raw data.

| Airtable | Notion |
|---|---|
| Operational records (deals, contacts, tasks) | Strategic knowledge (SOPs, brand, team docs) |
| Structured fields and automations | Human-readable pages and docs |
| Real-time deal tracking | Historical decisions and frameworks |
| Kerry, Kody, TJ operate here | Kerry, Kody, TJ read and reference here |
| Sensitive deal and investor data | High-level summaries only — no PII |

---

## Notion Workspace Structure

```
Standard Black (Workspace)
│
├── Company
│   ├── Mission & Vision
│   ├── Entity Structure (Kasino Family → Standard Black)
│   ├── Decision Log (major strategic decisions only)
│   └── Brand Guidelines
│
├── Note Fund
│   ├── Fund Overview
│   │   ├── Investment thesis
│   │   ├── Buy-box criteria (Income Sleeve + Workout Sleeve)
│   │   └── Target returns
│   ├── Deal History (summaries only — no PII, no full financials)
│   ├── Portfolio Overview (post-close, high-level)
│   ├── Vendor Directory (active servicers, attorneys by state)
│   └── SOPs & Playbooks
│       ├── Deal Pre-Screening SOP
│       ├── Due Diligence SOP
│       ├── State Foreclosure Reference
│       ├── Closing SOP
│       └── Asset Management SOP
│
├── Team
│   ├── Roles & Responsibilities
│   ├── Operating Framework (meeting cadence, accountability)
│   ├── Weekly Meeting Notes
│   └── Payment Structure
│
└── Resources
    ├── Course Notes (Desi Arnez)
    ├── Market Research Archive
    └── Reference Library
```

---

## What Syncs from Airtable → Notion

**Manual sync (Kerry or Claude Code does this during weekly review):**

| Airtable Data | Notion Destination | Sync Frequency |
|---|---|---|
| Closed deal outcomes (Go/No-Bid decisions) | Note Fund → Deal History | Per deal or weekly |
| Completed LOI outcomes | Note Fund → Deal History | Per deal |
| Active vendor list (servicers, attorneys) | Note Fund → Vendor Directory | When changes occur |
| Team task completions (significant only) | Team → Weekly Meeting Notes | Weekly |
| Major approval decisions | Company → Decision Log | Per significant decision |
| New SOPs built by Claude Code | Note Fund → SOPs & Playbooks | When created |

**What does NOT go from Airtable to Notion:**
- Individual loan-level financial data
- Borrower PII (names, SSNs, addresses)
- Investor names, emails, or contribution amounts
- Raw tape data or servicer remittances
- Any data that would create a compliance or privacy issue

---

## What Gets Built in Notion First (Phase I)

Build these pages before worrying about sync:

1. **Company / Mission & Vision** — Standard Black mission statement, values, long-range goals
2. **Company / Entity Structure** — Kasino Family Holdings → Standard Black diagram
3. **Note Fund / Fund Overview** — Buy-box, target returns, Phase I thesis
4. **Note Fund / SOPs** — Paste SOPs built by Claude Code
5. **Team / Operating Framework** — Copy from `references/team-operating-framework.md`
6. **Team / Roles & Responsibilities** — Kerry, Kody, TJ role definitions

---

## Zapier Sync (Phase I — Simple)

### NOTION-ZAP-01: Closed Deal → Notion Deal History

**Trigger:** Airtable — Deal Status = Closed-Won
**Action:** Notion — Create page in Deal History database
**Page content:**
- Deal name
- Note type
- Seller (company name only)
- UPB
- Purchase price
- LTV
- Go/No-Bid
- Close date
- Key notes

**What to exclude:** Borrower name, property address, full IC memo

---

### NOTION-ZAP-02: New SOP Created → Notify Team

**Trigger:** Notion — New page created in SOPs & Playbooks database
**Action:** Slack — Send to #team-notifications
**Message:** "New SOP added to Notion: [Page title]. Review when you have a chance."

---

## Phase I Sync Protocol (Manual Default)

Until Zapier-Notion integration is built and tested:

1. During the weekly review (`/weekly` skill), Claude Code surfaces anything that should be synced
2. Kerry pastes key deal summaries, decisions, or SOP updates into Notion manually
3. Takes 15 minutes per week — acceptable for Phase I

**When to automate:** Once the Notion workspace is built and 3+ deal summaries have been synced manually. At that point, automate with Zapier.

---

## Security Rules for Notion

- No investor PII in Notion (no names, amounts, accreditation status)
- No full loan financials in Notion
- No borrower data of any kind in Notion
- All sensitive data stays in Airtable + Supabase (Phase II)
- Notion pages are sharable — treat every Notion page as potentially readable by anyone on the team
- If in doubt: summarize without the sensitive detail
