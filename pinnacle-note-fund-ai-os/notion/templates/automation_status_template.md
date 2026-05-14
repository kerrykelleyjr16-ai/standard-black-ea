# Automation Status — Standard Black

> Owner: Kerry Kelley Jr
> Last updated: [Date]
> Source of record: Airtable → Automations table (Active view)
> Update this page weekly during the Friday review session.

---

## Phase I — Zapier Automations

| ID | Name | What It Does | Status | Last Tested |
|---|---|---|---|---|
| ZAP-01 | New Deal Alert | When a new deal is added to Airtable, sends a Slack message to #team-notifications with deal name, type, UPB, and owner | [Planned / Active / Paused] | [Date] |
| ZAP-02 | Bid Review Alert | When a deal moves to Pricing status, sends a Slack alert with bid deadline | [Planned / Active / Paused] | [Date] |
| ZAP-03 | Approval Needed | When a deal's Approval Status becomes Pending, sends Slack alert to Kerry | [Planned / Active / Paused] | [Date] |
| ZAP-04 | Deal Status Update | When a deal changes status (key statuses only), sends team update to Slack | [Planned / Active / Paused] | [Date] |
| ZAP-05 | New Contact → Task | When a new contact is added, creates a follow-up task assigned to Kerry due in 3 days | [Planned / Active / Paused] | [Date] |
| ZAP-06 | Overdue Task Alert | When a task becomes overdue (Days Until Due < 0), sends Slack alert with task, owner, and related deal | [Planned / Active / Paused] | [Date] |
| ZAP-07 | Deal Approved → DD Checklist | When a deal is approved, automatically creates 8 due diligence tasks in Airtable linked to that deal | [Planned / Active / Paused] | [Date] |

---

## Phase II — Planned (Not Building Yet)

| ID | Name | Tool | Status |
|---|---|---|---|
| N8N-01 | Weekly deal pipeline digest | n8n | Planned |
| N8N-02 | Notion deal summary sync | n8n | Planned |
| N8N-03 | Overdue portfolio alert | n8n | Planned |

---

## What These Automations Don't Do

To keep expectations clear for the team:

- They do **not** make any decisions — Kerry approves everything manually
- They do **not** send anything externally (email, investor communication, legal) — internal Slack only
- They do **not** delete or modify deal records automatically
- They do **not** replace the weekly review — they support it

---

## If Something Looks Wrong

If a Slack alert looks incorrect, fires at the wrong time, or stops firing:

1. Check Airtable → Automations table for the automation's status
2. Check Zapier → Zap history for recent runs and errors
3. Flag to Kerry immediately — do not attempt to fix automations yourself

**Contact:** kerrykelleyjr16@gmail.com or Slack DM @Kerry

---

## Automation Health Summary

> Update this section weekly

| Category | Count |
|---|---|
| Total automations planned | 7 |
| Currently active | [#] |
| Currently paused | [#] |
| Errors in last 7 days | [#] |
| Last full test | [Date] |
