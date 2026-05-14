# Standard Black OS Dashboard — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite React operator dashboard at `standard-black-os/` using Standard Black's brand system, real venture data, and fully wired interactive components (Config panel, New Skill modal, Venture Detail pages).

**Architecture:** Vite + React 18 + React Router 6. Design tokens and data in dedicated modules. All state localStorage-backed. Components split by responsibility across `components/` and `pages/`.

**Tech Stack:** Vite 6, React 18, React Router 6, Recharts 2, Lucide React

**Spec:** `docs/superpowers/specs/2026-05-13-standard-black-os-dashboard-design.md`

---

### Task 1: Project Scaffold

**Files:**
- Create: `standard-black-os/package.json`
- Create: `standard-black-os/vite.config.js`
- Create: `standard-black-os/index.html`
- Create: `standard-black-os/src/main.jsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "standard-black-os/src/components" "standard-black-os/src/pages"
```

- [ ] **Step 2: Create `standard-black-os/package.json`**

```json
{
  "name": "standard-black-os",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "recharts": "^2.13.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 3: Create `standard-black-os/vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 4: Create `standard-black-os/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Standard Black OS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `standard-black-os/src/main.jsx`**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Install dependencies**

```bash
cd standard-black-os && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 7: Create a temp `src/App.jsx` to verify the dev server starts**

```jsx
export default function App() {
  return <div style={{ color: '#F5F1E8', background: '#050505', minHeight: '100vh', padding: 24, fontFamily: 'sans-serif' }}>Standard Black OS — loading...</div>
}
```

- [ ] **Step 8: Start dev server and verify**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected: white text "Standard Black OS — loading..." on black background. No console errors.

- [ ] **Step 9: Commit**

```bash
cd .. && git add standard-black-os/ && git commit -m "feat: scaffold Standard Black OS Vite app"
```

---

### Task 2: Design Tokens + CSS Base

**Files:**
- Create: `standard-black-os/src/tokens.js`
- Create: `standard-black-os/src/index.css`

- [ ] **Step 1: Create `standard-black-os/src/tokens.js`**

```js
export const C = {
  bg:      "#050505",
  surface: "#111111",
  surface2:"#1A1A1A",
  border:  "#222222",
  borderHi:"#333333",
  text:    "#F5F1E8",
  sub:     "rgba(245,241,232,0.65)",
  mute:    "rgba(245,241,232,0.35)",
  dim:     "#333333",
  gold:    "#C9A24A",
  goldHi:  "#E8BE6A",
  goldDim: "rgba(201,162,74,0.2)",
  green:   "#3ea676",
  red:     "#c0504d",
};

export const f = {
  display: "'Cinzel', 'Cormorant Garamond', Georgia, serif",
  body:    "'Inter', 'Helvetica Neue', system-ui, sans-serif",
  mono:    "'JetBrains Mono', 'SF Mono', Menlo, monospace",
};
```

- [ ] **Step 2: Create `standard-black-os/src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #050505;
  color: #F5F1E8;
  font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #111111; }
::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #444; }

a { color: inherit; text-decoration: none; }
button { font-family: inherit; }
```

- [ ] **Step 3: Verify fonts load**

Update `standard-black-os/src/App.jsx` temporarily:

```jsx
import { f } from './tokens.js'
export default function App() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: 40 }}>
      <div style={{ fontFamily: f.display, fontSize: 32, color: '#F5F1E8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
        Standard Black
      </div>
      <div style={{ fontFamily: f.body, fontSize: 16, color: 'rgba(245,241,232,0.65)' }}>
        We acquire and scale cash-flowing businesses.
      </div>
    </div>
  )
}
```

Open `http://localhost:5173`. Expected: "STANDARD BLACK" renders in Cinzel serif, subtitle in Inter. Both fonts load from Google Fonts (requires internet connection).

- [ ] **Step 4: Commit**

```bash
git add standard-black-os/src/tokens.js standard-black-os/src/index.css && git commit -m "feat: add Standard Black design tokens and CSS base"
```

---

### Task 3: Data Layer

**Files:**
- Create: `standard-black-os/src/data.js`

- [ ] **Step 1: Create `standard-black-os/src/data.js`**

