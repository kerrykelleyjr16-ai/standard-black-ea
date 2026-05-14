# Skill: Automation Planner

**Invoke when:** Kerry wants to automate a workflow, trigger, or recurring task — before any automation is built.

---

## Inputs
- What should be automated (describe the manual process)
- What triggers it (new data, time, event, status change)
- What should happen as a result
- Which systems are involved

## Workflow

### Step 1 — Document the Manual Process
Map the current manual steps:
1. What triggers this today?
2. What happens next?
3. Who does it?
4. How long does it take?
5. What could go wrong?

### Step 2 — Design the Automation
Define:
- **Trigger:** What starts it (new row, schedule, status change, file upload)
- **Action:** What happens (send Slack message, update spreadsheet, create file, send email)
- **Tool:** Which platform handles it (Zapier, Google Apps Script, MCP, n8n)
- **Error handling:** What happens if it fails

### Step 3 — Check Approval Requirements
Does this automation touch any of the following?
- Money or payments → Requires Kerry's approval
- External emails or messages → Requires Kerry's approval
- Investor or LP data → Requires Kerry's approval
- Public publishing → Requires Kerry's approval

If yes → stop and flag before building.

### Step 4 — Register the Automation
Add the planned automation to `ai-os/AUTOMATION_REGISTRY.md` with status "Planned" before any build begins.

### Step 5 — Route to Build
Once documented and approved:
- Simple Zapier zap → `/build` with Zapier instructions
- Complex multi-step → `/architect` with ChatGPT first, then `/build`

## Output Format
Automation spec:
- Name
- Trigger
- Action
- Tool
- Approval required: Yes / No
- Status: Planned → Approved → Active
