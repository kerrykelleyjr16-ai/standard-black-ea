# Skill: MCP Integration Builder

**Invoke when:** Kerry wants to connect a new MCP server or integrate a new app into the AI-OS.

---

## Inputs
- App or service to connect (Telegram, Notion, Twilio, etc.)
- What Kerry needs it to do
- Which direction: read from it, write to it, or both

## Workflow

### Step 1 — Research First
Before building anything, run `/research` on the target app:
- Does an MCP server exist for it?
- Is it available in Claude Code or via Zapier?
- What are the authentication requirements?
- Any known limitations?

### Step 2 — Define the Use Case
What specifically does this integration need to do?
- List the 3–5 most important actions needed
- Which existing workflows will this plug into?
- Who on the team will use it?

### Step 3 — Check MCP Registry
Read `ai-os/MCP_REGISTRY.md`:
- Is this already connected?
- Is there a similar tool already doing this?

### Step 4 — Plan the Integration
Document before building:
- Server name and type
- Access level required (Read / Write / Admin)
- Authentication method
- Actions to enable
- Any security considerations (see `ai-os/SECURITY_RULES.md`)

### Step 5 — Build or Configure
- If native Claude Code MCP: configure in settings
- If Zapier-based: enable the actions via Zapier-MCP
- If custom: route to `/architect` for design first

### Step 6 — Register and Test
- Add to `ai-os/MCP_REGISTRY.md` immediately after connecting
- Test with a low-risk action first
- Log in `ai-os/10-logs/decision_log.md`

## Output Format
Integration spec with: server name, access level, enabled actions, test result, registry entry.
