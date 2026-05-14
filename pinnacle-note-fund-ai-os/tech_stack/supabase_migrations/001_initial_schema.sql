-- =============================================================================
-- Migration 001: Initial Schema
-- Fund: The Pinnacle Note Fund
-- Execute in Supabase SQL Editor (run as superuser / service role)
-- Build order follows FK dependency chain — do NOT reorder rounds
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- =============================================================================
-- ROUND 1 — No dependencies
-- =============================================================================

CREATE TABLE IF NOT EXISTS sellers (
    id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id       text        UNIQUE NOT NULL,
    company_name    text        NOT NULL,
    primary_contact text,
    email           text,
    phone           text,
    address         text,
    city            text,
    state           text,
    relationship_status text    DEFAULT 'Active',
    notes           text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS investors (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    investor_id         text        UNIQUE NOT NULL,
    first_name          text        NOT NULL,
    last_name           text        NOT NULL,
    entity_name         text,
    investor_type       text        NOT NULL,
    email               text,
    phone               text,
    state_of_residence  text,
    accredited_status   text        DEFAULT 'Verified',
    onboarding_status   text        DEFAULT 'Prospect',
    pipeline_stage      text,
    committed_amount    numeric(15,2),
    funded_amount       numeric(15,2) DEFAULT 0,
    first_contribution_date date,
    kyc_aml_cleared     boolean     DEFAULT false,
    subscription_signed boolean     DEFAULT false,
    communication_log   jsonb,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendors (
    id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id       text        UNIQUE NOT NULL,
    company_name    text        NOT NULL,
    vendor_type     text        NOT NULL,
    primary_contact text,
    email           text,
    phone           text,
    address         text,
    city            text,
    state           text,
    licensed_states text[],
    status          text        DEFAULT 'Active',
    contract_start  date,
    contract_end    date,
    notes           text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS spvs (
    id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    spv_id          text        UNIQUE NOT NULL,
    entity_name     text        NOT NULL,
    entity_type     text        NOT NULL,
    state_of_formation text,
    ein             text,
    formation_date  date,
    registered_agent text,
    status          text        DEFAULT 'Active',
    notes           text,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

-- =============================================================================
-- ROUND 2 — One level of dependencies
-- =============================================================================

CREATE TABLE IF NOT EXISTS servicers (
    id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id               text        UNIQUE NOT NULL REFERENCES vendors(vendor_id),
    servicer_code           text        UNIQUE NOT NULL,
    msa_signed_date         date,
    remittance_day          int,
    reporting_frequency     text        DEFAULT 'Monthly',
    portal_url              text,
    portal_username_vault   text,
    loan_count_current      int         DEFAULT 0,
    upb_current             numeric(15,2) DEFAULT 0,
    avg_collection_rate     numeric(5,4),
    sla_response_hours      int         DEFAULT 48,
    notes                   text,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS loan_tapes (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    tape_id             text        UNIQUE NOT NULL,
    seller_id           text        REFERENCES sellers(seller_id),
    acquiring_spv_id    text        REFERENCES spvs(spv_id),
    received_date       date        NOT NULL,
    loan_count          int,
    total_upb           numeric(15,2),
    asset_mix           text,
    status              text        DEFAULT 'Received',
    go_no_bid           text,
    bid_deadline        date,
    loi_sent_date       date,
    loi_accepted_date   date,
    close_date          date,
    data_quality_score  numeric(5,2),
    data_quality_flags  text[],
    normalization_status text       DEFAULT 'Pending',
    agent_session_id    text,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

-- =============================================================================
-- ROUND 3 — Core loan table
-- =============================================================================

CREATE TABLE IF NOT EXISTS loans (
    id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    loan_id                 text        UNIQUE NOT NULL,
    tape_id                 text        NOT NULL REFERENCES loan_tapes(tape_id),
    seller_id               text        REFERENCES sellers(seller_id),
    servicer_code           text        REFERENCES servicers(servicer_code),
    spv_id                  text        REFERENCES spvs(spv_id),
    property_address        text,
    property_city           text,
    property_state          text,
    property_zip            text,
    property_type           text,
    lien_position           int         NOT NULL,
    original_note_date      date,
    original_upb            numeric(15,2),
    current_upb             numeric(15,2),
    interest_rate           numeric(5,4),
    maturity_date           date,
    loan_type               text,
    amortization_type       text,
    payment_status          text        DEFAULT 'Unknown',
    last_payment_date       date,
    months_paid_last_12     int,
    delinquency_days        int         DEFAULT 0,
    loan_classification     text        DEFAULT 'Unclassified',
    workout_strategy        text,
    resolution_status       text,
    acquisition_status      text        DEFAULT 'Prospect',
    boarding_date           date,
    purchase_price          numeric(15,2),
    purchase_price_pct_upb  numeric(5,4),
    settled_upb             numeric(15,2),
    health_score            numeric(5,2),
    uw_classification       text,
    uw_flags                text[],
    closing_ready           boolean     DEFAULT false,
    qa_status               text,
    boarding_qa_date        date,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now()
);

-- =============================================================================
-- ROUND 4 — Loan-level operational tables
-- =============================================================================

CREATE TABLE IF NOT EXISTS collateral_documents (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    doc_id              text        UNIQUE NOT NULL,
    loan_id             text        NOT NULL REFERENCES loans(loan_id),
    document_type       text        NOT NULL,
    document_status     text        NOT NULL,
    condition           text,
    custodian           text,
    drive_file_id       text,
    drive_path          text,
    received_date       date,
    reviewed_date       date,
    reviewed_by         text,
    defect_description  text,
    cure_required       boolean     DEFAULT false,
    cure_deadline       date,
    cure_status         text,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_values (
    id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    valuation_id    text        UNIQUE NOT NULL,
    loan_id         text        NOT NULL REFERENCES loans(loan_id),
    valuation_type  text        NOT NULL,
    source          text        NOT NULL,
    as_of_date      date        NOT NULL,
    property_value  numeric(15,2) NOT NULL,
    confidence_score numeric(5,4),
    value_low       numeric(15,2),
    value_high      numeric(15,2),
    avm_forecast_12m numeric(5,4),
    tax_assessment  numeric(15,2),
    tax_year        int,
    tax_status      text,
    tax_delinquency_amount numeric(15,2),
    last_sale_date  date,
    last_sale_price numeric(15,2),
    ownership_name  text,
    lien_count      int,
    lien_total_est  numeric(15,2),
    foreclosure_status text,
    foreclosure_date date,
    is_current      boolean     DEFAULT false,
    pulled_at       timestamptz DEFAULT now(),
    created_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS underwriting_reviews (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id           text        UNIQUE NOT NULL,
    loan_id             text        NOT NULL REFERENCES loans(loan_id),
    tape_id             text        REFERENCES loan_tapes(tape_id),
    review_type         text        NOT NULL,
    review_date         date        NOT NULL,
    agent_session_id    text,
    avm_value           numeric(15,2),
    avm_source          text,
    current_upb         numeric(15,2),
    calculated_ltv      numeric(5,4),
    calculated_itv      numeric(5,4),
    payment_history_12m text,
    months_paid_12      int,
    delinquency_days    int,
    bankruptcy_status   boolean     DEFAULT false,
    foreclosure_status  boolean     DEFAULT false,
    health_score        numeric(5,2),
    classification      text        NOT NULL,
    missing_data_fields text[],
    uw_flags            text[],
    underwriter_notes   text,
    recommendation      text,
    created_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_models (
    id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    pricing_id              text        UNIQUE NOT NULL,
    tape_id                 text        NOT NULL REFERENCES loan_tapes(tape_id),
    agent_session_id        text,
    pricing_date            date        NOT NULL,
    tape_total_upb          numeric(15,2),
    tape_loan_count         int,
    avg_health_score        numeric(5,2),
    avg_ltv                 numeric(5,4),
    income_pct              numeric(5,4),
    npl_pct                 numeric(5,4),
    base_irr                numeric(5,4),
    base_moic               numeric(5,3),
    base_bid_pct            numeric(5,4),
    base_bid_amount         numeric(15,2),
    upside_irr              numeric(5,4),
    upside_moic             numeric(5,3),
    upside_bid_pct          numeric(5,4),
    upside_bid_amount       numeric(15,2),
    downside_irr            numeric(5,4),
    downside_moic           numeric(5,3),
    downside_bid_pct        numeric(5,4),
    downside_bid_amount     numeric(15,2),
    recommended_bid         numeric(15,2),
    max_bid                 numeric(15,2),
    walk_price              numeric(15,2),
    key_risks               text[],
    assumptions             text,
    notes                   text,
    created_at              timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diligence_exceptions (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    exception_id        text        UNIQUE NOT NULL,
    loan_id             text        NOT NULL REFERENCES loans(loan_id),
    tape_id             text        REFERENCES loan_tapes(tape_id),
    agent_session_id    text,
    exception_type      text        NOT NULL,
    severity            text        NOT NULL,
    description         text        NOT NULL,
    financial_impact    numeric(15,2),
    legal_impact        text,
    required_resolution text        NOT NULL,
    owner               text,
    deadline            date,
    status              text        DEFAULT 'Open',
    resolution_notes    text,
    resolved_date       date,
    blocks_closing      boolean     DEFAULT false,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boarding_exceptions (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    exception_id        text        UNIQUE NOT NULL,
    loan_id             text        NOT NULL REFERENCES loans(loan_id),
    agent_session_id    text,
    exception_type      text        NOT NULL,
    severity            text        NOT NULL,
    description         text        NOT NULL,
    required_resolution text        NOT NULL,
    owner               text,
    deadline            date,
    status              text        DEFAULT 'Open',
    resolution_notes    text,
    resolved_date       date,
    blocks_boarding     boolean     DEFAULT false,
    qa_cleared          boolean     DEFAULT false,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS npl_workouts (
    id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id              text        UNIQUE NOT NULL,
    loan_id                 text        NOT NULL REFERENCES loans(loan_id),
    agent_session_id        text,
    resolution_path         text        NOT NULL,
    strategy_approved_date  date,
    approved_by             text,
    borrower_contact_date   date,
    borrower_response       text,
    hardship_claim          boolean     DEFAULT false,
    hardship_type           text,
    mod_type                text,
    mod_new_rate            numeric(5,4),
    mod_new_term_months     int,
    mod_new_payment         numeric(15,2),
    mod_trial_period_months int,
    mod_final_status        text,
    foreclosure_filed_date  date,
    foreclosure_state       text,
    estimated_fc_completion date,
    fc_attorney             text,
    current_legal_milestone text,
    next_legal_deadline     date,
    reo_acquired_date       date,
    reo_list_price          numeric(15,2),
    reo_list_date           date,
    reo_sale_price          numeric(15,2),
    reo_sale_date           date,
    reo_net_proceeds        numeric(15,2),
    resolution_status       text        DEFAULT 'Active',
    resolution_outcome      text,
    resolution_date         date,
    loss_severity           numeric(5,4),
    notes                   text,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legal_matters (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    matter_id           text        UNIQUE NOT NULL,
    loan_id             text        NOT NULL REFERENCES loans(loan_id),
    workout_id          text        REFERENCES npl_workouts(workout_id),
    matter_type         text        NOT NULL,
    filing_date         date,
    court               text,
    case_number         text,
    jurisdiction_state  text,
    attorney_vendor_id  text        REFERENCES vendors(vendor_id),
    bk_chapter          text,
    bk_filed_date       date,
    bk_341_date         date,
    bk_plan_confirmed   boolean     DEFAULT false,
    bk_discharged_date  date,
    bk_dismissed_date   date,
    bk_relief_granted   boolean     DEFAULT false,
    fc_complaint_filed  date,
    fc_service_date     date,
    fc_lis_pendens_date date,
    fc_judgment_date    date,
    fc_sale_date        date,
    fc_redemption_deadline date,
    current_status      text        DEFAULT 'Active',
    current_milestone   text,
    next_deadline       date,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

-- =============================================================================
-- ROUND 5 — Financial tables (no approval FK yet — added in Round 6 via ALTER)
-- =============================================================================

CREATE TABLE IF NOT EXISTS capital_accounts (
    id                          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id                  text        UNIQUE NOT NULL,
    investor_id                 text        NOT NULL REFERENCES investors(investor_id),
    spv_id                      text        NOT NULL REFERENCES spvs(spv_id),
    committed_capital           numeric(15,2) NOT NULL,
    contributed_capital         numeric(15,2) DEFAULT 0,
    unfunded_commitment         numeric(15,2) DEFAULT 0,
    total_distributions_received numeric(15,2) DEFAULT 0,
    preferred_return_paid_to_date numeric(15,2) DEFAULT 0,
    return_of_capital_paid      numeric(15,2) DEFAULT 0,
    current_balance             numeric(15,2) DEFAULT 0,
    current_irr                 numeric(5,4),
    current_moic                numeric(5,3),
    preferred_return_accrued    numeric(15,2) DEFAULT 0,
    preferred_return_satisfied  boolean     DEFAULT false,
    last_updated_date           date,
    last_nav_date               date,
    created_at                  timestamptz DEFAULT now(),
    updated_at                  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cash_activity (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id      text        UNIQUE NOT NULL,
    spv_id              text        REFERENCES spvs(spv_id),
    loan_id             text        REFERENCES loans(loan_id),
    investor_id         text        REFERENCES investors(investor_id),
    transaction_date    date        NOT NULL,
    posting_date        date,
    category            text        NOT NULL,
    subcategory         text,
    amount              numeric(15,2) NOT NULL,
    description         text,
    servicer_code       text        REFERENCES servicers(servicer_code),
    reference_number    text,
    source_document     text,
    -- approval_id FK added via ALTER after approvals table exists
    reconciled          boolean     DEFAULT false,
    reconciled_date     date,
    notes               text,
    created_at          timestamptz DEFAULT now()
);

-- =============================================================================
-- ROUND 6 — Approval and compliance (circular FK resolved via ALTER)
-- =============================================================================

CREATE TABLE IF NOT EXISTS approvals (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    approval_id         text        UNIQUE NOT NULL,
    approval_type       text        NOT NULL,
    item_description    text        NOT NULL,
    requested_by        text        NOT NULL,
    requested_date      timestamptz NOT NULL,
    amount              numeric(15,2),
    reference_id        text,
    reference_table     text,
    approved_by_primary text,
    approved_by_secondary text,
    approval_date       timestamptz,
    conditions          text,
    status              text        DEFAULT 'Pending',
    rejection_reason    text,
    expires_at          timestamptz,
    -- compliance_review_id FK added via ALTER after compliance_reviews exists
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_reviews (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id           text        UNIQUE NOT NULL,
    material_name       text        NOT NULL,
    material_type       text        NOT NULL,
    submitted_by        text        NOT NULL,
    submitted_date      date        NOT NULL,
    agent_session_id    text,
    drive_file_id       text,
    drive_path          text,
    review_date         date,
    review_result       text        DEFAULT 'Pending',
    issues_found        jsonb,
    conditions          text,
    clearance_date      date,
    reviewed_by         text,
    approval_id         text        REFERENCES approvals(approval_id),
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

-- Resolve circular FK: approvals ↔ compliance_reviews
ALTER TABLE approvals
    ADD COLUMN IF NOT EXISTS compliance_review_id text,
    ADD CONSTRAINT fk_approvals_compliance_review
        FOREIGN KEY (compliance_review_id) REFERENCES compliance_reviews(review_id)
        DEFERRABLE INITIALLY DEFERRED;

-- Add approval_id FK to cash_activity now that approvals exists
ALTER TABLE cash_activity
    ADD COLUMN IF NOT EXISTS approval_id text,
    ADD CONSTRAINT fk_cash_activity_approval
        FOREIGN KEY (approval_id) REFERENCES approvals(approval_id);

-- =============================================================================
-- ROUND 7 — Distributions (requires approvals)
-- =============================================================================

CREATE TABLE IF NOT EXISTS distributions (
    id                      uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    distribution_id         text        UNIQUE NOT NULL,
    distribution_event_id   text        NOT NULL,
    investor_id             text        NOT NULL REFERENCES investors(investor_id),
    spv_id                  text        REFERENCES spvs(spv_id),
    approval_id             text        NOT NULL REFERENCES approvals(approval_id),
    distribution_date       date        NOT NULL,
    period_start            date,
    period_end              date,
    capital_account_balance numeric(15,2) NOT NULL,
    committed_capital       numeric(15,2) NOT NULL,
    expenses_share          numeric(15,2) DEFAULT 0,
    mgmt_fee_share          numeric(15,2) DEFAULT 0,
    preferred_return_paid   numeric(15,2) DEFAULT 0,
    return_of_capital       numeric(15,2) DEFAULT 0,
    residual_lp_share       numeric(15,2) DEFAULT 0,
    total_distribution      numeric(15,2) NOT NULL,
    wire_status             text        DEFAULT 'Pending',
    wire_date               date,
    wire_reference          text,
    wire_checklist_complete boolean     DEFAULT false,
    distribution_notice_sent boolean    DEFAULT false,
    tax_document_prepared   boolean     DEFAULT false,
    notes                   text,
    created_at              timestamptz DEFAULT now(),
    updated_at              timestamptz DEFAULT now()
);

-- =============================================================================
-- ROUND 8 — Agent task tables (circular FK resolved via ALTER)
-- =============================================================================

CREATE TABLE IF NOT EXISTS agent_logs (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    log_id              text        UNIQUE NOT NULL,
    -- task_id FK added via ALTER after agent_tasks exists
    agent_number        int         NOT NULL,
    agent_name          text        NOT NULL,
    agent_id            text        NOT NULL,
    session_id          text        NOT NULL,
    workflow_trigger    text,
    started_at          timestamptz NOT NULL,
    completed_at        timestamptz,
    duration_seconds    int,
    status              text        NOT NULL,
    input_text          text,
    output_text         text,
    output_structured   jsonb,
    token_input         int,
    token_output        int,
    model_used          text        DEFAULT 'claude-opus-4-7',
    reference_id        text,
    reference_table     text,
    error_code          text,
    error_message       text,
    created_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_tasks (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id             text        UNIQUE NOT NULL,
    agent_number        int         NOT NULL,
    agent_name          text        NOT NULL,
    agent_id            text        NOT NULL,
    workflow_trigger    text        NOT NULL,
    task_type           text        NOT NULL,
    reference_id        text,
    reference_table     text,
    -- approval_id FK added via ALTER
    status              text        DEFAULT 'Pending',
    session_id          text,
    log_id              text        REFERENCES agent_logs(log_id),
    started_at          timestamptz,
    completed_at        timestamptz,
    duration_seconds    int,
    input_summary       text,
    output_summary      text,
    output_structured   jsonb,
    escalation_required boolean     DEFAULT false,
    escalation_reason   text,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

-- Resolve circular FK: agent_logs ↔ agent_tasks
ALTER TABLE agent_logs
    ADD COLUMN IF NOT EXISTS task_id text,
    ADD CONSTRAINT fk_agent_logs_task
        FOREIGN KEY (task_id) REFERENCES agent_tasks(task_id)
        DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE agent_tasks
    ADD COLUMN IF NOT EXISTS approval_id text,
    ADD CONSTRAINT fk_agent_tasks_approval
        FOREIGN KEY (approval_id) REFERENCES approvals(approval_id);

-- =============================================================================
-- ROUND 9 — Reporting and risk tables
-- =============================================================================

CREATE TABLE IF NOT EXISTS investor_reports (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id           text        UNIQUE NOT NULL,
    report_type         text        NOT NULL DEFAULT 'Quarterly',
    period              text        NOT NULL,
    period_start        date        NOT NULL,
    period_end          date        NOT NULL,
    generated_date      date,
    generated_by        text,
    agent_session_id    text,
    drive_file_id       text,
    drive_path          text,
    compliance_review_id text       REFERENCES compliance_reviews(review_id),
    compliance_cleared  boolean     DEFAULT false,
    compliance_cleared_date date,
    approval_id         text        REFERENCES approvals(approval_id),
    ceo_cio_approved    boolean     DEFAULT false,
    approval_date       date,
    distributed_date    date,
    distribution_method text,
    investor_count      int,
    powerbi_pdf_exported boolean    DEFAULT false,
    status              text        DEFAULT 'Pending Generation',
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS data_room_items (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id             text        UNIQUE NOT NULL,
    document_name       text        NOT NULL,
    document_type       text        NOT NULL,
    period              text,
    drive_file_id       text        NOT NULL,
    drive_path          text        NOT NULL,
    access_level        text        DEFAULT 'All LPs',
    authorized_investor_ids text[],
    published_date      date,
    expiration_date     date,
    is_active           boolean     DEFAULT true,
    notes               text,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS data_room_access_log (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id             text        NOT NULL REFERENCES data_room_items(item_id),
    investor_id         text        REFERENCES investors(investor_id),
    accessed_by         text        NOT NULL,
    access_type         text        NOT NULL,
    accessed_at         timestamptz DEFAULT now(),
    ip_address          text
);

CREATE TABLE IF NOT EXISTS risk_metrics (
    id                  uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_id           text        UNIQUE NOT NULL,
    agent_session_id    text,
    measurement_date    date        NOT NULL,
    period              text        NOT NULL,
    limit_name          text        NOT NULL,
    limit_category      text        NOT NULL,
    limit_basis         text,
    current_value       numeric(15,4) NOT NULL,
    limit_value         numeric(15,4) NOT NULL,
    amber_threshold     numeric(15,4),
    unit                text,
    status              text        NOT NULL,
    is_stress_test      boolean     DEFAULT false,
    stress_scenario     text,
    stressed_value      numeric(15,4),
    stressed_status     text,
    breach_description  text,
    breach_action_required text,
    breach_resolved     boolean     DEFAULT false,
    approval_id         text        REFERENCES approvals(approval_id),
    notes               text,
    created_at          timestamptz DEFAULT now()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- sellers
CREATE INDEX IF NOT EXISTS idx_sellers_seller_id ON sellers(seller_id);
CREATE INDEX IF NOT EXISTS idx_sellers_company_name ON sellers(company_name);

-- investors
CREATE INDEX IF NOT EXISTS idx_investors_investor_id ON investors(investor_id);
CREATE INDEX IF NOT EXISTS idx_investors_onboarding_status ON investors(onboarding_status);
CREATE INDEX IF NOT EXISTS idx_investors_pipeline_stage ON investors(pipeline_stage);

-- vendors
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_id ON vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_type ON vendors(vendor_type);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

-- servicers
CREATE INDEX IF NOT EXISTS idx_servicers_vendor_id ON servicers(vendor_id);
CREATE INDEX IF NOT EXISTS idx_servicers_servicer_code ON servicers(servicer_code);

-- loan_tapes
CREATE INDEX IF NOT EXISTS idx_loan_tapes_tape_id ON loan_tapes(tape_id);
CREATE INDEX IF NOT EXISTS idx_loan_tapes_status ON loan_tapes(status);
CREATE INDEX IF NOT EXISTS idx_loan_tapes_seller_id ON loan_tapes(seller_id);
CREATE INDEX IF NOT EXISTS idx_loan_tapes_received_date ON loan_tapes(received_date);

-- loans
CREATE INDEX IF NOT EXISTS idx_loans_loan_id ON loans(loan_id);
CREATE INDEX IF NOT EXISTS idx_loans_tape_id ON loans(tape_id);
CREATE INDEX IF NOT EXISTS idx_loans_payment_status ON loans(payment_status);
CREATE INDEX IF NOT EXISTS idx_loans_loan_classification ON loans(loan_classification);
CREATE INDEX IF NOT EXISTS idx_loans_acquisition_status ON loans(acquisition_status);
CREATE INDEX IF NOT EXISTS idx_loans_property_state ON loans(property_state);
CREATE INDEX IF NOT EXISTS idx_loans_spv_id ON loans(spv_id);
CREATE INDEX IF NOT EXISTS idx_loans_servicer_code ON loans(servicer_code);

-- collateral_documents
CREATE INDEX IF NOT EXISTS idx_collateral_docs_loan_id ON collateral_documents(loan_id);
CREATE INDEX IF NOT EXISTS idx_collateral_docs_doc_type ON collateral_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_collateral_docs_status ON collateral_documents(document_status);
CREATE INDEX IF NOT EXISTS idx_collateral_docs_cure_status ON collateral_documents(cure_status) WHERE cure_required = true;

-- property_values
CREATE INDEX IF NOT EXISTS idx_property_values_loan_id ON property_values(loan_id);
CREATE INDEX IF NOT EXISTS idx_property_values_is_current ON property_values(loan_id, is_current) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_property_values_source ON property_values(source);
CREATE INDEX IF NOT EXISTS idx_property_values_as_of_date ON property_values(as_of_date);

-- underwriting_reviews
CREATE INDEX IF NOT EXISTS idx_uw_reviews_loan_id ON underwriting_reviews(loan_id);
CREATE INDEX IF NOT EXISTS idx_uw_reviews_tape_id ON underwriting_reviews(tape_id);
CREATE INDEX IF NOT EXISTS idx_uw_reviews_classification ON underwriting_reviews(classification);
CREATE INDEX IF NOT EXISTS idx_uw_reviews_review_date ON underwriting_reviews(review_date);

-- pricing_models
CREATE INDEX IF NOT EXISTS idx_pricing_models_tape_id ON pricing_models(tape_id);
CREATE INDEX IF NOT EXISTS idx_pricing_models_pricing_date ON pricing_models(pricing_date);

-- diligence_exceptions
CREATE INDEX IF NOT EXISTS idx_diligence_exc_loan_id ON diligence_exceptions(loan_id);
CREATE INDEX IF NOT EXISTS idx_diligence_exc_tape_id ON diligence_exceptions(tape_id);
CREATE INDEX IF NOT EXISTS idx_diligence_exc_severity ON diligence_exceptions(severity);
CREATE INDEX IF NOT EXISTS idx_diligence_exc_status ON diligence_exceptions(status);
CREATE INDEX IF NOT EXISTS idx_diligence_exc_blocks_closing ON diligence_exceptions(blocks_closing) WHERE blocks_closing = true;

-- boarding_exceptions
CREATE INDEX IF NOT EXISTS idx_boarding_exc_loan_id ON boarding_exceptions(loan_id);
CREATE INDEX IF NOT EXISTS idx_boarding_exc_status ON boarding_exceptions(status);
CREATE INDEX IF NOT EXISTS idx_boarding_exc_blocks_boarding ON boarding_exceptions(blocks_boarding) WHERE blocks_boarding = true;

-- npl_workouts
CREATE INDEX IF NOT EXISTS idx_npl_workouts_loan_id ON npl_workouts(loan_id);
CREATE INDEX IF NOT EXISTS idx_npl_workouts_resolution_path ON npl_workouts(resolution_path);
CREATE INDEX IF NOT EXISTS idx_npl_workouts_resolution_status ON npl_workouts(resolution_status);
CREATE INDEX IF NOT EXISTS idx_npl_workouts_next_legal_deadline ON npl_workouts(next_legal_deadline);

-- legal_matters
CREATE INDEX IF NOT EXISTS idx_legal_matters_loan_id ON legal_matters(loan_id);
CREATE INDEX IF NOT EXISTS idx_legal_matters_matter_type ON legal_matters(matter_type);
CREATE INDEX IF NOT EXISTS idx_legal_matters_next_deadline ON legal_matters(next_deadline);
CREATE INDEX IF NOT EXISTS idx_legal_matters_current_status ON legal_matters(current_status);

-- cash_activity
CREATE INDEX IF NOT EXISTS idx_cash_activity_transaction_date ON cash_activity(transaction_date);
CREATE INDEX IF NOT EXISTS idx_cash_activity_spv_id ON cash_activity(spv_id);
CREATE INDEX IF NOT EXISTS idx_cash_activity_loan_id ON cash_activity(loan_id) WHERE loan_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cash_activity_category ON cash_activity(category);
CREATE INDEX IF NOT EXISTS idx_cash_activity_reconciled ON cash_activity(reconciled) WHERE reconciled = false;

-- distributions
CREATE INDEX IF NOT EXISTS idx_distributions_investor_id ON distributions(investor_id);
CREATE INDEX IF NOT EXISTS idx_distributions_event_id ON distributions(distribution_event_id);
CREATE INDEX IF NOT EXISTS idx_distributions_distribution_date ON distributions(distribution_date);
CREATE INDEX IF NOT EXISTS idx_distributions_wire_status ON distributions(wire_status);

-- capital_accounts
CREATE INDEX IF NOT EXISTS idx_capital_accounts_investor_id ON capital_accounts(investor_id);
CREATE INDEX IF NOT EXISTS idx_capital_accounts_spv_id ON capital_accounts(spv_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_capital_accounts_investor_spv ON capital_accounts(investor_id, spv_id);

-- approvals
CREATE INDEX IF NOT EXISTS idx_approvals_approval_id ON approvals(approval_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_approval_type ON approvals(approval_type);
CREATE INDEX IF NOT EXISTS idx_approvals_requested_date ON approvals(requested_date);
CREATE INDEX IF NOT EXISTS idx_approvals_reference_id ON approvals(reference_id);

-- compliance_reviews
CREATE INDEX IF NOT EXISTS idx_compliance_reviews_review_id ON compliance_reviews(review_id);
CREATE INDEX IF NOT EXISTS idx_compliance_reviews_review_result ON compliance_reviews(review_result);
CREATE INDEX IF NOT EXISTS idx_compliance_reviews_submitted_date ON compliance_reviews(submitted_date);
CREATE INDEX IF NOT EXISTS idx_compliance_reviews_material_type ON compliance_reviews(material_type);

-- agent_tasks
CREATE INDEX IF NOT EXISTS idx_agent_tasks_task_id ON agent_tasks(task_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_agent_number ON agent_tasks(agent_number);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_status ON agent_tasks(status);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_workflow_trigger ON agent_tasks(workflow_trigger);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_reference_id ON agent_tasks(reference_id);
CREATE INDEX IF NOT EXISTS idx_agent_tasks_created_at ON agent_tasks(created_at);

-- agent_logs
CREATE INDEX IF NOT EXISTS idx_agent_logs_log_id ON agent_logs(log_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_number ON agent_logs(agent_number);
CREATE INDEX IF NOT EXISTS idx_agent_logs_session_id ON agent_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_started_at ON agent_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_agent_logs_reference_id ON agent_logs(reference_id);

-- investor_reports
CREATE INDEX IF NOT EXISTS idx_investor_reports_report_id ON investor_reports(report_id);
CREATE INDEX IF NOT EXISTS idx_investor_reports_period ON investor_reports(period);
CREATE INDEX IF NOT EXISTS idx_investor_reports_status ON investor_reports(status);

-- data_room_items
CREATE INDEX IF NOT EXISTS idx_dr_items_item_id ON data_room_items(item_id);
CREATE INDEX IF NOT EXISTS idx_dr_items_document_type ON data_room_items(document_type);
CREATE INDEX IF NOT EXISTS idx_dr_items_is_active ON data_room_items(is_active);

-- data_room_access_log
CREATE INDEX IF NOT EXISTS idx_dr_access_log_item_id ON data_room_access_log(item_id);
CREATE INDEX IF NOT EXISTS idx_dr_access_log_investor_id ON data_room_access_log(investor_id);
CREATE INDEX IF NOT EXISTS idx_dr_access_log_accessed_at ON data_room_access_log(accessed_at);

-- risk_metrics
CREATE INDEX IF NOT EXISTS idx_risk_metrics_measurement_date ON risk_metrics(measurement_date);
CREATE INDEX IF NOT EXISTS idx_risk_metrics_period ON risk_metrics(period);
CREATE INDEX IF NOT EXISTS idx_risk_metrics_limit_name ON risk_metrics(limit_name);
CREATE INDEX IF NOT EXISTS idx_risk_metrics_status ON risk_metrics(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_metrics_period_limit ON risk_metrics(period, limit_name, stress_scenario);
