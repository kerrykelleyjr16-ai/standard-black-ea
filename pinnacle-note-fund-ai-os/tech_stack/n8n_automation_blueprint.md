# n8n Automation Blueprint — The Pinnacle Note Fund AI OS

**Fund:** The Pinnacle Note Fund
**Document:** n8n Workflow Design and Automation Specifications
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Design Principles

**Human approval gates every consequential action.** No automation in this system approves investments, sends wires, contacts borrowers, releases investor communications, or initiates legal filings without an explicit human approval record in the Supabase `approvals` table. n8n checks the approval status before every consequential execution step. If no approval exists, the workflow holds.

**Agents produce — humans decide — n8n executes.** Agents generate analysis, recommendations, and draft documents. Kerry decides. n8n executes the downstream action after the decision is recorded.

**Every session is logged.** Every agent session initiated by n8n creates a record in Supabase `agent_tasks` (at start) and `agent_logs` (at completion). Failures are logged. Retries are logged. Nothing runs silently.

**Least-privilege credentials.** n8n connects to Supabase using the `n8n_service` role — scoped access only. The Anthropic API key is stored as an n8n environment variable, never in workflow nodes. All credentials sourced from 1Password, loaded into n8n as environment variables at startup.

---

## Global Standards Applied to All Workflows

### Retry Logic
All external API calls (Anthropic, Supabase, Airtable, Google Drive, DocuSign) use:
- Max retries: 3
- Backoff: Exponential — 5s, 25s, 125s
- On final failure: log error, create Human Task in Airtable, send alert to Kerry

### Error Handling Pattern
Every workflow node that can fail includes:
```
On Error:
  1. Write error to agent_logs (status = Failed, error_code, error_message)
  2. Update agent_tasks record: status = Failed
  3. POST to /rest/v1/human_tasks (n8n_service): create manual intervention task
  4. Send notification to Kerry (email or Telegram when integrated)
  5. Halt workflow — do not proceed to downstream steps
```

### Approval Check Pattern
Before any consequential execution step:
```
n8n HTTP Request → GET /rest/v1/approvals
  ?approval_id=eq.[reference_id]
  &status=eq.Approved
  &select=id,approval_id,status,approved_by_primary
If result is empty → HALT: no approval on file
If result.status = Approved → proceed
If result.status = Pending or Rejected → halt, log, notify
```

### Credential Environment Variables
```
ANTHROPIC_API_KEY         = [from 1Password]
SUPABASE_URL              = [project URL]
SUPABASE_N8N_SERVICE_KEY  = [n8n_service role key from 1Password]
AIRTABLE_API_KEY          = [from 1Password]
GOOGLE_DRIVE_SA_KEY       = [service account JSON from 1Password]
DOCUSIGN_CLIENT_ID        = [from 1Password]
DOCUSIGN_CLIENT_SECRET    = [from 1Password]
DOCUSIGN_ACCOUNT_ID       = [from 1Password]
AGENT_01_ID through AGENT_18_ID = [from .env / 1Password]
KERRY_EMAIL               = [from 1Password]
```

---

## Automation Index

| # | Name | Trigger | Primary Agent | Human Gate |
|---|---|---|---|---|
| 1 | Tape Intake | Google Drive file upload | None (routing only) | No |
| 2 | Tape Normalization | n8n internal (from Intake) | Agent 18 | No |
| 3 | Underwriting Task Creation | n8n internal (from Normalization) | Agent 03 | No |
| 4 | Missing Data Alert | n8n internal (from Normalization output) | Agent 18 | No |
| 5 | Diligence Exception Creation | n8n internal (Agent 05 session) | Agent 05 | Yes — Critical/Major exceptions gate closing |
| 6 | Boarding Exception Creation | n8n internal (Agent 09 session) | Agent 09 | Yes — blocking exceptions gate boarding |
| 7 | Servicer Report Import | Google Drive file upload | Agent 06 | No |
| 8 | Delinquency Alert | Supabase scheduled check | Agent 06 | Yes — NPL escalation |
| 9 | NPL Workout Escalation | Supabase change (loan status update) | Agent 07 | Yes — strategy and legal filing |
| 10 | Vendor Follow-Up Reminder | Scheduled (daily) | Agent 08 | No |
| 11 | Investor Question Routing | Email trigger (Gmail MCP) | Agent 16 | Yes — all investor responses |
| 12 | Compliance Review Routing | Supabase change (compliance queue INSERT) | Agent 14 | Yes — cleared materials |
| 13 | Approval Queue Notification | Supabase change (approvals INSERT) | Agent 01 | Yes — all approvals |
| 14 | Distribution Checklist Workflow | Manual trigger (Kerry) | Agent 11 | Yes — wire execution |
| 15 | Investor Report Draft Workflow | Scheduled (quarterly) | Agent 17 | Yes — all stages |
| 16 | Data Room Update Alert | Supabase change (data_room_items INSERT) | Agent 18 | Yes — investor access |
| 17 | Risk Limit Breach Alert | Supabase change (risk_metrics INSERT — Amber/Red) | Agent 13 | Yes — Red limit breach |
| 18 | Monthly Executive Brief | Scheduled (daily + monthly) | Agent 01 | No |

---

## Automation 1: Tape Intake

**Purpose:** Detects a new tape file uploaded to the Google Drive active tapes folder, validates it, creates the tape record in Supabase, and routes it to the Tape Normalization automation.

**Trigger:** Google Drive webhook — new file created in `/05 - Loan Tapes/[Year]/[Quarter]` (monitored via n8n Google Drive Trigger node, polling interval: 5 minutes)

**Inputs:**
- File ID, file name, MIME type, folder path, uploader email, upload timestamp (from Drive trigger)

**Connected Tools:** Google Drive API, Supabase (PostgREST), Airtable

**Responsible Agent:** None at this stage — routing and record creation only

---

**Steps:**

**Step 1 — File Validation**
- Check MIME type: must be `application/vnd.ms-excel`, `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, or `application/pdf`
- Check file size: must be > 0 KB and < 200 MB
- Check folder path: confirm file is in an expected Active Tapes subfolder (not another folder in the drive)
- If validation fails → log, create Human Task "Invalid file format detected in Active Tapes folder — review manually", halt

**Step 2 — Seller Lookup**
- Extract seller name from folder path or file name (pattern matching)
- GET `/rest/v1/sellers?company_name=ilike.[extracted_name]&select=seller_id,company_name`
- If seller not found → create new seller record with status = `Active` and placeholder fields; flag for Kerry to complete seller profile
- Store `seller_id` for use in Step 3

**Step 3 — Create Tape Record in Supabase**
```json
POST /rest/v1/loan_tapes
{
  "tape_id": "TAPE-[YYYY]-[sequential number]",
  "seller_id": "[from Step 2]",
  "received_date": "[today]",
  "status": "Received",
  "normalization_status": "Pending",
  "data_quality_score": null,
  "agent_session_id": null
}
```

**Step 4 — Create Airtable Record**
- POST to Airtable Deal Pipeline / Tape Log: `Tape ID`, `Seller`, `Date Received`, `Status = Received`

**Step 5 — Create Agent Task in Supabase**
```json
POST /rest/v1/agent_tasks
{
  "task_id": "TASK-[sequential]",
  "agent_number": 18,
  "agent_name": "Agent 18 — Data, Automation, Dashboards & Security",
  "agent_id": "[AGENT_18_ID]",
  "workflow_trigger": "WF-01-Intake",
  "task_type": "Tape Normalization",
  "reference_id": "[tape_id]",
  "reference_table": "loan_tapes",
  "status": "Pending"
}
```

**Step 6 — Trigger Tape Normalization Automation (Automation 2)**
- Pass: `task_id`, `tape_id`, `file_id`, `seller_id`

**Output:**
- Supabase `loan_tapes` record created (status: Received)
- Airtable Deal Pipeline record created
- Supabase `agent_tasks` record created (status: Pending)
- Tape Normalization automation triggered

**Human Approval Required:** No — intake and routing are fully automated

**Error Handling:**
- Invalid file: Human Task created for manual review; tape record still created with `normalization_status = Failed` so it is visible in Airtable
- Supabase write failure: retry 3x; on final failure, send email alert to Kerry with file details

**Logs Updated:**
- `agent_tasks` — task created at Step 5
- `loan_tapes` — record created at Step 3

**Security Considerations:**
- Drive webhook authenticated via OAuth2 service account
- n8n does not store file contents — only metadata at intake stage; file content fetched by Agent 18 in Automation 2
- Uploaded file name is sanitized before use in any API call (strip special characters)

---

## Automation 2: Tape Normalization

**Purpose:** Invokes Agent 18 to normalize the raw tape file — extract loan-level data, assess data quality, flag issues, and write normalized data to Supabase. This is the first substantive AI session in the acquisition workflow.

**Trigger:** Internal — called by Automation 1 Step 6, or manual trigger by Kerry (for re-normalization)

**Inputs:** `task_id`, `tape_id`, `file_id` (Google Drive), `seller_id`

**Connected Tools:** Google Drive API, Anthropic API (Agent 18), Supabase, Airtable

**Responsible Agent:** Agent 18 — Data, Automation, Dashboards & Security

---

**Steps:**

**Step 1 — Download File from Google Drive**
- Google Drive API: `GET /drive/v3/files/{file_id}?alt=media`
- Store file content temporarily in n8n binary data
- If file is Excel or CSV: convert to structured JSON (n8n Code node — use SheetJS or CSV parse)
- If file is PDF: extract text (n8n Code node — note: PDFs are unreliable; flag for manual data entry if PDF)

**Step 2 — Fetch Seller Context from Supabase**
- GET `/rest/v1/sellers?seller_id=eq.[seller_id]&select=*`
- GET prior tapes from this seller: `/rest/v1/loan_tapes?seller_id=eq.[seller_id]&select=tape_id,data_quality_score,status`

**Step 3 — Build Agent 18 Session Input**
```json
{
  "input": {
    "content": "Tape ID: [tape_id] | Seller: [seller_name] | File: [file_name]
Task: Normalize this tape. Extract all loan-level data fields. Score data quality (0-100). 
Flag missing, inconsistent, or out-of-policy fields.
Seller history: [prior tape count, avg quality score]
Raw data (first 200 rows): [structured JSON from Step 1]
Return structured JSON with: normalized_loans array, data_quality_score, data_quality_flags array, 
loan_count, total_upb, asset_mix estimate, missing_data_fields array."
  }
}
```

**Step 4 — Invoke Agent 18 Session**
```
POST https://api.anthropic.com/v1/agents/[AGENT_18_ID]/sessions
Headers:
  x-api-key: [ANTHROPIC_API_KEY]
  anthropic-version: 2023-06-01
  anthropic-beta: managed-agents-2026-04-01