```js
const STORAGE_KEY = "sb-os-v1";

const DEFAULT_VENTURES = [
  {
    id: "fund",
    name: "Note Fund I",
    iconName: "DollarSign",
    status: "active",
    priority: 1,
    kpi: { label: "Capital Raised", value: "$0", target: "$1M–$5M", pct: 0 },
    sub: "Residential notes · Accredited only · $150K min",
    about: "Residential note fund targeting accredited investors. Minimum investment $150K. Raising $1M–$5M for Fund I. 18 Anthropic managed agents live to support deal sourcing, underwriting, and portfolio management.",
    nextActions: [
      "Create Supabase project (share URL + service role key to run migrations)",
      "Complete Fund I pitch deck",
      "Begin investor outreach sequence",
    ],
  },
  {
    id: "note-os",
    name: "Note Business System",
    iconName: "Layers",
    status: "active",
    priority: 2,
    kpi: { label: "Sprint", value: "2 / 6", target: "Sprint 6", pct: 33 },
    sub: "18 agents live · Supabase migrations ready · Sprint 2 in progress",
    about: "AI operating system for the note business. Sprint 1 complete: 18 Anthropic managed agents live. Sprint 2 requires Supabase project creation to run 3 migration files. Sprints 3–6 cover Airtable, n8n, Power BI, and security hardening.",
    nextActions: [
      "Create Supabase project at supabase.com",
      "Run migrations in order: 001_initial_schema → 002_rls_policies → 003_seed_data",
      "Plan Sprint 3: Airtable Command Center",
    ],
  },
  {
    id: "mentorship",
    name: "Note Mentorship",
    iconName: "BookOpen",
    status: "active",
    priority: 3,
    kpi: { label: "Phase", value: "Coaching", target: "2–3 Transactions", pct: 50 },
    sub: "Desi Arnez program · Full team enrolled · Live coaching phase",
    about: "12-month real estate note program with Desi Arnez. Course complete. Kerry, Kody, and TJ now in live coaching phase. Goal: complete 2–3 independent note transactions before scaling Fund I.",
    nextActions: [
      "Schedule next coaching session with Desi Arnez",
      "Identify first note deal candidate for team review",
      "Document underwriting process as team SOP",
    ],
  },
  {
    id: "creations",
    name: "Standard Black Creations",
    iconName: "Monitor",
    status: "active",
    priority: 4,
    kpi: { label: "Sites Delivered", value: "1", target: "Paid Clients", pct: 20 },
    sub: "Website design & dev · Lovable platform · 1 site live · 100 visits",
    about: "Website design and development for businesses, operating under the Standard Black brand. First client site delivered with 100+ visits. Building toward a repeatable paid client model using Lovable as the build platform.",
    nextActions: [
      "Define service packages and pricing tiers",
      "Create client intake and proposal template",
      "Build Standard Black Creations landing page",
      "Identify first 3 targets for paid outreach",
    ],
  },
  {
    id: "entity",
    name: "Entity Structure",
    iconName: "Building2",
    status: "planning",
    priority: 5,
    kpi: { label: "Target", value: "Nov 2026", target: "Stack Live", pct: 5 },
    sub: "LLC / LP / Trust · Kasino Family Holdings · Rockefeller architecture",
    about: "Rockefeller-style nested entity architecture for Kasino Family Holdings and Standard Black. Design for control, tax efficiency, investor readiness, and succession planning. Engage legal counsel when funds permit.",
    nextActions: [
      "Research LLC vs LP vs trust for each Standard Black vertical",
      "Map target entity stack on paper",
      "Get referrals for attorney with family office experience",
    ],
  },
  {
    id: "team-payment",
    name: "Team Payment Structure",
    iconName: "Users",
    status: "active",
    priority: 6,
    kpi: { label: "Pool", value: "$315/mo", target: "Debt Cleared", pct: 5 },
    sub: "$105 each · Kerry · Kody · TJ · Due 28th/month",
    about: "$315/month contribution pool ($105/person). Split: $165/month toward Desi Arnez mentorship debt ($2,832 remaining) + $150/month for team operating expenses. Estimated debt payoff: October 2027.",
    nextActions: [
      "Confirm May 28 payment from all three members",
      "Track running balance on mentorship debt",
      "Identify first business tool to fund from operating pool",
    ],
  },
];

const DEFAULT_SKILLS = [
  { id: "fund:note-investing-underwriter", name: "Note Investing Underwriter", venture: "fund", runs: 0, last: "—", status: "live" },
  { id: "fund:acquisition-analyzer", name: "Acquisition Analyzer", venture: "fund", runs: 0, last: "—", status: "live" },
  { id: "fund:finance-dashboard-builder", name: "Finance Dashboard Builder", venture: "fund", runs: 0, last: "—", status: "live" },
  { id: "team:business-task-manager", name: "Business Task Manager", venture: "team", runs: 0, last: "—", status: "live" },
  { id: "team:sop-builder", name: "SOP Builder", venture: "team", runs: 0, last: "—", status: "live" },
  { id: "team:crm-manager", name: "CRM Manager", venture: "team", runs: 0, last: "—", status: "live" },
  { id: "team:weekly-review", name: "Weekly Review", venture: "team", runs: 0, last: "—", status: "live" },
  { id: "creations:client-intake", name: "Client Intake + Proposal", venture: "creations", runs: 0, last: "—", status: "planned" },
  { id: "creations:project-tracker", name: "Project Tracker", venture: "creations", runs: 0, last: "—", status: "planned" },
  { id: "creations:proposal-builder", name: "Scope + Pricing Generator", venture: "creations", runs: 0, last: "—", status: "planned" },
  { id: "os:daily-command-center", name: "Daily Command Center", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:dev-workflow", name: "Dev Workflow", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:automation-planner", name: "Automation Planner", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:ai-router", name: "AI Router", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:mcp-integration-builder", name: "MCP Integration Builder", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:code-review-coordinator", name: "Code Review Coordinator", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:security-approval-gate", name: "Security Approval Gate", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "os:trigger-dev", name: "Trigger.dev Workflow", venture: "os", runs: 0, last: "—", status: "live" },
  { id: "general:research-summarizer", name: "Research Summarizer", venture: "general", runs: 0, last: "—", status: "live" },
  { id: "general:email-draft-reviewer", name: "Email Draft Reviewer", venture: "general", runs: 0, last: "—", status: "live" },
];

const DEFAULT_AUTOMATIONS = [
  { id: "a1", name: "Weekly Team Sync Agenda", cron: "Mon 8:00 CT", target: "team", on: false },
  { id: "a2", name: "Note Deal Pipeline Review", cron: "Fri 5:00 CT", target: "fund", on: false },
  { id: "a3", name: "Mentorship Debt Tracker", cron: "28th/month", target: "team-payment", on: false },
  { id: "a4", name: "Heartbeat Sync", cron: "Session start", target: "os", on: true },
];

const DEFAULT_ACTIVITY = [
  { t: "—", who: "system", msg: "Standard Black OS initialized — connect data sources to populate live metrics", kind: "info" },
  { t: "—", who: "heartbeat", msg: "Scanning .claude/skills … 17 live · 3 planned · 0 conflicts", kind: "ok" },
  { t: "—", who: "memory", msg: "CLAUDE.md loaded · context files indexed · 6 ventures registered", kind: "ok" },
  { t: "—", who: "mcp", msg: "MCP servers: Gmail · Calendar · Drive · Canva · Docusign · Zapier", kind: "ok" },
];

function defaultData() {
  return {
    ventures: DEFAULT_VENTURES,
    skills: DEFAULT_SKILLS,
    automations: DEFAULT_AUTOMATIONS,
    activity: DEFAULT_ACTIVITY,
  };
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const stored = JSON.parse(raw);
    const data = defaultData();
    if (stored.ventures) {
      data.ventures = data.ventures.map(v => {
        const s = stored.ventures.find(sv => sv.id === v.id);
        if (!s) return v;
        return { ...v, kpi: { ...v.kpi, ...s.kpi }, status: s.status ?? v.status, nextActions: s.nextActions ?? v.nextActions };
      });
    }
    if (stored.skills) {
      data.skills = data.skills.map(sk => {
        const s = stored.skills.find(ss => ss.id === sk.id);
        return s ? { ...sk, runs: s.runs ?? 0, last: s.last ?? "—" } : sk;
      });
      const custom = stored.skills.filter(ss => !data.skills.find(dk => dk.id === ss.id));
      data.skills = [...data.skills, ...custom];
    }
    if (stored.automations) {
      data.automations = data.automations.map(a => {
        const s = stored.automations.find(sa => sa.id === a.id);
        return s ? { ...a, on: s.on } : a;
      });
    }
    if (stored.activity) data.activity = stored.activity;
    return data;
  } catch {
    return defaultData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const FUND_SERIES = [
  { m: "Jan", v: 0 }, { m: "Feb", v: 0 }, { m: "Mar", v: 0 },
  { m: "Apr", v: 0 }, { m: "May", v: 0 }, { m: "Jun", v: 0 },
];

export const CREATIONS_SERIES = [
  { m: "Jan", v: 0 }, { m: "Feb", v: 0 }, { m: "Mar", v: 0 },
  { m: "Apr", v: 0 }, { m: "May", v: 1 }, { m: "Jun", v: 0 },
];
```

- [ ] **Step 2: Verify data loads without error**

Add a temporary log to `App.jsx`:

```jsx
import { loadData } from './data.js'
console.log(loadData())
export default function App() {
  return <div style={{ color: '#F5F1E8', background: '#050505', minHeight: '100vh', padding: 24 }}>Standard Black OS</div>
}
```

Open browser console at `http://localhost:5173`. Expected: object logged with `ventures` (6), `skills` (20), `automations` (4), `activity` (4). No errors.

- [ ] **Step 3: Commit**

```bash
git add standard-black-os/src/data.js && git commit -m "feat: add Standard Black OS data layer with localStorage persistence"
```

---

### Task 4: App Router

**Files:**
- Modify: `standard-black-os/src/App.jsx`

