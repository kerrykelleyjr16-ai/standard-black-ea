# Note Business Operating System

**Status:** CONSOLIDATED — Live system lives at `pinnacle-note-fund-ai-os/`

---

The note business operating system has been built and is active. All SOPs, agent architecture, underwriting frameworks, database schema, and automation planning are housed in the Pinnacle Note Fund AI OS directory.

**Go here:** `pinnacle-note-fund-ai-os/`

---

## What's Live

### Agent Layer (Sprint 1 — COMPLETE)
All 18 Anthropic Managed Agents are live. See `pinnacle-note-fund-ai-os/agents_registry.md` for agent IDs and assignments.

Key agents for the note business workflow:
- **Agent 02** — Tape intake, seller outreach, LOI
- **Agent 03** — Borrower credit analysis, health scores, IC memo
- **Agent 04** — IRR/MOIC modeling, bid recommendations
- **Agent 05** — Title, legal, collateral, closing
- **Agent 06** — Performing portfolio, monthly servicer review
- **Agent 07** — NPL strategy, foreclosure, short sale, DIL

### Database Layer (Sprint 2 — IN PROGRESS)
Migration files written and ready. Awaiting Supabase project creation.
- `001_initial_schema.sql` — 25 tables, full FK dependency order
- `002_rls_policies.sql` — 8 roles, deny-all default, per-table grants
- `003_seed_data.sql` — SPV-001 seed, all 50 state FC timelines

**Action required:** Create Supabase project at supabase.com → share URL + service role key → run migrations in order.

### Remaining Sprints (Not Started)
- Sprint 3: Airtable Command Center (10 bases, 7 interfaces)
- Sprint 4: n8n Automation Engine (18 workflows)
- Sprint 5: Power BI Dashboards (15 dashboards)
- Sprint 6: Security hardening + end-to-end testing

---

## Key Dates
- Sprint 1: COMPLETE (2026-05-08)
- Sprint 2: Target Q2 2026
- Fund I launch readiness: Phase II (3–5 yr timeline)

## Reference
- `pinnacle-note-fund-ai-os/` — Full OS directory
- `references/long-term-portfolio-playbook.md` — Portfolio strategy and fund design
