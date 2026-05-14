# Build Roadmap — Tech Stack Implementation

**Fund:** The Pinnacle Note Fund
**Document:** Phased Build Roadmap
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Roadmap Overview

| Phase | Name | Duration | What Gets Built | Operational After |
|---|---|---|---|---|
| 0 | Foundation | 1–2 weeks | GitHub, 1Password, Supabase, MFA | Version control + secure database live |
| 1 | Core Operations | 2–4 weeks | n8n, Airtable command center, Google Drive | Tape intake + approval queue operational |
| 2 | Document Workflow | 1–2 weeks | DocuSign, Drive-Supabase link | Closing and signing workflow live |
| 3 | Property Data | 1–2 weeks | PropStream integration | Live AVM data feeding underwriting |
| 4 | Reporting Layer | 2–3 weeks | Power BI dashboards | All 8 dashboards live for CEO/CIO |
| 5 | Security Hardening | 1 week | Full security audit pass | Institutional-grade controls confirmed |
| 6 | Scale | Month 3+ | ATTOM, HouseCanary, advanced automation | Full institutional data stack |

**Total Phase 0–5 Target:** 8–14 weeks

---

## Phase 0 — Foundation
**Timeline:** Week 1–2
**Owner:** Kerry (setup) + Agent 18 (documentation and spec)

### Tasks

**GitHub (Day 1)**
- [ ] Create Standard Black GitHub organization
- [ ] Create private repo: `pinnacle-note-fund-ai-os`
- [ ] Push all AI OS files (56 files from local workspace)
- [ ] Set branch protection on `main` (require PR, no direct push)
- [ ] Add `.gitignore` — exclude `.env`, `*.key`, `*.pem`
- [ ] Invite Kody as Write collaborator; TJ as Read
- [ ] Confirm Kerry can push, create PRs, and merge

**1Password (Days 1–2)**
- [ ] Create 1Password Teams account
- [ ] Set up vaults: `Fund Operations`, `API Keys`, `System Credentials`, `Team Shared`
- [ ] Migrate all current credentials to 1Password (Anthropic key, Google credentials, etc.)
- [ ] Require Kerry, Kody, and TJ to set up 1Password before any system access
- [ ] Enable MFA on 1Password for all users (hardware key for Kerry)

**Supabase (Days 2–5)**
- [ ] Create Supabase project: `pinnacle-note-fund`
- [ ] Select region: US East (or closest to team)
- [ ] Enable RLS on all tables from day one (before any tables are created)
- [ ] Create initial schema — core tables (see schema spec below)
- [ ] Create service roles: `agent_service`, `n8n_service`, `powerbi_readonly`
- [ ] Create user roles: `ceo_cio`, `controller`, `operations`, `investor`
- [ ] Write RLS policies for all tables
- [ ] Store Supabase URL and anon key in 1Password
- [ ] Enable MFA for all Supabase dashboard users

**MFA (Days 1–5, concurrent)**
- [ ] Enable MFA on: GitHub, Supabase, Google Workspace, Airtable, Anthropic console
- [ ] Kerry, Kody, TJ all confirm MFA active before any live data enters any system

**Initial Supabase Schema — Phase 0:**
```sql
-- Core operational tables (create in this order for FK integrity)
agents (id, slug, name, agent_id, description, created_at)
tapes (id, tape_id, seller_name, loan_count, total_upb, received_date, status, go_no_bid, agent_session_id)
assets (id, asset_id, tape_id, address, city, state, upb, lien_position, status, health_score, classification, servicer, created_at, updated_at)
exceptions (id, exc_id, asset_id, type, severity, description, owner, vendor, required_fix, deadline, financial_impact, legal_impact, status)
decisions (id, decision_id, category, decision_text, agent_id, data_used, approver, status, created_at)
approvals (id, approval_id, type, requested_by, approved_by, item_description, conditions, final_status, created_at)
agent_sessions (id, agent_id, session_id, workflow_trigger, input_summary, output_summary, status, created_at)
audit_log (id, category, user_agent, action, file_system, reason, approval_status, outcome, created_at)
```

**Phase 0 Success Criteria:**
- [ ] GitHub repo live with all AI OS files
- [ ] All team members in 1Password with MFA
- [ ] Supabase core tables created with RLS enabled
- [ ] MFA active on all core systems
- [ ] Confirmed: no sensitive credentials exist outside 1Password

---

