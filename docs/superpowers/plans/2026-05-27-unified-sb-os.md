# Unified Standard Black OS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge Wholesale OS into the Standard Black OS Vite/React app as `/wholesale/*` routes, deploy to Vercel with PWA support for mobile phone access.

**Architecture:** Standard Black OS (Vite/React, `standard-black-os/`) is the master app. Wholesale OS (Next.js, `wholesale-os/`) pages are ported as React components into new `/wholesale/*` routes. Three server-side calls (Anthropic AI, Twilio SMS) become Supabase Edge Functions. App deploys to Vercel as a static build. PWA config enables "Add to Home Screen" on iOS/Android.

**Tech Stack:** Vite 6, React 18, React Router 6, TypeScript (new), Tailwind CSS (new for wholesale pages), @supabase/supabase-js, vite-plugin-pwa, Supabase Edge Functions (Deno), Vercel

**Spec:** `docs/superpowers/specs/2026-05-27-unified-sb-os-design.md`

---

## Phase 1A — Foundation + Wholesale Pages

### Task 1: TypeScript + Tailwind + Supabase setup

**Files:**
- Create: `standard-black-os/tsconfig.json`
- Create: `standard-black-os/tailwind.config.js`
- Create: `standard-black-os/postcss.config.js`
- Create: `standard-black-os/.env.local`
- Modify: `standard-black-os/package.json`
- Modify: `standard-black-os/vite.config.js`

- [ ] Install deps: `cd standard-black-os && npm install @supabase/supabase-js && npm install -D typescript @types/react @types/react-dom @types/node tailwindcss postcss autoprefixer`
- [ ] Create `tsconfig.json`
- [ ] Create `tailwind.config.js` + `postcss.config.js`
- [ ] Create `.env.local` with placeholders
- [ ] Update `vite.config.js` with path alias
- [ ] Verify: `npm run dev` still starts

### Task 2: Wholesale lib files + UI components

**Files:**
- Create: `standard-black-os/src/wholesale/lib/types.ts`
- Create: `standard-black-os/src/wholesale/lib/mao.ts`
- Create: `standard-black-os/src/wholesale/lib/matching.ts`
- Create: `standard-black-os/src/wholesale/lib/supabase.ts`
- Create: `standard-black-os/src/wholesale/components/ui/Badge.tsx`
- Create: `standard-black-os/src/wholesale/components/ui/Button.tsx`
- Create: `standard-black-os/src/wholesale/components/ui/Card.tsx`
- Create: `standard-black-os/src/wholesale/components/WholesaleNav.tsx`

- [ ] Copy lib files from wholesale-os with path adjustments
- [ ] Create gold-themed UI components
- [ ] Create WholesaleNav component
- [ ] Update `src/App.jsx` with wholesale routes

### Task 3: Wholesale Dashboard + Leads pages

**Files:**
- Create: `standard-black-os/src/pages/wholesale/WholesaleDashboard.tsx`
- Create: `standard-black-os/src/pages/wholesale/Leads.tsx`
- Create: `standard-black-os/src/pages/wholesale/LeadDetail.tsx`

- [ ] Port WholesaleDashboard (replace next/navigation, apply gold)
- [ ] Port Leads page
- [ ] Create LeadDetail page (outreach via edge functions)

### Task 4: Deals pages

**Files:**
- Create: `standard-black-os/src/pages/wholesale/Deals.tsx`
- Create: `standard-black-os/src/pages/wholesale/NewDeal.tsx`
- Create: `standard-black-os/src/pages/wholesale/DealDetail.tsx`

- [ ] Port Deals list
- [ ] Port NewDeal form
- [ ] Port DealDetail (replace fetch API calls with Supabase client + edge function)

### Task 5: Buyers pages

**Files:**
- Create: `standard-black-os/src/pages/wholesale/Buyers.tsx`
- Create: `standard-black-os/src/pages/wholesale/NewBuyer.tsx`
- Create: `standard-black-os/src/pages/wholesale/BuyerDetail.tsx`

- [ ] Port Buyers list
- [ ] Port NewBuyer form
- [ ] Port BuyerDetail with edit mode

---

## Phase 1B — Supabase Edge Functions (parallel with 1A)

### Task 6: draft-outreach Edge Function

**Files:**
- Create: `supabase/functions/draft-outreach/index.ts`

- [ ] Write Deno edge function (Anthropic + Supabase)
- [ ] Test locally with `supabase functions serve`

### Task 7: send-message Edge Function

**Files:**
- Create: `supabase/functions/send-message/index.ts`

- [ ] Write Deno edge function (Twilio + Supabase)

### Task 8: deal-summary Edge Function

**Files:**
- Create: `supabase/functions/deal-summary/index.ts`

- [ ] Write Deno edge function (Anthropic + Supabase)

---

## Phase 2 — Navigation + PWA + Mobile + Vercel

### Task 9: Header + Mobile breakpoints

**Files:**
- Modify: `standard-black-os/src/components/Header.jsx`
- Modify: `standard-black-os/src/pages/Dashboard.jsx`

- [ ] Add Wholesale OS link to Header
- [ ] Add mobile hamburger menu to Header
- [ ] Add responsive grid breakpoints to Dashboard

### Task 10: PWA + Icons

**Files:**
- Create: `standard-black-os/scripts/generate-icons.js`
- Create: `standard-black-os/public/icons/icon-192.png`
- Create: `standard-black-os/public/icons/icon-512.png`
- Modify: `standard-black-os/package.json` (add vite-plugin-pwa)
- Modify: `standard-black-os/vite.config.js` (add PWA config)

- [ ] Generate icons
- [ ] Install vite-plugin-pwa
- [ ] Configure PWA in vite.config.js
- [ ] Verify manifest in build output

### Task 11: Vercel deployment

**Files:**
- Create: `standard-black-os/vercel.json`

- [ ] Create vercel.json for SPA routing
- [ ] Document environment variables needed
- [ ] Verify `npm run build` succeeds
