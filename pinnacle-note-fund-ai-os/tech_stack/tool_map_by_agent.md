# Tool Map by Agent — The Pinnacle Note Fund AI OS

**Document:** Agent-to-Technology Mapping
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## How to Read This Document

For each agent, this document identifies:
- **Primary Tools** — systems the agent reads from and writes to directly
- **Triggers** — what initiates an agent session (usually n8n or a human action)
- **Inputs** — where the agent's data comes from
- **Outputs** — where the agent's work product goes
- **Human Interface** — how the output surfaces to Kerry or the team

---

## Agent 01 — Chief Operating Coordinator

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (scheduled) or manual | Daily briefing at set time; also triggered by approval queue updates |
| Reads from | Supabase | All active logs, open exceptions, open approvals, agent session status |
| Reads from | Airtable (via n8n) | Approval queue view for current human-pending items |
| Writes to | Supabase | `decisions` table — any routing decisions logged |
| Writes to | Supabase | `agent_sessions` table — session input/output captured |
| Output surfaces in | Airtable | Executive briefing appears in Approval Queue base, flagged for CEO/CIO |
| Output surfaces in | Power BI | Executive Dashboard reflects all data Agent 01 synthesizes |
| Document store | Google Drive | IC memos assembled by Agent 01 saved to /Acquisitions/Active Tapes |

---

## Agent 02 — Acquisitions & Seller Relations

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n | Triggered when new tape file is uploaded to Google Drive |
| Reads from | Supabase | `tapes` table, `acquisition_pipeline`, buy box policy (embedded in system prompt) |
| Reads from | Google Drive | Tape files (Excel/CSV) for screening |
| Writes to | Supabase | `tapes` table (new tape logged), `acquisition_pipeline` (deal stages updated) |
| Writes to | Supabase | `decisions` table (go/no-bid recommendation logged) |
| Output surfaces in | Airtable | Acquisition Pipeline base — tape screening result, go/no-bid, bid deadline |
| Output surfaces in | Power BI | Acquisition Pipeline Dashboard |
| LOI documents | Google Drive + DocuSign | LOIs drafted by Agent 02, executed via DocuSign after CEO/CIO approval |

---

## Agent 03 — Credit Underwriting

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n | Triggered when Agent 02 assigns tape to underwriting queue |
| Reads from | Supabase | `tapes` table (loan data), `property_data` table (AVM, tax, title info from PropStream) |
| Reads from | Google Drive | Collateral files when available at pre-bid stage |
| Writes to | Supabase | `assets` table (note health score, classification per loan), `agent_sessions` |
| Output surfaces in | Airtable | Underwriting base — health score, classification, missing data flags |
| Output surfaces in | Power BI | Underwriting Dashboard |

---

## Agent 04 — Pricing & Tape Analytics

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n | Triggered when Agent 03 completes underwriting for a tape |
| Reads from | Supabase | `assets` table (UW output, note health scores), `property_data` (AVM values) |
| Reads from | Supabase | Market data when HouseCanary is integrated (Phase 6) |
| Writes to | Supabase | `acquisition_pipeline` (recommended bid, max bid, scenario IRRs), `agent_sessions` |
| Output surfaces in | Airtable | Acquisition Pipeline base — pricing summary, bid recommendation |
| Output surfaces in | Power BI | Acquisition Pipeline Dashboard |
| IC Memo | Google Drive | Pricing summary delivered to Agent 01; IC memo filed in /Acquisitions |

---

## Agent 05 — Diligence, Collateral & Closing

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (manual after LOI acceptance) | CEO/CIO accepts LOI → n8n triggers full diligence workflow |
| Reads from | Google Drive | Collateral file package — note, mortgage/DOT, assignments, allonges |
| Reads from | Supabase | `assets` table, `property_data` (PropStream tax and lien data) |
| Writes to | Supabase | `exceptions` table (all diligence exceptions logged with severity) |
| Writes to | Supabase | `assets` table (diligence status, closing readiness flag) |
| Writes to | Google Drive | Closing readiness confirmation document filed in /Acquisitions/Closing Packages |
| Output surfaces in | Airtable | Exception Tracker base — all Critical/Major exceptions surfaced for CEO/CIO |
| Closing docs | DocuSign | Closing documents executed via DocuSign after CEO/CIO + dual wire approval |

---

## Agent 06 — Performing Portfolio & Cashflow

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (monthly, 16th of month) | Triggered after servicer remittance reports uploaded to Google Drive |
| Reads from | Google Drive | Monthly servicer remittance reports |
| Reads from | Supabase | `assets` table (loan-level expected payment data), prior month actuals |
| Writes to | Supabase | `assets` table (payment status update, delinquency flags), `agent_sessions` |
| Writes to | Supabase | `cashflow_forecast` table (90-day forward projections) |
| Output surfaces in | Airtable | Portfolio base — delinquency flags, watchlist additions, collections summary |
| Output surfaces in | Power BI | Portfolio Dashboard, Cash & Liquidity Dashboard |

