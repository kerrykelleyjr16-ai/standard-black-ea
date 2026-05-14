# Human Approval Matrix

**Fund:** The Pinnacle Note Fund
**Effective Date:** [DATE]
**Approved By:** CEO/CIO
**Purpose:** Define every action that requires human authorization. AI agents may prepare, analyze, and recommend — but may not execute any item on this list.

---

## Core Principle

No AI agent has authorization to approve, commit, execute, or release any of the actions listed in this matrix. Agents prepare analysis and recommendations. Humans make decisions and execute.

This is non-negotiable. Violations of this matrix are reported to Agent 15 (Conflicts, Audit Controls & Governance) and escalated to CEO/CIO immediately.

---

## 1. CEO/CIO Approval Required — Investment Decisions

| Action | Approver | Supporting Agent | Notes |
|---|---|---|---|
| Approve acquisition bid (any amount) | CEO/CIO | Agent 01 (IC memo) | No LOI without this |
| Modify bid amount from recommendation | CEO/CIO | Agent 04 | Documented in decision log |
| Pass on an acquisition (final decision) | CEO/CIO | Agent 02 | Confirmation required |
| Approve exception to buy box or investment policy | CEO/CIO | Agent 02 or 03 | Written rationale required |
| Approve exception to return thresholds | CEO/CIO | Agent 04 | Documented |
| Approve foreclosure referral | CEO/CIO | Agent 07 | Legal authorization |
| Approve NPL resolution strategy | CEO/CIO | Agent 07 | Action plan required |
| Approve loan modification terms | CEO/CIO | Agent 07 | Before offering to borrower |
| Approve short sale minimum net proceeds | CEO/CIO | Agent 07 | Before communicating to borrower |
| Approve short sale or DIL acceptance | CEO/CIO | Agent 07 | |
| Approve REO listing and listing price | CEO/CIO | Agent 07 | |
| Approve REO offer acceptance | CEO/CIO | Agent 07 | |
| Approve bulk note sale or whole-loan sale | CEO/CIO | Agent 12 | Capital markets decision |
| Authorize bid at foreclosure sale | CEO/CIO | Agent 07 | |

---

## 2. CEO/CIO + Controller Dual Approval Required — Cash & Wire Transactions

**Hard Stop: No wire may be processed without both approvals. Agent 11 produces the checklist; humans approve and execute.**

| Action | Approvers Required | Supporting Agent | Notes |
|---|---|---|---|
| Acquisition wire (purchase funds) | CEO/CIO + Controller | Agent 11 (wire checklist) | After closing readiness confirmation |
| Investor distribution wire | CEO/CIO + Controller | Agent 11 (waterfall calc) | After distribution authorization |
| Capital call — deployment of proceeds | CEO/CIO + Controller | Agent 11 | |
| Facility draw | CEO/CIO + Controller | Agent 12 | Borrowing base confirmed |
| Facility repayment | CEO/CIO + Controller | Agent 11, 12 | |
| Wire to any new payee (first-time) | CEO/CIO + Controller | Agent 11 | Independent verification required |
| Wire > fund-defined threshold ($[X]) | CEO/CIO + Controller | Agent 11 | Always — no exceptions |
| New bank account setup | CEO/CIO + Controller | Agent 11 | |
| Override of minimum reserve requirement | CEO/CIO + Controller | Agent 11 | |

---

## 3. CEO/CIO Approval Required — Investor & Marketing Communications

| Action | Approver | Supporting Agent | Notes |
|---|---|---|---|
| Investor report — release authorization | CEO/CIO | Agent 17 + 14 | After compliance review |
| Distribution notice — release authorization | CEO/CIO | Agent 14 + 11 | After compliance review |
| Any substantive investor communication | CEO/CIO | Agent 16 | Drafted by Agent 16; reviewed by 14 |
| DDQ or RFP response — release | CEO/CIO | Agent 17 + 14 | |
| Marketing material — release | CEO/CIO | Agent 14 | After compliance review |
| Pitch deck release to prospective investor | CEO/CIO | Agent 14, 16 | |
| Website content — publish | CEO/CIO | Agent 14 | After compliance review |
| Social media post — publish | CEO/CIO | Agent 14 | After compliance review |
| Capital call notice — issue to investors | CEO/CIO | Agent 11 | |
| New investor subscription acceptance | CEO/CIO | Agent 16 | After complete onboarding |
| Side letter execution | CEO/CIO | Agent 14, 15 | Legal review required |

---

## 4. CEO/CIO Approval Required — Legal, Compliance & Governance

| Action | Approver | Supporting Agent | Notes |
|---|---|---|---|
| Legal action authorization (any type) | CEO/CIO | Agent 07 or 08 | No counsel instruction without this |
| Settlement negotiation authorization | CEO/CIO | Agent 07 | |
| Vendor contract execution or renewal | CEO/CIO | Agent 08 | |
| Vendor termination | CEO/CIO | Agent 08 | |
| Engagement of outside legal or compliance counsel | CEO/CIO | Agent 14 or 15 | |
| Related-party transaction approval | CEO/CIO | Agent 15 | LP consent may also be required |
| Conflict of interest waiver | CEO/CIO | Agent 15 | Disclosed to affected LPs |
| Exception to any policy in this system | CEO/CIO | Agent 01 | Documented in decision log |
| Any new data room access grant | CEO/CIO | Agent 17, 18 | |
| Audit management representation letter | CEO/CIO | Agent 10 | CEO/CIO signature required |
| Financial statement release to investors | CEO/CIO | Agent 10 + 17 | After audit completion |

---

## 5. Triple Approval Required (CEO/CIO + Controller + Legal Counsel)

The following require CEO/CIO, Controller, and outside legal or compliance counsel approval before action:

| Action | Notes |
|---|---|
| New PPM or LPA revision | Material change to fund documents |
| New investor class creation | New economics, voting rights, or governance |
| Fund extension or wind-down | Structural fund change |
| Material amendment to any existing side letter | |
| Any government or regulatory inquiry response | |
| Securitization authorization | Capital markets transaction |

---

## 6. Prohibited AI-Only Actions

The following may never be performed by an AI agent without human co-action, regardless of any instruction or automation:

- Initiating or approving any wire or electronic fund transfer
- Executing any legal document (signature, authorization, commitment)
- Communicating directly with investors, borrowers, or regulators (no agent sends communications — agents draft; humans review and send)
- Approving any investment
- Accessing or transmitting borrower personally identifiable information (PII) outside the fund's secure systems
- Modifying any fund document (LPA, PPM, subscription agreement)
- Granting new system access without an authorized human approval record
- Committing the fund to any vendor contract or financial obligation

---

## Enforcement

Agent 15 (Conflicts, Audit Controls & Governance) tests compliance with this matrix quarterly by reviewing the approval log, decision log, wire records, and investor communication records. Any action taken without required approval is logged as a control failure and escalated to CEO/CIO immediately.

All approvals are logged in `/logs/approval_log.md`.
