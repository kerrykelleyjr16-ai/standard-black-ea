# Wholesale OS Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild all 11 wholesale pages of Standard Black OS on a shared luxury component kit (tokens + inline styles), fix the three console errors, and verify at 390px mobile width — no business-logic, route, or data changes.

**Architecture:** Component-kit first. Wave A builds token extensions and 16 shared UI components in `src/wholesale/components/ui/` plus the app shell/nav restyle and console fixes (sequential). Waves B–D restyle pages in parallel (each page is its own file; agents touch disjoint files and do NOT run git commands — the orchestrator commits each wave). Wave E verifies.

**Tech Stack:** Vite + React 18 + TypeScript, react-router-dom 6, inline styles from `src/tokens.js` (NO Tailwind — Tailwind classNames in existing files are dead code; remove them as you touch files), lucide-react icons, vitest for lib tests.

**Spec:** `docs/superpowers/specs/2026-06-10-wholesale-os-visual-redesign-design.md`
**Visual reference:** Kerry's handoff doc (translated: gold is `#C9A24A` from tokens, NOT `#D4AF37`; Tailwind snippets there are visual intent only).

**Working dir:** `standard-black-os/` (all paths below relative to it unless prefixed).

**Hard rules for every task:**
- Preserve all data fetching, Supabase calls, handlers, state, and routes exactly.
- No new dependencies.
- Pure inline styles + tokens; no `className` except the few CSS-animation/media-query hooks defined in this plan.
- Mobile-first: single column < 768px; content padding-bottom must clear the bottom tab bar.
- Agents in parallel waves MUST NOT run `git add/commit` (orchestrator commits).

---

## WAVE A — Foundation (sequential, one agent or orchestrator)

### Task A1: Token extensions

**Files:**
- Modify: `src/tokens.js`

- [ ] **Step 1: Add semantic tokens (additive, non-breaking)**

```js
export const C = {
  bg:      "#050505",
  panel:   "#0E0E0E",
  surface: "#111111",
  surface2:"#1A1A1A",
  cardSoft:"#151515",
  border:  "#222222",
  borderHi:"#333333",
  borderGold: "rgba(201,162,74,0.18)",
  borderSoft: "rgba(255,255,255,0.10)",
  text:    "#F5F1E8",
  sub:     "rgba(245,241,232,0.65)",
  mute:    "rgba(245,241,232,0.35)",
  dim:     "#333333",
  gold:    "#C9A24A",
  goldHi:  "#E8BE6A",
  goldDim: "rgba(201,162,74,0.2)",
  green:   "#3ea676",
  red:     "#c0504d",
  success: "#4ADE80",
  warning: "#FACC15",
  danger:  "#F87171",
  blue:    "#60A5FA",
  purple:  "#C084FC",
};
```

(`f` fonts object unchanged.)

- [ ] **Step 2: Verify nothing broke**

Run: `npm test` → all existing tests pass. Run: `npm run build` → succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/tokens.js && git commit -m "feat(wholesale): semantic token extensions for redesign kit"
```

### Task A2: Lead priority lib (TDD)

**Files:**
- Create: `src/wholesale/lib/priority.ts`
- Test: `src/wholesale/lib/priority.test.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from 'vitest'
import { getLeadPriority } from './priority'

describe('getLeadPriority', () => {
  it('returns Hot for qualified + tax delinquent', () => {
    expect(getLeadPriority({ status: 'Qualified', tags: ['Tax Delinquent'] })).toBe('Hot')
  })
  it('returns Hot for qualified + absentee', () => {
    expect(getLeadPriority({ status: 'qualified', tags: ['absentee'] })).toBe('Hot')
  })
  it('returns Warm for vacant tag', () => {
    expect(getLeadPriority({ status: 'Contacted', tags: ['Vacant'] })).toBe('Warm')
  })
  it('returns Warm for new status', () => {
    expect(getLeadPriority({ status: 'New', tags: [] })).toBe('Warm')
  })
  it('returns Cold otherwise', () => {
    expect(getLeadPriority({ status: 'Contacted', tags: ['Probate'] })).toBe('Cold')
  })
  it('handles missing tags/status', () => {
    expect(getLeadPriority({})).toBe('Cold')
  })
})
```

- [ ] **Step 2: Run** `npm test -- priority` → FAIL (module not found)

- [ ] **Step 3: Implement**

```ts
export type LeadPriority = 'Hot' | 'Warm' | 'Cold'

