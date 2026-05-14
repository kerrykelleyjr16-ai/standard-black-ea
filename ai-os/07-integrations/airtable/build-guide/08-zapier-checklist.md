# Zapier Phase I Connection Checklist
## Only start this after all 7 Airtable tables are built and verified

---

## Pre-Zapier Requirements

Confirm every box before opening Zapier:

- [ ] All 7 tables built in Airtable (Companies, Contacts, Deals, Tasks, Documents, Investors, Automations)
- [ ] Airtable Team plan active (free plan does not support Zapier integration for all features)
- [ ] Zapier account active at zapier.com
- [ ] Slack already connected in Zapier (confirmed from prior session — channel #team-notifications ID: C0B1Z4HA3C6)
- [ ] All 7 Phase I automations registered in the Airtable Automations table with Status = Planned

---

## Step 1: Connect Airtable to Zapier

1. Go to zapier.com → My Apps
2. Click "Add connection" → Search "Airtable"
3. Connect your Airtable account (grant access)
4. Select workspace: Standard Black Operations
5. Confirm the connection shows: Airtable ✓

---

## Step 2: Build Each Zap (in order)

Build one Zap at a time. Test before moving to the next. Do not build all 7 and then test — you will not know which one is broken.

### ZAP-01: New Deal → Slack Alert

1. Trigger: Airtable — "New Record"
   - Base: Command Center
   - Table: Deals
   - View: All Deals
2. Action: Slack — "Send Channel Message"
   - Channel: #team-notifications
   - Message:
     ```
     New deal intake.
     Deal: [Deal Name]
     Type: [Note Type]
     UPB: $[UPB]
     Priority: [Priority]
     Owner: [Assigned Owner]
     ```
3. Name the Zap: `SB-ZAP-01-NEW-DEAL-ALERT`
4. Test: Create a test deal → check Slack → confirm message appears
5. Activate
6. Update Airtable Automations table: ZAP-01 Status → Active, Last Tested → today

---

### ZAP-02: Deal Status → Pricing → Alert

1. Trigger: Airtable — "Updated Record"
   - Table: Deals
   - Field to watch: Status
   - Filter: Status = "Pricing"
2. Action: Slack — "Send Channel Message"
   - Message:
     ```
     Deal ready for bid review.
     Deal: [Deal Name]
     Bid Deadline: [Bid Deadline]
     Deadline Alert: [Deadline Alert]
     ```
3. Name: `SB-ZAP-02-BID-REVIEW-ALERT`
4. Test: Change a deal's status to Pricing → confirm Slack fires
5. Activate → update registry

---

### ZAP-03: Approval Status → Pending → Notify

1. Trigger: Airtable — "Updated Record"
   - Table: Deals
   - Field: Approval Status = "Pending"
2. Action: Slack — "Send Channel Message"
   - Message:
     ```
     APPROVAL NEEDED
     Deal: [Deal Name]
     Status: [Status]
     Priority: [Priority]
     Action: Review and approve in Airtable.
     ```
3. Name: `SB-ZAP-03-APPROVAL-NEEDED`
4. Test → Activate → update registry

---

### ZAP-04: Deal Status Change → Team Update

1. Trigger: Airtable — "Updated Record"
   - Table: Deals
   - Field: Status
2. Add a Filter step in Zapier:
   - Only continue if Status is one of: Underwriting, Pricing, LOI Sent, Closing, Closed-Won, Rejected
3. Action: Slack — "Send Channel Message"
   - Message:
     ```
     Deal update.
     [Deal Name] is now: [Status]
     Owner: [Assigned Owner]
     Next action: [Next Action] by [Next Action Date]
     ```
4. Name: `SB-ZAP-04-DEAL-STATUS-UPDATE`
5. Test → Activate → update registry

---

### ZAP-05: New Contact → Create Follow-Up Task

1. Trigger: Airtable — "New Record"
   - Table: Contacts
2. Action: Airtable — "Create Record"
   - Table: Tasks
   - Fields to map:
     - Task Name: "Initial follow-up: [Full Name]"
     - Department: Acquisitions
     - Owner: Kerry
     - Priority: Normal
     - Status: Not Started
     - Due Date: [use Zapier date formula: today + 3 days]
3. Name: `SB-ZAP-05-NEW-CONTACT-TASK`
4. Test → Activate → update registry

---

### ZAP-06: Task Overdue → Slack Alert

1. Trigger: Airtable — "New Record in View"
   - Table: Tasks
   - View: Overdue (the view you built that filters Days Until Due < 0)
   - Note: This Zap fires when a record first appears in the Overdue view
2. Action: Slack — "Send Channel Message"
   - Message:
     ```
     Overdue task.
     Task: [Task Name]
     Owner: [Owner]
     Due: [Due Date]
     Related: [Related Deal]
     ```
3. Name: `SB-ZAP-06-OVERDUE-TASK-ALERT`
4. Test → Activate → update registry

---

### ZAP-07: Deal Approved → Create DD Checklist

1. Trigger: Airtable — "Updated Record"
   - Table: Deals
   - Field: Approval Status = "Approved"
2. Action: Airtable — "Create Record" (you will need to run this action 8 times with Zapier's multi-step Zap feature, or create 8 separate Zaps — recommend creating 8 separate Zaps named ZAP-07a through ZAP-07h)
   - One task per DD item:
     - Title search ordered (due: +3 days)
     - Tax lien search (due: +3 days)
     - HOA status verified (due: +5 days)
     - BPO ordered (due: +5 days)
     - Collateral file reviewed (due: +7 days)
     - Legal enforceability confirmed (due: +7 days)
     - State foreclosure timeline confirmed (due: +7 days)
     - IC memo final review (due: +10 days)
3. Name: `SB-ZAP-07-DD-CHECKLIST`
4. Test with a test deal marked Approved → confirm 8 tasks appear in Tasks table
5. Activate → update all 8 sub-zaps in the registry

---

## After All 7 Zaps Are Active

- [ ] ZAP-01 active and tested
- [ ] ZAP-02 active and tested
- [ ] ZAP-03 active and tested
- [ ] ZAP-04 active and tested
- [ ] ZAP-05 active and tested
- [ ] ZAP-06 active and tested
- [ ] ZAP-07 active and tested
- [ ] All 7 automation records in Airtable updated to Status = Active
- [ ] Last Tested dates filled in for all 7

**Done? Open `09-test-records-checklist.md`**
