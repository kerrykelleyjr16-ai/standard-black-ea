# Airtable CRM + Deal Pipeline Tables
# Detailed Build Guide for Phase I Priority Tables

---

## Deal Pipeline — Base 1

### Table 1A: Tape Log

Build this table field by field in this order:

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | Tape ID | Single line text | Primary field. Format: TAPE-2026-001 |
| 2 | Seller | Linked record | Link to Base 2: Seller CRM → Sellers table |
| 3 | Date Received | Date | Date format: M/D/YYYY |
| 4 | Loan Count | Number | Integer |
| 5 | Total UPB | Currency | USD, 2 decimal places |
| 6 | Asset Mix | Single line text | e.g., "85% Income / 15% NPL" |
| 7 | Status | Single select | Options: Received, Screening, Underwriting, Pricing, LOI Sent, Accepted, Rejected, Closed |
| 8 | Go / No-Bid | Single select | Options: Go, No-Bid, Conditional Go |
| 9 | Bid Deadline | Date | |
| 10 | Days to Deadline | Formula | `DATETIME_DIFF({Bid Deadline}, TODAY(), 'days')` |
| 11 | Deadline Alert | Formula | `IF({Days to Deadline} <= 3, "URGENT", IF({Days to Deadline} <= 7, "This Week", "OK"))` |
| 12 | Screening Notes | Long text | Pre-screening findings |
| 13 | IC Memo | Long text | Paste IC memo output from note-investing-underwriter skill |
| 14 | Recommended Bid | Currency | From underwriting |
| 15 | Kerry Notes | Long text | Kerry's own notes on this tape |
| 16 | Drive Link | URL | Google Drive folder for tape documents |
| 17 | Last Updated | Last modified time | Auto |

**Views to create:**
- **Active Tapes** — Filter: Status not in [Accepted, Rejected, Closed]. Sort: Days to Deadline ASC
- **Bid Decisions Needed** — Filter: Go/No-Bid = Go AND Status = Pricing
- **Deadline Watch** — Filter: Days to Deadline ≤ 7. Color: Red if ≤ 3, Yellow if ≤ 7
- **All Tapes** — No filter. Sort: Date Received DESC

---

### Table 1B: Pricing Summary

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | Pricing ID | Single line text | Format: PRICE-00001 |
| 2 | Tape | Linked record | → Tape Log |
| 3 | Pricing Date | Date | |
| 4 | Base IRR | Percent | |
| 5 | Base Bid % UPB | Percent | |
| 6 | Base Bid Amount | Currency | |
| 7 | Stress Case IRR | Percent | |
| 8 | Worst Case IRR | Percent | |
| 9 | Recommended Bid | Currency | From IC memo |
| 10 | Max Bid | Currency | Walk-away price |
| 11 | Key Risks | Long text | |
| 12 | Approved Bid | Currency | Kerry enters after reviewing |
| 13 | Bid Approval Status | Single select | Options: Pending Review, Approved, Modified, Rejected |

**Views:**
- **Pending Bid Review** — Filter: Bid Approval Status = Pending Review
- **Approved Bids** — Filter: Bid Approval Status in [Approved, Modified]

---

### Table 1C: LOI Tracker

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | LOI ID | Single line text | Format: LOI-2026-001 |
| 2 | Tape | Linked record | → Tape Log |
| 3 | Seller | Linked record | → Seller CRM |
| 4 | LOI Sent Date | Date | |
| 5 | LOI Amount | Currency | |
| 6 | LOI Expiration | Date | |
| 7 | Seller Response | Single select | Pending, Accepted, Rejected, Countered |
| 8 | Counter Amount | Currency | |
| 9 | Outcome | Single select | Accepted, Rejected, Expired, Walking |
| 10 | Diligence Auth | Checkbox | Kerry checks to authorize full diligence |
| 11 | Notes | Long text | |

**Views:**
- **Open LOIs** — Filter: Outcome is empty. Sort: LOI Expiration ASC
- **Accepted — Pending Diligence Auth** — Filter: Seller Response = Accepted AND Diligence Auth unchecked

---

### Table 1D: Closing Tracker

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | Close ID | Single line text | |
| 2 | Tape | Linked record | → Tape Log |
| 3 | Target Close Date | Date | |
| 4 | Wire Amount | Currency | |
| 5 | Wire Auth Status | Single select | Pending, Approved, Wired, Confirmed |
| 6 | Wire Date | Date | |
| 7 | Boarding Status | Single select | Pending, In Progress, Cleared, Held |
| 8 | Loans Boarded | Number | |
| 9 | Loans Held | Number | |
| 10 | Closing Package Drive Link | URL | |
| 11 | Notes | Long text | |

---

## Seller CRM — Base 2

### Table 2A: Sellers

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | Seller ID | Single line text | Format: SEL-001 |
| 2 | Company Name | Single line text | Primary field |
| 3 | Primary Contact | Single line text | Name |
| 4 | Email | Email | |
| 5 | Phone | Phone | |
| 6 | State | Single line text | Primary state of operation |
| 7 | Seller Type | Single select | Direct Seller, Broker, Servicer, Hedge Fund, Bank |
| 8 | Relationship Status | Single select | Active, Warm, Cold, Blacklisted |
| 9 | How We Met | Single line text | Referral source or platform |
| 10 | Total Tapes Received | Count | Rollup from Tape History |
| 11 | Total UPB Sourced | Rollup | Sum of Total UPB from Tape History |
| 12 | Last Tape Date | Rollup | Most recent Date Received from Tape History |
| 13 | Closed Deals Count | Number | Manual until Tape History rollup is set up |
| 14 | Kerry Notes | Long text | Relationship notes, preferences, history |
| 15 | Drive Folder | URL | Seller folder in Google Drive |
| 16 | Next Follow-Up | Date | |

**Views:**
- **Active Sellers** — Filter: Relationship Status = Active. Sort: Last Tape Date DESC
- **Follow-Up Due** — Filter: Next Follow-Up ≤ today
- **All Sellers** — No filter. Sort: Company Name ASC

---

### Table 2B: Tape History

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | Tape | Linked record | → Deal Pipeline / Tape Log |
| 2 | Seller | Linked record | → Sellers |
| 3 | Date Received | Date | |
| 4 | Loan Count | Number | |
| 5 | Total UPB | Currency | |
| 6 | Go / No-Bid | Single select | |
| 7 | Outcome | Single select | Closed, Rejected, Expired, In Progress |
| 8 | Notes | Long text | |

---

### Table 2C: Seller Communication Log

| # | Field Name | Type | Setup Notes |
|---|---|---|---|
| 1 | Seller | Linked record | → Sellers |
| 2 | Date | Date | |
| 3 | Contact Type | Single select | Email, Call, Meeting, Text |
| 4 | Summary | Long text | What was discussed |
| 5 | Follow-Up Required | Checkbox | |
| 6 | Follow-Up Date | Date | |
| 7 | Handled By | Single select | Kerry, Kody, TJ |
| 8 | Outcome | Single line text | |

**Views:**
- **Pending Follow-Ups** — Filter: Follow-Up Required checked AND Follow-Up Date ≤ today
- **Recent (30 Days)** — Filter: Date in last 30 days