export function getLeadPriority(lead: { status?: string | null; tags?: string[] | null }): LeadPriority {
  const tags = (lead.tags ?? []).map((t) => t.toLowerCase())
  const status = (lead.status ?? '').toLowerCase()
  if (status === 'qualified' && (tags.includes('tax delinquent') || tags.includes('absentee'))) return 'Hot'
  if (tags.includes('vacant') || status === 'new') return 'Warm'
  return 'Cold'
}
```

- [ ] **Step 4: Run** `npm test -- priority` → PASS
- [ ] **Step 5: Commit** `git add src/wholesale/lib/priority.* && git commit -m "feat(wholesale): lead priority derivation (Hot/Warm/Cold)"`

### Task A3: Kit primitives

**Files (create all in `src/wholesale/components/ui/`):**
`EntityCard.tsx`, `StatusBadge.tsx`, `TagBadge.tsx`, `Metric.tsx`, `SearchBar.tsx`, `ActionBar.tsx`, `EmptyState.tsx`

Shared import header for each: `import React from 'react'` + `import { C, f } from '../../../tokens.js'`

- [ ] **Step 1: EntityCard.tsx** — base card every other card composes

```tsx
import React from 'react'
import { C } from '../../../tokens.js'

export default function EntityCard({ children, style, onClick }: {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}) {
  return (
    <article
      onClick={onClick}
      style={{
        borderRadius: 16,
        border: `1px solid ${C.borderGold}`,
        background: C.surface,
        padding: 20,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.3)',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </article>
  )
}
```

- [ ] **Step 2: StatusBadge.tsx** — pill mapped from status text → semantic color

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'

const STATUS_COLORS: Record<string, string> = {
  new: C.blue, 'skip traced': C.purple, contacted: C.warning, responded: C.warning,
  qualified: C.success, analyzed: C.blue, matched: C.gold, 'offer made': C.gold,
  'under contract': C.warning, assigned: C.success, closed: C.success,
  dead: C.danger, active: C.success, hot: C.danger, warm: C.warning, cold: C.blue,
  pending: C.warning, done: C.success, 'opted out': C.danger,
}

export default function StatusBadge({ label, color }: { label: string; color?: string }) {
  const resolved = color ?? STATUS_COLORS[label.toLowerCase()] ?? C.sub
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', flexShrink: 0,
      borderRadius: 999, padding: '4px 12px',
      background: `color-mix(in srgb, ${resolved} 12%, transparent)`,
      color: resolved, fontFamily: f.mono, fontSize: 11, fontWeight: 500,
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}
```

(If `color-mix` proves unreliable in the PWA webview, fall back to a small `hexToRgba` helper inside this file — verify visually in Wave E.)

- [ ] **Step 3: TagBadge.tsx**

```tsx
import React from 'react'
import { f, C } from '../../../tokens.js'

export default function TagBadge({ label }: { label: string }) {
  return (
    <span style={{
      borderRadius: 999, padding: '4px 12px', background: 'rgba(96,165,250,0.10)',
      color: C.blue, fontFamily: f.mono, fontSize: 11, whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}
```

- [ ] **Step 4: Metric.tsx**

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'

export default function Metric({ label, value, highlight = false }: {
  label: string; value: React.ReactNode; highlight?: boolean
}) {
  return (
    <div style={{ borderRadius: 12, background: 'rgba(0,0,0,0.3)', padding: 12 }}>
      <p style={{ fontFamily: f.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.mute }}>{label}</p>
      <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, fontWeight: 600, color: highlight ? C.gold : C.text }}>{value}</p>
    </div>
  )
}
```

- [ ] **Step 5: SearchBar.tsx**

```tsx
import React, { useState } from 'react'
import { C, f } from '../../../tokens.js'

