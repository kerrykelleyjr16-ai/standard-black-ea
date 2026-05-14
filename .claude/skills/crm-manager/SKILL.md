# Skill: CRM Manager

**Invoke when:** Kerry needs to track, update, or action contacts — note sellers, servicers, brokers, investors, or business acquisition targets.

---

## Inputs
- Contact name and type (seller / servicer / broker / investor / acquisition target)
- Current status or last interaction
- What action is needed

## Contact Categories

| Type | Purpose | Priority |
|---|---|---|
| Note Sellers | Tape sources, direct sellers | High |
| Servicers | Loan servicing partners | High |
| Note Brokers | Deal flow intermediaries | High |
| Investors / LPs | Fund capital partners (future) | Medium |
| Legal Counsel | Foreclosure attorneys by state | Medium |
| Acquisition Targets | HVAC, plumbing, construction, trucking companies | Low — Phase III+ |

## Workflow

### Step 1 — Log the Contact
Capture:
- Name / Company
- Type
- Contact info (if provided)
- Source (where Kerry found them or who introduced them)
- First interaction date

### Step 2 — Track the Relationship
Status options:
- Cold — no contact yet
- Outreach sent — waiting on response
- Active conversation — ongoing dialogue
- Deal in progress — active transaction
- Relationship maintained — no active deal, staying warm
- Inactive — no recent contact

### Step 3 — Set Next Action
Every contact needs a next action with a date:
- Follow up on [date]
- Send tape request by [date]
- Schedule call by [date]

### Step 4 — Outreach Drafts
If Kerry needs outreach, invoke `follow-up-messages` or `cold-call-scripts` skill as appropriate.

### Step 5 — Flag for Approval
Any external communication drafted here goes through `email-draft-reviewer` before sending.

## Output Format
Contact card:
- Name / Company / Type / Status / Last Contact / Next Action / Notes
