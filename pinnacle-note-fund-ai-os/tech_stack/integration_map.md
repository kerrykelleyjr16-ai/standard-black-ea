# Integration Map — The Pinnacle Note Fund AI OS

**Document:** System Integration and Data Flow Map
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Overview

This document maps every integration point in the tech stack — how each tool connects to others, what data flows between them, what triggers the flow, and which direction data moves. This is the plumbing diagram for the operating system.

---

## Integration Index

| # | From | To | Method | Trigger | Data |
|---|---|---|---|---|---|
| INT-01 | Google Drive | n8n | Webhook / Drive trigger | File uploaded to specified folder | File metadata, content |
| INT-02 | n8n | Anthropic API | REST API (POST) | Workflow event | Agent session request with input |
| INT-03 | Anthropic API | n8n | REST API (response) | Agent session complete | Structured agent output (JSON) |
| INT-04 | n8n | Supabase | PostgREST API | Agent output received | Structured data written to tables |
| INT-05 | n8n | Airtable | Airtable API | Supabase write complete | Key fields synced for command center |
| INT-06 | Supabase | Power BI | PostgreSQL connector | Scheduled refresh (daily/live) | All operational tables |
| INT-07 | PropStream | n8n | PropStream API | Tape normalization trigger | Property data per loan |
| INT-08 | n8n | Supabase | PostgREST API | PropStream data received | `property_data` table populated |
| INT-09 | n8n | DocuSign | DocuSign API | Document execution trigger | Document template + signer info |
| INT-10 | DocuSign | Google Drive | DocuSign Connect webhook | Envelope completed | Completed signed document |
| INT-11 | n8n | Google Drive | Google Drive API | Workflow event | File metadata operations |
| INT-12 | GitHub | n8n (future) | GitHub webhook | Push to main branch | Policy/agent file changes |
| INT-13 | n8n | Anthropic API (future) | REST API | Policy change trigger | System prompt updates for agents |

---

## Detailed Integration Specs

---

### INT-01: Google Drive → n8n
**Direction:** Google Drive notifies n8n
**Method:** Google Drive webhook trigger (n8n Google Drive node)
**Trigger Events:**
- New file uploaded to `/Active Tapes` → triggers tape intake workflow (WF-01)
- New servicer report uploaded to `/Servicer Reports` → triggers monthly portfolio review (WF-03)
- New collateral package uploaded to `/Due Diligence/{Tape ID}` → triggers diligence workflow (WF-02)

**Data Passed to n8n:**
- File ID, file name, folder path, uploader, upload timestamp
- n8n fetches file content on demand using Google Drive API

**Authentication:** OAuth2 service account (credentials stored in 1Password, configured in n8n)

---

### INT-02: n8n → Anthropic API (Agent Session Start)
**Direction:** n8n creates a session with the target Managed Agent
**Method:** REST API — `POST /v1/agents/{agent_id}/sessions`
**Headers:** `anthropic-beta: managed-agents-2026-04-01`, `x-api-key: {ANTHROPIC_API_KEY}`

**Payload Structure:**
```json
{
  "input": {
    "content": "Task description and relevant data context for this session"
  }
}
```

**Input Construction:** n8n assembles the session input by:
1. Pulling relevant Supabase data for the agent's task (loan data, tape summary, prior exceptions, etc.)
2. Including any file references or summaries from Google Drive
3. Stating the specific task for this session

**Agent IDs:** All 18 agent IDs stored in n8n as environment variables (sourced from `.env`)

---

### INT-03: Anthropic API → n8n (Agent Output)
**Direction:** Anthropic API returns session output to n8n
**Method:** Synchronous REST response or SSE streaming response
**Output Format:** Structured JSON containing agent's work product

**n8n Processing:**
- Parse the agent output
- Extract key structured fields (recommendation, exceptions found, amounts, dates, status flags)
- Route to appropriate downstream integrations (Supabase write, Airtable sync, notification)

---

### INT-04: n8n → Supabase (Agent Output Storage)
**Direction:** n8n writes to Supabase
**Method:** PostgREST API (`POST /rest/v1/{table}`)
**Authentication:** Supabase service role key (stored in 1Password, configured in n8n as environment variable)

**Key Write Operations per Agent:**

