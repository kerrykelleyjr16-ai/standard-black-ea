# Table 2: Contacts
## Requires: Companies table must be complete first

---

## Purpose
Every individual you work with — note sellers, brokers, servicers, attorneys, investors, and vendors. This is your relationship layer. Deals will link to contacts as the seller/source, so build this before Deals.

---

## How to Set Up

Click **+** next to the Companies tab at the bottom → Add a table → Name it: **Contacts**

---

## Fields — Build in This Exact Order

### Field 1: Full Name
- **Type:** Single line text
- **This is the primary field** — rename the default "Name" field to "Full Name"

### Field 2: Company
- **Type:** Linked to another record
- **Link to table:** Companies
- When prompted "Allow linking to multiple records?" → **No** (one company per contact)
- This pulls the Company Name from your Companies table

### Field 3: Role
- **Type:** Single line text
- Their title or function (e.g., "VP Acquisitions", "Managing Partner", "Loan Servicer")

### Field 4: Contact Type
- **Type:** Single select
- **Options:**
  - Seller
  - Broker
  - Servicer
  - Attorney
  - Investor
  - Title Officer
  - BPO Provider
  - Vendor
  - Team
  - Other

### Field 5: Email
- **Type:** Email
- No options

### Field 6: Phone
- **Type:** Phone
- No options

### Field 7: Relationship Strength
- **Type:** Single select
- **Options:**
  - Strong
  - Warm
  - Cold
  - New
  - Inactive

### Field 8: Source
- **Type:** Single line text
- How this contact came into the network (e.g., "PaperStac", "Referral — Marcus E.", "LinkedIn")

### Field 9: Last Contact Date
- **Type:** Date
- Date format: M/D/YYYY
- Include time field: No

### Field 10: Next Follow-Up Date
- **Type:** Date
- Date format: M/D/YYYY

### Field 11: Days Until Follow-Up
- **Type:** Formula
- **Formula:**
```
DATETIME_DIFF({Next Follow-Up Date}, TODAY(), 'days')
```
- This will show a negative number when the follow-up is overdue

### Field 12: State
- **Type:** Single line text
- State they operate in or are based in

### Field 13: Notes
- **Type:** Long text

### Field 14: Date Added
- **Type:** Created time

---

## Linked Record Field: After Deals Table is Built
Come back and add this field once Deals is complete:
- Field name: **Linked Deals**
- Type: Linked to another record → Deals
- Allow multiple: Yes

---

## Rollup Fields: After Deals Table is Built
Come back and add these once Deals is complete and linked:

**Total UPB Sourced**
- Type: Rollup
- Linked field: Linked Deals
- Rollup: SUM of UPB

**Closed Deals Count**
- Type: Rollup
- Linked field: Linked Deals
- Rollup: COUNT if Status = "Closed-Won"

---

## Views — Create These 4 Views

**View 1: All Contacts** (rename the default)
- No filter
- Sort: Full Name, A→Z

**View 2: By Type**
- No filter
- Group by: Contact Type

**View 3: Follow-Up Due**
- Filter: Next Follow-Up Date is on or before today
- Sort: Days Until Follow-Up, ascending (most overdue first)
- Color rows: Red if Days Until Follow-Up < 0

**View 4: Active Sellers**
- Filter: Contact Type = Seller AND Relationship Strength not = Inactive
- Sort: Last Contact Date, descending

---

## First 3 Sample Records

| Full Name | Company | Role | Contact Type | Email | Relationship Strength | State |
|---|---|---|---|---|---|---|
| Marcus Evans | Evans Note Group | Owner | Seller | marcus@evansnotegrp.com | Warm | LA |
| Sandra Chen | SN Servicing Corp | Account Manager | Servicer | s.chen@snserv.com | Active → Strong | TX |
| James Whitfield | Westlaw Foreclosure Group | Managing Attorney | Attorney | jw@westlawfc.com | Warm | TX |

*Note: Link each contact to their Company using the Company field — click in that field and select from your Companies list.*

---

## Common Mistakes to Avoid

- **Always link to the Companies table** before typing a company name — do not type a company name as plain text in the Company field
- **One contact per row** — do not combine two people into one record
- **Days Until Follow-Up goes negative** — that is correct and intentional; it means the follow-up is overdue
- **Do not set "Last Contact Date" for new contacts** — leave it blank until after the first actual interaction
- **Linked Deals field: wait until Deals table exists** — do not try to create it now or Airtable will create a new empty table

---

## Completion Checklist

- [ ] Table named "Contacts"
- [ ] 14 fields created in order
- [ ] Contact Type has all 10 options
- [ ] Relationship Strength has all 5 options
- [ ] Formula field (Days Until Follow-Up) shows correct number when a date is entered
- [ ] Company field links correctly to Companies table (click in the field — Companies should appear)
- [ ] 4 views created
- [ ] 3 sample records entered with Company links working
- [ ] Follow-Up Due view shows records with past follow-up dates (test by entering a past date)

**Done? Open `03-deals.md`**
