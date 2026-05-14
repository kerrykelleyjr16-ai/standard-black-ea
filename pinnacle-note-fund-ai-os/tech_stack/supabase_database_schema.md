# Supabase Database Schema — The Pinnacle Note Fund AI OS

**Fund:** The Pinnacle Note Fund
**Document:** Complete Database Schema and Build Order
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## Schema Conventions

| Convention | Rule |
|---|---|
| Primary keys | `id uuid DEFAULT gen_random_uuid()` |
| Human IDs | Separate `TEXT UNIQUE NOT NULL` field (e.g., `tape_id`, `loan_id`) |
| Dollar amounts | `numeric(15,2)` |
| Rates / percentages | `numeric(5,4)` — stored as decimal (0.08 = 8%) |
| MOIC | `numeric(5,3)` |
| All strings | `text` |
| Arrays | `text[]` |
| Flexible structured data | `jsonb` |
| All timestamps | `timestamptz DEFAULT now()` |
| Date-only fields | `date` |
| Boolean flags | `boolean DEFAULT false` (or `true` where appropriate) |
| RLS default | Deny-all on every table — explicit grants only |
| Append-only tables | RLS blocks UPDATE and DELETE for all roles |

---

## Table Index

| # | Table | Primary Agent | Dashboard |
|---|---|---|---|
| 1 | `sellers` | Agent 02 | Acquisition Pipeline |
| 2 | `investors` | Agent 16 | Investor Reporting |
| 3 | `vendors` | Agent 08 | NPL/Workout |
| 4 | `servicers` | Agent 08 | Portfolio |
| 5 | `spvs` | Agent 10 | Cash & Liquidity |
| 6 | `loan_tapes` | Agent 02, 18 | Acquisition Pipeline |
| 7 | `loans` | Agent 03, 04, 05 | All |
| 8 | `collateral_documents` | Agent 05, 09 | Underwriting |
| 9 | `property_values` | Agent 03, 04, 18 | Underwriting |
| 10 | `underwriting_reviews` | Agent 03 | Underwriting |
| 11 | `pricing_models` | Agent 04 | Acquisition Pipeline |
| 12 | `diligence_exceptions` | Agent 05 | Underwriting |
| 13 | `boarding_exceptions` | Agent 09 | Underwriting |
| 14 | `npl_workouts` | Agent 07 | NPL/Workout |
| 15 | `legal_matters` | Agent 07 | NPL/Workout |
| 16 | `cash_activity` | Agent 06, 10, 11 | Cash & Liquidity |
| 17 | `distributions` | Agent 11 | Investor Reporting |
| 18 | `capital_accounts` | Agent 10 | Investor Reporting |
| 19 | `approvals` | All (gating) | Executive |
| 20 | `compliance_reviews` | Agent 14 | Investor Reporting |
| 21 | `agent_tasks` | All | Executive |
| 22 | `agent_logs` | All | Executive |
| 23 | `investor_reports` | Agent 17 | Investor Reporting |
| 24 | `data_room_items` | Agent 17, 18 | Investor Reporting |
| 25 | `risk_metrics` | Agent 13 | Risk |

---

## Table Definitions

---

### Table 1: `sellers`

**Purpose:** Registry of note sellers and counterparties. Every tape received traces to a seller here.

**Fields:**
```sql
id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY
seller_id       text        UNIQUE NOT NULL              -- e.g., SEL-001
company_name    text        NOT NULL
primary_contact text
email           text
phone           text
address         text
city            text
state           text
relationship_status text    DEFAULT 'Active'             -- Active, Inactive, Blacklisted
notes           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

**Relationships:**
- Referenced by `loan_tapes.seller_id`

**Indexes:**
```sql
CREATE INDEX idx_sellers_seller_id ON sellers(seller_id);
CREATE INDEX idx_sellers_company_name ON sellers(company_name);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read only
- `powerbi_readonly`: read only

**Agents:** Agent 02 (creates/updates seller records during tape intake)
**Dashboards:** Acquisition Pipeline (seller name on tape records)
**Automations:** Tape intake workflow (WF-01) creates seller record if new seller

---

### Table 2: `investors`

**Purpose:** LP investor registry — CRM data, contribution history, communication log. No SSNs, EINs, full bank account numbers, or wire instructions stored here — those are Restricted classification and stored in DocuSign / 1Password only.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
investor_id         text        UNIQUE NOT NULL              -- e.g., LP-001
first_name          text        NOT NULL
last_name           text        NOT NULL
entity_name         text                                     -- if investing via entity
investor_type       text        NOT NULL                     -- Individual, Trust, LLC, LP
email               text
phone               text
state_of_residence  text
accredited_status   text        DEFAULT 'Verified'           -- Verified, Pending, Not Verified
onboarding_status   text        DEFAULT 'Prospect'           -- Prospect, Onboarding, Active, Inactive
pipeline_stage      text                                     -- Prospect, Soft Commit, Signed, Funded
committed_amount    numeric(15,2)
funded_amount       numeric(15,2)  DEFAULT 0
first_contribution_date date
kyc_aml_cleared     boolean     DEFAULT false
subscription_signed boolean     DEFAULT false
communication_log   jsonb                                    -- array of {date, type, summary, agent}
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- Referenced by `distributions.investor_id`, `capital_accounts.investor_id`, `data_room_access_log.investor_id`

**Indexes:**
```sql
CREATE INDEX idx_investors_investor_id ON investors(investor_id);
CREATE INDEX idx_investors_onboarding_status ON investors(onboarding_status);
CREATE INDEX idx_investors_pipeline_stage ON investors(pipeline_stage);
```

**Access Control:**
- `ceo_cio`: read/write all rows
- `controller`: read all rows; write to financial fields only
- `agent_service`: read/write own records per workflow
- `investor` role: SELECT only — own row WHERE `investor_id = auth.uid()`
- `powerbi_readonly`: read (investor reporting tables)

**Agents:** Agent 16 (CRM updates, communication log), Agent 17 (reporting data pull)
**Dashboards:** Investor Reporting Dashboard
**Automations:** Investor onboarding workflow — subscription agreement → DocuSign → mark `subscription_signed = true`

---

### Table 3: `vendors`

**Purpose:** All third-party vendors — title companies, attorneys, BPO providers, inspectors, other service providers. Servicers are a subset (see `servicers` table for servicer-specific fields).

**Fields:**
```sql
id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY
vendor_id       text        UNIQUE NOT NULL              -- e.g., VND-001
company_name    text        NOT NULL
vendor_type     text        NOT NULL                     -- Servicer, Title, Attorney, BPO, Inspector, Other
primary_contact text
email           text
phone           text
address         text
city            text
state           text
licensed_states text[]                                   -- states where vendor is licensed/active
status          text        DEFAULT 'Active'             -- Active, Probation, Terminated
contract_start  date
contract_end    date
notes           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

**Relationships:**
- Extended by `servicers` (one-to-one via `vendor_id`)
- Referenced by `vendor_scorecards.vendor_id` (future table)

**Indexes:**
```sql
CREATE INDEX idx_vendors_vendor_id ON vendors(vendor_id);
CREATE INDEX idx_vendors_vendor_type ON vendors(vendor_type);
CREATE INDEX idx_vendors_status ON vendors(status);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read only
- `powerbi_readonly`: read only

**Agents:** Agent 08 (scorecard updates, issue logging)
**Dashboards:** NPL/Workout Dashboard (attorney/title vendor performance)
**Automations:** Monthly vendor review cycle (WF-03 component) — Agent 08 reads vendor history, writes scorecard

---

### Table 4: `servicers`

**Purpose:** Servicer-specific profile extending `vendors`. Captures MSA terms, remittance cadence, portal access, and performance baseline. One row per servicer (one-to-one with `vendors`).

**Fields:**
```sql
id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY
vendor_id               text        UNIQUE NOT NULL REFERENCES vendors(vendor_id)
servicer_code           text        UNIQUE NOT NULL              -- short code for reporting (e.g., FCINV)
msa_signed_date         date
remittance_day          int                                      -- day of month remittance is due
reporting_frequency     text        DEFAULT 'Monthly'
portal_url              text
portal_username_vault   text                                     -- 1Password vault entry name (not the credential)
loan_count_current      int         DEFAULT 0
upb_current             numeric(15,2) DEFAULT 0
avg_collection_rate     numeric(5,4)                             -- trailing 3-month average
sla_response_hours      int         DEFAULT 48                   -- SLA: hours to respond to issues
notes                   text
created_at              timestamptz DEFAULT now()
updated_at              timestamptz DEFAULT now()
```