## Phase 1 — Core Operations Layer
**Timeline:** Week 2–5
**Owner:** Kerry + n8n builder (Kerry or hired contractor)

### Tasks

**n8n Setup (Days 1–3)**
- [ ] Create n8n Cloud account (or deploy self-hosted instance)
- [ ] Store n8n admin credentials in 1Password
- [ ] Connect n8n to Supabase (`n8n_service` role credentials from 1Password)
- [ ] Connect n8n to Anthropic API (API key from 1Password)
- [ ] Connect n8n to Google Drive (OAuth2 service account)
- [ ] Test connection: manually trigger a test agent session from n8n → confirm session logs in `agent_sessions`

**First n8n Workflow: Tape Intake (WF-01 automation)**
- [ ] Trigger: new file in Google Drive `/Acquisitions/Active Tapes`
- [ ] Step 1: n8n downloads file, sends to Agent 18 session (normalization instruction + file content)
- [ ] Step 2: Agent 18 output (quality score, normalized data) written to Supabase `tapes` table
- [ ] Step 3: n8n triggers Agent 02 session (screening instruction + normalized tape summary)
- [ ] Step 4: Agent 02 output (go/no-bid, tape screening report) written to Supabase `acquisition_pipeline`
- [ ] Step 5: n8n creates Airtable record in Acquisition Pipeline base (tape ID, status, go/no-bid)
- [ ] Step 6: n8n sends notification to Kerry (email) — tape screened, go/no-bid recommendation ready

**Airtable Command Center Setup (Days 3–7)**
- [ ] Create Airtable workspace: `Pinnacle Note Fund`
- [ ] Build Base 1: Acquisition Pipeline
  - Tables: Tape Log, LOI Tracker, Deal Stages
  - Views: Active Tapes, Bid Deadlines (7 days), Accepted LOIs
- [ ] Build Base 2: Exception Tracker
  - Tables: Open Exceptions, Resolved Exceptions
  - Views: Critical Open, Major Open (by deadline), By Asset
- [ ] Build Base 3: Approval Queue
  - Tables: Pending Approvals, Completed Approvals
  - Views: CEO/CIO Action Required Today, All Pending by Type
- [ ] Build Base 4: Agent Task Log
  - Tables: Sessions, Status, Output Links
  - View: Active Sessions, Completed Today
- [ ] Connect Airtable to n8n (API key from 1Password)
- [ ] Test: tape intake workflow writes to Airtable Acquisition Pipeline

**Google Drive Structure (Day 1)**
- [ ] Create Shared Drive: `Pinnacle Note Fund`
- [ ] Build full folder structure (see implementation_order.md Phase 1.4)
- [ ] Set sharing permissions by folder (no broad sharing)
- [ ] Share with Kody (Content Manager), TJ (Content Manager — team folders only)

**Phase 1 Success Criteria:**
- [ ] Tape intake workflow runs end-to-end: file upload → Agent 18 → Agent 02 → Supabase → Airtable → notification to Kerry
- [ ] Kerry can see acquisition pipeline and approval queue in Airtable
- [ ] Exception tracker operational (Agent 05 can log exceptions when diligence begins)
- [ ] All data from agent sessions stored in Supabase

---

## Phase 2 — Document Workflow
**Timeline:** Week 5–7

### Tasks

**DocuSign Setup**
- [ ] Create DocuSign account (Standard plan)
- [ ] Store DocuSign credentials in 1Password
- [ ] Connect DocuSign to n8n (OAuth2, DocuSign API)
- [ ] Build Template 1: LP Subscription Agreement
  - Pre-fill investor name, date, investment amount from n8n input
  - Signing roles: Investor (sign), Kerry Kelley Jr as CEO/CIO (countersign)
- [ ] Build Template 2: Vendor Contract Execution
  - Signing roles: Vendor (sign), Kerry as CEO/CIO (countersign)
- [ ] Test: n8n sends DocuSign envelope → both parties sign → completed doc received via webhook

**DocuSign → Google Drive Workflow**
- [ ] Build n8n workflow: DocuSign completion webhook → Google Drive upload
  - File named: `{Document Type}_{Name}_{Date}.pdf`
  - Filed in correct folder based on document type (see integration_map.md INT-10)
- [ ] Test: complete a DocuSign test envelope → confirm PDF appears in correct Google Drive folder

