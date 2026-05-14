-- =============================================================================
-- Migration 002: Row-Level Security — Enable + Policies
-- Fund: The Pinnacle Note Fund
-- Run AFTER 001_initial_schema.sql
-- Default: deny-all. Every access must be explicitly granted.
-- =============================================================================

-- =============================================================================
-- STEP 1: Create database roles
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ceo_cio') THEN
        CREATE ROLE ceo_cio;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'controller') THEN
        CREATE ROLE controller;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'operations') THEN
        CREATE ROLE operations;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'investor') THEN
        CREATE ROLE investor;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'agent_service') THEN
        CREATE ROLE agent_service;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'n8n_service') THEN
        CREATE ROLE n8n_service;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'powerbi_readonly') THEN
        CREATE ROLE powerbi_readonly;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'auditor_readonly') THEN
        CREATE ROLE auditor_readonly;
    END IF;
END $$;

-- =============================================================================
-- STEP 2: Enable RLS on all tables
-- =============================================================================

ALTER TABLE sellers              ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors            ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE spvs                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_tapes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans                ENABLE ROW LEVEL SECURITY;
ALTER TABLE collateral_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_values      ENABLE ROW LEVEL SECURITY;
ALTER TABLE underwriting_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_models       ENABLE ROW LEVEL SECURITY;
ALTER TABLE diligence_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE boarding_exceptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE npl_workouts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_matters        ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_activity        ENABLE ROW LEVEL SECURITY;
ALTER TABLE capital_accounts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_reviews   ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_tasks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_reports     ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_room_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_metrics         ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- STEP 3: RLS Policies
-- Convention: "role_table_action"
-- =============================================================================

-- ----------------------------------------------------------------
-- sellers
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_sellers_all ON sellers
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_sellers_all ON sellers
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_sellers_read ON sellers
    FOR SELECT TO agent_service USING (true);
CREATE POLICY powerbi_sellers_read ON sellers
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- investors (sensitive — no n8n_service access; investor sees own row only)
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_investors_all ON investors
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_investors_read ON investors
    FOR SELECT TO controller USING (true);
CREATE POLICY agent_service_investors_rw ON investors
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY investor_own_row ON investors
    FOR SELECT TO investor USING (investor_id = current_user);
CREATE POLICY powerbi_investors_read ON investors
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- vendors
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_vendors_all ON vendors
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_vendors_all ON vendors
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_vendors_read ON vendors
    FOR SELECT TO agent_service USING (true);
CREATE POLICY powerbi_vendors_read ON vendors
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- spvs (EIN is sensitive — agent_service gets all columns except ein via view; for now full row but document restriction)
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_spvs_all ON spvs
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_spvs_read ON spvs
    FOR SELECT TO controller USING (true);
CREATE POLICY agent_service_spvs_read ON spvs
    FOR SELECT TO agent_service USING (true);
CREATE POLICY powerbi_spvs_read ON spvs
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- servicers
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_servicers_all ON servicers
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_servicers_all ON servicers
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_servicers_read ON servicers
    FOR SELECT TO agent_service USING (true);
CREATE POLICY powerbi_servicers_read ON servicers
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- loan_tapes
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_loan_tapes_all ON loan_tapes
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_loan_tapes_all ON loan_tapes
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_loan_tapes_rw ON loan_tapes
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY n8n_loan_tapes_rw ON loan_tapes
    FOR ALL TO n8n_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_loan_tapes_read ON loan_tapes
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- loans (central table — broad access)
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_loans_all ON loans
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_loans_all ON loans
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY controller_loans_read ON loans
    FOR SELECT TO controller USING (true);
