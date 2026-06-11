# Wholesale OS Visual Redesign — Design Spec

**Date:** 2026-06-10
**Source:** `standard_black_os_claude_redesign_handoff.md` (Google Drive, Kerry) + brainstorm decisions
**App:** `standard-black-os/` (Vite + React 18 + react-router 6 + Supabase, inline-style pattern via `src/tokens.js`)

## Mission

Redesign the wholesale section of Standard Black OS into a luxury, mobile-first
acquisition CRM — "acquisition command center + buyer matching CRM + disposition
pipeline." Visual redesign only: keep all routes, data, business logic, imports,
and state management intact.

## Decisions (locked during brainstorm)

1. **Scope: all 11 wholesale pages** — Leads, Deals, Buyers (per handoff doc) plus
   Command Center, Wholesale Dashboard, LeadDetail, DealDetail, BuyerDetail,
   NewDeal, NewBuyer, Tasks.
2. **Styling: inline styles + tokens.js.** Tailwind stays off. The handoff doc's
   Tailwind code is a *visual spec*, not paste-in code. No risk to Trading/AIOS/main
   Dashboard sections.
3. **Console errors fixed in this pass; deploy is a separate follow-up** after the
   redesign is verified.
4. **Brand gold stays `#C9A24A`** (existing `tokens.js` value used across the whole
   app), not the doc's `#D4AF37`. One gold across the OS. The doc's semantic colors
   are adopted as token extensions.

## Design System

### Token extensions (`src/tokens.js`)

Add to the existing `C` object (non-breaking, additive):

- `panel: '#0E0E0E'` — section background between bg and surface
- `cardSoft: '#151515'` — soft card layer
- `borderGold: 'rgba(201,162,74,0.18)'` — gold hairline borders on cards
- `borderSoft: 'rgba(255,255,255,0.10)'` — white hairline dividers
- `success: '#4ADE80'`, `warning: '#FACC15'`, `danger: '#F87171'`,
  `blue: '#60A5FA'`, `purple: '#C084FC'` — semantic badge/status colors

Fonts unchanged: Cinzel (display), Inter (body), JetBrains Mono (labels/data).

### Visual language (from handoff doc, translated to tokens)

- Cards: 16px radius, `surface` bg, `borderGold` 1px border, soft black shadow,
  20px padding.
- Primary buttons: gold gradient (`gold` → darker gold), black text, 12px radius.
- Secondary buttons: `borderSoft` border, near-transparent white bg, neutral text.
- Eyebrow labels: uppercase, letter-spaced (0.2em+), mono font, gold or muted.
- Page titles: large display serif, white.
- Badges: pill-shaped, tinted bg at ~10% alpha of their semantic color.
- Safe areas: `env(safe-area-inset-top)` at top, `env(safe-area-inset-bottom) + ~72px`
  bottom padding so content never hides behind the bottom tab bar.

## Component-Kit First Rule

**Build the design system before rebuilding individual pages.** Every page must be
composed from shared components. If a page needs a visual pattern that doesn't
exist yet, create a reusable component first, then apply it.

### Required shared components (`src/wholesale/components/ui/`)

| Component | Purpose |
|---|---|
| `DesktopShell` | App shell: safe-area padding, max-width container, top nav + bottom nav slots, content gutter |
| `MobileBottomNav` | Premium bottom tab bar (upgrade of existing app-wide `MobileTabBar` styling; same routes) |
| `PageHeader` | Eyebrow + title + subtitle + primary/secondary actions + optional children (search) |
| `SearchBar` | Rounded dark input, gold focus border, placeholder styling |
| `FilterPills` | Horizontal scrollable pill row with counts; gold-gradient active state |
| `EntityCard` | Base card primitive (border, radius, padding, shadow) other cards compose |
| `LeadCard` | Address hierarchy, owner, tag badges, status badge, priority badge (Hot/Warm/Cold), updated-at |
| `DealCard` | Address, status badge, 2×2 Metric grid (ARV/Asking/Spread/Buyers), next-action footer |
| `BuyerCard` | Name/company, status badge, strategy + margin badges, markets, price range, view link |
| `Metric` | Label + value tile, optional gold highlight |
| `EmptyState` | Dashed gold border panel, icon circle, title, body, primary/secondary CTAs |
| `ActionBar` | Row of primary/secondary action buttons (used by headers, detail pages, forms) |
| `StatusBadge` | Pill mapped from status → semantic color |
| `TagBadge` | Blue-tinted pill for lead tags |
| `FormPanel` | Card-wrapped form section: labels, inputs, selects in kit styling (NewDeal/NewBuyer) |
| `DetailPanel` | Titled card section for detail pages (LeadDetail/DealDetail/BuyerDetail) |

