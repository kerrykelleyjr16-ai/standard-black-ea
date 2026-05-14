-- =============================================================================
-- Migration 003: Seed Data
-- Fund: The Pinnacle Note Fund
-- Run AFTER 002_rls_policies.sql
-- =============================================================================

-- =============================================================================
-- Seed 1: Fund SPV (placeholder — update with real entity details)
-- =============================================================================

INSERT INTO spvs (spv_id, entity_name, entity_type, state_of_formation, status, notes)
VALUES (
    'SPV-001',
    'Standard Black Note Fund I LLC',
    'LLC',
    'TX',
    'Active',
    'Primary acquisition vehicle for Fund I. Update entity_name, EIN, and formation_date when entity is formed.'
)
ON CONFLICT (spv_id) DO NOTHING;

-- =============================================================================
-- Seed 2: All 50 US States with Foreclosure Timeline Data
-- judicial = true means court-supervised FC process (slower, more expensive)
-- avg_fc_months = average months from default to FC completion (industry estimates)
-- =============================================================================

INSERT INTO loan_tapes (tape_id, received_date, status, notes)
SELECT 'PLACEHOLDER', now()::date, 'Received', 'System placeholder — delete before first real tape'
WHERE NOT EXISTS (SELECT 1 FROM loan_tapes LIMIT 1);

-- States reference table (embedded in loans via property_state — no separate states table in final schema)
-- This seed documents FC timelines as a COMMENT for agent context.
-- Agents 07, 13, and 15 reference these timelines from the documentation layer.

-- State FC Timeline Reference (for agent system prompts and n8n workflows)
-- Format: state, judicial (T/F), avg_fc_months
-- AL: Non-Judicial, 1–3 months
-- AK: Non-Judicial, 3–4 months
-- AZ: Non-Judicial, 3–4 months
-- AR: Non-Judicial, 4–5 months
-- CA: Non-Judicial, 4–6 months
-- CO: Non-Judicial, 2–5 months
-- CT: Judicial, 6–14 months
-- DE: Judicial, 6–8 months
-- FL: Judicial, 8–12 months  *** KEY STATE — longest timeline; add buffer
-- GA: Non-Judicial, 1–3 months
-- HI: Judicial, 12–18 months
-- ID: Non-Judicial, 5–6 months
-- IL: Judicial, 7–10 months
-- IN: Judicial, 5–7 months
-- IA: Judicial, 5–6 months
-- KS: Judicial, 6–7 months
-- KY: Judicial, 6–8 months
-- LA: Judicial, 6–9 months
-- ME: Judicial, 6–10 months
-- MD: Judicial, 2–4 months (Deed of Trust state — expedited)
-- MA: Judicial, 3–4 months
-- MI: Non-Judicial, 2–3 months
-- MN: Non-Judicial, 2–3 months
-- MS: Non-Judicial, 1–3 months
-- MO: Non-Judicial, 2–4 months
-- MT: Non-Judicial, 5–6 months
-- NE: Judicial, 5–6 months
-- NV: Non-Judicial, 4–6 months
-- NH: Non-Judicial, 2–4 months
-- NJ: Judicial, 12–24 months *** KEY STATE — longest in US; high cost
-- NM: Judicial, 6–10 months
-- NY: Judicial, 24–36 months *** KEY STATE — longest; avoid unless deeply discounted
-- NC: Non-Judicial, 2–4 months
-- ND: Judicial, 3–6 months
-- OH: Judicial, 5–7 months
-- OK: Judicial, 4–6 months
-- OR: Non-Judicial, 5–6 months
-- PA: Judicial, 8–12 months
-- RI: Judicial, 12–18 months
-- SC: Judicial, 6–9 months
-- SD: Judicial, 6 months
-- TN: Non-Judicial, 2–3 months
-- TX: Non-Judicial, 1–2 months *** KEY STATE — fastest in US; favorable
-- UT: Non-Judicial, 4–5 months
-- VT: Judicial, 6–12 months
-- VA: Non-Judicial, 2–3 months
-- WA: Non-Judicial, 4–6 months
-- WV: Judicial, 4–6 months
-- WI: Judicial, 6–10 months
-- WY: Non-Judicial, 2–3 months

-- =============================================================================
-- Seed 3: Delete placeholder tape inserted above
-- =============================================================================
DELETE FROM loan_tapes WHERE tape_id = 'PLACEHOLDER';

-- =============================================================================
-- CONFIRMATION QUERIES
-- Run after seed to verify:
-- =============================================================================
-- SELECT COUNT(*) FROM spvs;            -- expect: 1
-- SELECT spv_id, entity_name FROM spvs; -- verify SPV-001 details
