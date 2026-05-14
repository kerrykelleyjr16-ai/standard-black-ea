# Skill: SOP Builder

**Invoke when:** Kerry needs to document a repeatable process as a Standard Operating Procedure — for the note business, team operations, or any Standard Black workflow.

---

## Inputs
- Process name
- Domain (note business / team ops / Standard Black brand / entity management)
- Who performs this process (Kerry / Kody / TJ / AI)
- Rough description of the steps (even if informal)
- How often it runs (daily / weekly / per deal / per investor)

## Workflow

### Step 1 — Define the Process Scope
Establish:
- What triggers this process?
- What does done look like?
- Who owns it?
- What systems or tools are involved?
- What must never happen? (failure modes)

### Step 2 — Map the Steps
Write every step in plain language:
- Start with the trigger
- Number each action
- Note who does it and with what tool
- Flag any decision points (if X, then Y)
- End with a clear completion criteria

### Step 3 — Add Guardrails
For each SOP, note:
- What requires human approval before proceeding
- What gets logged and where
- What to do if something goes wrong

### Step 4 — Format the SOP
Standard format:
```
# SOP: [Process Name]
**Owner:** [Kerry / Kody / TJ / AI]
**Frequency:** [Per deal / Weekly / Monthly]
**Trigger:** [What starts this]
**Done when:** [Clear completion criteria]

## Steps
1. ...
2. ...

## Guardrails
- [Approval requirements]
- [What gets logged]
- [Failure handling]

## Last Updated: [Date]
```

### Step 5 — Save and Register
- Note business SOPs → `projects/note-business-system/` or `ai-os/08-sops/`
- Team ops SOPs → `references/`
- Log the creation in `decisions/log.md`

## Output Format
Complete SOP document, ready to use.
