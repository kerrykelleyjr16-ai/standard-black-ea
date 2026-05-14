# AI-OS Agent Registry

All AI systems and domain agents operating within Standard Black / Kasino Family AI-OS.

---

## Tier 1 — Orchestration Layer (This System)

### Claude Code — Primary Builder
- **Role:** Builder and executor. Creates files, folders, agents, skills, workflows, scripts, dashboards, and automation specs. Updates the codebase and project structure.
- **Invoke:** Directly in Claude Code terminal
- **Strengths:** File system access, MCP integrations, persistent memory, skill execution
- **Do not use for:** Strategic architecture (use ChatGPT), current web data (use Perplexity)

### ChatGPT / OpenAI Codex — Architect & Reviewer
- **Role:** Strategic architect and code reviewer. Reviews plans, architecture, prompts, logic, security, and automation design. Acts as second-opinion reasoning layer before major changes.
- **Invoke:** chatgpt.com or API
- **Strengths:** Long-form reasoning, code review, prompt engineering, business logic
- **Do not use for:** File building (use Claude Code), live web research (use Perplexity)

### Perplexity — Research Engine
- **Role:** Research and verification. Finds current tool docs, pricing, best practices, APIs, market research, and citations. Validates whether recommendations are outdated.
- **Invoke:** perplexity.ai
- **Strengths:** Real-time web access, source-backed summaries, current API docs
- **Do not use for:** Building (use Claude Code), strategic planning (use ChatGPT)

---

## Tier 2 — Domain Agents (Note Fund AI-OS)

Located in: `../pinnacle-note-fund-ai-os/agents/`

| # | Agent | Function |
|---|---|---|
| 01 | Chief Operating Coordinator | Orchestrates all note fund workflows |
| 02 | Acquisitions & Seller Relations | Deal sourcing, tape intake, seller outreach |
| 03 | Credit & Underwriting | Borrower analysis, credit review |
| 04 | Pricing & Tape Analytics | Tape screening, bid pricing |
| 05 | Diligence, Collateral & Closing | Title, legal, collateral, closing |
| 06 | Performing Portfolio & Cashflow | Asset management, cashflow tracking |
| 07 | Workout, Loss Mitigation & REO | NPL resolution, loss mitigation |
| 08 | Servicer, Counsel & Vendor Oversight | Vendor and servicer management |
| 09 | QA, Exceptions & Boarding | Quality control, loan boarding |
| 10 | Fund Controller & SPV Accounting | Fund accounting, SPV management |
| 11 | Cash Controls, Distributions & Treasury | Cash management, LP distributions |
| 12 | Capital Markets, Facility & Securitization | Facility management, securitization |
| 13 | Risk Analytics & Stress Testing | Portfolio risk, stress testing |
| 14 | Compliance, Marketing & Disclosure | Regulatory compliance, marketing review |
| 15 | Conflicts, Audit & Governance | Governance, conflict of interest |
| 16 | Investor Relations, Sales & Client Service | LP communications, investor reporting |
| 17 | DDQ, Data Room & Investor Reporting | Due diligence, data room management |
| 18 | Data, Automation, Dashboards & Security | Tech infrastructure, automation, security |

---

## Adding New Agents
When a new domain agent is needed:
1. Define it in this file first
2. Route to ChatGPT to design the agent spec
3. Route to Claude Code to build the SKILL.md or agent file
4. Log the addition in `10-logs/`
