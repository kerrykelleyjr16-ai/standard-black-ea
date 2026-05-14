# Airtable Human Approval Rules
# What requires Kerry's explicit approval before proceeding

---

## The Rule

No consequential action moves forward without a record in the Approval Queue with Kerry Decision = Approved.

"Consequential action" means: money moves, legal documents are signed, external parties are contacted, or public content is released.

---

## Hard Stops — Require Approval Queue Record Before Proceeding

| Action | Approval Type | Priority | Amount Threshold |
|---|---|---|---|
| Sending any Letter of Intent | LOI | High | Any amount |
| Authorizing full diligence on a tape | LOI | High | — |
| Sending any wire | Closing | URGENT | Any amount |
| Wire ≥ $50,000 | Closing | URGENT | Dual approval required |
| Authorizing loan boarding with servicer | Closing | High | — |
| Any investor communication | Compliance | High | — |
| Distribution payment to any LP | Distribution | URGENT | Any amount |
| New servicer engagement | Vendor Contract | High | — |
| Vendor contract renewal | Vendor Contract | Normal | — |
| Any NPL resolution strategy (foreclosure, DIL, mod) | NPL Strategy | High | — |
| Any legal filing or attorney engagement | Legal | High | — |
| Any public content or marketing released | Compliance | Normal | — |

---

## Soft Stops — Flag and Confirm Before Proceeding

These don't require an Approval Queue record but should be confirmed with Kerry verbally or via Slack before executing:

- Changing a seller's Relationship Status to Blacklisted
- Deleting any record in any base
- Changing a bid recommendation by more than 10%
- Adding a new team member to Airtable with Creator or higher access

---

## Approval Queue — How It Works

1. Action is identified as requiring approval
2. Record created in Base 3: Approval Queue → Table 7A: Open Approvals
3. Zapier sends Slack alert to #team-notifications
4. Kerry reviews in Airtable and sets Kerry Decision = Approved or Rejected
5. Zapier confirms the decision back to Slack
6. Downstream action proceeds only after Decision = Approved
7. Record moves to Table 7B: Completed Approvals after 24 hours

---

## Wire Dual-Approval Protocol

Any wire transaction requires two approvals:
1. Kerry Decision = Approved (primary)
2. Secondary Decision = Approved (secondary approver — TBD, currently Kerry is both until team grows)

No wire executes until both fields are Approved.

---

## Airtable Permission Rules

| Role | Can Do | Cannot Do |
|---|---|---|
| Kerry (Owner) | Everything | — |
| Kody (Creator) | Build views, enter data, comment | Delete bases, change permissions, approve Approval Queue items |
| TJ (Commenter) | View assigned tasks, add comments | Edit records, approve anything |
| No anonymous access | — | Public view links disabled workspace-wide |

---

## Approval Escalation

- URGENT approval with no Kerry decision after 2 hours → re-send Slack alert
- Approval expiration passes with no decision → record flagged as Expired; action cannot proceed; new approval request required
- Any approval involving > $50,000 → wire dual-approval protocol applies
