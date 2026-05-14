# AI-OS Task Router

Routes every task to the right AI system before work begins. No task gets built before it gets routed.

---

## Routing Rules

| Task Type | Route To | Command |
|---|---|---|
| Building, coding, files, folders, automations, workflows, dashboards, scripts | Claude Code | `/build` |
| Strategy, planning, architecture, code review, debugging, business logic, prompt engineering | ChatGPT / Codex | `/architect` |
| Current info, web research, market data, tool docs, competitor analysis, pricing, APIs, citations | Perplexity | `/research` |
| Security and permission review | Claude Code + ChatGPT review | `/secure` |
| Automation design and build | All three (see pipeline below) | `/automate` |

---

## Single-System Tasks

### Claude Code Only
- Create or modify files, folders, project structure
- Write scripts, skills, workflows
- Build dashboards and templates
- Set up MCP servers and integrations
- Apply fixes from review

### ChatGPT / Codex Only
- Review architecture before building
- Evaluate prompts and agent logic
- Debug complex business logic
- Strategic planning and framework design
- Second-opinion on major decisions

### Perplexity Only
- Research tool pricing and availability
- Find current API documentation
- Verify best practices haven't changed
- Market research and competitor landscape
- Validate recommendations against current data

---

## Multi-System Pipeline (Full Build)

Use this for any major automation, agent, or system build:

```
1. /research  → Perplexity researches tools, docs, APIs, pricing
2. /architect → ChatGPT plans and designs the system
3. /build     → Claude Code builds it
4. /review    → ChatGPT reviews the build, flags weaknesses
5. /build     → Claude Code applies fixes and finalizes
6. /research  → Perplexity verifies any current info or docs
```

---

## Command Reference

| Command | Action |
|---|---|
| `/research [topic]` | Perplexity research task |
| `/architect [task]` | ChatGPT/Codex planning and architecture |
| `/build [task]` | Claude Code build task |
| `/review [what to review]` | ChatGPT/Codex review |
| `/automate [workflow]` | Full pipeline: research → architect → build → review → finalize |
| `/secure [what to check]` | Security and permission review |
| `/daily` | Daily command center |
| `/weekly` | Weekly business review |

---

## Lock Rule
Only one AI system edits any given file at a time. All context must be written to shared files before handoff. All decisions must be logged in `10-logs/`.
