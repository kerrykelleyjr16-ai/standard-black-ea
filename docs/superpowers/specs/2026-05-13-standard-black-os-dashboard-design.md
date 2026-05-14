# Standard Black OS Dashboard — Design Spec
**Date:** 2026-05-13  
**Status:** Approved  
**Owner:** Kerry Kelley Jr

---

## Overview

A Vite React operator dashboard for Kerry Kelley Jr to manage the full Standard Black / Kasino Family Holdings ecosystem. Replaces the Pinnacle OS prototype (single JSX file) with a properly structured app using Standard Black's brand system, real venture data, and fully wired interactive components.

**Lives at:** `standard-black-os/` (new top-level directory in `E.A/`)  
**Runs:** locally via `npm run dev` → `localhost:5173`  
**Data:** localStorage-backed until Supabase is connected  
**Deployment:** standalone; matches Standard Black website design language; links to `standard-black-scale.lovable.app`

---

## Architecture

### File Structure

```
standard-black-os/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx                  ← React Router root
│   ├── tokens.js                ← Standard Black design tokens
│   ├── data.js                  ← ventures, skills, automations (localStorage-backed)
│   ├── pages/
│   │   ├── Dashboard.jsx        ← main command center
│   │   └── VentureDetail.jsx    ← per-venture full detail page
│   └── components/
│       ├── Header.jsx
│       ├── StatCard.jsx
│       ├── VentureRow.jsx
│       ├── SkillButton.jsx
│       ├── ActivityLog.jsx
│       ├── ConfigPanel.jsx
│       └── NewSkillModal.jsx
└── src/
    └── index.css                ← Google Fonts import, base reset
```

### Routing

| Route | Component | Description |
|---|---|---|
| `/` | `Dashboard.jsx` | Main command center |
| `/venture/:id` | `VentureDetail.jsx` | Full detail page for a specific venture |

### Data Layer

All state lives in `data.js` with localStorage persistence. Shape:

```js
{
  ventures: [...],      // venture definitions + KPI values
  skills: [...],        // registered skills
  automations: [...],   // automation definitions + toggle state
  activity: [...]       // activity log entries
}
```

No backend required. KPI values editable via ConfigPanel → Tab 1. When Supabase is connected in Sprint 2+, `data.js` becomes the API layer.

---

## Design Tokens (`tokens.js`)

### Colors

```js
export const C = {
  bg:        "#050505",   // Standard Black
  surface:   "#111111",   // Standard Charcoal
  surface2:  "#1A1A1A",   // Standard Graphite
  border:    "#222222",
  borderHi:  "#333333",
  text:      "#F5F1E8",   // Standard Ivory
  sub:       "rgba(245,241,232,0.65)",
  mute:      "rgba(245,241,232,0.35)",
  dim:       "#333333",
  gold:      "#C9A24A",   // Standard Gold
  goldHi:    "#E8BE6A",
  goldDim:   "rgba(201,162,74,0.2)",
  green:     "#3ea676",
  red:       "#c0504d",
};
```

### Typography

```js
export const f = {
  display: "'Cinzel', 'Cormorant Garamond', Georgia, serif",
  body:    "'Inter', 'Helvetica Neue', system-ui, sans-serif",
  mono:    "'JetBrains Mono', 'SF Mono', Menlo, monospace",
};
```

Google Fonts import: Cinzel (400/500/600/700) + Inter (300/400/500/600/700) + JetBrains Mono (400/500).

**Key change from prototype:** Fraunces → Cinzel, DM Sans → Inter, purple accent removed, gold updated to `#C9A24A`.

---

## Content

### Ventures (6)

| ID | Name | Status | Priority | KPI Label | KPI Value | Target |
|---|---|---|---|---|---|---|
| `fund` | Note Fund I | active | 1 | Capital Raised | $0 | $1M–$5M |
| `note-os` | Note Business System | active | 2 | Sprint | 2 / 6 | Sprint 6 |
| `mentorship` | Note Mentorship | active | 3 | Phase | Coaching | 2–3 Transactions |
| `creations` | Standard Black Creations | active | 4 | Sites Delivered | 1 | Paid Clients |
| `entity` | Entity Structure | planning | 5 | Target | Nov 2026 | Stack Live |
| `team-payment` | Team Payment Structure | active | 6 | Pool | $315/mo | Debt Cleared |

### KPI Strip (top of dashboard — 5 cards)

| Label | Value | Sub |
|---|---|---|
| Capital Raised · Fund I | $0 | Target $1M–$5M · accredited |
| Note OS Sprint | 2 / 6 | Sprint 1 complete · Supabase pending |
| SB Creations · Sites | 1 delivered | 100 visits · client site |
| Active Ventures | 4 / 6 | 2 in planning |
| OS Status | Nominal | 17 skills live · 3 planned · 4 automations |

### Skills (17 live + 3 planned)

17 skills exist in `.claude/skills/`. 3 new skills for Standard Black Creations are planned and will be built as part of this project. In the dashboard, planned skills display with a "planned" badge instead of a run button.