**Relationships:**
- `vendor_id` → `vendors.vendor_id`
- Referenced by `loans.servicer_code`

**Indexes:**
```sql
CREATE INDEX idx_servicers_vendor_id ON servicers(vendor_id);
CREATE INDEX idx_servicers_servicer_code ON servicers(servicer_code);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read only
- `powerbi_readonly`: read only

**Agents:** Agent 06 (reads remittance cadence), Agent 08 (updates performance metrics)
**Dashboards:** Portfolio Dashboard (servicer-level delinquency)
**Automations:** Monthly portfolio cycle — Agent 06 reads `remittance_day` to time servicer report processing

---

### Table 5: `spvs`

**Purpose:** Registry of SPV entities used by the fund. Tracks entity details, formation docs, and which loans belong to each SPV. The fund may acquire loans into multiple SPVs for tax/legal structuring.

**Fields:**
```sql
id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY
spv_id          text        UNIQUE NOT NULL              -- e.g., SPV-001
entity_name     text        NOT NULL
entity_type     text        NOT NULL                     -- LLC, LP, Trust
state_of_formation text
ein             text                                     -- stored here (not investor table); access restricted
formation_date  date
registered_agent text
status          text        DEFAULT 'Active'
notes           text
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

**Relationships:**
- Referenced by `loans.spv_id`, `loan_tapes.acquiring_spv_id`, `capital_accounts.spv_id`, `cash_activity.spv_id`

**Indexes:**
```sql
CREATE INDEX idx_spvs_spv_id ON spvs(spv_id);
CREATE INDEX idx_spvs_status ON spvs(status);
```

**Access Control:**
- `ceo_cio`: read/write (only role with access — EIN is sensitive)
- `controller`: read only
- `agent_service`: read only (no EIN field exposed via RLS — policy excludes column)
- `powerbi_readonly`: read only (no EIN column)

**Agents:** Agent 10 (NAV by SPV), Agent 12 (facility borrowing base by SPV)
**Dashboards:** Cash & Liquidity (fund-level vs. SPV-level view)
**Automations:** NAV confirmation cycle — Agent 10 reads SPV list to calculate per-entity NAV

---

### Table 6: `loan_tapes`

**Purpose:** Log of every tape received — the parent record for all loans in that tape. Tracks the full tape lifecycle from receipt through screening, underwriting, pricing, and bid/no-bid decision.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
tape_id             text        UNIQUE NOT NULL              -- e.g., TAPE-2026-001
seller_id           text        REFERENCES sellers(seller_id)
acquiring_spv_id    text        REFERENCES spvs(spv_id)     -- null until LOI accepted
received_date       date        NOT NULL
loan_count          int
total_upb           numeric(15,2)
asset_mix           text                                     -- e.g., "85% Income / 15% NPL"
status              text        DEFAULT 'Received'           -- Received, Screening, Underwriting, Pricing, LOI Sent, Accepted, Rejected, Closed
go_no_bid           text                                     -- Go, No-Bid, Conditional Go
bid_deadline        date
loi_sent_date       date
loi_accepted_date   date
close_date          date
data_quality_score  numeric(5,2)                             -- 0-100; Agent 18 assigns at normalization
data_quality_flags  text[]                                   -- list of specific quality issues found
normalization_status text       DEFAULT 'Pending'            -- Pending, Complete, Failed
agent_session_id    text                                     -- session that normalized this tape
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `seller_id` → `sellers.seller_id`
- `acquiring_spv_id` → `spvs.spv_id`
- Parent of `loans.tape_id`

**Indexes:**
```sql
CREATE INDEX idx_loan_tapes_tape_id ON loan_tapes(tape_id);
CREATE INDEX idx_loan_tapes_status ON loan_tapes(status);
CREATE INDEX idx_loan_tapes_seller_id ON loan_tapes(seller_id);
CREATE INDEX idx_loan_tapes_received_date ON loan_tapes(received_date);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 02 (creates tape, sets go/no-bid), Agent 18 (normalization fields), Agent 04 (bid fields)
**Dashboards:** Acquisition Pipeline Dashboard (primary), Executive Dashboard (open bids)
**Automations:** WF-01 — file upload to Google Drive triggers tape intake; Agent 18 normalizes; Agent 02 screens; Agent 04 prices; approval queue item created when bid recommendation ready

---

### Table 7: `loans`

**Purpose:** Core loan registry — one row per individual note. The central table in the database. Every operational workflow ultimately reads or writes to `loans`.

**Fields:**
```sql
id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY
loan_id                 text        UNIQUE NOT NULL              -- e.g., LOAN-2026-00001
tape_id                 text        NOT NULL REFERENCES loan_tapes(tape_id)
seller_id               text        REFERENCES sellers(seller_id)
servicer_code           text        REFERENCES servicers(servicer_code)
spv_id                  text        REFERENCES spvs(spv_id)

-- Property
property_address        text
property_city           text
property_state          text
property_zip            text
property_type           text                                     -- SFR, Condo, MFR, Commercial
lien_position           int         NOT NULL                     -- 1 = first lien (only acceptable position per buy box)

-- Loan Terms
original_note_date      date
original_upb            numeric(15,2)
current_upb             numeric(15,2)
interest_rate           numeric(5,4)
maturity_date           date
loan_type               text                                     -- Fixed, ARM
amortization_type       text                                     -- Fully Amortizing, IO, Balloon

-- Performance
payment_status          text        DEFAULT 'Unknown'            -- Current, 30, 60, 90, 120+, Bankruptcy, REO, Paid Off
last_payment_date       date
months_paid_last_12     int                                      -- count of payments in trailing 12 months
delinquency_days        int         DEFAULT 0

-- Classification
loan_classification     text        DEFAULT 'Unclassified'       -- Income, NPL, REO
workout_strategy        text                                     -- Reinstatement, Modification, DIL, Short Sale, Foreclosure, REO Sale
resolution_status       text                                     -- Active, Resolved, Paid Off

-- Fund Status
acquisition_status      text        DEFAULT 'Prospect'           -- Prospect, Diligence, Boarding, Active, Resolved
boarding_date           date
purchase_price          numeric(15,2)
purchase_price_pct_upb  numeric(5,4)                             -- cents on dollar
settled_upb             numeric(15,2)                            -- UPB at closing

-- Underwriting Scores (populated by Agent 03)
health_score            numeric(5,2)                             -- 0-100
uw_classification       text                                     -- Income, Borderline, NPL
uw_flags                text[]                                   -- list of underwriting flags
closing_ready           boolean     DEFAULT false

-- QA / Boarding
qa_status               text                                     -- Pending, Cleared, Held
boarding_qa_date        date

created_at              timestamptz DEFAULT now()
updated_at              timestamptz DEFAULT now()
```

**Relationships:**
- `tape_id` → `loan_tapes.tape_id`
- `seller_id` → `sellers.seller_id`
- `servicer_code` → `servicers.servicer_code`
- `spv_id` → `spvs.spv_id`
- Parent of: `collateral_documents`, `property_values`, `underwriting_reviews`, `pricing_models`, `diligence_exceptions`, `boarding_exceptions`, `npl_workouts`, `legal_matters`, `cash_activity` (nullable)

**Indexes:**
```sql
CREATE INDEX idx_loans_loan_id ON loans(loan_id);
CREATE INDEX idx_loans_tape_id ON loans(tape_id);
CREATE INDEX idx_loans_payment_status ON loans(payment_status);
CREATE INDEX idx_loans_loan_classification ON loans(loan_classification);
CREATE INDEX idx_loans_acquisition_status ON loans(acquisition_status);
CREATE INDEX idx_loans_property_state ON loans(property_state);
CREATE INDEX idx_loans_spv_id ON loans(spv_id);
CREATE INDEX idx_loans_servicer_code ON loans(servicer_code);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `controller`: read only
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 03 (health scores), Agent 04 (pricing reads UPB/LTV), Agent 05 (closing_ready), Agent 06 (payment_status, delinquency), Agent 07 (workout_strategy, resolution_status), Agent 09 (qa_status), Agent 10 (NAV — reads current_upb, purchase_price), Agent 12 (facility — reads current_upb, spv_id), Agent 13 (risk — concentration, state, classification)
**Dashboards:** All 8 dashboards read from `loans` in some form
**Automations:** Every workflow reads or writes `loans`. Central node for tape intake, diligence, closing, monthly portfolio, NPL resolution, NAV, and risk cycles.