- [ ] **Step 1: Replace `App.jsx` with router root**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import VentureDetail from './pages/VentureDetail.jsx'
import { C } from './tokens.js'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: C.bg }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/venture/:id" element={<VentureDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Create placeholder pages so the router doesn't crash**

Create `standard-black-os/src/pages/Dashboard.jsx`:

```jsx
export default function Dashboard() {
  return <div style={{ color: '#F5F1E8', padding: 24 }}>Dashboard — placeholder</div>
}
```

Create `standard-black-os/src/pages/VentureDetail.jsx`:

```jsx
import { useParams } from 'react-router-dom'
export default function VentureDetail() {
  const { id } = useParams()
  return <div style={{ color: '#F5F1E8', padding: 24 }}>Venture: {id} — placeholder</div>
}
```

- [ ] **Step 3: Verify routing works**

Open `http://localhost:5173`. Expected: "Dashboard — placeholder".  
Open `http://localhost:5173/venture/fund`. Expected: "Venture: fund — placeholder". No console errors.

- [ ] **Step 4: Commit**

```bash
git add standard-black-os/src/App.jsx standard-black-os/src/pages/ && git commit -m "feat: add React Router with Dashboard and VentureDetail routes"
```

---

### Task 5: Shared Components

**Files:**
- Create: `standard-black-os/src/components/StatCard.jsx`
- Create: `standard-black-os/src/components/VentureRow.jsx`
- Create: `standard-black-os/src/components/SkillButton.jsx`
- Create: `standard-black-os/src/components/ActivityLog.jsx`
- Create: `standard-black-os/src/components/Panel.jsx`
- Create: `standard-black-os/src/components/Pill.jsx`

- [ ] **Step 1: Create `standard-black-os/src/components/Pill.jsx`**

```jsx
import { C, f } from '../tokens.js'

const tones = {
  default: { c: C.sub,    b: C.border,  bg: 'transparent' },
  gold:    { c: C.gold,   b: C.goldDim, bg: 'rgba(201,162,74,0.06)' },
  ok:      { c: C.green,  b: '#1f4a35', bg: 'rgba(62,166,118,0.06)' },
  warn:    { c: '#d9a441',b: '#5c4416', bg: 'rgba(217,164,65,0.06)' },
  off:     { c: C.mute,   b: C.border,  bg: 'transparent' },
  planned: { c: C.mute,   b: C.border,  bg: 'transparent' },
};

export default function Pill({ children, tone = 'default' }) {
  const t = tones[tone] ?? tones.default;
  return (
    <span style={{
      fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: t.c, border: `1px solid ${t.b}`,
      background: t.bg, padding: '3px 8px', borderRadius: 2, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Create `standard-black-os/src/components/Panel.jsx`**

```jsx
import { C, f } from '../tokens.js'

export default function Panel({ title, action, children, dense = false }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderBottom: `1px solid ${C.border}`, background: C.surface2,
        }}>
          <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.sub, fontWeight: 500 }}>
            {title}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: dense ? 0 : 14 }}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Create `standard-black-os/src/components/StatCard.jsx`**

