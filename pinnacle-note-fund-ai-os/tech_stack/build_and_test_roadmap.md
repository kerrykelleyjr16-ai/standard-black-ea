# Build and Testing Roadmap
# The Pinnacle Note Fund AI Operating System

**Document Version:** 1.0
**Last Updated:** 2026-05-09
**Maintained By:** Kerry Kelley Jr (build authority) | Agent 18 (technical execution)
**Status:** Sprint 1 complete (documentation phase). Sprint 2 ready to begin.

---

## Roadmap Overview

| Sprint | Focus | Duration | Status |
|---|---|---|---|
| 1 | Foundation — GitHub, folder structure, documentation, agent files, policies | 2 weeks | Complete |
| 2 | Supabase database schema, RLS, roles, seed data, Anthropic agent creation | 2 weeks | Not started |
| 3 | Airtable command center — all bases, views, interfaces, permissions | 2 weeks | Not started |
| 4 | n8n automations — tape intake, exception tracking, servicer reports, approval routing | 3 weeks | Not started |
| 5 | Power BI dashboards — executive, acquisitions, underwriting, portfolio, cash, risk | 2 weeks | Not started |
| 6 | Security hardening, document vault, DocuSign workflows, property data integrations, final testing | 2 weeks | Not started |

**Total estimated build time:** 13 weeks from Sprint 2 start
**Target system launch:** First live deal pipeline entry after Sprint 6 sign-off

**Build sequencing constraint:** Each sprint produces outputs that the next sprint depends on. Do not begin Sprint N+1 until Sprint N is at Definition of Done. Skipping ahead creates rework when the dependency is not ready.

---

## Sprint 1 — Foundation

### Goal
Establish the complete documentation foundation and repository structure so every subsequent sprint has a clear spec to build from. All architecture decisions are made in writing before any system is stood up.

**Status: Complete.** All Sprint 1 deliverables exist in `pinnacle-note-fund-ai-os/`.

---

### Tasks

- [x] Initialize GitHub repository (`pinnacle-note-fund-ai-os`)
- [x] Define full folder structure matching architecture spec
- [x] Write all 18 agent system prompt files
- [x] Write `agents_registry.md` with all agent IDs (pre-registration placeholders)
- [x] Write `create_agents.ps1` and `create_agents.sh` creation scripts
- [x] Write all 7 workflow SOP files
- [x] Write all 8 document templates
- [x] Write all 9 policy files
- [x] Initialize all 6 log files
- [x] Write `tech_stack/architecture.md`
- [x] Write `tech_stack/implementation_order.md`
- [x] Write `tech_stack/tool_map_by_agent.md`
- [x] Write `tech_stack/integration_map.md`
- [x] Write `tech_stack/security_requirements.md`
- [x] Write `tech_stack/build_roadmap.md` (original)
- [x] Write `tech_stack/supabase_database_schema.md`
- [x] Write `tech_stack/airtable_command_center.md`
- [x] Write `tech_stack/document_vault_and_data_room.md`
- [x] Write `tech_stack/n8n_automation_blueprint.md`
- [x] Write `tech_stack/power_bi_dashboard_system.md`
- [x] Write `tech_stack/property_data_stack.md`
- [x] Write `tech_stack/security_and_access_controls.md`
- [x] Configure `.gitignore` to exclude `.env`, API keys, credentials
- [x] Set branch protection on `main` (no direct push; PR required)

---

### Files Affected

All files in `pinnacle-note-fund-ai-os/` — 70+ files across `agents/`, `workflows/`, `templates/`, `policies/`, `logs/`, `dashboards/`, and `tech_stack/`.

---

### Tools Used

- **GitHub** — repository, version control, branch protection
- **VS Code / Claude Code** — documentation authoring
- **1Password** — initial vault setup (Wire Instructions, Agent Services, Recovery vaults created in this sprint)

---

### Agents Involved

None — agents are not yet created. All 18 agents are designed and documented but not registered with Anthropic API until Sprint 2.

---

### Test Cases

| # | Test | Pass Criteria |
|---|---|---|
| 1.1 | Clone repo with Kody's credentials | Successful clone; all files present |
| 1.2 | Attempt direct push to main | Blocked — branch protection active |
| 1.3 | Create a `.env` file in repo root, run `git status` | `.env` does not appear in untracked files |
| 1.4 | Confirm all 18 agent files exist | `ls pinnacle-note-fund-ai-os/agents/` returns 18 files |
| 1.5 | Confirm all policy files exist | `ls pinnacle-note-fund-ai-os/policies/` returns 9 files |
| 1.6 | Confirm all log files are initialized (empty structure only) | `ls pinnacle-note-fund-ai-os/logs/` returns 6 files; each file has header only |
| 1.7 | Search entire repo for any API key pattern | `grep -r "sk-ant" .` returns no results |
| 1.8 | Search entire repo for any hardcoded password pattern | No results matching common password patterns |

---

### Definition of Done

- [ ] All files committed to `main` branch with no credentials present
- [ ] Branch protection active — PR required for all merges
- [ ] `.gitignore` verified against test case 1.3
- [ ] Kerry has reviewed folder structure and agent file content
- [ ] 1Password vaults created: Wire Instructions, Agent Services, Shared-Operations, Recovery

---

### Common Failure Points

**Credential accidentally committed:** The most common Sprint 1 failure. Prevention: run `git diff --staged` before every commit and search for key patterns. If it happens: rotate the credential immediately, force-push to remove it (Kerry only), and review GitHub's cached version.

**File naming inconsistencies:** Agent files numbered wrong, log files missing headers. Prevention: verify against `agents_registry.md` file list before marking Sprint 1 complete.

**Branch protection not activated:** Easy to forget on a new repo. Prevention: test case 1.2 is mandatory before Sprint 2 begins.

---

### Human Approval Requirements

- **Kerry reviews all 18 agent system prompt files** before Sprint 1 is marked complete — these define agent behavior for the life of the system
- **Kerry approves the initial 1Password vault structure** — vault access grants cannot be changed easily after team members are onboarded
- **Kerry confirms branch protection rules** are active by attempting a direct push himself

---

---

## Sprint 2 — Supabase Database Schema, Roles, and Anthropic Agent Creation

### Goal
Stand up the operational data layer that every other sprint builds on. After Sprint 2, the fund has a live, secure, role-controlled PostgreSQL database in Supabase and all 18 Anthropic agents registered and ready to receive tasks.

---

### Tasks

**Supabase Project Setup**
- [ ] Create Supabase project (region: `us-east-1` preferred for US LP data residency)
- [ ] Save connection credentials to 1Password — Agent Services vault
- [ ] Enable `pgcrypto` extension (required for borrower SSN encryption)
- [ ] Enable `pg_stat_statements` extension (query performance monitoring)

**Database Schema — Build Order (9 rounds)**
- [ ] Round 1: Create `fund_config`, `loan_products`, `states`, `agents`
- [ ] Round 2: Create `lp_investors`, `borrowers`, `servicers`, `vendors`
- [ ] Round 3: Create `loans`, `properties`
- [ ] Round 4: Create `tape_loans`, `capital_calls`, `capital_accounts`
- [ ] Round 5: Create `agent_tasks`, `agent_sessions`, `property_valuations`, `property_encumbrances`
- [ ] Round 6: Create `approvals`, `compliance_reviews` (without circular FKs)
- [ ] Round 7: Resolve circular FKs with `ALTER TABLE ... ADD CONSTRAINT`
- [ ] Round 8: Create `agent_logs`, `audit_log`, `distributions`, `cash_transactions`
- [ ] Round 9: Create `exception_log`, `vendor_performance`, `workflow_events`

**Indexes and Constraints**
- [ ] Create all indexes per schema document (partial indexes on status fields, composite indexes on FK pairs)
- [ ] Verify all foreign key constraints are active
- [ ] Verify all `CHECK` constraints on status enum fields

