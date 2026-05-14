# Vendor Issue Log — The Pinnacle Note Fund

**Maintained By:** Agent 08 (Servicer, Counsel & Vendor Oversight)
**Format:** Append-only for new issues; status updates noted with [UPDATE] tag
**Purpose:** Track every performance issue, SLA breach, and error by any fund vendor.

---

## Log Format

```
[YYYY-MM-DD] | VIL-ID: [VIL-XXX] | VENDOR: [Name] | TYPE: [Vendor Type] | ISSUE: [Description] | SEVERITY: [Critical/Major/Minor] | SLA BREACH: [Yes/No] | DATE IDENTIFIED: [Date] | FINANCIAL IMPACT: $[X] / [None estimated] | LEGAL IMPACT: [High/Low/None] | OWNER: [Agent 08 or specific team member] | STATUS: [Open/In Progress/Resolved] | RESOLUTION TARGET: [Date]

[UPDATE YYYY-MM-DD] | ACTION TAKEN: [Describe] | STATUS: [Updated] | NOTES: [Additional context]
```

---

## Vendor Type Codes

| Code | Type |
|---|---|
| SVC | Primary Servicer |
| SPEC | Special Servicer |
| FC | Foreclosure Counsel |
| BK | Bankruptcy Counsel |
| BPO | BPO / Appraisal Vendor |
| TITLE | Title Vendor |
| FA | Fund Administrator |
| AUD | Auditor |
| TAX | Tax Advisor |
| COMP | Compliance Consultant |
| OTHER | Other |

---

## Severity Classification

| Severity | Description |
|---|---|
| Critical | Financial loss occurring or imminent; legal deadline missed; data breach |
| Major | SLA breached with financial or legal implications; pattern of errors |
| Minor | SLA breached with no immediate financial or legal impact; isolated error |

---

## Log Entries

[YYYY-MM-DD] | VIL-ID: VIL-001 | VENDOR: [Servicer Name] | TYPE: SVC | ISSUE: Monthly remittance report delivered 8 days late — received [date] vs. SLA requirement of 15th of month. Resulted in delay to monthly portfolio review cycle and investor report timeline. | SEVERITY: Major | SLA BREACH: Yes | DATE IDENTIFIED: [Date] | FINANCIAL IMPACT: None direct — operational delay | LEGAL IMPACT: None | OWNER: Agent 08 | STATUS: Open | RESOLUTION TARGET: [Date]

[UPDATE YYYY-MM-DD] | ACTION TAKEN: Formal SLA breach notice issued to servicer on [date]. Servicer acknowledged and committed to improvement plan. | STATUS: In Progress | NOTES: Will monitor next month for recurrence.

---

[YYYY-MM-DD] | VIL-ID: VIL-002 | VENDOR: [Servicer Name] | TYPE: SVC | ISSUE: Property tax payment not made on Asset FUND-ASSET-0004 despite adequate escrow balance. Delinquency of 2 years identified. Potential tax lien exposure of $4,200. | SEVERITY: Critical | SLA BREACH: Yes | DATE IDENTIFIED: [Date] | FINANCIAL IMPACT: $4,200 potential lien | LEGAL IMPACT: High | OWNER: Agent 08 | STATUS: Open | RESOLUTION TARGET: [Date]

[UPDATE YYYY-MM-DD] | ACTION TAKEN: Servicer instructed to pay taxes immediately from escrow. Tax payment confirmed [date]. Exception logged in exception log (EXC-002). | STATUS: Resolved | NOTES: Servicer acknowledged error; reviewing escrow monitoring controls.

---

## Monthly Summary

| Period | New Issues | Resolved | Critical Open | Major Open | Avg. Resolution Time |
|---|---|---|---|---|---|
| [Month YYYY] | [#] | [#] | [#] | [#] | [X days] |

---

## Vendor Repeat Offenders

*Vendors with 3 or more unresolved issues in a rolling 90-day period trigger a formal performance review recommendation.*

| Vendor | Issues (Last 90 Days) | Types | Action |
|---|---|---|---|
| [Vendor Name] | [#] | [Types] | [ ] Formal notice / [ ] Scorecard review / [ ] CEO/CIO — recommend replacement |
