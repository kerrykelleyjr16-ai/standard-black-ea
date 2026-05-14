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
        return s ? { ...sk, runs: s.runs ?? 0, last: s.last ?? "—", status: s.status ?? sk.status } : sk;
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable (private mode, quota exceeded) — ignore silently
  }
}

export const FUND_SERIES = [
  { m: "Jan", v: 0 }, { m: "Feb", v: 0 }, { m: "Mar", v: 0 },
  { m: "Apr", v: 0 }, { m: "May", v: 0 }, { m: "Jun", v: 0 },
];

export const CREATIONS_SERIES = [
  { m: "Jan", v: 0 }, { m: "Feb", v: 0 }, { m: "Mar", v: 0 },
  { m: "Apr", v: 0 }, { m: "May", v: 1 }, { m: "Jun", v: 0 },
];