---

## Agent 07 — Workout, Loss Mitigation & REO

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n | Triggered when a loan is moved to Workout status (60+ delinquent or bankruptcy) |
| Reads from | Supabase | `assets` table (loan status, borrower info, legal status), `property_data` |
| Reads from | Google Drive | NPL-related documents (foreclosure filings, bankruptcy papers, title) |
| Writes to | Supabase | `assets` table (resolution path, legal status, REO status) |
| Writes to | Google Drive | NPL action plans filed in /Portfolio/Loan Files/{Asset ID} |
| Output surfaces in | Airtable | NPL Strategy Tracker — resolution path, legal deadlines, open CEO/CIO approvals |
| Output surfaces in | Power BI | NPL/Workout Dashboard |
| Legal docs | DocuSign | Deed-in-lieu, short sale agreements executed via DocuSign |

---

## Agent 08 — Servicer, Counsel & Vendor Oversight

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (monthly, after servicer report review cycle) | Triggered after Agent 06 completes monthly portfolio review |
| Reads from | Supabase | `vendor_issues` table, `assets` table (servicer-level performance data) |
| Writes to | Supabase | `vendor_issues` table (new issues logged, updates recorded) |
| Writes to | Supabase | `vendor_scorecards` table (monthly SLA scores by vendor) |
| Output surfaces in | Airtable | Vendor Scorecard base — SLA compliance rates, open issues, escalation flags |
| Vendor contracts | Google Drive + DocuSign | Vendor contracts stored in /Legal/Vendor Contracts; executed via DocuSign |

---

## Agent 09 — QA, Exceptions & Boarding Control

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n | Triggered when a new loan is confirmed for closing (post-wire confirmation) |
| Reads from | Supabase | `assets` table (tape data), `exceptions` table (pre-existing flags from Agent 05) |
| Reads from | Google Drive | Collateral file package (boarding QA check) |
| Writes to | Supabase | `exceptions` table (boarding exceptions logged), `assets` table (QA status = CLEARED / HELD) |
| Output surfaces in | Airtable | Exception Tracker base — boarding exceptions, QA pass/fail status |
| Output surfaces in | Power BI | Underwriting Dashboard (boarding QA metrics) |

---

## Agent 10 — Fund Controller & SPV Accounting

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (monthly, 1st of month for NAV cycle) | Triggered monthly for NAV confirmation and financial statement production |
| Reads from | Supabase | All financial tables: `assets`, `cashflow_actuals`, `distributions`, `investor_accounts`, `expenses` |
| Writes to | Supabase | `nav_history` table (monthly NAV confirmed), `investor_accounts` (capital account updates) |
| Writes to | Google Drive | Monthly financial statements filed in /Reporting |
| Output surfaces in | Airtable | Approval Queue — NAV confirmation presented for CEO/CIO sign-off |
| Output surfaces in | Power BI | Cash & Liquidity Dashboard, Investor Reporting Dashboard |
| Audit support | Supabase + Google Drive | Auditor accesses read-only Supabase view and Google Drive /Reporting |

---

## Agent 11 — Cash Controls, Distributions & Treasury

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (distribution cycle) or manual (wire needed) | Triggered by CEO/CIO distribution declaration or wire request |
| Reads from | Supabase | `nav_history` (NAV confirmation from Agent 10), `investor_accounts`, `cashflow_forecast`, `expenses` |
| Writes to | Supabase | `distributions` table (waterfall calculation, per-LP amounts), `approvals` table (wire checklist) |
| Output surfaces in | Airtable | Approval Queue — wire checklist and waterfall summary for CEO/CIO + Controller dual approval |
| Output surfaces in | Power BI | Cash & Liquidity Dashboard |
| Distribution notices | Google Drive | Distribution notice documents filed in /Investors |
| Distribution notices | DocuSign | If distribution notice requires signature, routed via DocuSign |

---

## Agent 12 — Capital Markets, Facility & Securitization

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (monthly) | Triggered monthly for covenant monitoring cycle |
| Reads from | Supabase | `assets` table (borrowing base eligible assets), `facility_draws` table, `nav_history` |
| Writes to | Supabase | `facility_status` table (covenant status, utilization, borrowing base calculation) |
| Output surfaces in | Airtable | Capital Markets base — covenant status, utilization rate, available capacity |
| Output surfaces in | Power BI | Executive Dashboard (facility utilization), Risk Dashboard (leverage) |
| Lender docs | Google Drive + DocuSign | Facility documents stored in /Legal; draw requests via DocuSign |

---

## Agent 13 — Risk Analytics & Stress Testing

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (monthly, after portfolio review cycle) | Triggered monthly; stress tests run quarterly |
| Reads from | Supabase | `assets` (full portfolio), `property_data` (current values), `nav_history`, `facility_status` |
| Reads from | Supabase | HouseCanary market data when integrated (Phase 6) — HPA forecasts for stress scenarios |
| Writes to | Supabase | `risk_status` table (all risk limit readings, Green/Amber/Red), `agent_sessions` |
| Output surfaces in | Airtable | Approval Queue — any Amber/Red limits flagged for CEO/CIO attention |
| Output surfaces in | Power BI | Risk Dashboard (primary output consumer) |

