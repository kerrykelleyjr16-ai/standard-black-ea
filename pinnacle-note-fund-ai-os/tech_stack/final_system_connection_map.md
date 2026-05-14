# Final System Connection Map
# The Pinnacle Note Fund AI Operating System

**Document Version:** 1.0
**Last Updated:** 2026-05-09
**Maintained By:** Agent 18 (Data, Automation, Dashboards, Security)
**Authority:** Kerry Kelley Jr

This document is the master reference for how the full system connects. Every tool, every agent, every data flow, and every approval path is mapped here. When anything in the system changes, this document is updated first.

---

## 1. System Diagram

The system is organized into seven layers. Data moves primarily downward through the layers; approval decisions from Kerry flow upward as triggers that unlock the next layer's actions.

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║  LAYER 0 — DEVELOPMENT                                                          ║
║                                                                                  ║
║   Claude Code ──────────────── GitHub                                           ║
║   Builds, versions, and           Stores all agent files, workflows,            ║
║   maintains the OS                SOPs, policies, and schemas                   ║
╚══════════════════════════════════════════════════════════════════════════════════╝
                                        │
                                        ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║  LAYER 1 — SECURITY                                                             ║
║                                                                                  ║
║   1Password ──────── MFA ──────── Supabase RLS ──────── GitHub Secrets         ║
║   All credentials     All system    Row-level access        Secret scanning      ║
║   stored here         access gates  control on all 25 tables  + branch protect  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
                                        │
                    Credentials flow as environment variables
                                        │
                                        ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║  LAYER 2 — INTELLIGENCE                                                         ║
║                                                                                  ║
║   Anthropic Managed Agents (18 agents)                                          ║
║   Agent 01  Agent 02  Agent 03  Agent 04  Agent 05  Agent 06  Agent 07         ║
║   Agent 08  Agent 09  Agent 10  Agent 11  Agent 12  Agent 13  Agent 14         ║
║   Agent 15  Agent 16  Agent 17  Agent 18                                        ║
║                                                                                  ║
║   Called by n8n via POST /v1/agents/{id}/sessions                               ║
║   Results written back to Supabase                                              ║
╚══════════════════════════════════════════════════════════════════════════════════╝
                                        │
                                        ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║  LAYER 3 — AUTOMATION                                                           ║
║                                                                                  ║
║                              n8n                                                ║
║                    ┌─────────────────────┐                                      ║
║                    │   18 Automations    │                                      ║
║                    │   Triggers: webhook │                                      ║
║                    │   schedule, event   │                                      ║
║                    └─────────┬───────────┘                                      ║
║                              │                                                   ║
║        Reads / writes to all systems via API                                    ║
╚══════════════════════════════════════════════════════════════════════════════════╝
              │           │           │            │           │
              ▼           ▼           ▼            ▼           ▼
╔══════════╗  ╔════════╗  ╔════════╗  ╔═════════╗  ╔════════╗  ╔══════════════╗
║  LAYER 4 — DATA          OPERATING   DOCUMENTS    ANALYTICS    PROPERTY DATA ║
║                                                                               ║
║ Supabase ║  ║Airtable║  ║G.Drive ║  ║Power BI ║  ║PropStr ║  ║ATTOM         ║
║          ║  ║        ║  ║  Box   ║  ║         ║  ║HseCan. ║  ║HouseCanary   ║
║ Source   ║  ║Daily   ║  ║Doc     ║  ║Dash-    ║  ║Stage 1 ║  ║Stage 2+      ║
║ of truth ║  ║ops     ║  ║vault   ║  ║boards   ║  ║AVM     ║  ║AVM + Data    ║
╚══════════╝  ╚════════╝  ╚════════╝  ╚═════════╝  ╚════════╝  ╚══════════════╝
                                        ▲
                         Direct PostgreSQL read
                         (powerbi_readonly role)
╔══════════════════════════════════════════════════════════════════════════════════╗
║  LAYER 5 — SIGNATURES                                                           ║
║                                                                                  ║
║   DocuSign ──── Templates + Signing workflows                                   ║
║   Completion webhook → n8n → Google Drive filing                                ║
╚══════════════════════════════════════════════════════════════════════════════════╝
                                        │
                                        ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║  LAYER 6 — HUMAN DECISION LAYER                                                 ║
║                                                                                  ║
║   Kerry Kelley Jr                                                               ║
║   Approves via: Airtable Interface 1 → n8n webhook → Supabase approval record  ║
║   Monitors via: Power BI dashboards                                             ║
║   Receives alerts via: Gmail notifications from n8n                             ║
║   Executes wires: Manually via bank portal (never automated)                   ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

## 2. Data Flow Map

### Primary Data Flows

**Flow 1 — Tape Intake (External → System)**
```
Seller submits tape (email/file)
        │
        ▼
n8n Automation 01 receives file
        │
        ├── Writes raw tape loans → Supabase: tape_loans
        │
        ├── Calls PropStream API per loan (Stage 1) or HouseCanary (Stage 2+)
        │        └── Writes AVM results → Supabase: property_valuations
        │
        ├── Calls Agent 04 (Pricing + Tape Analytics)
        │        └── Agent screens each loan against buy box
        │        └── Writes screening results → Supabase: tape_loans (status, flags)
        │
        └── Writes qualifying loans → Airtable: Base 1 (Acquisition Pipeline)
                 └── Kerry sees qualified tape in Airtable same day
```

