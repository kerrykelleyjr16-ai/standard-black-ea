# Wholesale OS POC — Design Spec

**Date:** 2026-06-09
**Owner:** Kerry Kelley Jr (single operator)
**Status:** Approved — ready for implementation plan

---

## 1. Purpose

Get **one real wholesale deal under contract within 30 days** using the wholesale OS as an AI-assisted operator cockpit. One completed deal is the proof that justifies funding and building the full cold-outreach autopilot ("one real deal completed will change everything"). The POC exists to prove the brain on real data with the least possible cost and legal exposure — not to prove the cold-outreach machine.

## 2. Strategic framing

- **Thesis:** token-max, not headcount-max. AI handles the *intelligence*; the human holds the *judgment*. The moat is distribution (volume + buyer network), not the AI itself. (Sequoia/YC 2026.)
- **POC shape:** "Build the brain, defer the mouth." Build/finish the deal intelligence and back-end (scoring → analysis → matching → offer → dispo → command center). Defer the expensive, regulated cold-outreach front end (automated SMS, 10DLC, paid skip-trace/list/SMS APIs) to Phase 2, paid for by the first deal.
- **Honest description:** because cold outreach is deferred, this is an **AI-assisted operator cockpit**, not a fully autonomous autopilot. The AI does all intelligence work (scripts, scoring, comps math, matching, offer drafting, the daily brief). Kerry does the human touchpoints (calls, texts, buyer relationships) by hand.

## 3. Success definition

- **Primary:** the system is working real PropStream leads end-to-end and **at least one deal is under contract** within 30 days of PropStream activation.
- **Stretch:** closed assignment fee.
- **Anti-goal:** do not let the PropStream billing date define success as pass/fail. If by day 30 there are real leads, live conversations, and a deal in motion, paying a second $99 is the correct call, not a failure.

## 4. Constraints (locked decisions)

| Decision | Choice | Rationale |
|---|---|---|
| Spend approach | **Free-tier proof first** | Build/test on free tooling; pay only when a workflow needs a paid API. No spend against zero deal revenue. |
| Only paid tool in POC | **PropStream (~$99)** | One tool = lists + motivation filters + ARV comps + skip trace. The 30-day clock starts the day it is paid. |
| Build engine | **Approach B — extend the deployed app** | Workflows = Supabase edge functions + cron, the pattern the app already runs in production. No new platform to learn under a 30-day clock. |
| n8n | **Deferred to Phase 2** | A visual orchestrator earns its keep only when running cold-outreach cadences at volume. It does not make automation more hands-off; cron fires workflows whether Kerry is present or not. |
| Outreach channel | **Deferred (cold SMS); POC uses manual calls + one-off manual texts** | Cold SMS is the highest legal/cost risk (TCPA, 10DLC, carrier throttling). Defer the automated machine; work POC leads by hand. |
| Team assignment | **Deferred until 10+ deals + Kerry knows every moving part cold** | Cannot delegate what is not yet understood. POC is single-operator: Kerry runs everything. |
| Time model | Kerry works M–F 9–5 (Staples). Cockpit must be triageable from a phone on a break. | The cockpit (digest + queue + async approvals) is the time-saver, not the engine choice. |

## 5. What is already built and deployed (do not rebuild)

`standard-black-os` is a deployed React PWA with Supabase connected, RLS locked, and edge functions live. Existing assets:

- **Tables:** `leads`, `deals`, `buyers`, `conversations` — full schema, RLS enabled (authenticated full access; single-operator).
- **Pipeline:** 11 stages — `New → Skip Traced → Contacted → Responded → Qualified → Analyzed → Matched → Offer Made → Under Contract → Assigned → Closed`.
- **MAO calculator** (`src/wholesale/lib/mao.ts`): `ARV × targetMargin − repairEstimate − assignmentFee`.
- **Buyer-matching engine (W6)** (`src/wholesale/lib/matching.ts`): hard filters (ZIP, property type, price band) + 100-pt soft scoring (condition 30, spread 40, beds/baths 10, strategy/ROI 20). **Complete.**
- **Edge functions deployed:** `draft-outreach` (AI writes seller message), `deal-summary` (AI deal analysis), `send-message`.
- **Compliance fields in schema:** `conversations.consent_status`, `conversations.opted_out`, `conversations.motivation_score`, `conversations.sentiment`.
- **Operator UI:** Dashboard, Leads + LeadDetail, Deals + DealDetail, Buyers + BuyerDetail, NewBuyer, NewDeal — all mobile/PWA.

## 6. Workflow map (build / extend / manual)

