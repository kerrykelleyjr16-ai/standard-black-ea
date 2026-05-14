# Skill: Security Approval Gate

**Invoke when:** Any action is about to be taken that might require human approval, touch sensitive data, or carry security risk. Run this before executing — not after.

---

## Inputs
- What action is about to be taken (be specific)
- What system or data it touches
- Who or what will be affected

## Workflow

### Step 1 — Hard Stop Check
Does this action involve any of the following?

| Category | Examples | Required Action |
|---|---|---|
| Money | Payments, transfers, commitments, bids | STOP — Kerry approves first |
| Legal documents | Contracts, agreements, filings, signatures | STOP — Kerry reviews first |
| Investor / LP communication | Emails, decks, reports, distributions | STOP — Kerry approves first |
| External publishing | Social media, ads, website, press | STOP — Kerry approves first |
| Sensitive data | SSNs, EINs, bank accounts, borrower PII | STOP — Kerry reviews first |
| Deleting records | Files, logs, deal records, contacts | STOP — confirm with Kerry |

If any apply → do not proceed. State what you found and wait.

### Step 2 — Security Rules Check
Cross-reference against `ai-os/SECURITY_RULES.md`:
- Are credentials in a `.env` file only?
- Is any PII in a markdown file that will be git-tracked?
- Is this automation documented in `AUTOMATION_REGISTRY.md`?
- Is this MCP server registered in `MCP_REGISTRY.md`?
- Is only one AI system editing this file at a time?

### Step 3 — Risk Assessment
Score the action:
- **Low:** Editing a local file, reading data, internal Slack message → Proceed
- **Medium:** Sending to team members, updating a shared doc, adding a Zapier action → Flag + confirm
- **High:** Sending externally, financial action, legal document, investor contact → Hard stop

### Step 4 — Log the Check
Every security gate check gets logged in `ai-os/10-logs/security_log.md`:
- What was checked
- What was found
- Whether it was cleared or stopped
- Date and action taken

### Step 5 — Clear or Stop
- **Cleared:** Proceed with the action. Note the clearance in the log.
- **Stopped:** State exactly what the issue is. State what Kerry needs to do to approve it. Do not proceed until approval is received and logged in `ai-os/10-logs/approval_log.md`.

## Output Format
- Status: CLEARED / STOPPED
- If stopped: specific reason + what approval is needed
- Log entry ready to paste into security_log.md