**Flow 2 — Underwriting + Approval (System → Kerry → System)**
```
Qualifying loan in Supabase
        │
        ▼
n8n Automation 03 triggers
        │
        ├── Calls Agent 03 (Credit Underwriting)
        │        └── Agent analyzes loan: LTV, buy box, risk flags
        │        └── Agent drafts IC memo
        │
        ├── Writes IC memo → Supabase: agent_logs + loan record
        │
        ├── Creates approval record → Supabase: approvals (status: Pending)
        │
        ├── Updates Airtable: Base 2 Underwriting Queue + Base 7 Approval Queue
        │
        └── Sends Gmail notification → Kerry

Kerry reviews in Airtable (Interface 1)
        │
        ├── Kerry clicks Approve
        │        └── Airtable webhook → n8n
        │        └── n8n updates Supabase approvals (status: Approved)
        │        └── n8n reads Approved status → executes next step
        │
        └── Kerry clicks Deny
                 └── Airtable webhook → n8n
                 └── n8n updates Supabase approvals (status: Denied)
                 └── Automation halts — Human Task created — audit logged
```

**Flow 3 — Document Creation + Filing (System → DocuSign → Drive)**
```
Document trigger event in Supabase
        │
        ▼
n8n Automation 08 fires
        │
        ├── Creates DocuSign envelope from template
        │        └── Populates pre-fill fields from Supabase data
        │        └── Sends to signer(s)
        │
Signer signs → Kerry countersigns → Envelope completes
        │
DocuSign completion webhook → n8n
        │
        ├── Downloads completed document from DocuSign
        │
        ├── Files to Google Drive
        │        └── Path: /[Category]/[Loan ID or LP ID]/[filename per naming convention]
        │
        ├── Updates Supabase: relevant record with Drive file path + execution status
        │
        └── Updates Airtable: Base 9 Document Tracker (document status → Complete)
```

**Flow 4 — Supabase → Power BI (Analytics Pull)**
```
Power BI Service (scheduled: 6:00 AM CT daily)
        │
        ▼
PostgreSQL connector → Supabase (port 5432, SSL, powerbi_readonly role)
        │
        ├── Import tables: all historical data (most tables)
        │        └── Refresh completes → dashboards updated
        │
        └── DirectQuery panels: approvals, workflow_events (real-time)
                 └── No schedule — queries Supabase on each dashboard open/filter
```

**Flow 5 — Kerry Decision → Supabase (Approval Write-Back)**
```
Kerry in Airtable (Interface 1 Approval Queue)
        │
        ▼
Clicks Approve/Deny button
        │
Airtable button triggers webhook to n8n
        │
n8n receives decision
        │
        ├── PATCH /rest/v1/approvals?approval_id=eq.[id]
        │        └── Body: { "status": "Approved", "approved_by": "Kerry Kelley Jr", "approved_at": "[timestamp]" }
        │
        ├── Logs to Supabase: audit_log
        │
        └── Returns to waiting automation → checks approval status → proceeds or halts
```

**Flow 6 — Property Data → Valuation Record (External API → Supabase)**
```
Stage 1 (PropStream)
BPO order placed manually → report received via email
        │
        ▼
Agent 05 files report → Google Drive: /05 - Due Diligence/BPOs/
        │
n8n Automation (document receipt) writes metadata
        │
        └── Supabase: property_valuations
               Fields: valuation_type=BPO, source=vendor name, value, date, condition_grade, file_path

Stage 2+ (HouseCanary API via n8n)
Schedule trigger (quarterly refresh) or tape intake trigger
        │
        ▼
n8n calls HouseCanary: GET /v2/property/value?address=...
        │
        └── Supabase: property_valuations
               Fields: valuation_type=AVM, source=HouseCanary, value, confidence_score, valuation_date
```

**Flow 7 — Distribution Processing (System → Kerry → Manual Wire)**
```
Distribution schedule trigger
        │
        ▼
n8n Automation 14: Agents 10 + 11 calculate waterfall
        │
        ├── Writes distribution records → Supabase: distributions
        │
Gate 1: Approval required ─────────────────────────────────────────────────
        │ Kerry reviews calculation in Airtable (Base 6)                   │
        │ Kerry approves → automation continues                             │
        │ Kerry denies → automation halts                                   │
────────────────────────────────────────────────────────────────────────────
        │
Agent 17 drafts LP distribution notices
        │
Gate 2: LP notice approval ─────────────────────────────────────────────────
        │ Kerry reviews draft notices                                        │
        │ Kerry approves → automation continues                              │
────────────────────────────────────────────────────────────────────────────
        │
n8n generates wire package (amounts + payee reference IDs — NO bank data)
        │
        ├── Files wire package → Google Drive: /13 - Distributions/
        │
Gate 3: Wire authorization ─────────────────────────────────────────────────
        │ Kerry reviews wire package                                         │
        │ Kerry executes wires MANUALLY via bank portal                     │
        │ Bank data retrieved from 1Password Wire Instructions vault        │
        │ System records confirmation only — never executes the wire         │
────────────────────────────────────────────────────────────────────────────
        │
Kerry confirms wire execution → updates Supabase distributions (status: Wired)
        │
        └── Airtable Base 6 updated → Power BI Distribution Dashboard updated
```

---

## 3. Agent-to-Tool Map

For each agent: which tools it reads from, which tools it writes to, and what external systems it interacts with.

