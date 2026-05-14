# Airtable → Zapier Trigger Specifications
# Phase I: Zapier as the automation bridge (pre-n8n)

---

## Prerequisites

- Airtable Team plan (required for Zapier integration)
- Zapier account with Airtable + Slack apps connected
- Slack channel: #team-notifications (ID: C0B1Z4HA3C6)
- Airtable workspace: Pinnacle Note Fund Operations

---

## How to Build Each Zap

For each Zap below:
1. Go to zapier.com → Create Zap
2. Trigger: Airtable
3. Event: New Record OR Updated Record (specified per Zap)
4. App: Airtable → Select workspace → Select base → Select table → Set filter
5. Action: Slack → Send Channel Message
6. Channel: #team-notifications OR Direct Message as specified
7. Test and activate

---

## ZAP-01: New Tape Received

**Trigger:**
- App: Airtable
- Event: New Record in View
- Base: Deal Pipeline
- Table: Tape Log
- View: All Tapes

**Action:**
- App: Slack
- Event: Send Channel Message
- Channel: #team-notifications
- Message:
```
🗂 New tape received.
Seller: [Seller]
Loans: [Loan Count]
UPB: $[Total UPB]
Bid Deadline: [Bid Deadline]
Status: Received
```
*(Note: Do not add emojis to internal files — this Slack message format is for the Zap template only)*

**Activate after:** Tape Log table is built

---

## ZAP-02: Tape Ready for Bid Review

**Trigger:**
- App: Airtable
- Event: Updated Record
- Base: Deal Pipeline
- Table: Tape Log
- Filter: Status = "Pricing"

**Action:**
- Channel: #team-notifications
- Message:
```
Tape [Tape ID] is ready for bid review.
Bid Deadline: [Bid Deadline]
Days Remaining: [Days to Deadline]
Action needed: Review Pricing Summary and approve bid.
```

---

## ZAP-03: Approval Queue — New Approval Needed

**Trigger:**
- App: Airtable
- Event: New Record
- Base: Approval Queue
- Table: Open Approvals

**Action:**
- Channel: #team-notifications
- Message:
```
APPROVAL NEEDED
Type: [Approval Type]
Priority: [Priority]
Description: [Item Description]
Amount: $[Amount]
Requested by: [Requested By]
Expires: [Expires]
```
- If Priority = URGENT: Also send Direct Message to Kerry

---

## ZAP-04: Kerry Decision Made

**Trigger:**
- App: Airtable
- Event: Updated Record
- Base: Approval Queue
- Table: Open Approvals
- Filter: Kerry Decision is not empty (changed from Pending)

**Action:**
- Channel: #team-notifications
- Message:
```
Decision recorded.
[Kerry Decision]: [Item Description]
Type: [Approval Type]
[If Rejected: Rejection Reason]
```

---

## ZAP-05: LOI Accepted

**Trigger:**
- App: Airtable
- Event: Updated Record
- Base: Deal Pipeline
- Table: LOI Tracker
- Filter: Seller Response = "Accepted"

**Action:**
- Channel: #team-notifications
- Message:
```
LOI ACCEPTED — [LOI ID]
Tape: [Tape]
Seller: [Seller]
Amount: $[LOI Amount]
Next step: Kerry authorizes diligence in Airtable.
```

---

## ZAP-06: New Tape Go/No-Bid Decision

**Trigger:**
- App: Airtable
- Event: Updated Record
- Base: Deal Pipeline
- Table: Tape Log
- Filter: Go/No-Bid field is not empty

**Action:**
- Channel: #team-notifications
- Message:
```
Decision: [Tape ID] — [Go/No-Bid]
Seller: [Seller]
UPB: $[Total UPB]
```

---

## ZAP-07: URGENT Human Task Created

**Trigger:**
- App: Airtable
- Event: New Record
- Base: Task Management
- Table: Human Task Queue
- Filter: Priority = "URGENT"

**Action:**
- Slack: Direct Message to assigned person (Kerry / Kody / TJ)
- Message:
```
URGENT TASK: [Task Name]
Assigned to: [Assigned To]
Due: [Due Date]
Related: [Related Record]
```

---

## ZAP-08: Wire Confirmed

**Trigger:**
- App: Airtable
- Event: Updated Record
- Base: Deal Pipeline
- Table: Closing Tracker
- Filter: Wire Auth Status = "Confirmed"

**Action:**
- Channel: #team-notifications
- Message:
```
Wire confirmed.
Tape: [Tape]
Wire Date: [Wire Date]
Boarding Status: [Boarding Status]
```

---

## Zap Naming Convention

Name every Zap as: `SB-NOTE-[ZAP NUMBER]-[SHORT DESCRIPTION]`

Example: `SB-NOTE-ZAP01-NEW-TAPE-ALERT`

This keeps them organized when you have 20+ Zaps running.

---

## Testing Protocol

Before activating any Zap:
1. Create a test record in Airtable with dummy data
2. Run Zap manually ("Test trigger" in Zapier)
3. Confirm Slack message appears with correct fields
4. Delete test record from Airtable
5. Activate Zap
6. Log the activation in `ai-os/AUTOMATION_REGISTRY.md`
