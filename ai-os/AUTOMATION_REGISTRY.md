# Automation Registry

Every automation in the Standard Black AI-OS. Document before activating.

Format: Name | Trigger | Action | Tool | Status | Approved By | Date

---

## Active Automations

| Name | Trigger | Action | Tool | Status | Approved |
|---|---|---|---|---|---|
| Monthly Payment Reminder | 25th of each month | Calendar alert — collect $105/person | Google Calendar | Active | Kerry | 2026-05-06 |

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
