# Security Requirements — The Pinnacle Note Fund AI OS

**Document:** Security Standards and Requirements
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security) + Agent 15 (Conflicts, Audit Controls & Governance)
**Last Updated:** 2026-05-08
**Review Frequency:** Quarterly (Agent 15 quarterly control test includes security audit)

---

## Security Principles

1. **Least Privilege.** Every user, agent, and integration gets the minimum access required to do their job — nothing more.
2. **Defense in Depth.** Security is enforced at multiple layers: credential management (1Password), authentication (MFA), database (RLS + RBAC), network (TLS), and monitoring (audit logs).
3. **Zero Trust.** No system or user is trusted by default. All access requires authentication. Internal network access is not assumed safe.
4. **Audit Everything.** Every access event, data change, and agent action is logged. Logs are tamper-resistant and reviewed regularly.
5. **Credential Hygiene.** No credentials in code, spreadsheets, email, or plain text. 1Password is the only place credentials live.

---

## 1. Credential Management — 1Password

### Requirements

**All team members must:**
- Have a 1Password account provisioned by the Standard Black administrator (Kerry)
- Use 1Password for every password to every fund system — no exceptions
- Use 1Password's password generator (20+ character random passwords) for all new accounts
- Never share passwords outside 1Password vaults
- Enable emergency access only for designated backup contact

**Vault Structure:**
| Vault | Contents | Access |
|---|---|---|
| Fund Operations | Supabase project credentials, Airtable API keys, n8n credentials | Kerry, Controller |
| API Keys | Anthropic API key, PropStream API key, DocuSign credentials, GitHub token | Kerry, Agent 18 operator |
| System Credentials | Google Workspace admin, Power BI admin | Kerry |
| Investor Data | No credentials — contains investor contact info (handled separately via Supabase RLS) | Kerry |
| Team Shared | Shared tools team members can access (non-sensitive fund systems) | Kerry, Kody, TJ |

**API Key Rotation Schedule:**
- Anthropic API key: rotate every 180 days
- Supabase service role keys: rotate every 90 days
- n8n integration credentials: rotate every 90 days
- All other API keys: rotate every 180 days or on personnel change (whichever comes first)

**Rotation Protocol:** When rotating a key, update 1Password first, then update all systems using the key (n8n environment variables, etc.), then revoke the old key. Log the rotation in the audit log.

---

## 2. Multi-Factor Authentication (MFA)

### Requirements

**MFA is mandatory on every fund system for every user.** No exceptions.