| Agent | Reads From | Writes To | External Systems | Primary Automation(s) |
|---|---|---|---|---|
| **01 — Chief Operating Coordinator** | Supabase: all workflow tables, agent_tasks | Supabase: agent_tasks, workflow_events | None | Automation 01 (orchestration) |
| **02 — Acquisitions + Seller Relations** | Supabase: tape_loans, loans | Supabase: tape_loans, agent_logs | PropStream (Stage 1 seller data) | Automation 01, 02 |
| **03 — Credit Underwriting** | Supabase: loans, borrowers (NPI read), properties, property_valuations | Supabase: agent_logs, loans (underwriting fields) | None | Automation 03 |
| **04 — Pricing + Tape Analytics** | Supabase: tape_loans, property_valuations | Supabase: tape_loans (screening results), agent_logs | PropStream API, HouseCanary API (Stage 2+) | Automation 01, 02 |
| **05 — Diligence, Collateral, Closing** | Supabase: loans, properties, property_encumbrances | Supabase: agent_logs; Google Drive: document filing | DocuSign (envelope coordination), Google Drive (file organization) | Automation 08 |
| **06 — Performing Portfolio + Cashflow** | Supabase: loans, cash_transactions, distributions | Supabase: agent_logs, workflow_events | None | Automation 11 |
| **07 — Workout, Loss Mitigation, REO** | Supabase: loans, legal_milestones, property_valuations | Supabase: agent_logs, loans (workout status) | None | Automation 09 |
| **08 — Servicer + Counsel Oversight** | Supabase: loans, servicer performance | Supabase: agent_logs, vendor_performance | Gmail (servicer communication drafts) | Automation 06, 16 |
| **09 — QA + Exceptions** | Supabase: all tables (audit role) | Supabase: exception_log, agent_logs | None | Automation 05 |
| **10 — Fund Controller + SPV Accounting** | Supabase: cash_transactions, distributions, capital_accounts | Supabase: agent_logs, financial tables | None | Automation 12, 13 |
| **11 — Cash Controls + Distributions + Treasury** | Supabase: cash_transactions, distributions, capital_calls | Supabase: agent_logs, distributions | None | Automation 12, 14 |
| **12 — Capital Markets + Facility + Securitization** | Supabase: fund financials, loans (anonymized) | Supabase: agent_logs | None | Ad hoc / quarterly |
| **13 — Risk + Stress Testing** | Supabase: loans (anonymized LTV/status), property_valuations | Supabase: agent_logs, compliance_reviews (risk entries) | HouseCanary (market trend data, Stage 2+) | Automation 13 (risk monitoring) |
| **14 — Compliance + Marketing + Disclosure** | Supabase: compliance_reviews | Supabase: compliance_reviews, agent_logs | DocuSign (marketing review records), Google Drive | Automation 18 |
| **15 — Conflicts, Audit, Governance** | Supabase: audit_log, all tables (read-only) | Supabase: compliance_reviews, agent_logs | Google Drive (audit reports) | Quarterly audit run |
| **16 — Investor Relations + Sales** | Supabase: lp_investors, capital_accounts | Supabase: agent_logs | DocuSign (LP subscription docs), Gmail (LP communications) | LP onboarding; Automation 15 |
| **17 — DDQ + Data Room + Investor Reporting** | Supabase: lp_investors, capital_accounts, loans (aggregated) | Supabase: agent_logs | Google Drive (reports), DocuSign (investor acknowledgments), Power BI (report data) | Automation 15 |
| **18 — Data, Automation, Dashboards, Security** | Supabase: all tables; n8n execution logs | Supabase: audit_log, agent_logs | All APIs (PropStream, ATTOM, HouseCanary, Airtable, Google Drive) — monitoring role | Automation 18; all automations (monitoring) |

---

## 4. Tool-to-Tool Integration Map

Every direct system-to-system connection in the stack. Direction shows which system initiates the call.

```
CLAUDE CODE + GITHUB
─────────────────────────────────────────────────────────────────
Claude Code ──► GitHub          Push documentation, agent files, workflow JSON
GitHub ──► Claude Code          Pull latest files for reference

1PASSWORD
─────────────────────────────────────────────────────────────────
1Password ──► n8n               API keys, OAuth tokens loaded as environment
                                variables at n8n startup (not in workflow configs)
1Password ──► Supabase          Admin credentials for dashboard access
1Password ──► Kerry's browser   All team tool logins via browser extension
1Password ──► GitHub            GitHub PAT for CLI access
1Password ──► All platforms     MFA codes and recovery codes stored here

n8n INTEGRATIONS (n8n is the hub — all calls initiated by n8n)
─────────────────────────────────────────────────────────────────
n8n ──► Anthropic API           POST /v1/agents/{id}/sessions
                                Bearer: $ANTHROPIC_API_KEY (env var)
                                Result: agent session response (text/JSON)

n8n ──► Supabase (PostgREST)    POST   /rest/v1/{table}        (INSERT)
                                PATCH  /rest/v1/{table}?{filter} (UPDATE)
                                GET    /rest/v1/{table}?{filter} (SELECT)
                                Headers: apikey, Authorization, Content-Type
                                Role: n8n_service (or specific role per operation)

n8n ──► Airtable API            POST   /v0/{baseId}/{tableId}  (create record)
                                PATCH  /v0/{baseId}/{tableId}/{recordId} (update)
                                GET    /v0/{baseId}/{tableId}  (read records)
                                Headers: Authorization: Bearer $AIRTABLE_KEY

n8n ──► Google Drive API        POST   /upload/drive/v3/files  (upload file)
                                GET    /drive/v3/files/{id}    (read metadata)
                                OAuth2: $GOOGLE_OAUTH credentials

n8n ──► Gmail (MCP)             Draft and send notifications to Kerry
                                OAuth2: $GMAIL_OAUTH credentials

n8n ──► DocuSign API            POST   /envelopes             (create envelope)
                                GET    /envelopes/{id}        (check status)
                                OAuth2: $DOCUSIGN_OAUTH credentials

n8n ──► PropStream API          GET    /properties?address={} (AVM + property data)
                                API Key: $PROPSTREAM_API_KEY

n8n ──► HouseCanary API         GET    /v2/property/value     (AVM + confidence)
        (Stage 2+)              GET    /v2/property/details   (full property data)
                                API Key: $HOUSECANARY_API_KEY

n8n ──► ATTOM API               GET    /property/detail       (transaction history)
        (Stage 2+)              GET    /assessment/detail     (tax data)
                                API Key: $ATTOM_API_KEY

INBOUND WEBHOOKS TO n8n (systems that call n8n)
─────────────────────────────────────────────────────────────────
DocuSign ──► n8n                Envelope completion webhook
                                Event: envelope-completed
                                Payload: envelopeId, status, signers, completedDateTime
                                Trigger: n8n Automation 08 (document filing)

Airtable ──► n8n                Button click webhook (Approval Queue)
                                Event: Kerry clicks Approve or Deny in Interface 1
                                Payload: record_id, decision, approved_by, timestamp
                                Trigger: n8n approval write-back to Supabase

External tape submitter ──► n8n Tape intake webhook
                                Method: POST
                                Payload: tape file or structured loan data
                                Trigger: n8n Automation 01 (tape intake)

SUPABASE DIRECT CONNECTIONS
─────────────────────────────────────────────────────────────────
Supabase ──► Power BI           PostgreSQL connector
                                Host: [project].supabase.co, Port: 5432
                                User: powerbi_readonly role
                                SSL: required
                                Mode: Import (most tables) + DirectQuery (approvals, events)

Supabase ──► Kerry (direct)     Supabase dashboard (ceo_cio role, MFA required)
                                Emergency data access and manual queries
                                Not used for normal operations — Airtable is daily interface

NO DIRECT CONNECTIONS (all route through n8n)
─────────────────────────────────────────────────────────────────
Agents do not connect directly to any tool — all agent calls are initiated by
and returned to n8n, which then writes the result to Supabase and Airtable.

Power BI does not write data — read-only PostgreSQL connection only.

DocuSign does not connect to Supabase — connection goes DocuSign → n8n → Supabase.

Airtable does not connect to Supabase — connection goes Airtable → n8n → Supabase.
Supabase → n8n → Airtable (primary direction).
```