Body: [session input from Step 3]
```
- Update `agent_tasks` status = `Running`, `session_id` = returned session ID

**Step 5 — Parse Agent 18 Output**
- Extract from JSON response: `normalized_loans`, `data_quality_score`, `data_quality_flags`, `loan_count`, `total_upb`, `asset_mix`, `missing_data_fields`
- Validate JSON structure — if malformed, log and halt

**Step 6 — Write Normalized Loans to Supabase**
- For each loan in `normalized_loans` array:
```json
POST /rest/v1/loans (batch UPSERT)
{
  "loan_id": "LOAN-[YYYY]-[sequential]",
  "tape_id": "[tape_id]",
  "seller_id": "[seller_id]",
  "property_address": "[from normalized data]",
  "property_city": "[...]",
  "property_state": "[...]",
  "current_upb": "[...]",
  "payment_status": "[...]",
  "loan_classification": "Unclassified",
  "acquisition_status": "Prospect"
  ... [all fields from normalized output]
}
```
- Batch size: 50 loans per UPSERT call to stay within Supabase limits

**Step 7 — Update Tape Record in Supabase**
```json
PATCH /rest/v1/loan_tapes?tape_id=eq.[tape_id]
{
  "loan_count": [count],
  "total_upb": [sum],
  "asset_mix": "[mix]",
  "data_quality_score": [score],
  "data_quality_flags": ["flag1", "flag2"],
  "normalization_status": "Complete",
  "status": "Screening",
  "agent_session_id": "[session_id]"
}
```

**Step 8 — Write Normalized File to Google Drive**
- Generate normalized CSV from `normalized_loans` data
- Upload to `/05 - Loan Tapes/[Year]/[Quarter]/[TAPE-ID]/Normalized/`
- File name: `TAPE-[tape_id]-Normalized-[date].csv`

**Step 9 — Update Airtable Tape Log**
- PATCH Airtable: `Data Quality Score`, `Data Quality Flags`, `Status = Screening`, `Agent 18 Session`

**Step 10 — Write to Agent Logs**
```json
POST /rest/v1/agent_logs
{
  "log_id": "LOG-[sequential]",
  "task_id": "[task_id]",
  "agent_number": 18,
  "agent_id": "[AGENT_18_ID]",
  "session_id": "[session_id]",
  "workflow_trigger": "WF-01-Normalization",
  "started_at": "[start time]",
  "completed_at": "[now]",
  "status": "Complete",
  "output_structured": {
    "data_quality_score": [score],
    "loan_count": [count],
    "total_upb": [upb],
    "flags": ["..."]
  }
}
```
- Update `agent_tasks`: `status = Complete`, `log_id = [log_id]`

**Step 11 — Branch: Data Quality Check**
- If `data_quality_score` < 60 → trigger Automation 4 (Missing Data Alert) AND continue to Agent 02 screening
- If `data_quality_score` ≥ 60 → continue to Agent 02 screening only
- Trigger Automation 3 (Underwriting Task Creation — Agent 02 screening) in all cases

**Output:**
- All loans in tape written to Supabase `loans` table
- Tape record updated with quality score and normalization status
- Normalized CSV filed in Google Drive
- Airtable updated
- Agent 02 screening task triggered

**Human Approval Required:** No — normalization and screening recommendation are fully automated. Kerry's approval is required at the go/no-bid stage (Automation 3 output).

**Error Handling:**
- Agent 18 session timeout (>5 min): retry once; if failed, mark `normalization_status = Failed`, create Human Task
- Supabase batch write partial failure: log which loans failed, retry failed rows, flag tape for review
- File too large for in-memory processing: break into chunks of 100 rows per Agent 18 session

**Logs Updated:**
- `agent_tasks` — status updates at Step 4 and Step 10
- `agent_logs` — full session record at Step 10
- `loan_tapes` — normalization fields at Step 7
- `loans` — all loan records at Step 6

**Security Considerations:**
- Normalized loan data contains borrower addresses — handled as Confidential; never logged to plain text; stored only in Supabase (RLS enforced) and Google Drive (team permissions)
- Any PII fields identified by Agent 18 (SSN fragments, full DOB) are flagged in `data_quality_flags` and must be masked before the normalized file is shared with any external party

---

## Automation 3: Underwriting Task Creation

**Purpose:** After tape normalization, this automation triggers Agent 02 (tape screening / go-no-bid) and then, if a Go recommendation is returned, creates Agent 03 underwriting sessions for each loan and Agent 04 pricing session for the tape.

**Trigger:** Internal — called by Automation 2 Step 11

**Inputs:** `tape_id`, normalized loan data (from Supabase)

**Connected Tools:** Anthropic API (Agent 02, then Agent 03 and Agent 04), Supabase, Airtable

**Responsible Agents:** Agent 02 (screening), Agent 03 (underwriting per loan), Agent 04 (tape pricing)

---

**Steps:**

**Step 1 — Fetch Tape and Loan Summary from Supabase**
- GET `/rest/v1/loan_tapes?tape_id=eq.[tape_id]&select=*`
- GET loan count and UPB distribution: aggregate query on `loans` table for this tape

**Step 2 — Invoke Agent 02 Session (Tape Screening)**
```
POST https://api.anthropic.com/v1/agents/[AGENT_02_ID]/sessions
Input: {
  "content": "Tape ID: [tape_id] | Seller: [seller_name] | Loan Count: [count] | Total UPB: [upb]
Task: Screen this tape against the fund buy box policy. Assess loan mix, geography, 
lien position, payment history distribution, and UPB range. Return: go_no_bid, 
bid_deadline_recommendation, screening_summary, out_of_policy_loans array, 
key_risks array, recommended_next_steps."
}
```
- Create `agent_tasks` record for Agent 02 session

**Step 3 — Update Tape with Screening Output**
- PATCH `loan_tapes`: `go_no_bid = [recommendation]`, `status = Screening`, Agent 02 screening summary
- PATCH Airtable Tape Log: `Go / No-Bid`, `Agent 02 Screening`

**Step 4 — Branch: Go / No-Bid Decision**
- If `go_no_bid = No-Bid` → update `loan_tapes.status = Rejected`, notify Kerry (informational — no approval needed to pass), halt
- If `go_no_bid = Conditional Go` → continue AND create Human Task for Kerry to review conditions before UW proceeds
- If `go_no_bid = Go` → continue to Step 5

**Step 5 — Create Agent 03 Tasks (Per Loan)**
- For each loan in tape where `lien_position = 1` and `current_upb` within buy box:
  - Fetch PropStream data from `property_values` table (populated by Automation 2 Step 6 via PropStream pull — if not yet populated, wait 60 seconds and retry)
  - Create `agent_tasks` record per loan
  - Invoke Agent 03 session per loan (batched — max 10 concurrent sessions)
  ```
  POST https://api.anthropic.com/v1/agents/[AGENT_03_ID]/sessions
  Input: {
    "content": "Loan ID: [loan_id] | Property: [address, city, state] | UPB: [upb]
  Task: Underwrite this note. Review payment history, property value, LTV, ITV, 
  lien position, loan type, and exceptions. 
  Property data: [AVM, tax status, liens, foreclosure status from property_values]
  Payment history: [months_paid_12, delinquency_days, payment_status]
  Return: health_score (0-100), classification (Income/Borderline/NPL), 
  uw_flags array, missing_data_fields array, recommendation."
  }
  ```
  - Write Agent 03 output to `underwriting_reviews` table per loan
  - Update `loans`: `health_score`, `uw_classification`, `uw_flags`

**Step 6 — Create Agent 04 Task (Tape Pricing)**
- After all Agent 03 sessions complete (or 80% complete — don't block pricing on one straggler):
- Aggregate UW results: avg health score, classification breakdown, LTV distribution
- Invoke Agent 04 session (one session per tape)
  ```
  POST https://api.anthropic.com/v1/agents/[AGENT_04_ID]/sessions
  Input: {
    "content": "Tape ID: [tape_id] | Loan Count: [count] | Total UPB: [upb]
  Task: Build 3-scenario pricing model for this tape. Use underwriting data for each loan.
  Income loans: [count, avg LTV, avg health score] | NPL loans: [count, avg ITV, avg resolution path likelihood]
  Return: base_irr, base_bid_pct, base_bid_amount, upside_irr, upside_bid, downside_irr, 
  downside_bid, recommended_bid, max_bid, walk_price, key_risks, assumptions."
  }
  ```
- Write Agent 04 output to `pricing_models` table
- Update `loan_tapes.status = Pricing`
- Create Airtable Pricing Summary record

**Step 7 — Create Approval Queue Item (Go Decision)**
- POST `/rest/v1/approvals`:
```json
{
  "approval_type": "LOI",
  "item_description": "Tape [tape_id] — Go recommendation. Recommended bid: $[amount]. 
Agent 02 screening complete. Agent 03 UW complete for [n] loans. 
Agent 04 pricing: Base IRR [%], Recommended bid $[amount].",
  "requested_by": "Agent 04",
  "amount": [recommended_bid_amount],
  "reference_id": "[tape_id]",
  "reference_table": "loan_tapes",
  "status": "Pending"
}
```
- Sync to Airtable Approval Queue
- Trigger Automation 13 (Approval Queue Notification)

**Output:**
- Agent 02 screening result in Supabase and Airtable
- Agent 03 UW reviews per loan in `underwriting_reviews` and `loans`
- Agent 04 pricing model in `pricing_models`
- Approval Queue item awaiting Kerry bid decision

**Human Approval Required:** Kerry must approve the bid in the Approval Queue before Agent 02 drafts the LOI. No LOI is sent without this approval.

**Error Handling:**
- Agent 03 session failure for individual loan: mark that loan's `underwriting_reviews.status = Failed`; continue with remaining loans; flag failed loans in tape summary
- Agent 04 fails: mark `pricing_models` record as failed; create Human Task for manual pricing review

**Logs Updated:** `agent_tasks` and `agent_logs` per session (Agent 02, Agent 03 ×N, Agent 04)

**Security Considerations:** Loan-level borrower payment data passed to agents only via the session input — agents do not retain data between sessions. Session inputs are logged but stored only in the Supabase `agent_logs` table (RLS enforced).

---

## Automation 4: Missing Data Alert

**Purpose:** When Agent 18 normalization returns a data quality score below 60 or flags critical missing fields (AVM, lien position, payment history), this automation creates a structured alert for Kerry and optionally routes back to the seller for data completion.

**Trigger:** Internal — called by Automation 2 Step 11 when `data_quality_score < 60` OR `missing_data_fields` contains critical fields

**Inputs:** `tape_id`, `data_quality_score`, `data_quality_flags`, `missing_data_fields`, `seller_id`

**Connected Tools:** Supabase, Airtable, Gmail (for seller follow-up draft — not sent without approval)

**Responsible Agent:** Agent 18 (alert generation)

---

**Steps:**

**Step 1 — Classify Missing Data Severity**
- Critical fields (halt UW until resolved): lien position, current UPB, property address, payment history 12 months
- Major fields (proceed with flag): AVM value, tax status, borrower name, maturity date
- Minor fields (log only): interest rate, original note date, property type
- Determine: `severity = Critical` if any critical field missing; `Major` if any major field missing

**Step 2 — Create Human Task in Airtable**
- POST to Airtable Task Management / Human Task Queue:
```
Task: "Data Quality Review — Tape [tape_id]"
Category: "Decision Required"
Assigned To: Kerry
Priority: [Critical → URGENT | Major → High | Minor → Normal]
Notes: "Data quality score: [score]/100. Missing critical fields: [list]. 
Missing major fields: [list]. Recommend: request data from seller before proceeding."
```

**Step 3 — Update Tape Log in Airtable**
- Update `Data Quality Flags` field with formatted flag list

**Step 4 — Draft Seller Follow-Up Email (Do Not Send)**
- n8n Code node: compose email draft
  - To: Seller primary contact email (from `sellers` table)
  - Subject: `Data Completion Request — [Tape ID] — [Seller Name]`
  - Body: Lists specific missing fields by loan ID; requests updated file or field-level responses
- Save draft to Gmail (via Gmail MCP) — do not send
- Create Approval Queue item: "Approve sending data completion request to [Seller Name] for Tape [tape_id]"

**Step 5 — Create Approval Queue Item**
```json
POST /rest/v1/approvals
{
  "approval_type": "Other",
  "item_description": "Send data completion request to [seller] for Tape [tape_id]. 
Email drafted and ready. Quality score: [score]. Missing: [fields list].",
  "requested_by": "Agent 18",
  "reference_id": "[tape_id]",
  "reference_table": "loan_tapes",
  "status": "Pending"
}
```
- Trigger Automation 13 (Approval Queue Notification)

**Step 6 — On Kerry Approval → Send Email**
- n8n watches for `approvals.status = Approved` for this record (webhook from Airtable Approval Queue)
- On approval: Gmail API sends the drafted email
- Log send event to `agent_logs`

**Output:**
- Human Task in Airtable for Kerry
- Gmail draft created (not sent)
- Approval Queue item for email send authorization

**Human Approval Required:** Yes — seller communication requires Kerry approval before sending

**Error Handling:** If Gmail draft creation fails: include full email text in Human Task notes so Kerry can send manually

**Logs Updated:** `agent_logs` (Agent 18 alert session), `loan_tapes` (quality flags), `agent_tasks`

**Security Considerations:** Email draft does not include any borrower-level PII — only references missing data fields by category. Seller receives no more information than necessary to complete their own tape data.

---

## Automation 5: Diligence Exception Creation

**Purpose:** After LOI acceptance and Kerry's diligence authorization, invokes Agent 05 to review the collateral package. Agent 05's exceptions are logged to Supabase and surfaced in Airtable. Critical exceptions block closing until resolved or explicitly waived by Kerry.

**Trigger:** Airtable webhook — `LOI Tracker.Diligence Auth` checkbox is checked by Kerry

**Inputs:** `tape_id`, `loan_ids` (all loans in tape), collateral file package location in Google Drive

**Connected Tools:** Google Drive API, Anthropic API (Agent 05), Supabase, Airtable

**Responsible Agent:** Agent 05 — Diligence, Collateral & Closing

---

**Steps:**

**Step 1 — Verify Diligence Authorization in Supabase**
- GET `/rest/v1/approvals?reference_id=eq.[tape_id]&approval_type=eq.LOI&status=eq.Approved`
- If no approved LOI record: halt, log error, create Human Task "Diligence triggered without LOI approval on file — investigate"
- This is the approval gate: Airtable checkbox alone is not sufficient; Supabase approval record must exist

**Step 2 — Fetch Collateral Package Files from Google Drive**
- List files in `/06 - Collateral Files/Active Pipeline/[TAPE-ID]/`
- For each loan folder: list available document files (note, allonges, mortgage/DOT, assignments)
- Build collateral inventory map: `{loan_id: [file_ids], document_types: [...]}`

**Step 3 — Create Agent 05 Task Per Loan**
- For each loan in tape (process in batches of 5 — diligence is intensive):
  - Create `agent_tasks` record
  - Fetch loan data from Supabase: `loans`, `property_values`, prior `diligence_exceptions`
  - Download collateral documents for the loan (Google Drive API)
  - Invoke Agent 05 session:
  ```
  POST https://api.anthropic.com/v1/agents/[AGENT_05_ID]/sessions
  Input: {
    "content": "Loan ID: [loan_id] | Property: [address]
  Task: Full diligence review of this note. Review all provided documents.
  Loan data: [UPB, lien position, payment status, servicer, AVM, tax status, lien count]
  Collateral inventory: [document list from Step 2]
  Document content: [extracted text or summary of each doc]
  Return: exceptions_found array (each with: exception_type, severity, description, 
  financial_impact, legal_impact, required_resolution, owner, deadline, blocks_closing),
  collateral_document_inventory array (each with: document_type, status, condition, defect_description),
  closing_ready (boolean), closing_ready_notes."
  }
  ```

**Step 4 — Write Exceptions to Supabase**
- For each exception in Agent 05 output:
```json
POST /rest/v1/diligence_exceptions
{
  "exception_id": "EXC-D-[sequential]",
  "loan_id": "[loan_id]",
  "tape_id": "[tape_id]",
  "exception_type": "[type]",
  "severity": "[Critical/Major/Minor]",
  "description": "[description]",
  "financial_impact": [amount],
  "legal_impact": "[description]",
  "required_resolution": "[resolution]",
  "owner": "[owner]",
  "deadline": "[date]",
  "blocks_closing": [true/false],
  "status": "Open",
  "agent_session_id": "[session_id]"
}
```

**Step 5 — Write Collateral Document Inventory to Supabase**
- For each document in inventory:
  ```json
  POST /rest/v1/collateral_documents
  { "loan_id": ..., "document_type": ..., "document_status": ..., ... }
  ```

**Step 6 — Update Loan Closing Ready Flag**
- PATCH `loans.closing_ready = [true/false]` per Agent 05 output
- PATCH `loans.acquisition_status = Diligence`

**Step 7 — Sync Exceptions to Airtable Exception Tracker**
- For each Critical and Major exception: POST to Airtable Diligence Exceptions table
- Color-coded severity automatically from Airtable view filters

**Step 8 — Create Approval Queue Items for Critical Exceptions**
- For each exception where `severity = Critical` AND `blocks_closing = true`:
```json
POST /rest/v1/approvals
{
  "approval_type": "Closing",
  "item_description": "CRITICAL EXCEPTION — Loan [loan_id] | [exception_type]: [description]. 
Financial impact: $[amount]. Blocks closing. Resolution required: [resolution]. Owner: [owner].",
  "requested_by": "Agent 05",
  "amount": [financial_impact],
  "reference_id": "[loan_id]",
  "reference_table": "loans",
  "status": "Pending"
}
```
- Trigger Automation 13 (Approval Queue Notification) for each Critical item

**Step 9 — Generate Closing Readiness Summary**
- Aggregate all loan results: closing ready count, exception count by severity
- Write Agent 05 summary document to Google Drive: `/06 - Collateral Files/Active Pipeline/[TAPE-ID]/`
- Update Airtable Closing Tracker

**Output:**
- All exceptions in `diligence_exceptions` table in Supabase
- Collateral inventory in `collateral_documents` table
- `loans.closing_ready` updated per loan
- Critical exceptions in Approval Queue — block closing until resolved or waived by Kerry
- Closing readiness summary in Google Drive and Airtable

**Human Approval Required:** Yes — every Critical exception that blocks closing requires a specific Approval Queue decision from Kerry (resolve, waive, or abort) before closing proceeds. n8n checks `blocks_closing = true` exceptions are all in `Resolved` or `Waived` status before authorizing closing step.

**Error Handling:**
- Agent 05 session fails for a loan: mark that loan `closing_ready = false`, create Human Task for manual review
- Google Drive file download fails (document missing): log as `document_status = Missing` in `collateral_documents`; Agent 05 flags this as a diligence exception

**Logs Updated:** `agent_tasks`, `agent_logs` (per loan), `diligence_exceptions`, `collateral_documents`, `loans`

**Security Considerations:** Collateral files contain full loan documents with borrower PII (name, address, SSN in some cases). Agent 05 session input is constructed by n8n and passed in-memory — not written to any external log. Session output (exceptions, inventory) contains no SSNs — only loan-level identifiers and document status.

---

## Automation 6: Boarding Exception Creation

**Purpose:** After wire confirmation, invokes Agent 09 to perform boarding QA check on each purchased loan. Boarding exceptions are logged; loans with blocking exceptions are held until resolved.

**Trigger:** Manual trigger by Kerry after wire confirmation is received from bank (Kerry enters wire confirmation in Airtable Closing Tracker → webhook fires)

**Inputs:** `tape_id`, `loan_ids` (purchased loans only), wire confirmation details, collateral package files

**Connected Tools:** Google Drive API, Anthropic API (Agent 09), Supabase, Airtable

**Responsible Agent:** Agent 09 — QA, Exceptions & Boarding Control

---

**Steps:**

**Step 1 — Verify Wire Authorization in Supabase**
- GET `/rest/v1/approvals?reference_id=eq.[tape_id]&approval_type=eq.Wire&status=eq.Approved`
- Must find at minimum: Kerry primary approval AND secondary approval (Controller or designated secondary)
- If dual approval not on file: halt, do not proceed, create URGENT Human Task

**Step 2 — Fetch Purchased Loan List**
- GET `loans` for this tape where `acquisition_status` is being updated to `Active`
- Confirm loan IDs match the wire amount (loan count × estimated purchase price ≈ wire amount — within 5% tolerance)
- If tolerance exceeded: halt, create URGENT Human Task

**Step 3 — Update Loan Status to Boarding**
- PATCH `loans.acquisition_status = Boarding` for all purchased loans

**Step 4 — Invoke Agent 09 QA Session Per Loan**
- For each loan:
  - Fetch prior diligence exceptions (from `diligence_exceptions` — check which were resolved, waived, or remain open)
  - Fetch collateral inventory (from `collateral_documents`)
  - Fetch property data (from `property_values`)
  - Invoke Agent 09 session:
  ```
  POST https://api.anthropic.com/v1/agents/[AGENT_09_ID]/sessions
  Input: {
    "content": "Loan ID: [loan_id] | Tape: [tape_id]
  Task: Boarding QA check. Confirm all required collateral documents are received, 
  all pre-existing diligence exceptions are resolved or formally waived,
  and loan data matches the tape. Flag any discrepancies.
  Prior exceptions: [list with status]
  Collateral inventory: [document list with status]
  Tape data vs. actual data comparison: [key fields]
  Return: qa_status (Cleared/Held), boarding_exceptions array (if any), 
  each with: exception_type, severity, description, required_resolution, blocks_boarding."
  }
  ```

**Step 5 — Write Boarding Exceptions to Supabase**
- For each exception returned by Agent 09:
```json
POST /rest/v1/boarding_exceptions
{
  "exception_id": "EXC-B-[sequential]",
  "loan_id": "[loan_id]",
  "exception_type": "[type]",
  "severity": "[severity]",
  "description": "[description]",
  "required_resolution": "[resolution]",
  "blocks_boarding": [true/false],
  "status": "Open",
  "qa_cleared": false
}
```

**Step 6 — Update Loan QA Status**
- If no blocking exceptions: PATCH `loans.qa_status = Cleared`, `loans.acquisition_status = Active`, `loans.boarding_date = today`
- If blocking exceptions: PATCH `loans.qa_status = Held`

**Step 7 — Sync to Airtable**
- Update Closing Tracker: `Loans Boarded`, `Loans Held`
- Create Exception Tracker records for all boarding exceptions

**Step 8 — Create Approval Queue for Blocking Exceptions**
- For each `blocks_boarding = true` exception:
  ```json
  POST /rest/v1/approvals
  { "approval_type": "Other", "item_description": "BOARDING HOLD — Loan [loan_id]: [description]...", ... }
  ```

**Output:**
- All loans either Cleared (status = Active) or Held (status = Boarding with exceptions)
- Boarding exceptions in Supabase and Airtable
- Cleared loans ready for servicer boarding

**Human Approval Required:** Yes — wire dual-approval checked at Step 1 (must already be on file). Boarding holds require Kerry resolution decision in Approval Queue.

**Error Handling:** Agent 09 session fails: mark loan `qa_status = Held`, create Human Task for manual QA review

**Logs Updated:** `agent_tasks`, `agent_logs`, `boarding_exceptions`, `loans`

**Security Considerations:** Wire confirmation details are not stored in Supabase — only confirmation status (boolean) and wire date. Actual wire reference numbers stored in `cash_activity` table (Controller access only).

---

## Automation 7: Servicer Report Import

**Purpose:** Monthly trigger — when servicer remittance reports are uploaded to Google Drive, this automation routes them to Agent 06 for portfolio update and cashflow analysis.

**Trigger:** Google Drive webhook — new file uploaded to `/09 - Servicer Reports/[Servicer Code]/Remittance Reports/[Year]/`

**Inputs:** File ID, servicer code (extracted from folder path), upload timestamp

**Connected Tools:** Google Drive API, Anthropic API (Agent 06, then Agent 08), Supabase, Airtable

**Responsible Agents:** Agent 06 (portfolio update), Agent 08 (servicer performance)

---

**Steps:**

**Step 1 — Identify Servicer from Folder Path**
- Parse folder path to extract servicer code
- GET `/rest/v1/servicers?servicer_code=eq.[code]&select=*`
- Confirm servicer is active; if not found: create Human Task

**Step 2 — Download and Parse Remittance Report**
- Google Drive API: download file
- Parse Excel/CSV: extract loan-level remittance rows
- Map to expected schema: `loan_id`, `payment_date`, `principal_received`, `interest_received`, `escrow_received`, `total_received`

**Step 3 — Invoke Agent 06 Session**
```
POST https://api.anthropic.com/v1/agents/[AGENT_06_ID]/sessions
Input: {
  "content": "Servicer: [servicer_name] | Report Month: [YYYY-MM] | Loan Count: [count]
Task: Process this month's remittance report. For each loan, compare actual payment 
to expected payment. Flag delinquencies, changes in payment status, and loans 
requiring collections action. Build 30/60/90-day cashflow forecast.
Servicer remittance data: [parsed JSON per loan]
Existing loan data (expected payments): [from loans table for this servicer]
Return: loan_updates array (payment_status, last_payment_date, delinquency_days, months_paid_12),
cashflow_forecast array (loan_id, 30/60/90 day projection), 
servicer_summary (total collected, total expected, variance, collection_rate),
delinquency_alerts array (loans newly 30+/60+/90+ delinquent)."
}
```

**Step 4 — Write Cashflow to Supabase**
- For each loan in `loan_updates`:
  - PATCH `loans`: `payment_status`, `last_payment_date`, `delinquency_days`, `months_paid_12`
- For each loan in `cashflow_forecast`:
  - UPSERT `cashflow_forecast`: `loan_id`, `forecast_30`, `forecast_60`, `forecast_90`
- For each remittance row: POST `cash_activity`:
  ```json
  { "category": "Remittance", "loan_id": ..., "amount": [total_received], "transaction_date": ...,
    "servicer_code": ..., "source_document": "[drive_file_id]" }
  ```

**Step 5 — Update Servicer Record**
- PATCH `servicers`: `loan_count_current`, `upb_current`, `avg_collection_rate`, `last_report_date = today`

**Step 6 — Trigger Delinquency Alerts**
- For each loan in `delinquency_alerts`: trigger Automation 8 (Delinquency Alert)

**Step 7 — Invoke Agent 08 Servicer Scorecard Update**
- After Agent 06 complete, invoke Agent 08 session to update servicer performance metrics
- Write to `vendor_scorecards` in Supabase; update Airtable Monthly Scorecards

**Step 8 — Update Airtable**
- Update Loan Asset Registry / Cashflow Monitor records for current month
- Update Servicer Tracker: Last Report Date, Last Report Status = On Time

**Output:**
- All loans updated with current payment status
- Cashflow entries in `cash_activity`
- 90-day cashflow forecast updated
- Servicer scorecard updated
- Delinquency alerts triggered for newly past-due loans

**Human Approval Required:** No — data import and loan updates are informational. Delinquency escalations (via Automation 8) have their own approval gates.

**Error Handling:**
- Report format not parseable: create Human Task "Servicer report format unrecognized — manual upload needed"; log to Airtable Servicer Tracker as `Last Report Status = Failed`
- Loan ID in report not found in Supabase: flag as `data_quality_flag` on that servicer's record; create Human Task

**Logs Updated:** `agent_tasks`, `agent_logs`, `loans`, `cash_activity`, `cashflow_forecast`, `vendor_scorecards`

**Security Considerations:** Remittance reports contain loan-level payment history — Confidential. Parsed data written only to Supabase (RLS enforced). Raw report file stays in Google Drive with team-level permissions only.

---

## Automation 8: Delinquency Alert

**Purpose:** When a loan transitions to 30, 60, or 90+ days delinquent, this automation creates a structured alert and, for 60+ day loans, triggers Agent 07 NPL escalation.

**Trigger:** Called by Automation 7 Step 6, OR scheduled daily check (6:00 AM CT) of `loans` where `payment_status` changed since last check

**Inputs:** `loan_id`, `payment_status` (new), prior `payment_status`

**Connected Tools:** Supabase, Airtable

**Responsible Agent:** Agent 06 (produces data), Agent 07 (triggered for 60+)

---

**Steps:**

**Step 1 — Determine Alert Level**
- 30 days: Informational alert — Watch List flag
- 60 days: Action required — NPL escalation initiated
- 90+ days: URGENT — NPL escalation AND legal review flagged
- Bankruptcy filed: URGENT — immediate Attorney routing

**Step 2 — Update Loan Classification (60+ days)**
- PATCH `loans.loan_classification = NPL` for all loans at 60+ days
- PATCH `loans.workout_strategy = TBD` (Agent 07 will determine)

**Step 3 — Create Airtable Watch List Entry**
- Update Active Portfolio view (Airtable filters handle display automatically based on payment_status)

**Step 4 — Create Human Task**
- Priority matches alert level: Normal (30-day), High (60-day), URGENT (90+, BK)
- Assigned To: Kody (30-day monitoring) or Kerry (60+ escalation)

**Step 5 — For 60+ Days: Create Approval Queue Item (NPL Strategy)**
```json
POST /rest/v1/approvals
{
  "approval_type": "NPL Strategy",
  "item_description": "Loan [loan_id] — [property_address] — [payment_status] delinquent. 
Loan classification updated to NPL. Agent 07 NPL strategy session pending Kerry authorization.",
  "requested_by": "Automation 8",
  "reference_id": "[loan_id]",
  "status": "Pending"
}
```
- Trigger Automation 9 (NPL Workout Escalation) — passes through the approval gate in that workflow

**Output:**
- Airtable Watch List updated
- Human Task created
- For 60+: Approval Queue item; NPL Workout Escalation triggered

**Human Approval Required:** Yes — for 60+ day loans, Kerry must approve NPL strategy initiation before Agent 07 is invoked

**Error Handling:** If `payment_status` is ambiguous (same-day servicer update and scheduled check conflict): defer to most recent timestamp in `loans.updated_at`

**Logs Updated:** `loans`, `agent_tasks` (if Agent 07 is triggered downstream)

**Security Considerations:** Borrower delinquency data is Internal/Confidential. Alerts do not include borrower names in notification text — only loan ID and property address.

---

## Automation 9: NPL Workout Escalation

**Purpose:** When Kerry approves NPL strategy initiation for a 60+ day loan, this automation invokes Agent 07 to build the NPL action plan, routes it for review, and sets up the ongoing legal milestone tracking. NO legal action is filed without a separate explicit approval.

**Trigger:** Supabase webhook — `approvals.status` changes to `Approved` for approval_type = `NPL Strategy`

**Inputs:** `loan_id`, `approval_id`

**Connected Tools:** Google Drive API, Anthropic API (Agent 07), Supabase, Airtable

**Responsible Agent:** Agent 07 — Workout, Loss Mitigation & REO

---

**Steps:**

**Step 1 — Fetch Full Loan Context**
- GET `loans` (full record), `property_values` (most recent AVM), `diligence_exceptions` (title, lien), `legal_matters` (any prior), `npl_workouts` (if prior workout exists)

**Step 2 — Fetch Legal Documents from Google Drive**
- List files in `/11 - Foreclosure and Bankruptcy/[LOAN-ID]/` and `/06 - Collateral Files/Active Portfolio/[LOAN-ID]/`
- Download: original note, mortgage/DOT, assignments (for lien position confirmation)

**Step 3 — Invoke Agent 07 Session**
```
POST https://api.anthropic.com/v1/agents/[AGENT_07_ID]/sessions
Input: {
  "content": "Loan ID: [loan_id] | Property: [address, state] | UPB: [upb] | AVM: [value]
Payment Status: [status] | Delinquency: [days] | Classification: NPL
Borrower info: [available — name only, no SSN] | Last contact: [date if any]
Title/lien status: [from property_values and diligence_exceptions]
Prior legal: [from legal_matters if any]
Task: Build NPL workout action plan. Recommend resolution path. Consider state FC timeline, 
AVM value vs. UPB, lien position, borrower responsiveness indicators.
Return: resolution_path, strategy_rationale, borrower_outreach_recommended (boolean), 
next_steps array, legal_filing_recommended (boolean), 
estimated_timeline_months, estimated_recovery_pct."
}
```

**Step 4 — Write NPL Workout Plan to Supabase**
```json
POST /rest/v1/npl_workouts
{
  "workout_id": "WRK-[sequential]",
  "loan_id": "[loan_id]",
  "resolution_path": "[Agent 07 recommendation]",
  "resolution_status": "Active",
  "notes": "[strategy rationale]"
}
```
- PATCH `loans.workout_strategy = [resolution_path]`

**Step 5 — Update Airtable NPL Strategy Tracker**
- Create NPL Strategy Tracker record in Loan Asset Registry base

**Step 6 — If Legal Filing Recommended: Create Separate Approval Queue Item**
- Agent 07 may recommend FC filing — this requires a SEPARATE approval before any filing occurs
```json
POST /rest/v1/approvals
{
  "approval_type": "Legal",
  "item_description": "LEGAL ACTION REQUIRED — Loan [loan_id]. 
Agent 07 recommends [FC/BK relief motion]. State: [state]. 
Estimated timeline: [months]. Estimated recovery: [%] of UPB. 
FC attorney: [recommended or TBD]. APPROVAL REQUIRED before attorney is instructed.",
  "requested_by": "Agent 07",
  "reference_id": "[loan_id]",
  "status": "Pending"
}
```
- Trigger Automation 13 (Approval Queue Notification) with URGENT priority

**Step 7 — If Legal Approved: File Legal Matter and Notify Attorney**
- n8n watches for Legal approval (`approvals.status = Approved` for `approval_type = Legal`)
- On approval:
  - Create `legal_matters` record in Supabase with `current_status = Active`
  - Draft attorney instruction letter (n8n Code node — from template)
  - Save draft to Google Drive `/10 - Legal Files/Loan-Level Legal/[LOAN-ID]/`
  - Create Human Task: "Attorney instruction letter ready for Kerry review and send — [LOAN-ID]"
  - Do NOT send to attorney without Kerry's explicit action — attorney is notified by Kerry directly

**Output:**
- NPL workout plan in `npl_workouts` table
- Airtable NPL Strategy Tracker record
- If legal action recommended: Approval Queue item (separate approval required)
- Attorney instruction letter draft (if legal approved) — Kerry sends manually

**Human Approval Required:** Yes — two gates: (1) NPL strategy initiation (this workflow's trigger), (2) legal filing authorization (separate approval before any attorney instruction). NO borrower contact is initiated by automation — only Kerry can authorize outreach.

**Error Handling:** Agent 07 session fails: create Human Task "Agent 07 NPL session failed — manual workout plan required for [LOAN-ID]"

**Logs Updated:** `agent_tasks`, `agent_logs`, `npl_workouts`, `loans`, `legal_matters` (if legal action approved)

**Security Considerations:** Borrower contact information is accessed by Agent 07 in session input but not returned in output or stored in `npl_workouts`. Only loan-level strategy data is logged. Agent 07 does not initiate any contact with borrowers — this is a firm system-wide rule.

---

## Automation 10: Vendor Follow-Up Reminder

**Purpose:** Daily scan of open vendor issues and upcoming SLA deadlines. Creates structured reminders for Agent 08 and the team. Flags vendors approaching contract expiry or in SLA breach.

**Trigger:** Scheduled — daily at 8:00 AM CT

**Inputs:** Current date; Supabase `vendor_issues` (open), `vendors` (contract expiry), `servicers` (remittance deadlines)

**Connected Tools:** Supabase, Airtable

**Responsible Agent:** Agent 08 (invoked if new open issues require scorecard update)

---

**Steps:**

**Step 1 — Fetch Open Vendor Issues**
- GET `/rest/v1/vendor_issues?status=in.(Open,In Progress)&select=*,vendors(company_name,vendor_type)`
- Filter: `deadline` is not null AND `deadline <= today + 7 days`

**Step 2 — Fetch Expiring Contracts**
- GET `/rest/v1/vendors?status=eq.Active&contract_end=lte.[today + 90 days]`

**Step 3 — Fetch Missing Servicer Reports**
- GET all active servicers where `last_report_date < [expected report date this month]`
- Expected report date: `remittance_day` field on `servicers` table (due by the Nth of each month)

**Step 4 — Create Human Tasks for Issues with Deadline ≤ 7 Days**
- For each issue: create/update Airtable Human Task Queue record
- Priority: Critical issues → URGENT; Major → High; Minor → Normal

**Step 5 — Create Approval Queue for Expiring Contracts**
- For each vendor with contract expiring in ≤ 90 days:
  ```json
  POST /rest/v1/approvals
  { "approval_type": "Vendor Contract", "item_description": "Contract expiring: [vendor] — [type]. 
  Expiry: [date]. Decision needed: renew, renegotiate, or terminate.", ... }
  ```

**Step 6 — Create Human Task for Missing Servicer Reports**
- For each servicer missing their monthly report: create Human Task assigned to Kody

**Step 7 — Update Airtable Vendor Management**
- Refresh `Current SLA Score` and `Open Issues Count` on Vendor Registry records (rollup from Supabase)

**Output:**
- Human Tasks created for upcoming vendor issue deadlines
- Approval Queue items for expiring contracts
- Human Tasks for missing servicer reports

**Human Approval Required:** No — this is a reminder and flagging system. Approvals are required for contract renewal decisions (triggered here but decided in Approval Queue).

**Error Handling:** Supabase query failure: retry 3x; log to `agent_logs` as system-level event; send email alert to Kerry

**Logs Updated:** `agent_tasks` (if Agent 08 scorecard session triggered)

**Security Considerations:** No sensitive data exposed in reminder notifications — only vendor names, issue types, and deadlines.

---

## Automation 11: Investor Question Routing

**Purpose:** When an investor email is received (via Gmail MCP), this automation classifies the inquiry, routes it to Agent 16 for a draft response, and queues the response for Kerry's review and approval before any reply is sent.

**Trigger:** Gmail MCP — new email received from a known investor email address (matched against `investors.email` in Supabase)

**Inputs:** Email sender, subject, body, timestamp

**Connected Tools:** Gmail MCP, Anthropic API (Agent 16), Supabase, Airtable

**Responsible Agent:** Agent 16 — Investor Relations, Sales & Client Service

---

**Steps:**

**Step 1 — Identify Investor**
- GET `/rest/v1/investors?email=eq.[sender_email]&select=investor_id,first_name,last_name,onboarding_status`
- If investor not found: route to Human Task "Unrecognized sender may be investor prospect — review email from [sender]"

**Step 2 — Classify Inquiry**
- n8n Code node: classify based on subject/body keywords:
  - `Capital` / `Contribution` / `Wire` → Category: Capital Transaction
  - `Distribution` / `Payment` / `Return` → Category: Distribution Inquiry
  - `Report` / `Statement` / `K-1` / `Tax` → Category: Reporting
  - `Investment` / `Strategy` / `Portfolio` → Category: Investment Question
  - `Complaint` / `Concern` / `Dissatisfied` → Category: Complaint (URGENT)
  - All others → Category: General

**Step 3 — Log Communication to Supabase**
- PATCH `investors.communication_log` (jsonb append):
  ```json
  { "date": "[today]", "type": "Email Received", "summary": "[subject line]", "agent": "n8n" }
  ```

**Step 4 — Invoke Agent 16 Session (Draft Response)**
```
POST https://api.anthropic.com/v1/agents/[AGENT_16_ID]/sessions
Input: {
  "content": "Investor: [name] (LP-[id]) | Inquiry Category: [category]
Email: Subject: [subject] | Body: [body]
Investor profile: Funded: $[amount] | Balance: $[balance] | Status: [status]
Recent distributions: [from distributions table, last 2]
Task: Draft a professional, warm, accurate response to this investor inquiry. 
Do not include specific financial figures unless confirmed from the data above.
Do not make promises about future returns or distributions.
Return: response_draft (full email text), suggested_subject, requires_human_review_reason."
}
```

**Step 5 — Save Draft Response to Gmail**
- Gmail MCP: create draft reply (not sent)
- Tag draft: `investor-response-pending-review`

**Step 6 — Create Approval Queue Item**
```json
POST /rest/v1/approvals
{
  "approval_type": "Other",
  "item_description": "Investor email response — [investor name] | [category] inquiry. 
Agent 16 response drafted. Review draft in Gmail before sending. 
Complaint flag: [yes/no].",
  "requested_by": "Agent 16",
  "priority": "[URGENT if Complaint; High if Capital Transaction; Normal otherwise]",
  "reference_id": "[investor_id]",
  "status": "Pending"
}
```
- Trigger Automation 13 (Approval Queue Notification)

**Step 7 — On Kerry Approval: Send Email**
- n8n watches for approval confirmation
- On Approved: Gmail MCP sends the draft (or Kerry edits and sends manually)
- On Rejected: Human Task to Kerry "Revise investor response to [investor name] — draft rejected"

**Output:**
- Inquiry logged in investor communication history
- Agent 16 draft response in Gmail drafts
- Approval Queue item for Kerry to review and authorize send

**Human Approval Required:** Yes — every investor response requires Kerry review and approval before sending. No investor communication is sent automatically under any circumstances.

**Error Handling:** Agent 16 session fails: create Human Task "Investor email requires manual response — Agent 16 session failed. Email from: [investor]"

**Logs Updated:** `agent_tasks`, `agent_logs`, `investors.communication_log`

**Security Considerations:**
- Investor email content is not stored in Supabase (only the communication log summary)
- No financial specifics (capital account balance, distribution history) are included in the draft response unless explicitly confirmed from Supabase data and flagged for Kerry review
- Complaint category emails are flagged URGENT and escalated immediately — potential legal/regulatory significance

---

## Automation 12: Compliance Review Routing

**Purpose:** When any agent submits a material to the `compliance_queue` table in Supabase (investor report, pitch deck, DDQ response, marketing material), this automation routes it to Agent 14 for review, stores the result, and creates the approval chain for release.

**Trigger:** Supabase webhook — INSERT on `compliance_reviews` table (any new row)

**Inputs:** `review_id`, `material_name`, `material_type`, `drive_file_id`, `submitted_by`

**Connected Tools:** Google Drive API, Anthropic API (Agent 14), Supabase, Airtable, DocuSign (for distribution)

**Responsible Agent:** Agent 14 — Compliance, Marketing Review & Disclosure

---

**Steps:**

**Step 1 — Fetch Material from Google Drive**
- GET file content using `drive_file_id`
- Download and extract text content (PDF text extraction or document parsing)

**Step 2 — Fetch Compliance Context from Supabase**
- GET prior reviews of same material type (last 4 quarters) to check for pattern issues
- GET current fund metrics referenced in the material (NAV, IRR, distribution history) for accuracy check

**Step 3 — Invoke Agent 14 Session**
```
POST https://api.anthropic.com/v1/agents/[AGENT_14_ID]/sessions
Input: {
  "content": "Material: [material_name] | Type: [material_type] | Submitted by: [agent]
Task: Compliance review of this fund document. Check: accuracy of performance claims, 
proper risk disclosures, no misleading statements, consistency with fund policy, 
compliance with Reg D / accredited investor requirements (for investor materials).
Material content: [extracted text]
Fund data reference: NAV: $[nav] | IRR: [%] | Recent distribution: $[amount] | Date: [date]
Return: review_result (Cleared/Not Cleared/Cleared with Conditions), 
issues_found array (each: issue, severity, resolution_required), 
conditions (if Cleared with Conditions), reviewer_notes."
}
```

**Step 4 — Write Review Result to Supabase**
```json
PATCH /rest/v1/compliance_reviews?review_id=eq.[review_id]
{
  "review_date": "[today]",
  "review_result": "[Agent 14 output]",
  "issues_found": [issues array],
  "conditions": "[conditions if any]",
  "clearance_date": "[today if Cleared]"
}
```

**Step 5 — Branch by Review Result**

*If Cleared:*
- File reviewed document to `/15 - Compliance Reviews/Cleared Materials/[Year]/`
- Update Airtable Compliance Review Queue record: Status = Cleared
- Create Approval Queue item: "Compliance cleared — [material_name]. Ready for CEO/CIO final authorization to distribute."
- Trigger Automation 13 (Approval Queue Notification)

*If Cleared with Conditions:*
- File to `/15 - Compliance Reviews/Cleared Materials/[Year]/` with conditions noted in file name
- Create Approval Queue item with conditions listed — Kerry must acknowledge conditions before release
- Create Human Task for originating agent: "Conditions attached to compliance clearance — revise per conditions before next distribution attempt"

*If Not Cleared:*
- File to `/15 - Compliance Reviews/Not Cleared/[Year]/`
- Create Approval Queue item: "COMPLIANCE ISSUE — [material_name] NOT cleared. Issues: [list]. 
Do not distribute. Material returned to [originating agent] for revision."
- Update Airtable: Status = Not Cleared

**Step 6 — On Final CEO/CIO Approval: Authorize Distribution**
- n8n watches for approval (approval_type = Compliance, status = Approved)
- On approved: update `compliance_reviews.clearance_date`, update `investor_reports.compliance_cleared = true` (if applicable), proceed to distribution workflow

**Output:**
- Compliance review result in Supabase `compliance_reviews`
- Document filed in Google Drive compliance folder
- Approval Queue item for CEO/CIO final authorization
- No material distributed without this approval chain completing

**Human Approval Required:** Yes — even Cleared materials require CEO/CIO final sign-off in Approval Queue before release. The compliance review is Agent 14's recommendation; Kerry's approval is the authorization.

**Error Handling:** Agent 14 session fails: mark `review_result = Failed`, create Human Task "Agent 14 compliance review failed — manual review required for [material_name]"

**Logs Updated:** `agent_tasks`, `agent_logs`, `compliance_reviews`

**Security Considerations:** Materials submitted for compliance review may contain draft investor communications — treated as Confidential during review. Agent 14 session input is in-memory only; not stored externally.

---

## Automation 13: Approval Queue Notification

**Purpose:** Every new `approvals` record triggers an immediate notification to Kerry. This is the central alerting system — every workflow that creates an approval request routes through here.

**Trigger:** Supabase webhook — INSERT on `approvals` table

**Inputs:** `approval_id`, `approval_type`, `item_description`, `amount`, `priority`, `reference_id`

**Connected Tools:** Supabase, Airtable, Gmail (notification email), Telegram (Phase 6)

**Responsible Agent:** Agent 01 (synthesizes approval context for briefings; does not create approvals)

---

**Steps:**

**Step 1 — Fetch Full Approval Record**
- GET `/rest/v1/approvals?approval_id=eq.[approval_id]&select=*`

**Step 2 — Determine Notification Priority**
- URGENT (immediate): approval_type in [Wire, Legal] OR item_description contains "CRITICAL" OR "URGENT"
- High (within 1 hour): approval_type in [LOI, Closing, NPL Strategy, Compliance]
- Normal: all others

**Step 3 — Create Airtable Open Approvals Record**
- POST to Airtable Approval Queue Base / Open Approvals table
- Include all fields: Approval ID, Type, Description, Amount, Priority, Request Date, Expires

**Step 4 — Send Email Notification to Kerry**
```
To: [KERRY_EMAIL]
Subject: [URGENT/Action Required] [Approval Type] — [Item Description short]
Body:
  Approval ID: [id]
  Type: [type]
  Amount: $[amount]
  Description: [item_description]
  Requested by: [requested_by]
  Expires: [expires_at]
  
  Action: Review in Airtable Approval Queue or reply APPROVED / REJECTED (manual route)
```
- URGENT emails: send immediately
- Normal: batch with other notifications (send at next 15-minute interval)

**Step 5 — For URGENT Items: Additional Alert (Phase 6)**
- When Telegram is integrated: send Telegram message to Kerry
- Until then: send a second email marked URGENT

**Step 6 — Log Notification Sent**
- Update `approvals.notes` field: "Notification sent [timestamp]"

**Output:**
- Airtable Approval Queue record created
- Email notification sent to Kerry
- URGENT items get immediate email

**Human Approval Required:** N/A — this automation IS the notification layer for human approval

**Error Handling:**
- Airtable write fails: retry 3x; on final failure, log and send email with full approval details so Kerry can still act
- Gmail send fails: retry 3x; on final failure, log to `agent_logs` and create Human Task

**Logs Updated:** `approvals.notes` (notification timestamp)

**Security Considerations:**
- Email notification body is kept brief — no sensitive financial details in email body for Wire approvals (email text says "Wire approval required — review in Airtable for full details")
- Email is a notification only; the authoritative record is always in Supabase/Airtable

---

## Automation 14: Distribution Checklist Workflow

**Purpose:** Orchestrates the full distribution process — from Kerry's distribution declaration through Agent 11 waterfall calculation, dual wire approval, DocuSign notices, and wire execution authorization. No wire is sent and no investor is contacted without explicit dual approval and DocuSign execution.

**Trigger:** Manual — Kerry creates a distribution declaration in Airtable Approval Queue (or via n8n manual trigger with distribution period and amount inputs)

**Inputs:** `distribution_event_id` (Kerry-assigned), `period`, `total_distribution_amount`, `distribution_date`

**Connected Tools:** Anthropic API (Agent 10, Agent 11), Supabase, Airtable, DocuSign, Gmail

**Responsible Agents:** Agent 10 (NAV confirmation), Agent 11 (waterfall calculation)

---

**Steps:**

**Step 1 — Create Distribution Event Record**
- POST `distributions` event header to Supabase (event-level record)
- Create Approval Queue item: "Distribution declaration — Period: [period] | Proposed Amount: $[amount] | CEO/CIO authorization required to proceed"
- Trigger Automation 13 (Notification)
- HALT — wait for Kerry's primary approval

**Step 2 — [Gated by Kerry Approval] NAV Confirmation**
- n8n watches for approval; on Approved, invoke Agent 10 session:
  ```
  POST https://api.anthropic.com/v1/agents/[AGENT_10_ID]/sessions
  Input: "Confirm NAV as of [distribution_date]. Calculate per-unit NAV. 
  Confirm distributable cash available. Cash available: [from cash_activity balance].
  Investor capital accounts: [from capital_accounts table].
  Return: nav_per_unit, total_distributable_cash, confirmation_status, any_issues."
  ```
- Write NAV confirmation to `nav_history` table
- HALT — Kerry must review NAV before waterfall calculation proceeds

**Step 3 — [Gated by NAV Approval] Waterfall Calculation**
- Create Approval Queue item: "NAV confirmed at $[nav_per_unit] per unit. Authorize waterfall calculation?"
- On Approved, invoke Agent 11 session:
  ```
  POST https://api.anthropic.com/v1/agents/[AGENT_11_ID]/sessions
  Input: "Distribution period: [period]. NAV: [nav_per_unit]. 
  Total distributable cash: $[amount].
  Investor accounts: [all LP capital accounts, committed capital, prior distributions]
  Calculate European waterfall: 1. Fund expenses 2. Mgmt fee (1.5%) 3. Return of LP capital 
  4. 8% preferred return (non-compounding) 5. 80% LP / 20% GP residual.
  Return: per_investor_distribution array (investor_id, total_distribution, waterfall_components),
  total_lp_distribution, gp_carry, fee_total, preferred_return_paid."
  ```

**Step 4 — Write Distribution Records to Supabase**
- For each investor in Agent 11 output:
  ```json
  POST /rest/v1/distributions
  { "distribution_id": "DIST-[period]-[LP-ID]", "distribution_event_id": ...,
    "investor_id": ..., "total_distribution": ..., [waterfall components], "wire_status": "Pending" }
  ```

**Step 5 — Create Wire Authorization (Dual Approval)**
```json
POST /rest/v1/approvals
{
  "approval_type": "Wire",
  "item_description": "WIRE AUTHORIZATION — Distribution [period]. 
Total LP distributions: $[total]. GP carry: $[carry]. Investor count: [n].
DUAL APPROVAL REQUIRED: CEO/CIO + Controller.",
  "amount": [total_wire_amount],
  "reference_id": "[distribution_event_id]",
  "status": "Pending"
}
```
- This approval requires BOTH `approved_by_primary` (Kerry) AND `approved_by_secondary` (Controller) before any wire proceeds
- Trigger Automation 13 (URGENT notification)
- HALT — n8n waits for both approvals

**Step 6 — [Gated by Dual Wire Approval] DocuSign Distribution Notices**
- Only after both primary and secondary approvals confirmed:
- For each investor: trigger DocuSign investor acknowledgment envelope (Automation per DocuSign WF-3)
- Envelope contains: distribution amount, period, payment date, wire expected within [n] days

**Step 7 — Authorization to Wire (Final Gate)**
- Create final Human Task: "Wire authorization confirmed — [n] investor wires totaling $[amount] ready to execute. Wires must be initiated from bank portal manually. Confirmation reference: [approval_id]"
- n8n DOES NOT initiate the actual wire — wires are executed by Kerry or Controller in the bank portal
- n8n only provides the authorization record, amounts, and wire details

**Step 8 — Wire Confirmation Recording**
- After Kerry enters wire confirmation in Airtable: webhook fires
- n8n updates `distributions.wire_status = Confirmed`, `distributions.wire_date = today`
- Updates `cash_activity` table with outflow records
- Updates `capital_accounts` per investor

**Output:**
- Distribution calculated and recorded per investor in Supabase
- Wire authorization approved by two humans before notification sent
- DocuSign notices sent to investors (after dual approval)
- Wire executed manually by Kerry/Controller in bank portal
- Confirmation recorded in Supabase

**Human Approval Required:** Yes — four gates: (1) distribution declaration, (2) NAV confirmation, (3) waterfall approval, (4) dual wire authorization. The actual wire is executed manually — n8n never sends wires.

**Error Handling:**
- Agent 11 calculation produces negative distribution for any LP → halt, Human Task "Negative distribution calculated for [LP-ID] — review capital account balance before proceeding"
- Waterfall total does not balance (LP + GP + fees ≠ total distributable) → halt, log discrepancy, Human Task

**Logs Updated:** `agent_tasks`, `agent_logs` (Agent 10 and 11), `distributions`, `capital_accounts`, `cash_activity`, `approvals`, `nav_history`

**Security Considerations:**
- Wire amounts and investor banking details are never included in email notifications — Airtable and Supabase are the secure reference
- No automation has any connection to banking systems — the firewall between n8n and wire execution is absolute and intentional

---

## Automation 15: Investor Report Draft Workflow

**Purpose:** Quarterly — orchestrates the investor report lifecycle from Agent 17 generation through compliance review, CEO/CIO approval, and investor distribution. All distribution steps gated.

**Trigger:** Scheduled — first business day of the month following quarter-end (Q1: April 1; Q2: July 1; Q3: October 1; Q4: January 1)

**Inputs:** `report_period` (e.g., Q2 2026), `period_start`, `period_end`

**Connected Tools:** Anthropic API (Agent 17, Agent 14), Supabase, Google Drive, Airtable, DocuSign, Gmail

**Responsible Agents:** Agent 17 (report generation), Agent 14 (compliance review)

---

**Steps:**

**Step 1 — Fetch Report Data from Supabase**
- Fund performance: `nav_history` (quarter-end NAV, per-unit), `distributions` (Q distributions, total), `loans` (portfolio summary — loan count, total UPB, classification mix, delinquency rate)
- Risk: `risk_metrics` (quarter-end Green/Amber/Red status per limit)
- Cash: `cash_activity` (Q collections, expenses)
- Investor: `investors` (active LP count, total committed capital, total funded capital)

**Step 2 — Invoke Agent 17 Session (Report Generation)**
```
POST https://api.anthropic.com/v1/agents/[AGENT_17_ID]/sessions
Input: {
  "content": "Report Period: [period] | Period End: [date]
Task: Generate quarterly investor report draft. 
Fund data: [full data package from Step 1]
Report must include: fund overview, quarter performance summary, portfolio highlights, 
distribution summary, portfolio composition, risk status, market commentary, outlook, 
standard disclosures. Match investor_report_template.md format. 
Return: report_text (full report), executive_summary (2-3 paragraphs)."
}
```

**Step 3 — Save Draft to Google Drive**
- POST to `/16 - Investor Reporting/Quarterly Reports/[Period]/`
- File name: `RPT-[period]-Investor-Report-Draft-[date].pdf`

**Step 4 — Create Investor Report Record in Supabase**
```json
POST /rest/v1/investor_reports
{
  "report_id": "RPT-[period]",
  "period": "[period]",
  "period_start": ...,
  "period_end": ...,
  "status": "Draft",
  "generated_date": "[today]",
  "drive_file_id": "[Google Drive file ID]"
}
```

**Step 5 — Trigger Automation 12 (Compliance Review Routing)**
- Submit report to `compliance_reviews` table → Automation 12 handles the Agent 14 review

**Step 6 — [Gated by Compliance Clearance] Create CEO/CIO Approval**
- n8n watches for `compliance_reviews.review_result = Cleared` for this report
- On Cleared: Create Approval Queue item for final CEO/CIO distribution authorization
- HALT — wait for Kerry's approval

**Step 7 — [Gated by CEO/CIO Approval] Export and Distribute**
- On Approved:
  - Update `investor_reports.status = Approved`
  - Trigger Power BI PDF export workflow (n8n HTTP request to Power BI API — generate PDF from investor report layout)
  - Save final PDF to `/16 - Investor Reporting/Quarterly Reports/[Period]/` as `RPT-[period]-Investor-Report-Final-[date].pdf`
  - File copy to `/17 - Data Room/Active LP Data Room/Quarterly Reports/`

**Step 8 — Send to Investors (Gated by Approval)**
- For each active LP (loop through `investors` where `onboarding_status = Active`):
  - Trigger DocuSign investor acknowledgment envelope (WF-3) with report attached OR
  - Gmail: send notification email with Google Drive share link to their LP folder
  - Log to `investors.communication_log`
- Update `investor_reports.distributed_date = today`, `investor_reports.investor_count = [n]`, `investor_reports.status = Distributed`

**Output:**
- Quarterly report generated, compliance reviewed, CEO/CIO approved, and distributed to all active LPs
- All stages gated — no report distributed without Kerry approval

**Human Approval Required:** Yes — two gates: (1) compliance clearance (Agent 14), (2) CEO/CIO final distribution authorization. Distribution step is fully blocked until both are confirmed.

**Error Handling:** Agent 17 generation fails: Human Task "Quarterly investor report generation failed — manual draft required for [period]"; `investor_reports.status = Failed`

**Logs Updated:** `agent_tasks`, `agent_logs`, `compliance_reviews`, `investor_reports`, `investors.communication_log`

**Security Considerations:** Report content is treated as Confidential until distributed. Distribution list is pulled directly from Supabase `investors` table with RLS enforced — no manual email list compilation.

---

## Automation 16: Data Room Update Alert

**Purpose:** When a new document is added to the data room (`data_room_items` INSERT), this automation verifies compliance clearance, notifies authorized investors, and logs access grants.

**Trigger:** Supabase webhook — INSERT on `data_room_items` table

**Inputs:** `item_id`, `document_name`, `document_type`, `access_level`, `drive_file_id`, `authorized_investor_ids`

**Connected Tools:** Supabase, Google Drive API, Airtable, Gmail

**Responsible Agent:** Agent 18 (manages access), Agent 14 (compliance clearance verification)

---

**Steps:**

**Step 1 — Verify Compliance Clearance**
- GET `/rest/v1/compliance_reviews?material_name=eq.[document_name]&review_result=in.(Cleared,Cleared with Conditions)`
- If no clearance record found: HALT, create Human Task "Data room document added without compliance clearance — [document_name]. Review and submit for Agent 14 review before investor access is granted."

**Step 2 — Verify CEO/CIO Approval for Data Room Release**
- GET `approvals` for this `item_id` with `status = Approved`
- If no approval on file: HALT, create Approval Queue item for Kerry to authorize investor access

**Step 3 — [Gated by Approval] Configure Google Drive Sharing**
- If `access_level = All LPs`:
  - GET all active investors: `/rest/v1/investors?onboarding_status=eq.Active&select=email`
  - For each investor: Google Drive API — grant View access to the specific file
- If `access_level = Specific LPs`:
  - Loop through `authorized_investor_ids` array
  - Grant View access per investor email
- Log each access grant to `data_room_access_log` in Supabase

**Step 4 — Notify Investors of New Document**
- For each investor granted access: create Gmail draft notification
- Subject: `Pinnacle Note Fund — New Document Available in Your Data Room`
- Body: Document name, type, brief description, link to Google Drive
- Batch all drafts → create single Approval Queue item: "Approve sending data room update notification to [n] investors"
- HALT — do not send without approval

**Step 5 — [Gated by Notification Approval] Send Emails**
- On Kerry approval: send all batched Gmail drafts

**Step 6 — Update Airtable Data Room**
- Create/update Data Room record in Investor Reporting Base

**Output:**
- Google Drive sharing configured per authorized investors
- Access grants logged to `data_room_access_log`
- Investor notification emails sent (after approval)

**Human Approval Required:** Yes — two gates: (1) data room release authorization, (2) investor notification email send authorization

**Error Handling:** Google Drive sharing API failure: log which investors did not receive access; create Human Task for manual access grant

**Logs Updated:** `data_room_access_log`, `agent_logs`, `data_room_items.published_date`

**Security Considerations:**
- Each investor is granted access only to files they are authorized for — no broad "share to anyone" ever used
- Access log is append-only (RLS enforced on `data_room_access_log`) — audit trail is permanent
- Agent 15 reviews access log vs. authorized investor list in quarterly control test

---

## Automation 17: Risk Limit Breach Alert

**Purpose:** When Agent 13 monthly risk monitoring produces an Amber or Red limit reading, this automation creates immediate alerts, routes to CEO/CIO, and for Red limits, creates a mandatory acknowledgment approval.

**Trigger:** Supabase webhook — INSERT on `risk_metrics` table WHERE `status IN ('Amber', 'Red')`

**Inputs:** `metric_id`, `limit_name`, `current_value`, `limit_value`, `status`, `breach_description`, `measurement_date`

**Connected Tools:** Supabase, Airtable, Gmail

**Responsible Agents:** Agent 13 (produces data), Agent 01 (includes in briefing)

---

**Steps:**

**Step 1 — Fetch Full Metric Context**
- GET full `risk_metrics` record
- GET prior readings for same `limit_name`: trend analysis (was this limit Amber last month too?)

**Step 2 — Determine Alert Severity**
- Red: Mandatory Approval Queue item + URGENT email
- Amber: Warning — Human Task + standard email notification

**Step 3 — Create Airtable Risk Alert**
- Post to Airtable Task Management / Human Task Queue:
  - Priority: URGENT (Red) or High (Amber)
  - Assigned To: Kerry
  - Description: Limit name, current value vs. limit, breach description, prior trend

**Step 4 — For Red Limits: Create Mandatory Approval Queue Item**
```json
POST /rest/v1/approvals
{
  "approval_type": "Other",
  "item_description": "RED RISK LIMIT — [limit_name]. 
Current: [current_value] | Limit: [limit_value] | Breach: [breach_description].
CEO/CIO acknowledgment and action plan required before next trading/acquisition activity.",
  "requested_by": "Agent 13",
  "reference_id": "[metric_id]",
  "status": "Pending"
}
```
- Update `risk_metrics.approval_id` with this approval ID
- Trigger Automation 13 (URGENT notification)

**Step 5 — Send Immediate Email Notification**
- To: Kerry
- Subject: `[RED RISK LIMIT BREACH / AMBER RISK WARNING] — [limit_name] — Pinnacle Note Fund`
- Body: Current vs. limit, date, brief breach description, link to Risk Dashboard in Power BI

**Step 6 — For Red Limits: Pause Relevant Activity**
- Determine which workflows are affected by this limit breach
- Example: Geographic concentration Red → tag any active tape from same state with "RISK HOLD" flag in Airtable
- Create Human Task: "Risk hold applied to [affected tapes/actions] pending CEO/CIO breach resolution"

**Step 7 — Breach Resolution Tracking**
- n8n watches for Kerry's approval (acknowledgment) in Approval Queue
- On acknowledged: update `risk_metrics.breach_resolved = false` (Kerry's plan is documented in Conditions field of approval)
- Next month's Agent 13 session: compare prior Red readings to determine if resolved

**Output:**
- Airtable Human Task with breach details
- Approval Queue item for Red limits (mandatory acknowledgment)
- URGENT email to Kerry
- Activity holds applied for affected workflows

**Human Approval Required:** Yes — Red limit breach requires mandatory CEO/CIO acknowledgment and documented action plan in Approval Queue. Fund does not continue acquisition or distribution activity in the breaching category without acknowledgment.

**Error Handling:** If risk metrics write fails (Agent 13 session data lost): Human Task "Risk metrics for [period] not written — manual review of risk limits required"

**Logs Updated:** `risk_metrics.approval_id`, `agent_logs`

**Security Considerations:** Risk limit data is Internal classification — not disclosed to investors. Alert emails do not include investor-facing language; Kerry uses this to inform what disclosures may be required.

---

## Automation 18: Monthly Executive Brief

**Purpose:** Daily morning briefing + monthly comprehensive brief — Agent 01 synthesizes all open items, agent activity, exceptions, risk status, and upcoming deadlines into a structured briefing for Kerry. This is an informational output — no actions are taken, no approvals granted.

**Trigger:**
- Daily brief: Scheduled — 6:30 AM CT, Monday–Friday
- Monthly brief: Scheduled — first Monday of each month, 6:30 AM CT (extended version)

**Inputs:** Full Supabase state snapshot — open approvals, active agent tasks, exceptions, risk metrics, upcoming deadlines

**Connected Tools:** Supabase, Anthropic API (Agent 01), Airtable, Gmail

**Responsible Agent:** Agent 01 — Chief Operating Coordinator

---

**Steps:**

**Step 1 — Fetch Full Status Snapshot from Supabase**
```sql
-- Open approvals
SELECT * FROM approvals WHERE status = 'Pending' ORDER BY requested_date ASC;

-- Active agent tasks
SELECT * FROM agent_tasks WHERE status IN ('Pending','Running','Awaiting Approval') 
ORDER BY created_at DESC;

-- Failed sessions (last 24 hours)
SELECT * FROM agent_logs WHERE status = 'Failed' AND started_at > now() - interval '24 hours';

-- Critical and Major open exceptions
SELECT * FROM diligence_exceptions WHERE status IN ('Open','In Progress') AND severity IN ('Critical','Major');
SELECT * FROM boarding_exceptions WHERE status IN ('Open','In Progress') AND severity IN ('Critical','Major');

-- Active tapes (not closed/rejected)
SELECT * FROM loan_tapes WHERE status NOT IN ('Closed','Rejected') ORDER BY received_date DESC;

-- NPL active workouts with upcoming legal deadlines (next 14 days)
SELECT * FROM npl_workouts WHERE resolution_status = 'Active' 
  AND next_legal_deadline <= now() + interval '14 days';

-- Red and Amber risk metrics (most recent period)
SELECT DISTINCT ON (limit_name) * FROM risk_metrics 
WHERE status IN ('Red','Amber') ORDER BY limit_name, measurement_date DESC;

-- Upcoming deadlines (all categories, next 14 days)
SELECT * FROM [compliance calendar equivalent in Supabase];
```

**Step 2 — Invoke Agent 01 Session**
```
POST https://api.anthropic.com/v1/agents/[AGENT_01_ID]/sessions
Input: {
  "content": "Brief Type: [Daily/Monthly] | Date: [today] | Time: 6:30 AM CT
Task: Generate CEO/CIO executive brief. 
Open approvals: [count and list] | Active agent tasks: [count and list]
Failed sessions (24h): [list] | Active tapes: [list with status]
Critical exceptions: [list] | Legal deadlines (14 days): [list]
Risk status: [Amber/Red limits] | Upcoming compliance deadlines: [list]
[Monthly only] Add: 30-day fund performance summary, Q-to-date metrics, 
servicer report completeness status, key decisions made this month.
Return: brief_text (structured, no more than 1 page equivalent), 
action_items array (items needing Kerry attention today, prioritized),
items_monitoring array (items in progress, no action needed today)."
}
```

**Step 3 — Format and Deliver Brief**
- n8n Code node: format Agent 01 output into structured email template:
  ```
  Subject: [Daily/Monthly] Brief — [Date] — Pinnacle Note Fund
  
  ACTION REQUIRED TODAY ([n] items):
  [action_items array — numbered, prioritized]
  
  MONITORING ([n] items):
  [items_monitoring array]
  
  SYSTEM HEALTH:
  - Agent sessions yesterday: [count] complete, [count] failed
  - Open approvals: [count]
  - Critical exceptions: [count]
  - Risk limits: [Red count] Red, [Amber count] Amber
  ```
- Send via Gmail to Kerry

**Step 4 — Update Airtable CEO/CIO Command Center**
- Refresh all Interface 1 data pulls (trigger n8n sync of relevant Airtable views)
- Ensures Kerry's first view of Airtable is fully current

**Step 5 — Log Brief Session**
```json
POST /rest/v1/agent_logs
{
  "agent_number": 1,
  "workflow_trigger": "Scheduled-Daily-Brief",
  "status": "Complete",
  "output_summary": "Daily brief delivered. [n] action items. [n] monitoring items."
}
```

**Step 6 — For Monthly Brief: Additional Output**
- Create Google Drive document: `/12 - Fund Admin Reports/Management Reports/[YYYY-QN]-Management-Report-Draft.pdf`
- File monthly brief as management report draft
- Create Human Task: "Monthly management report draft ready for review — [month]"

**Output:**
- Structured email brief delivered to Kerry by 6:30 AM
- Airtable CEO/CIO Command Center refreshed
- Agent 01 session logged
- Monthly: management report draft filed in Google Drive

**Human Approval Required:** No — brief is informational only. Agent 01 does not create approvals or initiate actions. Items identified in the brief that require action are already in the Approval Queue from the automations that created them.

**Error Handling:**
- Agent 01 session fails: send fallback email to Kerry with raw Supabase data counts (no AI synthesis) — Kerry still gets visibility even if session fails
- Supabase query fails for one section: include available sections in brief; note which section failed; send alert to Kody to investigate

**Logs Updated:** `agent_tasks`, `agent_logs`

**Security Considerations:**
- Brief email contains operational summaries only — no investor names, no loan-level borrower PII, no wire amounts
- Brief email is sent to Kerry's email only — not distributed to team
- Email subject line contains no sensitive information (loan IDs, amounts) in case of email interception

---

## n8n Credential Storage Summary

All credentials are environment variables loaded from 1Password at n8n startup. No credential appears in any workflow node — only the variable name reference.

| Variable | Source | Rotation |
|---|---|---|
| `ANTHROPIC_API_KEY` | 1Password: API Keys vault | 180 days |
| `SUPABASE_URL` | 1Password: Fund Operations vault | Static |
| `SUPABASE_N8N_SERVICE_KEY` | 1Password: Fund Operations vault | 90 days |
| `AIRTABLE_API_KEY` | 1Password: Fund Operations vault | 90 days |
| `GOOGLE_DRIVE_SA_KEY` | 1Password: API Keys vault | 90 days |
| `DOCUSIGN_CLIENT_ID` | 1Password: API Keys vault | 180 days |
| `DOCUSIGN_CLIENT_SECRET` | 1Password: API Keys vault | 180 days |
| `DOCUSIGN_ACCOUNT_ID` | 1Password: API Keys vault | Static |
| `AGENT_01_ID` through `AGENT_18_ID` | 1Password: API Keys vault | Static (update if agent recreated) |
| `KERRY_EMAIL` | 1Password: System Credentials | Static |

**Credential Rotation Protocol:** Agent 15 flags overdue rotations in quarterly control test. When rotating: update 1Password first → update n8n environment variable → restart n8n to load new variable → revoke old key → log rotation in Supabase `audit_log`.
