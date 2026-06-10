# Automation Registry

Every automation in the Standard Black AI-OS. Document before activating.

Format: Name | Trigger | Action | Tool | Status | Approved By | Date

---

## Active Automations

| Name | Trigger | Action | Tool | Status | Approved |
|---|---|---|---|---|---|
| Monthly Payment Reminder | 25th of each month | Calendar alert — collect $105/person | Google Calendar | Active | Kerry | 2026-05-06 |

---

## Wholesale OS — Edge Functions (W-series POC)

| Name | Purpose | Human Gate | Status | Date |
|---|---|---|---|---|
| `score-inbound` | Scores seller inbound SMS by motivation (0–100), detects STOP opt-outs, returns sentiment + qualifying questions | None — fully automated | Built, pending deploy | 2026-06-09 |
| `draft-offer` | Generates a cash offer letter for a deal; blocked (409) until Kerry approves the MAO | Kerry must approve MAO before offer can be drafted | Built, pending deploy | 2026-06-09 |
| `draft-dispo` | Generates a buyer blast message for a deal ready for disposition | None — review output before sending | Built, pending deploy | 2026-06-09 |
| `morning-brief` | Scheduled cron (7 AM CT) that builds a pipeline Digest: leads by stage, open tasks, pending approvals; email delivery deferred until provider key added | None — read-only snapshot | Built, pending deploy | 2026-06-09 |

---

## Planned Automations (Not Yet Active)

| Name | Trigger | Action | Tool | Priority |
|---|---|---|---|---|
| New Deal Row Alert | New row added to Note Deal Tracker | Slack alert to #team-notifications | Zapier → Slack | High |
| Deal Status Change Alert | Status column updated in Deal Tracker | Slack alert with deal name + new status | Zapier → Slack | High |
| New Drive File Alert | New file added to Real E. Note Docs. folder | Slack notification with file name | Zapier → Slack | Medium |
| Weekly Review Prompt | Every Sunday at 8:00 PM CT | Reminder to run `/weekly` review | Google Calendar | Medium |
| Monthly Decision Log Reminder | 1st of each month | Reminder to review and update context files | Google Calendar | Low |

---

## Deactivated Automations

None yet.

---

## Rules
- All automations touching external systems require human approval before activation (see `HUMAN_APPROVAL_RULES.md`)
- Document here BEFORE building in Zapier or any automation tool
- Include the approval date and who approved
- Test in staging before activating on live data
