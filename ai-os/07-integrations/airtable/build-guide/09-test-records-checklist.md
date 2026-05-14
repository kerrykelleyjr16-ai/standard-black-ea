# Test Records Checklist
## Verify the full system works end-to-end before using it for real deals

---

## Purpose
Run through a simulated deal from intake to approval. Confirm every table, view, formula, link, and Zapier trigger works correctly. Delete all test records when done.

---

## Test 1: Company → Contact → Deal Chain

**Step 1:** Create a test company
- Company Name: TEST COMPANY — DELETE
- Company Type: Seller
- Relationship Status: Active

**Step 2:** Create a test contact linked to that company
- Full Name: TEST CONTACT — DELETE
- Company: TEST COMPANY — DELETE (select from dropdown)
- Contact Type: Seller
- Next Follow-Up Date: yesterday's date

**Verify:**
- [ ] Company field in Contacts shows "TEST COMPANY — DELETE"
- [ ] Follow-Up Due view in Contacts shows this record (because follow-up date is in the past)

**Step 3:** Create a test deal linked to that contact
- Deal Name: TEST DEAL — DELETE
- Seller/Source: TEST CONTACT — DELETE
- Status: New Intake
- Priority: High
- UPB: 500000
- Purchase Price: 300000
- Property Value: 600000
- Bid Deadline: 5 days from today
- Assigned Owner: Kerry

**Verify:**
- [ ] Seller/Source field shows "TEST CONTACT — DELETE"
- [ ] LTV formula calculates: 300000/600000 = 50%
- [ ] Days to Deadline shows approximately 5
- [ ] Deadline Alert shows "This Week"
- [ ] Active Pipeline view shows this deal
- [ ] New Intake view shows this deal

---

## Test 2: Zapier Triggers

**Test ZAP-01:** The test deal you just created should have already triggered a Slack message.
- [ ] Check #team-notifications in Slack — did the new deal alert appear?
- [ ] Message contains the correct deal name, UPB, and owner?

**Test ZAP-03:** Update the test deal's Approval Status to "Pending"
- [ ] Check Slack — did the approval needed alert appear?

**Test ZAP-04:** Update the test deal's Status to "Underwriting"
- [ ] Check Slack — did the deal status update alert appear?

---

## Test 3: Task Creation

**Step 1:** Create a test task
- Task Name: TEST TASK — DELETE
- Related Deal: TEST DEAL — DELETE
- Owner: Kerry
- Priority: URGENT
- Status: Not Started
- Due Date: yesterday's date

**Verify:**
- [ ] Related Deal field shows the test deal
- [ ] Days Until Due shows a negative number
- [ ] Kerry's Queue view shows this task
- [ ] Overdue view shows this task (due date is yesterday)
- [ ] Overdue view colors the row red

**Test ZAP-06:** The overdue task should trigger a Slack alert (may take up to 15 minutes)
- [ ] Check Slack — did the overdue task alert appear?

---

## Test 4: Document Registry

Create a test document:
- Document Name: TEST DOCUMENT — DELETE
- Document Type: IC Memo
- Related Deal: TEST DEAL — DELETE
- Storage Location: Google Drive
- Status: Draft

**Verify:**
- [ ] Related Deal links correctly
- [ ] By Deal view groups this document under the test deal

---

## Test 5: Approval Workflow

Update the test deal:
- Approval Status: Approved

**If ZAP-07 is active:**
- [ ] Check Tasks table — did 8 DD checklist tasks get created linked to the test deal?

---

## Test 6: View Validation

Check each view in each table for correct behavior:

**Deals:**
- [ ] Active Pipeline: shows test deal (status not Closed/Rejected)
- [ ] New Intake: shows test deal (status = New Intake) — if you moved it to Underwriting for test, update back
- [ ] Deadline Watch: shows test deal (deadline within 7 days)
- [ ] Rejected: does NOT show test deal

**Contacts:**
- [ ] Follow-Up Due: shows TEST CONTACT (past follow-up date)
- [ ] Active Sellers: shows TEST CONTACT (seller type, not inactive)

**Tasks:**
- [ ] Kerry's Queue: shows TEST TASK
- [ ] Overdue: shows TEST TASK
- [ ] Due Today: may or may not show (depends on due date you set)

---

## Cleanup: Delete All Test Records

After all tests pass, delete in this order:
1. Delete test tasks (including any auto-created DD tasks)
2. Delete test document
3. Delete test deal
4. Delete test contact
5. Delete test company

**Verify after cleanup:**
- [ ] All views are empty or show only real records
- [ ] No broken linked records remain

---

## Final Verification

- [ ] All 7 tables have correct field counts
- [ ] All formulas calculate correctly
- [ ] All linked record fields connect to the correct tables
- [ ] All Zapier triggers fired during testing
- [ ] All views filter and sort correctly
- [ ] All test records deleted
- [ ] No orphaned records remain

**Done? Open `10-permissions-checklist.md`**