**Supabase `documents` Table**
- [ ] Create `documents` table: id, document_type, file_name, google_drive_id, drive_path, docusign_envelope_id, signed_date, signed_by, asset_id (nullable FK), investor_id (nullable FK)
- [ ] n8n workflow writes document metadata to Supabase when DocuSign is complete
- [ ] Agents 05 and 17 can query `documents` table to confirm file exists

**Phase 2 Success Criteria:**
- [ ] LP subscription envelope fully automated (triggered → signed → filed)
- [ ] Vendor contract envelope fully automated
- [ ] All completed documents indexed in Supabase `documents` table
- [ ] Google Drive folder structure reflects organized, signed documents

---

## Phase 3 — Property Data
**Timeline:** Week 6–8 (can run parallel with Phase 2)

### Tasks

**PropStream API**
- [ ] Confirm PropStream API access tier (check if included in current plan or requires upgrade)
- [ ] Store PropStream API credentials in 1Password
- [ ] Create `property_data` and `property_data_history` tables in Supabase (see schema in integration_map.md)
- [ ] Build n8n workflow: after tape normalization (Agent 18 complete), pull PropStream data for each loan
  - Loop through each loan in the tape
  - API call per loan address → PropStream returns AVM, taxes, ownership, liens, foreclosure status
  - Write to `property_data` table in Supabase
  - Store snapshot in `property_data_history`
- [ ] Update Agent 03 session input template: include PropStream data from `property_data` table
- [ ] Update Agent 04 session input template: include PropStream AVM in pricing model inputs
- [ ] Test: ingest a small test tape, confirm PropStream data appears in Supabase, confirm Agent 03 output reflects AVM values

**Phase 3 Success Criteria:**
- [ ] PropStream data automatically pulled for every new tape
- [ ] Agent 03 and Agent 04 underwriting and pricing sessions use live PropStream AVM
- [ ] Property data refreshed for existing portfolio assets monthly

---

## Phase 4 — Reporting Layer
**Timeline:** Week 7–10

### Tasks

**Power BI Setup**
- [ ] Purchase Power BI Pro license (Kerry minimum)
- [ ] Connect Power BI to Supabase via PostgreSQL connector
  - Use `powerbi_readonly` service role (credentials from 1Password)
  - Test connection: confirm Power BI can query `assets` table
- [ ] Build Dashboard 1: Executive Dashboard
  - Fund snapshot card (total UPB, asset count, sleeve mix)
  - Open approvals queue (live — DirectQuery)
  - Risk status overview (Green/Amber/Red limits)
  - Top 5 upcoming deadlines
- [ ] Build Dashboard 2: Acquisition Pipeline Dashboard
- [ ] Build Dashboard 3: Underwriting Dashboard
- [ ] Build Dashboard 4: Portfolio Dashboard
- [ ] Build Dashboard 5: NPL/Workout Dashboard
- [ ] Build Dashboard 6: Cash & Liquidity Dashboard
- [ ] Build Dashboard 7: Investor Reporting Dashboard
- [ ] Build Dashboard 8: Risk Dashboard

**Investor Report Export**
- [ ] Build Power BI report layout matching `investor_report_template.md`
- [ ] Configure PDF export: full report as PDF, formatted for LP distribution
- [ ] Test: generate a sample investor report PDF from test data
- [ ] Build n8n workflow: quarterly report cycle → trigger Agent 17 → Power BI PDF export → Agent 14 compliance review queue → CEO/CIO approval → distribute

**Phase 4 Success Criteria:**
- [ ] All 8 dashboards rendering with live data from Supabase
- [ ] Executive Dashboard showing live open approvals (DirectQuery)
- [ ] Investor report PDF export functioning
- [ ] Kerry is using Power BI as primary reporting view

---

## Phase 5 — Security Hardening
**Timeline:** Week 11–12

### Tasks (Agent 15 leads audit; Agent 18 executes fixes)

- [ ] Audit all Supabase RLS policies — document each policy, confirm no table is accessible without proper role
- [ ] Audit all n8n service credentials — confirm all were created within the rotation window (90 days); rotate any overdue
- [ ] Audit Google Drive sharing — review all shared files/folders; remove any over-permissioned links
- [ ] Confirm MFA active for all users on all systems (audit admin panels of each system)
- [ ] Audit Airtable permissions — confirm no public view links; confirm correct role per user
- [ ] Test agent service role: confirm `agent_service` can only write to designated tables and cannot access investor financial data
- [ ] Confirm `audit_log` is append-only: attempt a delete/update and verify it fails
- [ ] Document all active access grants in Supabase `access_log` table
- [ ] Conduct tabletop incident response exercise: simulate a compromised API key; walk through response protocol from `security_requirements.md`
- [ ] Confirm `powerbi_readonly` role: attempt a write from Power BI — confirm it fails