CREATE POLICY agent_service_loans_rw ON loans
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY n8n_loans_rw ON loans
    FOR ALL TO n8n_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_loans_read ON loans
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- collateral_documents
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_collateral_all ON collateral_documents
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_collateral_all ON collateral_documents
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_collateral_rw ON collateral_documents
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_collateral_read ON collateral_documents
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- property_values
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_pv_all ON property_values
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_pv_all ON property_values
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_pv_rw ON property_values
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY n8n_pv_rw ON property_values
    FOR ALL TO n8n_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_pv_read ON property_values
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- underwriting_reviews
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_uw_all ON underwriting_reviews
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_uw_all ON underwriting_reviews
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_uw_rw ON underwriting_reviews
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_uw_read ON underwriting_reviews
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- pricing_models
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_pricing_all ON pricing_models
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_pricing_read ON pricing_models
    FOR SELECT TO operations USING (true);
CREATE POLICY agent_service_pricing_rw ON pricing_models
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_pricing_read ON pricing_models
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- diligence_exceptions
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_dil_exc_all ON diligence_exceptions
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_dil_exc_all ON diligence_exceptions
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_dil_exc_rw ON diligence_exceptions
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_dil_exc_read ON diligence_exceptions
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- boarding_exceptions
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_board_exc_all ON boarding_exceptions
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_board_exc_all ON boarding_exceptions
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_board_exc_rw ON boarding_exceptions
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_board_exc_read ON boarding_exceptions
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- npl_workouts
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_npl_all ON npl_workouts
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_npl_all ON npl_workouts
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_npl_rw ON npl_workouts
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_npl_read ON npl_workouts
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- legal_matters
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_legal_all ON legal_matters
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_legal_all ON legal_matters
    FOR ALL TO operations USING (true) WITH CHECK (true);
CREATE POLICY agent_service_legal_rw ON legal_matters
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_legal_read ON legal_matters
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- cash_activity (agents READ ONLY — n8n_service writes)
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_cash_all ON cash_activity
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_cash_all ON cash_activity
    FOR ALL TO controller USING (true) WITH CHECK (true);
CREATE POLICY operations_cash_read ON cash_activity
    FOR SELECT TO operations USING (true);
CREATE POLICY agent_service_cash_read ON cash_activity
    FOR SELECT TO agent_service USING (true);
CREATE POLICY n8n_cash_rw ON cash_activity
    FOR ALL TO n8n_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_cash_read ON cash_activity
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- capital_accounts (highly sensitive)
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_cap_acct_all ON capital_accounts
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_cap_acct_all ON capital_accounts
    FOR ALL TO controller USING (true) WITH CHECK (true);
CREATE POLICY agent_service_cap_acct_write ON capital_accounts
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY investor_own_cap_acct ON capital_accounts
    FOR SELECT TO investor USING (investor_id = current_user);
CREATE POLICY powerbi_cap_acct_read ON capital_accounts
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- distributions
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_dist_all ON distributions
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_dist_all ON distributions
    FOR ALL TO controller USING (true) WITH CHECK (true);
CREATE POLICY agent_service_dist_rw ON distributions
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY investor_own_dist ON distributions
    FOR SELECT TO investor USING (investor_id = current_user);
CREATE POLICY powerbi_dist_read ON distributions
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- approvals (agents INSERT only; n8n_service updates status)
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_approvals_all ON approvals
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_approvals_rw ON approvals
    FOR ALL TO controller USING (true) WITH CHECK (true);
CREATE POLICY operations_approvals_read ON approvals
    FOR SELECT TO operations USING (true);
CREATE POLICY agent_service_approvals_insert ON approvals
    FOR INSERT TO agent_service WITH CHECK (true);
CREATE POLICY agent_service_approvals_read ON approvals
    FOR SELECT TO agent_service USING (true);
CREATE POLICY n8n_approvals_rw ON approvals
    FOR ALL TO n8n_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_approvals_read ON approvals
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- compliance_reviews
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_comp_all ON compliance_reviews
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY operations_comp_read ON compliance_reviews
    FOR SELECT TO operations USING (true);