---

## 5. Automation Map

All 18 n8n automations: what triggers them, which agents they use, which systems they connect, and what they produce.

### Quick Reference

| # | Automation | Trigger | Primary Agent(s) | Systems Connected | Output |
|---|---|---|---|---|---|
| 01 | Tape Intake + Screening | Webhook (tape submitted) | 02, 04 | n8n → PropStream → Supabase → Airtable | Screened tape in Supabase; pipeline updated in Airtable |
| 02 | Tape Enrichment | Batch schedule or Automation 01 | 04 | n8n → HouseCanary/ATTOM → Supabase | AVM + property data in property_valuations |
| 03 | Underwriting + IC Memo | Supabase trigger (loan approved for UW) | 03 | n8n → Anthropic → Supabase → Airtable | IC memo draft in agent_logs; approval request queued |
| 04 | Approval Routing | Supabase trigger (approval record created) | 01 | n8n → Airtable → Gmail | Approval in Airtable queue; Kerry notification sent |
| 05 | Exception Detection | Schedule (daily at 7 AM CT) | 09 | n8n → Supabase (read) → Anthropic → Supabase (write) → Airtable | Exception records created; severity classified; Kerry alerted |
| 06 | Servicer Report Processing | Email webhook / schedule | 08 | n8n → Anthropic → Supabase → Airtable | Report data in Supabase; servicer records updated in Airtable |
| 07 | Borrower Communication Draft | Supabase trigger (workout event) | 07 | n8n → Anthropic → Supabase (draft stored) | Communication draft for Kerry review — never sent automatically |
| 08 | Document Filing | DocuSign completion webhook | 05 | DocuSign → n8n → Google Drive → Supabase | Completed doc in Drive; record updated with file path |
| 09 | NPL Escalation + Workout | Supabase trigger (loan enters NPL status) | 07 | n8n → Anthropic → Supabase → Airtable | Workout strategy generated; approval requested |
| 10 | FC Milestone Tracking | Schedule (daily) | 07, 08 | n8n → Supabase → Airtable | Upcoming FC deadlines flagged; overdue milestones escalated |
| 11 | Portfolio Monitoring | Schedule (daily at 6 AM CT) | 06 | n8n → Supabase → Airtable | Watch list updates; delinquency flags; portfolio status current |
| 12 | Cash Position Update | Schedule (daily) | 10, 11 | n8n → Supabase → Airtable | Cash balances current; low-balance alerts fired |
| 13 | Capital Call Processing | Supabase trigger (capital call created) | 10 | n8n → Supabase → DocuSign → Google Drive | Capital call notice sent to LPs; receipt tracked |
| 14 | Distribution Processing | Schedule (quarterly) or manual trigger | 10, 11, 17 | n8n → Supabase → Airtable → DocuSign → Google Drive | Waterfall calculated; LP notices drafted; wire package generated |
| 15 | Investor Report Generation | Schedule (quarterly) | 17 | n8n → Supabase → Anthropic → Google Drive → DocuSign | LP report drafted; filed to Drive; awaiting Kerry approval to send |
| 16 | Servicer KPI Scoring | Schedule (monthly) | 08 | n8n → Supabase → Airtable | Servicer scorecards updated; underperformers flagged |
| 17 | Vendor Performance Scoring | Schedule (monthly) | 08 | n8n → Supabase → Airtable | Vendor scorecards updated; contract expiry flagged |
| 18 | Compliance Review Scheduling | Schedule (monthly) | 14, 15 | n8n → Supabase → Airtable | Compliance review tasks created; Agent 14/15 sessions triggered |

### Automation Execution Pattern (Applied to All 18)

```
Trigger fires (webhook / schedule / Supabase event)
        │
        ▼
n8n reads trigger data + environment variables (from 1Password-sourced env vars)
        │
        ▼
[If approval-dependent step]
n8n queries: GET /rest/v1/approvals?approval_id=eq.[id]&status=eq.Approved
        │
        ├── Empty result → automation HALTS → Human Task created → Kerry alerted
        │
        └── Approved record → automation CONTINUES
                │
                ▼
n8n calls Anthropic: POST /v1/agents/{agent_id}/sessions
        │
Agent processes task → returns structured response
        │
        ▼
n8n writes to Supabase: POST or PATCH /rest/v1/{table}
        │
n8n writes to Airtable: PATCH /v0/{baseId}/{tableId}/{recordId}
        │
n8n logs to audit_log: POST /rest/v1/audit_log
        │
        ▼
[If external action required]
n8n calls DocuSign, Google Drive, Gmail, or property data API
        │
        ▼
n8n writes confirmation to Supabase
        │
        ▼
Automation complete — execution logged in n8n history (NPI redacted)
```

