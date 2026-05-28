# Unified Standard Black OS — Design Spec

**Date:** 2026-05-27  
**Author:** Kerry Kelley Jr / Claude Code  
**Status:** Approved  

---

## Goal

Merge the Wholesale OS into the Standard Black OS as a native section — accessible at `/wholesale/*` — and deploy the unified app to Vercel with PWA support so Kerry can use it from his phone with a home screen icon, no laptop required.

---

## Architecture

### Base: Standard Black OS (Vite/React)

The SB OS remains the master application. Nothing in the existing SB Dashboard, Trading OS, or Venture Detail pages changes. The Wholesale OS is added as new routes alongside Trading OS:

```
standard-black-os/ (Vite/React)
├── /                     → SB Dashboard (unchanged)
├── /venture/:id          → Venture Detail (unchanged)
├── /trading-os/*         → Trading OS (unchanged)
└── /wholesale/*          → Wholesale OS (new)
    ├── /wholesale/dashboard
    ├── /wholesale/leads
    ├── /wholesale/deals
    ├── /wholesale/deals/new
    ├── /wholesale/deals/:id
    ├── /wholesale/buyers
    ├── /wholesale/buyers/new
    └── /wholesale/buyers/:id
```

### Backend: Supabase Edge Functions

Three Next.js API routes from the Wholesale OS require server-side execution (API keys must not be exposed in the browser):

| Edge Function | Replaces | Purpose |
|---|---|---|
| `draft-outreach` | `/api/leads/[id]/draft-outreach` | Anthropic — AI outreach draft (SMS or email) |
| `send-message` | `/api/leads/[id]/send-message` | Twilio — send SMS + log conversation |
| `deal-summary` | `/api/deals/[id]/summary` | Anthropic — AI deal analysis summary |

All other Wholesale OS data operations (CRUD for leads, deals, buyers) call Supabase directly via the JS client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_SERVICE_KEY` (same values as `NEXT_PUBLIC_*` in the current Wholesale OS).

The `wholesale-os/` Next.js codebase is archived (not deleted) once migration is complete.

---

## Navigation

### SB OS Header

The existing header bar gets a "Wholesale OS" link added alongside the existing nav items:

```
[Standard Black OS]  Ventures  Trading OS  [Wholesale OS]  [Config ⚙]
```

Implementation: Add a `<Link to="/wholesale/dashboard">` button in `Header.jsx` matching the existing header button styles (gold border on hover, uppercase mono text).

### Wholesale OS Internal Nav

Each Wholesale OS page gets a compact top nav bar:

```
← Standard Black OS  |  Dashboard  Leads  Deals  Buyers
```

- Back arrow returns to `/` (SB Dashboard)
- Section links use React Router `<NavLink>` with gold active state
- On mobile: collapses to a hamburger or scrollable horizontal pill row

---

## Wholesale OS Page Migration

### Components to Port

All Wholesale OS React components are ported as-is from Next.js → Vite. The only changes are:
1. Remove `'use client'` directives (not needed in Vite)
2. Replace `next/navigation` `useRouter` with `react-router-dom` `useNavigate`
3. Replace `next/navigation` `redirect()` with React Router `<Navigate>`
4. Replace `@/lib/supabase` import path with relative paths
5. Replace `fetch('/api/...')` calls with direct Supabase client calls or Edge Function URLs

### Files to migrate

```
wholesale-os/src/
├── lib/types.ts         → standard-black-os/src/wholesale/lib/types.ts
├── lib/mao.ts           → standard-black-os/src/wholesale/lib/mao.ts
├── lib/matching.ts      → standard-black-os/src/wholesale/lib/matching.ts
├── lib/adapters/        → standard-black-os/src/wholesale/lib/adapters/
├── lib/importMaps/      → standard-black-os/src/wholesale/lib/importMaps/
├── components/SidebarNav.tsx → replaced by internal WholesaleNav component
├── components/ui/       → standard-black-os/src/wholesale/components/ui/
└── app/
    ├── dashboard/page.tsx  → src/pages/wholesale/Dashboard.tsx
    ├── leads/page.tsx      → src/pages/wholesale/Leads.tsx
    ├── deals/page.tsx      → src/pages/wholesale/Deals.tsx
    ├── deals/new/page.tsx  → src/pages/wholesale/NewDeal.tsx
    ├── deals/[id]/page.tsx → src/pages/wholesale/DealDetail.tsx
    ├── buyers/page.tsx     → src/pages/wholesale/Buyers.tsx
    ├── buyers/new/page.tsx → src/pages/wholesale/NewBuyer.tsx
    └── buyers/[id]/page.tsx → src/pages/wholesale/BuyerDetail.tsx
```

### Supabase Client

Add a `src/wholesale/lib/supabase.ts` file using Vite env vars:

```ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SERVICE_KEY
)
```

Add `@supabase/supabase-js` to `standard-black-os/package.json`.

### TypeScript Support

Add TypeScript support to the Vite project:
- `npm install -D typescript @types/react @types/react-dom`
- Add `tsconfig.json` targeting ES2020
- Vite already handles `.tsx` files natively once tsconfig is present
- Existing `.jsx` files are untouched

---

## Gold Theme Application

All Wholesale OS pages get reskinned to match SB Dashboard's token system.

### Color Mapping

| Wholesale (current) | SB OS Token | Value |
|---|---|---|
| `#7fff7b` (green accent) | `C.gold` | `#C9A24A` |
| `#7b9fff` (blue links) | `C.gold` | `#C9A24A` |
| `rgba(127,255,123,...)` | `rgba(201,162,74,...)` | gold alpha |
| `#333` borders | `C.border` | `#2a2a2a` |
| `#0f0f0f` surface | `C.surface` | `#111111` |
| `#555` muted text | `C.mute` | `#555` (same) |
| `#aaa` secondary | `C.sub` | `#777` |