Existing `Badge.tsx`, `Button.tsx`, `Card.tsx` in that folder are upgraded/absorbed
into the kit rather than duplicated.

### Lead priority logic

Derived display logic on LeadCard (presentation-only, no schema change):
- **Hot** — status `qualified` AND tag `tax delinquent` or `absentee`
- **Warm** — tag `vacant` OR status `new`
- **Cold** — everything else

## Navigation

- **Top nav (`WholesaleNav`):** restyle into two-tier luxury header — brand eyebrow
  ("Standard Black OS" / "Acquisition Command Center") above a scrollable tab row
  with gold underline on active tab. **Routes unchanged:** Command, Dashboard,
  Leads, Deals, Buyers, Tasks (the doc's nav list is illustrative; actual routes win).
- **Bottom nav:** existing `MobileTabBar` already has lucide icons, safe-area
  padding, and gold active state — restyle to kit polish (active tint container),
  keep routes (Home, Leads, Deals, Buyers, Trading). Mobile-only as today.

## Page Rebuild Order

1. App shell and navigation (safe areas, top nav, bottom nav, content padding)
2. Leads — single-column mobile cards, search in header, full pipeline filter pills
3. Deals — pipeline filters, premium empty state, deal cards with financial metrics
4. Buyers — buyer profile cards on mobile, table only ≥1024px, search in header
5. Command Center (includes the styling fix carried over from last session)
6. Wholesale Dashboard
7. Detail pages (LeadDetail, DealDetail, BuyerDetail) via `DetailPanel`
8. Forms (NewDeal, NewBuyer) via `FormPanel`
9. Tasks
10. Any remaining wholesale surfaces

## Console Error Fixes (ride-along)

1. **favicon 404** — add a favicon (simple SB mark or gold square) to `public/`.
2. **Supabase `tasks` 404** — remote project lacks the `0001_poc_tasks_and_gates.sql`
   migration. App-side: task-queue fetch must fail gracefully (no error spam, calm
   empty/unavailable state). Migration itself is applied at deploy (out of scope here);
   note it in `DEPLOY.md` if not already there.
3. **React Router future-flag warnings** — enable `v7_startTransition` and
   `v7_relativeSplatPath` future flags on the router.

## Acceptance Criteria

- No page has raw tables on mobile (tables permitted only ≥1024px).
- No text overlap anywhere.
- No random inline styles outside the token/component pattern — pages compose kit
  components; one-off style objects limited to layout glue.
- All pages share the same spacing, colors, cards, borders, badges, typography.
- Mobile views are single-column unless there's a clear reason not to be.
- No content hidden behind the bottom navigation.
- Verified at ~390px width (iPhone) and desktop.
- All existing routes, data, button logic, and behavior intact; `npm test` passes.
- Console clean except items requiring deploy (tasks-table 404 handled gracefully).
- The app feels like one unified acquisition operating system.

## Out of Scope

- Deploy (follow-up after verification — push, Supabase migrations, edge functions
  per `supabase/functions/DEPLOY.md`)
- Trading, AIOS, and main Dashboard sections (untouched)
- Any schema, business-logic, or route changes