```jsx
import { C, f } from '../tokens.js'
import { ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

export default function StatCard({ label, value, sub, accent = C.gold, trend, mini }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
      padding: '14px 16px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: accent }} />
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: f.display, fontSize: 26, fontWeight: 500, color: C.text, letterSpacing: '-0.01em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: f.body, fontSize: 12, color: C.sub, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend === 'up' && <ArrowUpRight size={12} style={{ color: C.green }} />}
          {sub}
        </div>
      )}
      {mini && (
        <div style={{ marginTop: 10, height: 32, marginLeft: -8, marginRight: -8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mini}>
              <defs>
                <linearGradient id={`g-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={accent} strokeWidth={1.5}
                fill={`url(#g-${label.replace(/\s+/g, '')})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create `standard-black-os/src/components/VentureRow.jsx`**

```jsx
import { useNavigate } from 'react-router-dom'
import { DollarSign, Layers, BookOpen, Monitor, Building2, Users, ChevronRight } from 'lucide-react'
import { C, f } from '../tokens.js'
import Pill from './Pill.jsx'

const ICONS = { DollarSign, Layers, BookOpen, Monitor, Building2, Users };

export default function VentureRow({ venture }) {
  const navigate = useNavigate();
  const Icon = ICONS[venture.iconName] ?? DollarSign;
  const tone = venture.status === 'active' ? 'gold' : venture.status === 'planning' ? 'warn' : 'off';

  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto auto',
        gap: 14, alignItems: 'center', padding: '14px 16px',
        borderBottom: `1px solid ${C.border}`, cursor: 'default', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = C.surface2}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 3,
        background: 'rgba(201,162,74,0.05)', border: `1px solid ${C.goldDim}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: C.gold }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.text, display: 'flex', alignItems: 'center', gap: 10 }}>
          {venture.name}
          <Pill tone={tone}>{venture.status}</Pill>
        </div>
        <div style={{ fontFamily: f.body, fontSize: 11.5, color: C.mute, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {venture.sub}
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 110 }}>
        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {venture.kpi.label}
        </div>
        <div style={{ fontFamily: f.display, fontSize: 17, color: C.text, fontWeight: 500, marginTop: 2 }}>
          {venture.kpi.value}
        </div>
        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.dim, marginTop: 1 }}>
          → {venture.kpi.target}
        </div>
      </div>
      <button
        onClick={() => navigate(`/venture/${venture.id}`)}
        style={{
          fontFamily: f.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
          padding: '8px 12px', borderRadius: 2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,74,0.08)'; e.currentTarget.style.color = C.goldHi; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; }}
      >
        Open <ChevronRight size={12} />
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Create `standard-black-os/src/components/SkillButton.jsx`**

```jsx
import { Play, Pause } from 'lucide-react'
import { C, f } from '../tokens.js'
import Pill from './Pill.jsx'

export default function SkillButton({ skill, running, onClick }) {
  const isPlanned = skill.status === 'planned';
  return (
    <button
      onClick={() => !isPlanned && !running && onClick(skill)}
      disabled={running || isPlanned}
      style={{
        width: '100%', textAlign: 'left',
        background: running ? 'rgba(201,162,74,0.08)' : C.surface2,
        border: `1px solid ${running ? C.gold : C.border}`,
        padding: '10px 12px', borderRadius: 3,
        cursor: isPlanned ? 'default' : running ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        transition: 'all 0.15s', marginBottom: 6, opacity: isPlanned ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!running && !isPlanned) { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.background = '#1c1c1c'; }}}
      onMouseLeave={e => { if (!running && !isPlanned) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface2; }}}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
          {skill.name}
          {isPlanned && <Pill tone="planned">planned</Pill>}
        </div>
        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.04em' }}>
          /{skill.id} · {skill.runs} runs · {skill.last}
        </div>
      </div>
      {!isPlanned && (
        <div style={{
          width: 24, height: 24, borderRadius: 12,
          background: running ? C.gold : 'transparent',
          border: `1px solid ${running ? C.gold : C.borderHi}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
        }}>
          {running ? <Pause size={10} style={{ color: C.bg }} /> : <Play size={10} style={{ color: C.gold }} />}
        </div>
      )}
    </button>
  );
}
```

- [ ] **Step 6: Create `standard-black-os/src/components/ActivityLog.jsx`**

```jsx
import { C, f } from '../tokens.js'

export default function ActivityLog({ items }) {
  return (
    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
      {items.map((a, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: 'auto auto 1fr',
          gap: 10, padding: '10px 14px',
          borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
          fontFamily: f.mono, fontSize: 11.5, lineHeight: 1.5,
        }}>
          <span style={{ color: C.dim }}>{a.t}</span>
          <span style={{
            color: a.kind === 'ok' ? C.green : a.kind === 'warn' ? '#d9a441' : 'rgba(170,130,220,0.9)',
            textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, paddingTop: 1,
          }}>{a.who}</span>
          <span style={{ color: C.sub }}>{a.msg}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add standard-black-os/src/components/ && git commit -m "feat: add shared UI components (Pill, Panel, StatCard, VentureRow, SkillButton, ActivityLog)"
```

---

### Task 6: Header Component

**Files:**
- Create: `standard-black-os/src/components/Header.jsx`

- [ ] **Step 1: Create `standard-black-os/src/components/Header.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { Settings, ExternalLink } from 'lucide-react'
import { C, f } from '../tokens.js'

export default function Header({ onConfigOpen }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const ts = now.toLocaleTimeString('en-US', { hour12: false });

  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`,
      background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 2,
            background: C.gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: f.display, fontSize: 14, fontWeight: 700, color: C.bg,
            letterSpacing: '0.05em',
          }}>
            SB
          </div>
          <div>
            <div style={{
              fontFamily: f.display, fontSize: 16, fontWeight: 500,
              letterSpacing: '0.1em', color: C.text, lineHeight: 1,
              textTransform: 'uppercase',
            }}>
              Standard Black
            </div>
            <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.16em', marginTop: 3, textTransform: 'uppercase' }}>
              Kerry Kelley Jr · Operator
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Heartbeat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 8px ${C.green}`, display: 'inline-block' }} />
            <span style={{ fontFamily: f.mono, fontSize: 11, color: C.sub, letterSpacing: '0.05em' }}>
              Heartbeat · live
            </span>
          </div>

          <div style={{ width: 1, height: 16, background: C.border }} />

          {/* Clock */}
          <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>{ts}</span>

          <div style={{ width: 1, height: 16, background: C.border }} />

          {/* Website link */}
          <a
            href="https://standard-black-scale.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: f.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
              padding: '6px 12px', borderRadius: 2, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,74,0.08)'; e.currentTarget.style.color = C.goldHi; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; }}
          >
            Standard Black <ExternalLink size={10} />
          </a>

          {/* Config */}
          <button
            onClick={onConfigOpen}
            style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              padding: '6px 10px', borderRadius: 2, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              color: C.sub, fontFamily: f.mono, fontSize: 11, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.sub; }}
          >
            <Settings size={12} /> Config
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add standard-black-os/src/components/Header.jsx && git commit -m "feat: add Header with SB logo, live clock, website link, and Config trigger"
```

---

### Task 7: ConfigPanel Component

**Files:**
- Create: `standard-black-os/src/components/ConfigPanel.jsx`

- [ ] **Step 1: Create `standard-black-os/src/components/ConfigPanel.jsx`**

```jsx
import { useState } from 'react'
import { X, Save, CheckCircle2, Clock } from 'lucide-react'
import { C, f } from '../tokens.js'

const MCP_SERVERS = [
  { name: 'Gmail', status: 'connected' },
  { name: 'Google Calendar', status: 'connected' },
  { name: 'Google Drive', status: 'connected' },
  { name: 'Canva', status: 'connected' },
  { name: 'Docusign', status: 'connected' },
  { name: 'Zapier', status: 'connected' },
];

export default function ConfigPanel({ open, onClose, ventures, automations, onSaveVentures, onToggleAutomation }) {
  const [tab, setTab] = useState('kpi');
  const [editValues, setEditValues] = useState(() =>
    Object.fromEntries(ventures.map(v => [v.id, { value: v.kpi.value, target: v.kpi.target, status: v.status }]))
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = ventures.map(v => ({
      ...v,
      status: editValues[v.id]?.status ?? v.status,
      kpi: { ...v.kpi, value: editValues[v.id]?.value ?? v.kpi.value, target: editValues[v.id]?.target ?? v.kpi.target },
    }));
    onSaveVentures(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: C.surface, borderLeft: `1px solid ${C.border}`,
        zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface2,
        }}>
          <div style={{ fontFamily: f.display, fontSize: 14, color: C.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Config
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute, padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {[{ id: 'kpi', label: 'KPI Editor' }, { id: 'status', label: 'System Status' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '12px 16px', background: 'transparent', border: 'none',
              borderBottom: `2px solid ${tab === t.id ? C.gold : 'transparent'}`,
              color: tab === t.id ? C.gold : C.mute, fontFamily: f.mono, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {tab === 'kpi' && (
            <div>
              {ventures.map(v => (
                <div key={v.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: f.body, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
                    {v.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                        Current Value
                      </div>
                      <input
                        value={editValues[v.id]?.value ?? v.kpi.value}
                        onChange={e => setEditValues(ev => ({ ...ev, [v.id]: { ...ev[v.id], value: e.target.value } }))}
                        style={{
                          width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
                          borderRadius: 2, padding: '7px 10px', color: C.text,
                          fontFamily: f.mono, fontSize: 12, outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                        Target
                      </div>
                      <input
                        value={editValues[v.id]?.target ?? v.kpi.target}
                        onChange={e => setEditValues(ev => ({ ...ev, [v.id]: { ...ev[v.id], target: e.target.value } }))}
                        style={{
                          width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
                          borderRadius: 2, padding: '7px 10px', color: C.text,
                          fontFamily: f.mono, fontSize: 12, outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                      Status
                    </div>
                    <select
                      value={editValues[v.id]?.status ?? v.status}
                      onChange={e => setEditValues(ev => ({ ...ev, [v.id]: { ...ev[v.id], status: e.target.value } }))}
                      style={{
                        background: C.surface2, border: `1px solid ${C.border}`,
                        borderRadius: 2, padding: '7px 10px', color: C.text,
                        fontFamily: f.mono, fontSize: 12, outline: 'none', width: '100%',
                      }}
                    >
                      <option value="active">active</option>
                      <option value="planning">planning</option>
                      <option value="paused">paused</option>
                      <option value="concept">concept</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'status' && (
            <div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                MCP Servers
              </div>
              {MCP_SERVERS.map(s => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green, display: 'inline-block' }} />
                    <span style={{ fontFamily: f.mono, fontSize: 10, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24, fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                Automations
              </div>
              {automations.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <div>
                    <div style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>{a.name}</div>
                    <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 2 }}>
                      <Clock size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {a.cron}
                    </div>
                  </div>
                  <button onClick={() => onToggleAutomation(a.id)} style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: a.on ? C.gold : C.border,
                    border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: a.on ? 18 : 2,
                      width: 16, height: 16, borderRadius: 8,
                      background: a.on ? C.bg : C.sub, transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: 14, background: C.surface2, borderRadius: 3, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Agent Registry
                </div>
                <div style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>18 agents registered</div>
                <div style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>Sprint 1 complete · Agents 02–07 active</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — save button for KPI tab */}
        {tab === 'kpi' && (
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, background: C.surface2 }}>
            <button
              onClick={handleSave}
              style={{
                width: '100%', padding: '10px', borderRadius: 2, cursor: 'pointer',
                background: saved ? 'rgba(62,166,118,0.15)' : 'rgba(201,162,74,0.1)',
                border: `1px solid ${saved ? C.green : C.goldDim}`,
                color: saved ? C.green : C.gold, fontFamily: f.mono, fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {saved ? <><CheckCircle2 size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add standard-black-os/src/components/ConfigPanel.jsx && git commit -m "feat: add ConfigPanel with KPI editor and system status tabs"
```

---

### Task 8: NewSkillModal Component

**Files:**
- Create: `standard-black-os/src/components/NewSkillModal.jsx`

- [ ] **Step 1: Create `standard-black-os/src/components/NewSkillModal.jsx`**

```jsx
import { useState } from 'react'
import { X, Copy, Check, Plus } from 'lucide-react'
import { C, f } from '../tokens.js'

const VENTURES = [
  { id: 'fund', label: 'Note Fund I' },
  { id: 'note-os', label: 'Note Business System' },
  { id: 'mentorship', label: 'Note Mentorship' },
  { id: 'creations', label: 'Standard Black Creations' },
  { id: 'entity', label: 'Entity Structure' },
  { id: 'team-payment', label: 'Team Payment Structure' },
  { id: 'team', label: 'Team (general)' },
  { id: 'os', label: 'OS (general)' },
  { id: 'general', label: 'General' },
];

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewSkillModal({ open, onClose, onRegister }) {
  const [step, setStep] = useState(1);
  const [venture, setVenture] = useState('fund');
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);

  const skillId = venture + ':' + toSlug(skillName);
  const skillPath = `.claude/skills/${toSlug(skillName)}/SKILL.md`;

  const prompt = skillName
    ? `Build a new skill called "${skillName}" for the ${VENTURES.find(v => v.id === venture)?.label ?? venture} venture in the Standard Black OS workspace.\n\nUse the dev-workflow skill.\n\nSkill file: ${skillPath}\nSkill ID: ${skillId}\nDescription: ${description || '(add description)'}\n\nFollow Standard Black's communication style: direct, applicable, no fluff.`
    : '';

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => { setCopied(false); setStep(2); }, 1200);
  };

  const handleRegister = () => {
    if (!skillName.trim()) return;
    onRegister({
      id: skillId,
      name: skillName.trim(),
      venture,
      runs: 0,
      last: '—',
      status: 'planned',
    });
    setRegistered(true);
    setTimeout(() => {
      setRegistered(false);
      setStep(1);
      setSkillName('');
      setDescription('');
      setVenture('fund');
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep(1); setSkillName(''); setDescription(''); setVenture('fund');
    setCopied(false); setRegistered(false);
    onClose();
  };

  if (!open) return null;

  const inputStyle = {
    width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 2, padding: '8px 12px', color: C.text,
    fontFamily: f.body, fontSize: 13, outline: 'none',
  };

  const labelStyle = {
    fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em',
    textTransform: 'uppercase', display: 'block', marginBottom: 6,
  };

  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 480, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
        zIndex: 50, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface2,
        }}>
          <div>
            <div style={{ fontFamily: f.display, fontSize: 14, color: C.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              New Skill
            </div>
            <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 3, letterSpacing: '0.08em' }}>
              Step {step} of 2 — {step === 1 ? 'Build' : 'Register'}
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute, padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {step === 1 && (
            <div>
              <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
                Fill in the details below. A Claude Code prompt will be generated — copy it and paste it into Claude Code to build the skill.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Venture</label>
                <select value={venture} onChange={e => setVenture(e.target.value)} style={{ ...inputStyle, fontFamily: f.mono }}>
                  {VENTURES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Skill Name</label>
                <input
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  placeholder="e.g. Client Intake + Proposal"
                  style={inputStyle}
                />
                {skillName && (
                  <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 5 }}>
                    ID: {skillId} · Path: {skillPath}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description (optional)</label>
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What does this skill do?"
                  style={inputStyle}
                />
              </div>

              {prompt && (
                <div style={{
                  background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3,
                  padding: 14, marginBottom: 20,
                  fontFamily: f.mono, fontSize: 11, color: C.sub, lineHeight: 1.7,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {prompt}
                </div>
              )}

              <button
                onClick={handleCopy}
                disabled={!skillName.trim()}
                style={{
                  width: '100%', padding: '10px', borderRadius: 2,
                  background: copied ? 'rgba(62,166,118,0.15)' : 'rgba(201,162,74,0.1)',
                  border: `1px solid ${copied ? C.green : C.goldDim}`,
                  color: copied ? C.green : C.gold,
                  fontFamily: f.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: skillName.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: skillName.trim() ? 1 : 0.4, transition: 'all 0.15s',
                }}
              >
                {copied ? <><Check size={14} /> Copied — advancing to Step 2</> : <><Copy size={14} /> Copy Prompt to Claude Code</>}
              </button>

              <button
                onClick={() => setStep(2)}
                style={{
                  width: '100%', marginTop: 8, padding: '8px', borderRadius: 2,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.mute, fontFamily: f.mono, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Skip to Register
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
                Once the skill is built in Claude Code, register it here so it appears in the dashboard.
              </p>

              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, padding: 14, marginBottom: 20 }}>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Skill Summary
                </div>
                <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500 }}>{skillName || '—'}</div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 4 }}>{skillId}</div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 2 }}>{skillPath}</div>
              </div>

              <button
                onClick={handleRegister}
                disabled={!skillName.trim()}
                style={{
                  width: '100%', padding: '10px', borderRadius: 2,
                  background: registered ? 'rgba(62,166,118,0.15)' : 'rgba(201,162,74,0.1)',
                  border: `1px solid ${registered ? C.green : C.goldDim}`,
                  color: registered ? C.green : C.gold,
                  fontFamily: f.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: skillName.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: skillName.trim() ? 1 : 0.4, transition: 'all 0.15s',
                }}
              >
                {registered ? <><Check size={14} /> Registered</> : <><Plus size={14} /> Register Skill</>}
              </button>

              <button
                onClick={() => setStep(1)}
                style={{
                  width: '100%', marginTop: 8, padding: '8px', borderRadius: 2,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.mute, fontFamily: f.mono, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                ← Back to Step 1
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add standard-black-os/src/components/NewSkillModal.jsx && git commit -m "feat: add NewSkillModal with two-step build-and-register flow"
```

---

### Task 9: Dashboard Page

**Files:**
- Modify: `standard-black-os/src/pages/Dashboard.jsx`

- [ ] **Step 1: Replace `standard-black-os/src/pages/Dashboard.jsx` with full implementation**

```jsx
import { useState, useMemo, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from 'recharts'
import { Database, Cpu, Radio, GitBranch, Sparkles } from 'lucide-react'
import { C, f } from '../tokens.js'
import { loadData, saveData, FUND_SERIES, CREATIONS_SERIES } from '../data.js'
import Header from '../components/Header.jsx'
import Panel from '../components/Panel.jsx'
import StatCard from '../components/StatCard.jsx'
import VentureRow from '../components/VentureRow.jsx'
import SkillButton from '../components/SkillButton.jsx'
import ActivityLog from '../components/ActivityLog.jsx'
import ConfigPanel from '../components/ConfigPanel.jsx'
import NewSkillModal from '../components/NewSkillModal.jsx'

const VENTURE_FILTERS = ['all', 'fund', 'creations', 'team', 'os'];

export default function Dashboard() {
  const [data, setData] = useState(() => loadData());
  const [selectedVenture, setSelectedVenture] = useState('all');
  const [runningSkill, setRunningSkill] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [newSkillOpen, setNewSkillOpen] = useState(false);

  const persist = useCallback((next) => {
    setData(next);
    saveData(next);
  }, []);

  const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  const addActivity = (entry) => {
    persist(prev => ({ ...prev, activity: [entry, ...prev.activity].slice(0, 30) }));
  };

  const visibleSkills = useMemo(() => {
    if (selectedVenture === 'all') return data.skills;
    return data.skills.filter(s => s.venture === selectedVenture || s.venture === 'general');
  }, [selectedVenture, data.skills]);

  const runSkill = (skill) => {
    if (runningSkill) return;
    setRunningSkill(skill.id);
    addActivity({ t: ts(), who: 'claude-code', msg: `Invoking /${skill.id} …`, kind: 'info' });
    const updated = data.skills.map(s => s.id === skill.id ? { ...s, runs: s.runs + 1, last: ts() } : s);
    persist({ ...data, skills: updated });
    setTimeout(() => {
      addActivity({ t: ts(), who: 'claude-code', msg: `/${skill.id} completed · output saved`, kind: 'ok' });
      setRunningSkill(null);
    }, 2200);
  };

  const toggleAutomation = (id) => {
    const updated = data.automations.map(a => a.id === id ? { ...a, on: !a.on } : a);
    const a = updated.find(x => x.id === id);
    addActivity({ t: ts(), who: 'automation', msg: `${a.name} ${a.on ? 'enabled' : 'paused'}`, kind: a.on ? 'ok' : 'warn' });
    persist({ ...data, automations: updated });
  };

  const saveVentures = (updated) => {
    persist({ ...data, ventures: updated });
    addActivity({ t: ts(), who: 'config', msg: 'KPI values updated and saved', kind: 'ok' });
  };

  const registerSkill = (skill) => {
    const updated = [...data.skills, skill];
    persist({ ...data, skills: updated });
    addActivity({ t: ts(), who: 'skills', msg: `/${skill.id} registered · status: planned`, kind: 'ok' });
  };

  const activeCount = data.ventures.filter(v => v.status === 'active').length;
  const liveSkillCount = data.skills.filter(s => s.status === 'live').length;

  const tooltipStyle = { background: C.surface, border: `1px solid ${C.borderHi}`, fontFamily: f.mono, fontSize: 11 };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text, fontFamily: f.body,
      backgroundImage: `radial-gradient(circle at 15% 0%, rgba(201,162,74,0.04), transparent 45%), radial-gradient(circle at 85% 100%, rgba(201,162,74,0.03), transparent 45%)`,
    }}>
      <Header onConfigOpen={() => setConfigOpen(true)} />

      <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 1600, margin: '0 auto' }}>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <StatCard label="Capital Raised · Fund I" value="$0" sub="Target $1M–$5M · accredited" accent={C.gold} mini={FUND_SERIES} />
          <StatCard label="Note OS Sprint" value="2 / 6" sub="Sprint 1 complete · Supabase pending" accent={C.gold} />
          <StatCard label="SB Creations · Sites" value="1" sub="Delivered · 100 visits" accent={C.gold} mini={CREATIONS_SERIES} />
          <StatCard label="Active Ventures" value={`${activeCount} / ${data.ventures.length}`} sub={`${data.ventures.length - activeCount} in planning`} accent={C.gold} />
          <StatCard label="OS Status" value="Nominal" sub={`${liveSkillCount} skills live · ${data.automations.length} automations`} accent={C.green} />
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 20 }}>

          {/* Left column */}
          <div style={{ display: 'grid', gap: 20 }}>
            <Panel
              title="Ventures"
              action={
                <div style={{ display: 'flex', gap: 6 }}>
                  {VENTURE_FILTERS.map(t => (
                    <button key={t} onClick={() => setSelectedVenture(t)} style={{
                      fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 2,
                      background: selectedVenture === t ? 'rgba(201,162,74,0.1)' : 'transparent',
                      border: `1px solid ${selectedVenture === t ? C.goldDim : C.border}`,
                      color: selectedVenture === t ? C.gold : C.sub, cursor: 'pointer',
                    }}>{t}</button>
                  ))}
                </div>
              }
              dense
            >
              {data.ventures.map(v => <VentureRow key={v.id} venture={v} />)}
            </Panel>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Panel title="Fund I · Capital Raise (YTD)">
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FUND_SERIES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gFund" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.gold} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
                      <XAxis dataKey="m" stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <YAxis stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="v" stroke={C.gold} strokeWidth={2} fill="url(#gFund)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="SB Creations · Sites Delivered">
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CREATIONS_SERIES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
                      <XAxis dataKey="m" stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <YAxis stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(201,162,74,0.04)' }} />
                      <Bar dataKey="v" fill={C.gold} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'grid', gap: 20, gridAutoRows: 'max-content' }}>
            <Panel
              title={`Skills · ${visibleSkills.length} shown`}
              action={
                <button onClick={() => setNewSkillOpen(true)} style={{
                  fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
                  padding: '4px 10px', borderRadius: 2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Sparkles size={10} /> New
                </button>
              }
            >
              <div style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 2 }}>
                {visibleSkills.map(s => (
                  <SkillButton key={s.id} skill={s} running={runningSkill === s.id} onClick={runSkill} />
                ))}
              </div>
            </Panel>

            <Panel title="Automations">
              {data.automations.map((a, i) => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: i < data.automations.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div>
                    <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 2, letterSpacing: '0.06em' }}>{a.cron}</div>
                  </div>
                  <button onClick={() => toggleAutomation(a.id)} style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: a.on ? C.gold : C.border,
                    border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: a.on ? 18 : 2,
                      width: 16, height: 16, borderRadius: 8,
                      background: a.on ? C.bg : C.sub, transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </Panel>

            <Panel title="Activity · Live Log" dense>
              <ActivityLog items={data.activity} />
            </Panel>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 6,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em', color: C.mute, textTransform: 'uppercase',
        }}>
          <div style={{ display: 'flex', gap: 18 }}>
            <span><Database size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.green }} />Vault · synced</span>
            <span><Cpu size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.green }} />Claude Code · connected</span>
            <span><Radio size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.green }} />6 MCP servers</span>
            <span><GitBranch size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.gold }} />main · clean</span>
          </div>
          <div>Standard Black OS v0.1 · {new Date().toISOString().slice(0, 10)}</div>
        </div>
      </div>

      <ConfigPanel
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        ventures={data.ventures}
        automations={data.automations}
        onSaveVentures={saveVentures}
        onToggleAutomation={toggleAutomation}
      />
      <NewSkillModal
        open={newSkillOpen}
        onClose={() => setNewSkillOpen(false)}
        onRegister={registerSkill}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard renders**