The SB token file (`src/tokens.js`) is imported into all Wholesale OS pages and components.

### Typography

Wholesale OS uses Tailwind `font-mono`. SB OS uses inline styles with `fontFamily: f.mono`. The ported pages use the SB token `f.mono` for consistency. Tailwind CSS is added to the SB OS Vite project (`npm install -D tailwindcss postcss autoprefixer`) and scoped to Wholesale OS pages only — existing SB OS pages use inline styles and are unaffected.

---

## PWA Configuration

### Package

`vite-plugin-pwa` added as a dev dependency.

### Manifest

```json
{
  "name": "Standard Black OS",
  "short_name": "SB OS",
  "description": "Standard Black executive operating system",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Icons: A gold "SB" monogram on black background. Created as inline SVG and exported to PNG at 192×192 and 512×512 using a Node script (`scripts/generate-icons.js`) that runs during the build setup phase. Icons placed at `public/icons/`.

### Service Worker Strategy

`GenerateSW` with `networkFirst` for API/Supabase calls and `cacheFirst` for static assets. App loads fast on slow mobile connections.

---

## Vercel Deployment

### Build Config

Vite builds a static site. Vercel auto-detects Vite:
- Build command: `npm run build`
- Output directory: `dist`
- Root: `standard-black-os/`

### Environment Variables (set in Vercel dashboard)

```
VITE_SUPABASE_URL         = <from wholesale-os/.env.local>
VITE_SUPABASE_SERVICE_KEY = <from wholesale-os/.env.local NEXT_PUBLIC_SUPABASE_SERVICE_KEY>
VITE_SUPABASE_ANON_KEY    = <from wholesale-os/.env.local>
```

### Custom Domain (optional, post-launch)

`os.standardblack.com` → pointed at Vercel deployment via DNS CNAME.

---

## Supabase Edge Functions

Three functions deployed to the Supabase project. Called from the frontend via `supabase.functions.invoke(...)`.

### `draft-outreach`

**Input:** `{ leadId: string, channel: 'sms' | 'email' }`  
**Output:** `{ draft: string, subject?: string }`  
**Logic:** Fetches lead from DB, calls Anthropic Claude to generate outreach copy.  
**Secrets needed:** `ANTHROPIC_API_KEY`

### `send-message`

**Input:** `{ leadId: string, body: string, channel: 'sms' | 'email', aiGenerated: boolean }`  
**Output:** `{ success: boolean }`  
**Logic:** Logs conversation to DB, calls Twilio to send SMS if channel is sms.  
**Secrets needed:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`

### `deal-summary`

**Input:** `{ dealId: string }`  
**Output:** `{ summary: string }`  
**Logic:** Fetches deal + lead from DB, calls Anthropic to generate analysis summary.  
**Secrets needed:** `ANTHROPIC_API_KEY`

---

## Mobile Responsiveness

All Wholesale OS pages are already built with responsive Tailwind classes. The SB Dashboard and Trading OS use fixed-width grid layouts — these get a mobile breakpoint added to collapse from multi-column to single-column on viewports under 768px. Specifically:

- `gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)'` → `1fr` on mobile
- KPI strip: `repeat(auto-fit, minmax(200px, 1fr))` already responsive ✅
- Header (`Header.jsx`): on viewports under 640px, the nav links (Ventures, Trading OS, Wholesale OS) hide and a hamburger icon appears. Tapping it slides down a full-width mobile menu. The existing header structure is preserved — mobile behavior is additive via a `useState` toggle and CSS media query.

---

## Implementation Order

Four workstreams — three run in parallel, one final integration pass:

| Phase | Workstream | Output |
|---|---|---|
| Phase 1A | Port Wholesale OS pages + Supabase client into Vite | New `/wholesale/*` routes working locally |
| Phase 1B | Build 3 Supabase Edge Functions | AI + SMS calls working via Edge Functions |
| Phase 1C | Add TypeScript + gold theme to ported pages | Wholesale pages visually matching SB OS |
| Phase 2 | Navigation, PWA config, SB Dashboard mobile tweaks, Vercel deploy | Live app installable on phone |

Phases 1A, 1B, and 1C run in parallel using subagents. Phase 2 runs after all three are merged and verified.

---

## Success Criteria

- [ ] `/wholesale/dashboard` loads inside SB OS at `localhost:5173`
- [ ] All Wholesale OS routes functional (leads, deals, buyers, new deal, deal detail)
- [ ] Gold theme applied — no green or blue accents remaining in Wholesale pages
- [ ] SB Dashboard header has working "Wholesale OS" link
- [ ] 3 Edge Functions deployed and callable from the Vite app
- [ ] Vite builds with `npm run build` — no TypeScript errors
- [ ] PWA manifest and service worker present in build output
- [ ] Deployed to Vercel at a live HTTPS URL
- [ ] "Add to Home Screen" tested on iOS/Android — app opens fullscreen
- [ ] SB Dashboard and Wholesale OS pages usable on 390px mobile viewport

---

## Out of Scope (this iteration)

- Auth / login screen (single-user tool, no auth needed yet)
- Push notifications
- App Store / Play Store listing
- Real-time data sync (Supabase Realtime)
- Migrating SB Dashboard localStorage data to Supabase