---

## Agent 14 — Compliance, Marketing Review & Disclosure

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (material submission) or manual | Triggered when any agent submits a material for compliance review |
| Reads from | Supabase | `compliance_queue` table (materials pending review) |
| Reads from | Google Drive | Materials submitted for review (pitch decks, reports, DDQ responses) |
| Writes to | Supabase | `compliance_log` table (review result: cleared / not cleared, issues found) |
| Writes to | Google Drive | Reviewed materials filed with compliance clearance note |
| Output surfaces in | Airtable | Compliance Review Queue — materials status, clearance, CEO/CIO approval pending |
| Output surfaces in | Power BI | Investor Reporting Dashboard (compliance status for current reporting cycle) |

---

## Agent 15 — Conflicts, Audit Controls & Governance

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (quarterly) | Quarterly control test cycle triggered automatically |
| Reads from | Supabase | All log tables: `approvals`, `decisions`, `compliance_log`, `audit_log`, `access_log`, `vendor_issues` |
| Writes to | Supabase | `audit_log` table (control test results logged), `conflicts_register` table |
| Output surfaces in | Airtable | Approval Queue — control test results presented to CEO/CIO |
| Output surfaces in | Power BI | Executive Dashboard (governance/audit status) |
| Documentation | Google Drive | Quarterly control test reports filed in /Compliance |

---

## Agent 16 — Investor Relations, Sales & Client Service

| Category | Tool | Purpose |
|---|---|---|
| Trigger | Manual (team initiates investor communication) or n8n (onboarding workflow) | |
| Reads from | Supabase | `investors` table (CRM data, contribution history, communication log) |
| Writes to | Supabase | `investors` table (CRM updates, communication log entries) |
| Drafts submitted to | Supabase | `compliance_queue` table (all draft communications queued for Agent 14 review) |
| Investor documents | Google Drive + DocuSign | Subscription agreements in /Investors/Subscription Documents; executed via DocuSign |
| Output surfaces in | Airtable | Investor CRM base — pipeline, onboarding status, communication history |

---

## Agent 17 — DDQ, Data Room & Investor Reporting

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (quarterly reporting cycle) | Triggered quarterly for investor report production; also triggered for DDQ requests |
| Reads from | Supabase | All reporting inputs: `assets`, `distributions`, `nav_history`, `cashflow_actuals`, `risk_status` |
| Reads from | Google Drive | Data room for DDQ support materials |
| Writes to | Supabase | `compliance_queue` (report submitted for Agent 14 review) |
| Writes to | Google Drive | Investor reports filed in /Investors/Investor Reports; data room documents updated |
| Produces for | Power BI | Report data in Supabase rendered to PDF via Power BI investor report layout |
| Output surfaces in | Airtable | Investor Reporting Dashboard — current cycle status, compliance review status |
| Distribution | DocuSign (optional) | Distribution notices may be executed via DocuSign if signature required |

---

## Agent 18 — Data, Automation, Dashboards & Security

| Category | Tool | Purpose |
|---|---|---|
| Trigger | n8n (tape uploaded to Google Drive) | Primary trigger for tape normalization |
| Reads from | Google Drive | Raw tape files (Excel/CSV) uploaded by Agent 02 or team |
| Reads from | PropStream API (via n8n) | Property data pulled for each loan in tape |
| Writes to | Supabase | `tapes` table (raw data normalized to schema), `property_data` table, `audit_log` |
| Manages | Supabase | Access control — grants/revokes user access per CEO/CIO authorization |
| Manages | Google Drive | Data room access permissions (investor-level sharing) |
| Monitors | Supabase `audit_log` | Reviews access logs for anomalies; flags security incidents |
| Output surfaces in | Airtable | Agent Task Log — tape normalization status, data quality scores, flags |
| Maintains | All 8 Power BI dashboards | Data quality in Supabase directly determines dashboard accuracy |

---

## Tool Usage Summary by System

| Tool | Primary Users (Agents) | Supporting Users |
|---|---|---|
| Supabase | All 18 (read); 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18 (write) | CEO/CIO (approval data), Controller (financial data) |
| Google Drive | 01, 02, 05, 07, 08, 10, 11, 14, 15, 17, 18 | Full team (document access) |
| Airtable | Human team (Kerry, Kody, TJ) reads; n8n writes from agent outputs | CEO/CIO (approvals) |
| n8n | Orchestrates all 18 agents | Background system (team doesn't interact directly) |
| DocuSign | 02, 05, 07, 11, 16, 17 | CEO/CIO (signatory) |
| Power BI | All 8 dashboards fed by Supabase | CEO/CIO (primary viewer) |
| PropStream | 03, 04, 05, 07, 18 | Background data source |
| GitHub | Agent 18 (system management) | Kerry (version control, audit trail) |
