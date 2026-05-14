# Airtable-to-Notion Sync Checklist
## Do this after Airtable is live and Zapier is connected — Notion comes second

---

## Ground Rule

Airtable is the system of record. Notion is the company brain. They do not duplicate data — they serve different purposes.

| Airtable | Notion |
|---|---|
| Live deal records, contacts, tasks | SOPs, brand guidelines, team docs |
| Operational data with field structure | Human-readable pages and knowledge |
| Real-time tracking | Historical decisions and frameworks |
| Kerry, Kody, TJ operate here | Kerry, Kody, TJ read and reference here |

---

## Phase I Sync: Manual (No Automation Yet)

Until deal volume justifies automating the sync, the transfer is manual — done during the weekly review session.

**What moves from Airtable → Notion each week:**
- Closed deal outcomes (summary only — no PII, no borrower data)
- New vendor or servicer added (name, type, state, contact only)
- Significant decisions made (log entry in Notion Decision Log)
- New SOP created by Claude Code (paste into Notion SOP Library)

**What never moves to Notion:**
- Borrower names, addresses, SSNs
- Investor names, committed amounts, accreditation status
- Loan-level financial data
- Servicer remittance data
- Raw tape files or any document marked Confidential

---

## Notion Workspace Structure to Build

When you're ready to build Notion, the structure is:

```
Standard Black (Workspace)
├── Company Overview
│   ├── Mission & Vision
│   ├── Entity Structure
│   ├── Decision Log
│   └── Brand Guidelines
├── Note Fund
│   ├── Fund Overview & Buy-Box
│   ├── Deal History (summaries)
│   ├── Vendor Directory
│   └── SOP Library
├── Team
│   ├── Roles & Responsibilities
│   ├── Operating Framework
│   ├── Weekly Meeting Notes
│   └── Payment Structure
└── Resources
    ├── Course Notes (Desi Arnez)
    ├── State Foreclosure Reference
    └── Market Research
```

Each of these pages has content already written in the Claude Code workspace. Claude Code will build the Notion pages when you're ready.

---

## Future Zapier Sync (Phase II — Do Not Build Yet)

When you're ready to automate Airtable → Notion syncing:

| Zap | Trigger | Action |
|---|---|---|
| NOTION-ZAP-01 | Deal Status = Closed-Won | Create page in Notion Deal History |
| NOTION-ZAP-02 | New SOP page created in Notion | Slack notification to team |
| NOTION-ZAP-03 | New Vendor added in Airtable | Add entry to Notion Vendor Directory |

**Requirement:** Airtable Team plan + Notion API access (Notion has a free API)

---

## Checklist: Ready for Notion Build

Complete all boxes before starting Notion:

- [ ] All 7 Airtable tables built and verified
- [ ] All Zapier Phase I automations active and tested
- [ ] Permissions set for Kerry, Kody, TJ
- [ ] Investors table in separate base (security)
- [ ] At least one real deal in the system (not test data)
- [ ] Weekly review rhythm established (Thursday check-in + Sunday reviews running)
- [ ] Kerry confirms Airtable is the primary operating tool (team using it daily)

**Only when all boxes are checked: tell Claude Code "Build Notion" and it will generate all page content ready to paste.**

---

## Airtable Build Complete

When this checklist is done, the Airtable Command Center is operational:

- 7 tables: Companies, Contacts, Deals, Tasks, Documents, Investors, Automations
- 40+ views across all tables
- 7 Zapier automations active
- Full permissions configured
- Test records verified and deleted
- Sync plan documented for Phase II

The system is ready for live deal flow.