Open `http://localhost:5173`. Expected:
- Header with "STANDARD BLACK" in Cinzel, SB gold monogram, live clock, website link button, Config button
- 5 KPI stat cards across the top
- Ventures panel with 6 ventures listed
- Skills panel (right) with filter buttons
- Automations panel with 4 automations and toggles
- Activity log

No console errors.

- [ ] **Step 3: Test Config panel**

Click "Config" in header. Expected: slide-in panel opens from right. Tab 1 shows KPI editor for each venture with editable fields. Tab 2 shows MCP server status. Save button on Tab 1 saves and shows green "Saved" confirmation. Clicking backdrop closes panel.

- [ ] **Step 4: Test New Skill modal**

Click "New" in Skills panel. Expected: modal opens. Fill in name + select venture. Prompt appears. Copy button copies to clipboard (check clipboard). Advances to Step 2. Register button adds skill and closes modal. New skill appears in list with "planned" badge.

- [ ] **Step 5: Test automation toggles**

Click an automation toggle. Expected: toggle flips state, activity log receives a new entry. Refresh page. Expected: toggle state persists (localStorage working).

- [ ] **Step 6: Commit**

```bash
git add standard-black-os/src/pages/Dashboard.jsx && git commit -m "feat: build Dashboard page — ventures, skills, automations, Config, NewSkill wired"
```

