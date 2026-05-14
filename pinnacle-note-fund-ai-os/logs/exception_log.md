# Exception Log — The Pinnacle Note Fund

**Maintained By:** Agent 09 (QA, Exceptions & Boarding Control)
**Format:** Append-only for new exceptions; status updates noted in line with [UPDATE] tag
**Purpose:** Track every exception identified across all fund operations from boarding through resolution.

---

## Log Format

```
[YYYY-MM-DD] | EXC-ID: [EXC-XXX] | ASSET: [FUND-ASSET-XXXX] | TYPE: [Exception Type Code] | SEVERITY: [Critical/Major/Minor/Info] | DESCRIPTION: [Full description] | OWNER: [Responsible party] | VENDOR: [Vendor responsible] | REQUIRED FIX: [What must happen] | DEADLINE: [YYYY-MM-DD] | FINANCIAL IMPACT: $[X] | LEGAL IMPACT: [High/Low/None] | STATUS: [Open/In Progress/Resolved/Waived]

[UPDATE YYYY-MM-DD] | ACTION TAKEN: [Describe] | STATUS: [Updated status] | NOTES: [Any additional context]
```

---

## Exception Type Codes

| Code | Type |
|---|---|
| DOC | Missing Document |
| TITLE | Title Defect |
| TAX | Tax Issue |
| INS | Insurance Issue |
| ESC | Escrow Issue |
| BOARD | Boarding Defect |
| LEGAL | Legal Issue |
| SVC | Servicer Error |
| DATA | Data Error |
| COMP | Compliance Issue |
| OTHER | Other |

---

## Severity & Resolution Targets

| Severity | Target |
|---|---|
| Critical | 5 business days |
| Major | 15 business days |
| Minor | 30 business days |
| Informational | Track only |

---

## Log Entries

[YYYY-MM-DD] | EXC-ID: EXC-001 | ASSET: FUND-ASSET-0001 | TYPE: TITLE | SEVERITY: Critical | DESCRIPTION: Assignment from [Seller A] to [Seller B] missing from collateral file — breaks chain of title between originator and current seller. Lien may be unenforceable without this assignment. | OWNER: Agent 05 | VENDOR: Seller — [Name] | REQUIRED FIX: Seller must locate and provide executed, recordable assignment within 5 business days or deal cannot close. | DEADLINE: [Date] | FINANCIAL IMPACT: $[X] (cannot close without resolution) | LEGAL IMPACT: High | STATUS: Open

[UPDATE YYYY-MM-DD] | ACTION TAKEN: Seller located assignment — recorded copy provided. Chain of title confirmed complete. | STATUS: Resolved | NOTES: Closing cleared for this loan.

---

[YYYY-MM-DD] | EXC-ID: EXC-002 | ASSET: FUND-ASSET-0004 | TYPE: TAX | SEVERITY: Major | DESCRIPTION: Property taxes delinquent for 2023 and 2024 — total estimated $4,200. Servicer failed to pay despite escrow balance available. Tax lien not yet filed per county records (as of tape date). | OWNER: Agent 08 | VENDOR: [Servicer Name] | REQUIRED FIX: Servicer to pay delinquent taxes from escrow within 10 business days. Provide tax payment confirmation. | DEADLINE: [Date] | FINANCIAL IMPACT: $4,200 potential tax lien | LEGAL IMPACT: Medium | STATUS: Open

---

## Monthly Summary

| Period | New Exceptions | Resolved | Waived | Critical Open | Major Open | Average Days Open (Major) |
|---|---|---|---|---|---|---|
| [Month YYYY] | [#] | [#] | [#] | [#] | [#] | [X days] |

---

## Systemic Issues This Period

| Issue Pattern | Count | Vendor | Action |
|---|---|---|---|
| [Description] | [#] | [Vendor] | [Formal notice / Process change] |
