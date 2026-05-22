# Reverse Wholesaling AI System — Design Spec
**Date:** 2026-05-22  
**Status:** Approved — ready for implementation  
**Method:** Buyer-first (market-driven) wholesaling  

---

## 1. What We're Building

An AI-powered reverse wholesaling CRM built by Standard Black. The core loop: build a buyer list with precise buy boxes → find properties that match → AI qualifies sellers → close fast because the deal is pre-sold.

Three pillars:
1. **Buyer Engine** — store buyer buy boxes and use them to drive everything downstream
2. **Lead Pipeline** — import properties via CSV, work sellers through 11 pipeline stages
3. **AI Brain** — Claude handles outreach drafting, inbound qualification, and deal summarization. Real from day one.

Everything else (skip trace, comps, SMS, email) runs on mock adapters that swap to real APIs in a single file change.

---

## 2. Architecture

### Stack
| Layer | Technology |
|---|---|
| Frontend + API | Next.js 14 (App Router, TypeScript) |
| Database + Auth | Supabase (Postgres, free tier) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Styling | Tailwind CSS — dark theme |
| Deploy | Vercel (free tier, auto CI) |

### Folder Structure
```
src/app/
  dashboard/          # cockpit + tabs
  buyers/             # buyer list + detail
  leads/              # pipeline list + lead detail
  deals/              # deal analyzer + matched buyers
  import/             # CSV uploader (platform-aware)
  api/                # Next.js route handlers

src/lib/adapters/
  propertyList.ts     # CSV / PropStream
  skipTrace.ts        # mock → BatchData / Skip Genie
  comps.ts            # mock → PropStream comps API
  sms.ts              # log to DB → Twilio 10DLC
  email.ts            # log to DB → Resend / SendGrid

src/lib/ai/
  outreachDrafter.ts
  conversationQualifier.ts
  dealSummarizer.ts

src/lib/importMaps/
  propstream.ts · batchleads.ts · batchdialer.ts
  resimpli.ts · county.ts · custom.ts
```

### Adapter Pattern
All paid-API dependencies implement a consistent interface. `USE_MOCK_ADAPTERS=true` in `.env` activates mock mode globally. Swap individual adapters by changing one import. Claude API is **never** mocked — it runs live from Sprint 1.

### Environment Variables
```
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
USE_MOCK_ADAPTERS=true          # flip per-adapter when going live
```

---

## 3. Data Model

### `buyers`
The foundation. Every downstream decision references buyer buy boxes.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name, company | text | |
| phone, email | text | |
| source, notes | text | |
| active | boolean | default true |
| created_at | timestamptz | |
| target_markets | text[] | zip codes or city names |
| property_types | text[] | SFR, multi, etc. |
| min_price, max_price | numeric | |
| condition_max | text | light \| moderate \| heavy |
| min_beds, min_baths | numeric | |
| strategy | text | flip \| rental \| BRRRR \| buy-hold |
| target_margin | numeric | e.g. 0.70 drives MAO calc |
| target_roi, cap_rate | numeric | nullable — rental buyers only |
| max_rehab | numeric | |
| financing, proof_of_funds | text | |

### `leads`
Properties + owners. Populated via CSV import.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| address, city, state, zip, county | text | |
| property_type | text | |
| beds, baths, sqft, year_built, lot_size | numeric | |
| source | text | propstream \| batchleads \| county \| ... |
| owner_name, owner_phone, owner_email | text | |
| skip_trace_status | text | pending \| done |
| motivation_signals | text[] | absentee · vacant · tax_delinquent · pre_foreclosure · inherited · tired_landlord |
| stage | text | see pipeline stages below |
| created_at | timestamptz | |

**Pipeline Stages (leads.stage):**  
`New → Skip Traced → Contacted → Responded → Qualified → Analyzed → Matched → Offer Made → Under Contract → Assigned → Closed`