| Agent | Table Written | Key Fields |
|---|---|---|
| Agent 01 | `agent_sessions`, `decisions` | session_id, agent_id, output_summary, items_escalated |
| Agent 02 | `tapes`, `acquisition_pipeline` | tape_id, go_no_bid, recommended_bid, seller_name |
| Agent 03 | `assets` | asset_id, health_score, classification, uw_flags |
| Agent 04 | `acquisition_pipeline` | tape_id, recommended_bid, max_bid, base_irr, upside_irr, downside_irr |
| Agent 05 | `exceptions`, `assets` | exc_id, severity, required_fix, closing_ready_flag |
| Agent 06 | `assets`, `cashflow_forecast` | asset_id, payment_status, delinquency_days, forecast_30_60_90 |
| Agent 07 | `assets` | asset_id, resolution_path, legal_status, reo_status |
| Agent 08 | `vendor_issues`, `vendor_scorecards` | vil_id, vendor, severity, sla_score |
| Agent 09 | `exceptions`, `assets` | exc_id, boarding_status, qa_cleared |
| Agent 10 | `nav_history`, `investor_accounts` | nav_date, nav_per_unit, lp_id, capital_balance |
| Agent 11 | `distributions`, `approvals` | dist_id, lp_id, amount, wire_checklist_status |
| Agent 12 | `facility_status` | facility_id, utilization_pct, borrowing_base, covenant_status |
| Agent 13 | `risk_status` | limit_name, current_value, limit_value, status (Green/Amber/Red) |
| Agent 14 | `compliance_log` | material_name, review_result, issues_found, clearance_status |
| Agent 15 | `audit_log`, `conflicts_register` | event_type, action, outcome, conflict_id |
| Agent 16 | `investors` | investor_id, communication_log, pipeline_status |
| Agent 17 | `compliance_queue` | material_name, submitted_by, status |
| Agent 18 | `tapes`, `property_data`, `audit_log` | tape_id, data_quality_score, property fields |

**RLS Policy:** All n8n writes use the `agent_service` role, which has write access only to the tables listed above. No agent service role can write to `investors` financial records or `approvals` directly.

---

### INT-05: n8n → Airtable (Command Center Sync)
**Direction:** n8n writes to Airtable
**Method:** Airtable API (`POST /v0/{base_id}/{table}` or PATCH for updates)
**Authentication:** Airtable personal access token (stored in 1Password, configured in n8n)

**Key Sync Operations:**

| Airtable Base | Table | Source in Supabase | Sync Frequency |
|---|---|---|---|
| Acquisition Pipeline | Tape Log | `tapes` | On write |
| Acquisition Pipeline | LOI Tracker | `acquisition_pipeline` | On write |
| Approval Queue | Pending Approvals | `approvals` (status = pending) | On write, real-time |
| Exception Tracker | Open Exceptions | `exceptions` (status = open) | On write |
| Agent Task Log | Session Log | `agent_sessions` | On write |
| Investor CRM | Investors | `investors` | Daily sync |
| Vendor Scorecards | Vendor Performance | `vendor_scorecards` | Monthly |

**Airtable is a view of Supabase — not a separate system of record.** If data conflicts, Supabase is the authority.

---

### INT-06: Supabase → Power BI
**Direction:** Power BI reads from Supabase
**Method:** Power BI PostgreSQL connector (DirectQuery or Import mode)
**Authentication:** `powerbi_readonly` Supabase role (no write access; credentials in 1Password)

**Connection Details:**
- Host: `{project}.supabase.co`
- Port: 5432
- Database: postgres
- SSL: required

**Dashboard-to-Table Mapping:**

| Power BI Dashboard | Primary Tables |
|---|---|
| Executive Dashboard | `acquisition_pipeline`, `approvals` (pending), `risk_status`, `compliance_log`, `exceptions` |
| Acquisition Pipeline | `tapes`, `acquisition_pipeline` |
| Underwriting Dashboard | `assets` (health scores, classifications), `exceptions` |
| Portfolio Dashboard | `assets` (payment status, delinquency), `cashflow_forecast` |
| NPL/Workout Dashboard | `assets` (workout status), `exceptions`, `vendor_issues` |
| Cash & Liquidity Dashboard | `cashflow_forecast`, `cashflow_actuals`, `distributions`, `nav_history` |
| Investor Reporting Dashboard | `investors`, `distributions`, `compliance_log`, `nav_history` |
| Risk Dashboard | `risk_status`, `assets` (concentration calc), `facility_status` |

**Refresh Schedule:** Import mode — daily refresh at 6:00 AM CT. DirectQuery for Approval Queue and Risk Status (real-time).

---

### INT-07: PropStream → n8n
**Direction:** PropStream API data pulled by n8n
**Method:** PropStream REST API
**Trigger:** Initiated by n8n during tape normalization (Agent 18 session complete → n8n pulls property data)

