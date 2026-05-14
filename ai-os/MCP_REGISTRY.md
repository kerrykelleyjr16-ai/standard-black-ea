# MCP Server Registry

Every MCP server connected to the Standard Black AI-OS. Log here before use.

---

## Connected Servers

| Server | Scope | Access Level | Connected | Notes |
|---|---|---|---|---|
| Gmail | Project | Read + Write | 2026-04-21 | Kerry's primary email: kerrykelleyjr16@gmail.com |
| Google Calendar | Project | Read + Write | 2026-04-21 | Primary calendar for Standard Black operations |
| Google Drive | Project | Read + Write | 2026-04-21 | Key folder: Real E. Note Docs. (ID: 1lXIQEbftzqndzdsbDNXEy97eCaVGmLhR) |
| Zapier-MCP | User | Read + Write | 2026-05-06 | Connects Slack, Google Sheets, Drive automation |
| Docusign | — | — | Not yet | Available but not authenticated |

---

## Zapier-Connected Apps

| App | Actions Enabled | Notes |
|---|---|---|
| Slack | Send Channel Message, Send DM, and 30+ others | #team-notifications: C0B1Z4HA3C6 |
| Google Sheets | Note Deal Tracker (ID: 1nQEyqLyG5aJsyOimPaHKbaRr-6fOTsGxpozqioM3EBI) | 36-column tracker |
| Google Drive | Move file, full Drive automation | Mapped to Real E. Note Docs. folder |

---

## Planned MCP Servers

| Server | Use Case | Priority | Blueprint |
|---|---|---|---|
| Notion | Company brain — SOPs, team docs, knowledge base | High — Phase I | Build structure first at notion.so |
| Airtable | Deal pipeline, CRM, task management | High — Phase I | `../pinnacle-note-fund-ai-os/tech_stack/airtable_command_center.md` |
| Supabase | Persistent database — deals, contacts, portfolio metrics | Medium — Phase II | `../pinnacle-note-fund-ai-os/tech_stack/supabase_database_schema.md` |
| n8n | Complex automation engine — replaces Zapier at scale | Medium — Phase II | `../pinnacle-note-fund-ai-os/tech_stack/n8n_automation_blueprint.md` |
| GitHub | Version control MCP for repo management from Claude | Low — optional | Already using git directly |
| Telegram | Team communication integration | Low | Kerry has Telegram; integration pending |
| Twilio | SMS deal alerts and reminders | Low — Phase II | — |

---

## Rules
- Every new MCP server must be logged here before use
- Access level must be noted (Read / Write / Admin)
- Servers with Write access to external systems require human approval for sensitive actions
- Review this registry quarterly — remove unused servers