### `deals`
Analysis layer. Created automatically when a lead hits Qualified.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| lead_id | uuid FK → leads | |
| arv | numeric | use low comps (as-is), not retail ARV |
| comps | jsonb | array of 3 comp records |
| repair_level | text | light \| moderate \| heavy |
| repair_estimate | numeric | |
| asking_price | numeric | |
| mao | numeric | computed: (ARV × buyer.target_margin) − repair_estimate − assignment_fee |
| mao_override | numeric | nullable |
| mao_override_reason | text | required if override set — friction field |
| assignment_fee | numeric | |
| offer_price | numeric | |
| matched_buyer_ids | uuid[] | |
| analysis_notes | text | |
| analyzed_at | timestamptz | |

**MAO Formula:** `MAO = (ARV × target_margin) − repair_estimate − assignment_fee`  
Override is allowed but requires a logged reason. System flags overrides visually.

### `conversations`
Every touch with a seller, both directions. TCPA-compliant from day one.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| lead_id | uuid FK → leads | |
| channel | text | sms \| email |
| direction | text | inbound \| outbound |
| body | text | |
| ai_generated | boolean | true if Claude drafted it |
| motivation_score | int | 0–100, AI-set on inbound |
| sentiment | text | positive \| neutral \| negative |
| consent_status | text | TCPA compliance |
| opted_out | boolean | TCPA compliance |
| created_at | timestamptz | |

---

## 4. Screens

All screens follow **progressive disclosure**: dashboard shows minimum info, every number and card is clickable to drill down. No dead surfaces.

### `/dashboard` — Cockpit
- Hero row: 4 KPI cards (Contacts Today / Leads in Pipeline / Active Offers / Earned This Month) — each clickable to filtered list
- Contact Goal Bar: income target → daily contacts needed → today's progress
- Tabs: Pipeline (stage counts) · Active Deals (deal cards) · Buyers (buyer list)

### `/leads/[id]` — Lead Detail
- Property info + motivation signal badges
- Stage indicator (clickable to advance)
- Conversation thread (inbound/outbound, timestamps)
- "Draft Outreach" button → AI draft → human edits → Send
- AI qualification badge on inbound messages (motivation_score + sentiment)
- "Promote to Qualified?" action when score is high

### `/deals/[id]` — Deal Analyzer
- MAO breakdown: ARV, repairs, fee, final MAO — displayed as formula
- Override button with friction (reason required, logged, flagged visually)
- Matched Buyers ranked 0–100 (hard filter + soft score)
- "Generate Deal Summary" button → Claude writes copy-ready buyer memo

### `/buyers/[id]` — Buyer Profile
- Full buy box display (markets, price range, strategy, margin, ROI)
- Deal history (deals this buyer was matched to)
- "Generate Deal Summary" available from buyer context

### `/import` — CSV Uploader
- Step 1: Select platform (PropStream · BatchLeads · BatchDialer · REsimpli · County · Custom)
- Step 2: Drop CSV or XLSX file
- Step 3: Auto-mapped preview (247 rows · 0 errors)
- Step 4: "Import N Leads →" button
- Platform maps pre-built for all 5 platforms. Custom = manual column mapper with save-as-name.

---

## 5. AI Roles

All three run against the Anthropic Claude API (`claude-sonnet-4-6`). No mock fallback.

### `outreachDrafter.ts`
- **Triggered:** Lead advances to "Skip Traced"
- **Input:** owner_name, address, motivation_signals, channel (sms|email)
- **Output:** Draft message — queued for human review, not auto-sent. `ai_generated = true`
- **Tone:** Warm and direct. "Hey [first name], I saw your property on [street] — I work with buyers actively looking in [city]. Are you open to a conversation?" Standard Black branded. Human reviews and hits Send.

### `conversationQualifier.ts`
- **Triggered:** Inbound message received on any lead
- **Input:** Full conversation thread, motivation_signals, current stage
- **Output:** motivation_score (0–100), sentiment, optional stage_recommendation ("Qualified?")
- **Behavior:** Displays score on the inbound message card. Shows "Promote to Qualified?" badge when score is high. Human confirms or dismisses — AI never auto-promotes.

### `dealSummarizer.ts`
- **Triggered:** "Generate Summary" button on `/deals/[id]` or `/buyers/[id]`
- **Input:** deal numbers (ARV, MAO, repairs, fee), matched buyers, lead address, conversation thread
- **Output:** 2–3 paragraph deal brief. Key numbers highlighted. Copy-ready for buyer presentation.
- **Tone:** Professional, concise, Standard Black voice.