**Data Pulled per Loan:**
- Property address validation
- AVM value and confidence score
- Tax assessment and delinquency status
- Ownership history (last sale date, price)
- Mortgage history
- Foreclosure status and date
- Active lien count and estimated total

**Rate Limiting:** PropStream API limits apply. n8n batches requests; processes 50 loans per minute max.

---

### INT-08: n8n → Supabase (Property Data Write)
**Direction:** n8n writes PropStream data to Supabase
**Method:** PostgREST API — UPSERT to `property_data` table
**Key:** `asset_id` (foreign key to `assets` table)
**Note:** Overwrites prior PropStream pull for same asset on each refresh. Historical property data snapshots stored in `property_data_history` table.

---

### INT-09: n8n → DocuSign (Document Execution)
**Direction:** n8n sends document envelope to DocuSign
**Method:** DocuSign REST API (`POST /v2.1/accounts/{accountId}/envelopes`)
**Authentication:** OAuth2 (DocuSign credentials in 1Password)

**Triggered By:**
- LP subscription agreement approval (Agent 16 completes onboarding, CEO/CIO approves)
- Closing document execution (Agent 05 confirms closing ready, CEO/CIO + Controller authorize)
- Deed-in-lieu or short sale agreement (Agent 07 strategy approved by CEO/CIO)
- Vendor contract execution (CEO/CIO approves new vendor)
- Distribution notice requiring signature

**Payload:** DocuSign template ID + signer info (name, email, signing role) + pre-filled document data

---

### INT-10: DocuSign → Google Drive (Completed Document Filing)
**Direction:** DocuSign notifies n8n (via webhook) when envelope is completed; n8n files in Google Drive
**Method:** DocuSign Connect webhook → n8n webhook node → Google Drive API upload
**Trigger:** DocuSign envelope status = "completed"

**Filing Logic (n8n determines folder based on document type):**
- LP Subscription → `/Investors/Subscription Documents/{Investor Name}`
- Closing Package → `/Acquisitions/Closing Packages/{Tape ID}/{Asset ID}`
- Vendor Contract → `/Legal/Vendor Contracts/{Vendor Name}`
- Deed-in-Lieu / Short Sale → `/Portfolio/Loan Files/{Asset ID}/Legal`
- Distribution Notice → `/Investors/Investor Reports/{Date}`

---

### INT-11: n8n → Google Drive (File Operations)
**Direction:** n8n reads from and writes to Google Drive
**Method:** Google Drive API v3
**Operations:**
- File download (for agent input — tape files, servicer reports, collateral packages)
- File upload (agent output documents, closing readiness confirmations, NPL action plans)
- Folder creation (new tape folder, new asset folder on boarding)
- Permission management (data room sharing for investors via Agent 18 authorization)

---

### INT-12: GitHub → n8n (Future — Phase 6)
**Direction:** GitHub notifies n8n on push to main
**Method:** GitHub webhook → n8n
**Trigger:** PR merged to main branch

**Use Case:** When the AI OS is updated (agent system prompt revised, policy changed), GitHub push triggers n8n to update the agent via Anthropic API (`PATCH /v1/agents/{agent_id}` or create new agent version).

This closes the loop: policy change in the codebase → automated deployment to live agent system prompt → logged in audit log.

---

### INT-13: n8n → Anthropic API (Future — Agent Updates)
**Direction:** n8n updates agent system prompt via Anthropic API
**Method:** REST API — `PATCH /v1/agents/{agent_id}`
**Trigger:** GitHub push to main (INT-12)
**Data:** Updated system prompt extracted from the agent file in GitHub

---

## Data Consistency Rules

1. **Supabase is the system of record.** Airtable is a view. Power BI is a reporting layer. If any system shows different data, Supabase wins.

2. **n8n writes are logged.** Every n8n write to Supabase includes an `n8n_workflow_id` and `executed_at` timestamp in a `workflow_log` table. This supports Agent 15's quarterly audit of system actions.

3. **Agent outputs are structured.** Every agent session must return output in a structured format (JSON with defined fields) so n8n can reliably parse and route the output to the correct Supabase tables. Unstructured output is logged but flagged for review.

4. **No integration bypasses RLS.** Every API call to Supabase uses a role with appropriate, minimal permissions. No integration uses the Supabase `service_role` superuser key in production.

5. **Credentials never in code.** All API keys, tokens, and passwords are stored in 1Password and injected as environment variables into n8n and other systems. No credentials in GitHub, Airtable, or hardcoded in any script.
