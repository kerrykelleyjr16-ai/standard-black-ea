# Pinnacle Note Fund AI OS — Agent Routing Guide

**Purpose:** Route every task to the right agent or system before work begins.
**Agent IDs:** See `agents_registry.md` for all 18 Pinnacle agent IDs and API usage.

---

## Routing Rules

| Task Type | Route To | Tool / Method |
|---|---|---|
| Airtable setup, schema, views, automations, CRM records, deal/task/database work | Airtable Systems Agent (Claude Code + airtable skills) | Claude Code → `ai-os/07-integrations/airtable/` |
| Simple automation (trigger → action, Zapier-level) | Zapier Automation Agent (Claude Code + Zapier-MCP) | `/automate` → `zapier_phase_1_plan.md` |
| Advanced multi-step automation, complex workflows, high-volume | n8n Phase II Agent — DO NOT BUILD YET | Defer to Phase II |
| Notion structure, SOPs, team docs, company brain, brand content | Notion Knowledge Agent (Claude Code + document-creation skill) | `/build` → Notion pages |
| Deal screening, IC memo, bid pricing, underwriting analysis | Note Underwriting Agent → Agent 04 (Pricing) + Agent 03 (UW) | `note-investing-underwriter` skill → Agents 03, 04 |
| Human-readable documents, SOPs, memos, frameworks | Documentation Agent (Claude Code + document-creation skill) | `document-creation` or `sop-builder` skill |
| Security check, approval gate, permission review | Security Review Agent (Claude Code + security-approval-gate skill) | `security-approval-gate` skill → `human_approval_rules.md` |
| Architecture, strategy, code review, business logic | ChatGPT / Codex | `CHATGPT_REVIEW.md` prompt templates |
| Live research, tool docs, market data, API verification | Perplexity | `research-summarizer` skill |

---

## Pinnacle Note Fund — 18 Domain Agents

These are live Anthropic Managed Agents. See `agents_registry.md` for IDs.

| Agent | Domain | When to Invoke |
|---|---|---|
| Agent 01 — Chief Operating Coordinator | Orchestration | Daily briefing, cross-agent coordination |
| Agent 02 — Acquisitions & Seller Relations | Deal sourcing | New tape intake, seller outreach, LOI drafting |
| Agent 03 — Credit Underwriting | Underwriting | Borrower analysis, payment history, credit review |
| Agent 04 — Pricing & Tape Analytics | Pricing | Bid modeling, IRR analysis, max bid calculation |
| Agent 05 — Diligence, Collateral & Closing | Diligence | Title, legal, collateral, exception review |
| Agent 06 — Performing Portfolio & Cashflow | Asset management | Monthly servicer review, cashflow tracking |
| Agent 07 — Workout, Loss Mitigation & REO | NPL | Resolution strategy, foreclosure, modification |
| Agent 08 — Servicer, Counsel & Vendor | Vendor oversight | SLA tracking, vendor scorecards, issue logs |
| Agent 09 — QA, Exceptions & Boarding | Boarding | Loan boarding QA, exception clearance |
| Agent 10 — Fund Controller & SPV Accounting | Accounting | NAV, SPV financials, capital accounts |
| Agent 11 — Cash Controls, Distributions & Treasury | Treasury | Cash management, LP distribution calculation |
| Agent 12 — Capital Markets, Facility & Securitization | Capital | Facility management, securitization prep |
| Agent 13 — Risk Analytics & Stress Testing | Risk | Portfolio risk, scenario analysis |
| Agent 14 — Compliance, Marketing & Disclosure | Compliance | Marketing review, disclosure clearance |
| Agent 15 — Conflicts, Audit & Governance | Governance | Control tests, audit trail, conflicts |
| Agent 16 — Investor Relations, Sales & Client Service | LP relations | LP communication, onboarding, CRM |
| Agent 17 — DDQ, Data Room & Investor Reporting | Reporting | Quarterly reports, DDQ responses, data room |
| Agent 18 — Data, Automation, Dashboards & Security | Infrastructure | Data ops, automation, dashboards, security |

---

## Decision Flow

```
Task arrives
    ↓
Is it a security/approval check? → security-approval-gate skill → STOP if approval required
    ↓
Is it a build task? → Claude Code
    ↓
Is it a strategy/review task? → ChatGPT
    ↓
Is it a research task? → Perplexity
    ↓
Is it a note fund domain task? → Route to specific Pinnacle agent (01–18)
    ↓
Is it Airtable? → airtable skills + ai-os/07-integrations/airtable/ specs
    ↓
Is it automation? → Zapier (Phase I) or n8n (Phase II)
    ↓
Is it Notion? → document-creation or sop-builder skill
```

---

## Hard Rules for All Agents

1. No agent sends external communications without Kerry's approval
2. No agent authorizes money movement of any kind
3. No agent deletes records without Kerry's confirmation
4. All consequential decisions → `ai-os/10-logs/approval_log.md`
5. All security checks → `security/human_approval_rules.md`
6. One agent / one AI system edits any file at a time

---

## API Reference

Agent sessions: `POST https://api.anthropic.com/v1/agents/{agent_id}/sessions`
Required header: `anthropic-beta: managed-agents-2026-04-01`
All agent IDs: `agents_registry.md`