---

### Table 8: `collateral_documents`

**Purpose:** Document inventory per loan — tracks what collateral documents exist, where they are, their condition, and whether they satisfy diligence requirements. Agent 05 populates; Agent 09 uses for boarding QA.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
doc_id              text        UNIQUE NOT NULL              -- e.g., DOC-00001
loan_id             text        NOT NULL REFERENCES loans(loan_id)
document_type       text        NOT NULL                     -- Original Note, Allonge, Assignment, Mortgage/DOT, Title Report, Title Policy, Survey, Insurance, Closing Statement, Other
document_status     text        NOT NULL                     -- Received, Missing, Defective, Waived
condition           text                                     -- Original, Copy, Certified Copy
custodian           text                                     -- who holds original (servicer, vault, attorney)
drive_file_id       text                                     -- Google Drive file ID
drive_path          text                                     -- full folder path in Google Drive
received_date       date
reviewed_date       date
reviewed_by         text                                     -- agent_id or human name
defect_description  text                                     -- if status = Defective
cure_required       boolean     DEFAULT false
cure_deadline       date
cure_status         text                                     -- Open, Cured, Waived
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`

**Indexes:**
```sql
CREATE INDEX idx_collateral_docs_loan_id ON collateral_documents(loan_id);
CREATE INDEX idx_collateral_docs_doc_type ON collateral_documents(document_type);
CREATE INDEX idx_collateral_docs_status ON collateral_documents(document_status);
CREATE INDEX idx_collateral_docs_cure_status ON collateral_documents(cure_status) WHERE cure_required = true;
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 05 (primary — creates document inventory, flags defects, sets cure requirements), Agent 09 (reads for boarding QA — confirms all required docs received before clearing loan)
**Dashboards:** Underwriting Dashboard (doc completeness metrics)
**Automations:** Diligence workflow (WF-02) — Agent 05 processes collateral package from Google Drive, creates one row per document type per loan

---

### Table 9: `property_values`

**Purpose:** AVM, BPO, and appraisal history per property. Supports underwriting, pricing, risk monitoring, and NPL strategy. One row per valuation event — `is_current = true` on the most recent valuation per loan.

**Fields:**
```sql
id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY
valuation_id    text        UNIQUE NOT NULL              -- e.g., VAL-00001
loan_id         text        NOT NULL REFERENCES loans(loan_id)
valuation_type  text        NOT NULL                     -- AVM, BPO, Appraisal, Tax Assessment
source          text        NOT NULL                     -- PropStream, HouseCanary, ATTOM, Internal, Appraiser Name
as_of_date      date        NOT NULL
property_value  numeric(15,2) NOT NULL
confidence_score numeric(5,4)                            -- AVM confidence (0.00–1.00)
value_low       numeric(15,2)                            -- AVM range low
value_high      numeric(15,2)                            -- AVM range high
avm_forecast_12m numeric(5,4)                            -- HPA forecast (HouseCanary — Phase 6)
tax_assessment  numeric(15,2)
tax_year        int
tax_status      text                                     -- Current, Delinquent, Unknown
tax_delinquency_amount numeric(15,2)
last_sale_date  date
last_sale_price numeric(15,2)
ownership_name  text
lien_count      int
lien_total_est  numeric(15,2)
foreclosure_status text                                  -- None, Active, Completed
foreclosure_date date
is_current      boolean     DEFAULT false                -- true = most recent valuation for this loan
pulled_at       timestamptz DEFAULT now()
created_at      timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`

**Indexes:**
```sql
CREATE INDEX idx_property_values_loan_id ON property_values(loan_id);
CREATE INDEX idx_property_values_is_current ON property_values(loan_id, is_current) WHERE is_current = true;
CREATE INDEX idx_property_values_source ON property_values(source);
CREATE INDEX idx_property_values_as_of_date ON property_values(as_of_date);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 03 (reads AVM for LTV/ITV calculation), Agent 04 (reads AVM for pricing IRR model), Agent 05 (reads tax status and lien data for diligence), Agent 07 (reads value for NPL exit strategy), Agent 13 (reads current values for portfolio LTV concentration), Agent 18 (writes PropStream data during tape normalization)
**Dashboards:** Underwriting (LTV), Risk (concentration), NPL/Workout (exit value)
**Automations:** WF-01 (PropStream pull per loan after normalization); monthly portfolio refresh (property values updated for active portfolio loans); Phase 6: HouseCanary supplements PropStream

---

### Table 10: `underwriting_reviews`

**Purpose:** UW results per loan. Supports multiple review versions over time (pre-bid, post-LOI, re-UW on modification). Each row is one UW event — most recent is the operative review.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
review_id           text        UNIQUE NOT NULL              -- e.g., UW-00001
loan_id             text        NOT NULL REFERENCES loans(loan_id)
tape_id             text        REFERENCES loan_tapes(tape_id)
review_type         text        NOT NULL                     -- Pre-Bid, Post-LOI, Re-UW, Re-Appraisal
review_date         date        NOT NULL
agent_session_id    text                                     -- agent session that produced this review

-- Valuation Inputs
avm_value           numeric(15,2)
avm_source          text
current_upb         numeric(15,2)
calculated_ltv      numeric(5,4)                             -- current_upb / avm_value
calculated_itv      numeric(5,4)                             -- purchase_price / avm_value (populated post-bid)

-- Performance Inputs
payment_history_12m text                                     -- e.g., "9 of 12 paid"
months_paid_12      int
delinquency_days    int
bankruptcy_status   boolean DEFAULT false
foreclosure_status  boolean DEFAULT false

-- Outputs
health_score        numeric(5,2)                             -- 0-100; Agent 03 assigns
classification      text        NOT NULL                     -- Income, Borderline, NPL
missing_data_fields text[]                                   -- list of fields Agent 03 could not populate
uw_flags            text[]                                   -- list of risk flags raised
underwriter_notes   text
recommendation      text                                     -- Approve, Conditional, Decline
created_at          timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`
- `tape_id` → `loan_tapes.tape_id`

**Indexes:**
```sql
CREATE INDEX idx_uw_reviews_loan_id ON underwriting_reviews(loan_id);
CREATE INDEX idx_uw_reviews_tape_id ON underwriting_reviews(tape_id);
CREATE INDEX idx_uw_reviews_classification ON underwriting_reviews(classification);
CREATE INDEX idx_uw_reviews_review_date ON underwriting_reviews(review_date);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 03 (primary writer — one row per UW session)
**Dashboards:** Underwriting Dashboard (health scores, classification distribution, UW flag summary)
**Automations:** Tape intake workflow — Agent 03 runs after Agent 02 assigns tape to underwriting queue; writes one `underwriting_reviews` row per loan

---

### Table 11: `pricing_models`

**Purpose:** Pricing model outputs per tape — 3 scenarios (base, upside, downside) with IRR, MOIC, bid prices. One row per pricing session (Agent 04). Supports LOI bid price and IC memo.

**Fields:**
```sql
id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY
pricing_id              text        UNIQUE NOT NULL              -- e.g., PRICE-00001
tape_id                 text        NOT NULL REFERENCES loan_tapes(tape_id)
agent_session_id        text
pricing_date            date        NOT NULL

-- Portfolio-Level Inputs
tape_total_upb          numeric(15,2)
tape_loan_count         int
avg_health_score        numeric(5,2)
avg_ltv                 numeric(5,4)
income_pct              numeric(5,4)
npl_pct                 numeric(5,4)

-- Scenarios
base_irr                numeric(5,4)
base_moic               numeric(5,3)
base_bid_pct            numeric(5,4)                             -- % of UPB
base_bid_amount         numeric(15,2)

upside_irr              numeric(5,4)
upside_moic             numeric(5,3)
upside_bid_pct          numeric(5,4)
upside_bid_amount       numeric(15,2)

downside_irr            numeric(5,4)
downside_moic           numeric(5,3)
downside_bid_pct        numeric(5,4)
downside_bid_amount     numeric(15,2)