| Skill ID | Name | Venture | Status |
|---|---|---|---|
| `fund:note-investing-underwriter` | Note Investing Underwriter | fund | live |
| `fund:acquisition-analyzer` | Acquisition Analyzer | fund | live |
| `fund:finance-dashboard-builder` | Finance Dashboard Builder | fund | live |
| `team:business-task-manager` | Business Task Manager | team | live |
| `team:sop-builder` | SOP Builder | team | live |
| `team:crm-manager` | CRM Manager | team | live |
| `team:weekly-review` | Weekly Review | team | live |
| `creations:client-intake` | Client Intake + Proposal | creations | planned |
| `creations:project-tracker` | Project Tracker | creations | planned |
| `creations:proposal-builder` | Scope + Pricing Generator | creations | planned |
| `os:daily-command-center` | Daily Command Center | os | live |
| `os:dev-workflow` | Dev Workflow | os |
| `os:automation-planner` | Automation Planner | os |
| `os:ai-router` | AI Router | os |
| `os:mcp-integration-builder` | MCP Integration Builder | os |
| `os:code-review-coordinator` | Code Review Coordinator | os |
| `os:security-approval-gate` | Security Approval Gate | os |
| `os:trigger-dev` | Trigger.dev Workflow | os | live |
| `general:research-summarizer` | Research Summarizer | general | live |
| `general:email-draft-reviewer` | Email Draft Reviewer | general | live |

### Automations (4)

| Name | Schedule | Target | Default |
|---|---|---|---|
| Weekly Team Sync Agenda | Mon 8:00 CT | team | off |
| Note Deal Pipeline Review | Fri 5:00 CT | fund | off |
| Mentorship Debt Tracker | 28th/month | team-payment | off |
| Heartbeat Sync | Session start | os | on |

---

## Components

### Header

- Left: SB monogram (gold on black, "SB"), "Standard Black" in Cinzel uppercase, "Operator Dashboard" sub-label
- Right: green heartbeat indicator + "live" label, live clock (mono), website link button → `https://standard-black-scale.lovable.app` (opens in new tab), Config trigger button
- Sticky, backdrop blur, `#050505` background

### ConfigPanel

Slide-in panel from the right. Triggered by Config button in header.

**Tab 1 — KPI Editor:**
- List of all ventures with editable fields: KPI value, KPI target, status dropdown
- Save button writes to localStorage, dashboard re-renders

**Tab 2 — System Status:**
- MCP servers: Gmail, Google Calendar, Google Drive, Canva, Docusign, Zapier — green/red status indicators
- Agent count: 18 registered (from Note Business System Sprint 1)
- Automation toggles (mirrors main dashboard toggles)
- Claude Code connection: shown as connected

### NewSkillModal

Two-step modal. Triggered by "New" button in Skills panel.

**Step 1 — Build:**
- Heading: "Build the Skill in Claude Code"
- Venture selector dropdown
- Skill name input
- Auto-generates Claude Code prompt: `"Build a new skill called [name] for the [venture] venture in the Standard Black OS. Use the dev-workflow skill. Skill lives at .claude/skills/[id]/SKILL.md"`
- "Copy Prompt" button copies to clipboard, advances to Step 2

**Step 2 — Register:**
- Form: skill name, ID (auto-suggested from name), venture (pre-filled from Step 1), description
- "Register Skill" button adds to skills list in localStorage
- Confirmation message, modal closes

### VentureDetail (page)

Route: `/venture/:id`

Sections:
1. **Header bar:** Back button → `/`, venture name (Cinzel), status pill, priority badge
2. **KPI block:** current value (large Cinzel), target, progress bar (gold)
3. **About:** description, key dates, relevant context
4. **Linked Skills:** filtered skill buttons — runnable from this page
5. **Next Actions:** editable checklist, items persist in localStorage
6. **Activity Log:** filtered to this venture only

**Per-venture "About" content:**

- **Note Fund I:** Residential note fund targeting accredited investors. $150K minimum. Raising $1M–$5M for Fund I. Agent 02–07 live in Note Business System.
- **Note Business System:** 18 Anthropic managed agents live (Sprint 1 complete). Sprint 2: Supabase migrations ready, awaiting project creation. Sprint 3–6 not started.
- **Note Mentorship:** Live coaching phase with Desi Arnez. Goal: complete 2–3 independent note transactions. Full team (Kerry, Kody, TJ) enrolled.
- **Standard Black Creations:** Website design and development for businesses using Lovable platform. First client site delivered, 100 visits. Operating under Standard Black brand.
- **Entity Structure:** Rockefeller-style nested entity architecture — LLC, LP, trust structures. Target: Nov 2026 as funds permit. Kasino Family Holdings as holding entity.
- **Team Payment Structure:** $315/month pool ($105 each — Kerry, Kody, TJ). Split: $165 mentorship debt repayment + $150 operating expenses. Due 28th/month. $2,832 remaining on debt.

---

## Context File Updates

As part of the build, update these workspace files:
- `context/me.md` — income source: Staples ($17/hr, M–F) + Standard Black Creations side hustle
- `context/work.md` — add Standard Black Creations as 6th portfolio item

---

## Website Link

A button in the header links directly to `https://standard-black-scale.lovable.app`. Opens in new tab. Labeled "Standard Black ↗" in Inter uppercase, gold border, Standard Black gold accent on hover.

---

## What's Not In Scope

- Live data from Supabase (Sprint 2 of Note Business System — separate project)
- n8n automation engine (Sprint 4)
- Mobile responsive layout (Phase II)
- Authentication/login (not needed for local operator tool)
- Dark/light mode toggle

---

## Success Criteria

- `npm run dev` launches the dashboard at `localhost:5173`
- All 6 ventures display with correct data
- "Open" on any venture navigates to its detail page and back
- Config button opens the tabbed panel; KPI edits persist on refresh
- New Skill button copies prompt and registers skill to dashboard
- Standard Black Creations venture and 3 linked skills are visible
- Website link opens `standard-black-scale.lovable.app` in new tab
- Theme matches Standard Black brand system (Cinzel, Inter, #C9A24A gold, #050505 bg)
- `context/me.md` and `context/work.md` updated with current income info
