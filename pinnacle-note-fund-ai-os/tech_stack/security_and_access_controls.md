# Security and Access-Control System
# The Pinnacle Note Fund AI Operating System

**Document Version:** 1.0
**Last Updated:** 2026-05-09
**Maintained By:** Agent 15 (Conflicts, Audit, Governance) | Agent 18 (Data, Automation, Security)
**Review Authority:** Kerry Kelley Jr — final authority on all security decisions
**Review Frequency:** Quarterly (Agent 15) + any material incident

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Data Classification System](#data-classification-system)
3. [Platform Access Controls](#platform-access-controls)
4. [Agent Access-Control Matrix](#agent-access-control-matrix)
5. [Credential Management Standards](#credential-management-standards)
6. [Audit Log Architecture](#audit-log-architecture)
7. [Vendor Access Governance](#vendor-access-governance)
8. [Incident Response and Breach Escalation](#incident-response-and-breach-escalation)
9. [Periodic Review Requirements](#periodic-review-requirements)

---

## Design Principles

**Least privilege.** Every human, agent, and system receives only the minimum access required to perform its function. Access is not granted by default — it must be explicitly authorized.

**No agent handles wires.** No AI agent — regardless of role — may view, draft, transmit, or act on wire instructions, bank account numbers, or routing numbers. Wire execution is a human-only action performed by Kerry Kelley Jr. This rule has no exceptions.

**No agent contacts borrowers.** AI agents may prepare draft communications, log strategy, and coordinate with servicers. No agent sends any communication directly to a borrower or guarantor. All borrower-facing communications are reviewed and approved by Kerry before transmission.

**Supabase is the source of truth.** Authentication credentials, wire instructions, and legal-privileged documents are never stored in Supabase. All other data flows through Supabase with RLS enforced.

**Credentials live in 1Password only.** API keys, service account passwords, OAuth tokens, and MFA recovery codes are stored in 1Password vaults. They are loaded into n8n and other systems as environment variables at runtime. They are never hardcoded, logged, or passed through AI agent context.

**Audit everything.** Every access to Confidential data or above generates an audit record. Every approval generates an audit record. Audit logs are append-only and cannot be deleted.

**Defense in depth.** No single control is the only barrier. MFA + least-privilege roles + RLS + audit logs + human approval gates work together. Compromise of one layer does not compromise all layers.

---

## Data Classification System

### Classification 1 — Public

**Definition:** Information intentionally made available to the general public with no access restriction.

| Attribute | Rule |
|---|---|
| Who can access | Anyone |
| Which agents can use it | All agents |
| Where it can be stored | Any platform — Google Drive, website, social media |
| Can be shared externally | Yes — no restriction |
| Approval before sharing | None |
| Retention | Indefinite while relevant; archive when obsolete |
| Escalation if exposed | N/A — no exposure risk by definition |

**Examples:** Standard Black website content, fund marketing overview (without financial data), general capability descriptions, press releases approved by Kerry.

**Note:** The existence of the fund and its general investment focus is Public. The specific LP list, fund performance, portfolio size, acquisition targets, and all financial data are NOT public regardless of how general they seem.

---

### Classification 2 — Internal

**Definition:** Operational information used in day-to-day management. Not intended for external parties but not regulated or highly sensitive.

| Attribute | Rule |
|---|---|
| Who can access | Kerry, Kody, TJ (role-appropriate subsets), all 18 agents |
| Which agents can use it | All agents (within their workflow scope) |
| Where it can be stored | Supabase, Airtable, Google Drive (internal folders), GitHub (non-sensitive repos) |
| Can be shared externally | No, without approval |
| Approval before sharing | Kerry approval required for any external share |
| Retention | 3 years minimum; archive per document type |
| Escalation if exposed | Agent 15 notification; Kerry decision on disclosure |

**Examples:** Workflow SOPs, agent system prompts, team meeting notes, deal pipeline status (non-NPI fields), vendor scorecards, task lists, system architecture documentation.

---

### Classification 3 — Confidential

**Definition:** Sensitive business information that would cause material harm to the fund if disclosed outside authorized parties. Most fund operating data falls here.

| Attribute | Rule |
|---|---|
| Who can access | Kerry (full), Kody (accounting-relevant subset), TJ (assigned task subset only) |
| Which agents can use it | See Agent Access-Control Matrix |
| Where it can be stored | Supabase (RLS enforced), Airtable (Owner/Creator roles only), Google Drive (Restricted folders), GitHub (private repos only) |
| Can be shared externally | No — requires Kerry written approval and NDA in place |
| Approval before sharing | Kerry written approval; NDA required |
| Retention | 7 years from fund close |
| Escalation if exposed | Immediate notification to Kerry; Agent 15 logs incident; legal counsel notification within 24 hours if LP data involved |

**Examples:** Fund financial statements (internal), portfolio performance data, unrealized positions, acquisition pricing models, bid strategies, risk reports, fund economics, capital deployed, return calculations.

---

### Classification 4 — Investor Confidential

**Definition:** Information about specific LP investors or their capital commitments. Governed by subscription agreements and applicable securities law. Not to be disclosed to other LPs or external parties.

| Attribute | Rule |
|---|---|
| Who can access | Kerry only (full); Kody (limited — accounting entries only, not LP identity mapping) |
| Which agents can use it | Agents 10, 16, 17 only — specific task context; never aggregate LP list with capital amounts in single output |
| Where it can be stored | Supabase `lp_investors` and `capital_accounts` tables (RLS: `ceo_cio` only); Google Drive `/06 - LP Management/` (Kerry-only access); Box secure folders (Stage 2+ for LP data room) |
| Can be shared externally | Only to the specific LP regarding their own account; never LP-to-LP; never to third parties without LP written consent |
| Approval before sharing | Kerry written approval for any external share; dual review for any LP communication containing financial data |
| Retention | 7 years from fund close; K-1s 7 years from tax filing date |
| Escalation if exposed | Immediate notification to Kerry; legal counsel within 4 hours; potentially impacted LP notification per counsel's direction; SEC consideration if fund is registered |

**Examples:** LP names and identities, capital commitments, capital call schedules, K-1s, LP capital account statements, subscription agreements, LP contact information, DDQ responses containing LP financial data.

---

### Classification 5 — Borrower Non-Public Personal Information (NPI)

**Definition:** Non-public personal information about loan borrowers, as defined under the Gramm-Leach-Bliley Act (GLBA). Strict regulatory requirements apply to collection, use, storage, and disclosure.

| Attribute | Rule |
|---|---|
| Who can access | Kerry only (full read access); no team member accesses borrower NPI directly except through servicer-managed systems |
| Which agents can use it | Agents 03, 05, 06, 07 only — minimum necessary fields for specific task; agents never retain NPI across sessions |
| Where it can be stored | Supabase `borrowers` table (RLS: `ceo_cio` and `agent_service` with field-level restriction); Google Drive `/07 - Loan Files/` (Kerry-only folder access); never in Airtable, GitHub, or email |
| Can be shared externally | Only to servicer per servicing agreement; to FC counsel per engagement letter; to title company per closing instructions; NEVER via unencrypted email |
| Approval before sharing | Kerry approval for any non-routine disclosure; counsel review for any borrower NPI shared in legal proceedings |
| Retention | Duration of loan + 7 years post-payoff/resolution |
| Escalation if exposed | Immediate notification to Kerry; legal counsel within 2 hours; GLBA breach notification requirements assessed by counsel; affected borrower notification per applicable state law |

**Examples:** Borrower SSN/EIN, date of birth, income, credit score, payment history, personal address (if different from collateral), personal email/phone, loan modification terms, bankruptcy filing status.

**Hard rules:**
- Borrower SSNs are never stored in plain text — encrypted at rest in Supabase (pgcrypto).
- No agent output containing borrower NPI may be logged in full — NPI fields are redacted in `agent_logs` before storage.
- BPO vendors receive property address only — never borrower identity.

---

### Classification 6 — Bank and Wire Information

**Definition:** Banking credentials, wire instructions, account numbers, routing numbers, and ACH details — for the fund, LPs, sellers, vendors, and borrowers. Highest-risk classification. Compromise can result in immediate, irreversible financial loss.

| Attribute | Rule |
|---|---|
| Who can access | Kerry only — no exceptions |
| Which agents can use it | NO AGENT — zero access, zero exceptions. Not Agent 11, not Agent 10, not any agent |
| Where it can be stored | 1Password — Wire Instructions vault (Kerry-only vault). Nowhere else. Not Supabase, not Airtable, not Google Drive, not email, not any cloud document |
| Can be shared externally | Only via 1Password Secure Share link to verified recipient over voice-confirmed identity; never via email, text, or any document |
| Approval before sharing | Kerry personal decision; voice-call verification of recipient before sending any wire instruction |
| Retention | Current instructions in 1Password; superseded instructions deleted immediately upon account change |
| Escalation if exposed | Immediate notification to financial institution; account change initiated within 1 hour; legal counsel notified; wire fraud incident report filed |

**Examples:** Fund bank account number and routing number, LP wire instructions for distributions, seller wire instructions for acquisitions, servicer remittance account, vendor ACH details, Kerry's personal banking (if in business context).

**Hard rules:**
- Wire instructions are never transmitted via email — ever.
- Wire instructions are never in any DocuSign envelope — ever.
- Wire instructions are never stored in Google Drive, Box, Airtable, Supabase, or any cloud document — ever.
- Any wire instruction received via email should be treated as potentially fraudulent — verify via phone before acting.
- No automation may initiate, approve, or transmit a wire. n8n may log that a wire is pending; it may not execute or facilitate one.

---

### Classification 7 — Legal Privileged Information

**Definition:** Communications between Kerry and legal counsel that are protected by attorney-client privilege, and work product prepared in anticipation of litigation or legal proceedings.

| Attribute | Rule |
|---|---|
| Who can access | Kerry only (full); outside counsel (by definition); no other team members without Kerry's explicit direction |
| Which agents can use it | NO AGENT accesses privileged communications. Agents may receive non-privileged legal summaries prepared by Kerry or counsel for operational use |
| Where it can be stored | Kerry's Gmail (under attorney-client privilege, not shared account); separate legal folder in Google Drive accessible only to Kerry; counsel's secure systems |
| Can be shared externally | Only with counsel, co-counsel, or as directed by Kerry in active litigation — privilege waiver risk requires counsel guidance |
| Approval before sharing | Kerry + counsel approval for any disclosure |
| Retention | Duration of matter + 7 years; permanent for litigation outcomes |
| Escalation if exposed | Immediate notification to counsel; privilege waiver analysis; litigation strategy assessment |

**Examples:** Attorney emails on active FC cases, legal opinions on fund structure, litigation strategy memos, settlement negotiation records, regulatory correspondence where counsel is copied.

**Operational distinction:** FC timelines, state-specific FC process guides, and general legal summaries prepared for agent use are Internal — not privileged. The privilege attaches to specific counsel communications, not general legal knowledge.

---

### Classification 8 — Tax Information

**Definition:** Tax returns, tax identification numbers, tax elections, K-1s, and other tax records for the fund entities and their principals.

| Attribute | Rule |
|---|---|
| Who can access | Kerry (full); CPA/tax advisor (engagement-specific); Kody (fund-level accounting entries only, not entity-level returns) |
| Which agents can use it | Agent 10 (fund accounting — ledger entries only, not actual returns); no other agents |
| Where it can be stored | Google Drive `/10 - Tax Records/` (Kerry-only access); CPA's secure portal; never Airtable, never Supabase (except EIN reference number — not full tax data) |
| Can be shared externally | To CPA/tax advisor only; K-1s to LP for their own records (Classification 4 process); IRS/state taxing authorities as legally required |
| Approval before sharing | Kerry approval for any external share; CPA engagement letter required |
| Retention | 7 years from filing date minimum; indefinite for entity formation returns |
| Escalation if exposed | Notification to Kerry; CPA notification; IRS Identity Protection PIN request if SSN/EIN exposed |

**Examples:** Fund entity tax returns (Forms 1065, 1120-S), K-1s, EIN assignment letters, state tax filings, tax elections (e.g., S-corp election), depreciation schedules, cost basis records.

---

### Classification 9 — Compliance Records

**Definition:** Records required by regulatory bodies or internal compliance policy, including AML/KYC records, regulatory filings, audit records, and examination correspondence.

| Attribute | Rule |
|---|---|
| Who can access | Kerry (full); Agent 14 (compliance function); Agent 15 (audit function); outside compliance consultant (engagement-specific) |
| Which agents can use it | Agents 14 and 15 only |
| Where it can be stored | Supabase `compliance_reviews` and `audit_log` tables (RLS: `ceo_cio` and `auditor_readonly`); Google Drive `/16 - Compliance/` (Kerry + Agent 14/15 access); never in email without encryption |
| Can be shared externally | To regulators as legally required; to fund auditor per engagement; to legal counsel for regulatory matters |
| Approval before sharing | Kerry approval for all regulatory submissions; counsel review for examination responses |
| Retention | 5 years minimum from creation; 7 years for AML records; permanent for formal regulatory orders |
| Escalation if exposed | Immediate notification to Kerry; counsel notification within 4 hours; regulatory self-disclosure assessed by counsel |

**Examples:** KYC/AML documentation for LP onboarding, OFAC screening records, compliance training records, internal audit reports, regulatory exam correspondence, suspicious activity documentation, marketing review approvals.

---

### Classification 10 — Authentication Credentials

**Definition:** Passwords, API keys, OAuth tokens, MFA recovery codes, private keys, and any other authentication mechanism that grants system access.

| Attribute | Rule |
|---|---|
| Who can access | Kerry (all vaults); Kody (Team vault for operational tools only); TJ (specific tool credentials as assigned); agents and automations access credentials ONLY via environment variables — never directly |
| Which agents can use it | NO AGENT sees credentials. Agents call services via pre-authenticated connections configured in n8n. Credentials are never passed through agent context or prompts |
| Where it can be stored | 1Password — appropriate vault only. Nowhere else. Not in code, not in .env files committed to GitHub, not in Supabase, not in Airtable, not in any document |
| Can be shared externally | Never. If a vendor needs a credential, create a service account with minimum scope specifically for them — do not share a credential |
| Approval before sharing | N/A — sharing credentials is never appropriate; create new credentials instead |
| Retention | Active until rotated; rotated credentials destroyed immediately |
| Escalation if exposed | Rotate credential immediately (before investigating cause); notify Kerry; review all access logs since potential exposure; assess scope of potential unauthorized access |

**Examples:** Supabase service role key, Anthropic API key, n8n database password, PropStream API key, HouseCanary API key, ATTOM API key, Airtable API key, DocuSign OAuth token, Gmail OAuth credentials, MFA recovery codes.

**Hard rules:**
- Every credential has a rotation schedule (see Credential Management Standards section).
- Credentials in GitHub are an immediate incident — rotate before the next commit.
- API keys are never passed as arguments in agent prompts — environment variables only.
- When a team member or vendor relationship ends, all their credentials are revoked within 4 hours.

---

## Platform Access Controls

### 1Password

**Plan:** 1Password Teams (minimum) or Business (Stage 2+)

**Vault Structure:**

| Vault | Contents | Who Has Access |
|---|---|---|
| Shared — Operations | Operational tool logins (PropStream, Airtable, n8n, GitHub, Google Workspace) | Kerry, Kody (role-appropriate items) |
| Shared — Agent Services | API keys for Anthropic, Supabase, HouseCanary, ATTOM, PropStream, DocuSign, Gmail MCP | Kerry only (n8n loads via env vars; agents never access directly) |
| Wire Instructions | Fund bank account details, wire instructions for known vendors | Kerry only — no sharing |
| Legal | Counsel login credentials, legal portal access | Kerry only |
| Recovery | MFA recovery codes, emergency access passwords | Kerry only — backup stored encrypted offline |

**Security settings (enforce in 1Password admin):**
- Minimum Master Password length: 20 characters
- Secret Key required for all new device authorizations
- MFA required for all team members (TOTP minimum; YubiKey preferred for Kerry)
- Travel Mode enabled when Kerry travels internationally (hides Wire Instructions and Legal vaults)
- Watchtower enabled — alerts on compromised, weak, or reused passwords
- Account recovery: Kerry holds recovery kit; stored in secure physical location (not digitally)
- Session timeout: 4 hours inactivity

**Credential rotation schedule in 1Password:**

| Credential Type | Rotation Frequency |
|---|---|
| Supabase service role key | Every 90 days |
| Anthropic API key | Every 90 days |
| n8n webhook signing secrets | Every 90 days |
| Vendor API keys (ATTOM, HouseCanary, PropStream) | Annually or upon staff change |
| Gmail OAuth tokens | Per Google's token expiry (monitored by Agent 18) |
| DocuSign OAuth | Per DocuSign token expiry |
| Operational tool passwords | Every 180 days |
| MFA recovery codes | Upon any device change |

---

### MFA Requirements

**MFA is mandatory on every system. No exceptions.**

**Acceptable MFA methods (in preference order):**

| Method | Security Level | Acceptable For |
|---|---|---|
| Hardware security key (YubiKey 5) | Highest | All systems — preferred for Kerry on all Confidential and above |
| TOTP authenticator app (Authy, Google Authenticator, 1Password TOTP) | High | All systems — minimum acceptable for all team members |
| Push notification (Duo, Okta) | Medium | Internal tools only where TOTP is not available |
| SMS one-time code | Low — NOT acceptable | Never — SMS is vulnerable to SIM swapping |

**MFA-required systems (hard list — no system in this list may be accessed without MFA):**

- Gmail / Google Workspace
- Google Drive
- Supabase (dashboard and direct DB access)
- Airtable
- GitHub
- Anthropic Console
- n8n (self-hosted admin panel and cloud)
- DocuSign
- 1Password
- PropStream
- ATTOM API portal
- HouseCanary API portal
- Any banking or financial institution portal
- Any title or settlement platform

**MFA setup verification:** Agent 15 verifies MFA is active on all required systems during quarterly security review.

---

### Supabase Row-Level Security (RLS)

**Eight database roles with the following permissions:**

| Role | Assigned To | Access Level |
|---|---|---|
| `ceo_cio` | Kerry's direct DB connection | SELECT on all tables; INSERT/UPDATE on approved tables; no DELETE |
| `controller` | Kody's operations | SELECT/INSERT/UPDATE on accounting tables; SELECT on workflow tables; no access to borrower NPI tables or LP tables |
| `operations` | TJ's limited access | SELECT/INSERT/UPDATE on task and workflow tables only; no access to financial, borrower, or LP tables |
| `investor` | LP portal (future build) | SELECT own records only in `lp_investors` and `capital_accounts`; no access to other LP records |
| `agent_service` | All 18 agents (shared service role) | INSERT/UPDATE on assigned tables per agent function; no DELETE; no access to wire-related or credential tables |
| `n8n_service` | n8n automation service account | INSERT/UPDATE on workflow, task, and log tables; no financial or LP tables |
| `powerbi_readonly` | Power BI connection | SELECT on non-sensitive reporting tables; excludes `borrowers`, `lp_investors`, `capital_accounts` |
| `auditor_readonly` | Agent 15, external auditor | SELECT all tables; no writes; includes `audit_log` and `compliance_reviews` |

**Table-level RLS additions beyond role defaults:**

| Table | Restriction |
|---|---|
| `borrowers` | `agent_service` SELECT limited to specific agent IDs (03, 05, 06, 07); `powerbi_readonly` excluded |
| `lp_investors`, `capital_accounts` | `agent_service` limited to Agents 10, 16, 17; no bulk SELECT — row-level filter by `agent_id` in context |
| `audit_log` | No UPDATE or DELETE by any role; INSERT by `agent_service` and `n8n_service` only |
| `agent_logs` | Append-only — no UPDATE or DELETE by any role |
| `approvals` | `agent_service` INSERT only; UPDATE (status change) by `ceo_cio` only |
| Wire-related data | Not stored in Supabase — no table exists |
| Credentials | Not stored in Supabase — no table exists |

**Appendix-only enforcement (critical tables):**
```sql
-- Applied to audit_log, agent_logs, and all compliance tables
CREATE POLICY "no_update" ON [table] FOR UPDATE USING (false);
CREATE POLICY "no_delete" ON [table] FOR DELETE USING (false);
```

**RLS audit:** Agent 15 runs a quarterly RLS policy audit — verifies no policy has been modified, widened, or removed since last review. Results logged to `compliance_reviews`.

---

### GitHub

**Repository structure:**

| Repo | Contents | Access |
|---|---|---|
| `pinnacle-note-fund-ai-os` | AI OS documentation, agent configs, workflow specs | Kerry (Owner), Kody (Write), TJ (Read) |
| `pinnacle-infrastructure` | n8n workflow exports, deployment scripts, Supabase migrations | Kerry (Owner), Kody (Write) — no TJ access |
| Future: application code | If web portal or automation code is built | Per project |

**Branch protection rules (enforce on `main`):**
- No direct push to `main` — all changes via pull request
- Minimum 1 reviewer required (Kerry reviews all PRs touching infrastructure or security)
- Status checks must pass before merge
- Delete branch after merge

**Security rules:**
- `.gitignore` must include: `.env`, `.env.*`, `*.key`, `*.pem`, `*credentials*`, `*secret*`
- GitHub Actions secrets (not hardcoded) for any CI/CD credentials
- Dependabot enabled for any repos with package dependencies
- Secret scanning enabled — GitHub alerts on any committed credential
- If credential is committed: rotate the credential immediately before investigation

**Permissions table:**

| Action | Kerry | Kody | TJ | External |
|---|---|---|---|---|
| Create repos | Yes | No | No | No |
| Push to main | No (PR required) | No | No | No |
| Create PRs | Yes | Yes | Yes | No |
| Review + merge PRs | Yes | Yes (non-security) | No | No |
| Manage secrets | Yes | No | No | No |
| View private repos | Yes | Yes | Limited | No |

---

### Airtable

**Workspace permissions:**

| Role | Who | What They Can Do |
|---|---|---|
| Owner | Kerry | Full control — all bases, all tables, all views, all automations; can share externally |
| Creator | Kody | Create and edit tables/views/automations; cannot delete bases or share externally |
| Commenter | TJ | View all assigned records, add comments, update status on assigned tasks; cannot create/delete records, tables, or views |
| No access | LPs, vendors, external parties | No Airtable access — data delivered via PDF or Box link only |

**Data handling rules:**
- Borrower NPI is NOT stored in Airtable — operational data only (loan ID, status, workflow flags)
- LP identities are NOT stored in Airtable — LP table contains reference ID linked to Supabase
- Wire instructions are never entered into Airtable
- All Airtable automations use webhook triggers to n8n — no Airtable automation directly modifies Supabase
- Airtable API key stored in 1Password Agent Services vault; used by n8n only

**Base-level access restriction (within Airtable):**
- Kody has Creator access to all operational bases but Commenter-only on the LP Management base
- TJ has Commenter access only on bases relevant to his assigned tasks (determined by Kerry per project)

---

### Google Drive (Stage 1–2) / Box (Stage 2+ for LP and Legal data)

**Google Drive folder permissions model:**

| Folder | Kerry | Kody | TJ | Agents (service account) | LP / External |
|---|---|---|---|---|---|
| `/01 - Fund Documents` | Owner | Editor | Viewer | Upload only | No |
| `/02 - LP Management` | Owner | No access | No access | Read/upload (Agent 05, 16, 17) | No |
| `/03 - Acquisitions` | Owner | Editor | Viewer | Upload only | NDA-gated Viewer |
| `/05 - Due Diligence` | Owner | Editor | Viewer | Upload only | No |
| `/06 - Closings` | Owner | Editor | No access | Upload only | No |
| `/07 - Loan Files` | Owner | Editor | No access | Upload only | No |
| `/08 - Servicer` | Owner | Editor | No access | Upload only | No |
| `/09 - Legal` | Owner | No access | No access | No | No |
| `/10 - Tax Records` | Owner | No access | No access | No | No |
| `/11 - Financial` | Owner | Editor | No access | Read only | No |
| `/16 - Compliance` | Owner | No access | No access | Read/upload (Agent 14, 15) | No |

**External sharing rules:**
- Default: All folders are private — sharing disabled for unauthenticated links
- Any external share requires Kerry approval and uses time-limited, specific-person share links (not "anyone with link")
- LP data room (Box, Stage 2+): LP receives specific file access only — no folder-level access; Box track-and-confirm delivery settings enabled

**Google Drive security settings (enforce in Workspace admin):**
- External sharing: Restricted — only Kerry can enable external shares
- Download, print, copy disabled on all Confidential and above documents shared externally
- Audit log: Google Workspace audit log enabled for all file access events — reviewed by Agent 15 quarterly
- Drive for Desktop: Enabled for Kerry only; Kody and TJ use web browser access

**Box (Stage 2+ LP and Legal data):**
- NDA workflow enforced before LP is granted data room access
- Watermarking on all documents downloaded from LP data room
- Access expiry: LP data room access expires 30 days after subscription close; re-enabled per legal requirement
- Full activity log: Box records every view, download, and share — exported to compliance records quarterly

---

### DocuSign

**Account roles:**

| Role | Who | Capability |
|---|---|---|
| Admin | Kerry | Full account control; manage templates; view all envelopes |
| Sender | Kody | Send envelopes from approved templates only; cannot create or modify templates |
| Viewer | TJ | View completed documents; cannot send |
| Signer | LPs, Vendors, Counsel | Sign only — no account access |

**Envelope rules (hard requirements):**
- All envelopes use pre-approved templates — no ad hoc fields added outside template review
- Wire instructions are never included in any envelope — not in documents, not in DocuSign fields, not in messages
- Borrower SSN is never included in any envelope
- All envelopes require at minimum Kerry's co-review before sending to any external party
- Completed envelopes are automatically filed to Google Drive via n8n Automation within 15 minutes of completion
- Envelope access: Completed envelopes are accessible to Kerry (Admin) and the sender only — not TJ unless he was a recipient

**Signing order enforcement:**
- All subscription agreements: LP signs first, Kerry countersigns — prevents Kerry signature appearing on unsigned docs
- All vendor agreements: Vendor signs first, Kerry countersigns
- NDAs: External party signs first, Kerry countersigns

**DocuSign audit trail:** All envelope events (created, sent, viewed, signed, completed, voided) are logged in DocuSign's built-in audit trail. Agent 15 exports this log quarterly and files to `/16 - Compliance/DocuSign Logs/`.

---

### Audit Logs

**All audit records are append-only. No UPDATE or DELETE is permitted on any audit table by any role.**

**Supabase `audit_log` table — captures:**

| Event Type | Fields Logged |
|---|---|
| Agent session | `agent_id`, `session_id`, `start_time`, `end_time`, `task_type`, `tables_accessed` |
| Data access (Confidential+) | `role`, `table_name`, `row_id`, `action` (SELECT/INSERT/UPDATE), `timestamp` |
| Approval granted/denied | `approval_id`, `approved_by`, `status`, `timestamp`, `decision_notes` |
| Automation execution | `automation_id`, `trigger`, `steps_completed`, `human_gate_status`, `timestamp` |
| Failed access attempt | `role`, `table_name`, `error_code`, `timestamp` |
| Credential rotation | `credential_type` (no value — name only), `rotated_by`, `timestamp` |

**Platform audit logs (external — exported quarterly to Drive):**

| Platform | Log Type | Review Frequency |
|---|---|---|
| 1Password | Vault access log — who accessed which vault, which item, when | Monthly |
| GitHub | Repository access log — all commits, PRs, secret access | Monthly |
| Google Workspace | File access log — all Drive file views, downloads, shares | Monthly |
| Airtable | Activity log — all record changes, automation triggers | Quarterly |
| DocuSign | Envelope history — all signing events | Quarterly |
| n8n | Execution logs — all automation runs (NPI redacted before log) | Monthly |

**Log retention:**
- Supabase `audit_log`: 7 years minimum — RLS enforces no DELETE
- Platform logs (exported PDFs): 5 years minimum in `/16 - Compliance/Audit Logs/`
- Compliance-related logs: 7 years

---

## Agent Access-Control Matrix

**Access levels defined:**

| Symbol | Meaning |
|---|---|
| FULL | Agent can read, write, and include in outputs — within assigned task scope |
| READ | Agent can read but cannot include in external outputs or communications |
| ANON | Agent can access aggregated or anonymized data only — no individual records |
| NONE | No access — agent must not receive, process, or reference this data type |

**Data classification abbreviations:**

| # | Abbreviation | Full Name |
|---|---|---|
| 1 | PUB | Public |
| 2 | INT | Internal |
| 3 | CONF | Confidential |
| 4 | LP | Investor Confidential |
| 5 | NPI | Borrower NPI |
| 6 | WIRE | Bank and Wire Information |
| 7 | LEGAL | Legal Privileged |
| 8 | TAX | Tax Information |
| 9 | COMP | Compliance Records |
| 10 | AUTH | Authentication Credentials |

---

### Matrix

| Agent | PUB | INT | CONF | LP | NPI | WIRE | LEGAL | TAX | COMP | AUTH |
|---|---|---|---|---|---|---|---|---|---|---|
| **01 — Chief Operating Coordinator** | FULL | FULL | READ | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| **02 — Acquisitions + Seller Relations** | FULL | FULL | READ | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| **03 — Credit Underwriting** | FULL | FULL | FULL | NONE | READ | NONE | NONE | NONE | NONE | NONE |
| **04 — Pricing + Tape Analytics** | FULL | FULL | FULL | NONE | ANON | NONE | NONE | NONE | NONE | NONE |
| **05 — Diligence, Collateral, Closing** | FULL | FULL | FULL | NONE | READ | NONE | NONE | NONE | NONE | NONE |
| **06 — Performing Portfolio + Cashflow** | FULL | FULL | FULL | NONE | READ | NONE | NONE | NONE | NONE | NONE |
| **07 — Workout, Loss Mitigation, REO** | FULL | FULL | FULL | NONE | READ | NONE | NONE | NONE | NONE | NONE |
| **08 — Servicer + Counsel Oversight** | FULL | FULL | READ | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| **09 — QA + Exceptions** | FULL | FULL | READ | NONE | READ | NONE | NONE | NONE | READ | NONE |
| **10 — Fund Controller + SPV Accounting** | FULL | FULL | FULL | READ | NONE | NONE | NONE | READ | NONE | NONE |
| **11 — Cash Controls + Distributions + Treasury** | FULL | FULL | FULL | NONE | NONE | NONE | NONE | NONE | NONE | NONE |
| **12 — Capital Markets + Facility + Securitization** | FULL | FULL | FULL | ANON | ANON | NONE | NONE | NONE | NONE | NONE |
| **13 — Risk + Stress Testing** | FULL | FULL | FULL | NONE | ANON | NONE | NONE | NONE | READ | NONE |
| **14 — Compliance + Marketing + Disclosure** | FULL | FULL | READ | NONE | NONE | NONE | NONE | NONE | FULL | NONE |
| **15 — Conflicts, Audit, Governance** | FULL | FULL | READ | NONE | NONE | NONE | NONE | NONE | FULL | NONE |
| **16 — Investor Relations + Sales** | FULL | FULL | READ | FULL | NONE | NONE | NONE | NONE | NONE | NONE |
| **17 — DDQ + Data Room + Investor Reporting** | FULL | FULL | READ | FULL | NONE | NONE | NONE | NONE | NONE | NONE |
| **18 — Data, Automation, Dashboards, Security** | FULL | FULL | READ | NONE | ANON | NONE | NONE | NONE | READ | NONE |

---

### Agent Access Annotations

**Agent 01 (Chief Operating Coordinator):**
- Orchestrates other agents but does not directly handle sensitive data
- Can read task status, workflow state, and operational metrics
- Cannot access any financial, LP, borrower, wire, or legal data directly
- Escalates all sensitive decisions to appropriate specialized agent or Kerry

**Agent 02 (Acquisitions + Seller Relations):**
- Reads Confidential data for context (deal pipeline, pricing targets, bid strategy) but cannot output financial specifics externally
- Tape data processed as Internal — borrower fields on tape are excluded from Agent 02 context (Agent 04 handles tape analytics)
- Seller communications are drafted by Agent 02 and reviewed by Kerry before sending

**Agent 03 (Credit Underwriting):**
- Has READ access to Borrower NPI — minimum fields needed for underwriting (credit, payment history, income)
- NPI is redacted in `agent_logs` — only loan_id is logged, not borrower identifiers
- Agent 03 never outputs NPI in any external communication draft — outputs underwriting conclusions only
- No LP data access — underwriting is collateral-focused, not LP-focused

**Agent 04 (Pricing + Tape Analytics):**
- Receives ANON borrower data — loan characteristics (UPB, rate, LTV) without identifying fields (no SSN, name, address if separable)
- In Stage 1, tapes may arrive with borrower info mixed in — Agent 04 must operate on property/loan data only; borrower fields stripped by n8n pre-processing before agent context
- Confidential FULL access for pricing models, bid strategy, market data

**Agent 05 (Diligence, Collateral, Closing):**
- READ access to Borrower NPI for closing coordination (must know loan details to coordinate title and closing)
- NPI fields limited to loan-related information — not general personal data beyond what's on the closing docs
- Files documents to Google Drive but does not read or output documents classified above Internal in agent outputs

**Agent 06 (Performing Portfolio + Cashflow):**
- READ access to Borrower NPI — payment history and account status for portfolio monitoring
- Uses borrower payment data to compute cashflow projections; never outputs individual borrower data
- No LP access — portfolio performance reported at fund level only by this agent

**Agent 07 (Workout, Loss Mitigation, REO):**
- READ access to Borrower NPI — requires borrower contact info, financial hardship data, and modification history for workout strategy
- Agent 07 drafts borrower communication strategies but never sends directly — all borrower communications route through servicer after Kerry approval
- Legal privileged NONE — receives only non-privileged FC process information (timelines, cost estimates); privileged FC strategy lives with Kerry and counsel

**Agent 08 (Servicer + Counsel Oversight):**
- Coordinates with servicer and FC counsel but does not directly handle borrower NPI or legal privileged content
- Reviews servicer reports (which may contain aggregate NPI) but does not extract individual borrower data into its outputs
- Legal privileged NONE — summarizes publicly available FC process information; privileged counsel communications are not in agent context

**Agent 09 (QA + Exceptions):**
- READ access to Borrower NPI only for QA verification — confirms data completeness, flags missing fields
- Agent 09 outputs identify data quality issues by loan_id only; does not output NPI values in its logs
- READ access to Compliance Records for audit consistency checking

**Agent 10 (Fund Controller + SPV Accounting):**
- FULL access to Confidential financial data — fund financials, distribution calculations, capital accounts
- READ access to Investor Confidential — needs LP capital account data for accounting entries; does not output LP identities
- READ access to Tax data — uses tax-relevant figures for accounting entries; does not prepare or output tax returns
- Wire information NONE — Agent 10 creates distribution schedules showing amounts; actual wire execution is Kerry-only

**Agent 11 (Cash Controls + Distributions + Treasury):**
- FULL access to Confidential financial data — cash positions, liquidity forecasts, distribution calculations
- Wire information NONE — Agent 11 calculates distribution amounts and creates the distribution package; wire execution is human-only
- Agent 11's outputs include amounts and payee reference IDs — never bank account numbers or routing numbers

**Agent 12 (Capital Markets + Facility + Securitization):**
- ANON access to LP data — for facility reporting uses aggregate LP capital data, not individual LP identity
- ANON access to Borrower NPI — for securitization pool analysis uses loan characteristics, not borrower PII
- Full Confidential access for fund-level metrics, facility terms, and capital structure

**Agent 13 (Risk + Stress Testing):**
- ANON access to Borrower NPI — risk analytics use loan characteristics (LTV, state, UPB, delinquency status) without borrower identity
- READ access to Compliance Records — reads risk limit compliance status; does not generate compliance records
- Full Confidential access for risk metrics, stress scenarios, and portfolio analytics

**Agent 14 (Compliance + Marketing + Disclosure):**
- FULL access to Compliance Records — this is the agent's core function; generates, reviews, and logs compliance records
- READ access to Confidential — reviews fund materials for compliance; does not generate financial disclosures independently
- No LP, NPI, wire, legal, or tax access — compliance function is process-focused, not data-focused

**Agent 15 (Conflicts, Audit, Governance):**
- FULL access to Compliance Records — audit and governance oversight
- READ access to Confidential — reviews for conflicts of interest; does not generate Confidential data
- READ access across all operational data in `auditor_readonly` role — for audit completeness
- No LP, NPI, wire, legal, or tax direct access — reviews audit trails, not underlying sensitive data
- All Agent 15 outputs are Internal or Compliance Records — never outputs underlying data it reviews

**Agent 16 (Investor Relations + Sales):**
- FULL access to Investor Confidential — LP communications, capital account status, onboarding data
- No NPI, wire, legal, or tax access — LP relationship does not require borrower or fund legal data
- Drafts all LP communications; Kerry reviews and approves before any LP-facing output is sent

**Agent 17 (DDQ + Data Room + Investor Reporting):**
- FULL access to Investor Confidential — prepares LP reports, DDQ responses, data room documents
- READ access to Confidential — uses fund-level metrics in LP reports; cannot output individual portfolio loan details to LPs
- No NPI access — LP reports use portfolio aggregates only; no individual loan disclosure without counsel review
- All LP-facing outputs require Kerry approval before release (Supabase approval record required)

**Agent 18 (Data, Automation, Dashboards, Security):**
- READ access to Confidential — for data pipeline validation and dashboard configuration
- ANON access to Borrower NPI — for data quality monitoring; pipeline handles loan_ids and field types, not borrower values
- Authentication credentials NONE — Agent 18 configures data pipelines but never receives actual credentials in its context; credentials are environment variables in n8n, not in agent prompts
- No LP, wire, legal, or tax access — infrastructure function is system-level, not data-level

---

## Credential Management Standards

### 1Password Vault Governance

**Vault creation authority:** Kerry only. Vaults cannot be created by any team member without Kerry's authorization.

**Item creation:**
- Any new API key, service account, or system credential is entered into 1Password before being used in any system
- Credential name format: `[System] — [Purpose] — [Environment]` (e.g., `Supabase — Service Role Key — Production`)
- All credentials tagged with creation date and rotation due date
- Credential notes field: document which systems use this credential, so rotation is complete

**Access grants to team members:**
- Kerry reviews and approves all 1Password access grants
- Access is granted at vault level, not item level (1Password architecture)
- When a team member's role changes, vault access is reviewed within 48 hours

**Rotation protocol:**
1. Create new credential in the target system
2. Update 1Password immediately — new value, update rotation date
3. Update all systems using the old credential (n8n environment variables, etc.)
4. Verify all systems function with new credential
5. Revoke old credential in target system
6. Log rotation event in Supabase `audit_log`

**Emergency rotation (credential exposed):**
1. Revoke old credential in target system immediately — before investigation
2. Create new credential
3. Update 1Password and all downstream systems
4. Log incident in Supabase `audit_log` and `agent_logs`
5. Investigate scope of exposure
6. Notify Kerry (if he is not the one rotating)

### n8n Environment Variable Management

All credentials used by n8n automations are stored as environment variables in n8n's credential store — never in workflow node configurations as plain text.

**n8n credential pattern:**
```
n8n Credential Type: [Service Name]
Name: [Descriptive Name]
Value: Loaded from environment variable (set at n8n startup from 1Password)
```

**Never in n8n workflow JSON:**
- API keys
- Passwords
- Bearer tokens
- Database connection strings with passwords

**n8n workflow exports (to GitHub):**
- Credentials are referenced by name only in exported workflow JSON
- Credential values are never exported with workflows
- Exported workflows reviewed by Agent 15 quarterly to verify no credential values present

---

## Vendor Access Governance

### Before Granting Any Vendor Access

1. **NDA executed** — stored in DocuSign and filed to `/17 - Vendor Agreements/NDAs/`
2. **Minimum necessary scope defined** — specify exactly which data, folders, or systems the vendor needs
3. **Access duration defined** — set an end date; access is not indefinite
4. **Kerry approval** — all vendor access grants require Kerry's written approval (Supabase approval record)
5. **Vendor access logged** in Supabase `vendor_relationships` table

### Access by Vendor Type

| Vendor Type | Data They Receive | Access Method | NPI Shared? | Duration |
|---|---|---|---|---|
| BPO vendors | Property address only; no borrower identity | Email order; PDF report returned | No | Per order |
| Title company | Closing package (includes some borrower info per state requirements) | Secure portal or encrypted email per their platform | Limited — per closing | Per transaction |
| FC counsel | FC file per engagement (includes borrower NPI) | Counsel's secure client portal; never plain email | Yes — per engagement | Duration of matter |
| CPA / Tax advisor | Tax records per engagement | CPA's secure portal | Yes — fund and LP tax data | Engagement period |
| Compliance consultant | Internal policies, compliance records | Google Drive time-limited share (no download) or Box | No | Engagement period |
| Fund auditor | Financial records per audit scope | Box data room (Stage 2+) or secure email | Anonymized loan data only | Audit period |
| PropStream / ATTOM / HouseCanary | No data from us — they provide data to us | API (they receive property address for lookup) | No | Subscription period |
| n8n / Airtable / Supabase (SaaS platforms) | Data stored on their servers per ToS | Standard SaaS — review DPA for each | Yes — encrypted at rest | Subscription period |

### Vendor Access Revocation

Trigger revocation within 24 hours when:
- Engagement or project ends
- Vendor relationship is terminated
- Vendor fails security requirements
- Suspected vendor breach

**Revocation steps:**
1. Revoke Google Drive / Box share link
2. Revoke any API key or service account issued to vendor
3. Remove vendor from any Airtable or GitHub access
4. Update `vendor_relationships` table in Supabase (access_end_date)
5. Log in `audit_log`
6. Verify vendor has returned or destroyed any data per NDA requirements (send written confirmation request)

### Third-Party SaaS Data Processing Agreements

All SaaS platforms that handle fund data classified Confidential or above must have a signed Data Processing Agreement (DPA) on file. DPA stored at `/17 - Vendor Agreements/DPAs/`.

Required DPA review before any platform handles NPI:
- Confirm platform has SOC 2 Type II or equivalent
- Confirm data residency (US-based preferred)
- Confirm encryption at rest and in transit
- Confirm breach notification timeline (must be ≤72 hours)

---

## Incident Response and Breach Escalation

### Incident Classification

| Severity | Definition | Response Time |
|---|---|---|
| P1 — Critical | Wire fraud, bank account compromise, borrower NPI exposed externally, LP data breach | Immediate — within 1 hour |
| P2 — High | API key exposed, system credential compromised, Confidential data shared without authorization | Within 4 hours |
| P3 — Medium | Internal data shared with wrong team member, MFA bypassed, unauthorized Supabase access | Within 24 hours |
| P4 — Low | Policy deviation with no data exposure, weak password identified, expired MFA recovery code | Within 72 hours |

### Escalation Path by Incident Type

**Wire fraud or attempted wire fraud:**
1. Contact financial institution immediately — initiate wire recall if sent
2. Notify Kerry (if he is not already aware)
3. Contact FBI Internet Crime Complaint Center (IC3) — ic3.gov
4. Contact legal counsel within 1 hour
5. Preserve all evidence — do not delete emails, messages, or logs
6. Document full incident timeline in `incident_reports` folder in Drive

**Borrower NPI exposed:**
1. Notify Kerry immediately
2. Legal counsel within 2 hours
3. Counsel assesses GLBA breach notification obligations (state-specific)
4. Affected borrowers notified per counsel's direction and applicable law
5. Agent 15 logs full incident in `compliance_reviews`
6. Assess which systems were involved; contain exposure

**LP investor data exposed:**
1. Notify Kerry immediately
2. Legal counsel within 4 hours
3. Assess whether SEC notification is required (if fund is registered)
4. Affected LP(s) notified per counsel's direction
5. Agent 15 logs full incident in `compliance_reviews`

**API key or authentication credential exposed:**
1. Rotate credential immediately — before investigation
2. Review all access logs since potential exposure date
3. Assess what actions were taken with compromised credential
4. Notify Kerry
5. If third-party system involved (e.g., Anthropic API key exposed), notify that provider
6. Log in `audit_log`

**Unauthorized internal access (wrong team member accesses data they should not have):**
1. Revoke the unauthorized access
2. Notify Kerry
3. Review what data was accessed
4. If Confidential or above: counsel notification; determine if any disclosure obligation
5. Agent 15 reviews and tightens access controls

### Post-Incident Requirements

All P1 and P2 incidents require a written incident report filed within 7 days of resolution:
- Timeline of events
- Root cause analysis
- Data potentially exposed (type, volume, recipients)
- Remediation steps taken
- Policy or control changes implemented to prevent recurrence

Filed at: `/16 - Compliance/Incident Reports/INCIDENT-[YYYY-MM-DD]-[brief-description].pdf`

---

## Periodic Review Requirements

**Agent 15 executes all periodic reviews. Results logged in `compliance_reviews`.**

### Monthly Reviews

| Review | Scope | Owner |
|---|---|---|
| 1Password access log | Who accessed what — flag any anomalies | Agent 15 |
| n8n execution logs | Verify no credential values in logs; confirm all approval gates fired | Agent 18 |
| GitHub audit log | Review all commits, PRs, any access pattern changes | Agent 15 |
| Failed Supabase access attempts | Review all `403` and RLS violations in audit_log | Agent 15 |

### Quarterly Reviews

| Review | Scope | Owner |
|---|---|---|
| Full RLS policy audit | Verify all 25+ tables have correct policies; no unexpected changes | Agent 15 |
| Agent access validation | Confirm each agent's session context does not exceed its data classification access | Agent 15 |
| Vendor access audit | Confirm all active vendor access is current and authorized; revoke expired access | Agent 15 |
| MFA verification | Confirm MFA is active on all required systems for all team members | Agent 15 |
| Credential rotation check | Confirm all credentials are within rotation schedule | Agent 18 |
| Google Drive / Box permissions audit | Review all shared links and external collaborators | Agent 15 |
| DocuSign envelope audit | Review all envelopes sent in the quarter; confirm no NPI or wire data in envelopes | Agent 15 |
| Airtable activity review | Review automation logs and field change history | Agent 15 |

### Annual Reviews

| Review | Scope | Owner |
|---|---|---|
| Full security posture review | All platforms, all policies, all agent access controls — present to Kerry | Agent 15 |
| Data classification review | Confirm all data categories are still correctly classified | Agent 15 + Kerry |
| Vendor DPA review | Confirm all SaaS platforms have current DPAs; review for any changes to their security posture | Agent 15 |
| Incident retrospective | Review all incidents from the year; identify systemic issues | Agent 15 + Kerry |
| Policy updates | Update this document for any changes to platforms, team, agents, or regulatory requirements | Agent 15 |

---

*This document is Confidential (Classification 3). It may not be shared externally without Kerry Kelley Jr's written approval. Any suspected violation of the controls in this document is a security incident — escalate immediately per the Incident Response section.*