**Phase 5 Success Criteria:**
- [ ] Agent 15 quarterly control test pass: zero failures
- [ ] All credentials within rotation window
- [ ] All RLS policies verified
- [ ] MFA confirmed active for all users on all systems
- [ ] Incident response protocol tested

---

## Phase 6 — Scale (Month 3+)

### ATTOM Integration
- [ ] Evaluate ATTOM Data Solutions API plan (select tier based on loan volume)
- [ ] Build n8n workflow: ATTOM supplements PropStream with enhanced historical data and distress scoring
- [ ] Update `property_data` schema to include ATTOM-specific fields
- [ ] Update Agent 03 and Agent 04 session inputs to include ATTOM data

### HouseCanary Integration
- [ ] Evaluate HouseCanary API (AVM + market conditions)
- [ ] Integrate HouseCanary AVM as second-opinion valuation source (alongside PropStream)
- [ ] Feed HouseCanary HPA market forecasts into Agent 13 stress test inputs
- [ ] Update Risk Dashboard to show HouseCanary-based downside scenarios

### Advanced Airtable Buildout
- [ ] Build Base 5: Investor CRM (full build — Agent 16 feeds)
- [ ] Build Base 6: Vendor Scorecards (Agent 08 feeds)
- [ ] Build Base 7: Compliance Review Queue (Agent 14 feeds)
- [ ] Build Base 8: NPL Strategy Tracker (Agent 07 feeds — legal deadlines, resolution paths)

### Full Workflow Automation (n8n — all 6 core workflows)
- [ ] WF-02: Closing and Boarding (LOI acceptance through boarding QA)
- [ ] WF-03: Monthly Portfolio Management (full automation from servicer report upload through investor report release)
- [ ] WF-04: NPL Resolution workflow
- [ ] WF-05: Investor Reporting cycle (quarterly)
- [ ] WF-06: Distribution process

### GitHub Actions CI/CD
- [ ] Build GitHub Action: push to main → update agent system prompts via Anthropic API
- [ ] Build GitHub Action: policy change → auto-log in Supabase `audit_log`

### Telegram Integration
- [ ] Connect Telegram to n8n (bot token)
- [ ] Route CEO/CIO alerts and approval notifications to Telegram
- [ ] Kerry receives real-time notifications for: URGENT flags, APPROVAL NEEDED items, agent session completions, security incidents

---

## Build Assignments

| Phase | Who Builds | Skills Required |
|---|---|---|
| 0 — Foundation | Kerry (account setup) | Account creation, basic database concepts |
| 1 — Core Ops | Kerry or contractor | n8n workflow builder, Airtable admin, Supabase SQL basics |
| 2 — Documents | Kerry or contractor | n8n + DocuSign API, Google Drive API |
| 3 — Property Data | Contractor recommended | API integration, n8n, Supabase SQL |
| 4 — Reporting | Kerry or contractor | Power BI (intermediate), Supabase query basics |
| 5 — Security | Agent 15 directs; Kerry executes | System admin across all platforms |
| 6 — Scale | Contractor | API integration, advanced n8n, SQL |

**Contractor Recommendation:** For Phases 1–3, a single n8n/Supabase developer can handle the integration build. Estimated: 40–60 hours of development work for Phases 1–3 combined. Source via Upwork (search: "n8n Supabase integration" or "no-code fund automation").

---

## Dependencies Map

```
Phase 0 (GitHub + 1Password + Supabase + MFA)
    |
    +-- Phase 1 (n8n + Airtable + Google Drive)
    |       |
    |       +-- Phase 2 (DocuSign) -- can start after Phase 1 n8n is up
    |       |
    |       +-- Phase 3 (PropStream) -- can start after Phase 1 n8n is up
    |       |
    |       +-- Phase 4 (Power BI) -- needs data in Supabase (Phase 1 must have data)
    |               |
    |               +-- Phase 5 (Security Audit) -- after Phase 4 completes
    |                       |
    |                       +-- Phase 6 (Scale) -- ongoing from month 3+
```

Phases 2 and 3 can be built in parallel (both depend on Phase 1 n8n being operational).
Phase 4 needs real data in Supabase — even test data from a pilot tape intake is sufficient to validate dashboards.
