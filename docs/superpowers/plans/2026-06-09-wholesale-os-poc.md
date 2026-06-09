# Wholesale OS POC Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the deployed `standard-black-os` wholesale app into an AI-assisted operator cockpit that takes one real PropStream lead from intake to under-contract, with the human (Kerry) holding only the MAO/offer/assignment judgment gates.

**Architecture:** Approach B — extend the deployed React + Vite + Supabase app. Workflow intelligence runs as Supabase Edge Functions (Deno, service-role, Anthropic `claude-sonnet-4-6`), matching the existing `draft-outreach`/`deal-summary`/`send-message` pattern. The frontend calls them via `supabase.functions.invoke`. No n8n. A single-operator `tasks` queue + an in-app Command Center page is the cockpit. Cold-outreach automation, team assignment, and paid APIs (skip-trace/SMS/e-sign) are out of scope.

**Tech Stack:** React 18, TypeScript, Vite 6, react-router-dom 6, @supabase/supabase-js 2, Tailwind 4, Supabase Edge Functions (Deno), Anthropic API. Tests: Vitest (added in Task 1).

**Spec:** `docs/superpowers/specs/2026-06-09-wholesale-os-poc-design.md`

**Hard constraint / honesty note for the executor:** Edge functions and SQL migrations in this plan are written and committed but **cannot be deployed or run from this environment** (no Supabase project credentials, no paid PropStream). Deployment + the live 30-day run are Kerry's steps, documented in `supabase/functions/DEPLOY.md`. "Done" for this plan = all code written, pure-logic unit tests passing, `npm run build` clean, and a deploy/run runbook updated. Verify with build + Vitest; mark integration steps as deploy-time checks.

**Working directory:** All app paths are under `standard-black-os/`. Run npm/vitest commands from inside `standard-black-os/`.

---

## File Structure

**New files:**
- `standard-black-os/vitest.config.ts` — test runner config
- `standard-black-os/supabase/migrations/0001_poc_tasks_and_gates.sql` — `tasks` table + RLS + `deals` approval columns
- `standard-black-os/src/wholesale/lib/tasks.ts` — task CRUD + sort helper
- `standard-black-os/src/wholesale/lib/csvImport.ts` — PropStream CSV → Lead rows (pure)
- `standard-black-os/src/wholesale/lib/gates.ts` — MAO/offer gate state (pure)
- `standard-black-os/src/wholesale/lib/dispo.ts` — disposition ranking/filter (pure, wraps matching.ts)
- `standard-black-os/src/wholesale/lib/compliance.ts` — opt-out / contactable / STOP detection (pure)
- `standard-black-os/src/wholesale/lib/digest.ts` — Command Center digest builder (pure)
- `standard-black-os/src/wholesale/lib/*.test.ts` — Vitest unit tests for each pure lib
- `standard-black-os/src/pages/wholesale/CommandCenter.tsx` — cockpit home (digest view)
- `standard-black-os/src/pages/wholesale/Tasks.tsx` — operator task queue
- `standard-black-os/supabase/functions/score-inbound/index.ts` — W4 scoring + STOP detection
- `standard-black-os/supabase/functions/draft-offer/index.ts` — W7 offer drafting
- `standard-black-os/supabase/functions/draft-dispo/index.ts` — W8 dispo blast draft
- `standard-black-os/supabase/functions/morning-brief/index.ts` — W9 cron digest (email delivery deferred)

**Modified files:**
- `standard-black-os/package.json` — add vitest + test script
- `standard-black-os/src/wholesale/lib/types.ts` — add `Task` interface + task types
- `standard-black-os/src/pages/wholesale/Leads.tsx` — CSV import button (W1)
- `standard-black-os/src/pages/wholesale/LeadDetail.tsx` — log-reply + score UI (W4), opt-out suppression
- `standard-black-os/src/pages/wholesale/DealDetail.tsx` — MAO gate (W5), offer gate (W7), dispo (W8)
- `standard-black-os/src/App.jsx` — routes for CommandCenter + Tasks
- `standard-black-os/supabase/functions/DEPLOY.md` — new functions + migration step
- `ai-os/AUTOMATION_REGISTRY.md` — register new functions

**Brought over from `save-chat-photos` branch (Task 0):**
- `standard-black-os/supabase/functions/{draft-outreach,deal-summary,send-message}/index.ts` + `DEPLOY.md`

---

## Conventions (apply in every task)

- **Edge function template:** copy the structure of `supabase/functions/draft-outreach/index.ts` — `corsHeaders`, `OPTIONS` handler, `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)`, a no-API-key fallback branch, Anthropic call with `model: 'claude-sonnet-4-6'`, `anthropic-version: '2023-06-01'`, try/catch returning `{ error }` with status 500.
- **Frontend Supabase calls:** `import { supabase } from '../../wholesale/lib/supabase'` (adjust depth). Tables: `leads`, `deals`, `buyers`, `conversations`, `tasks`.
- **Styling:** match existing pages — mono font, dark theme (`background: '#050505'`), `WholesaleNav`, the `Button` component from `src/wholesale/components/ui`. Reuse existing components; do not restyle the app.
- **Commit message style:** `feat(wholesale): <what>` / `test(wholesale): <what>` / `chore(wholesale): <what>`.