---

## 6. Approval Map

Every consequential action in the fund system requires Kerry's explicit approval before it executes. This map shows every approval type, what triggers it, where Kerry sees it, and what happens downstream.

### Approval Architecture

```
ANY CONSEQUENTIAL DECISION
        │
        ▼
Agent generates work product (memo, strategy, calculation, draft)
        │
n8n writes to Supabase: approvals table
        │   Fields: approval_id, approval_type, related_record_id, created_by (agent),
        │           status: "Pending", created_at, deadline_at (if time-sensitive)
        │
n8n writes to Airtable: Base 7, Approval Queue table
        │
n8n sends Gmail notification to kerrykelleyjr16@gmail.com
        │
Kerry sees approval in three places:
  • Airtable Interface 1 (Approval Queue section — primary)
  • Airtable Base 7 (Approval Queue view — full detail)
  • Gmail (notification with summary — not the action interface)
        │
Kerry decides in Airtable:
        │
        ├── APPROVE: Button click → Airtable webhook → n8n
        │       └── n8n PATCH approvals: status = "Approved", approved_by, approved_at
        │       └── Automation reads Approved status → executes downstream step
        │       └── audit_log records: approval_granted
        │
        └── DENY: Button click → Airtable webhook → n8n
                └── n8n PATCH approvals: status = "Denied", denied_by, denied_at, denial_reason
                └── Automation HALTS — no downstream action executes
                └── Human Task created for disposition
                └── audit_log records: approval_denied
```

### Approval Type Register

| Approval Type | Triggered By | Deadline | Kerry Reviews In | Downstream If Approved | Downstream If Denied |
|---|---|---|---|---|---|
| **Bid Submission** | Agent 04 pricing complete | 24–48 hrs (seller deadline) | Airtable Base 1 + Interface 1 | n8n submits bid to seller | Automation halts; deal moves to Dead |
| **IC Memo — Acquisition** | Agent 03 underwriting complete | 5 business days | Airtable Base 2 + Interface 1 | Deal advances to diligence; Agent 05 activated | Deal rejected; tape_loans status updated |
| **NPL Workout Strategy** | Agent 07 strategy generated | 7 business days | Airtable Base 8 + Interface 1 | n8n instructs servicer (via communication draft) | Strategy revised; Agent 07 re-engaged |
| **FC Filing Authorization** | Agent 07/08 FC recommendation | 5 business days | Airtable Base 8 + Interface 1 | n8n sends filing instruction to FC counsel (draft) | FC delayed; workout alternative reconsidered |
| **FC Bid Authorization** | Agent 07 bid calculation | 24 hrs (sale date) | Airtable Base 8 + Interface 1 | Kerry attends FC sale with authorized bid | FC bid not submitted |
| **Distribution Calculation** | Automation 14 waterfall output | 10 business days | Airtable Base 6 + Interface 1 | LP notice drafting begins (next gate) | Calculation revised; Agent 10/11 re-engaged |
| **LP Distribution Notices** | Agent 17 notice draft | 5 business days | Airtable Base 5 + Interface 1 | DocuSign notice sent to LPs | Notice revised and resubmitted for approval |
| **Wire Authorization** | Automation 14 wire package | At execution time | Google Drive wire package | Kerry executes manually via bank portal | Wire delayed; reason logged |
| **Investor Report Release** | Agent 17 report draft | 10 business days | Airtable Base 5 + Interface 1 | Report distributed to LPs via DocuSign/email | Report revised; re-approval required |
| **Short Sale Acceptance** | Agent 07 short sale recommendation | Buyer deadline | Airtable Base 8 + Interface 1 | Servicer instructed (via draft) | Negotiation continues or FC proceeds |
| **Deed-in-Lieu Acceptance** | Agent 07 DIL recommendation | Borrower deadline | Airtable Base 8 + Interface 1 | Title transfer initiated | Alternative pursued |
| **Compliance Filing** | Agent 14 filing draft | Regulatory deadline | Airtable Base 7 + Interface 1 | Filing submitted to regulator | Filing revised |
| **LP Capital Call** | Agent 10 capital call calculation | Per capital call notice period | Airtable Base 5 + Interface 1 | DocuSign capital call notice sent to LPs | Call delayed or revised |
| **New Vendor Engagement** | Operations recommendation | 3 business days | Airtable Base 4 + Interface 1 | Vendor agreement drafted; DocuSign sent | Vendor not engaged |
| **REO List Price / Price Reduction** | Agent 07 REO strategy | 5 business days | Airtable Base 3 + Interface 1 | Listing agent instructed (via communication draft) | Price held; strategy reconsidered |
| **System Configuration Change** | Agent 18 change proposal | 3 business days | Airtable Base 7 + Interface 1 | Configuration updated; change logged in decisions/log.md | Change rejected |

### Approval Gate Enforcement (n8n Pattern)

```javascript
// Applied before every consequential step in every automation
// This pattern is non-negotiable — it cannot be commented out or bypassed

const approvalCheck = await $http.get(
  `${SUPABASE_URL}/rest/v1/approvals?approval_id=eq.${approvalId}&status=eq.Approved`,
  { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
);

if (!approvalCheck.data || approvalCheck.data.length === 0) {
  // Approval not found or not yet approved
  // Halt automation — do not proceed
  throw new Error(`GATE: Approval ${approvalId} not confirmed. Automation halted.`);
}

// Only reach here if approval is confirmed
// Proceed to consequential step
```

---

## 7. Security Map

How each security control applies across every system in the stack.

### Security Control Overview

