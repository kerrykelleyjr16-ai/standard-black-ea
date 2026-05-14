# Security Rules

Non-negotiable security rules for the Standard Black AI Operating System.

---

## Data Rules

- API keys and credentials live in `.env` files only — never hardcoded in any file
- `.env` files are always git-ignored — verify before every commit
- No SSNs, EINs, bank account numbers, or borrower PII in any markdown file
- Deal data stays in Google Sheets / Drive — not in local markdown files
- No investor names or contact info in any file tracked by git

---

## Access Rules

- MCP servers with write access (Gmail, Google Drive, Google Calendar, Slack, Zapier) require explicit intent before executing
- No automated sends to external parties without human review (see `HUMAN_APPROVAL_RULES.md`)
- Any new MCP server added must be logged in `MCP_REGISTRY.md` before use
- Zapier automations that touch external data must be documented in `AUTOMATION_REGISTRY.md` before activation

---

## File Rules

- Never overwrite a log file — logs are append-only
- Never delete files without archiving first
- Only one AI system edits any file at a time
- All cross-AI context passes through shared files, not conversation memory

---

## Communication Rules

- No external emails sent without Kerry's review
- No Slack messages to external parties without Kerry's review
- No social media posts published without Kerry's approval
- No investor communication of any kind without Kerry's explicit sign-off

---

## Audit Trail

Every significant action must be traceable:
- Decisions → `10-logs/decision_log.md`
- Approvals → `10-logs/approval_log.md`
- Automations triggered → `10-logs/automation_log.md`
- Security events → `10-logs/security_log.md`

---

## If a Rule Conflicts With a Task

Stop. Flag it. Ask Kerry. Do not rationalize around a security rule.