| # | Workflow | Stage target | POC status | Notes |
|---|---|---|---|---|
| W1 | Lead ingestion | `New` | **Manual + small build** | Add CSV import for PropStream list exports (one action, not 50 hand-entries). |
| W2 | Skip trace | `Skip Traced` | **Manual** | PropStream skip-traces; Kerry pastes phone/email into existing fields. |
| W3 | Outreach drafting | `Contacted` | **Built + extend** | `draft-outreach` writes the text/script; add a **phone-call script mode**. Kerry calls/texts from his phone and logs it. No automated send (no SMS platform in POC). |
| W4 | Inbound scoring + qualify | `Responded → Qualified` | **Build** | Kerry logs the seller reply; an edge fn scores motivation 0–100 (writes `motivation_score`/`sentiment`) and suggests qualifying questions (timeline, condition, price expectation, occupancy). |
| W5 | Deal analyzer (comps + MAO) | `Analyzed` | **Built + extend** | Kerry enters ARV/comps from PropStream; MAO calc + `deal-summary` run. **Wire the MAO approval gate.** |
| W6 | Buyer matcher | `Matched` | **Done** | `matching.ts` already implements it. |
| W7 | Offer + contract | `Offer Made → Under Contract` | **Build** | AI drafts offer at/under approved MAO; **hard offer-approval gate**; e-sign deferred — Kerry sends the contract manually for deal #1. |
| W8 | Disposition + assignment | `Assigned → Closed` | **Build** | AI ranks matched buyers + drafts the dispo blast; Kerry contacts buyers and makes the assignment call. |
| W9 | Command Center / morning brief | daily | **Build** | Daily cron edge fn queries Supabase and pushes one digest (leads by stage, who to call, pending approvals, deals in flight). |

## 7. Data model changes

Minimal — reuse existing schema. Additions:

- **New table `tasks`** (single-operator queue):
  - `id`, `type` (`call` | `text` | `approve_mao` | `approve_offer` | `contact_buyer` | `other`),
  - `lead_id` (nullable), `deal_id` (nullable),
  - `title`, `detail`, `status` (`open` | `done` | `dismissed`), `due_date` (nullable), `created_at`.
  - RLS: authenticated full access (matches existing tables).
- **`deals` fields:** `mao_approved_at` (timestamptz, nullable), `offer_approved_at` (timestamptz, nullable) to drive the approval gates.

No other schema changes.

## 8. The cockpit (Kerry's time-saver)

- **Morning brief (W9):** one push per day — new leads, who to call, what is waiting on approval, deals in motion. Triage from a phone on a Staples break. Delivery: email to start (Telegram later).
- **Task queue:** AI drops `call this lead`, `approve this MAO`, `approve this offer` into Kerry's queue. Single-operator — no assignment, no team views. Kerry owns every moving part.
- **Async approvals:** the two money gates (MAO, offer) are a phone tap, writing `mao_approved_at` / `offer_approved_at`.

## 9. Human judgment gates (Kerry stays in the loop here only)

1. **Approve the MAO** before any offer is built (W5).
2. **Approve every offer** before it sends (W7).
3. **Own buyer relationships + the final assignment call** (W8).

Everything else runs as AI-drafted output Kerry reviews in the cockpit.

## 10. Compliance guardrails (baked in)

- **STOP/opt-out** auto-suppresses a number (`opted_out` already exists); opted-out leads cannot be contacted or surfaced as call/text tasks.
- **Manual texts stay low-volume from Kerry's own phone** — no list-blasting. That is the line between a one-off personal text and an unregistered A2P (10DLC/TCPA) campaign. Low volume keeps the POC clear while cold SMS is deferred.
- Quiet hours respected on any task that suggests a call/text time (no before-8am / after-9pm local prompts).

## 11. 30-day milestone map (clock starts when PropStream is paid)

- **Week 1:** Build CSV import (W1), W4 scoring, MAO + offer approval gates, morning brief (W9). Pull first PropStream list.
- **Week 2:** Work leads — calls/texts, log + score responses, qualify. First deals into analysis (W5).
- **Week 3:** First MAO approvals → offers out (W7) → aim for under contract.
- **Week 4:** Dispo to buyers → assignment (W8). Brief tracks the full funnel.

## 12. Explicitly deferred (scope guard)

- n8n (Phase 2 — cold-outreach orchestration at volume).
- Team assignment / multi-operator (until 10+ deals and Kerry knows every moving part).
- Automated cold SMS cadence + 10DLC registration + SMS platform.
- Paid skip-trace / list / e-sign APIs.
- The automated forms of W1–W3.

## 13. House rules

- Every activated automation is logged in `ai-os/AUTOMATION_REGISTRY.md` with approval date.
- External-system automations need Kerry's sign-off before going live (`ai-os/HUMAN_APPROVAL_RULES.md`).

---

*Spec v1 — wholesale OS POC, DFW market, single operator.*
