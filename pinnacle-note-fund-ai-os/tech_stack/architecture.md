# Tech Stack Architecture — The Pinnacle Note Fund AI OS

**Document:** System Architecture
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## System Overview

The Pinnacle Note Fund AI Operating System is a cloud-native, AI-first fund management platform. The 18 Anthropic Managed Agents are the intelligence layer. The tech stack is the infrastructure that feeds them data, stores their outputs, routes human approvals, automates workflows, and presents results to the CEO/CIO and team.

**Design Principle:** Agents produce structured outputs. The stack captures, routes, stores, and surfaces those outputs so the human team can review, approve, and act — at institutional quality.

---

## Stack Components and Roles

### 1. Claude Code + GitHub
**Role:** Build environment, version control, AI OS repository, and audit trail.

- All 18 agent files, policies, workflows, templates, and dashboards live in GitHub
- Claude Code is the development environment for building and updating the OS
- Every change to the AI OS is a git commit — this is the system's change log and audit trail
- Branching strategy: `main` = production AI OS, feature branches for development
- GitHub Actions (future): automate deployment of updated agent system prompts and policy files

### 2. Supabase
**Role:** Primary backend database, authentication, file storage, API layer, and agent session/log store.

**Database (PostgreSQL):**
- Loan portfolio tables (asset register, loan data, payment history)
- Investor registry (LP capital accounts, contribution history, distribution records)
- Exception log, decision log, approval log, compliance log, vendor issue log, audit log
- Agent session metadata and outputs (structured JSON from each agent run)
- Acquisition pipeline (tapes, LOIs, bid history)
- Vendor/servicer registry and SLA tracking

**Authentication:**
- JWT-based auth for all human users (Kerry, Kody, TJ, future team members)
- Row-Level Security (RLS) policies enforce data access at the database level
- Service roles for agent API access and n8n integrations

**Storage:**
- Fund documents (loan files, collateral documents, closing packages)
- Investor documents (subscription agreements, K-1s, investor reports)
- Backup store for agent output artifacts

**PostgREST API:**
- Auto-generated REST API from the Supabase schema
- Used by n8n workflows, Airtable (via n8n bridge), and future front-end apps
- Agent outputs POST to Supabase via API after each session

### 3. Airtable
**Role:** Daily command center interface for the human team.

- Kerry, Kody, and TJ interact with fund operations through Airtable bases
- Human approval queue: all items requiring CEO/CIO action appear here in real time
- Acquisition pipeline tracker (visual, easy to update, linked records)
- Exception tracker with status management
- Agent task queue: what each agent is working on, output status
- Investor CRM (linked to Supabase via n8n sync)
- Vendor scorecard summary views
- Designed for non-technical daily use — the command center, not the database

### 4. n8n
**Role:** Workflow automation engine — the connective tissue of the entire stack.

- Triggers agent sessions based on events (new tape received, monthly report cycle, deadline approaching)
- Routes agent outputs from Anthropic API to Supabase for storage
- Syncs Supabase data to Airtable for the command center view
- Sends notifications and alerts to the team (email, Telegram when integrated)
- Executes scheduled workflows (monthly portfolio review, quarterly reporting cycle)
- Orchestrates multi-agent workflows (tape intake triggers Agents 18 → 02 → 03 → 04 in sequence)
- Pushes PropStream/ATTOM data into Supabase for agent consumption

### 5. Google Drive + DocuSign
**Role:** Document storage, organization, and electronic signature execution.

**Google Drive:**
- Primary document repository for all fund documents
- Folder structure mirrors fund workflow: /Acquisitions, /Portfolio, /Investors, /Legal, /Compliance, /Reporting
- Shared drives for team collaboration
- Agent 05 (Diligence) references Google Drive for collateral file review
- Agent 17 (DDQ/Data Room) manages investor data room folders

**DocuSign:**
- All documents requiring signatures route through DocuSign
- Loan purchase agreements, closing documents, transfer/assignment forms
- LP subscription agreements, side letters
- Vendor contracts, servicer agreements
- DocuSign envelopes triggered by n8n workflows
- Completed documents automatically filed in Google Drive

**Future consideration:** Box as alternative if advanced permissions/compliance features are needed.

### 6. Power BI
**Role:** Dashboards and fund reporting — visual reporting layer for the CEO/CIO.

- Connects directly to Supabase (PostgreSQL) via Power BI connector
- Renders all 8 operational dashboards from the AI OS in visual, interactive format:
  - Executive Dashboard
  - Acquisition Pipeline Dashboard
  - Underwriting Dashboard
  - Portfolio Dashboard
  - NPL/Workout Dashboard
  - Cash & Liquidity Dashboard
  - Investor Reporting Dashboard
  - Risk Dashboard
- Scheduled data refresh (daily minimum; real-time for critical metrics via DirectQuery)
- Investor reports exported from Power BI for distribution (PDF via Agent 17)
- CEO/CIO accesses Power BI for at-a-glance fund status

### 7. PropStream (Phase 1) + ATTOM + HouseCanary (Phase 2)
**Role:** Property data, valuations, AVM, tax data, and market intelligence.