---

## Task 0: Working branch + bring edge-function source onto it

**Files:**
- Create (via checkout): `standard-black-os/supabase/functions/draft-outreach/index.ts`, `.../deal-summary/index.ts`, `.../send-message/index.ts`, `.../DEPLOY.md`

- [ ] **Step 1: Create the working branch off master**

```bash
git checkout master
git checkout -b wholesale-os-poc
```

- [ ] **Step 2: Bring the existing edge-function source over from the cloud branch**

```bash
git checkout origin/claude/save-chat-photos-0mmizq -- standard-black-os/supabase/functions
git status
```

Expected: `supabase/functions/{draft-outreach,deal-summary,send-message}/index.ts` and `DEPLOY.md` staged as new files. (These match the deployed functions; we extend alongside them.)

- [ ] **Step 3: Commit**

```bash
git add standard-black-os/supabase/functions
git commit -m "chore(wholesale): vendor existing edge-function source onto working branch"
```

---

## Task 1: Test harness (Vitest)

**Files:**
- Modify: `standard-black-os/package.json`
- Create: `standard-black-os/vitest.config.ts`
- Create: `standard-black-os/src/wholesale/lib/mao.test.ts`

- [ ] **Step 1: Add Vitest dev dependency and test script**

In `standard-black-os/`, run:
```bash
npm install -D vitest@^2
```
Then add to `package.json` `"scripts"`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 3: Write a smoke test against existing `mao.ts`**

`src/wholesale/lib/mao.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { calculateMAO } from './mao'

describe('calculateMAO', () => {
  it('computes ARV*margin - repairs - fee', () => {
    expect(calculateMAO(200000, 0.7, 30000, 10000)).toBe(100000)
  })
})
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npm test`
Expected: 1 passing test.

- [ ] **Step 5: Commit**

```bash
git add standard-black-os/package.json standard-black-os/package-lock.json standard-black-os/vitest.config.ts standard-black-os/src/wholesale/lib/mao.test.ts
git commit -m "test(wholesale): add vitest harness with mao smoke test"
```

---

## Task 2: Database migration — `tasks` table + deal approval columns

**Files:**
- Create: `standard-black-os/supabase/migrations/0001_poc_tasks_and_gates.sql`

- [ ] **Step 1: Write the migration**

```sql
-- POC: single-operator task queue + deal approval gates.
-- Apply in the Supabase SQL Editor (or `supabase db push`) on the project.

-- Deal approval gates (W5 MAO, W7 offer)
alter table deals add column if not exists mao_approved_at   timestamptz;
alter table deals add column if not exists offer_approved_at timestamptz;

-- Single-operator task queue (cockpit)
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in
              ('call','text','approve_mao','approve_offer','contact_buyer','analyze','other')),
  lead_id     uuid references leads(id) on delete cascade,
  deal_id     uuid references deals(id) on delete cascade,
  title       text not null,
  detail      text,
  status      text not null default 'open' check (status in ('open','done','dismissed')),
  due_date    date,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_status_idx on tasks(status);

-- RLS: matches existing tables — authenticated users get full access (single operator)
alter table tasks enable row level security;
create policy "authenticated full access" on tasks
  for all to authenticated using (true) with check (true);
```

- [ ] **Step 2: Verify SQL is internally consistent**

Read it back: column names referenced by app code in later tasks must match exactly — `tasks(type, lead_id, deal_id, title, detail, status, due_date, created_at)`, `deals.mao_approved_at`, `deals.offer_approved_at`. Confirm.

- [ ] **Step 3: Commit**

```bash
git add standard-black-os/supabase/migrations/0001_poc_tasks_and_gates.sql
git commit -m "feat(wholesale): migration for tasks queue + deal approval gates"
```

> Deploy-time check (Kerry): run this in Supabase SQL Editor before using the cockpit.

---

## Task 3: Types + task data layer

**Files:**
- Modify: `standard-black-os/src/wholesale/lib/types.ts`
- Create: `standard-black-os/src/wholesale/lib/tasks.ts`
- Create: `standard-black-os/src/wholesale/lib/tasks.test.ts`

- [ ] **Step 1: Add the `Task` types to `types.ts`** (append)

```ts
export type TaskType =
  | 'call' | 'text' | 'approve_mao' | 'approve_offer'
  | 'contact_buyer' | 'analyze' | 'other'
export type TaskStatus = 'open' | 'done' | 'dismissed'

export interface Task {
  id: string
  type: TaskType
  lead_id: string | null
  deal_id: string | null
  title: string
  detail: string | null
  status: TaskStatus
  due_date: string | null
  created_at: string
}
```