CREATE POLICY agent_service_comp_rw ON compliance_reviews
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_comp_read ON compliance_reviews
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- agent_tasks
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_tasks_read ON agent_tasks
    FOR SELECT TO ceo_cio USING (true);
CREATE POLICY operations_tasks_read ON agent_tasks
    FOR SELECT TO operations USING (true);
CREATE POLICY agent_service_tasks_insert ON agent_tasks
    FOR INSERT TO agent_service WITH CHECK (true);
CREATE POLICY agent_service_tasks_read ON agent_tasks
    FOR SELECT TO agent_service USING (true);
CREATE POLICY n8n_tasks_rw ON agent_tasks
    FOR ALL TO n8n_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_tasks_read ON agent_tasks
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- agent_logs — APPEND ONLY: no UPDATE or DELETE for any role
-- ----------------------------------------------------------------
CREATE POLICY no_update_agent_logs ON agent_logs
    FOR UPDATE USING (false);
CREATE POLICY no_delete_agent_logs ON agent_logs
    FOR DELETE USING (false);
CREATE POLICY agent_service_logs_insert ON agent_logs
    FOR INSERT TO agent_service WITH CHECK (true);
CREATE POLICY n8n_logs_insert ON agent_logs
    FOR INSERT TO n8n_service WITH CHECK (true);
CREATE POLICY read_all_agent_logs ON agent_logs
    FOR SELECT USING (
        current_user IN ('ceo_cio', 'controller', 'operations', 'powerbi_readonly', 'auditor_readonly')
    );

-- ----------------------------------------------------------------
-- investor_reports
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_reports_all ON investor_reports
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_reports_read ON investor_reports
    FOR SELECT TO controller USING (true);
CREATE POLICY agent_service_reports_rw ON investor_reports
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_reports_read ON investor_reports
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- data_room_items
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_dr_items_all ON data_room_items
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY agent_service_dr_items_rw ON data_room_items
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY investor_dr_items_read ON data_room_items
    FOR SELECT TO investor USING (
        access_level = 'All LPs'
        OR current_user = ANY(authorized_investor_ids)
    );
CREATE POLICY powerbi_dr_items_read ON data_room_items
    FOR SELECT TO powerbi_readonly USING (true);

-- ----------------------------------------------------------------
-- data_room_access_log — APPEND ONLY
-- ----------------------------------------------------------------
CREATE POLICY no_update_dr_access_log ON data_room_access_log
    FOR UPDATE USING (false);
CREATE POLICY no_delete_dr_access_log ON data_room_access_log
    FOR DELETE USING (false);
CREATE POLICY agent_service_dr_log_insert ON data_room_access_log
    FOR INSERT TO agent_service WITH CHECK (true);
CREATE POLICY ceo_cio_dr_log_read ON data_room_access_log
    FOR SELECT TO ceo_cio USING (true);
CREATE POLICY auditor_dr_log_read ON data_room_access_log
    FOR SELECT TO auditor_readonly USING (true);

-- ----------------------------------------------------------------
-- risk_metrics
-- ----------------------------------------------------------------
CREATE POLICY ceo_cio_risk_all ON risk_metrics
    FOR ALL TO ceo_cio USING (true) WITH CHECK (true);
CREATE POLICY controller_risk_read ON risk_metrics
    FOR SELECT TO controller USING (true);
CREATE POLICY operations_risk_read ON risk_metrics
    FOR SELECT TO operations USING (true);
CREATE POLICY agent_service_risk_rw ON risk_metrics
    FOR ALL TO agent_service USING (true) WITH CHECK (true);
CREATE POLICY powerbi_risk_read ON risk_metrics
    FOR SELECT TO powerbi_readonly USING (true);

-- =============================================================================
-- VERIFICATION QUERIES (run after applying policies)
-- =============================================================================
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- Should return 26 rows (25 tables + access_log) all with rowsecurity = true
--
-- SELECT schemaname, tablename, policyname, roles, cmd
-- FROM pg_policies WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
-- Should return all policies listed above