**Row-Level Security**
- [ ] Enable RLS on all 25 tables: `ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;`
- [ ] Create all 8 roles: `ceo_cio`, `controller`, `operations`, `investor`, `agent_service`, `n8n_service`, `powerbi_readonly`, `auditor_readonly`
- [ ] Write and apply all RLS policies per `supabase_database_schema.md`
- [ ] Apply append-only enforcement on `audit_log`, `agent_logs`, `compliance_reviews`

**Encryption**
- [ ] Create encryption wrapper function for borrower SSN using `pgcrypto`
- [ ] Store encryption key in 1Password — Wire Instructions vault (never in DB)
- [ ] Test: insert encrypted SSN, verify stored value is ciphertext, verify decryption returns original

**Seed Data**
- [ ] Insert initial `fund_config` record (fund name, entity structure, target yield, waterfall parameters)
- [ ] Insert all 50 US states into `states` table with FC timeline data (judicial/non-judicial, avg months)
- [ ] Insert all 18 agents into `agents` table (names, roles — agent_id from Anthropic populated after agent creation below)

**Power BI Connection**
- [ ] Create `powerbi_readonly` role connection string
- [ ] Test connection from Power BI Desktop (PostgreSQL connector, port 5432, SSL required)
- [ ] Verify `powerbi_readonly` cannot INSERT or UPDATE (test case 2.8)

**Anthropic Agent Creation**
- [ ] Set `ANTHROPIC_API_KEY` environment variable (from 1Password)
- [ ] Run `create_agents.sh` (or `create_agents.ps1` on Windows) to register all 18 agents
- [ ] Capture agent IDs returned by API for all 18 agents
- [ ] Update `agents_registry.md` with actual Anthropic agent IDs
- [ ] Update `agents` table in Supabase with Anthropic agent IDs
- [ ] Update all 18 n8n automation blueprints with actual agent IDs (replace `[AGENT_XX_ID]` placeholders)
- [ ] Test: call each agent's session endpoint to confirm it responds

---

### Files Affected

| File | Change |
|---|---|
| `tech_stack/supabase_database_schema.md` | Reference document — no changes; SQL executed from this |
| `agents_registry.md` | Updated with actual Anthropic agent IDs |
| `agents/01_chief_operating_coordinator.md` through `agents/18_...md` | No file changes — agent system prompts used as input to creation script |
| `create_agents.sh` / `create_agents.ps1` | Executed to create agents; output captured |
| New: `tech_stack/supabase_migrations/001_initial_schema.sql` | Full DDL for all 25 tables |
| New: `tech_stack/supabase_migrations/002_rls_policies.sql` | All RLS policies |
| New: `tech_stack/supabase_migrations/003_seed_data.sql` | Fund config, states, agents seed |

**Migration files:** Save all SQL as migration files in `tech_stack/supabase_migrations/` before executing. This creates an executable, version-controlled record of the exact schema that was deployed.

---

### Tools Used

- **Supabase** (project creation, SQL editor, API explorer)
- **PostgreSQL / psql** (for local schema validation before running in Supabase)
- **1Password** (credential storage for all new Supabase credentials)
- **Bash / PowerShell** (agent creation scripts)
- **Anthropic API** (agent registration via `POST /v1/agents`)
- **Power BI Desktop** (connection test only)

---

### Agents Involved

- **Agent 18 (Data, Automation, Security)** — responsible for schema execution and validation once registered; can assist with schema review before execution
- **No agents are active during schema build** — agents are created at the end of this sprint after the database is ready

---

### Test Cases

| # | Test | Command / Action | Pass Criteria |
|---|---|---|---|
| 2.1 | All 25 tables created | `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'` | Returns 25 rows |
| 2.2 | RLS enabled on all tables | `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'` | All 25 rows show `rowsecurity = true` |
| 2.3 | `ceo_cio` can SELECT all tables | Run SELECT on each table as `ceo_cio` | All return results (including empty tables) |
| 2.4 | `powerbi_readonly` cannot access `borrowers` | `SET ROLE powerbi_readonly; SELECT * FROM borrowers;` | Returns 0 rows or permission denied (RLS blocks access) |
| 2.5 | `powerbi_readonly` cannot INSERT | `SET ROLE powerbi_readonly; INSERT INTO fund_config (...) VALUES (...);` | Returns error: `insufficient_privilege` |
| 2.6 | Append-only on `audit_log` | `SET ROLE agent_service; UPDATE audit_log SET ... WHERE ...;` | Returns error: RLS policy blocks UPDATE |
| 2.7 | Append-only on `audit_log` (delete) | `SET ROLE agent_service; DELETE FROM audit_log WHERE ...;` | Returns error: RLS policy blocks DELETE |
| 2.8 | `n8n_service` cannot access `lp_investors` | `SET ROLE n8n_service; SELECT * FROM lp_investors;` | Returns 0 rows or permission denied |
| 2.9 | SSN encryption | Insert borrower with encrypted SSN; SELECT raw value | Stored value is ciphertext (not readable SSN) |
| 2.10 | SSN decryption | Run decrypt function on stored SSN | Returns original SSN value |
| 2.11 | All 18 agents created | `GET /v1/agents/{agent_id}` for each of 18 IDs | All 18 return 200 with correct name |
| 2.12 | Agent session test (Agent 01) | `POST /v1/agents/{agent_01_id}/sessions` with test input | Returns session response with no error |
| 2.13 | Fund config seed data | `SELECT * FROM fund_config` as `ceo_cio` | Returns 1 row with correct fund parameters |
| 2.14 | States seed data | `SELECT COUNT(*) FROM states` | Returns 50 |
| 2.15 | Agents seed data | `SELECT COUNT(*) FROM agents` | Returns 18; all have non-null `anthropic_agent_id` |
| 2.16 | Power BI connection | Test connection in Power BI Desktop | Connection succeeds; tables visible |
| 2.17 | Circular FK resolution | `SELECT * FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY'` | `approvals.compliance_review_id` FK present; no FK violation errors |

---

### Definition of Done

- [ ] All 25 tables exist in Supabase production project
- [ ] RLS is enabled on all 25 tables — verified by test case 2.2
- [ ] All RLS policies applied and tested — all 17 test cases pass
- [ ] All 8 database roles created and functional
- [ ] Supabase credentials stored in 1Password (Agent Services vault)
- [ ] All 18 Anthropic agents created and registered
- [ ] `agents_registry.md` updated with actual agent IDs
- [ ] `agents` table in Supabase populated with agent IDs
- [ ] Seed data inserted: fund_config, 50 states, 18 agents
- [ ] Migration SQL files saved to `tech_stack/supabase_migrations/`
- [ ] Power BI connection tested and working
- [ ] Kerry has personally reviewed and approved the RLS policy test results

---

### Common Failure Points

**Circular FK constraint order:** If `approvals` and `compliance_reviews` are created with both FKs simultaneously, Supabase throws a "relation does not exist" error. Prevention: follow the 9-round build order exactly. Fix: drop and recreate the constraint after both tables exist.

**pgcrypto not enabled before encryption test:** Extension must be enabled before any `pgp_sym_encrypt` / `pgp_sym_decrypt` calls. Prevention: run `CREATE EXTENSION IF NOT EXISTS pgcrypto;` as the first SQL statement.

**Anthropic API rate limits during agent creation:** Creating 18 agents in rapid succession may hit the API. Prevention: add a 1-second sleep between each agent creation in the script. The creation scripts should already handle this.

**RLS policy blocks legitimate `agent_service` access:** A missing or incorrect policy can cause agents to fail when writing to Supabase in Sprint 4. Prevention: run the full test matrix (test cases 2.3–2.9) before Sprint 3 begins. Do not assume a policy is correct — test it.