- [ ] **Step 2: Write the failing test for the sort helper**

`src/wholesale/lib/tasks.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { sortTasks } from './tasks'
import type { Task } from './types'

const t = (over: Partial<Task>): Task => ({
  id: '1', type: 'call', lead_id: null, deal_id: null, title: 't',
  detail: null, status: 'open', due_date: null, created_at: '2026-06-01T00:00:00Z', ...over,
})

describe('sortTasks', () => {
  it('open before done/dismissed, approvals before other open types, then oldest first', () => {
    const done = t({ id: 'd', status: 'done' })
    const call = t({ id: 'c', type: 'call', created_at: '2026-06-02T00:00:00Z' })
    const mao = t({ id: 'm', type: 'approve_mao', created_at: '2026-06-03T00:00:00Z' })
    const out = sortTasks([done, call, mao]).map((x) => x.id)
    expect(out).toEqual(['m', 'c', 'd'])
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm test -- tasks`
Expected: FAIL (`sortTasks` not exported).

- [ ] **Step 4: Implement `tasks.ts`**

```ts
import { supabase } from './supabase'
import type { Task, TaskType } from './types'

const APPROVAL_TYPES: TaskType[] = ['approve_mao', 'approve_offer']

export function sortTasks(tasks: Task[]): Task[] {
  const statusRank = (s: Task['status']) => (s === 'open' ? 0 : 1)
  return [...tasks].sort((a, b) => {
    if (statusRank(a.status) !== statusRank(b.status)) return statusRank(a.status) - statusRank(b.status)
    const aApp = APPROVAL_TYPES.includes(a.type) ? 0 : 1
    const bApp = APPROVAL_TYPES.includes(b.type) ? 0 : 1
    if (aApp !== bApp) return aApp - bApp
    return a.created_at.localeCompare(b.created_at)
  })
}

export async function listTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*')
  if (error) throw error
  return sortTasks((data ?? []) as Task[])
}

export async function createTask(input: {
  type: TaskType; title: string; detail?: string
  lead_id?: string | null; deal_id?: string | null; due_date?: string | null
}): Promise<void> {
  const { error } = await supabase.from('tasks').insert({
    type: input.type, title: input.title, detail: input.detail ?? null,
    lead_id: input.lead_id ?? null, deal_id: input.deal_id ?? null, due_date: input.due_date ?? null,
  })
  if (error) throw error
}

export async function setTaskStatus(id: string, status: Task['status']): Promise<void> {
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) throw error
}
```

- [ ] **Step 5: Run test, verify pass**

Run: `npm test -- tasks`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add standard-black-os/src/wholesale/lib/types.ts standard-black-os/src/wholesale/lib/tasks.ts standard-black-os/src/wholesale/lib/tasks.test.ts
git commit -m "feat(wholesale): Task type + task data layer with sort"
```

---

## Task 4: W1 — PropStream CSV import

**Files:**
- Create: `standard-black-os/src/wholesale/lib/csvImport.ts`
- Create: `standard-black-os/src/wholesale/lib/csvImport.test.ts`
- Modify: `standard-black-os/src/pages/wholesale/Leads.tsx`

- [ ] **Step 1: Write the failing test for the parser**

`src/wholesale/lib/csvImport.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { parsePropStreamCsv, MOTIVATION_KEYWORDS } from './csvImport'

const csv = `Address,City,State,Zip,Owner Name,Owner Phone,Beds,Baths,Building Sqft,Year Built,Vacant,Tax Delinquent
123 Main St,Dallas,TX,75201,Jane Doe,2145551234,3,2,1500,1980,Yes,No`

