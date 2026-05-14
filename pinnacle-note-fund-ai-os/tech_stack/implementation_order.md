# Implementation Order — Tech Stack Build

**Fund:** The Pinnacle Note Fund
**Document:** Stack Implementation Sequence
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Guiding Principle

Build the foundation before the interface. Get data storage and security right first — everything else sits on top of it. Each phase delivers operational value before the next phase begins.

---

## Phase 0 — Foundation (Do This First)
**Goal:** Establish the core infrastructure that everything else depends on.
**Time Estimate:** 1–2 weeks

### 0.1 GitHub Repository (Day 1)
- Create private GitHub organization for Standard Black / Pinnacle Note Fund
- Initialize repo: `pinnacle-note-fund-ai-os`
- Move existing AI OS files (agents/, workflows/, policies/, templates/, dashboards/, logs/, tech_stack/) into the repo
- Set up branch protection on `main` — no direct pushes, require PR
- Add `.gitignore` for `.env` files and sensitive data
- Store repo URL in decision log

### 0.2 1Password Setup (Day 1–2)
- Set up 1Password account for Standard Black team
- Create vaults: `Fund Operations`, `API Keys`, `System Credentials`, `Investor Data`
- Add all current credentials: Anthropic API key, Supabase, Airtable, Google, etc.
- Require all team members (Kerry, Kody, TJ) to set up 1Password before accessing any fund system
- Enable 1Password for Teams — shared vault access by role

### 0.3 Supabase Project (Days 2–5)
- Create Supabase project: `pinnacle-note-fund`
- Design initial schema (see schema spec below)
- Enable Row-Level Security on all tables from day one — no exceptions
- Create service roles: `agent_service`, `n8n_service`, `powerbi_readonly`
- Create user roles: `ceo_cio`, `controller`, `operations`, `investor`
- Store Supabase URL and keys in 1Password
- Enable MFA for all Supabase dashboard users

### 0.4 MFA Enforcement (Days 1–5, alongside above)
- Enable MFA on: GitHub, Supabase, Google Workspace, Airtable, Anthropic console
- Document MFA method (authenticator app) for each system in 1Password
- Confirm all three team members have MFA active before any live data enters any system

**Phase 0 Success Criteria:**
- [ ] GitHub repo live with AI OS files
- [ ] 1Password active for all team members
- [ ] Supabase project created with RLS enabled on all tables
- [ ] MFA active on all core systems for all users

---

## Phase 1 — Core Operations Layer
**Goal:** Get the daily operational workflow running — pipeline management, approval queue, agent output capture.
**Time Estimate:** 2–4 weeks
**Depends On:** Phase 0 complete

### 1.1 Supabase Schema — Core Tables
Build the initial database schema covering:
- `assets` — loan portfolio (one row per loan)
- `tapes` — tape ingestion log (one row per tape received)
- `acquisition_pipeline` — deal stages from tape to close
- `exceptions` — exception log (maps to `/logs/exception_log.md`)
- `decisions` — decision log (maps to `/logs/decision_log.md`)
- `approvals` — approval log (maps to `/logs/approval_log.md`)
- `agent_sessions` — record of every agent session: agent_id, timestamp, input summary, output summary, status

### 1.2 n8n Setup
- Create n8n workspace (Cloud or self-hosted)
- Connect n8n to Supabase (service role credentials from 1Password)
- Connect n8n to Anthropic API (agent sessions trigger)
- Build first workflow: **Tape Intake Trigger** — when a tape file is uploaded to Google Drive, n8n triggers Agent 18 to begin normalization
- Store n8n credentials in 1Password

### 1.3 Airtable Command Center — Phase 1 Bases
Build these Airtable bases first:
- **Acquisition Pipeline** — tape log, LOI tracker, bid status, deal stages
- **Exception Tracker** — open exceptions by severity, owner, deadline
- **Approval Queue** — items awaiting CEO/CIO action (synced from Supabase via n8n)
- **Agent Task Log** — current agent sessions, status, output links

Airtable is read/write for the team; source of truth remains Supabase. n8n handles the sync.

### 1.4 Google Drive Structure
Create the fund's Google Drive folder structure:
```
/Pinnacle Note Fund
  /Acquisitions
    /Active Tapes
    /LOIs
    /Due Diligence
    /Closing Packages
  /Portfolio
    /Loan Files (by Asset ID)
    /Servicer Reports
  /Investors
    /Subscription Documents
    /K-1s and Tax Documents
    /Investor Reports
    /Data Room
  /Legal
    /Entity Documents
    /Vendor Contracts
    /Counsel Correspondence
  /Compliance
    /Reviewed Materials
    /Compliance Log
  /Reporting
    /Quarterly Reports
    /Monthly Portfolio Reports
```
Share with team at appropriate permission levels.

**Phase 1 Success Criteria:**
- [ ] Supabase core tables built with RLS policies
- [ ] n8n connected to Supabase and Anthropic
- [ ] Tape intake workflow running end-to-end (upload → agent trigger → output stored)
- [ ] Airtable command center live with approval queue visible to Kerry
- [ ] Google Drive folder structure created and shared

---

## Phase 2 — Document Workflow + Signatures
**Goal:** Close the loop on document management — from diligence to closing to investor agreements.
**Time Estimate:** 1–2 weeks
**Depends On:** Phase 1 complete

