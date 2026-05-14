# Standard Black AI-OS — Tech Stack

Full tool map for the AI Operating System. Every tool has a defined role. No overlap, no redundancy.

---

## Stack Overview

| Tool | Role | Status |
|---|---|---|
| Claude Code | Primary builder and executor | Live |
| ChatGPT / Codex | Strategic architect + code reviewer | Live (manual) |
| Perplexity | Live research + verification engine | Live (manual) |
| VS Code | Command center — where all work happens | Live |
| MCP | Connection layer — links Claude to all other tools | Live (partial) |
| GitHub | Version control — all files tracked and versioned | Live |
| Supabase | Memory + database — persistent structured data | Planned |
| Notion | Company brain — docs, SOPs, knowledge base | Planned |
| Airtable | Task / CRM / deal pipeline | Planned |
| n8n | Automation engine — workflows and triggers | Planned |

---

## Tool Roles (Detailed)

### Claude Code — Builder
Builds everything. Files, skills, agents, automations, dashboards, scripts. Lives in VS Code. Connects to all other tools via MCP. Primary workspace: `E.A/`

### ChatGPT / Codex — Architect
Reviews architecture before building. Debugs logic. Writes strategy. Second-opinion layer before major decisions. Invoke via `code-review-coordinator` skill or `CHATGPT_REVIEW.md` prompt templates.

### Perplexity — Research
Live web access. Use before every tool selection, integration build, or market decision. Invoke via `research-summarizer` skill. Save findings to `ai-os/01-context/`.

### VS Code — Command Center
Where Kerry and Claude Code operate. All file editing, skill invocation, and session work happens here. Claude Code extension runs inside VS Code.

### MCP — Connection Layer
The pipes that connect Claude Code to external tools. Currently connected: Gmail, Google Calendar, Google Drive, Zapier. Planned: Supabase, Notion, Airtable, n8n. Every new connection logged in `MCP_REGISTRY.md`.

### GitHub — Version Control
Git tracks all files in `E.A/`. Every significant build gets committed. Sensitive files (.env, CLAUDE.local.md) are gitignored. Branch strategy: main = stable, feature branches for major builds.

### Supabase — Database Layer
Structured persistent memory beyond what fits in markdown files. Use for:
- Note deal records (full dataset)
- Borrower and servicer contact data
- Portfolio performance metrics
- LP and investor records (Phase II+)
- Any data that needs to be queried, not just read

Schema blueprint: `../pinnacle-note-fund-ai-os/tech_stack/supabase_database_schema.md`

### Notion — Company Brain
Central knowledge base for Standard Black. Use for:
- Company-level SOPs and playbooks
- Team onboarding docs
- Meeting notes and decisions (public-facing version)
- Standard Black brand guidelines
- Investor-facing materials staging

Distinct from the EA workspace (Claude Code files) — Notion is the human-readable, team-shareable layer.

### Airtable — Operations Layer
Structured data for active operations. Use for:
- Note deal pipeline (tape → screen → underwrite → close)
- CRM (sellers, servicers, brokers, investors)
- Task management for Kody and TJ
- Team payment tracking

Blueprint: `../pinnacle-note-fund-ai-os/tech_stack/airtable_command_center.md`

### n8n — Automation Engine
Self-hosted workflow automation. More powerful than Zapier for complex multi-step automations. Use for:
- Deal alert pipelines (new tape → screen → Slack)
- Portfolio monitoring triggers
- Automated reporting
- Cross-tool data sync (Airtable ↔ Supabase ↔ Notion)

Note: Zapier-MCP handles simple automations now. n8n is the Phase II upgrade for complex, high-volume workflows.

Blueprint: `../pinnacle-note-fund-ai-os/tech_stack/n8n_automation_blueprint.md`

---

## Integration Map

```
VS Code (Command Center)
    └── Claude Code (Builder)
            ├── MCP → Gmail
            ├── MCP → Google Calendar
            ├── MCP → Google Drive
            ├── MCP → Zapier → Slack
            ├── MCP → Zapier → Google Sheets (Deal Tracker)
            ├── MCP → Supabase [PLANNED]
            ├── MCP → Notion [PLANNED]
            ├── MCP → Airtable [PLANNED]
            └── MCP → n8n [PLANNED]

GitHub (Version Control)
    └── Tracks all E.A/ files (except .env, local overrides)

ChatGPT (Architect) ←→ Claude Code via manual context handoff
Perplexity (Research) ←→ Claude Code via research-summarizer skill
```

---

## Implementation Order

### Phase I — Now (Active build)
- [x] Claude Code + VS Code
- [x] MCP: Gmail, Calendar, Drive
- [x] Zapier → Slack + Google Sheets
- [x] GitHub version control
- [ ] **Notion:** Set up company brain structure (next priority)
- [ ] **Airtable:** Build deal pipeline + CRM base (next priority)

### Phase II — When deal volume justifies it
- [ ] Supabase: Database schema from blueprint
- [ ] n8n: Self-hosted automation engine replacing/augmenting Zapier
- [ ] MCP connections for Supabase, Notion, Airtable

### Phase III — Fund I launch readiness
- [ ] Full n8n automation pipeline
- [ ] Investor reporting automation
- [ ] LP data management in Supabase

---

## Zapier vs. n8n

Both handle automation. Here's when to use each:

| Scenario | Use |
|---|---|
| Simple trigger → action (new row → Slack) | Zapier (already connected) |
| Multi-step, conditional, complex logic | n8n |
| Connecting apps without MCP servers | Zapier |
| High-volume, self-hosted, custom logic | n8n |
| Right now, Phase I | Zapier |
| Phase II+ at scale | n8n |

---

*Last updated: 2026-05-06*