describe('parsePropStreamCsv', () => {
  it('maps columns to Lead inserts and tags motivation signals', () => {
    const rows = parsePropStreamCsv(csv)
    expect(rows).toHaveLength(1)
    expect(rows[0].address).toBe('123 Main St')
    expect(rows[0].zip).toBe('75201')
    expect(rows[0].owner_phone).toBe('2145551234')
    expect(rows[0].beds).toBe(3)
    expect(rows[0].stage).toBe('New')
    expect(rows[0].motivation_signals).toContain('vacant')
  })
  it('exposes the keyword list', () => {
    expect(MOTIVATION_KEYWORDS.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- csvImport` → FAIL (`parsePropStreamCsv` not defined).

- [ ] **Step 3: Implement `csvImport.ts`**

Implement a dependency-free CSV parser (no new deps) that:
- splits lines on `\n`, fields on `,` (POC lists are simple PropStream exports; quoted-comma handling can be a documented limitation — keep YAGNI),
- maps header names case-insensitively to: `address, city, state, zip, owner_name, owner_phone, owner_email, beds, baths, sqft, year_built, property_type`,
- coerces numeric fields with `Number(...)` → `null` on NaN,
- sets `stage: 'New'`, `skip_trace_status: 'pending'`,
- builds `motivation_signals: string[]` from boolean-ish columns matching `MOTIVATION_KEYWORDS` (`vacant, tax delinquent, absentee, pre-foreclosure, inherited, tired landlord`) where the cell value is `Yes`/`true`/`1`.

Return type: `Array<Partial<Lead> & { address: string; city: string; state: string; zip: string; stage: 'New'; motivation_signals: string[] }>`. Export `MOTIVATION_KEYWORDS`.

(Write the full function — the test above pins the contract.)

- [ ] **Step 4: Run test, verify pass**

Run: `npm test -- csvImport` → PASS.

- [ ] **Step 5: Add import UI to `Leads.tsx`**

Add a "Import PropStream CSV" `<input type="file" accept=".csv">` button near the existing "New" action. On file select: read text, `parsePropStreamCsv`, then `supabase.from('leads').insert(rows)`; on success refresh the list and show a count toast/inline message. Match existing page styling and the existing data-loading pattern in the file. No dedupe in POC (documented limitation; PropStream lists are pre-filtered).

- [ ] **Step 6: Verify build**

Run: `npm run build` → succeeds.

- [ ] **Step 7: Commit**

```bash
git add standard-black-os/src/wholesale/lib/csvImport.ts standard-black-os/src/wholesale/lib/csvImport.test.ts standard-black-os/src/pages/wholesale/Leads.tsx
git commit -m "feat(wholesale): PropStream CSV lead import (W1)"
```

---

## Task 5: W4 — inbound scoring edge function + log-reply UI

**Files:**
- Create: `standard-black-os/supabase/functions/score-inbound/index.ts`
- Modify: `standard-black-os/src/pages/wholesale/LeadDetail.tsx`

- [ ] **Step 1: Write `score-inbound/index.ts`**

Follow the `draft-outreach` template. Contract:
- Request body: `{ leadId: string, message: string }`.
- Insert an inbound `conversations` row (`lead_id=leadId, channel='sms', direction='inbound', body=message, ai_generated=false`).
- **STOP detection (compliance):** if `message` trimmed upper-cases to one of `STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT`, set that conversation `opted_out=true`, set the lead's most recent contact handling to suppressed, and return `{ optedOut: true, score: 0 }` without calling Claude.
- Otherwise call Claude (`claude-sonnet-4-6`) with a prompt that returns strict JSON: `{ "score": <0-100 motivation>, "sentiment": "positive|neutral|negative", "qualifying_questions": [3 strings], "summary": "<one line>" }`. Parse it; on parse failure fall back to `{ score: 50, sentiment: 'neutral', qualifying_questions: [...defaults], summary: '' }`.
- Update the inbound conversation row with `motivation_score` and `sentiment`.
- No-API-key fallback branch returns the neutral default (so the function works pre-key).
- Return `{ score, sentiment, qualifying_questions, summary, optedOut: false }`.

- [ ] **Step 2: Add "Log seller reply" UI to `LeadDetail.tsx`**

Add a textarea + "Score reply" button. On submit: `supabase.functions.invoke('score-inbound', { body: { leadId: id, message } })`. Show returned score (big number, like the existing "score: 92" treatment), sentiment, and the suggested qualifying questions. If `optedOut`, show a red "Opted out — do not contact" banner and hide contact actions. Add stage controls to advance `Responded → Qualified` (reuse the existing `handleStageChange`).

- [ ] **Step 3: Verify build**

Run: `npm run build` → succeeds.

- [ ] **Step 4: Commit**

```bash
git add standard-black-os/supabase/functions/score-inbound standard-black-os/src/pages/wholesale/LeadDetail.tsx
git commit -m "feat(wholesale): inbound scoring + qualify + STOP detection (W4)"
```

> Deploy-time check (Kerry): `supabase functions deploy score-inbound`, then log a test reply and confirm a score returns.

---

## Task 6: W5 — MAO approval gate

**Files:**
- Create: `standard-black-os/src/wholesale/lib/gates.ts`
- Create: `standard-black-os/src/wholesale/lib/gates.test.ts`
- Modify: `standard-black-os/src/pages/wholesale/DealDetail.tsx`

- [ ] **Step 1: Write the failing test**

`src/wholesale/lib/gates.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { isMaoApproved, canDraftOffer, isOfferApproved } from './gates'
import type { Deal } from './types'

const deal = (over: Partial<Deal>): Deal => ({
  id: 'd', lead_id: 'l', arv: 200000, comps: null, repair_level: 'moderate',
  repair_estimate: 30000, asking_price: null, mao: 100000, mao_override: null,
  mao_override_reason: null, assignment_fee: 10000, offer_price: null,
  matched_buyer_ids: [], analysis_notes: null, analyzed_at: null,
  mao_approved_at: null, offer_approved_at: null, ...over,
} as Deal)

describe('gates', () => {
  it('MAO not approved until timestamp set', () => {
    expect(isMaoApproved(deal({}))).toBe(false)
    expect(isMaoApproved(deal({ mao_approved_at: '2026-06-09T00:00:00Z' }))).toBe(true)
  })
  it('cannot draft offer until MAO approved', () => {
    expect(canDraftOffer(deal({}))).toBe(false)
    expect(canDraftOffer(deal({ mao_approved_at: '2026-06-09T00:00:00Z' }))).toBe(true)
  })
  it('offer approval reflects timestamp', () => {
    expect(isOfferApproved(deal({}))).toBe(false)
    expect(isOfferApproved(deal({ offer_approved_at: '2026-06-09T00:00:00Z' }))).toBe(true)
  })
})
```

This requires `Deal` to carry `mao_approved_at` / `offer_approved_at`. **Add those two fields to the `Deal` interface in `types.ts`** (`mao_approved_at: string | null`, `offer_approved_at: string | null`) as part of this task.

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- gates` → FAIL.

- [ ] **Step 3: Implement `gates.ts`**

```ts
import type { Deal } from './types'

export function isMaoApproved(deal: Deal): boolean {
  return deal.mao_approved_at != null
}
export function canDraftOffer(deal: Deal): boolean {
  return isMaoApproved(deal)
}
export function isOfferApproved(deal: Deal): boolean {
  return deal.offer_approved_at != null
}
```

- [ ] **Step 4: Run test, verify pass** → `npm test -- gates` PASS.

- [ ] **Step 5: Wire the gate into `DealDetail.tsx`**

In the deal-analysis section: show the computed/override MAO with an **"Approve MAO"** button → `supabase.from('deals').update({ mao_approved_at: new Date().toISOString() }).eq('id', id)`; on success create a follow-up task `createTask({ type: 'approve_offer'... })` is NOT auto-made here — instead reflect approved state. Gate the offer section (Task 7) with `canDraftOffer(deal)`. When MAO is pending, surface a `createTask({ type: 'approve_mao', deal_id, lead_id, title })` call once (on analyze) so it shows in the cockpit.

- [ ] **Step 6: Verify build** → `npm run build` succeeds.

- [ ] **Step 7: Commit**

```bash
git add standard-black-os/src/wholesale/lib/gates.ts standard-black-os/src/wholesale/lib/gates.test.ts standard-black-os/src/wholesale/lib/types.ts standard-black-os/src/pages/wholesale/DealDetail.tsx
git commit -m "feat(wholesale): MAO approval gate (W5)"
```

---

## Task 7: W7 — offer drafting edge function + approval gate

**Files:**
- Create: `standard-black-os/supabase/functions/draft-offer/index.ts`
- Modify: `standard-black-os/src/pages/wholesale/DealDetail.tsx`

- [ ] **Step 1: Write `draft-offer/index.ts`**

Follow the template. Contract:
- Body: `{ dealId: string }`.
- Load the deal + its lead. **Guard:** if `deal.mao_approved_at` is null, return 409 `{ error: 'MAO not approved' }`.
- Effective MAO = `deal.mao_override ?? deal.mao`. Compute a suggested `offer_price` at or below MAO (default: round MAO down to nearest $1,000).
- Claude (`claude-sonnet-4-6`) drafts a concise written cash offer letter referencing address, price, and standard wholesale terms (as-is, cash, quick close, assignable). No-key fallback returns a templated letter.
- Return `{ offer_price, letter }`. (Function does not write the offer; the UI does on approval.)

- [ ] **Step 2: Wire offer flow into `DealDetail.tsx`**

Offer section is rendered only when `canDraftOffer(deal)` (MAO approved). "Draft offer" → `invoke('draft-offer', { body: { dealId: id } })` → show letter + suggested price (editable). **"Approve & mark offer made"** → `supabase.from('deals').update({ offer_price, offer_approved_at: new Date().toISOString() })` + advance lead stage to `Offer Made`. Creating an `approve_offer` task when the offer is drafted-but-not-approved makes it appear in the cockpit.

- [ ] **Step 3: Verify build** → `npm run build` succeeds.

- [ ] **Step 4: Commit**

```bash
git add standard-black-os/supabase/functions/draft-offer standard-black-os/src/pages/wholesale/DealDetail.tsx
git commit -m "feat(wholesale): offer drafting + approval gate (W7)"
```

> Deploy-time check (Kerry): `supabase functions deploy draft-offer`.

---

## Task 8: W8 — disposition ranking + blast draft

**Files:**
- Create: `standard-black-os/src/wholesale/lib/dispo.ts`
- Create: `standard-black-os/src/wholesale/lib/dispo.test.ts`
- Create: `standard-black-os/supabase/functions/draft-dispo/index.ts`
- Modify: `standard-black-os/src/pages/wholesale/DealDetail.tsx`

- [ ] **Step 1: Write the failing test for the ranking filter**

`src/wholesale/lib/dispo.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { rankDispoBuyers } from './dispo'
import type { Buyer, Deal, Lead } from './types'
// build minimal buyer/deal/lead fixtures (mirror matching.test patterns)

describe('rankDispoBuyers', () => {
  it('returns only non-hard-pass buyers, highest score first', () => {
    // two buyers: one in-market (passes), one out-of-market (hard pass)
    // expect length 1, the in-market buyer
  })
})
```
Fill the fixtures so `rankDispoBuyers(buyers, deal, lead)` is asserted to drop hard-passes and sort by score desc.

- [ ] **Step 2: Run test, verify it fails** → `npm test -- dispo` FAIL.

- [ ] **Step 3: Implement `dispo.ts`** (wraps existing `matching.ts`, DRY)

```ts
import type { Buyer, Deal, Lead, BuyerMatchScore } from './types'
import { scoreAllBuyersForDeal } from './matching'

export function rankDispoBuyers(buyers: Buyer[], deal: Deal, lead: Lead): BuyerMatchScore[] {
  return scoreAllBuyersForDeal(buyers, deal, lead).filter((m) => !m.hard_pass)
}
```

- [ ] **Step 4: Run test, verify pass** → `npm test -- dispo` PASS.

- [ ] **Step 5: Write `draft-dispo/index.ts`**

Body `{ dealId }`. Load deal + lead + active buyers; (ranking is also done client-side, but the function drafts the blast copy). Claude drafts a short disposition blast message describing the deal (address, beds/baths, ARV, asking/offer price, assignment fee) for sending to cash buyers. No-key fallback = templated blast. Return `{ blast }`.

- [ ] **Step 6: Wire dispo UI into `DealDetail.tsx`**

When stage is `Under Contract` (or offer approved), show ranked buyers via `rankDispoBuyers`, a "Draft dispo blast" button (`invoke('draft-dispo')`), and a **"Mark assigned"** action that sets lead stage `Assigned` and records the chosen buyer in `deals.matched_buyer_ids`. Buyer contact itself is manual (Kerry owns the relationship) — create `contact_buyer` tasks for the top buyers.

- [ ] **Step 7: Verify build** → `npm run build` succeeds.

- [ ] **Step 8: Commit**

```bash
git add standard-black-os/src/wholesale/lib/dispo.ts standard-black-os/src/wholesale/lib/dispo.test.ts standard-black-os/supabase/functions/draft-dispo standard-black-os/src/pages/wholesale/DealDetail.tsx
git commit -m "feat(wholesale): disposition ranking + blast draft (W8)"
```

> Deploy-time check (Kerry): `supabase functions deploy draft-dispo`.

---

## Task 9: Compliance — opt-out / contactable helpers

**Files:**
- Create: `standard-black-os/src/wholesale/lib/compliance.ts`
- Create: `standard-black-os/src/wholesale/lib/compliance.test.ts`
- Modify: `standard-black-os/src/pages/wholesale/LeadDetail.tsx`

> Built as its own task so suppression is centralized and unit-tested. The STOP *detection* already lives in `score-inbound` (Task 5); this task adds the shared predicate the UI uses to suppress contact.

- [ ] **Step 1: Write the failing test**

`src/wholesale/lib/compliance.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { isStopKeyword, isContactable } from './compliance'
import type { Conversation } from './types'

const convo = (over: Partial<Conversation>): Conversation => ({
  id: 'c', lead_id: 'l', channel: 'sms', direction: 'inbound', body: '',
  ai_generated: false, motivation_score: null, sentiment: null,
  consent_status: null, opted_out: false, created_at: '2026-06-09T00:00:00Z', ...over,
})

describe('compliance', () => {
  it('detects STOP keywords case/space-insensitively', () => {
    expect(isStopKeyword(' Stop ')).toBe(true)
    expect(isStopKeyword('UNSUBSCRIBE')).toBe(true)
    expect(isStopKeyword('yeah maybe')).toBe(false)
  })
  it('lead is not contactable if any conversation is opted_out', () => {
    expect(isContactable([convo({})])).toBe(true)
    expect(isContactable([convo({ opted_out: true })])).toBe(false)
  })
})
```

- [ ] **Step 2: Run test, verify it fails** → `npm test -- compliance` FAIL.

- [ ] **Step 3: Implement `compliance.ts`**

```ts
import type { Conversation } from './types'

const STOP_WORDS = new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'])

export function isStopKeyword(message: string): boolean {
  return STOP_WORDS.has(message.trim().toUpperCase())
}

export function isContactable(conversations: Conversation[]): boolean {
  return !conversations.some((c) => c.opted_out)
}
```

Refactor `score-inbound` (Task 5) to import nothing from here (edge functions are Deno/separate bundle) — keep its own copy of the STOP list, but ensure the **word list matches** this file exactly. Note that duplication in the commit message.

- [ ] **Step 4: Run test, verify pass** → `npm test -- compliance` PASS.

- [ ] **Step 5: Use `isContactable` in `LeadDetail.tsx`**

Load the lead's conversations; if `!isContactable(convos)`, hide the draft/call/text actions and show the "Opted out — do not contact" banner.

- [ ] **Step 6: Verify build** → `npm run build` succeeds.

- [ ] **Step 7: Commit**

```bash
git add standard-black-os/src/wholesale/lib/compliance.ts standard-black-os/src/wholesale/lib/compliance.test.ts standard-black-os/src/pages/wholesale/LeadDetail.tsx
git commit -m "feat(wholesale): opt-out suppression helpers + UI (compliance)"
```

---

## Task 10: W9 — Command Center page (digest) + Tasks page (cockpit)

**Files:**
- Create: `standard-black-os/src/wholesale/lib/digest.ts`
- Create: `standard-black-os/src/wholesale/lib/digest.test.ts`
- Create: `standard-black-os/src/pages/wholesale/CommandCenter.tsx`
- Create: `standard-black-os/src/pages/wholesale/Tasks.tsx`
- Modify: `standard-black-os/src/App.jsx`

- [ ] **Step 1: Write the failing test for the digest builder**

`src/wholesale/lib/digest.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { buildDigest } from './digest'
import type { Lead, Task } from './types'

const lead = (stage: Lead['stage']): Lead => ({
  id: Math.random().toString(), address: 'x', city: 'Dallas', state: 'TX', zip: '75201',
  county: null, property_type: null, beds: null, baths: null, sqft: null, year_built: null,
  lot_size: null, source: null, owner_name: null, owner_phone: null, owner_email: null,
  skip_trace_status: null, motivation_signals: [], stage, created_at: '2026-06-09T00:00:00Z',
})
const task = (type: Task['type']): Task => ({
  id: Math.random().toString(), type, lead_id: null, deal_id: null, title: 't',
  detail: null, status: 'open', due_date: null, created_at: '2026-06-09T00:00:00Z',
})

describe('buildDigest', () => {
  it('counts leads by stage and pending approvals', () => {
    const d = buildDigest([lead('New'), lead('New'), lead('Qualified')],
                          [task('approve_mao'), task('call')])
    expect(d.leadsByStage['New']).toBe(2)
    expect(d.leadsByStage['Qualified']).toBe(1)
    expect(d.pendingApprovals).toBe(1)
    expect(d.openTasks).toBe(2)
  })
})
```

- [ ] **Step 2: Run test, verify it fails** → `npm test -- digest` FAIL.

- [ ] **Step 3: Implement `digest.ts`**

```ts
import type { Lead, Task } from './types'

export interface Digest {
  leadsByStage: Record<string, number>
  openTasks: number
  pendingApprovals: number
  generatedAt: string
}

export function buildDigest(leads: Lead[], tasks: Task[]): Digest {
  const leadsByStage: Record<string, number> = {}
  for (const l of leads) leadsByStage[l.stage] = (leadsByStage[l.stage] ?? 0) + 1
  const open = tasks.filter((t) => t.status === 'open')
  const pendingApprovals = open.filter(
    (t) => t.type === 'approve_mao' || t.type === 'approve_offer'
  ).length
  return { leadsByStage, openTasks: open.length, pendingApprovals, generatedAt: new Date().toISOString() }
}
```

- [ ] **Step 4: Run test, verify pass** → `npm test -- digest` PASS.

- [ ] **Step 5: Build `CommandCenter.tsx`**

A cockpit home page: on load, fetch `leads` + `tasks`, run `buildDigest`, render — "Today" header, open-task count, pending approvals (linked to Tasks page), leads-by-stage row, and deals-in-flight count (leads in `Analyzed`..`Under Contract`). Match dashboard styling. Include `WholesaleNav`.

- [ ] **Step 6: Build `Tasks.tsx`**

Operator queue: `listTasks()`, render `sortTasks` order, each row shows title/detail/type with **Done** and **Dismiss** buttons → `setTaskStatus`. Link `lead_id`/`deal_id` rows to their detail pages. Single-operator — no assignee field.

- [ ] **Step 7: Register routes in `App.jsx`**

Add imports + routes:
```jsx
<Route path="/wholesale/command" element={<CommandCenter />} />
<Route path="/wholesale/tasks" element={<Tasks />} />
```
Add a nav link to both in `WholesaleNav.tsx`.

- [ ] **Step 8: Verify build** → `npm run build` succeeds.

- [ ] **Step 9: Commit**

```bash
git add standard-black-os/src/wholesale/lib/digest.ts standard-black-os/src/wholesale/lib/digest.test.ts standard-black-os/src/pages/wholesale/CommandCenter.tsx standard-black-os/src/pages/wholesale/Tasks.tsx standard-black-os/src/App.jsx standard-black-os/src/wholesale/components/WholesaleNav.tsx
git commit -m "feat(wholesale): Command Center digest + operator task queue (W9 + cockpit)"
```

---

## Task 11: W9 cron edge function (morning brief) + docs

**Files:**
- Create: `standard-black-os/supabase/functions/morning-brief/index.ts`
- Modify: `standard-black-os/supabase/functions/DEPLOY.md`
- Modify: `ai-os/AUTOMATION_REGISTRY.md`

- [ ] **Step 1: Write `morning-brief/index.ts`**

Follow the template (service role; no request body needed — it's a scheduled function). Query `leads` and open `tasks`, build the same digest shape as `digest.ts` (duplicated server-side, documented), and **return** the digest JSON. **Email delivery is deferred** (no email provider in the free-tier POC): include a clearly-commented `// TODO(after-provider): POST digest to Resend/SMTP` block that is inert, plus a one-paragraph header comment stating delivery is wired when a provider key exists. The in-app Command Center (Task 10) is the operative brief until then.

- [ ] **Step 2: Update `DEPLOY.md`**

Add a "POC functions" section: deploy commands for `score-inbound`, `draft-offer`, `draft-dispo`, `morning-brief`; the `0001_poc_tasks_and_gates.sql` apply step; and the cron schedule note (`supabase functions deploy morning-brief` + a Supabase scheduled trigger / `pg_cron` example for a daily 7am CT run).

- [ ] **Step 3: Register in `AUTOMATION_REGISTRY.md`**

Append rows for each new function (name, purpose, human-gate, status = "built, pending deploy", date 2026-06-09), per the house rule.

- [ ] **Step 4: Commit**

```bash
git add standard-black-os/supabase/functions/morning-brief standard-black-os/supabase/functions/DEPLOY.md ai-os/AUTOMATION_REGISTRY.md
git commit -m "feat(wholesale): morning-brief cron fn + deploy/registry docs (W9)"
```

---

## Task 12: Final verification + proofread

**Files:** none (verification only), plus any fixes found.

- [ ] **Step 1: Full test suite**

Run from `standard-black-os/`: `npm test`
Expected: all pure-logic suites pass (mao, tasks, csvImport, gates, dispo, compliance, digest).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: clean build, no TS errors.

- [ ] **Step 3: Proofread pass (self-review)**

- Grep new edge functions for `claude-sonnet-4-6` and `anthropic-version` — confirm present and consistent.
- Confirm STOP word list in `score-inbound` matches `compliance.ts` exactly.
- Confirm every `supabase.from('tasks')` / `deals.mao_approved_at` / `deals.offer_approved_at` reference matches the migration column names.
- Confirm all new routes render `WholesaleNav` and are registered in `App.jsx`.
- Confirm no secret keys are referenced with a `VITE_` prefix anywhere new (server-side only).

- [ ] **Step 4: Update the spec status + commit**

In the spec file, change Status to "Implemented (pending deploy)". Commit:
```bash
git add docs/superpowers/specs/2026-06-09-wholesale-os-poc-design.md
git commit -m "docs(wholesale): mark POC spec implemented (pending deploy)"
```

- [ ] **Step 5: Hand back to Kerry with the deploy runbook**

Summarize: what's built, that `npm test` + `npm run build` pass, and the exact deploy-time steps from `DEPLOY.md` (apply migration → set `ANTHROPIC_API_KEY` secret → deploy 4 functions → schedule morning-brief). The 30-day clock starts when PropStream is paid, not at deploy.

---

## Self-Review (plan vs spec)

- **Spec §6 workflows:** W1 (Task 4), W4 (Task 5), W5 (Task 6), W6 (already built — no task, correct), W7 (Task 7), W8 (Task 8), W9 (Tasks 10–11). W2/W3 are manual/already-built — no automation task, matches "deferred" scope. ✓
- **Spec §7 data model:** `tasks` table + `mao_approved_at`/`offer_approved_at` (Task 2 migration; types in Tasks 3 & 6). ✓
- **Spec §8 cockpit:** digest + task queue + async approvals (Tasks 6, 7, 10). ✓
- **Spec §9 gates:** MAO (Task 6), offer (Task 7), assignment (Task 8). ✓
- **Spec §10 compliance:** STOP detection (Task 5) + suppression (Task 9). ✓
- **Spec §12 deferred:** no n8n, no team assignment, no paid APIs, no automated cold SMS — confirmed absent. ✓
- **Spec §13 house rules:** AUTOMATION_REGISTRY updated (Task 11). ✓
- **Type consistency:** `Task`/`TaskType`/`TaskStatus` (Task 3) reused in tasks/digest/Tasks page; `Deal.mao_approved_at`/`offer_approved_at` defined Task 6, used Tasks 6–8; `BuyerMatchScore` reused from existing `matching.ts` in Task 8. ✓
- **Known duplication (intentional):** digest logic + STOP word list exist both in app libs and in Deno edge functions because edge functions are a separate bundle and cannot import app `src`. Flagged in commit messages and proofread step. ✓