-- Recommendation
recommended_bid         numeric(15,2)
max_bid                 numeric(15,2)
walk_price              numeric(15,2)
key_risks               text[]
assumptions             text
notes                   text
created_at              timestamptz DEFAULT now()
```

**Relationships:**
- `tape_id` → `loan_tapes.tape_id`

**Indexes:**
```sql
CREATE INDEX idx_pricing_models_tape_id ON pricing_models(tape_id);
CREATE INDEX idx_pricing_models_pricing_date ON pricing_models(pricing_date);
```

**Access Control:**
- `ceo_cio`: read/write
- `operations`: read only
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 04 (primary writer), Agent 01 (reads for IC memo assembly)
**Dashboards:** Acquisition Pipeline (bid recommendation), Executive Dashboard (active bids)
**Automations:** WF-01 — Agent 04 runs after Agent 03 completes UW for tape; pricing model drives LOI approval request in `approvals`

---

### Table 12: `diligence_exceptions`

**Purpose:** Pre-closing exceptions found during full diligence by Agent 05. Each exception is logged with severity, required resolution, owner, deadline, and financial/legal impact.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
exception_id        text        UNIQUE NOT NULL              -- e.g., EXC-D-00001
loan_id             text        NOT NULL REFERENCES loans(loan_id)
tape_id             text        REFERENCES loan_tapes(tape_id)
agent_session_id    text

exception_type      text        NOT NULL                     -- Title, Lien, Document, Property, Payment, Legal, Other
severity            text        NOT NULL                     -- Critical, Major, Minor
description         text        NOT NULL
financial_impact    numeric(15,2)                            -- estimated dollar exposure
legal_impact        text                                     -- description of legal risk
required_resolution text        NOT NULL
owner               text                                     -- who is responsible: Seller, Attorney, Title Co, Fund
deadline            date
status              text        DEFAULT 'Open'               -- Open, In Progress, Resolved, Waived, Seller Resolved
resolution_notes    text
resolved_date       date
blocks_closing      boolean     DEFAULT false
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`
- `tape_id` → `loan_tapes.tape_id`

**Indexes:**
```sql
CREATE INDEX idx_diligence_exc_loan_id ON diligence_exceptions(loan_id);
CREATE INDEX idx_diligence_exc_tape_id ON diligence_exceptions(tape_id);
CREATE INDEX idx_diligence_exc_severity ON diligence_exceptions(severity);
CREATE INDEX idx_diligence_exc_status ON diligence_exceptions(status);
CREATE INDEX idx_diligence_exc_blocks_closing ON diligence_exceptions(blocks_closing) WHERE blocks_closing = true;
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 05 (primary writer — creates exceptions during diligence review), Agent 01 (reads open Critical/Major exceptions for CEO/CIO briefing)
**Dashboards:** Underwriting Dashboard (exception count, severity breakdown), Executive Dashboard (open critical exceptions)
**Automations:** WF-02 (diligence workflow) — Agent 05 writes exceptions; n8n creates Airtable record for each Critical/Major; approval gate before closing if `blocks_closing = true`

---

### Table 13: `boarding_exceptions`

**Purpose:** Post-closing QA exceptions found during loan boarding by Agent 09. Separate from diligence exceptions — these arise after purchase, during boarding QA check. Tracks QA clearance per loan.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
exception_id        text        UNIQUE NOT NULL              -- e.g., EXC-B-00001
loan_id             text        NOT NULL REFERENCES loans(loan_id)
agent_session_id    text

exception_type      text        NOT NULL                     -- Document, Data, Servicer, Payment, Other
severity            text        NOT NULL                     -- Critical, Major, Minor
description         text        NOT NULL
required_resolution text        NOT NULL
owner               text                                     -- Servicer, Seller, Attorney, Fund
deadline            date
status              text        DEFAULT 'Open'               -- Open, In Progress, Resolved, Waived
resolution_notes    text
resolved_date       date
blocks_boarding     boolean     DEFAULT false
qa_cleared          boolean     DEFAULT false
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`

**Indexes:**
```sql
CREATE INDEX idx_boarding_exc_loan_id ON boarding_exceptions(loan_id);
CREATE INDEX idx_boarding_exc_status ON boarding_exceptions(status);
CREATE INDEX idx_boarding_exc_blocks_boarding ON boarding_exceptions(blocks_boarding) WHERE blocks_boarding = true;
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 09 (primary — runs QA after wire confirmation; writes exceptions; sets `qa_cleared`)
**Dashboards:** Underwriting Dashboard (boarding QA pass rate)
**Automations:** WF-02 (post-closing boarding) — triggered after wire confirmation; Agent 09 runs QA; if exceptions exist, holds loan at `acquisition_status = Boarding` until resolved

---

### Table 14: `npl_workouts`

**Purpose:** NPL action plans and resolution tracking from Agent 07. One active workout record per loan in workout status. Tracks resolution path, legal milestones, modification terms, and resolution outcome.

**Fields:**
```sql
id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY
workout_id              text        UNIQUE NOT NULL              -- e.g., WRK-00001
loan_id                 text        NOT NULL REFERENCES loans(loan_id)
agent_session_id        text

-- Strategy
resolution_path         text        NOT NULL                     -- Reinstatement, Modification, DIL, Short Sale, Foreclosure, REO Sale
strategy_approved_date  date
approved_by             text

-- Borrower Outreach
borrower_contact_date   date
borrower_response       text                                     -- Responsive, Unresponsive, Hostile, Cooperative
hardship_claim          boolean DEFAULT false
hardship_type           text

-- Modification Terms (if applicable)
mod_type                text                                     -- Rate Reduction, Term Extension, Principal Deferral, Capitalization, Combination
mod_new_rate            numeric(5,4)
mod_new_term_months     int
mod_new_payment         numeric(15,2)
mod_trial_period_months int
mod_final_status        text                                     -- Pending, Trial, Permanent, Failed

-- Legal / Foreclosure (if applicable)
foreclosure_filed_date  date
foreclosure_state       text
estimated_fc_completion date
fc_attorney             text
current_legal_milestone text
next_legal_deadline     date

-- REO (if property acquired)
reo_acquired_date       date
reo_list_price          numeric(15,2)
reo_list_date           date
reo_sale_price          numeric(15,2)
reo_sale_date           date
reo_net_proceeds        numeric(15,2)

-- Resolution
resolution_status       text        DEFAULT 'Active'             -- Active, Resolved
resolution_outcome      text                                     -- Reinstatement, Modification, DIL, Short Sale, FC Sale, REO Sale, Payoff
resolution_date         date
loss_severity           numeric(5,4)                             -- actual loss / UPB
notes                   text
created_at              timestamptz DEFAULT now()
updated_at              timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`

**Indexes:**
```sql
CREATE INDEX idx_npl_workouts_loan_id ON npl_workouts(loan_id);
CREATE INDEX idx_npl_workouts_resolution_path ON npl_workouts(resolution_path);
CREATE INDEX idx_npl_workouts_resolution_status ON npl_workouts(resolution_status);
CREATE INDEX idx_npl_workouts_next_legal_deadline ON npl_workouts(next_legal_deadline);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 07 (primary — creates and updates workout plans), Agent 13 (reads for NPL concentration and loss severity stress testing)
**Dashboards:** NPL/Workout Dashboard (primary — strategy mix, legal milestones, resolution timeline)
**Automations:** WF-04 (NPL resolution workflow) — triggered when loan moves to 60+ delinquent; Agent 07 creates workout plan; approval required before legal filing begins

---

### Table 15: `legal_matters`

**Purpose:** Formal legal proceedings per loan — foreclosure cases, bankruptcy filings, litigation. Tracks filing dates, court info, attorney, milestones, and outcome. Complements `npl_workouts` with granular legal detail.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
matter_id           text        UNIQUE NOT NULL              -- e.g., LGL-00001
loan_id             text        NOT NULL REFERENCES loans(loan_id)
workout_id          text        REFERENCES npl_workouts(workout_id)

matter_type         text        NOT NULL                     -- Foreclosure, Bankruptcy, Litigation, Quiet Title, Other
filing_date         date
court               text
case_number         text
jurisdiction_state  text
attorney_vendor_id  text        REFERENCES vendors(vendor_id)

-- Bankruptcy Specifics
bk_chapter          text                                     -- 7, 11, 13
bk_filed_date       date
bk_341_date         date
bk_plan_confirmed   boolean DEFAULT false
bk_discharged_date  date
bk_dismissed_date   date
bk_relief_granted   boolean DEFAULT false

-- Foreclosure Milestones
fc_complaint_filed  date
fc_service_date     date
fc_lis_pendens_date date
fc_judgment_date    date
fc_sale_date        date
fc_redemption_deadline date

-- Status
current_status      text        DEFAULT 'Active'             -- Active, Stayed, Dismissed, Completed
current_milestone   text
next_deadline       date
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `loan_id` → `loans.loan_id`
- `workout_id` → `npl_workouts.workout_id`
- `attorney_vendor_id` → `vendors.vendor_id`