**PropStream (now):**
- Property details, ownership history, tax records, liens, mortgage history
- AVM (automated valuation model) for underwriting and portfolio monitoring
- Comparable sales and rental data
- Used by Agents 03, 04, 05, and 07 for underwriting, pricing, diligence, and workout
- Data pulled via PropStream API (or manual lookup initially) and stored in Supabase

**ATTOM (Phase 2):**
- Institutional-grade property data API
- Tax assessments, deed transfers, foreclosure records, distress indicators
- Enhanced AVM with confidence intervals
- Bulk data pulls for portfolio monitoring

**HouseCanary (Phase 2):**
- High-accuracy AVM with confidence scores
- Market condition forecasts (HPA projections)
- Used for Agent 13 (Risk Analytics) stress testing and Agent 04 pricing

### 8. Security Layer
**Role:** End-to-end security across all systems.

**1Password:**
- All team members use 1Password for credential management
- Shared vaults for fund API keys, system credentials, and service accounts
- No credentials stored in plain text, spreadsheets, or email

**MFA (Multi-Factor Authentication):**
- Mandatory MFA on all systems: Supabase, GitHub, Airtable, Google Drive, DocuSign, Power BI, PropStream
- Preferred MFA method: authenticator app (TOTP); hardware key for highest-risk access
- No SMS-only MFA on any fund system

**Supabase Row-Level Security (RLS):**
- Every database table has RLS policies enabled
- Users only see data their role permits — investors see only their own records
- Agent service roles have scoped, read/write permissions per table
- No direct database access without RLS enforcement

**Role-Based Access Control (RBAC):**
- Roles defined: CEO/CIO (full access), Controller (financial data), Operations (portfolio/pipeline), Investor (own records only), Agent Service Account (specific tables only), Read-Only (audit/reporting)
- Roles enforced at Supabase (RLS), Airtable (permissions), GitHub (team roles), Google Drive (sharing settings)

---

## Data Flow Architecture

```
INPUTS
  Loan Tapes (Excel/CSV from sellers)
  Servicer Reports (monthly remittance files)
  Property Data (PropStream/ATTOM/HouseCanary APIs)
  Investor Contributions (wire confirmations)
  Team Actions (approvals, decisions via Airtable)
        |
        v
NORMALIZATION & INTAKE
  Agent 18 (Data & Automation) -- normalizes tapes, validates data
  n8n -- routes data to correct Supabase tables
  Google Drive -- stores raw files and documents
        |
        v
INTELLIGENCE LAYER (18 Anthropic Managed Agents)
  Agents triggered by n8n workflows or direct API call
  Agents read from Supabase (current portfolio data, policies, logs)
  Agents produce structured outputs (recommendations, reports, flags)
  Agent outputs stored back to Supabase via n8n
        |
        v
HUMAN APPROVAL LAYER
  Airtable command center -- Kerry/team sees all pending approvals and outputs
  Approval decisions recorded in Airtable, synced to Supabase approval log
  CEO/CIO authorization captured before any consequential action proceeds
        |
        v
EXECUTION
  Wires -- authorized human executes (dual approval documented in Supabase)
  DocuSign -- documents executed via workflow trigger from n8n
  Servicer instructions -- sent by Agent 08 after CEO/CIO approval
  Investor communications -- sent by Agent 16/17 after compliance + CEO/CIO approval
        |
        v
REPORTING & MONITORING
  Power BI -- reads Supabase, renders 8 dashboards in real time
  Agent 17 -- produces PDF investor reports exported from Power BI + Supabase data
  Agent 15 -- runs quarterly control tests against Supabase logs
  Agent 13 -- runs monthly risk limit checks against Supabase portfolio data
```

---

## Technology Boundaries

| Layer | Technology | What It Does NOT Do |
|---|---|---|
| Intelligence | Anthropic Managed Agents | Does not store data permanently; does not execute wires or approvals |
| Database | Supabase | Does not trigger workflows; does not present UI to team |
| Command Center | Airtable | Is not the system of record; does not run automations directly |
| Automation | n8n | Does not store data; does not make fund decisions |
| Documents | Google Drive + DocuSign | Does not manage data; does not run analytics |
| Reporting | Power BI | Does not store data; reads Supabase only |
| Property Data | PropStream/ATTOM/HouseCanary | Data input only; no decision authority |
| Security | 1Password + MFA + RLS + RBAC | Enforces access; does not manage operations |

---

## Hosting and Infrastructure

| Component | Hosting | Notes |
|---|---|---|
| Anthropic Agents | Anthropic Cloud | Managed by Anthropic; accessed via API |
| Supabase | Supabase Cloud (managed) | Start on free/pro tier; scale as fund grows |
| n8n | n8n Cloud or self-hosted | n8n Cloud recommended for reliability |
| Airtable | Airtable Cloud | Pro plan minimum for API access and automations |
| GitHub | GitHub Cloud | Private repository; org account |
| Power BI | Microsoft Cloud | Power BI Pro license per user |
| Google Drive | Google Workspace | Business Starter minimum |
| DocuSign | DocuSign Cloud | Standard plan minimum |
| PropStream | PropStream Cloud | Subscription plan |