export default function SearchBar({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        width: '100%', borderRadius: 12,
        border: `1px solid ${focused ? 'rgba(201,162,74,0.5)' : C.borderSoft}`,
        background: 'rgba(0,0,0,0.3)', padding: '12px 16px',
        fontFamily: f.body, fontSize: 14, color: C.text, outline: 'none',
        transition: 'border-color 0.15s',
      }}
    />
  )
}
```

- [ ] **Step 6: ActionBar.tsx** — gold-gradient primary + ghost secondary buttons

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'

export function PrimaryButton({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      borderRadius: 12, border: 'none',
      background: `linear-gradient(to right, ${C.gold}, #8a6d2f)`,
      padding: '12px 16px', fontFamily: f.body, fontSize: 14, fontWeight: 600,
      color: '#050505', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export function SecondaryButton({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      borderRadius: 12, border: `1px solid ${C.borderSoft}`, background: 'rgba(255,255,255,0.03)',
      padding: '12px 16px', fontFamily: f.body, fontSize: 14, fontWeight: 500,
      color: C.sub, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export default function ActionBar({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, ...style }}>{children}</div>
}
```

- [ ] **Step 7: EmptyState.tsx**

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'

export default function EmptyState({ icon = '$', title, body, actions }: {
  icon?: React.ReactNode; title: string; body: string; actions?: React.ReactNode
}) {
  return (
    <section style={{
      marginTop: 24, borderRadius: 16, border: `1px dashed rgba(201,162,74,0.25)`,
      background: C.panel, padding: 24, textAlign: 'center',
    }}>
      <div style={{
        margin: '0 auto', display: 'flex', height: 48, width: 48, alignItems: 'center',
        justifyContent: 'center', borderRadius: 999, background: 'rgba(201,162,74,0.1)',
        fontSize: 18, fontWeight: 600, color: C.gold, fontFamily: f.display,
      }}>{icon}</div>
      <h2 style={{ marginTop: 16, fontFamily: f.display, fontSize: 18, fontWeight: 600, color: C.text }}>{title}</h2>
      <p style={{ margin: '8px auto 0', maxWidth: 384, fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.mute }}>{body}</p>
      {actions ? <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>{actions}</div> : null}
    </section>
  )
}
```

- [ ] **Step 8: Build check + commit**

Run: `npm run build` → succeeds.
```bash
git add src/wholesale/components/ui && git commit -m "feat(wholesale): kit primitives — EntityCard, badges, Metric, SearchBar, ActionBar, EmptyState"
```

### Task A4: PageHeader + FilterPills

**Files:**
- Create: `src/wholesale/components/ui/PageHeader.tsx`
- Create: `src/wholesale/components/ui/FilterPills.tsx`

- [ ] **Step 1: PageHeader.tsx**

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'
import ActionBar, { PrimaryButton, SecondaryButton } from './ActionBar'

export default function PageHeader({ eyebrow, title, subtitle, primaryAction, secondaryAction, onPrimary, onSecondary, children }: {
  eyebrow: string; title: string; subtitle?: string
  primaryAction?: string; secondaryAction?: string
  onPrimary?: () => void; onSecondary?: () => void
  children?: React.ReactNode
}) {
  return (
    <section style={{
      borderRadius: 16, border: `1px solid ${C.borderGold}`, background: C.surface,
      padding: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontFamily: f.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: C.gold }}>{eyebrow}</p>
      <h1 style={{ marginTop: 8, fontFamily: f.display, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', color: C.text }}>{title}</h1>
      {subtitle ? <p style={{ marginTop: 8, fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.mute }}>{subtitle}</p> : null}
      {children ? <div style={{ marginTop: 20 }}>{children}</div> : null}
      {(primaryAction || secondaryAction) && (
        <ActionBar style={{ marginTop: 20 }}>
          {primaryAction && <PrimaryButton label={primaryAction} onClick={onPrimary} />}
          {secondaryAction && <SecondaryButton label={secondaryAction} onClick={onSecondary} />}
        </ActionBar>
      )}
    </section>
  )
}
```

- [ ] **Step 2: FilterPills.tsx**

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'

export type FilterPill = { label: string; value: string; count?: number }

export default function FilterPills({ filters, active, onChange }: {
  filters: FilterPill[]; active: string; onChange: (value: string) => void
}) {
  return (
    <div className="sb-hide-scrollbar" style={{ marginTop: 20, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      {filters.map((filter) => {
        const isActive = filter.value === active
        return (
          <button key={filter.value} onClick={() => onChange(filter.value)} style={{
            whiteSpace: 'nowrap', borderRadius: 999, padding: '8px 16px',
            fontFamily: f.mono, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
            ...(isActive
              ? { background: `linear-gradient(to right, ${C.gold}, #8a6d2f)`, color: '#050505', border: '1px solid transparent' }
              : { background: C.surface, color: C.gold, border: `1px solid ${C.borderGold}` }),
          }}>
            {filter.label}{typeof filter.count === 'number' ? ` ${filter.count}` : ''}
          </button>
        )
      })}
    </div>
  )
}
```

Add once to `src/index.css` (global, used by pills and nav):

```css
.sb-hide-scrollbar::-webkit-scrollbar { display: none; }
.sb-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