```
THREAT CATEGORY          CONTROL                          WHERE ENFORCED
─────────────────────────────────────────────────────────────────────────────
Unauthorized access      MFA                              Every system login
                         Strong passwords (1Password)     Every system login
                         Role-based access                Airtable, Power BI,
                                                          DocuSign, GitHub
Unauthorized data access Supabase RLS                     All 25 DB tables
                         Google Drive permissions         All 18 Drive folders
                         1Password vault separation       Wire, Legal vaults
                         Power BI workspace roles         Dashboards
Credential theft         1Password vault storage          All credentials
                         Env vars only (no code storage)  n8n, all scripts
                         GitHub secret scanning           All commits
                         Credential rotation              Quarterly schedule
Wire fraud               Human-only wire execution        All automations
                         Wire instructions in 1Password   Not in any other system
                         Phone verification before wire   Vendor wire instructions
Agent overreach          Approval gates (all 16 types)    All n8n automations
                         Agent data access limits         Per matrix in Security doc
                         No agent contacts borrowers      Policy + n8n design
Data exposure in logs    NPI redaction before logging     n8n (all automations)
                         Append-only audit logs           Supabase RLS
                         Log retention limits             n8n (30 days execution)
Third-party data leak    NDA before data sharing          All vendors
                         Time-limited external shares     Google Drive
                         No LP data to third parties      Policy
                         Minimum necessary data to BPO    Address only, no borrower
Code vulnerabilities     Branch protection + PR review    GitHub main branch
                         No secrets in commits            .gitignore + scanning
                         Dependency monitoring            GitHub Dependabot
```

### Security by System

**1Password**
- All credentials stored here — nothing stored elsewhere
- Wire Instructions vault: Kerry only, no sharing
- Agent Services vault: Kerry only, loaded to n8n as env vars
- MFA on 1Password account itself (YubiKey preferred)
- Session timeout: 4 hours inactivity
- Watchtower: monitors for compromised credentials

**MFA**
- Required: Gmail, Supabase, Airtable, GitHub, Anthropic Console, n8n, DocuSign, Power BI, PropStream, all banking portals
- Minimum: TOTP authenticator app
- Preferred for Kerry: YubiKey hardware key
- Never acceptable: SMS codes

**Supabase RLS**
- 8 roles with least-privilege design
- Default: deny all — every access must be explicitly permitted
- Append-only on: `audit_log`, `agent_logs`, `compliance_reviews`
- Encrypted at rest: Borrower SSNs (pgcrypto)
- `powerbi_readonly`: cannot access `borrowers`, `lp_investors`, `capital_accounts`
- `n8n_service`: cannot access `lp_investors` or `capital_accounts`
- Wire data: not stored in Supabase at all

**GitHub**
- Branch protection on `main`: no direct push, PR required
- `.gitignore`: excludes `.env`, `*.key`, `*credentials*`, `*secret*`
- Secret scanning: enabled — alerts on any committed credential
- Dependabot: enabled for any repos with packages
- Agent files + workflow JSON committed — never credential values

**Airtable**
- Kerry: Owner (full control)
- Kody: Creator (build and edit, cannot delete bases or share externally)
- TJ: Commenter (view and comment only)
- No LP identity or borrower NPI stored in Airtable
- No wire instructions ever entered in Airtable

**Google Drive**
- Default: private — no "anyone with link" sharing
- Folder permissions enforced per role matrix in security_and_access_controls.md
- External shares: time-limited, person-specific, Kerry must authorize
- Legal folder (`/09`): Kerry only
- Tax folder (`/10`): Kerry only
- Loan files folder (`/07`): Kerry + n8n service account (auto-filing)

**n8n**
- All credentials as environment variables — not in workflow node configurations
- Workflow exports (committed to GitHub): credential values stripped
- Execution logs: NPI redacted before logging
- Webhook URLs: HTTPS only, with signing secret verification
- Error handling: failed automations create Human Task + alert Kerry — no silent failures

**DocuSign**
- No wire instructions in any envelope — ever
- No borrower SSN in any envelope
- Kerry countersigns all envelopes
- Completion webhook → n8n → Google Drive (automated filing)
- Audit trail: all envelope events logged; exported quarterly

**Power BI**
- `powerbi_readonly` role: SELECT only, no sensitive tables
- Workspace: Kerry (Admin), Kody (Member), TJ (Viewer)
- LP investors: no Power BI access — PDF exports only
- Auto-export to external parties: disabled
- Manual PDF exports: Kerry approval before any external distribution

**Property Data Tools (PropStream / ATTOM / HouseCanary)**
- API keys in 1Password Agent Services vault; loaded to n8n as env vars
- Data received: property-level only — no borrower NPI sent to these services
- AVM results stored in Supabase `property_valuations` (not in external tool)

### Security Review Schedule

| Review | Frequency | Owner | Filed To |
|---|---|---|---|
| 1Password access log review | Monthly | Agent 15 | `/16 - Compliance/Security Reviews/` |
| n8n execution log audit (NPI check) | Monthly | Agent 18 | `/16 - Compliance/Security Reviews/` |
| GitHub commit history scan | Monthly | Agent 15 | `/16 - Compliance/Security Reviews/` |
| Supabase RLS policy audit | Quarterly | Agent 15 | `compliance_reviews` table |
| MFA verification — all team members | Quarterly | Agent 15 | `compliance_reviews` table |
| Credential rotation — full check | Quarterly | Agent 18 | `audit_log` table |
| Google Drive permissions audit | Quarterly | Agent 15 | `/16 - Compliance/Security Reviews/` |
| Vendor access audit | Quarterly | Agent 15 | `vendor_relationships` table |
| Full security posture review | Annually | Agent 15 + Kerry | `/16 - Compliance/Security Reviews/` |

---

## 8. First 10 Tasks to Complete After Setup

These are the ten highest-leverage tasks to execute immediately after the fund launches live operations (Sprint 6 complete). Each task has a clear owner, expected time to complete, and what it produces.

