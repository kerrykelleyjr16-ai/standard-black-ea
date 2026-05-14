# Human Approval Rules
# Standard Black — Pinnacle Note Fund AI OS

**Rule:** Never automate any action in the categories below without Kerry's explicit approval.
**No exceptions. No implied approvals. Each instance requires its own confirmation.**

---

## Hard Stop Categories

Any task involving the following STOPS until Kerry gives explicit verbal or written approval:

### Communications
- Sending external emails (to sellers, investors, attorneys, servicers, vendors, or anyone outside the team)
- Contacting investors or LPs in any form (email, call, message, report)
- Contacting sellers or brokers about a deal (any stage)
- Contacting lenders or capital providers
- Contacting attorneys or legal counsel
- Contacting servicers about active loan changes

### Money
- Spending money of any amount from any account
- Initiating or authorizing a wire transfer
- Committing to any financial obligation (even verbal)
- Purchasing any tool, subscription, or service
- Making any bid, offer, or LOI with a price attached

### Legal
- Signing any contract, agreement, or document
- Changing any legal document
- Engaging any attorney or legal firm
- Filing any entity, registration, or regulatory document
- Sending any LOI (Letter of Intent)

### Data & Records
- Deleting any record in Airtable, Google Sheets, Drive, or any system
- Archiving active deal records
- Sharing private deal data with any external party
- Sharing investor information with anyone
- Exporting sensitive data outside the system

### Publishing
- Publishing any content publicly (LinkedIn, social media, website, ads)
- Releasing any press release or public announcement
- Launching any ad campaign

### Financial Records
- Changing any financial record, calculation, or account balance
- Updating distribution calculations
- Marking any payment as received or sent

---

## Approval Process

1. AI or automation identifies the action and STOPS
2. Describes exactly what the action is and what it will do
3. States who will be affected and what the outcome will be
4. Kerry gives explicit approval (verbal confirmation in session or written message)
5. Action executes
6. Logged in: `ai-os/10-logs/approval_log.md` + Airtable Approval Queue

---

## No Implied Approval

- Approving an action once does NOT authorize the same action in a different context
- Approving one email does NOT authorize sending additional emails
- Approving one wire does NOT authorize future wires
- Each instance = its own approval

---

## Dual Approval — Wire Transfers ≥ $50,000

Any wire of $50,000 or more requires TWO approvals:
1. Kerry (primary)
2. Secondary approver (TBD — currently Kerry serves both roles until governance expands)

No wire executes until both approvals are confirmed and logged.

---

## What Does NOT Require Approval

- Internal file edits (editing markdown files, skills, context files)
- Creating Airtable records or tasks (internal only)
- Sending internal Slack messages to the team channel
- Running any Claude Code skill on internal data
- Generating documents for Kerry's review (they don't go external until Kerry approves)
- Adding contacts to the CRM (data entry only — no outreach without approval)
