# Wholesale OS — Setup Roadmap (zero to autopilot)

You chose the full sequence with no tools yet. Here's the order of operations. Each step is gated on the one before it. Don't skip ahead.

---

## Phase 0 — Confirm what you have (this week)
- [ ] Open the wholesale OS app. Confirm whether it's a live app or a mocked prototype (see `RECOMMENDED_STACK.md` checklist).
- [ ] Decide: keep the Lovable front-end and bolt Supabase under it, or rebuild the UI later. **Recommendation: keep it, connect Supabase.**

## Phase 1 — Stand up the backbone (week 1)
- [ ] Create Supabase project. Run `supabase-schema.sql`.
- [ ] Connect the wholesale OS front-end to Supabase (so the pipeline board reads live data).
- [ ] Stand up n8n (cloud starter, or self-host on a $6/mo Hetzner VPS).
- [ ] Get a Claude API key.
- [ ] Manually add 3 seed leads to test against.

## Phase 2 — Tools + compliance (week 1–2)
- [ ] PropStream account (lists, comps, skip trace).
- [ ] SMS platform (Smarter Contact / Launch Control) — **start 10DLC registration immediately, it takes days to weeks to approve.** Nothing texts until this clears.
- [ ] DocuSign/PandaDoc account.

## Phase 3 — Build the front-end engine (week 2–3)
Build and test on seed leads, in order:
- [ ] W2 Skip Trace → W3 Outreach → W4 Inbound/Scoring/Qualify.
- [ ] Verify the loop closes: a test lead goes new → skip_traced → contacted → responded → qualified without you touching it.

## Phase 4 — Build the deal engine (week 3–4)
- [ ] W5 Analyzer (with your MAO approval gate) → W6 Buyer Matcher.
- [ ] Load your buyers list into the `buyers` table first.

## Phase 5 — Build the back-end (week 4–5)
- [ ] W7 Offer/Contract (with your offer approval gate) → W8 Dispo Blast/Assignment.

## Phase 6 — Wrap + scale (week 5–6)
- [ ] W1 Ingestion (automate list pulls) + W9 Command Center (morning digest).
- [ ] Now point it at a real list. Start small (50–100 leads), watch the KPIs, then scale volume.

---

## The judgment gates you keep (everything else is autopilot)
1. Approve the MAO (W5).
2. Approve every offer before it sends (W7).
3. Pick the buyer + own the assignment (W8).

## Logging
Every workflow you activate gets logged in `ai-os/AUTOMATION_REGISTRY.md` with approval date — that's the existing house rule. External-system automations need your sign-off before going live (`ai-os/HUMAN_APPROVAL_RULES.md`).

---

*Roadmap v1. ~6 weeks part-time from zero to a one-person wholesaling autopilot.*
