# Zapier Phase I Automation Plan
# Standard Black — Pinnacle Note Fund Operations

**Phase:** I — Zapier only. No n8n. No Supabase.
**Tools:** Airtable + Zapier + Slack + Google Drive + Gmail
**Date:** 2026-05-09

---

## Design Rules

- All automations in Phase I use Zapier as the bridge
- No automation sends external emails or messages without Kerry's approval
- All automations touching money, legal docs, or investor data require human approval first
- Every active Zap is registered in Table E: Automations in Airtable
- n8n is documented in Phase II migration notes only — do not build yet

---

## Phase I Zaps (Build in Priority Order)

### ZAP-01: New Deal Intake → Slack Alert
**Priority:** High — Build first
**Trigger:** Airtable — New record in Deals table
**Action:** Slack — Send channel message to #team-notifications
**Message:**
```
New deal intake.
Name: [Deal Name]
Seller: [Seller/Source]
Note Type: [Note Type]
UPB: $[UPB]
Priority: [Priority]
Assigned to: [Assigned Owner]
```
**Approval required:** No
**Risk level:** Low

---

### ZAP-02: Follow-Up Date Reached → Slack Reminder
**Priority:** High
**Trigger:** Airtable — Scheduled (daily) — Check Contacts table where Next Follow-Up Date = today
**Action:** Slack — Send channel message to #team-notifications
**Message:**
```
Follow-up due today.
Contact: [Name]
Type: [Contact Type]
Last Contact: [Last Contact Date]
Action: Reach out and log the interaction.
```
**Approval required:** No
**Risk level:** Low

---

### ZAP-03: Deal Status → Needs Approval → Notify Kerry
**Priority:** High
**Trigger:** Airtable — Updated record in Deals table — Approval Status changes to "Pending"
**Action:** Slack — Send channel message to #team-notifications + DM to Kerry
**Message:**
```
APPROVAL NEEDED
Deal: [Deal Name]
Status: [Status]
Priority: [Priority]
Action: Review in Airtable Approval Queue.
```
**Approval required:** Yes — this Zap exists to surface that approval is needed
**Risk level:** Low

---

### ZAP-04: Deal Status Changes → Team Update
**Priority:** Medium
**Trigger:** Airtable — Updated record in Deals table — Status field changes
**Filter:** Only fire when Status changes to: Underwriting, Pricing, LOI Sent, Closing, Closed-Won, Rejected
**Action:** Slack — Send channel message to #team-notifications
**Message:**
```
Deal update.
[Deal Name] → [New Status]
Owner: [Assigned Owner]
Next action: [Next Action] by [Next Action Date]
```
**Approval required:** No
**Risk level:** Low

---

### ZAP-05: New Contact Added → Create Follow-Up Task
**Priority:** Medium
**Trigger:** Airtable — New record in Contacts table
**Action:** Airtable — Create record in Tasks table
**Task fields:**
- Task Name: "Initial follow-up: [Name]"
- Department: Acquisitions
- Owner: Kerry
- Priority: Normal
- Due Date: 3 days from today
- Related Contact: [linked]
- Notes: "New [Contact Type] added. Make first contact or confirm existing relationship."
**Approval required:** No
**Risk level:** Low

---

### ZAP-06: Task Overdue → Slack Alert
**Priority:** Medium
**Trigger:** Airtable — Scheduled (daily) — Tasks table where Days Until Due < 0 AND Status not in [Complete, Cancelled]
**Action:** Slack — Send channel message to #team-notifications
**Message:**
```
Overdue task.
Task: [Task Name]
Owner: [Owner]
Due: [Due Date]
Related: [Related Deal]
Status: [Status]
```
**Approval required:** No
**Risk level:** Low

---

### ZAP-07: New Document Uploaded to Drive → Link in Airtable
**Priority:** Medium — Build when Google Drive MCP is more actively used
**Trigger:** Google Drive — New file added to Real E. Note Docs. folder
**Action:** Airtable — Create record in Documents table
**Fields:**
- Document Name: [File name]
- Storage Location: Google Drive
- Drive Link: [File URL]
- Status: Draft
- Last Updated: today
**Approval required:** No
**Risk level:** Low

---

### ZAP-08: New Investor Added → Create Follow-Up Task
**Priority:** Low — Phase II when raising capital
**Trigger:** Airtable — New record in Investors table
**Action:** Airtable — Create record in Tasks table
**Task fields:**
- Task Name: "Investor outreach: [Name]"
- Department: Acquisitions
- Owner: Kerry
- Priority: High
- Due Date: 5 days from today
**Approval required:** No — task only, no outreach yet
**Risk level:** Low

---

### ZAP-09: Deal Approved → Create Due Diligence Checklist Tasks
**Priority:** High — Build before first deal goes to diligence
**Trigger:** Airtable — Updated record in Deals table — Approval Status changes to "Approved"
**Action:** Airtable — Create multiple records in Tasks table (one per DD item)

**DD checklist tasks to create:**
1. Title search ordered — Due: +3 days
2. Tax lien search — Due: +3 days
3. HOA status verified — Due: +5 days
4. Property valuation (BPO) ordered — Due: +5 days
5. Collateral file reviewed — Due: +7 days
6. Legal enforceability confirmed — Due: +7 days
7. State foreclosure timeline confirmed — Due: +7 days
8. IC memo final review — Due: +10 days

**Approval required:** No (tasks only, no external action)
**Risk level:** Low

---

## What Zapier Will NOT Automate in Phase I

These require human action before any automation is considered:
- Sending emails to sellers, investors, or attorneys
- Contacting any external party
- Moving money or initiating wires
- Signing or sending legal documents
- Publishing public content
- Sharing deal data externally
- Deleting records

---

## Phase II Migration Notes (n8n — Do Not Build Yet)

When deal volume or automation complexity justifies self-hosting:

| Phase I Zap | Phase II n8n Equivalent |
|---|---|
| ZAP-01: New deal → Slack | n8n: New deal → normalize data → create Supabase record → Slack |
| ZAP-03: Approval needed → notify | n8n: Approval trigger → Airtable + Supabase + Slack simultaneously |
| ZAP-09: Approved → DD tasks | n8n: Approval → conditional DD checklist based on note type and state |
| All Zaps | n8n: Replace Zapier entirely with self-hosted workflows for $0 per trigger |

**Migration trigger:** When Zapier costs exceed $50/month OR when 3+ multi-step workflows are needed simultaneously.