**Required MFA method:** Authenticator app (TOTP — Google Authenticator, Authy, or 1Password's built-in authenticator). SMS-based MFA is not acceptable on any fund system due to SIM swap risk.

**Hardware security key (YubiKey or equivalent):** Required for highest-risk access. Recommended for Phase 2+.

| System | MFA Required | Preferred Method |
|---|---|---|
| GitHub | Yes | Authenticator app |
| Supabase | Yes | Authenticator app |
| Airtable | Yes | Authenticator app |
| Google Workspace | Yes | Authenticator app + hardware key (Phase 2) |
| DocuSign | Yes | Authenticator app |
| Power BI / Microsoft 365 | Yes | Microsoft Authenticator |
| PropStream | Yes | Authenticator app |
| n8n Cloud | Yes | Authenticator app |
| Anthropic Console | Yes | Authenticator app |
| 1Password | Yes | Authenticator app + hardware key |

**MFA Backup Codes:** All MFA backup codes stored in 1Password (in the corresponding system's vault entry). Print backup codes for 1Password itself and store in a secure physical location (e.g., safe).

**MFA Enforcement Verification:** Agent 15 confirms MFA is active for all users on all systems during quarterly control tests. Any user found without active MFA is immediately escalated to CEO/CIO and access is suspended until resolved.

---

## 3. Supabase Row-Level Security (RLS)

### Requirements

**RLS is enabled on every table from day one.** No table may exist in the Supabase database without an active RLS policy. The default policy is deny-all — access must be explicitly granted.

**Role Definitions:**

| Role | Database Role | Access Level |
|---|---|---|
| CEO/CIO | `ceo_cio` | Read/write all tables (except direct write to `audit_log`) |
| Controller | `controller` | Read/write: `nav_history`, `investor_accounts`, `distributions`, `approvals`, `expenses`; Read: `assets`, `tapes` |
| Operations | `operations` | Read/write: `assets`, `tapes`, `acquisition_pipeline`, `exceptions`, `vendor_issues`; Read: `nav_history` |
| Investor | `investor` | Read only: own rows in `investor_accounts`, `distributions`; no access to other tables |
| Agent Service | `agent_service` | Write: table-specific (see tool_map_by_agent.md); Read: operational tables needed for agent sessions |
| n8n Service | `n8n_service` | Write: all operational tables; Read: all operational tables; No access: `audit_log` direct write (must go through Agent 15 workflow) |
| Power BI | `powerbi_readonly` | Read: all reporting tables; No write access whatsoever |
| Auditor | `auditor_readonly` | Read: all tables (annual audit engagement only; deprovisioned after audit) |

**RLS Policy Pattern (example for `assets` table):**
```sql
-- Row-level security on assets
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- CEO/CIO can read and write all rows
CREATE POLICY "ceo_cio_all" ON assets
  FOR ALL USING (auth.role() = 'ceo_cio');

-- Operations can read and write all rows
CREATE POLICY "operations_all" ON assets
  FOR ALL USING (auth.role() = 'operations');

-- Agent service can write and read
CREATE POLICY "agent_service_all" ON assets
  FOR ALL USING (auth.role() = 'agent_service');

-- Power BI can read only
CREATE POLICY "powerbi_read" ON assets
  FOR SELECT USING (auth.role() = 'powerbi_readonly');

-- No other roles have access (default deny)
```

**Sensitive Table Additional Controls:**

| Table | Additional Control |
|---|---|
| `investors` | Investor role can only read rows where `investor_id = auth.uid()` |
| `investor_accounts` | Same investor-scoped policy |
| `approvals` | No agent service write access — only human roles + n8n_service via approved workflow |
| `audit_log` | No direct write for any role except `audit_service` (a separate, dedicated service account); append-only |

**Quarterly RLS Audit:** Agent 15 reviews all RLS policies quarterly and confirms no policy has been modified or weakened since last audit.

---

## 4. Role-Based Access Control (RBAC)

### Requirements

RBAC is enforced at the application layer for every system, not just Supabase. The principle: define roles, assign users to roles, enforce access by role — never by individual.

**Fund Roles:**

| Role | Personnel | Systems Access |
|---|---|---|
| CEO/CIO | Kerry Kelley Jr | All systems — full administrative access |
| Controller | TBD (future hire) | Supabase (financial tables), Power BI, Google Drive (reporting), Airtable (financial views) |
| Operations | Kody Kelley | Supabase (operational tables), Airtable (pipeline/exceptions), Google Drive (portfolio docs) |
| Team Member | TJ Henry | Airtable (assigned views only), Google Drive (shared team folders), read-only |
| Investor | LP Investors | Investor data room (Google Drive — specific folders only), own records in Supabase (via investor portal — future) |
| Agent Service Account | System | Scoped Supabase access per INT-04 spec |

**System-Specific RBAC:**

**GitHub:**
- Admin: Kerry (organization owner)
- Write: Operations (Kody) — can create feature branches; no direct push to main
- Read: TJ — read-only repo access
- All production changes via PR → review → merge

**Airtable:**
- Workspace Owner: Kerry
- Creator: Kody (can build views, not bases)
- Commenter: TJ (can comment, not edit core fields)
- Read-only share links: Disabled on all sensitive bases

**Google Drive:**
- Owner: Kerry (Shared Drive admin)
- Content Manager: Kody, TJ (can add/edit files, not delete)
- Investor Data Room folders: Limited access — each investor sees only their own folder
- No "Anyone with link" sharing on any fund document

**Power BI:**
- Workspace Admin: Kerry
- Member (can publish): Operations lead when added
- Viewer: TJ (can view reports, not edit)
- Investor reports distributed as PDF only — investors do not get Power BI access

---

## 5. Data Classification and Handling

| Classification | Definition | Examples | Handling |
|---|---|---|---|
| Public | Information approved for public release | Fund marketing materials (post-compliance review) | May be shared externally after compliance clearance |
| Internal | Fund operational data — not for external distribution | Agent outputs, pipeline data, decision log | Accessible to team only; Supabase RLS enforced |
| Confidential | Sensitive fund and investor data | LP capital accounts, investor identities, financial statements | CEO/CIO + Controller access; encrypted at rest and in transit |
| Restricted | Highest sensitivity — regulatory, legal, personally identifiable | Investor SSNs, AML/KYC documents, wire instructions | Stored in encrypted vault; access logged every time; not in Supabase — in DocuSign / Google Drive with strict permissions |

**Data Transmission:** All data in transit uses TLS 1.2 minimum (TLS 1.3 preferred). No unencrypted transmission of Confidential or Restricted data.

**Data at Rest:** Supabase encrypts all data at rest (AES-256). Google Drive encrypts at rest. DocuSign encrypts at rest. 1Password encrypts locally.

**Wire Instructions:** Wire instructions (bank account numbers, routing numbers) are Restricted classification. They are:
- Never transmitted via email
- Shared only through DocuSign or 1Password secure sharing
- Verbally confirmed by the CEO/CIO before any wire is executed (call-back verification for new payees)

---

## 6. Agent Security Requirements

The 18 Anthropic Managed Agents are accessed via API. Security requirements for agent operations:

**API Key Security:**
- Anthropic API key stored in 1Password (`API Keys` vault)
- Injected into n8n as an environment variable — never hardcoded in workflows
- API key is scoped to the Anthropic organization; monitor usage in Anthropic console for anomalies

**Agent Session Security:**
- Every agent session input and output is logged in Supabase `agent_sessions` table
- Agent sessions are initiated only by n8n (automated) or by Kerry directly (manual session via API)
- No third party has access to initiate agent sessions

**Agent Data Access:**
- Agents receive data through their session input (prepared by n8n from Supabase)
- Agents do not have direct credentials to access Supabase — data is passed to them by n8n
- Agent outputs are returned to n8n for storage — agents do not write directly to any system
- This design means a compromised agent session cannot exfiltrate database credentials

**Principle of Human Authorization:**
- No agent may take any consequential action (wire authorization, investment approval, investor communication release) without a logged human approval in the `approvals` table
- n8n checks the `approvals` table before executing any downstream action triggered by agent output

---

## 7. Security Incident Response

**Incident Classification:**

| Severity | Description | Response Time |
|---|---|---|
| Critical | Unauthorized data access confirmed; API key compromised; wire fraud attempt | Immediate (within 1 hour) |
| Major | Suspected unauthorized access; anomalous access pattern; credential exposure | Within 4 hours |
| Minor | Failed login attempts; policy violation; access to wrong resource | Within 24 hours |

**Incident Response Protocol:**
1. **Detect** — Agent 18 monitors audit log; any anomaly flagged automatically via n8n alert
2. **Contain** — Revoke compromised credentials immediately; restrict access to affected system
3. **Escalate** — Notify CEO/CIO within 1 hour for Critical; within 4 hours for Major
4. **Document** — Log incident in Supabase `security_incidents` table and audit log immediately
5. **Investigate** — Determine scope: what was accessed, by whom, when, how
6. **Remediate** — Fix the vulnerability; rotate affected credentials; strengthen controls
7. **Report** — CEO/CIO determines if LP notification is required (if investor data was accessed)
8. **Review** — Post-incident review within 5 business days; update security controls if needed

**Investor Notification Standard:**
- If investor PII or financial data is confirmed accessed without authorization, CEO/CIO notifies affected investors promptly
- Notification drafted by Agent 16, reviewed by Agent 14, approved by CEO/CIO + legal counsel

---

## 8. Security Control Test Schedule (Agent 15)

| Control | Test Frequency | Method |
|---|---|---|
| MFA active for all users | Quarterly | Agent 15 reviews system admin panels; confirms MFA status per user per system |
| RLS policies unchanged | Quarterly | Agent 15 queries Supabase policy metadata; compares to approved baseline |
| API key rotation compliance | Quarterly | Agent 15 checks key creation dates in 1Password; flags overdue rotations |
| Agent session log completeness | Monthly | Agent 15 confirms all n8n workflow executions have corresponding `agent_sessions` entry |
| Data room access accuracy | Monthly | Agent 15 confirms Google Drive data room sharing matches authorized investor list in Supabase |
| Audit log integrity | Quarterly | Agent 15 confirms audit log is append-only; no rows deleted or modified |
| Wire dual-approval compliance | Quarterly | Agent 15 reviews all `distributions` entries; confirms every wire has dual-approval record in `approvals` |
| RBAC role assignments | Quarterly | Agent 15 audits user roles in Supabase, GitHub, Airtable, Google Drive; flags any role that should not exist |

**Target: Zero control failures at every quarterly test.**