**Indexes:**
```sql
CREATE INDEX idx_legal_matters_loan_id ON legal_matters(loan_id);
CREATE INDEX idx_legal_matters_matter_type ON legal_matters(matter_type);
CREATE INDEX idx_legal_matters_next_deadline ON legal_matters(next_deadline);
CREATE INDEX idx_legal_matters_current_status ON legal_matters(current_status);
```

**Access Control:**
- `ceo_cio`, `operations`: read/write
- `agent_service`: read/write
- `powerbi_readonly`: read only

**Agents:** Agent 07 (creates and tracks legal matters), Agent 01 (reads upcoming deadlines for daily briefing)
**Dashboards:** NPL/Workout Dashboard (legal pipeline, upcoming deadlines)
**Automations:** WF-04 — Agent 07 creates `legal_matters` record when foreclosure or bankruptcy filing initiated; n8n alerts Kerry when `next_deadline` is within 7 days

---

### Table 16: `cash_activity`

**Purpose:** All cash movements in and out of the fund — servicer remittances, acquisition wires, distributions, expenses, facility draws/paydowns, and other fund cash events. Every dollar that moves through the fund is a row here. Positive = inflow, negative = outflow.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
transaction_id      text        UNIQUE NOT NULL              -- e.g., CASH-2026-00001
spv_id              text        REFERENCES spvs(spv_id)
loan_id             text        REFERENCES loans(loan_id)    -- null for fund-level items (facility, expense)
investor_id         text        REFERENCES investors(investor_id) -- null unless investor transaction

transaction_date    date        NOT NULL
posting_date        date
category            text        NOT NULL                     -- Remittance, Acquisition, Distribution, Expense, Facility Draw, Facility Paydown, Capital Call, Other
subcategory         text                                     -- Principal, Interest, Escrow, Late Fee, etc. (for Remittance)
amount              numeric(15,2) NOT NULL                   -- positive = inflow, negative = outflow
description         text
servicer_code       text        REFERENCES servicers(servicer_code)
reference_number    text                                     -- wire reference, check number, etc.
source_document     text                                     -- Google Drive file ID of source remittance report
approval_id         text        REFERENCES approvals(approval_id) -- required for distributions, acquisitions
reconciled          boolean     DEFAULT false
reconciled_date     date
notes               text
created_at          timestamptz DEFAULT now()
```

**Relationships:**
- `spv_id` → `spvs.spv_id`
- `loan_id` → `loans.loan_id`
- `investor_id` → `investors.investor_id`
- `servicer_code` → `servicers.servicer_code`
- `approval_id` → `approvals.approval_id`

**Indexes:**
```sql
CREATE INDEX idx_cash_activity_transaction_date ON cash_activity(transaction_date);
CREATE INDEX idx_cash_activity_spv_id ON cash_activity(spv_id);
CREATE INDEX idx_cash_activity_loan_id ON cash_activity(loan_id) WHERE loan_id IS NOT NULL;
CREATE INDEX idx_cash_activity_category ON cash_activity(category);
CREATE INDEX idx_cash_activity_reconciled ON cash_activity(reconciled) WHERE reconciled = false;
```

**Access Control:**
- `ceo_cio`: read/write
- `controller`: read/write
- `operations`: read only
- `agent_service`: read only (agents do not write cash transactions directly — human or n8n_service only)
- `n8n_service`: read/write (imports remittance data)
- `powerbi_readonly`: read only

**Agents:** Agent 06 (reads remittance to reconcile expected vs. actual), Agent 10 (reads all categories for NAV and financial statements), Agent 11 (reads for cash position; writes distribution records via `distributions` not directly here), Agent 12 (reads facility draws/paydowns)
**Dashboards:** Cash & Liquidity Dashboard (primary), Portfolio Dashboard (collections by loan)
**Automations:** WF-03 (monthly portfolio) — servicer remittance reports uploaded to Google Drive → n8n extracts line items → writes to `cash_activity`

---

### Table 17: `distributions`

**Purpose:** Per-investor distribution records with full waterfall components. Each row is one LP's portion of one distribution event. Waterfall components (preferred return, return of capital, carried interest) are tracked separately.

**Fields:**
```sql
id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY
distribution_id         text        UNIQUE NOT NULL              -- e.g., DIST-2026-Q1-LP001
distribution_event_id   text        NOT NULL                     -- groups all LP rows for one distribution event
investor_id             text        NOT NULL REFERENCES investors(investor_id)
spv_id                  text        REFERENCES spvs(spv_id)
approval_id             text        NOT NULL REFERENCES approvals(approval_id)

-- Date and Period
distribution_date       date        NOT NULL
period_start            date
period_end              date

-- Capital Account Basis
capital_account_balance numeric(15,2) NOT NULL                   -- balance before this distribution
committed_capital       numeric(15,2) NOT NULL

-- Waterfall Components (European waterfall)
expenses_share          numeric(15,2) DEFAULT 0                  -- fund expenses allocated to this LP
mgmt_fee_share          numeric(15,2) DEFAULT 0                  -- 1.5% annual management fee
preferred_return_paid   numeric(15,2) DEFAULT 0                  -- 8% preferred return
return_of_capital       numeric(15,2) DEFAULT 0                  -- return of LP principal
residual_lp_share       numeric(15,2) DEFAULT 0                  -- 80% of residual to LP
total_distribution      numeric(15,2) NOT NULL

-- Wire Info
wire_status             text        DEFAULT 'Pending'            -- Pending, Confirmed, Failed
wire_date               date
wire_reference          text
wire_checklist_complete boolean     DEFAULT false

-- Verification
distribution_notice_sent boolean    DEFAULT false
tax_document_prepared   boolean     DEFAULT false
notes                   text
created_at              timestamptz DEFAULT now()
updated_at              timestamptz DEFAULT now()
```

**Relationships:**
- `investor_id` → `investors.investor_id`
- `spv_id` → `spvs.spv_id`
- `approval_id` → `approvals.approval_id`

**Indexes:**
```sql
CREATE INDEX idx_distributions_investor_id ON distributions(investor_id);
CREATE INDEX idx_distributions_event_id ON distributions(distribution_event_id);
CREATE INDEX idx_distributions_distribution_date ON distributions(distribution_date);
CREATE INDEX idx_distributions_wire_status ON distributions(wire_status);
```

**Access Control:**
- `ceo_cio`, `controller`: read/write
- `agent_service`: read/write (Agent 11 calculates and writes)
- `investor` role: SELECT own rows only WHERE `investor_id = auth.uid()`
- `powerbi_readonly`: read only

**Agents:** Agent 11 (primary — calculates waterfall, writes one row per investor per distribution event), Agent 17 (reads for investor reports — distributions history per LP)
**Dashboards:** Investor Reporting Dashboard (distributions by investor, by period), Cash & Liquidity (total outflow)
**Automations:** WF-06 (distribution workflow) — CEO/CIO declares distribution → Agent 11 calculates → approval required → DocuSign notice → wire execution

---

### Table 18: `capital_accounts`

**Purpose:** LP capital account ledger — running balance per investor, per SPV. Tracks contributions, distributions, and current balance. Updated monthly as part of NAV cycle. One row per investor per SPV (or one row per investor for fund-level accounting).

**Fields:**
```sql
id                          uuid        DEFAULT gen_random_uuid() PRIMARY KEY
account_id                  text        UNIQUE NOT NULL              -- e.g., CAP-LP001-SPV001
investor_id                 text        NOT NULL REFERENCES investors(investor_id)
spv_id                      text        NOT NULL REFERENCES spvs(spv_id)

-- Capital Tracking
committed_capital           numeric(15,2) NOT NULL
contributed_capital         numeric(15,2) DEFAULT 0
unfunded_commitment         numeric(15,2) DEFAULT 0                  -- committed - contributed
total_distributions_received numeric(15,2) DEFAULT 0
preferred_return_paid_to_date numeric(15,2) DEFAULT 0
return_of_capital_paid      numeric(15,2) DEFAULT 0
current_balance             numeric(15,2) DEFAULT 0                  -- contributed - distributions

-- Performance
current_irr                 numeric(5,4)
current_moic                numeric(5,3)
preferred_return_accrued    numeric(15,2) DEFAULT 0                  -- 8% unpaid accrual
preferred_return_satisfied  boolean DEFAULT false