- [ ] **Step 3: Build check + commit**

`npm run build` → succeeds.
```bash
git add src/wholesale/components/ui src/index.css && git commit -m "feat(wholesale): PageHeader + FilterPills kit components"
```

### Task A5: Entity cards (LeadCard, DealCard, BuyerCard)

**Files (create in `src/wholesale/components/ui/`):** `LeadCard.tsx`, `DealCard.tsx`, `BuyerCard.tsx`

**IMPORTANT:** Before writing these, read `src/pages/wholesale/Leads.tsx`, `Deals.tsx`, `Buyers.tsx` to capture the REAL field names from the existing row rendering (e.g., snake_case Supabase columns like `owner_name`, `property_address`). The prop types below must be adjusted to the actual data shape — do not invent fields. Cards accept the row object the page already has.

- [ ] **Step 1: LeadCard.tsx** (structure; bind real fields)

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'
import EntityCard from './EntityCard'
import StatusBadge from './StatusBadge'
import TagBadge from './TagBadge'
import { getLeadPriority } from '../../lib/priority'

// Adjust Lead type import to the project's actual type (src/wholesale/lib/types.ts)
export default function LeadCard({ lead, onClick }: { lead: any; onClick?: () => void }) {
  const priority = getLeadPriority(lead)
  const priorityColor = priority === 'Hot' ? C.danger : priority === 'Warm' ? C.warning : C.blue
  return (
    <EntityCard onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 16, fontWeight: 600, color: C.text }}>
            {/* address field */}
          </h3>
          <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 13, color: C.mute }}>{/* city, state zip */}</p>
        </div>
        <StatusBadge label={priority} color={priorityColor} />
      </div>
      <p style={{ marginTop: 16, fontFamily: f.body, fontSize: 14, color: C.sub }}>{/* owner name */}</p>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {/* tags?.map(tag => <TagBadge key={tag} label={tag} />) */}
      </div>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.borderSoft}`, paddingTop: 16 }}>
        <StatusBadge label={/* status */ ''} />
        <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>{/* updated-at, relative */}</span>
      </div>
    </EntityCard>
  )
}
```

- [ ] **Step 2: DealCard.tsx** — same header pattern (address + StatusBadge), then 2-col Metric grid:

```tsx
<div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
  <Metric label="ARV" value={/* arv, $-formatted */} />
  <Metric label="Asking" value={/* asking */} />
  <Metric label="Spread" value={/* spread */} highlight />
  <Metric label="Buyers" value={/* `${n} matched` */} />
</div>
<div style={{ marginTop: 20, borderTop: `1px solid ${C.borderSoft}`, paddingTop: 16 }}>
  <p style={{ fontFamily: f.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: C.mute }}>Next Action</p>
  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <p style={{ fontFamily: f.body, fontSize: 14, color: C.sub }}>{/* next action or 'Prepare buyer package' */}</p>
    <span style={{ flexShrink: 0, fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.gold }}>View Deal</span>
  </div>
</div>
```

- [ ] **Step 3: BuyerCard.tsx** — name/company header + StatusBadge('Active'), badge row (`TagBadge` strategy + gold StatusBadge `{margin}% Margin`), then stacked label/value blocks for Markets and Price Range (mono uppercase label, body value), footer row "Buyer profile" / gold "View Buyer".

- [ ] **Step 4: Build check + commit**

`npm run build` → succeeds.
```bash
git add src/wholesale/components/ui && git commit -m "feat(wholesale): LeadCard, DealCard, BuyerCard kit components"
```

### Task A6: FormPanel + DetailPanel

**Files (create in `src/wholesale/components/ui/`):** `FormPanel.tsx`, `DetailPanel.tsx`

- [ ] **Step 1: DetailPanel.tsx** — titled card section for detail pages

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'