---

### Task 1 — Submit First Live Tape

**When:** Immediately after system launch (Week 1)
**Owner:** Kerry (seller relationship) + n8n Automation 01 (processing)
**Time:** 1–2 business days

**Steps:**
1. Request tape from a seller (20–100 loans)
2. Submit tape file via n8n Automation 01 webhook endpoint
3. Automation screens tape against buy box
4. PropStream AVM pulled for each qualifying loan
5. Agent 04 produces qualified sub-tape with preliminary pricing
6. Kerry reviews in Airtable Base 1 (Acquisition Pipeline)

**What it produces:** First live data in Supabase `tape_loans`; first real validation that Automation 01, PropStream integration, Agent 04, and Airtable pipeline are all working end-to-end under real conditions (not test data).

**Definition of done:** Qualified loans appear in Airtable Base 1; Supabase `tape_loans` shows screening results; PropStream AVM data in `property_valuations`; no automation errors in n8n execution log.

---

### Task 2 — Order First BPO on a Qualifying Loan

**When:** After Task 1 produces qualified loans (Week 1–2)
**Owner:** Agent 05 (order coordination) + Kody (manual execution in Stage 1)
**Time:** 3–7 business days (BPO turnaround)

**Steps:**
1. Select top qualifying loan from tape for BPO
2. Agent 05 generates BPO order email template with property address and required deliverables
3. Kerry reviews and approves order
4. Kody emails BPO vendor (Stage 1 manual process)
5. BPO received as PDF → filed to Google Drive `/05 - Due Diligence/BPOs/[Loan ID]/`
6. BPO data entered into Supabase `property_valuations` table

**What it produces:** First real property valuation in the system; validates document filing workflow for Drive; confirms BPO vendor is capable; establishes the baseline for IC memo underwriting.

**Definition of done:** BPO PDF in Google Drive with correct file naming; `property_valuations` record in Supabase; loan record shows BPO value and condition grade.

---

### Task 3 — Complete First IC Memo

**When:** After BPO is received (Week 2–3)
**Owner:** Agent 03 (underwriting) + Kerry (approval)
**Time:** 1–2 business days

**Steps:**
1. Trigger Automation 03 (underwriting queue) for the target loan
2. Agent 03 underwrites the loan against buy box using Supabase data + BPO
3. Agent 03 generates IC memo draft (stored in `agent_logs`)
4. IC memo approval record created → appears in Airtable Approval Queue
5. Kerry reviews IC memo in Airtable Interface 1
6. Kerry approves or returns for revision

**What it produces:** First real IC memo in the system; validates Agent 03's underwriting output quality; validates the full approval routing workflow (Automation 04) end-to-end; tests the approval gate.

**Definition of done:** IC memo draft in `agent_logs`; approval record in `approvals` table; Kerry has made an approve/deny decision; approval gate confirmed to work (downstream step only executed after approval).

---

### Task 4 — Submit First Live Bid

**When:** After IC memo approved (Week 2–3)
**Owner:** Kerry (bid decision) + Agent 04 (pricing)
**Time:** 1 business day (seller deadline-dependent)

**Steps:**
1. Agent 04 finalizes bid price based on IC memo, BPO, and target yield
2. Bid submission approval request → Airtable Approval Queue
3. Kerry approves bid price
4. Kerry submits bid to seller directly (phone or email — not automated)
5. Outcome logged in Supabase `tape_loans` (bid_submitted_at, bid_amount, outcome)

**What it produces:** First real bid submitted; validates the full tape-to-bid workflow; Kerry gets firsthand experience with the system's pricing output quality.

**Definition of done:** Bid submitted; `tape_loans` record shows bid_amount and bid_submitted_at; outcome logged when seller responds.

---

### Task 5 — Onboard First LP (If Capital Raise is Active)

**When:** When first LP relationship is ready to close (Timeline varies)
**Owner:** Agent 16 (CRM + relationship) + Agent 17 (documents) + Kerry (all approvals)
**Time:** 5–10 business days

**Steps:**
1. LP prospect added to Airtable Base 5 (Investor CRM)
2. Agent 16 coordinates NDA — DocuSign template sent
3. NDA signed, countersigned, auto-filed to Google Drive
4. Subscription documents sent via DocuSign
5. LP signs → Kerry countersigns
6. LP record created in Supabase `lp_investors`
7. Capital account initialized in `capital_accounts`
8. Capital call notice issued (if capital is being called at close)

**What it produces:** First live LP in the system; validates the entire LP onboarding workflow including DocuSign completion webhooks, document auto-filing, and `lp_investors` + `capital_accounts` table writes.

**Definition of done:** LP record in Supabase with status Active; all signed documents in Google Drive `/06 - Closings/`; Airtable Base 5 shows LP as Active; capital account balance initialized.

---

### Task 6 — Close First Note Acquisition

**When:** After winning first bid (Timeline varies — seller negotiation)
**Owner:** Agent 05 (diligence + closing) + Kerry (all approval gates)
**Time:** 2–6 weeks (title, diligence, closing timeline)

**Steps:**
1. Execute purchase and sale agreement (DocuSign — vendor agreement template)
2. Order title search (Stage 1: manual through title company)
3. Agent 05 coordinates diligence checklist — logs completeness in Supabase
4. All closing documents filed to Google Drive `/06 - Closings/[Loan ID]/`
5. Wire execution: Kerry retrieves seller wire instructions via 1Password Secure Share
6. Kerry executes wire manually via bank portal
7. Kerry confirms wire in Supabase (updates closing record)
8. Loan boarded: `loans` table record created (status: Active — Performing or NPL)
9. Loan assigned to servicer; boarding package filed

**What it produces:** First loan in the active portfolio; first real test of the closing workflow, document vault, wire security (wire executed outside system as designed), and servicer boarding.

