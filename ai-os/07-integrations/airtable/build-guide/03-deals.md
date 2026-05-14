# Table 3: Deals
## Requires: Companies + Contacts must be complete first

---

## Purpose
The core of the operation. Every tape, note, or acquisition opportunity lives here from first receipt through close. This is the table you will live in daily during active deal flow.

---

## How to Set Up

Click **+** next to Contacts tab → Add a table → Name it: **Deals**

---

## Fields — Build in This Exact Order

### Field 1: Deal Name
- **Type:** Single line text
- **Primary field** — rename default "Name" to "Deal Name"
- Format: "[Seller Name] — [Brief Description]" (e.g., "Evans Portfolio Q2-2026")

### Field 2: Seller / Source
- **Type:** Linked to another record
- **Link to table:** Contacts
- Allow multiple records: **No** (one primary seller/source per deal)

### Field 3: Company
- **Type:** Linked to another record
- **Link to table:** Companies
- Allow multiple: **No**

### Field 4: Asset Type
- **Type:** Single select
- **Options:**
  - Residential
  - Commercial
  - Land
  - Mixed

### Field 5: Note Type
- **Type:** Single select
- **Options:**
  - Performing
  - Reperforming
  - NPL
  - REO
  - Mixed

### Field 6: Status
- **Type:** Single select
- **Options (in pipeline order):**
  - New Intake
  - Screening
  - Underwriting
  - Pricing
  - LOI Sent
  - Diligence
  - Closing
  - Closed-Won
  - Rejected
  - On Hold

### Field 7: Priority
- **Type:** Single select
- **Options:**
  - URGENT
  - High
  - Normal
  - Low

### Field 8: Go / No-Bid
- **Type:** Single select
- **Options:**
  - Go
  - No-Bid
  - Conditional Go
  - Pending

### Field 9: UPB
- **Type:** Currency
- Symbol: $
- Precision: 0 (no cents needed at this level)

### Field 10: Purchase Price
- **Type:** Currency
- Symbol: $
- Precision: 0

### Field 11: Property Value
- **Type:** Currency
- Symbol: $
- Precision: 0
- Notes: BPO or AVM value

### Field 12: LTV
- **Type:** Formula
- **Formula:**
```
IF({Property Value} > 0, {Purchase Price} / {Property Value}, 0)
```
- Format the field as Percent after creating it (click the field → Format → Percent)

### Field 13: Yield Target
- **Type:** Percent
- Precision: 1 decimal

### Field 14: IRR Target
- **Type:** Percent
- Precision: 1 decimal

### Field 15: Loan Count
- **Type:** Number
- Precision: Integer

### Field 16: State
- **Type:** Single line text

### Field 17: County
- **Type:** Single line text

### Field 18: Borrower Status
- **Type:** Single select
- **Options:**
  - Paying
  - Reperforming
  - Non-Paying
  - Bankruptcy
  - Unknown

### Field 19: Payment Status
- **Type:** Single select
- **Options:**
  - Current
  - 30 Days
  - 60 Days
  - 90 Days
  - 120+ Days
  - Bankruptcy
  - Foreclosure
  - REO

### Field 20: Due Diligence Status
- **Type:** Single select
- **Options:**
  - Not Started
  - In Progress
  - Clear
  - Exceptions Found
  - Blocked

### Field 21: Assigned Owner
- **Type:** Single select
- **Options:**
  - Kerry
  - Kody
  - TJ

### Field 22: Next Action
- **Type:** Single line text
- Brief description of what happens next (e.g., "Order BPO", "Send LOI", "Await seller response")

### Field 23: Next Action Date
- **Type:** Date
- Format: M/D/YYYY

### Field 24: Bid Deadline
- **Type:** Date
- Format: M/D/YYYY

### Field 25: Days to Deadline
- **Type:** Formula
- **Formula:**
```
IF({Bid Deadline} = BLANK(), "", DATETIME_DIFF({Bid Deadline}, TODAY(), 'days'))
```

### Field 26: Deadline Alert
- **Type:** Formula
- **Formula:**
```
IF({Bid Deadline} = BLANK(), "", IF({Days to Deadline} <= 3, "URGENT", IF({Days to Deadline} <= 7, "This Week", "OK")))
```

### Field 27: Approval Status
- **Type:** Single select
- **Options:**
  - Not Required
  - Pending
  - Approved
  - Rejected

### Field 28: Risk Score
- **Type:** Single select
- **Options:**
  - Low
  - Medium
  - High
  - Critical

