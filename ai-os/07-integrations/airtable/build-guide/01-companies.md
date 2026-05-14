# Table 1: Companies
## Build this first — no dependencies

---

## Purpose
Every organization you work with lives here. Seller shops, servicers, law firms, title companies, BPO providers, broker firms. Contacts and Deals will link back to this table, so it must exist first.

---

## How to Set Up

In Airtable, rename the default "Table 1" tab to: **Companies**

---

## Fields — Build in This Exact Order

### Field 1: Company Name
- **Type:** Single line text
- **This is the primary field** (it's already there as the first field — just rename it)
- No options to set

### Field 2: Company Type
- **Type:** Single select
- **Options (add in this order):**
  - Seller
  - Broker
  - Servicer
  - Law Firm
  - Title Company
  - BPO Provider
  - Fund / Hedge Fund
  - Bank
  - Vendor
  - Other

### Field 3: Website
- **Type:** URL
- No options

### Field 4: State
- **Type:** Single line text
- No options (type the state abbreviation when entering records)

### Field 5: Relationship Status
- **Type:** Single select
- **Options:**
  - Active
  - Warm
  - Cold
  - Blacklisted

### Field 6: Source
- **Type:** Single line text
- Notes: How Kerry found them (referral, conference, PaperStac, etc.)

### Field 7: Notes
- **Type:** Long text
- Enable rich text: No (keep it simple)

### Field 8: Date Added
- **Type:** Created time
- This auto-fills when a record is created — no input needed

---

## No Linked Records Yet
Companies has no linked record fields. Those get added in later tables that link back to Companies.

---

## No Formula or Rollup Fields
These get added after Contacts and Deals are built. Come back then.

---

## Views — Create These 3 Views

After all fields are built, click **+ Add view** (left sidebar) for each:

**View 1: All Companies** (this is the default Grid view — rename it)
- No filter
- Sort: Company Name, A→Z

**View 2: Active**
- Filter: Relationship Status = Active
- Sort: Company Name, A→Z

**View 3: By Type**
- No filter
- Group by: Company Type
- Sort within groups: Company Name, A→Z

---

## First 3 Sample Records

Enter these to confirm the table is working. Delete them after the test records checklist.

| Company Name | Company Type | State | Relationship Status | Notes |
|---|---|---|---|---|
| Evans Note Group | Seller | LA | Active | Direct note seller. Multiple tapes per quarter. |
| SN Servicing Corp | Servicer | TX | Active | Primary servicer. Remittance on 15th. |
| Westlaw Foreclosure Group | Law Firm | TX | Active | FC attorney. $1,800 flat fee in TX. |

---

## Common Mistakes to Avoid

- **Do not rename the primary field to anything other than "Company Name"** — Contacts will display this name in the linked field
- **Do not add a "Contacts" linked field yet** — that gets added from the Contacts table side
- **Blacklisted is not the same as Inactive** — Inactive means no current deals; Blacklisted means do not work with under any circumstances. Use it intentionally.
- **Don't skip Date Added** — using "Created time" means it fills automatically and you never have to touch it

---

## Completion Checklist — Check Every Box Before Opening Table 2

- [ ] Table renamed to "Companies"
- [ ] 8 fields created in order
- [ ] Company Type has all 10 options
- [ ] Relationship Status has all 4 options
- [ ] 3 views created: All Companies, Active, By Type
- [ ] 3 sample records entered
- [ ] Records look correct (no broken fields, no missing data)

**Done? Open `02-contacts.md`**