---

### Task 10: VentureDetail Page

**Files:**
- Modify: `standard-black-os/src/pages/VentureDetail.jsx`

- [ ] **Step 1: Replace `standard-black-os/src/pages/VentureDetail.jsx` with full implementation**

```jsx
import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, DollarSign, Layers, BookOpen, Monitor, Building2, Users, CheckSquare, Square, Play, Pause } from 'lucide-react'
import { C, f } from '../tokens.js'
import { loadData, saveData } from '../data.js'
import Header from '../components/Header.jsx'
import Panel from '../components/Panel.jsx'
import Pill from '../components/Pill.jsx'
import ActivityLog from '../components/ActivityLog.jsx'
import ConfigPanel from '../components/ConfigPanel.jsx'

const ICONS = { DollarSign, Layers, BookOpen, Monitor, Building2, Users };

export default function VentureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(() => loadData());
  const [runningSkill, setRunningSkill] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);

  const venture = data.ventures.find(v => v.id === id);
  const ventureSkills = data.skills.filter(s => s.venture === id);
  const ventureActivity = data.activity.filter(a =>
    a.msg.includes(id) || ventureSkills.some(sk => a.msg.includes(sk.id))
  );

  const persist = useCallback((next) => { setData(next); saveData(next); }, []);
  const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  const saveVentures = (updated) => persist({ ...data, ventures: updated });
  const toggleAutomation = (aid) => {
    persist({ ...data, automations: data.automations.map(a => a.id === aid ? { ...a, on: !a.on } : a) });
  };

  const toggleAction = (index) => {
    const updated = data.ventures.map(v => {
      if (v.id !== id) return v;
      const actions = [...v.nextActions];
      const item = actions[index];
      actions[index] = item.startsWith('✓ ') ? item.slice(2) : '✓ ' + item;
      return { ...v, nextActions: actions };
    });
    persist({ ...data, ventures: updated });
  };

  const runSkill = (skill) => {
    if (runningSkill || skill.status === 'planned') return;
    setRunningSkill(skill.id);
    const newEntry = { t: ts(), who: 'claude-code', msg: `Invoking /${skill.id} …`, kind: 'info' };
    const updated = { ...data, activity: [newEntry, ...data.activity].slice(0, 30) };
    persist(updated);
    setTimeout(() => {
      const doneEntry = { t: ts(), who: 'claude-code', msg: `/${skill.id} completed`, kind: 'ok' };
      const withDone = { ...updated, activity: [doneEntry, ...updated.activity].slice(0, 30) };
      const withRuns = {
        ...withDone,
        skills: withDone.skills.map(s => s.id === skill.id ? { ...s, runs: s.runs + 1, last: ts() } : s),
      };
      persist(withRuns);
      setRunningSkill(null);
    }, 2200);
  };

  if (!venture) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, padding: 40, fontFamily: f.body }}>
        Venture not found.{' '}
        <button onClick={() => navigate('/')} style={{ color: C.gold, background: 'none', border: 'none', cursor: 'pointer', fontFamily: f.body }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const Icon = ICONS[venture.iconName] ?? DollarSign;
  const tone = venture.status === 'active' ? 'gold' : venture.status === 'planning' ? 'warn' : 'off';

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text, fontFamily: f.body,
      backgroundImage: `radial-gradient(circle at 15% 0%, rgba(201,162,74,0.04), transparent 45%)`,
    }}>
      <Header onConfigOpen={() => setConfigOpen(true)} />

      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>

        {/* Back nav */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
            color: C.mute, fontFamily: f.mono, fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer', marginBottom: 24, padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.sub}
          onMouseLeave={e => e.currentTarget.style.color = C.mute}
        >
          <ArrowLeft size={14} /> Dashboard
        </button>

        {/* Venture header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
          paddingBottom: 24, borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 4,
            background: 'rgba(201,162,74,0.06)', border: `1px solid ${C.goldDim}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} style={{ color: C.gold }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: f.display, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {venture.name}
              </h1>
              <Pill tone={tone}>{venture.status}</Pill>
              <Pill tone="off">Priority {venture.priority}</Pill>
            </div>
            <div style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>{venture.sub}</div>
          </div>
        </div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* KPI block */}
          <Panel title="Key Metric">
            <div style={{ padding: '8px 0' }}>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
                {venture.kpi.label}
              </div>
              <div style={{ fontFamily: f.display, fontSize: 40, fontWeight: 500, color: C.text, letterSpacing: '-0.01em', lineHeight: 1, marginBottom: 8 }}>
                {venture.kpi.value}
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 12, color: C.mute, marginBottom: 16 }}>
                Target: {venture.kpi.target}
              </div>
              {/* Progress bar */}
              <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: C.gold,
                  width: `${Math.min(venture.kpi.pct, 100)}%`, transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.dim, marginTop: 6 }}>
                {venture.kpi.pct}% toward target
              </div>
            </div>
          </Panel>

          {/* About */}
          <Panel title="About">
            <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, lineHeight: 1.7 }}>
              {venture.about}
            </p>
          </Panel>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Next actions */}
          <Panel title="Next Actions">
            {venture.nextActions.length === 0 ? (
              <div style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No actions defined.</div>
            ) : (
              venture.nextActions.map((action, i) => {
                const done = action.startsWith('✓ ');
                const label = done ? action.slice(2) : action;
                return (
                  <div
                    key={i}
                    onClick={() => toggleAction(i)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 0', borderBottom: i < venture.nextActions.length - 1 ? `1px solid ${C.border}` : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {done
                      ? <CheckSquare size={16} style={{ color: C.green, marginTop: 1, flexShrink: 0 }} />
                      : <Square size={16} style={{ color: C.dim, marginTop: 1, flexShrink: 0 }} />
                    }
                    <span style={{
                      fontFamily: f.body, fontSize: 13,
                      color: done ? C.mute : C.sub,
                      textDecoration: done ? 'line-through' : 'none',
                      lineHeight: 1.5,
                    }}>
                      {label}
                    </span>
                  </div>
                );
              })
            )}
          </Panel>

          {/* Linked skills */}
          <Panel
            title={`Skills · ${ventureSkills.length}`}
          >
            {ventureSkills.length === 0 ? (
              <div style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No skills linked to this venture.</div>
            ) : (
              <div>
                {ventureSkills.map(skill => {
                  const isPlanned = skill.status === 'planned';
                  const running = runningSkill === skill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => runSkill(skill)}
                      disabled={running || isPlanned}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: running ? 'rgba(201,162,74,0.08)' : C.surface2,
                        border: `1px solid ${running ? C.gold : C.border}`,
                        padding: '10px 12px', borderRadius: 3, marginBottom: 6,
                        cursor: isPlanned ? 'default' : running ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        opacity: isPlanned ? 0.5 : 1, transition: 'all 0.15s',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {skill.name}
                          {isPlanned && <Pill tone="planned">planned</Pill>}
                        </div>
                        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>
                          {skill.runs} runs · {skill.last}
                        </div>
                      </div>
                      {!isPlanned && (
                        <div style={{
                          width: 24, height: 24, borderRadius: 12,
                          background: running ? C.gold : 'transparent',
                          border: `1px solid ${running ? C.gold : C.borderHi}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {running ? <Pause size={10} style={{ color: C.bg }} /> : <Play size={10} style={{ color: C.gold }} />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        {/* Activity log */}
        <Panel title="Activity · This Venture" dense>
          {ventureActivity.length === 0 ? (
            <div style={{ padding: 14, fontFamily: f.body, fontSize: 13, color: C.mute }}>
              No activity logged for this venture yet.
            </div>
          ) : (
            <ActivityLog items={ventureActivity} />
          )}
        </Panel>
      </div>

      <ConfigPanel
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        ventures={data.ventures}
        automations={data.automations}
        onSaveVentures={saveVentures}
        onToggleAutomation={toggleAutomation}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify venture detail page**

From dashboard, click "Open" on any venture. Expected:
- Navigates to `/venture/:id`
- Shows venture name in Cinzel uppercase, status pill, priority badge
- KPI block shows current value (large), target, progress bar
- About text renders correctly
- Next Actions shows checkboxes — clicking one toggles the item and persists after refresh
- Linked skills show, planned ones have "planned" badge and are non-clickable
- Back button returns to dashboard

- [ ] **Step 3: Test all 6 venture pages**

Click "Open" on each of the 6 ventures. Verify each renders with correct name, KPI, sub-text, about, and next actions. No "Venture not found" errors.

- [ ] **Step 4: Commit**

```bash
git add standard-black-os/src/pages/VentureDetail.jsx && git commit -m "feat: add VentureDetail page with KPI, about, next actions, and linked skills"
```

---

### Task 11: Context File Updates

**Files:**
- Modify: `context/me.md`
- Modify: `context/work.md`
- Modify: `decisions/log.md`

- [ ] **Step 1: Update `context/me.md`**

Replace the **Current Income** line with:

```
**Current Income:** Staples, $17/hr, Monday–Friday 9-5. Previously car salesman at Clay Cooley Volkswagen, Richardson TX.

**Side Hustle:** Website design and development for businesses via Lovable, operating under Standard Black as **Standard Black Creations**. First client site delivered with 100+ visits.
```

- [ ] **Step 2: Update `context/work.md`**

In the Portfolio Architecture table, add a new row:

```
| 2.5 | Standard Black Creations (website dev) | Active — first client delivered |
```

And in the Active Income section, update:

```
**Active Income:** Staples employee, $17/hr, Monday–Friday. Building Standard Black Creations (website business) as a side hustle on Lovable.
```

- [ ] **Step 3: Append to `decisions/log.md`**

```
[2026-05-13] DECISION: Build Standard Black OS as Vite React app in standard-black-os/ | REASONING: Prototype (pinnacle-os-dashboard.jsx) was a single-file component with no routing, mocked data, and no interactive wiring. Rebuilt as proper app with React Router, localStorage persistence, Standard Black brand system (Cinzel + Inter, #C9A24A gold), and fully wired Config panel, New Skill modal, and Venture Detail pages. | CONTEXT: Standard Black Creations added as 6th venture. Income source updated from Clay Cooley VW to Staples.
```

- [ ] **Step 4: Commit**

```bash
git add context/me.md context/work.md decisions/log.md && git commit -m "chore: update context files with Staples income and Standard Black Creations venture"
```

---

### Task 12: Final Verification + Cleanup

- [ ] **Step 1: Run full manual test checklist**

Open `http://localhost:5173`.

| Check | Expected |
|---|---|
| Fonts | "STANDARD BLACK" header renders in Cinzel; body text in Inter |
| Theme | Background is #050505 (near-black); accents are gold, no purple |
| KPI strip | 5 stat cards visible with correct values |
| Ventures | 6 ventures listed — Note Fund I, Note Business System, Note Mentorship, Standard Black Creations, Entity Structure, Team Payment Structure |
| Venture filter | Clicking "fund" filters skills panel; "all" shows all |
| Open button | Clicking "Open" navigates to venture detail page |
| Back button | Returns to dashboard; state preserved |
| Next actions | Clicking an action checks/unchecks it; persists on refresh |
| Config button | Slide-in panel opens; KPI edits save to localStorage; system status shows 6 MCP servers |
| New Skill | Modal opens; prompt generates; copy works; register adds to skills list |
| Automation toggle | Toggles state; activity log records it; persists on refresh |
| Website link | Clicks open `https://standard-black-scale.lovable.app` in new tab |
| Console | No errors in browser console |

- [ ] **Step 2: Build for production (smoke test)**

```bash
cd standard-black-os && npm run build
```

Expected: `dist/` folder created, no build errors.

- [ ] **Step 3: Add `.superpowers/` to `.gitignore`**

Open `C:\Users\LOVE\OneDrive\Desktop\E.A\.gitignore` (create if absent) and add:

```
.superpowers/
standard-black-os/node_modules/
standard-black-os/dist/
```

- [ ] **Step 4: Final commit**

```bash
cd .. && git add . && git commit -m "feat: complete Standard Black OS dashboard — v0.1

- Vite React app at standard-black-os/
- Standard Black brand system: Cinzel + Inter, #C9A24A gold, #050505 bg
- 6 real ventures with KPI data and next actions
- Full routing: Dashboard + VentureDetail pages
- Config panel: KPI editor + system status (tabbed)
- New Skill modal: two-step build-and-register flow
- 20 skills (17 live, 3 planned for SB Creations)
- localStorage persistence for all editable state
- Website link → standard-black-scale.lovable.app

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```