**Definition of done:** `loans` table record Active; all closing docs in Drive; servicer confirms boarding; `loans.servicer_id` populated; Power BI Portfolio Dashboard shows 1 active loan.

---

### Task 7 — Run First Monthly Portfolio Monitoring

**When:** End of first month with at least one active loan
**Owner:** Agent 06 (performing portfolio) + n8n Automation 11
**Time:** Automated — 30 minutes for n8n execution

**Steps:**
1. Automation 11 fires on schedule (1st of month, 6 AM CT)
2. Agent 06 reviews servicer report data in Supabase
3. Checks payment status, delinquency flags, exception conditions
4. Updates portfolio record; writes exception log if any issues found
5. Airtable Base 3 (Portfolio Management) updated
6. Power BI Portfolio Dashboard updated at next refresh

**What it produces:** First automated portfolio monitoring cycle; validates Automation 11 runs on schedule; confirms Agent 06 produces useful monitoring output; establishes the baseline for what "normal" looks like.

**Definition of done:** Automation 11 execution log shows success; `loans` table updated with current DPD status; Airtable Base 3 current; no NPI in n8n execution log.

---

### Task 8 — Complete First Exception and Resolution Cycle

**When:** When the first exception condition occurs (or triggered manually for testing)
**Owner:** Agent 09 (exception detection) + Kerry (resolution approval)
**Time:** Depends on exception type — 1–30 days

**Steps:**
1. Automation 05 detects exception (or Kerry manually creates one for system testing)
2. Agent 09 classifies exception: type, severity, affected loan(s)
3. Exception record created in Supabase `exception_log`
4. Exception appears in Airtable Base 7 (Exception Tracker) and Interface 6
5. Kerry reviews exception in Interface 1 (Approval Queue if resolution requires approval)
6. Resolution executed (depends on type: servicer instruction, legal referral, data correction)
7. Exception closed: `exception_log` record updated to Resolved
8. Airtable Base 7 moves exception to Resolved view
9. Power BI Compliance Dashboard (Dashboard 15) reflects resolution

**What it produces:** First complete exception lifecycle in the system; validates Automation 05, Agent 09, the exception tracker, and the approval gate for resolution decisions.

**Definition of done:** Exception created, classified, tracked, resolved, and closed in both Supabase and Airtable; audit trail complete in `audit_log`.

---

### Task 9 — Run Agent 15 First Security Audit

**When:** End of Month 1 of live operations
**Owner:** Agent 15 (Conflicts, Audit, Governance) + Kerry (review)
**Time:** 1–2 business days

**Steps:**
1. Agent 15 session triggered manually (or via Automation 18 schedule)
2. Agent 15 reviews `audit_log` for Month 1: all access events, approval decisions, exceptions
3. Verifies RLS policies have not changed (reads `pg_policies` table)
4. Checks that all agents stayed within their data classification access limits
5. Reviews n8n execution logs for NPI exposure
6. Checks 1Password access log for anomalies (Kerry reviews manually)
7. Files compliance review report to Supabase `compliance_reviews`
8. Files PDF report to Google Drive `/16 - Compliance/Security Reviews/`
9. Kerry reviews report and signs off

**What it produces:** First real security audit of the live system; validates Agent 15's audit function; establishes the quarterly cadence; identifies any gaps between the security design and actual system behavior.

**Definition of done:** `compliance_reviews` record created; PDF report in Drive; Kerry has reviewed and any findings are documented in `decisions/log.md` with remediation plan.

---

### Task 10 — Generate First Investor Report (If LP is Onboarded)

**When:** End of first quarter with at least one active LP
**Owner:** Agent 17 (DDQ + Investor Reporting) + Kerry (review and release)
**Time:** 3–5 business days

**Steps:**
1. Automation 15 triggers on quarterly schedule
2. Agent 17 pulls portfolio data from Supabase (aggregated — not loan-level)
3. Agent 17 drafts quarterly LP report using `investor_report_template.md`
4. Draft filed to Google Drive `/12 - Investor Reports/`
5. Agent 17 generates approval request for report release → Airtable Base 5 + Interface 1
6. Kerry reviews report thoroughly (valuation basis, performance metrics, disclosure language)
7. Kerry approves release
8. n8n triggers DocuSign for LP acknowledgment (if required)
9. Report distributed to LP via secure email or Box link
10. Distribution logged in Supabase; Airtable Base 5 updated

**What it produces:** First real LP communication from the operating system; validates the full investor reporting workflow end-to-end including report generation, approval gate, DocuSign, and LP distribution.

**Definition of done:** Report in Google Drive; approval record shows Kerry's approval; LP received report (delivery confirmed); `audit_log` shows full lifecycle.

---

## System Health Indicators

After live operations begin, these indicators confirm the system is functioning correctly. Review weekly.

| Indicator | Check Method | Healthy State | Alert Threshold |
|---|---|---|---|
| n8n automation success rate | n8n execution history | >95% success rate | <90% success rate |
| Supabase `audit_log` growth | Row count check | Growing daily (active system) | No new rows for 24 hours |
| Airtable Approval Queue | Interface 1 | All approvals have been actioned within SLA | Any approval >5 business days old |
| Power BI refresh status | Power BI Service | "Last refreshed: today" on all dashboards | Any dashboard showing >48 hours since refresh |
| Exception log — open items | Airtable Base 7 | Open exceptions decreasing or stable | Open exceptions growing week-over-week |
| Credential rotation status | 1Password rotation dates | All credentials within rotation window | Any credential overdue for rotation |
| Agent 15 last audit | `compliance_reviews` table | Audit completed within last 35 days | No audit for 45+ days |
| DocuSign completion webhook | Google Drive new files | New documents appearing in Drive within 15 min of signing | Any envelope completed with no Drive file appearing |

---

*This document is the master reference for the full Pinnacle Note Fund AI Operating System. Every system, every connection, every agent, and every security control is mapped here. When the system changes, update this document first — then update the component-level spec.*
