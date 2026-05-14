# Airtable Build Specification
# Standard Black — Pinnacle Note Fund Operations

**Version:** Phase I (No Supabase / n8n yet — Airtable is source of truth)
**Built from:** `pinnacle-note-fund-ai-os/tech_stack/airtable_command_center.md`
**Date:** 2026-05-09
**Owner:** Kerry Kelley Jr

---

## Phase I Constraints

The full blueprint assumes Supabase (database) and n8n (automation) as the backend layer. In Phase I, we don't have those yet. Adaptations:

| Blueprint Assumes | Phase I Reality |
|---|---|
| Supabase is source of truth | Airtable IS the source of truth |
| n8n pushes data to Airtable | Manual entry + Zapier for triggers |
| Agent sessions write to Supabase | Claude Code sessions write notes directly to Airtable |
| 18 AI agents run automatically | Kerry + Claude Code operate manually from skill workflows |
| n8n webhooks on field changes | Airtable native automations + Zapier |

**Phase I still gives you:** Full schema, real deal tracking, Slack alerts, CRM, and the Approval Queue. Just without the full AI automation layer until Phase II.

---

## Build Order (Phase I Priority)

Build in this order — each base unlocks the next:

| Order | Base | Why First |
|---|---|---|
| 1 | **Deal Pipeline** | Core of the business — deals need tracking now |
| 2 | **Seller CRM** | Links to Deal Pipeline — need sellers before tapes |
| 3 | **Approval Queue** | Every consequential action needs a log now |
| 4 | **Task Management** | Human task queue for Kerry, Kody, TJ |
| 5 | Exception Tracker | Needed when first deal is in diligence |
| 6 | Loan Asset Registry | Needed when first loan is closed and boarded |
| 7 | Vendor Management | Needed when first servicer is engaged |
| 8 | Compliance Calendar | Phase I light version |
| 9 | Investor CRM | Phase II — when capital raising begins |
| 10 | Investor Reporting | Phase II — when fund is launched |

---

## Workspace Setup

1. Go to airtable.com → Create workspace
2. Name: **Pinnacle Note Fund Operations**
3. Create all bases one at a time (Airtable free plan: 5 bases; Pro plan needed for 10)

**Recommended plan:** Airtable Team ($20/seat/month) — needed for:
- Unlimited bases
- Automations
- Interfaces
- Zapier integration

---

## Pre-Build Checklist

Before building any base:
- [ ] Airtable account created
- [ ] Workspace created: "Pinnacle Note Fund Operations"
- [ ] Team plan activated (or confirm free plan limits)
- [ ] Kerry, Kody, and TJ added as workspace members
- [ ] Permissions set per `airtable-approval-rules.md`
- [ ] Zapier account connected to Airtable

---

## Field Type Reference

| Airtable Type | Use for |
|---|---|
| Single line text | IDs, names, short values |
| Long text | Notes, summaries, descriptions |
| Single select | Status, type, category fields |
| Multiple select | States, tags |
| Number | Counts, scores |
| Currency | Dollar amounts |
| Percent | Rates, percentages |
| Date | All date fields |
| Date + Time | Timestamps |
| Checkbox | Boolean flags |
| Formula | Calculated fields (see formulas below) |
| Linked record | Cross-table relationships |
| Rollup | Aggregated values from linked records |
| Count | Count of linked records |
| URL | Links to Drive, docs |
| Email | Email addresses |
| Phone | Phone numbers |
| Autonumber | Auto-incrementing IDs |
| Last modified time | Tracks when record was last updated |

## Key Formulas

```
Days to deadline:
DATETIME_DIFF({Bid Deadline}, TODAY(), 'days')

Deadline alert:
IF({Days to Deadline} <= 3, "URGENT", IF({Days to Deadline} <= 7, "This Week", "OK"))

Days in stage:
DATETIME_DIFF(TODAY(), {Stage Date}, 'days')

Cashflow variance:
{Actual Payment} - {Expected Payment}
```