-- Period
last_updated_date           date
last_nav_date               date
created_at                  timestamptz DEFAULT now()
updated_at                  timestamptz DEFAULT now()
```

**Relationships:**
- `investor_id` → `investors.investor_id`
- `spv_id` → `spvs.spv_id`

**Indexes:**
```sql
CREATE INDEX idx_capital_accounts_investor_id ON capital_accounts(investor_id);
CREATE INDEX idx_capital_accounts_spv_id ON capital_accounts(spv_id);
CREATE UNIQUE INDEX idx_capital_accounts_investor_spv ON capital_accounts(investor_id, spv_id);
```

**Access Control:**
- `ceo_cio`, `controller`: read/write
- `agent_service`: write (Agent 10 updates monthly)
- `investor` role: SELECT own row only WHERE `investor_id = auth.uid()`
- `powerbi_readonly`: read only

**Agents:** Agent 10 (primary — updates capital accounts monthly during NAV cycle), Agent 11 (reads balance before distribution calculation), Agent 17 (reads for quarterly investor reports)
**Dashboards:** Investor Reporting Dashboard (per-LP balance, IRR, MOIC)
**Automations:** WF-03 (monthly portfolio) — NAV confirmation by Agent 10 triggers capital account updates; preferred return accrual calculated monthly

---

### Table 19: `approvals`

**Purpose:** Human approval audit trail — every consequential decision requiring CEO/CIO (or dual) authorization is logged here before downstream execution. The most referenced gating table in the system. No agent or automation executes a consequential action without a corresponding `approved` record here.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
approval_id         text        UNIQUE NOT NULL              -- e.g., APR-00001
approval_type       text        NOT NULL                     -- LOI, Closing, Wire, Distribution, Investment, Compliance, Legal, Vendor Contract, Other
item_description    text        NOT NULL
requested_by        text        NOT NULL                     -- agent_id or human name
requested_date      timestamptz NOT NULL
amount              numeric(15,2)                            -- dollar amount if applicable
reference_id        text                                     -- loan_id, tape_id, investor_id, etc.
reference_table     text                                     -- which table the reference_id belongs to

-- Approval Chain
approved_by_primary text                                     -- Kerry (CEO/CIO) username/ID
approved_by_secondary text                                   -- Controller or second approver (for wire dual-approval)
approval_date       timestamptz
conditions          text                                     -- any conditions attached to approval

-- Status
status              text        DEFAULT 'Pending'            -- Pending, Approved, Rejected, Expired
rejection_reason    text
expires_at          timestamptz                              -- approval expires if not acted upon
compliance_review_id text                                    -- FK added after compliance_reviews table exists

notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- Referenced by nearly every operational table (`distributions.approval_id`, `cash_activity.approval_id`, `agent_tasks.approval_id`)
- `compliance_review_id` → `compliance_reviews.review_id` (added via ALTER after `compliance_reviews` is created)

**Indexes:**
```sql
CREATE INDEX idx_approvals_approval_id ON approvals(approval_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_approval_type ON approvals(approval_type);
CREATE INDEX idx_approvals_requested_date ON approvals(requested_date);
CREATE INDEX idx_approvals_reference_id ON approvals(reference_id);
```

**Access Control:**
- `ceo_cio`: read/write (can approve/reject)
- `controller`: read/write for wire dual-approval
- `operations`: read only
- `agent_service`: INSERT only — agents create approval requests; they cannot update status
- `n8n_service`: UPDATE status (executes approval decision after human input captured via Airtable)
- `powerbi_readonly`: read only

**Agents:** All 18 agents create approval requests (INSERT). No agent updates status. Status updates come from human input captured in Airtable, written back by n8n.
**Dashboards:** Executive Dashboard (primary — open approval queue, DirectQuery), all dashboards reference approval status
**Automations:** Every consequential workflow step checks `approvals` for an `Approved` record before proceeding. This is the central governance gate.

---

### Table 20: `compliance_reviews`

**Purpose:** Compliance review log — every material submitted for review by Agent 14 is logged here. Tracks review result (cleared/not cleared), issues found, and clearance status. Required before any investor-facing material is distributed.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
review_id           text        UNIQUE NOT NULL              -- e.g., COMP-00001
material_name       text        NOT NULL
material_type       text        NOT NULL                     -- Investor Report, Pitch Deck, DDQ Response, Marketing Material, Distribution Notice, Other
submitted_by        text        NOT NULL                     -- agent_id or human
submitted_date      date        NOT NULL
agent_session_id    text

drive_file_id       text                                     -- Google Drive file ID of material
drive_path          text

-- Review Output
review_date         date
review_result       text        DEFAULT 'Pending'            -- Pending, Cleared, Not Cleared, Cleared with Conditions
issues_found        jsonb                                    -- array of {issue, severity, resolution_required}
conditions          text                                     -- if Cleared with Conditions
clearance_date      date
reviewed_by         text                                     -- Agent 14 session + CEO/CIO sign-off

-- Approval Gate
approval_id         text        REFERENCES approvals(approval_id) -- CEO/CIO final sign-off approval
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `approval_id` → `approvals.approval_id`
- Referenced by `approvals.compliance_review_id` (circular; added via ALTER TABLE after both exist)

**Indexes:**
```sql
CREATE INDEX idx_compliance_reviews_review_id ON compliance_reviews(review_id);
CREATE INDEX idx_compliance_reviews_review_result ON compliance_reviews(review_result);
CREATE INDEX idx_compliance_reviews_submitted_date ON compliance_reviews(submitted_date);
CREATE INDEX idx_compliance_reviews_material_type ON compliance_reviews(material_type);
```

**Access Control:**
- `ceo_cio`: read/write
- `operations`: read only
- `agent_service`: read/write (Agent 14 writes review results)
- `powerbi_readonly`: read only

**Agents:** Agent 14 (primary — writes review results, issues, clearance), Agent 17 (reads clearance status before releasing investor reports)
**Dashboards:** Investor Reporting Dashboard (compliance status for current report cycle)
**Automations:** Any investor-facing material workflow (WF-05, WF-06) checks `compliance_reviews` for a `Cleared` record before n8n sends distribution or reports

---

### Table 21: `agent_tasks`

**Purpose:** Agent task queue and status tracking — every agent session initiated by n8n or manually is logged here before execution. Functions as the task queue: Pending → Running → Complete/Failed. Supports the Approval Queue in Airtable and Agent 01 daily briefing.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
task_id             text        UNIQUE NOT NULL              -- e.g., TASK-00001
agent_number        int         NOT NULL                     -- 1–18
agent_name          text        NOT NULL
agent_id            text        NOT NULL                     -- Anthropic Managed Agent ID
workflow_trigger    text        NOT NULL                     -- WF-01, WF-02, Manual, Scheduled, etc.
task_type           text        NOT NULL                     -- Tape Normalization, UW Review, Pricing, Diligence, etc.

-- References
reference_id        text                                     -- loan_id, tape_id, etc.
reference_table     text
approval_id         text                                     -- FK added via ALTER after approvals exists

-- Execution
status              text        DEFAULT 'Pending'            -- Pending, Running, Complete, Failed, Awaiting Approval
session_id          text                                     -- Anthropic session ID (populated when session starts)
log_id              text                                     -- FK to agent_logs (added via ALTER)
started_at          timestamptz
completed_at        timestamptz
duration_seconds    int

-- Input / Output Summary
input_summary       text
output_summary      text
output_structured   jsonb                                    -- key-value structured output from agent
escalation_required boolean     DEFAULT false
escalation_reason   text
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `approval_id` → `approvals.approval_id` (added via ALTER after `approvals` created)
- `log_id` → `agent_logs.log_id` (added via ALTER after `agent_logs` created)

**Indexes:**
```sql
CREATE INDEX idx_agent_tasks_task_id ON agent_tasks(task_id);
CREATE INDEX idx_agent_tasks_agent_number ON agent_tasks(agent_number);
CREATE INDEX idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX idx_agent_tasks_workflow_trigger ON agent_tasks(workflow_trigger);
CREATE INDEX idx_agent_tasks_reference_id ON agent_tasks(reference_id);
CREATE INDEX idx_agent_tasks_created_at ON agent_tasks(created_at);
```

**Access Control:**
- `ceo_cio`, `operations`: read only
- `agent_service`: INSERT (agents create tasks); `n8n_service` updates status
- `n8n_service`: read/write (orchestration engine)
- `powerbi_readonly`: read only

**Agents:** All 18 — each agent session corresponds to one `agent_tasks` row. Agent 01 reads all tasks for daily briefing.
**Dashboards:** Executive Dashboard (active sessions, escalations), Agent Task Log in Airtable
**Automations:** Every n8n workflow creates a `agent_tasks` row (Pending) before calling the Anthropic API; updates to Running, then Complete/Failed after session ends

---

### Table 22: `agent_logs`

**Purpose:** Immutable session log — the full record of every agent session: input, output, token usage, timestamps. Append-only via RLS (no UPDATE or DELETE permitted for any role). This is the permanent audit trail for all agent activity. Separate from `agent_tasks` (queue/status) — this is the completed record.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
log_id              text        UNIQUE NOT NULL              -- e.g., LOG-00001
task_id             text        REFERENCES agent_tasks(task_id) -- added via ALTER after agent_tasks exists
agent_number        int         NOT NULL
agent_name          text        NOT NULL
agent_id            text        NOT NULL                     -- Anthropic Managed Agent ID
session_id          text        NOT NULL                     -- Anthropic session ID

-- Session Details
workflow_trigger    text
started_at          timestamptz NOT NULL
completed_at        timestamptz
duration_seconds    int
status              text        NOT NULL                     -- Complete, Failed, Partial

-- Content
input_text          text                                     -- full input text passed to agent
output_text         text                                     -- full output text from agent
output_structured   jsonb                                    -- parsed structured output
token_input         int
token_output        int
model_used          text        DEFAULT 'claude-opus-4-7'

-- References
reference_id        text
reference_table     text

-- Errors
error_code          text
error_message       text
created_at          timestamptz DEFAULT now()
```

**RLS Append-Only Enforcement:**
```sql
-- Block UPDATE and DELETE for all roles (including agent_service)
CREATE POLICY "no_update_agent_logs" ON agent_logs FOR UPDATE USING (false);
CREATE POLICY "no_delete_agent_logs" ON agent_logs FOR DELETE USING (false);
CREATE POLICY "agent_service_insert" ON agent_logs FOR INSERT WITH CHECK (auth.role() = 'agent_service');
CREATE POLICY "read_all_authorized" ON agent_logs FOR SELECT USING (
    auth.role() IN ('ceo_cio', 'controller', 'operations', 'powerbi_readonly', 'auditor_readonly')
);
```

**Indexes:**
```sql
CREATE INDEX idx_agent_logs_log_id ON agent_logs(log_id);
CREATE INDEX idx_agent_logs_agent_number ON agent_logs(agent_number);
CREATE INDEX idx_agent_logs_session_id ON agent_logs(session_id);
CREATE INDEX idx_agent_logs_started_at ON agent_logs(started_at);
CREATE INDEX idx_agent_logs_reference_id ON agent_logs(reference_id);
```

**Access Control:**
- All roles: SELECT (read audit trail)
- `agent_service`: INSERT only
- No role: UPDATE or DELETE (RLS enforced)

**Agents:** All 18 — every session writes one `agent_logs` row upon completion
**Dashboards:** Executive Dashboard (session activity, success rate)
**Automations:** n8n writes to `agent_logs` immediately after Anthropic API session completes; Agent 15 queries `agent_logs` in quarterly control test to verify session completeness

---

### Table 23: `investor_reports`

**Purpose:** Quarterly investor report lifecycle — tracks each report from generation through compliance review, approval, and distribution. One row per report per reporting period.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
report_id           text        UNIQUE NOT NULL              -- e.g., RPT-2026-Q1
report_type         text        NOT NULL DEFAULT 'Quarterly' -- Quarterly, Annual, Special
period              text        NOT NULL                     -- e.g., Q1 2026
period_start        date        NOT NULL
period_end          date        NOT NULL

-- Generation
generated_date      date
generated_by        text                                     -- agent_id (Agent 17 session)
agent_session_id    text
drive_file_id       text                                     -- Google Drive file ID
drive_path          text

-- Review Chain
compliance_review_id text       REFERENCES compliance_reviews(review_id)
compliance_cleared  boolean     DEFAULT false
compliance_cleared_date date

approval_id         text        REFERENCES approvals(approval_id)
ceo_cio_approved    boolean     DEFAULT false
approval_date       date

-- Distribution
distributed_date    date
distribution_method text                                     -- Email, DocuSign, Portal
investor_count      int                                      -- how many LPs received it
powerbi_pdf_exported boolean    DEFAULT false

-- Status
status              text        DEFAULT 'Pending Generation' -- Pending Generation, Draft, Under Compliance Review, Approved, Distributed
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Relationships:**
- `compliance_review_id` → `compliance_reviews.review_id`
- `approval_id` → `approvals.approval_id`

**Indexes:**
```sql
CREATE INDEX idx_investor_reports_report_id ON investor_reports(report_id);
CREATE INDEX idx_investor_reports_period ON investor_reports(period);
CREATE INDEX idx_investor_reports_status ON investor_reports(status);
```

**Access Control:**
- `ceo_cio`: read/write
- `controller`: read only
- `agent_service`: read/write (Agent 17 creates rows, updates status)
- `powerbi_readonly`: read only

**Agents:** Agent 17 (primary — generates report, updates lifecycle status), Agent 14 (reads for compliance review, writes `compliance_review_id`), Agent 01 (reads for CEO/CIO briefing when report awaiting approval)
**Dashboards:** Investor Reporting Dashboard (report cycle status)
**Automations:** WF-05 (quarterly reporting cycle) — scheduled trigger → Agent 17 → compliance review → approval → Power BI PDF export → distribution

---

### Table 24: `data_room_items`

**Purpose:** Data room document inventory — what documents are in the investor data room, which investors have access, and access events. Two parts: `data_room_items` (document inventory) and `data_room_access_log` (access events — append-only).

**Part A: `data_room_items`**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
item_id             text        UNIQUE NOT NULL              -- e.g., DR-00001
document_name       text        NOT NULL
document_type       text        NOT NULL                     -- Fund Overview, PPM, Subscription Agreement, Financial Statement, Tax Document, Due Diligence, Other
period              text                                     -- e.g., Q1 2026, FY 2025
drive_file_id       text        NOT NULL
drive_path          text        NOT NULL
access_level        text        DEFAULT 'All LPs'            -- All LPs, Specific LPs, Internal Only
authorized_investor_ids text[]                               -- if access_level = Specific LPs
published_date      date
expiration_date     date
is_active           boolean     DEFAULT true
notes               text
created_at          timestamptz DEFAULT now()
updated_at          timestamptz DEFAULT now()
```

**Part B: `data_room_access_log` (append-only)**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
item_id             text        NOT NULL REFERENCES data_room_items(item_id)
investor_id         text        REFERENCES investors(investor_id)
accessed_by         text        NOT NULL                     -- investor_id or internal user
access_type         text        NOT NULL                     -- View, Download, Share
accessed_at         timestamptz DEFAULT now()
ip_address          text                                     -- for audit
```

**RLS on access_log:** Append-only (no UPDATE or DELETE).

**Indexes:**
```sql
CREATE INDEX idx_dr_items_item_id ON data_room_items(item_id);
CREATE INDEX idx_dr_items_document_type ON data_room_items(document_type);
CREATE INDEX idx_dr_items_is_active ON data_room_items(is_active);
CREATE INDEX idx_dr_access_log_item_id ON data_room_access_log(item_id);
CREATE INDEX idx_dr_access_log_investor_id ON data_room_access_log(investor_id);
CREATE INDEX idx_dr_access_log_accessed_at ON data_room_access_log(accessed_at);
```

**Access Control:**
- `ceo_cio`: read/write on `data_room_items`; read on `access_log`
- `agent_service`: INSERT on `access_log` only
- `investor` role: SELECT on `data_room_items` where their investor_id is in `authorized_investor_ids` or `access_level = 'All LPs'`
- `powerbi_readonly`: read only

**Agents:** Agent 17 (publishes reports to data room, updates item records), Agent 18 (manages investor-specific access permissions in Google Drive — mirrors here), Agent 15 (reads access log in quarterly audit to confirm data room sharing matches authorized investor list)
**Dashboards:** Investor Reporting Dashboard (data room activity)
**Automations:** Investor report distribution workflow — Agent 17 adds new item to `data_room_items`; n8n updates Google Drive sharing; access events logged to `data_room_access_log`

---

### Table 25: `risk_metrics`

**Purpose:** Monthly risk limit snapshots — one row per risk limit per measurement period. Agent 13 populates after each monthly portfolio review and quarterly stress test. Green/Amber/Red status per limit. Drives the Risk Dashboard and Executive Dashboard risk status panel.

**Fields:**
```sql
id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY
metric_id           text        UNIQUE NOT NULL              -- e.g., RISK-2026-05-NPL-CONC
agent_session_id    text
measurement_date    date        NOT NULL
period              text        NOT NULL                     -- e.g., 2026-05

-- Limit Identification
limit_name          text        NOT NULL                     -- e.g., NPL Concentration, Income LTV, Geographic Concentration, Leverage Ratio
limit_category      text        NOT NULL                     -- Concentration, LTV, Leverage, Liquidity, Operational, Legal
limit_basis         text                                     -- what drives this limit (e.g., % of portfolio UPB)

-- Values
current_value       numeric(15,4) NOT NULL                   -- actual reading
limit_value         numeric(15,4) NOT NULL                   -- the policy limit
amber_threshold     numeric(15,4)                            -- warning threshold (below limit)
unit                text                                     -- %, $, count, ratio
status              text        NOT NULL                     -- Green, Amber, Red

-- Stress Test (quarterly only)
is_stress_test      boolean     DEFAULT false
stress_scenario     text                                     -- Base, Downside, Severe Downside
stressed_value      numeric(15,4)
stressed_status     text                                     -- Green, Amber, Red under stress

-- Breach Handling
breach_description  text
breach_action_required text
breach_resolved     boolean     DEFAULT false
approval_id         text        REFERENCES approvals(approval_id) -- if breach requires CEO/CIO acknowledgment

notes               text
created_at          timestamptz DEFAULT now()
```

**Relationships:**
- `approval_id` → `approvals.approval_id`

**Indexes:**
```sql
CREATE INDEX idx_risk_metrics_measurement_date ON risk_metrics(measurement_date);
CREATE INDEX idx_risk_metrics_period ON risk_metrics(period);
CREATE INDEX idx_risk_metrics_limit_name ON risk_metrics(limit_name);
CREATE INDEX idx_risk_metrics_status ON risk_metrics(status);
CREATE UNIQUE INDEX idx_risk_metrics_period_limit ON risk_metrics(period, limit_name, stress_scenario);
```

**Access Control:**
- `ceo_cio`: read/write
- `controller`, `operations`: read only
- `agent_service`: read/write (Agent 13 inserts monthly)
- `powerbi_readonly`: read only

**Agents:** Agent 13 (primary — inserts one row per risk limit per month; stress test rows quarterly), Agent 01 (reads Amber/Red rows for CEO/CIO daily briefing), Agent 15 (reads for quarterly governance audit)
**Dashboards:** Risk Dashboard (primary — all limits, status, trends), Executive Dashboard (risk status summary panel, DirectQuery)
**Automations:** WF-03 (monthly portfolio cycle) — after Agent 06 and Agent 10 complete, Agent 13 runs and writes `risk_metrics`; any Red status auto-creates an `approvals` row (CEO/CIO acknowledgment required)

---

## Recommended Database Build Order

Build tables in this order to respect foreign key dependencies. Never create a table before its FK target exists.

---

### Round 1 — No Dependencies (Create First)

These tables have no foreign keys pointing to other tables. Create them first.

```sql
-- 1. sellers
-- 2. investors
-- 3. vendors
-- 4. spvs
```

---

### Round 2 — One Level of Dependencies

```sql
-- 5. servicers (→ vendors.vendor_id)
-- 6. loan_tapes (→ sellers.seller_id, spvs.spv_id)
```

---

### Round 3 — Core Loan Table

```sql
-- 7. loans (→ loan_tapes.tape_id, sellers.seller_id, servicers.servicer_code, spvs.spv_id)
```

`loans` is the central table. All loan-level operational tables depend on it.

---

### Round 4 — Loan-Level Operational Tables

These all reference `loans.loan_id` as their primary FK.

```sql
-- 8.  collateral_documents (→ loans.loan_id)
-- 9.  property_values (→ loans.loan_id)
-- 10. underwriting_reviews (→ loans.loan_id, loan_tapes.tape_id)
-- 11. pricing_models (→ loan_tapes.tape_id)
-- 12. diligence_exceptions (→ loans.loan_id, loan_tapes.tape_id)
-- 13. boarding_exceptions (→ loans.loan_id)
-- 14. npl_workouts (→ loans.loan_id)
-- 15. legal_matters (→ loans.loan_id, npl_workouts.workout_id, vendors.vendor_id)
```

---

### Round 5 — Financial Tables (No Approval FK Yet)

Create `capital_accounts` and `cash_activity` before `approvals` to avoid circular dependency. The `approval_id` FK on `cash_activity` is added via ALTER TABLE in Round 7.

```sql
-- 16. capital_accounts (→ investors.investor_id, spvs.spv_id)
-- 17. cash_activity (→ spvs.spv_id, loans.loan_id, investors.investor_id, servicers.servicer_code)
--     NOTE: omit approval_id FK for now — add via ALTER after approvals is created
```

---

### Round 6 — Approval and Compliance (Circular Resolution)

`approvals` and `compliance_reviews` reference each other. Create both without the circular FK, then add it via ALTER.

```sql
-- 18. approvals (create without compliance_review_id FK)
-- 19. compliance_reviews (→ approvals.approval_id)

-- Then resolve the circular FK:
ALTER TABLE approvals
    ADD CONSTRAINT fk_approvals_compliance_review
    FOREIGN KEY (compliance_review_id) REFERENCES compliance_reviews(review_id);

-- Now add the approval_id FK to cash_activity:
ALTER TABLE cash_activity
    ADD CONSTRAINT fk_cash_activity_approval
    FOREIGN KEY (approval_id) REFERENCES approvals(approval_id);
```

---

### Round 7 — Distributions (Requires Approvals)

```sql
-- 20. distributions (→ investors.investor_id, spvs.spv_id, approvals.approval_id)
```

---

### Round 8 — Agent Task Tables (Circular Resolution)

`agent_tasks` and `agent_logs` reference each other. Same pattern as approvals/compliance_reviews.

```sql
-- 21. agent_logs (create without task_id FK)
-- 22. agent_tasks (→ approvals.approval_id; create with log_id FK → agent_logs.log_id)

-- Then resolve the circular FK:
ALTER TABLE agent_logs
    ADD CONSTRAINT fk_agent_logs_task
    FOREIGN KEY (task_id) REFERENCES agent_tasks(task_id);

-- Add approval_id FK to agent_tasks:
ALTER TABLE agent_tasks
    ADD CONSTRAINT fk_agent_tasks_approval
    FOREIGN KEY (approval_id) REFERENCES approvals(approval_id);
```

---

### Round 9 — Reporting and Risk Tables

```sql
-- 23. investor_reports (→ compliance_reviews.review_id, approvals.approval_id)
-- 24. data_room_items (no FKs on main table)
--     data_room_access_log (→ data_room_items.item_id, investors.investor_id)
-- 25. risk_metrics (→ approvals.approval_id)
```

---

### Final: Enable RLS and Write Policies

After all 25 tables (and sub-tables) are created, run the RLS enablement script:

```sql
-- Enable RLS on every table
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicers ENABLE ROW LEVEL SECURITY;
ALTER TABLE spvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_tapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE collateral_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriting_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE diligence_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE npl_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_matters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE capital_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_metrics ENABLE ROW LEVEL SECURITY;
```

After enabling RLS, write policies per the role matrix in `security_requirements.md`. Every table defaults to deny-all with no policies — write explicit GRANT policies for each role that needs access.

---

## Tables Referenced in Phase 0 Build (Quick Reference)

The `build_roadmap.md` Phase 0 schema lists 8 core tables to create first. These map to the full schema as follows:

| Phase 0 Table | Full Schema Equivalent |
|---|---|
| `agents` | Not a separate table — agent IDs live in `.env` and `agent_logs.agent_id` |
| `tapes` | `loan_tapes` |
| `assets` | `loans` |
| `exceptions` | `diligence_exceptions` + `boarding_exceptions` |
| `decisions` | Captured in `agent_tasks.output_structured` + `approvals` |
| `approvals` | `approvals` |
| `agent_sessions` | `agent_tasks` + `agent_logs` |
| `audit_log` | `agent_logs` (append-only) + `data_room_access_log` |

The Phase 0 schema is the fast-start version. The full 25-table schema above is the production design. Build Phase 0 tables first using the simplified structure, then migrate to the full schema during Phases 1–3.