### Field 29: AI Health Score
- **Type:** Number
- Precision: Integer
- Range: 0–100 (from underwriting skill output)

### Field 30: Drive Link
- **Type:** URL
- Link to the Google Drive folder for this deal's documents

### Field 31: IC Memo
- **Type:** Long text
- Enable rich text: Yes
- Paste the IC memo output from the note-investing-underwriter skill here

### Field 32: Notes
- **Type:** Long text

### Field 33: Date Received
- **Type:** Created time

---

## Views — Create These 10 Views

**View 1: All Deals** (rename the default)
- No filter, Sort: Date Received DESC

**View 2: New Intake**
- Filter: Status = New Intake

**View 3: Active Pipeline**
- Filter: Status not in [Closed-Won, Rejected, On Hold]
- Sort: Days to Deadline ASC

**View 4: Deadline Watch**
- Filter: Bid Deadline is not empty AND Days to Deadline ≤ 7
- Sort: Days to Deadline ASC
- Color: Red rows where Days to Deadline ≤ 3

**View 5: Bid Decisions Needed**
- Filter: Go/No-Bid = Pending AND Status = Pricing

**View 6: Approved Deals**
- Filter: Approval Status = Approved

**View 7: Closing Pipeline**
- Filter: Status = Closing
- Sort: Bid Deadline ASC

**View 8: Closed-Won (Owned Notes)**
- Filter: Status = Closed-Won
- Sort: Date Received DESC

**View 9: Rejected**
- Filter: Status = Rejected OR Go/No-Bid = No-Bid

**View 10: By State**
- No filter
- Group by: State

---

## First 3 Sample Records

**Record 1 — Performing tape currently screening**

| Field | Value |
|---|---|
| Deal Name | Evans Portfolio Q2-2026 |
| Seller / Source | Marcus Evans |
| Company | Evans Note Group |
| Asset Type | Residential |
| Note Type | Performing |
| Status | Screening |
| Priority | High |
| Go / No-Bid | Pending |
| UPB | $1,250,000 |
| Loan Count | 12 |
| State | LA |
| Assigned Owner | Kerry |
| Next Action | Run tape through underwriting skill |
| Next Action Date | [3 days from today] |
| Bid Deadline | [10 days from today] |

**Record 2 — NPL deal under review**

| Field | Value |
|---|---|
| Deal Name | Baton Rouge NPL — 3 Assets |
| Note Type | NPL |
| Status | Underwriting |
| Priority | Normal |
| UPB | $186,000 |
| Loan Count | 3 |
| State | LA |
| Assigned Owner | Kerry |
| Risk Score | High |
| Next Action | Complete IC memo |

**Record 3 — Rejected tape (for history)**

| Field | Value |
|---|---|
| Deal Name | Metro Portfolio — Pass |
| Note Type | Mixed |
| Status | Rejected |
| Go / No-Bid | No-Bid |
| UPB | $2,100,000 |
| Loan Count | 24 |
| State | MS |
| Notes | Data quality too low. 40% of loans missing payment history. |

---

## Common Mistakes to Avoid

- **LTV formula will show 0 if Property Value is empty** — that is correct. Enter a BPO/AVM value and it calculates automatically
- **Do not manually type a company or contact** in the linked fields — always select from the dropdown
- **Status and Go/No-Bid are separate** — a deal can be in "Pricing" status with Go/No-Bid still "Pending" if Kerry hasn't made a decision yet
- **Deadline Alert will be blank if no Bid Deadline is set** — that is correct
- **IC Memo field is for pasting content, not uploading files** — use Drive Link for the actual file

---

## Completion Checklist

- [ ] Table named "Deals"
- [ ] All 33 fields created in order
- [ ] All single select fields have correct options
- [ ] Seller/Source links to Contacts table (test: click the field, Marcus Evans should appear)
- [ ] Company links to Companies table (Evans Note Group should appear)
- [ ] LTV formula calculates correctly (test: enter 100000 Purchase Price, 200000 Property Value → should show 50%)
- [ ] Days to Deadline formula works (test: enter a date 5 days from now → should show 5)
- [ ] Deadline Alert shows "This Week" for a deadline 5 days away, "URGENT" for 2 days away
- [ ] All 10 views created
- [ ] 3 sample records entered
- [ ] Active Pipeline view shows only the 2 active deals (not the rejected one)

**Done? Go back to Contacts and add the "Linked Deals" field:**
- In Contacts table, add new field: **Linked Deals**
- Type: Linked to another record → Deals
- Allow multiple: Yes

**Then open `04-tasks.md`**