export default function DetailPanel({ title, action, children }: {
  title: string; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <section style={{
      borderRadius: 16, border: `1px solid ${C.borderGold}`, background: C.surface,
      padding: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 style={{ fontFamily: f.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.gold }}>{title}</h2>
        {action ?? null}
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </section>
  )
}
```

- [ ] **Step 2: FormPanel.tsx** — DetailPanel-style wrapper + labeled field helpers

```tsx
import React from 'react'
import { C, f } from '../../../tokens.js'
import DetailPanel from './DetailPanel'

const inputStyle: React.CSSProperties = {
  width: '100%', borderRadius: 12, border: `1px solid ${C.borderSoft}`,
  background: 'rgba(0,0,0,0.3)', padding: '12px 16px',
  fontFamily: f.body, fontSize: 14, color: C.text, outline: 'none',
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: f.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: C.mute, marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...(props.style ?? {}) }} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputStyle, appearance: 'none', ...(props.style ?? {}) }} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, minHeight: 96, resize: 'vertical', ...(props.style ?? {}) }} />
}

export default function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <DetailPanel title={title}>
      <div style={{ display: 'grid', gap: 16 }}>{children}</div>
    </DetailPanel>
  )
}
```

- [ ] **Step 3: Build check + commit**

`npm run build` → succeeds.
```bash
git add src/wholesale/components/ui && git commit -m "feat(wholesale): FormPanel + DetailPanel kit components"
```

### Task A7: Shell + navigation restyle

**Files:**
- Create: `src/wholesale/components/ui/DesktopShell.tsx`
- Modify: `src/wholesale/components/WholesaleNav.tsx`
- Modify: `src/components/MobileTabBar.jsx` (a.k.a. MobileBottomNav role — restyle in place; app-wide so change is conservative)

- [ ] **Step 1: DesktopShell.tsx** — wraps every wholesale page

```tsx
import React from 'react'
import { C } from '../../../tokens.js'
import WholesaleNav from '../WholesaleNav'

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)',
    }}>
      <WholesaleNav />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px' }}>{children}</main>
    </div>
  )
}
```

(Check how pages currently mount `WholesaleNav` — if a layout route already renders it, DesktopShell should NOT double-render it; in that case restyle the layout instead and have DesktopShell handle only padding/max-width. Resolve against `src/App.jsx` routing before writing.)

- [ ] **Step 2: WholesaleNav restyle** — two-tier luxury header, same routes/links. Keep `← Standard Black OS` link. Tier 1: brand eyebrow ("STANDARD BLACK OS" mono 11px letterspaced `C.mute`) + sub-eyebrow ("ACQUISITION COMMAND CENTER" 10px `C.gold` at 80% opacity). Tier 2: scrollable tab row (`className="sb-hide-scrollbar"`, `overflowX: 'auto'`), each tab mono 11px uppercase letterspaced, active = `borderBottom: 2px solid ${C.gold}` + `color: C.gold`, inactive = transparent border + `C.mute`, hover → `C.sub`. Header container: `position: sticky, top: 0, zIndex: 50, borderBottom: 1px solid ${C.borderSoft}, background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(16px)', padding: '14px 16px 0'`, plus `paddingTop: 'calc(env(safe-area-inset-top) + 14px)'` so it clears the iPhone status bar. NAV_ITEMS unchanged: Command, Dashboard, Leads, Deals, Buyers, Tasks.

- [ ] **Step 3: MobileTabBar polish** — keep routes and lucide icons. Active tab: wrap icon in a 28px rounded container `background: 'rgba(201,162,74,0.12)', border: 1px solid rgba(201,162,74,0.4)`; label stays mono 9px uppercase. Inactive `C.mute`. Container: keep fixed bottom + safe-area padding; bump background to `rgba(5,5,5,0.95)` and border to `C.borderSoft`.

- [ ] **Step 4: Build + visual sanity, commit**

`npm run build` → succeeds. `npm test` → passes.
```bash
git add src/wholesale/components src/components/MobileTabBar.jsx && git commit -m "feat(wholesale): luxury shell, two-tier nav, premium bottom tab bar"
```

### Task A8: Console error fixes

**Files:**
- Create: `public/favicon.svg` (and reference in `index.html`)
- Modify: `src/App.jsx` or router setup (future flags)
- Modify: task-queue fetch site (find with `grep -rn "from('tasks')" src/`)

- [ ] **Step 1: Favicon** — create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#050505"/><text x="16" y="22" font-family="Georgia, serif" font-size="16" font-weight="600" fill="#C9A24A" text-anchor="middle">SB</text></svg>
```

Add to `index.html` `<head>`: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`

- [ ] **Step 2: Router future flags** — locate `createBrowserRouter`/`<BrowserRouter>` in `src/App.jsx`/`src/main.jsx`. For `<BrowserRouter>` use:

```jsx
<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
```

- [ ] **Step 3: Graceful tasks 404** — find every Supabase query against `tasks` (`grep -rn "'tasks'" src/`). Wrap so a failed response sets an `unavailable` state instead of throwing/spamming: render a calm note via `EmptyState` (title "Task queue offline", body "Task tables are not provisioned in this environment yet.") and `console.warn` once. Confirm `supabase/functions/DEPLOY.md` mentions applying `0001_poc_tasks_and_gates.sql`; add a line if missing.

- [ ] **Step 4: Verify + commit**

Run `npm run dev`, open `http://localhost:5173/wholesale/command`, console shows no favicon 404, no router warnings, no unhandled tasks errors.
```bash
git add public index.html src supabase/functions/DEPLOY.md && git commit -m "fix(wholesale): favicon, router v7 flags, graceful tasks-table fallback"
```

---

## WAVE B — Core pages (3 parallel agents, disjoint files, NO git commands)

Common brief for every page task: read the page file fully first; keep every hook, handler, Supabase call, and route; replace only JSX/presentation; compose kit components; delete dead Tailwind classNames; wrap page in `DesktopShell` (resolving the layout-route question from A7); single column < 768px via `gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))'` card grids; all data rendering must use real fields already referenced in the file.

### Task B1: Leads page

**Files:** Modify: `src/pages/wholesale/Leads.tsx`

- [ ] PageHeader: eyebrow "Acquisition Desk", title "Leads Pipeline", subtitle "`${n} active acquisition opportunities.`", primary "+ Import Leads", secondary "Add Lead" — wire to the page's EXISTING import/add handlers; SearchBar as header child bound to existing search state (create local state only if none exists).
- [ ] FilterPills bound to existing status filter state, one pill per existing status option with live counts computed from loaded leads (`All` first).
- [ ] Replace list/table rendering with LeadCard grid; card onClick navigates to existing LeadDetail route.
- [ ] Empty state (no leads / no filter matches) via EmptyState with "Import Leads" primary CTA.
- [ ] Verify: `npm run build` passes; page renders with dev server; no horizontal overflow at 390px.

### Task B2: Deals page

**Files:** Modify: `src/pages/wholesale/Deals.tsx`

- [ ] PageHeader: eyebrow "Disposition Desk", title "Deals Pipeline", subtitle "Qualified acquisition opportunities ready for buyer matching, assignment, and disposition.", primary "+ New Deal" (existing route to NewDeal), secondary existing buyer-match action if present.
- [ ] FilterPills for existing pipeline stages with counts.
- [ ] DealCard grid bound to real deal fields ($-format numbers with existing formatter if the file has one; otherwise `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })`).
- [ ] EmptyState when no deals: icon "$", title "No Active Deals Yet", body "Qualified leads will appear here once they are ready for buyer matching, assignment, or disposition.", primary "Review Qualified Leads" (→ leads page filtered qualified if supported, else leads page), secondary "Create Deal".
- [ ] Verify build + 390px.

### Task B3: Buyers page

**Files:** Modify: `src/pages/wholesale/Buyers.tsx`

- [ ] PageHeader: eyebrow "Disposition Network", title "Buyer Network", subtitle "`${n} active cash buyers and acquisition partners.`", primary "+ Add Buyer" (existing NewBuyer route), secondary "Import Buyers" if that action exists; SearchBar child.
- [ ] Mobile (<1024px): BuyerCard single-column grid. Desktop (≥1024px): keep a table — restyled (surface bg, `C.borderSoft` row dividers, mono uppercase letterspaced header, gold margin column, success status column). Toggle via a `useEffect`-backed `window.matchMedia('(min-width: 1024px)')` listener (pattern may already exist in the codebase — search for `matchMedia` and reuse).
- [ ] Verify build + 390px (no table on mobile).

---

## WAVE C — Operator pages (3 parallel agents, NO git commands)

### Task C1: Command Center

**Files:** Modify: `src/pages/wholesale/CommandCenter.tsx`

- [ ] This page carries the known styling problem from last session — rebuild its layout entirely from kit: PageHeader (eyebrow "Operator Console", title "Command Center", subtitle = digest date line), digest sections as DetailPanel blocks, task queue items as EntityCards with StatusBadge + ActionBar (approve/decline buttons keep existing handlers), Metric tiles for any counts.
- [ ] Task-queue unavailable state must use the graceful fallback from A8.
- [ ] Verify build + 390px; compare against `preview-command-center.png` for what was broken (cramped/overlap) and confirm resolved.