**Agent ID not captured after creation:** If the creation script doesn't capture and store the returned agent IDs, they are not easily recoverable without listing all agents. Prevention: the creation scripts output agent IDs to console — log them and enter into `agents_registry.md` immediately.

**Service role key too permissive:** The Supabase service role key bypasses RLS. Never use this key in n8n or agent connections — use the anon key with the appropriate role set. Prevention: store service role key in 1Password for emergency recovery only; configure n8n to use the anon key + JWT for each role.

---

### Human Approval Requirements

- **Kerry approves Supabase project configuration** before any schema is deployed to production
- **Kerry reviews the RLS policy test results** (test cases 2.3–2.9) — not delegated
- **Kerry personally runs the agent creation scripts** or is present when they are run — this creates the 18 agents that will operate the fund
- **Kerry stores all new credentials in 1Password immediately** — no credential should exist outside 1Password for more than 5 minutes
- **Kerry approves the states seed data** (FC timelines) before it is committed — incorrect FC timeline data affects workout strategy

---

---

## Sprint 3 — Airtable Command Center

### Goal
Build the daily operating interface where Kerry manages deals, reviews exceptions, approves actions, and monitors the fund — without needing to interact with Supabase directly. After Sprint 3, the command center is fully structured and tested with sample data, ready to receive live automation writes in Sprint 4.

---

### Tasks

**Airtable Workspace Setup**
- [ ] Create Airtable workspace: "Pinnacle Note Fund"
- [ ] Invite team members with correct roles: Kerry (Owner), Kody (Creator), TJ (Commenter)
- [ ] Generate Airtable API key, store in 1Password Agent Services vault
- [ ] Configure Airtable personal access token for n8n connection (scopes: `data.records:read`, `data.records:write`, `schema.bases:read`)

**Build All 10 Bases**
- [ ] Base 1: Acquisition Pipeline
  - Tables: `Tape Submissions`, `Loan Screening`, `Active Bids`, `Closed/Won`, `Dead Deals`
  - Views: Active Pipeline (Kanban by stage), Bid Queue (grid, open bids sorted by bid due date), Dead Deal Archive
- [ ] Base 2: Underwriting Command Center
  - Tables: `Underwriting Queue`, `IC Memos`, `Approved Deals`, `Rejected Deals`
  - Views: Queue (sorted by received date), Pending IC Review (awaiting Kerry), Approved (by quarter)
- [ ] Base 3: Portfolio Management
  - Tables: `Active Loans` (performing), `Watch List`, `NPL Loans`, `REO Properties`, `Paid Off Loans`
  - Views: Portfolio Overview (all statuses), Watch List (flagged loans), NPL Kanban (by resolution stage)
- [ ] Base 4: Servicer and Vendor Hub
  - Tables: `Servicers`, `Vendors`, `Servicer Reports`, `Vendor Issues`
  - Views: Servicer Dashboard, Open Vendor Issues (unresolved), Report Calendar
- [ ] Base 5: Investor CRM
  - Tables: `LP Prospects`, `Active LPs`, `Capital Calls`, `Distributions`
  - Views: Prospect Pipeline (by stage), Active LP Directory, Distribution History
- [ ] Base 6: Cash and Treasury
  - Tables: `Cash Positions`, `Pending Wires` (reference only — no actual wire details), `Distribution Schedule`
  - Views: Current Balances, 30/60/90 Forecast, Distribution Queue
