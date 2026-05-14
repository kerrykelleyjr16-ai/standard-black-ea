# Table 6: Investors / Capital Sources
## Requires: Companies + Deals must be complete first

---

## Purpose
Your LP pipeline and capital-raising relationships. Build this now even though Fund I isn't launched yet — you want to be tracking relationships and conversations before you need the capital. When you're ready to raise, this table is already populated and organized.

---

## How to Set Up

Click **+** → Add a table → Name it: **Investors**

---

## Fields — Build in This Exact Order

### Field 1: Name
- **Type:** Single line text
- **Primary field** — rename default "Name" to "Name"

### Field 2: Investor Type
- **Type:** Single select
- **Options:**
  - Individual
  - Family Office
  - Self-Directed IRA
  - Trust
  - LLC
  - LP
  - Fund of Funds
  - Corporate
  - Other

### Field 3: Company
- **Type:** Linked to another record
- **Link to table:** Companies
- Allow multiple: **No**

### Field 4: Email
- **Type:** Email

### Field 5: Phone
- **Type:** Phone

### Field 6: State
- **Type:** Single line text

### Field 7: Accredited Status
- **Type:** Single select
- **Options:**
  - Verified Accredited
  - Pending Verification
  - Not Verified
  - Not Applicable

### Field 8: Relationship Stage
- **Type:** Single select
- **Options (in pipeline order):**
  - Prospect
  - Intro Made
  - Call Completed
  - Deck Sent
  - Interest Confirmed
  - Soft Commit
  - Docs Sent
  - Funded
  - Inactive

### Field 9: Target Investment Size
- **Type:** Currency
- Symbol: $
- Precision: 0

### Field 10: Source
- **Type:** Single line text
- How this person entered the network (referral, event, LinkedIn, etc.)

### Field 11: Referred By
- **Type:** Single line text

### Field 12: Last Contact Date
- **Type:** Date
- Format: M/D/YYYY

### Field 13: Next Follow-Up Date
- **Type:** Date
- Format: M/D/YYYY

### Field 14: Days Until Follow-Up
- **Type:** Formula
- **Formula:**
```
IF({Next Follow-Up Date} = BLANK(), "", DATETIME_DIFF({Next Follow-Up Date}, TODAY(), 'days'))
```

### Field 15: Linked Deals
- **Type:** Linked to another record
- **Link to table:** Deals
- Allow multiple: **Yes**

### Field 16: Committed Amount
- **Type:** Currency
- Symbol: $
- Precision: 0
- Leave blank until a soft commit is received

### Field 17: Funded Amount
- **Type:** Currency
- Symbol: $
- Precision: 0
- Leave blank until capital is actually received

### Field 18: Notes
- **Type:** Long text
- Kerry's relationship notes. What do they care about? What questions did they ask? What are their concerns?

### Field 19: Date Added
- **Type:** Created time

---

## Views — Create These 5 Views

**View 1: All Investors** (rename the default)
- No filter
- Sort: Relationship Stage, then Name

**View 2: Active Pipeline**
- Filter: Relationship Stage not in [Funded, Inactive]
- Sort: Target Investment Size DESC

**View 3: Soft Commits**
- Filter: Relationship Stage = Soft Commit

**View 4: Follow-Up Due**
- Filter: Next Follow-Up Date ≤ today
- Sort: Days Until Follow-Up ASC
- Color: Red if Days Until Follow-Up < 0

**View 5: Funded**
- Filter: Relationship Stage = Funded
- Sort: Funded Amount DESC

---

## First 3 Sample Records

These are placeholders — Kerry fills in real names when relationships develop. Use placeholder names for now.

**Record 1 — Prospect (no contact yet)**

| Field | Value |
|---|---|
| Name | [LP Prospect 1] |
| Investor Type | Individual |
| Relationship Stage | Prospect |
| Target Investment Size | $50,000 |
| Source | Kerry's network |
| Notes | Placeholder. Add real contact when identified. |

**Record 2 — Someone Kerry has spoken with**

| Field | Value |
|---|---|
| Name | [Contact from network] |
| Investor Type | Self-Directed IRA |
| Relationship Stage | Intro Made |
| Target Investment Size | $25,000 |
| Source | Referral |
| Notes | Interested in passive income. Wants to understand the note fund model first. |
| Next Follow-Up Date | [2 weeks from today] |

**Record 3 — Inactive (for table health)**

| Field | Value |
|---|---|
| Name | [Past Contact] |
| Investor Type | Individual |
| Relationship Stage | Inactive |
| Notes | No longer interested. Keep for history. Do not reach out. |

---

## Common Mistakes to Avoid

- **Do not enter real names in this table until you're ready to track them** — this table is sensitive. Placeholder records are fine for now
- **Committed Amount ≠ Funded Amount** — a soft commit is not money in the bank. Track them separately
- **Accredited status must be verified** — do not mark anyone as Verified Accredited without going through the proper verification process. Legal requirement for fund raises
- **This table is confidential** — Kody and TJ should not have access to this table. Set permissions accordingly after the build

---

## Permission Note

When you complete the full build and set permissions:
- Kerry: Full access
- Kody: No access to Investors table
- TJ: No access to Investors table

---

## Completion Checklist

- [ ] Table named "Investors"
- [ ] All 19 fields created
- [ ] Investor Type has all 9 options
- [ ] Relationship Stage has all 9 options in pipeline order
- [ ] Accredited Status has all 4 options
- [ ] Company links to Companies table
- [ ] Linked Deals links to Deals (allows multiple)
- [ ] Days Until Follow-Up formula works
- [ ] All 5 views created
- [ ] 3 placeholder records entered
- [ ] Follow-Up Due view works correctly

**Done? Open `07-automations.md`**
