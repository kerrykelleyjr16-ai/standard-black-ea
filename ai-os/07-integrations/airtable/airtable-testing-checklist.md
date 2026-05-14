# Airtable Testing Checklist
# Verify the build works before going live

---

## Pre-Launch Checklist (Complete before first real deal enters Airtable)

### Workspace Setup
- [ ] Workspace created: "Pinnacle Note Fund Operations"
- [ ] Kerry has Owner access
- [ ] Kody has Creator access on approved bases
- [ ] TJ has Commenter access on approved bases
- [ ] No public view links enabled
- [ ] "Anyone with link" sharing disabled workspace-wide

### Base 1: Deal Pipeline
- [ ] Tape Log table built with all 17 fields
- [ ] Pricing Summary table built
- [ ] LOI Tracker table built
- [ ] Closing Tracker table built
- [ ] All 4 views created in Tape Log (Active, Bid Decisions, Deadline Watch, All)
- [ ] Formula: Days to Deadline returns correct number
- [ ] Formula: Deadline Alert shows "URGENT" when ≤ 3 days
- [ ] Seller field in Tape Log links correctly to Seller CRM
- [ ] Test record created, reviewed, deleted

### Base 2: Seller CRM
- [ ] Sellers table built with all 16 fields
- [ ] Tape History table built
- [ ] Communication Log table built
- [ ] Rollup fields in Sellers pull correctly from Tape History
- [ ] All 3 views created in Sellers (Active, Follow-Up Due, All)
- [ ] Test seller record created, linked to test tape, deleted

### Base 3: Approval Queue
- [ ] Open Approvals table built with all fields
- [ ] Completed Approvals table built
- [ ] Action Required Today view works (shows only Pending decisions)
- [ ] URGENT view filters correctly
- [ ] Test approval created and Kerry Decision updated — record updates correctly

### Base 4: Task Management
- [ ] Human Task Queue built with all fields
- [ ] Kerry's Queue view filters correctly to Kerry's open tasks
- [ ] Kody's Queue and TJ's Queue views work
- [ ] URGENT task view works
- [ ] Overdue formula works (Days Until Due goes negative for past dates)
- [ ] Agent Sessions table created (even if empty for now)

---

## Airtable-Native Automation Tests

For each automation, create a test record that triggers it, verify the action fires, then delete the test record.

- [ ] AT-08: Create URGENT approval → verify notification fires immediately
- [ ] AT-01: Set Kerry Decision = Approved → verify notification fires
- [ ] AT-07: Set Bid Deadline = 3 days from today → verify reminder fires
- [ ] AT-06: Set Follow-Up Date = today in Communication Log → verify notification fires
- [ ] AT-04: Check Diligence Auth → verify Approval Queue record is created

---

## Zapier Integration Tests

For each Zap, test before activating:

- [ ] ZAP-01: Create new Tape Log record → Slack message appears in #team-notifications within 2 minutes
- [ ] ZAP-02: Update Tape Log Status to "Pricing" → Slack alert fires
- [ ] ZAP-03: Create new Approval Queue record → Slack alert fires with correct fields
- [ ] ZAP-04: Update Kerry Decision in Approval Queue → Slack confirmation fires
- [ ] ZAP-05: Update LOI Seller Response to "Accepted" → Slack alert fires
- [ ] ZAP-07: Create URGENT task in Human Queue → Slack DM fires to correct person

**Test protocol for each Zap:**
1. Create test record in Airtable
2. Check Zapier task history — confirm trigger fired
3. Check Slack — confirm message appears with correct data
4. Delete test record from Airtable
5. Confirm Zap status = On in Zapier
6. Log activation in `ai-os/AUTOMATION_REGISTRY.md`

---

## Data Integrity Tests

- [ ] Link from Tape Log → Seller CRM works (tap Seller field, correct seller appears)
- [ ] Link from Tape History → Tape Log works
- [ ] Link from LOI Tracker → Tape Log works
- [ ] Rollup in Sellers (Total Tapes Received) counts correctly after adding Tape History records
- [ ] Currency fields display in USD format
- [ ] Date fields accept dates correctly and formula fields update on the same day

---

## Live Deal Test (First Real Tape)

When the first real tape arrives, run through this flow in Airtable:

1. [ ] Create Seller record in Seller CRM (if new seller)
2. [ ] Create Tape Log record in Deal Pipeline
3. [ ] Confirm Slack alert fires (ZAP-01)
4. [ ] Run note-investing-underwriter skill → paste IC memo into Tape Log
5. [ ] Create Pricing Summary record linked to tape
6. [ ] Set Bid Approval Status = Pending Review
7. [ ] Kerry reviews and updates Approved Bid + Bid Approval Status
8. [ ] Confirm Slack alert fires (ZAP-02)
9. [ ] If Go: Create LOI Tracker record
10. [ ] Create Approval Queue record for LOI authorization
11. [ ] Confirm Slack alert fires (ZAP-03)
12. [ ] Kerry approves in Approval Queue
13. [ ] Confirm Slack confirmation fires (ZAP-04)
14. [ ] Add Communication Log entry for seller contact

---

## Go/No-Go Criteria

Do not use Airtable for real deal tracking until:
- [ ] All Phase I tables are built
- [ ] All Airtable-native automations are live and tested
- [ ] ZAP-01, ZAP-03, and ZAP-04 are live and confirmed
- [ ] Kerry, Kody, and TJ all have access with correct permission levels
- [ ] Test deal has been run through the full flow above
