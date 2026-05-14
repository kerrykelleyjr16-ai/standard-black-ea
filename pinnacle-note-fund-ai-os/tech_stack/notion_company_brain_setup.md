# Notion Company Brain — Setup Guide
## Standard Black | Kasino Family Holdings

---

## Purpose

Notion is the human-readable company brain. It is not a database, not a system of record, and not an operational tool. It exists so that Kerry, Kody, and TJ can read, understand, and navigate the business without needing to access Airtable, code files, or raw data.

**Airtable = operations. Notion = clarity.**

---

## Page Hierarchy

```
Standard Black (Workspace Root)
├── Company Overview
├── Mission, Vision & Values
├── Business Units
├── Current Projects
├── Team Directory
├── SOP Library
├── Team Docs
├── Brand Guidelines
├── Meeting Notes
├── Weekly Updates
├── Decision Log
├── Tool Stack
├── Login / Access Tracker          [Kerry only]
├── Airtable Dashboard Links
└── Automation Status
```

---

## Page-by-Page Breakdown

### Company Overview
**Purpose:** The front door. Anyone who joins the team reads this first.

**Content:**
- What Standard Black is
- What Kasino Family Holdings is
- Entity structure (simple diagram)
- Current build phase (Phase I)
- How the company makes money today (car sales → reserves)
- Long-range destination

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Mission, Vision & Values
**Purpose:** The operating philosophy. Shapes every decision.

**Content:**
- Mission statement
- Vision (10-year picture)
- Core values (3–5 principles, not platitudes)
- What Standard Black stands for publicly
- What it means internally for the team

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Business Units
**Purpose:** Map of every active and planned business line.

**Content:**
- Note Fund — status, phase, deal count
- Operating company acquisitions — status, targets
- Public markets — status (future)
- Car sales — current income source, not a business unit
- Each unit: one paragraph + current status

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Current Projects
**Purpose:** What the team is actively working on right now.

**Content:**
- One project brief per active initiative (use `project_brief_template.md`)
- Status: Active / On Hold / Complete
- Owner, objective, timeline
- Open items and blockers

**Who can edit:** Kerry, Kody (for projects assigned to them)
**Who can read:** Kody, TJ

---

### Team Directory
**Purpose:** Who's on the team, what they own, how to reach them.

**Content:**
- One profile per team member (use `team_member_profile_template.md`)
- Kerry — CEO & Chairman
- Kody — CEO in Training
- TJ — Execution (role TBD formally)

**Who can edit:** Kerry (manages all profiles)
**Who can read:** Kody, TJ

---

### SOP Library
**Purpose:** Every repeatable workflow documented so TJ or Kody can execute without asking Kerry.

**Content:**
- One SOP per workflow (use `sop_template.md`)
- Initial SOPs to write: deal intake, tape screen, weekly review, contact follow-up, document filing, team meeting run-of-show
- Each SOP should be executable without prior context

**Who can edit:** Kerry, Kody (for SOPs they own)
**Who can read:** Kody, TJ

---

### Team Docs
**Purpose:** Internal documents the team references regularly.

**Content:**
- Team operating framework (roles, meeting cadence, accountability rules)
- Payment structure document
- Delegation model
- Communication norms (Slack channels, response times, escalation path)

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Brand Guidelines
**Purpose:** The rules for how Standard Black looks and sounds, publicly and internally.

**Content:**
- Brand voice and tone
- Logo usage rules
- Color palette
- Typography
- Writing do's and don'ts
- Examples of on-brand vs off-brand

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Meeting Notes
**Purpose:** A running log of every team meeting so nothing is lost.

**Content:**
- One page per meeting (use `meeting_notes_template.md`)
- Thursday check-ins, 2nd Sunday strategy, 4th Sunday accountability
- Decisions made, action items, owners, due dates

**Who can edit:** Kerry, Kody
**Who can read:** TJ (read-only after meetings he attended)

---

### Weekly Updates
**Purpose:** Weekly business pulse — what moved, what's next.

**Content:**
- One entry per week (use `weekly_update_template.md`)
- Written by Kerry or generated from Friday review session
- Not a journal — just: done, in progress, blockers, next 3