### 2.1 DocuSign Integration
- Set up DocuSign account (Standard plan minimum)
- Connect DocuSign to n8n (DocuSign n8n node or API)
- Build first DocuSign workflow: **LP Subscription Agreement** — Agent 16 drafts, DocuSign template used, new investor countersigns, completed doc filed in Google Drive
- Build second workflow: **Vendor Contract Execution** — contract drafted, CEO/CIO signs via DocuSign, filed in Google Drive /Legal/Vendor Contracts

### 2.2 Google Drive + Supabase Link
- n8n workflow: when a document is added to Google Drive (loan file, closing doc, investor report), log the file metadata (name, path, date, type) to a Supabase `documents` table
- This gives Agent 05 and Agent 17 a queryable index of where every document lives

**Phase 2 Success Criteria:**
- [ ] DocuSign templates built for LP subscription and vendor contracts
- [ ] n8n triggers DocuSign envelope on workflow event
- [ ] Completed documents auto-filed in Google Drive
- [ ] Document index in Supabase queryable by agents

---

## Phase 3 — Property Data Integration
**Goal:** Feed live property data into the underwriting and risk workflow.
**Time Estimate:** 1–2 weeks
**Depends On:** Phase 1 complete

### 3.1 PropStream API Connection
- Set up PropStream API access (or begin with manual export workflow if API tier not yet active)
- Build n8n workflow: for each loan in a tape, pull PropStream data (AVM, tax status, ownership history) and populate a `property_data` table in Supabase
- Agents 03, 04, 05, and 07 read from `property_data` in Supabase when underwriting or pricing

### 3.2 Property Data Table Schema
```
property_data:
  asset_id (FK -> assets)
  address, city, state, zip
  avm_value, avm_date, avm_source
  tax_status, tax_year, tax_amount
  last_sale_date, last_sale_price
  ownership_name
  foreclosure_status, foreclosure_date
  liens_total
  pulled_at (timestamp)
```

**Phase 3 Success Criteria:**
- [ ] PropStream data populating Supabase for new tapes
- [ ] Agents 03 and 04 referencing Supabase property data in underwriting and pricing sessions

---

## Phase 4 — Reporting Layer
**Goal:** Real-time visual dashboards for CEO/CIO using Power BI connected to Supabase.
**Time Estimate:** 2–3 weeks
**Depends On:** Phase 1 complete (needs data in Supabase to display)

### 4.1 Power BI Setup
- Set up Power BI Pro licenses (Kerry minimum; add team as fund grows)
- Connect Power BI to Supabase via PostgreSQL connector (read-only service role)
- Build the 8 operational dashboards in Power BI (visual rendering of the AI OS dashboards):
  1. Executive Dashboard
  2. Acquisition Pipeline
  3. Underwriting Dashboard
  4. Portfolio Dashboard
  5. NPL/Workout Dashboard
  6. Cash & Liquidity Dashboard
  7. Investor Reporting Dashboard
  8. Risk Dashboard
- Schedule daily data refresh; use DirectQuery for real-time critical metrics

### 4.2 Investor Report Export
- Build Power BI report layout matching the investor report template
- Configure PDF export for quarterly investor report distribution
- Agent 17 triggers report generation and routes to Agent 14 for compliance review

**Phase 4 Success Criteria:**
- [ ] Power BI connected to Supabase
- [ ] All 8 operational dashboards rendering with live data
- [ ] Investor report PDF export workflow functioning
- [ ] CEO/CIO reviewing Power BI dashboards as primary reporting view

---

## Phase 5 — Security Hardening
**Goal:** Tighten security as operations scale. This is ongoing but gets a formal pass after Phase 4.
**Time Estimate:** 1 week (audit pass); ongoing maintenance
**Depends On:** Phases 0–4 complete

- Audit all Supabase RLS policies — confirm no table is accessible without proper role
- Audit all n8n service credentials — rotate any that have been active >90 days
- Audit Google Drive sharing — remove any over-shared links
- Confirm all team members have MFA active on all systems
- Review Airtable permissions — confirm no public links to sensitive bases
- Test agent service role permissions — confirm agents can read/write only their designated tables
- Document all access grants in the access log (Supabase `access_log` table)

---

## Phase 6 — Scale and Enhancement
**Goal:** Add institutional-grade data sources and advanced automation as the fund scales.
**Time Estimate:** Ongoing from month 3+

### 6.1 ATTOM Data Integration
- Replace or supplement PropStream with ATTOM bulk data API
- Enables deeper historical data, distress scoring, and enhanced tax record access

### 6.2 HouseCanary AVM Integration
- Add HouseCanary AVM alongside PropStream for second-opinion valuations
- High-confidence interval AVMs support Agent 04 (Pricing) and Agent 13 (Risk/Stress Testing)
- HouseCanary market forecasts feed Agent 13's HPA stress scenarios

### 6.3 Airtable Command Center — Full Build
Add remaining command center bases:
- Investor CRM (Agent 16 feeds)
- Vendor Scorecards (Agent 08 feeds)
- Compliance Review Queue (Agent 14 feeds)
- NPL Strategy Tracker (Agent 07 feeds)
- Monthly Portfolio Review Dashboard (Agent 06 feeds)

### 6.4 Advanced n8n Workflows
- Full 6-workflow automation (all WF-01 through WF-06 from workflows/ directory)
- Automated monthly report generation triggers
- Automated deadline alerts and escalation routing
- Telegram integration for real-time CEO/CIO notifications (when Telegram is integrated)

### 6.5 GitHub Actions CI/CD
- Automate AI OS deployment: PR to main → GitHub Action updates agent system prompts via Anthropic API
- Policy change → automated audit log entry in Supabase