- [ ] Base 7: Exception and Compliance Tracker
  - Tables: `Open Exceptions`, `Resolved Exceptions`, `Compliance Reviews`, `Approval Queue`
  - Views: Open Exceptions (sorted by severity), Pending Approvals (Kerry's action queue), Compliance Calendar
- [ ] Base 8: Legal and FC Tracker
  - Tables: `Active FC Cases`, `Legal Milestones`, `FC Outcomes`
  - Views: FC Timeline Board (Kanban), Upcoming Deadlines (next 30 days), State FC Summary
- [ ] Base 9: Document Tracker
  - Tables: `Deal Documents`, `LP Documents`, `Compliance Documents`
  - Views: Missing Documents (incomplete checklist), Document Expiry Tracker
- [ ] Base 10: Team Task Manager
  - Tables: `Tasks`, `Projects`, `Meeting Notes`
  - Views: Kerry's Queue, Kody's Queue, TJ's Queue, This Week (by due date), Overdue

**Build All 7 Interfaces**
- [ ] Interface 1: Executive Dashboard (approval queue + portfolio snapshot + exception summary)
- [ ] Interface 2: Active Deal Pipeline (deal cards with status, price, and key dates)
- [ ] Interface 3: NPL Workout Command (NPL loans by resolution stage + legal milestones)
- [ ] Interface 4: Investor CRM (LP pipeline + capital call status)
- [ ] Interface 5: Servicer Command (servicer performance + open issues)
- [ ] Interface 6: Exception Resolution Center (open exceptions + compliance actions)
- [ ] Interface 7: Weekly Operating View (tasks due this week + open approvals + deal activity)

**Configure Linked Records**
- [ ] `Active Loans` in Base 3 linked to `Servicers` in Base 4
- [ ] `Active Bids` in Base 1 linked to `Underwriting Queue` in Base 2
- [ ] `FC Cases` in Base 8 linked to `NPL Loans` in Base 3
- [ ] `Tasks` in Base 10 linked to records in all other bases (deal reference, LP reference, etc.)
- [ ] `Capital Calls` and `Distributions` in Base 5 linked to `Cash Positions` in Base 6

**Load Sample Data**
- [ ] Create 3 sample deals in Acquisition Pipeline (one at each stage: screening, bid, closed)
- [ ] Create 2 sample LP records in Investor CRM (no real NPI — use placeholder data)
- [ ] Create 1 sample exception in Exception Tracker
- [ ] Create 1 sample approval in Approval Queue
- [ ] Create 5 sample tasks across all team members
- [ ] Use sample data to test all views and interfaces before Sprint 4

---

### Files Affected

| File | Change |
|---|---|
| `tech_stack/airtable_command_center.md` | Reference document — no changes; Airtable built from this spec |
| New: `tech_stack/airtable_api_config.md` | Airtable base IDs, table IDs, field IDs needed by n8n in Sprint 4 |

**Critical Sprint 4 dependency:** At the end of Sprint 3, document all Airtable base IDs, table IDs, and field IDs in `tech_stack/airtable_api_config.md`. n8n automations in Sprint 4 reference these IDs — without them, automations cannot be built.

---

### Tools Used

- **Airtable** (base, table, view, and interface builder)
- **1Password** (API key storage)
- No n8n in this sprint — Airtable is built standalone and tested manually

---

### Agents Involved

- **Agent 01 (Chief Operating Coordinator)** — test by running a manual agent session and asking it to read the command center structure; validates that the interface matches the agent's operational model
- **Agent 09 (QA + Exceptions)** — validate that the Exception Tracker structure can receive the output format Agent 09 produces
- No agents write to Airtable in this sprint — that begins in Sprint 4

---

### Test Cases

| # | Test | Action | Pass Criteria |
|---|---|---|---|
| 3.1 | Team permissions | Log in as Kody; attempt to delete a base | Not permitted (Creator cannot delete bases) |
| 3.2 | Team permissions — TJ | Log in as TJ; attempt to add a record to Tape Submissions | Not permitted (Commenter cannot add records) |
| 3.3 | Team permissions — TJ comment | Log in as TJ; add a comment to an existing record | Comment appears successfully |
| 3.4 | Active Pipeline view filter | Add a deal with status "Dead Deal" to Base 1 | Deal does NOT appear in Active Pipeline view |
| 3.5 | Exception view filter | Resolve an exception; verify view | Resolved exception disappears from Open Exceptions view |
| 3.6 | Approval Queue view | Create sample pending approval; view as Kerry | Approval appears in both Base 7 Approval Queue view AND Interface 1 |
| 3.7 | Linked records — cross-base | Link an Active Loan to a Servicer in Base 4 | Linked record field shows correct servicer name; can navigate to Servicer record |
| 3.8 | Interface 1 renders all sections | Open Interface 1 as Kerry | All sections load without error; approval queue shows pending approval from 3.6 |
| 3.9 | Interface 7 — weekly view | Verify tasks due this week appear | Tasks with due dates in current week visible; overdue tasks flagged |
| 3.10 | Airtable API connection | `GET https://api.airtable.com/v0/{base_id}/{table_id}` with API key | Returns records as JSON |
| 3.11 | Airtable API config doc | Confirm all base IDs, table IDs, and key field IDs are documented | `airtable_api_config.md` exists and contains all IDs needed for Sprint 4 n8n build |
| 3.12 | Sample data integrity | Review all 3 sample deals, 2 LP records, 1 exception, 1 approval | All records complete; linked records resolve correctly; no broken links |

---

### Definition of Done

- [ ] All 10 bases built with correct tables, fields, and views
- [ ] All 7 interfaces built and rendering correctly
- [ ] All linked record connections active and resolving
- [ ] Team permissions confirmed — Kerry (Owner), Kody (Creator), TJ (Commenter)
- [ ] Airtable API key stored in 1Password
- [ ] `tech_stack/airtable_api_config.md` created with all base IDs, table IDs, and field IDs
- [ ] All 12 test cases pass
- [ ] Sample data loaded and visible in all views
- [ ] Kerry has navigated all 7 interfaces and confirmed they match operational intent

---

### Common Failure Points

**Airtable field type mismatches:** Creating a field as "Single line text" when it should be "Number" breaks linked rollup formulas. Prevention: follow the field type specs in `airtable_command_center.md` exactly. Fix: field type can be changed in Airtable, but it may lose data — fix before sample data is loaded.

**Linked record fields across bases:** Airtable cross-base links don't exist natively — linked records work within a base. Where the spec calls for cross-base references, these are implemented as separate fields with matching IDs (Loan ID in Base 3 matches Loan ID in Base 8), not as native linked records. Prevention: read the spec carefully — "linked to" across bases means ID-matching, not native link.

**Interface sections not pulling from correct table:** Interfaces are built from specific views, not tables. If the wrong view is selected or the view's filter is wrong, the interface shows incorrect data. Prevention: test case 3.8 — verify Interface 1 shows the correct records from each section.

**API config doc incomplete:** Missing a field ID in `airtable_api_config.md` blocks Sprint 4. Field IDs are not visible in the Airtable UI by default — must be found via the API explorer or field settings menu. Prevention: use the Airtable API explorer to get field IDs for every field n8n will read or write.

**TJ access too broad:** If TJ is accidentally added as Creator instead of Commenter, he can create or delete records. Prevention: verify test case 3.2 before Sprint 3 is marked complete.

---

### Human Approval Requirements

- **Kerry reviews all 7 interface designs** before they are finalized — interfaces are what Kerry uses daily
- **Kerry approves the Approval Queue structure** in Base 7 and Interface 1 — this is Kerry's primary decision surface for fund operations
- **Kerry grants team invitations personally** — no team member should be added to Airtable by anyone but Kerry

---

---

## Sprint 4 — n8n Automations

### Goal
Build the automation layer that connects all systems — Anthropic agents, Supabase, Airtable, Google Drive, Gmail, and DocuSign — into operational workflows. After Sprint 4, the core operating automations are live: tape intake flows from submission to agent analysis, exceptions are tracked and escalated automatically, servicer reports are processed without manual data entry, and approval requests route to Kerry without him needing to check multiple systems.

---

### Tasks

**n8n Environment Setup**
- [ ] Deploy n8n instance (self-hosted on a cloud VM or n8n Cloud)
- [ ] Configure environment variables from 1Password (12 variables: Anthropic API key, Supabase URL, Supabase anon key, Airtable API key, Google OAuth, DocuSign OAuth, Gmail MCP key, n8n webhook signing secret, HouseCanary API key, PropStream API key, ATTOM API key, encryption key reference)
- [ ] Verify all environment variables load correctly at n8n startup (no empty strings)
- [ ] Configure n8n Supabase credential (PostgREST URL + anon key + service role for migrations only)
- [ ] Configure n8n Anthropic credential
- [ ] Configure n8n Airtable credential
- [ ] Configure n8n Google Drive credential (OAuth)
- [ ] Configure n8n Gmail credential (OAuth)
- [ ] Test each credential connection in n8n UI before building any workflow

**Build Automations in Priority Order**
- [ ] Automation 01: Tape Intake and Initial Screening
- [ ] Automation 02: Tape Enrichment with Property Data (PropStream Stage 1)
- [ ] Automation 03: Underwriting Queue and IC Memo Generation
- [ ] Automation 04: Approval Routing — all approval types (bid, IC memo, strategy)
- [ ] Automation 05: Exception Detection and Escalation
- [ ] Automation 06: Servicer Report Processing
- [ ] Automation 07: Borrower Communication Routing (draft → Kerry review → servicer)
- [ ] Automation 08: Document Filing (Google Drive auto-organization)
- [ ] Automation 09: NPL Escalation and Workout Routing
- [ ] Automation 10: FC Milestone Tracking
- [ ] Automation 11: Portfolio Monitoring — performing loans
- [ ] Automation 12: Cash Position Update and Reporting
- [ ] Automation 13: Capital Call Processing
- [ ] Automation 14: Distribution Processing
- [ ] Automation 15: Investor Report Generation
- [ ] Automation 16: Servicer KPI Scoring
- [ ] Automation 17: Vendor Performance Scoring
- [ ] Automation 18: Compliance Review Scheduling

**For each automation, verify before marking complete:**
- [ ] Trigger fires correctly (webhook, schedule, or event)
- [ ] All environment variables load (no plain-text credentials in logs)
- [ ] Anthropic API call uses correct agent ID from `agents_registry.md`
- [ ] Supabase write uses correct PostgREST endpoint with correct table and fields
- [ ] Airtable write uses correct base ID and field IDs from `airtable_api_config.md`
- [ ] Retry logic is configured (3x exponential backoff: 5s, 25s, 125s)
- [ ] Error handling routes to Human Task node → Kerry alert
- [ ] All approval gates implemented per `n8n_automation_blueprint.md`
- [ ] NPI is not logged in n8n execution logs (verify log output)

**Global Configuration**
- [ ] Configure n8n error workflow (global error handler)
- [ ] Configure n8n execution data retention (30 days)
- [ ] Configure n8n webhook base URL (production URL, not localhost)
- [ ] Configure n8n timezone (America/Chicago — Central)

---

### Files Affected

| File | Change |
|---|---|
| `tech_stack/n8n_automation_blueprint.md` | Reference document — no changes; automations built from this |
| `agents_registry.md` | Confirm all agent IDs are populated (Sprint 2 dependency) |
| `tech_stack/airtable_api_config.md` | Confirm all field IDs are populated (Sprint 3 dependency) |
| New: `tech_stack/n8n_workflow_exports/` | Exported JSON for all 18 automations — committed to GitHub |
| New: `tech_stack/n8n_env_template.md` | `.env` variable names only (no values) — for documentation |

---

### Tools Used

- **n8n** (automation platform — self-hosted or cloud)
- **Supabase** (PostgREST API — target of most automation writes)
- **Airtable** (automation target — pipeline and approval status updates)
- **Anthropic API** (agent session calls for all 18 agents)
- **Google Drive API** (document filing)
- **Gmail MCP** (notification emails to Kerry)
- **DocuSign API** (envelope triggers — configured in Sprint 6 but placeholder built here)
- **1Password** (credential source — all env vars loaded from here)

---

### Agents Involved

All 18 agents are involved — each automation calls between 1 and 4 agents per run. Critical agents in this sprint:

- **Agent 01** — orchestration logic, task dispatch
- **Agent 04** — tape screening and enrichment (Automation 01, 02)
- **Agent 05** — document filing routing (Automation 08)
- **Agent 09** — exception detection (Automation 05)
- **Agent 18** — monitors all automations, flags errors

---

### Test Cases

**Environment and Credential Tests**
| # | Test | Action | Pass Criteria |
|---|---|---|---|
| 4.1 | Environment variables loaded | Check n8n execution log for any automation | No API key or password values appear in any log output |
| 4.2 | Supabase connection | Run test query from n8n | Returns fund_config record |
| 4.3 | Anthropic API connection | Send test message to Agent 01 from n8n | Returns session response |
| 4.4 | Airtable connection | Read test record from Base 1 via n8n | Returns correct record |

**Automation-Specific Tests**
| # | Test | Action | Pass Criteria |
|---|---|---|---|
| 4.5 | Tape intake end-to-end | Submit test tape file via webhook | Records appear in Supabase `tape_loans`; Airtable Base 1 updated; Agent 04 session fired |
| 4.6 | Approval routing | Create approval record in Supabase | Kerry receives notification within 5 minutes; approval appears in Airtable Approval Queue |
| 4.7 | **CRITICAL — Approval gate** | Manually set a pending approval to "Denied"; trigger downstream step | Automation halts; downstream step does NOT execute; error logged |
| 4.8 | **CRITICAL — Approval gate** | Attempt to run automation step without any approval record | Automation halts; human escalation triggered |
| 4.9 | Exception detection | Trigger loan payment miss event in test data | Exception created in Supabase; appears in Airtable Exception Tracker; alert fired within 10 minutes |
| 4.10 | Servicer report processing | Submit mock servicer report | Report parsed; key fields written to Supabase; Airtable servicer record updated |
| 4.11 | Document filing | Trigger document completion event | File appears in correct Google Drive folder matching loan ID and document type |
| 4.12 | Retry logic | Force a transient HTTP 500 from Supabase (test environment) | n8n retries 3 times (5s, 25s, 125s); after 3rd failure: error logged, Human Task created, alert fired |
| 4.13 | NPI not in logs | Run Automation 03 (underwriting) with test borrower data | n8n execution log does NOT contain SSN, DOB, or other NPI values |
| 4.14 | Distribution automation gate | Trigger Automation 14 without pre-approved distribution record | Automation halts at gate 1; no distribution schedule created |
| 4.15 | Agent session output format | Review outputs from Agent 03, Agent 04, Agent 07 sessions | Outputs are structured (JSON or Markdown); parseable by subsequent n8n nodes |
| 4.16 | Airtable field ID accuracy | Run automation that writes to Airtable; check all fields | All written fields appear in correct Airtable columns; no field ID mismatch errors |

---

### Definition of Done

- [ ] All 18 automations built and activated in n8n
- [ ] All n8n credentials use environment variables — no plain-text values in workflow configurations
- [ ] Test cases 4.1–4.16 all pass — especially 4.7 and 4.8 (approval gate tests)
- [ ] n8n workflow JSON exported and committed to GitHub (no credentials in exports)
- [ ] n8n env variable template documented in `tech_stack/n8n_env_template.md`
- [ ] Retry logic verified on at least 3 automations
- [ ] Error routing verified — failed automation creates Human Task and alerts Kerry
- [ ] Kerry has manually approved one test approval through the end-to-end flow (Airtable → Supabase → downstream automation)

---

### Common Failure Points

**Empty environment variable:** `process.env.ANTHROPIC_API_KEY` returns `undefined` if the variable name has a typo. The API call silently fails with 401. Prevention: run test case 4.1 on every variable before building automations.

**Approval gate query returns wrong result:** The approval check queries `GET /rest/v1/approvals?approval_id=eq.[id]&status=eq.Approved`. If the `approval_id` is not passed correctly through the workflow, the query returns 0 rows and the gate fires — halting the automation even after approval. Prevention: log the full query URL in a test execution and verify it matches the expected record.

**Airtable field ID mismatch:** n8n writes a value to a field that no longer exists (field was renamed in Sprint 3). The write succeeds silently in Airtable (creates a new column) or fails with an API error. Prevention: never rename Airtable fields after `airtable_api_config.md` is finalized. If a field must be renamed, update the config doc and all n8n nodes simultaneously.

**Agent session timeout:** Long-running agent tasks (tape screening 200+ loans) may time out before completing. Prevention: design tape intake to process loans in batches of 50; use n8n's split-in-batches node.

**NPI in execution logs:** If an n8n node receives a full borrower object (with SSN) and logs it, borrower NPI appears in n8n's execution history. Prevention: insert a "redact NPI fields" function node before any logging step that processes borrower data. Test case 4.13 is mandatory.

**DocuSign OAuth token expiry:** DocuSign OAuth tokens expire after a set period. n8n will fail silently if the token is not refreshed. Prevention: use n8n's OAuth credential type with automatic token refresh; test DocuSign connection specifically after token is initially set up.

---

### Human Approval Requirements

- **Kerry reviews automation logic for all 18 automations** before they are activated — specifically reviewing the approval gate logic (what triggers a gate, what happens if the gate is not passed)
- **Kerry manually tests the approval flow** (test case 4.7 and 4.8) — the approval gate is the most critical control in the system; Kerry must see it work and fail correctly
- **Kerry approves n8n deployment environment** — whether self-hosted or n8n Cloud, this is a system that will handle fund data; Kerry makes the hosting decision
- **Kerry reviews all automation outputs** for any automation that could communicate externally (Automations involving Gmail) before those automations go live

---

---

## Sprint 5 — Power BI Dashboards

### Goal
Build the analytics and monitoring layer that gives Kerry a real-time view of the fund's performance, risk, and operations. After Sprint 5, every metric tracked in the Power BI dashboard system document is visible, refresh is automated, and alerts are configured.

---

### Tasks

**Supabase → Power BI Connection**
- [ ] Configure PostgreSQL data source in Power BI Desktop (Supabase endpoint, port 5432, SSL required)
- [ ] Connect using `powerbi_readonly` role credentials (stored in 1Password)
- [ ] Import all non-sensitive tables for Import mode dashboards
- [ ] Configure DirectQuery for `approvals` and `workflow_events` tables (real-time panels)
- [ ] Verify `powerbi_readonly` cannot access `borrowers`, `lp_investors`, or `capital_accounts` tables

**Build All 15 Dashboards**
- [ ] Dashboard 01: Executive Dashboard (mixed: Import + DirectQuery)
- [ ] Dashboard 02: Acquisition Pipeline Dashboard (Import)
- [ ] Dashboard 03: Tape Underwriting Dashboard (Import)
- [ ] Dashboard 04: Individual Note Dashboard (Import + Loan ID page-level filter)
- [ ] Dashboard 05: Portfolio Performance Dashboard (Import)
- [ ] Dashboard 06: Performing Loan Dashboard (Import)
- [ ] Dashboard 07: NPL Workout Dashboard (Import)
- [ ] Dashboard 08: Legal Timeline Dashboard (Import — Gantt-style)
- [ ] Dashboard 09: Servicer KPI Dashboard (Import)
- [ ] Dashboard 10: Cash and Liquidity Dashboard (Import)
- [ ] Dashboard 11: Distribution Dashboard (Import)
- [ ] Dashboard 12: Investor Reporting Dashboard (Import — Kerry access only, no LP direct access)
- [ ] Dashboard 13: Risk and Stress Testing Dashboard (Import)
- [ ] Dashboard 14: Vendor Performance Dashboard (Import)
- [ ] Dashboard 15: Compliance Dashboard (Import)

**For each dashboard:**
- [ ] All pages built per visual component spec in `power_bi_dashboard_system.md`
- [ ] All measures (DAX) calculated and validated against Supabase source data
- [ ] All filters and slicers functional
- [ ] Mobile layout created (all 15 dashboards require mobile layout)
- [ ] Alerts configured where spec calls for them
- [ ] Agent annotation applied (which agent is responsible for each dashboard's data)

**Power BI Service Configuration**
- [ ] Publish all 15 dashboards to Power BI Service workspace
- [ ] Configure scheduled refresh: daily at 6:00 AM Central Time for all Import dashboards
- [ ] Configure workspace access: Kerry (Admin), Kody (Member), TJ (Viewer) — no LP access
- [ ] Confirm DirectQuery panels on Dashboard 01 refresh in real-time (no schedule required)
- [ ] Configure Power BI Service alerts (threshold alerts for risk limits, cash balance)
- [ ] Confirm auto-export to external parties is DISABLED (manual PDF export only)

**DAX Measures (critical calculations to build and validate):**
- [ ] Portfolio weighted average LTV = SUMX(loans, [UPB] × [LTV]) / SUM([UPB])
- [ ] Total AUM = SUM(loans[upb]) where status is active
- [ ] Delinquency rate = COUNT(loans where DPD ≥ 30) / COUNT(all active loans)
- [ ] Net yield = SUM(interest_collected) / AVERAGE(portfolio_balance) annualized
- [ ] Cash coverage ratio = cash_available / (committed_capital - deployed_capital)
- [ ] LP IRR = calculated using XIRR DAX function on capital call and distribution dates

---

### Files Affected

| File | Change |
|---|---|
| `tech_stack/power_bi_dashboard_system.md` | Reference document — no changes; dashboards built from this |
| New: `tech_stack/power_bi_files/` | `.pbix` files for all 15 dashboards — committed to GitHub |
| New: `tech_stack/power_bi_files/dax_measures.md` | All DAX measure definitions documented for auditability |

---

### Tools Used

- **Power BI Desktop** (dashboard build, DAX authoring, data modeling)
- **Power BI Service** (publishing, scheduled refresh, workspace management, alerts)
- **Supabase** (data source via PostgreSQL connector)
- **1Password** (Power BI connection credentials)

---

### Agents Involved

- **Agent 13 (Risk + Stress Testing)** — validate that stress test output in Supabase matches what Dashboard 13 displays; confirm the risk limit breach logic is correct
- **Agent 18 (Data, Automation, Dashboards, Security)** — validates data pipeline from Supabase → Power BI; confirms all tables are correctly accessible to `powerbi_readonly`
- **Agent 15 (Compliance + Audit)** — reviews Dashboard 15 (Compliance) for completeness

---

### Test Cases

| # | Test | Action | Pass Criteria |
|---|---|---|---|
| 5.1 | Connection security | Attempt to view `borrowers` table in Power BI data model | Table is not visible or returns 0 rows (RLS blocks access) |
| 5.2 | Connection security | Attempt to view `lp_investors` table | Table not accessible under `powerbi_readonly` |
| 5.3 | Import mode refresh | Trigger manual refresh of Dashboard 01 Import pages | Refresh completes without error; data matches Supabase source |
| 5.4 | DirectQuery real-time | Change an approval status in Supabase; without refreshing Power BI | Approval Queue section on Dashboard 01 reflects the change within 30 seconds |
| 5.5 | Portfolio WAvg LTV | Insert test loans with known LTVs into Supabase; verify DAX measure | Power BI calculated WAvg LTV matches manually calculated value |
| 5.6 | Delinquency rate | Insert loans at 30, 60, 90 DPD in test data; verify rate | Delinquency rate on Dashboard 05 matches manually calculated rate |
| 5.7 | Individual Note filter | Set Loan ID filter on Dashboard 04 | Only the selected loan's data appears on all pages |
| 5.8 | Mobile layout | Open Dashboard 01 on mobile browser or Power BI mobile app | Dashboard renders correctly; all KPI cards visible without horizontal scroll |
| 5.9 | Scheduled refresh | Verify at 6:01 AM CT the day after publishing | Power BI Service shows "Last refreshed: today at 6:00 AM" |
| 5.10 | Alert — risk limit | Set test data so portfolio WAvg LTV exceeds 65% threshold | Alert fires in Power BI Service; email notification received by Kerry |
| 5.11 | Alert — cash balance | Set test cash balance below warning threshold | Alert fires; notification received |
| 5.12 | External export disabled | Verify Power BI Service workspace settings | Auto-export and embed for external users is disabled |
| 5.13 | DAX validation — all measures | For each DAX measure: run equivalent SQL in Supabase | Power BI measure result matches SQL result for same time period |
| 5.14 | Compliance Dashboard | Verify Dashboard 15 shows open compliance items matching Supabase `compliance_reviews` | Count and status match exactly |

---

### Definition of Done

- [ ] All 15 dashboards published to Power BI Service
- [ ] All 15 dashboards have mobile layouts
- [ ] All DAX measures validated against Supabase source (test case 5.13)
- [ ] DirectQuery panels confirmed real-time (test case 5.4)
- [ ] Scheduled refresh confirmed (test case 5.9)
- [ ] `powerbi_readonly` confirmed to not access sensitive tables (test cases 5.1, 5.2)
- [ ] All configured alerts tested and confirmed to fire
- [ ] `.pbix` files committed to GitHub; DAX measures documented
- [ ] Kerry has reviewed all 15 dashboards in Power BI Service and confirmed they show the information he needs

---

### Common Failure Points

**SSL certificate issue with Supabase connection:** Power BI Desktop sometimes fails to connect to Supabase via PostgreSQL connector with SSL errors. Prevention: ensure "Encrypt connection" is checked and the correct Supabase CA certificate is trusted. Fix: download Supabase SSL cert, import to Windows certificate store.

**DirectQuery timeout on complex queries:** DAX measures that require joining multiple tables in DirectQuery mode can time out if the underlying SQL is not optimized. Prevention: ensure all FK columns have indexes in Supabase (Sprint 2). Fix: pre-aggregate data in a Supabase view that `powerbi_readonly` can access.

**DAX measure returns BLANK():** Common when the relationship between tables is not set up correctly in Power BI's data model. Prevention: explicitly define all relationships in Power BI's Model view; verify cardinality and cross-filter direction before writing measures.

**Import mode refresh fails:** Scheduled refresh fails if the Power BI Service gateway is not configured (for on-premises data sources). For Supabase (cloud), a gateway may not be needed — but verify this. If refresh fails, check Power BI Service refresh history for error details.

**WAvg LTV formula incorrect:** A common error is weighting by count instead of by UPB. Validate manually with a 2-loan test case before using the measure in production reports.

---

### Human Approval Requirements

- **Kerry reviews all 15 dashboards** before they are marked complete — dashboard design is a subjective decision; what Kerry sees daily needs to match how he thinks about the fund
- **Kerry confirms the Executive Dashboard** (Dashboard 01) shows the right information in the right order — this is his morning view
- **Kerry approves workspace access settings** in Power BI Service before any dashboard is shared with Kody or TJ

---

---

## Sprint 6 — Security Hardening, Document Vault, DocuSign, Property Data, and Final Testing

### Goal
Close all remaining gaps. After Sprint 6, the full system is live: Google Drive folder structure is built and permissioned, DocuSign templates are ready and connected to n8n, property data integrations are configured, all security controls are verified, and the end-to-end system has been tested from tape submission to IC memo approval to deal close. The fund is operational.

---

### Tasks

**Google Drive Document Vault**
- [ ] Create all 18 root folders per `document_vault_and_data_room.md`
- [ ] Create all subfolders within each root folder
- [ ] Configure folder permissions per `security_and_access_controls.md` permission table
- [ ] Disable default "Anyone with link" sharing — enforce restricted sharing
- [ ] Create Google Drive service account for n8n document filing (Automation 08)
- [ ] Store service account credentials in 1Password Agent Services vault
- [ ] Test: Kody attempts to access `/09 - Legal` — should be denied
- [ ] Test: TJ attempts to access `/07 - Loan Files` — should be denied
- [ ] Test: n8n service account can upload to assigned folders; cannot read from restricted folders

**DocuSign Workflows**
- [ ] Build DocuSign NDA template (fields: Party Name, Effective Date, signature block)
- [ ] Build DocuSign LP Subscription Agreement template
- [ ] Build DocuSign Investor Acknowledgment template
- [ ] Build DocuSign Vendor Agreement template
- [ ] Build DocuSign Internal Approval template
- [ ] Configure all templates: Kerry countersigns all; send-first-then-sign-order enforced
- [ ] Configure DocuSign → n8n webhook: envelope completion fires Automation 08 (document filing)
- [ ] Test full DocuSign workflow: send → sign → complete → document filed to Drive automatically
- [ ] Verify no wire instructions, SSNs, or NPI appear in any template field definitions

**Property Data Integrations (Stage 1)**
- [ ] Configure PropStream API key in n8n (from 1Password)
- [ ] Build n8n function to call PropStream AVM endpoint for a given property address
- [ ] Test: submit test property address → PropStream returns AVM → result written to `property_valuations` in Supabase
- [ ] Configure PropStream call inside Automation 01 (tape intake enrichment)
- [ ] Create BPO vendor order workflow: trigger event → email order template → file in Google Drive when received
- [ ] Document Stage 2 integration checklist (ATTOM + HouseCanary) in `property_data_stack.md` for future sprint

**Security Hardening**
- [ ] Run full security checklist per `security_and_access_controls.md`
  - [ ] MFA verified on all required systems for all team members
  - [ ] All credentials in 1Password — no credential exists outside 1Password
  - [ ] All credential rotation schedules entered in 1Password (reminder dates set)
  - [ ] Supabase RLS re-audited after all Sprint 2–5 changes
  - [ ] GitHub: verify no credentials committed in any commit across all sprints
  - [ ] n8n: verify no credentials in any workflow export file committed to GitHub
  - [ ] Google Drive: verify all external share links are restricted or revoked
  - [ ] Airtable: confirm TJ is Commenter (not Creator or Owner)
  - [ ] DocuSign: confirm Kerry is Admin; Kody is Sender; TJ is Viewer
  - [ ] 1Password: Wire Instructions vault accessible to Kerry only — verify
  - [ ] All `audit_log` entries are append-only — run UPDATE and DELETE as `agent_service`, confirm failure
- [ ] File security hardening checklist results in `/16 - Compliance/Security Reviews/SECURITY-REVIEW-[DATE].md`

**End-to-End System Test (Critical Path)**
- [ ] Test A: Full tape-to-bid workflow
- [ ] Test B: Full NPL-to-FC workflow
- [ ] Test C: Full LP onboarding workflow
- [ ] Test D: Full distribution workflow
- [ ] Test E: Full exception-to-resolution workflow

**System Launch Checklist**
- [ ] All 6 sprints at Definition of Done
- [ ] All end-to-end tests passing
- [ ] All security controls verified
- [ ] Kerry has completed and signed the launch approval record in Supabase
- [ ] Decision log updated: `[DATE] DECISION: System launched for live operations | REASONING: All sprint definitions of done met; end-to-end tests passed | CONTEXT: First live deal pipeline entry`

---

### Files Affected

| File | Change |
|---|---|
| `tech_stack/property_data_stack.md` | Add Stage 2 integration checklist section |
| `decisions/log.md` | System launch decision logged |
| New: `tech_stack/supabase_migrations/004_propstream_integration.sql` | Any schema changes for property data |
| New: `references/system_launch_checklist.md` | Completed launch checklist (signed off by Kerry) |

---

### Tools Used

- **Google Drive** (folder build, permissions, service account configuration)
- **DocuSign** (template builder, webhook configuration)
- **n8n** (DocuSign and PropStream integrations)
- **PropStream** (API connection test)
- **1Password** (final credential audit, service account storage)
- **GitHub** (final credential scan across all commits)
- **Supabase** (final RLS re-audit)
- **Power BI** (verify dashboards still functioning after all changes)

---

### Agents Involved

- **Agent 05 (Diligence, Collateral, Closing)** — document filing and DocuSign workflow testing
- **Agent 14 (Compliance + Marketing)** — compliance document review for DocuSign templates
- **Agent 15 (Conflicts, Audit, Governance)** — runs the security hardening checklist; signs off
- **Agent 18 (Data, Automation, Security)** — PropStream integration, n8n updates for DocuSign, document vault service account
- **All agents** — participate in end-to-end system tests

---

### Test Cases — End-to-End Tests

**Test A: Full Tape-to-Bid Workflow**

| Step | Action | Pass Criteria |
|---|---|---|
| A.1 | Submit test tape (5 loans) via Automation 01 trigger | Records appear in Supabase `tape_loans` within 5 minutes |
| A.2 | Agent 04 screens tape | Supabase `tape_loans` records show buy-box pass/fail for each loan |
| A.3 | Airtable Acquisition Pipeline updated | Base 1 shows qualifying loans in Tape Submissions table |
| A.4 | PropStream AVM pulled for each qualifying loan | `property_valuations` shows AVM records for each loan address |
| A.5 | Underwriting queue populated | Agent 03 session triggered; IC memo draft generated for top qualifying loan |
| A.6 | Approval routing fires | Kerry receives notification; approval appears in Airtable Approval Queue |
| A.7 | Kerry approves test bid | Approval record in Supabase updates to "Approved"; downstream step executes |
| A.8 | BPO order triggered | BPO order template email generated; logged in Supabase `vendor_orders` |
| A.9 | End state | Full audit trail in `audit_log` covering all steps; no credentials in any log |

**Test B: Full NPL-to-FC Workflow**

| Step | Action | Pass Criteria |
|---|---|---|
| B.1 | Mark a test loan as NPL in Supabase | Automation 09 triggers; Agent 07 session fires |
| B.2 | Workout strategy generated | Agent 07 outputs reinstatement, short sale, DIL, and FC thresholds |
| B.3 | Human approval gate | Workout strategy approval request sent to Kerry; automation halts pending approval |
| B.4 | Kerry approves strategy | Approval record updated; servicer notified (via Automation 09 next step) |
| B.5 | FC filing trigger (if FC selected) | Kerry approves FC filing separately; counsel instructed via communication draft |
| B.6 | FC milestone created | `legal_milestones` record in Supabase; Dashboard 08 shows new case |
| B.7 | End state | Both approval gates fired and passed correctly; audit trail complete |

**Test C: Full LP Onboarding Workflow**

| Step | Action | Pass Criteria |
|---|---|---|
| C.1 | LP prospect added to Airtable CRM | Record created in Base 5; n8n webhook fires |
| C.2 | NDA sent via DocuSign | DocuSign envelope created from NDA template; sent to LP prospect email |
| C.3 | NDA signed | LP signs → Kerry countersigns → envelope completes |
| C.4 | Document filed automatically | Completed NDA appears in Google Drive `/06 - Closings/NDAs/` within 5 minutes |
| C.5 | Subscription docs sent | Subscription Agreement template populated; sent to LP |
| C.6 | LP onboarded | LP record created in Supabase `lp_investors`; capital account initialized |
| C.7 | End state | All documents in Drive; Supabase records complete; Airtable CRM updated to Active LP |

**Test D: Full Distribution Workflow**

| Step | Action | Pass Criteria |
|---|---|---|
| D.1 | Automation 14 triggered | Distribution calculation kicks off; Agent 10 and Agent 11 sessions fire |
| D.2 | Waterfall calculated | Distribution amounts calculated per waterfall; written to Supabase |
| D.3 | Gate 1 — calculation review | Kerry notified; automation halts; calculation record visible in Airtable |
| D.4 | Kerry approves calculation | Approval recorded; automation proceeds to next stage |
| D.5 | LP notification draft generated | Agent 17 drafts LP distribution notices; Kerry reviews |
| D.6 | Kerry approves LP notices | Approval recorded |
| D.7 | Wire package generated | Wire amounts and payee reference IDs compiled — NO bank account numbers in any document |
| D.8 | End state | Distribution record complete in Supabase; wires executed manually by Kerry outside system; system records confirmation |

**Test E: Full Exception-to-Resolution Workflow**

| Step | Action | Pass Criteria |
|---|---|---|
| E.1 | Exception triggered (e.g., payment shortfall) | Automation 05 fires; exception record created in Supabase |
| E.2 | Exception appears in Airtable | Base 7 Exception Tracker shows new open exception; severity classified |
| E.3 | Agent 09 analysis | Agent 09 session fires; root cause assessment logged to `agent_logs` |
| E.4 | Kerry notified | Notification received; exception appears in Interface 1 Approval Queue if approval required |
| E.5 | Resolution approved | Kerry approves resolution action; automation executes |
| E.6 | Exception closed | Supabase exception_log record updated; Airtable shows resolved; Dashboard 15 updated |
| E.7 | End state | Full exception lifecycle audited; `audit_log` shows all state changes |

---

### Security Test Cases

| # | Test | Action | Pass Criteria |
|---|---|---|---|
| 6.1 | Google Drive — unauthorized access | TJ attempts to open `/07 - Loan Files/` | Access denied |
| 6.2 | Google Drive — unauthorized access | Kody attempts to open `/09 - Legal/` | Access denied |
| 6.3 | 1Password vault access | Kody attempts to view Wire Instructions vault | Vault not visible; access denied |
| 6.4 | DocuSign — wire instructions | Review all DocuSign templates | No field in any template requests or displays wire instructions |
| 6.5 | GitHub credential scan | Run `git log --all --full-history -- '*.env'` | No .env files in history; no credential patterns in any commit |
| 6.6 | Supabase RLS — append-only | `SET ROLE agent_service; DELETE FROM audit_log LIMIT 1;` | Permission denied |
| 6.7 | MFA verification | Log into each system for each team member | All logins require MFA step; no system accepts password only |
| 6.8 | n8n credential scan | Export all 18 workflows as JSON; search for API key patterns | No API key values in any exported workflow JSON |
| 6.9 | Borrower NPI — Power BI | Connect Power BI; navigate to `borrowers` table | Table inaccessible or 0 rows returned under `powerbi_readonly` |
| 6.10 | External share audit | Review all Google Drive shared links | All external shares are time-limited and person-specific; no "anyone with link" shares |

---

### Definition of Done

**Sprint 6 is complete — system is launch-ready — when:**

- [ ] Google Drive folder structure built; all permissions configured and tested (6.1, 6.2)
- [ ] All 5 DocuSign templates live; completion webhook connected to n8n; document auto-filing tested
- [ ] PropStream integration tested end-to-end (test A.4)
- [ ] All 10 security test cases pass (6.1–6.10)
- [ ] End-to-end tests A, B, C, D, E all pass
- [ ] Security hardening checklist filed to `/16 - Compliance/`
- [ ] All 6 sprint Definitions of Done are met
- [ ] Kerry has personally signed off on the launch approval record in Supabase (`approvals` table, approval_type: "System Launch", status: "Approved", approved_by: "KKJ")
- [ ] `decisions/log.md` updated with system launch decision

---

### Common Failure Points

**Google Drive permissions cascade:** Setting a parent folder to restricted doesn't always restrict subfolders that were created before the parent was restricted. Prevention: set restrictions top-down, then verify on subfolders. Test each restricted folder individually.

**DocuSign webhook SSL handshake failure:** If n8n is self-hosted without a valid SSL certificate, DocuSign's completion webhook will fail to deliver (DocuSign requires HTTPS). Prevention: ensure n8n has a valid SSL certificate before configuring DocuSign webhooks. Use n8n Cloud or a proper SSL cert on self-hosted.

**End-to-end test reveals Sprint 2–4 data model mismatch:** The most common Sprint 6 failure is discovering that a field name in Supabase doesn't match what an n8n automation expects. Prevention: run end-to-end tests with real data early in Sprint 6, not at the end. Fix by updating either the n8n field reference or the Supabase field name (with a migration).

**PropStream rate limits during tape screening:** PropStream limits API calls per minute. Testing with a 50-loan tape may trigger rate limiting. Prevention: implement rate limiting in n8n (pause 500ms between each PropStream API call). The tape intake automation should already account for this.

**Distribution test reveals wire package logic error:** During Test D, the wire package may incorrectly include bank data that should be handled manually. Prevention: design the distribution automation to produce an "amount + payee reference ID" output only — bank details are added manually by Kerry using 1Password. If any version of the automation produces actual bank data in an output, halt and redesign.

---

### Human Approval Requirements

- **Kerry personally builds or supervises the Wire Instructions vault review** during security hardening — confirming it contains only what it should and is accessible only to him
- **Kerry runs through the full Executive Dashboard** one final time after all integrations are connected to confirm data is accurate end-to-end
- **Kerry signs the launch approval record** in Supabase — this is not delegated; it is Kerry's personal confirmation that the system is ready for live fund operations
- **Kerry reviews all DocuSign templates** before they go live — these produce legally binding documents; errors are not easily corrected after signing

---

---

## Cross-Sprint Dependency Map

```
Sprint 1 (Docs + GitHub)
    └── Sprint 2 (Supabase + Agents)
            └── Sprint 3 (Airtable)
            |       └── Sprint 4 (n8n)
            |               └── Sprint 5 (Power BI)
            |                       └── Sprint 6 (Hardening + Testing)
            └── Sprint 4 also requires Sprint 3 (Airtable IDs)
```

**Hard sequencing rules:**
1. Sprint 2 cannot begin until Sprint 1's `.gitignore` and branch protection are confirmed
2. Sprint 3 cannot begin until Supabase is live and all agent IDs are captured
3. Sprint 4 cannot begin until both Supabase (Sprint 2) and Airtable IDs (Sprint 3) are documented
4. Sprint 5 cannot begin until Supabase has real data from at least one Sprint 4 automation run
5. Sprint 6 security hardening must occur after all other sprints — you cannot harden what doesn't exist yet

---

## Rollback Procedures

### Rollback by Component

| Component | Rollback Method | Time to Rollback |
|---|---|---|
| Supabase schema change | Revert to prior migration SQL; run `DROP TABLE` or `ALTER TABLE` to undo | 30 minutes |
| n8n automation | Deactivate workflow in n8n UI; restore prior JSON export from GitHub | 15 minutes |
| Airtable structural change | Restore prior base from Airtable's revision history (5-day window on free plan; 6 months on Pro) | 30 minutes |
| Power BI dashboard | Re-publish prior `.pbix` file from GitHub | 10 minutes |
| Anthropic agent system prompt | Update agent via `PATCH /v1/agents/{agent_id}` with prior system prompt from GitHub | 5 minutes |
| Google Drive permissions | Change folder sharing settings in Drive UI | 5 minutes |

### When to Roll Back

Initiate rollback when:
- A live automation causes incorrect data to be written to Supabase and the write cannot be corrected by an UPDATE
- A Supabase migration causes data loss or breaks existing RLS policies
- A Power BI dashboard shows materially incorrect metrics that could affect fund decisions
- An agent produces outputs that violate the fund's policies (NPI in a log, unauthorized action attempted)

**Rollback authority:** Kerry approves all rollbacks. No rollback is initiated without Kerry's knowledge.

---

*This roadmap governs the build sequence for The Pinnacle Note Fund AI OS. Do not bypass the Definition of Done criteria for any sprint. Skipping ahead creates dependency failures that cost more time to fix than the shortcut saves.*