---

## 6. Matching Engine

Runs when a deal is created or updated. Scores every active buyer 0–100 against the deal.

**Hard filters (must pass all to score > 0):**
- `lead.zip` in `buyer.target_markets`
- `lead.property_type` in `buyer.property_types`
- `deal.offer_price` between `buyer.min_price` and `buyer.max_price`

**Soft score (weighted):**
- Condition vs. `buyer.condition_max` — 30 pts
- Spread vs. `buyer.target_margin` — 40 pts
- ROI vs. `buyer.target_roi` (rental buyers) — 20 pts
- Beds/baths vs. `buyer.min_beds / min_baths` — 10 pts

Results stored in `deals.matched_buyer_ids`. Displayed ranked highest-to-lowest on deal detail.

---

## 7. CSV Import Maps

Pre-built column maps translate platform export headers to the `leads` schema.

| Platform | Key Mappings |
|---|---|
| PropStream | "Property Address" → address, "Owner 1 Full Name" → owner_name, "Estimated Value" → (not imported — use for context only) |
| BatchLeads | "Street Address" → address, "Owner Name" → owner_name |
| BatchDialer | "Property Address" → address, "Contact Name" → owner_name, "Phone" → owner_phone |
| REsimpli | Maps REsimpli export columns |
| County Records | Generic address/owner columns |
| Custom | User-defined mapper, saveable by name |

---

## 8. Sprint Plan

### Sprint 1 — Core Loop (~Week 1)
**Goal:** Buyer → Lead → Deal → Match working end-to-end. Minimal UI. Mock DFW data seeded.

- Supabase project + 4-table schema
- Next.js 14 scaffold (App Router, TypeScript, Tailwind dark theme)
- `/buyers` — add/edit form + list
- `/import` — CSV upload + PropStream map
- `/leads` — pipeline list + stage toggle
- `/deals` — create deal, MAO calc, MAO override with friction
- Matching engine — score active buyers per deal
- All 5 mock adapters wired
- Seed: 5 buyers with buy boxes + 20 mock DFW leads

**Milestone:** Drop a lead, qualify it, see buyers ranked. The loop works.

### Sprint 2 — AI Brain (~Week 2)
- `outreachDrafter.ts` — prompt + draft button on lead detail
- `conversationQualifier.ts` — score inbound, show badge
- `dealSummarizer.ts` — "Generate Summary" on deal
- Conversations table wired to lead detail view
- AI draft → human review → send flow (logs to DB)

**Milestone:** Paste a mock seller reply, get a motivation score + "Promote to Qualified?" badge.

### Sprint 3 — Cockpit (~Week 3)
- Dashboard hero: 4 KPI cards (all live data)
- Contact goal calculator (income → daily target → progress bar)
- Pipeline tab, Active Deals tab, Buyers tab
- Progressive disclosure on every card and number
- Dark theme polish across all 5 screens

**Milestone:** Looks like a real command room. Nothing hardcoded.

### Sprint 4 — Automation + Ship (~Week 4)
- Auto-stage rule: qualify → auto-create deal record
- Auto-stage rule: offer made → advance pipeline
- BatchLeads + REsimpli + County CSV maps
- Adapter interfaces documented for Twilio / Resend / PropStream
- Supabase Auth (login gate)
- Vercel deploy + env vars

**Milestone:** Deployed on Vercel. Swap any adapter to real API in one file.

---

## 9. What's Mock vs. Real

| Adapter | Mock Behavior | Real Target |
|---|---|---|
| skipTrace | Returns fake phone/email | BatchData / Skip Genie |
| comps | Returns fake ARV + 3 comps | PropStream API |
| sms | Logs to conversations table | Twilio 10DLC |
| email | Logs to conversations table | Resend / SendGrid |
| propertyList | CSV upload UI | PropStream live export |
| **Claude API** | **REAL** | **Anthropic — live from Sprint 1** |

---

## 10. Open Items (Post-Launch)

- Twilio 10DLC registration when SMS goes live (requires business registration)
- PropStream API access tier for comps adapter swap
- BatchData account for skip trace
- Contact goal calculator: decide default income target on first login (onboarding flow)
- Buyer import: CSV import for buyers (v2 — enter manually for now)