### Task C2: Wholesale Dashboard

**Files:** Modify: `src/pages/wholesale/WholesaleDashboard.tsx`

- [ ] PageHeader (eyebrow "Executive Desk", title "Wholesale Dashboard"). KPI stats → Metric tiles in responsive grid; lists/sections → DetailPanel; statuses → StatusBadge. Keep recharts charts if present — wrap in DetailPanel, recolor axes/strokes to tokens (`C.mute` axes, `C.gold` primary series) only if trivially exposed as props.
- [ ] Verify build + 390px.

### Task C3: Tasks page

**Files:** Modify: `src/pages/wholesale/Tasks.tsx`

- [ ] PageHeader (eyebrow "Operator Queue", title "Tasks"), FilterPills for existing status filters, task rows → EntityCard list (single column) with StatusBadge + existing action buttons as Primary/SecondaryButton, EmptyState for empty/unavailable (per A8 fallback).
- [ ] Verify build + 390px.

---

## WAVE D — Detail pages + forms (4 parallel agents, NO git commands)

### Task D1: LeadDetail (`src/pages/wholesale/LeadDetail.tsx`)
### Task D2: DealDetail (`src/pages/wholesale/DealDetail.tsx`)
### Task D3: BuyerDetail (`src/pages/wholesale/BuyerDetail.tsx`)

Common for D1–D3:
- [ ] Page top: PageHeader variant — eyebrow = entity type ("Lead" / "Deal" / "Buyer"), title = address or name, subtitle = secondary identity line, StatusBadge near title, ActionBar with the page's existing actions.
- [ ] Every content block becomes a DetailPanel (e.g., "Property", "Owner", "Motivation Signals", "Offer", "Activity", "Matched Buyers"). Field rows: label (mono 10px uppercase letterspaced `C.mute`) over value (body 14px `C.text`), in a `display: grid; gridTemplateColumns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px` grid.
- [ ] Money values gold-highlighted via Metric where they're focal (MAO, spread, offer).
- [ ] These are the biggest files (420–1123 lines) — work section by section; behavior must be byte-identical (every button, gate, approval flow preserved).
- [ ] Verify build + 390px each.

### Task D4: NewDeal + NewBuyer forms (`src/pages/wholesale/NewDeal.tsx`, `src/pages/wholesale/NewBuyer.tsx`)

- [ ] Wrap each logical field group in FormPanel; convert inputs/selects/textareas to `TextInput`/`SelectInput`/`TextArea` + `Field` (preserving name/value/onChange/validation exactly); submit row = ActionBar with PrimaryButton submit + SecondaryButton cancel.
- [ ] Verify build + 390px; create-flow still submits (manually test one creation against dev data if dev server has Supabase access, else verify handlers unchanged by diff review).

---

## WAVE E — Verification (orchestrator)

### Task E1: Full verification pass

- [ ] `npm test` → all pass. `npm run build` → clean.
- [ ] `npm run dev` + Playwright (or browser tool) at 390×844: screenshot every one of the 11 routes; check — no horizontal scroll, no text overlap, no raw tables on mobile, no content under bottom tab bar, consistent cards/badges/spacing.
- [ ] Desktop 1280px: Buyers table visible and styled; layouts use width sensibly.
- [ ] Console: only acceptable entries (tasks fallback warn if table absent). No favicon 404, no router warnings.
- [ ] Acceptance criteria from spec checked one by one.
- [ ] Commit any fixes; final commit message `feat(wholesale): luxury redesign — unified kit across all wholesale pages`.

---

## Self-review notes

- Spec coverage: tokens (A1), priority logic (A2), 16 components (A3–A7: DesktopShell, MobileBottomNav=MobileTabBar restyle, PageHeader, SearchBar, FilterPills, EntityCard, LeadCard, DealCard, BuyerCard, Metric, EmptyState, ActionBar, StatusBadge, TagBadge, FormPanel, DetailPanel), nav (A7), console errors (A8), 10-step page order (B→D), acceptance criteria (E1). Deploy explicitly out of scope.
- Parallel-safety: waves touch disjoint files; only orchestrator runs git.
- Open implementation question deliberately delegated: whether `WholesaleNav` is mounted per-page or via layout route — resolved in A7 Step 1 against `src/App.jsx`.
