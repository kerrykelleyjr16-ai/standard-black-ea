# Airtable → Notion Sync Plan
# How Airtable (operations layer) connects to Notion (company brain)

---

## Design Principle

**Airtable = where work happens.**
**Notion = where knowledge lives.**

They serve different purposes and should not duplicate data. The sync is one-directional for most content — summaries and decisions flow from Airtable to Notion, not raw records.

---

## What Syncs Airtable → Notion

| Airtable Content | Notion Destination | Frequency | Method |
|---|---|---|---|
| Completed tape decisions (Go/No-Bid + outcome) | Note Fund / Deal History | Weekly or per deal | Manual paste or Zapier |
| Approved bids and LOI outcomes | Note Fund / Deal History | Per event | Manual paste |
| Monthly portfolio summary (when portfolio exists) | Note Fund / Portfolio Overview | Monthly | Manual + future Zapier |
| Approved vendor list (active servicers, attorneys) | Note Fund / Vendor Directory | When changes occur | Manual update |
| Team task completions (significant ones) | Team / Weekly Summary | Weekly | Manual during weekly review |
| Decisions from Approval Queue | Company / Decision Log | Per significant decision | Manual or Zapier |

---

## What Does NOT Sync

| Data | Stays In |
|---|---|
| Raw tape records and field-level data | Airtable only |
| Borrower PII, loan-level financial data | Airtable + Supabase (Phase II) |
| Approval Queue records (operational) | Airtable only |
| Communication logs | Airtable CRM only |
| Servicer remittance data | Airtable / Supabase only |

---

## Notion Structure (to be built alongside Airtable)

```
Standard Black Workspace (Notion)
├── Company
│   ├── Mission & Vision
│   ├── Entity Structure
│   └── Decision Log (major decisions only)
├── Note Fund
│   ├── Fund Overview (strategy, buy-box, targets)
│   ├── Deal History (closed, rejected, in progress summaries)
│   ├── Portfolio Overview (post-close)
│   ├── Vendor Directory (active servicers, attorneys by state)
│   └── SOPs & Playbooks
├── Team
│   ├── Roles & Responsibilities
│   ├── Operating Framework
│   ├── Weekly Meeting Notes
│   └── Payment Structure
└── Resources
    ├── Course Notes (Desi Arnez)
    ├── State Foreclosure Reference
    └── Reference Library
```

---

## Sync Automation (Zapier — Phase I)

### ZAP-NOTION-01: Deal Decision Summary → Notion

**Trigger:** Airtable — Go/No-Bid updated in Tape Log
**Action:** Zapier → Notion — Create page in "Deal History" database

**Page content:**
- Tape ID
- Seller
- Date Received
- Loan Count + Total UPB
- Go/No-Bid decision
- Key reason (from Kerry Notes or Screening Notes)
- Status

**Build when:** Notion workspace is created and Deal History database is set up.

---

### ZAP-NOTION-02: Closed Deal Summary → Notion

**Trigger:** Airtable — Status updated to "Closed" in Tape Log
**Action:** Zapier → Notion — Update page in Deal History with closing details

---

### ZAP-NOTION-03: Significant Decisions → Notion Decision Log

**Trigger:** Manual (Kerry flags which Approval Queue decisions are significant)
**Action:** Kerry pastes key decision into Notion Decision Log
**Note:** Not every approval goes to Notion — only fund-level decisions worth documenting in the company record.

---

## Phase I Sync Protocol (Manual)

Until Zapier-Notion integration is built:
1. At the end of each week, Kerry or Claude Code runs the weekly-review skill
2. Any completed deals, significant decisions, or vendor additions are manually copied to the relevant Notion page
3. Takes 10–15 minutes per week

---

## Conflict Resolution

If data exists in both Airtable and Notion and they differ:
- **Airtable wins** for operational data (deal status, amounts, dates)
- **Notion wins** for strategic narrative (fund thesis, SOP language, brand content)
- When in doubt: update Airtable first, then sync to Notion