**Who can edit:** Kerry
**Who can read:** Kody, TJ

---

### Decision Log
**Purpose:** Institutional memory. Every meaningful decision with its reasoning.

**Content:**
- One entry per decision (use `decision_log_template.md`)
- Format: Date | Decision | Reasoning | Context
- Mirrors what's in `decisions/log.md` in the codebase — paste here weekly

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Tool Stack
**Purpose:** What tools the company uses, why, and who has access.

**Content:**
- One entry per tool (use `tool_access_template.md`)
- Do NOT include passwords or API keys here
- Tools: Claude Code, Airtable, Notion, Zapier, Slack, Google Workspace, GitHub

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Login / Access Tracker
**Purpose:** Where the actual credentials and API key references live.

**Content:**
- Tool | Login method | Where credentials are stored | Who has access
- Do NOT paste passwords — note where they live (e.g., "in .env file", "1Password", "Kerry's phone")

**Who can edit:** Kerry only
**Who can read:** Kerry only — this page is private

---

### Airtable Dashboard Links
**Purpose:** Direct links to live Airtable views so Kody and TJ can jump straight to what they need.

**Content:**
- Active Pipeline view (Deals)
- Kody's Queue (Tasks)
- TJ's Queue (Tasks)
- Follow-Up Due (Contacts)
- Deadline Watch (Deals)
- Overdue Tasks (Tasks)
- Current Automations (Automations)

**How it works:** Copy the shareable view link from each Airtable view → paste here. This is read-only access with no login required for Kody/TJ if using a shared view link.

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

### Automation Status
**Purpose:** Human-readable version of the automation registry. Non-technical team members can see what's running without opening Airtable.

**Content:**
- Table of all Phase I Zapier automations with status (use `automation_status_template.md`)
- Last updated date
- What each automation does in plain English
- Who to contact if something looks wrong

**Who can edit:** Kerry only
**Who can read:** Kody, TJ

---

## Permission Structure Summary

| Page | Kerry | Kody | TJ |
|---|---|---|---|
| Company Overview | Edit | Read | Read |
| Mission, Vision & Values | Edit | Read | Read |
| Business Units | Edit | Read | Read |
| Current Projects | Edit | Edit (assigned) | Read |
| Team Directory | Edit | Read | Read |
| SOP Library | Edit | Edit (owned SOPs) | Read |
| Team Docs | Edit | Read | Read |
| Brand Guidelines | Edit | Read | Read |
| Meeting Notes | Edit | Edit | Read |
| Weekly Updates | Edit | Read | Read |
| Decision Log | Edit | Read | Read |
| Tool Stack | Edit | Read | Read |
| Login / Access Tracker | Edit | No access | No access |
| Airtable Dashboard Links | Edit | Read | Read |
| Automation Status | Edit | Read | Read |

---

## How Notion Connects to Airtable

**Phase I (Manual sync — current):**
- Kerry or an assistant copies high-level summaries from Airtable into Notion weekly
- What moves: deal outcomes (summary only), new contacts added, decisions made, new SOPs
- What never moves: borrower data, investor details, financial deal records, tape files

**Phase II (Zapier sync — after Airtable + Zapier are fully live):**
- ZAP: When a deal closes in Airtable → create a page in Notion Deal History section
- ZAP: When a new SOP is created in Notion → send Slack notification
- ZAP: When a vendor is added in Airtable → add to Notion Vendor section

**The rule that never changes:** Airtable is the system of record. Notion is the human-readable layer. If data conflicts, Airtable wins.

---

## Setup Order (Follow This Sequence)

1. Create the Notion workspace: "Standard Black"
2. Create all 15 pages in the exact order listed in the hierarchy
3. Set permissions for each page (Kerry admin, Kody full member, TJ limited)
4. Paste initial content using templates in `notion/templates/`
5. Add Airtable shared view links to the Airtable Dashboard Links page
6. Walk Kody through the workspace so he can navigate independently
7. Walk TJ through SOP Library and his Queue links specifically

**Do not build Zapier sync until Airtable is live and Zapier Phase I is complete.**
