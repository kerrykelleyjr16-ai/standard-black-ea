# Skill: AI Router

**Invoke when:** Any task arrives and Kerry or Claude needs to decide which AI system handles it before work begins.

---

## Inputs
- Task description (what needs to be done)
- Optional: urgency level, domain (note business / car sales / Standard Black brand / team ops)

## Routing Logic

| Task Type | Route | Command |
|---|---|---|
| Build files, folders, automations, workflows, dashboards, scripts | Claude Code | `/build` |
| Strategy, architecture, planning, code review, business logic, prompt design | ChatGPT / Codex | `/architect` |
| Current info, tool docs, pricing, market data, APIs, competitor research, citations | Perplexity | `/research` |
| Security check or permission review | Claude Code + ChatGPT review | `/secure` |
| Full automation build (research → plan → build → review → finalize) | All three in sequence | `/automate` |

## Full Pipeline Order (for `/automate`)
1. Perplexity researches tools, docs, APIs
2. ChatGPT designs the plan and architecture
3. Claude Code builds it
4. ChatGPT reviews the build
5. Claude Code applies fixes
6. Perplexity verifies current data

## Output
State clearly:
- Which AI system owns this task
- What command to use
- What context to pass to that system (file paths, relevant docs, prior decisions)
- Whether human approval is required before proceeding (check `ai-os/HUMAN_APPROVAL_RULES.md`)
