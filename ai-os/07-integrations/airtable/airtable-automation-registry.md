# Airtable Automation Registry
# All automations for the Pinnacle Note Fund Airtable workspace

**Phase I:** Airtable-native automations + Zapier triggers (no n8n yet)
**Phase II:** Replace Zapier with n8n for complex multi-step automations

---

## Airtable-Native Automations (Build These First)

These run inside Airtable without Zapier. Available on Team plan.

| # | Trigger | Condition | Action | Base | Priority |
|---|---|---|---|---|---|
| AT-01 | Record updated | Kerry Decision = Approved in Open Approvals | Send notification to Kerry (summary of what was approved) | Approval Queue | High |
| AT-02 | Record updated | Kerry Decision = Rejected | Send notification | Approval Queue | High |
| AT-03 | Record updated | Bid Approval Status = Approved in Pricing Summary | Create record in LOI Tracker | Deal Pipeline | High |
| AT-04 | Record updated | Diligence Auth = checked in LOI Tracker | Create URGENT approval record in Approval Queue | Deal Pipeline | High |
| AT-05 | Record updated | Wire Auth Status = Approved in Closing Tracker | Create URGENT approval in Approval Queue (wire requires dual approval) | Deal Pipeline | High |
| AT-06 | Date reminder | Follow-Up Date = today | Send notification to assigned person | Seller CRM | Medium |
| AT-07 | Date reminder | Bid Deadline = 3 days from now | Send notification to Kerry: "URGENT — bid deadline in 3 days" | Deal Pipeline | High |
| AT-08 | Record created | Priority = URGENT in Approval Queue | Send email notification to Kerry immediately | Approval Queue | High |
| AT-09 | Record updated | Status = Complete in Human Task Queue | Send confirmation to assigned person | Task Management | Low |
| AT-10 | Date reminder | LOI Expiration = 2 days from now | Send notification to Kerry | Deal Pipeline | Medium |

---

## Zapier Automations (Phase I — connects Airtable to Slack)

These require Zapier and the Slack connection already in place.

| # | Trigger (Airtable) | Action (Slack) | Channel | Priority |
|---|---|---|---|---|
| ZAP-01 | New record created in Tape Log | Send Slack message: "New tape received from [Seller] — [Loan Count] loans, $[Total UPB] UPB. Status: Received." | #team-notifications | High |
| ZAP-02 | Status updated in Tape Log → "Pricing" | Send Slack message: "Tape [Tape ID] is ready for bid review. Deadline: [Bid Deadline]." | #team-notifications | High |
| ZAP-03 | Go/No-Bid updated in Tape Log | Send Slack message: "Kerry marked [Tape ID] as [Go/No-Bid]." | #team-notifications | High |
| ZAP-04 | New record in Approval Queue | Send Slack message: "Approval needed: [Approval Type] — [Item Description]. Priority: [Priority]." | #team-notifications | High |
| ZAP-05 | Kerry Decision updated in Approval Queue | Send Slack message: "Kerry [Approved/Rejected]: [Item Description]." | #team-notifications | Medium |
| ZAP-06 | New record in Seller Communication Log with Follow-Up Required = true | Send Slack message: "Follow-up needed with [Seller] by [Follow-Up Date]." | #team-notifications | Medium |
| ZAP-07 | New record in Human Task Queue with Priority = URGENT | Send Slack DM to assigned person | Direct message | High |
| ZAP-08 | Bid Approval Status → Approved in Pricing Summary | Send Slack message: "Bid approved for [Tape]. Approved amount: $[Approved Bid]. Ready to send LOI." | #team-notifications | High |
| ZAP-09 | Outcome updated in LOI Tracker → Accepted | Send Slack message: "LOI ACCEPTED — [Tape ID]. Waiting for diligence authorization from Kerry." | #team-notifications | High |
| ZAP-10 | Wire Auth Status → Confirmed in Closing Tracker | Send Slack message: "Wire confirmed for [Tape ID]. Boarding in progress." | #team-notifications | High |

---

## Phase II Automations (n8n — not yet)

These replace Zapier zaps with more complex logic once n8n is running:

| # | Description |
|---|---|
| N8N-01 | Agent session complete → create/update Airtable record + send Slack summary |
| N8N-02 | Kerry approves in Airtable → write decision back to Supabase → trigger downstream workflow |
| N8N-03 | Loan payment status changes → recalculate health score → update watch list |
| N8N-04 | Monthly portfolio review → update all loan records + generate cashflow report |
| N8N-05 | Daily 6 AM CT → Agent 01 briefing: pull all open approvals + active tapes + exceptions → send to Kerry |

---

## Build Order for Automations

1. Build Airtable-native: AT-08 first (URGENT approval notification) — Kerry must always know immediately
2. Build Airtable-native: AT-01, AT-02 (approval outcome notifications)
3. Build Airtable-native: AT-07 (bid deadline alert)
4. Build Zapier: ZAP-01 (new tape alert to Slack)
5. Build Zapier: ZAP-04 (approval needed alert to Slack)
6. Build remaining in priority order
