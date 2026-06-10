# Wholesale OS — Recommended Lean Stack (Solo Operator)

**Principle (from the photos):** token-max, not headcount-max. The goal is to replace a 4–6 person acquisitions/dispo team with ~$350–400/mo of tooling + AI. That's the trade: pay for tokens and automation, not salaries.

---

## "What do I actually have?" — 3-minute checklist
Run this before spending a dollar. The wholesale OS screenshots look real, but the repo folder is empty and all 20 leads are stamped "today" with clean demo addresses — that's seeded mock data, not a live database.

1. Open the wholesale OS app (Lovable project). Is **Supabase connected**, or is the data hardcoded/mocked? (If you can't add a lead and have it persist after refresh, it's mocked.)
2. Do you have an **n8n account** (cloud or self-hosted)? Stack file says "Planned" — likely no.
3. Any **API keys already paid for** — PropStream, Twilio, a texting platform? You answered "none yet," so assume clean slate.

**Most likely reality:** front-end prototype, no backend, no automation, no tools. That's fine — we build it right from scratch. (Photo 3/4: "the early-stage advantage" — no legacy to unwind.)

---

## The Lean Compliant Stack

| Layer | Pick | Why | Cost |
|---|---|---|---|
| Lead source + comps + skip trace | **PropStream** | One tool = lists, motivation filters, ARV comps, and skip trace. Consolidates 3 tools for a solo operator. | ~$99/mo + ~$0.12/skip |
| SMS sending | **Smarter Contact** or **Launch Control** | Purpose-built for wholesaling. Handle 10DLC carrier registration + opt-out compliance *for you*, and expose webhooks so n8n can catch inbound. | ~$199/mo |
| Database | **Supabase** | The queryable backbone. Free tier to start, Pro at scale. | $0 → $25/mo |
| Automation engine | **n8n** (cloud starter, or self-host on a $6/mo Hetzner VPS) | Moves leads through stages, runs cadences, calls APIs. Self-host = cheapest; cloud = easiest. | $0–24/mo |
| E-sign | **DocuSign** or **PandaDoc** | Contracts for Offer/Under Contract stages. Start cheap tier. | ~$10–25/mo |
| Intelligence | **Claude API** | The brain in every node — drafting, scoring, comps reasoning, matching. | ~$20–60/mo at this volume |

**All-in: ~$350–400/mo** to run the throughput of a multi-person shop.

---

## Why not raw Twilio for SMS?
Twilio is cheaper per message and the most flexible with n8n — but **you** carry 10DLC registration, deliverability tuning, and TCPA opt-out logic. For a solo operator launching fast, a wholesaling texting platform absorbs that compliance burden and still gives you webhooks into n8n. Start there; drop to raw Twilio later if message volume makes the per-message price matter.

---

## Compliance — non-negotiable before any text sends
- **10DLC registration** on your sending number (the platform handles this).
- **TCPA opt-out**: STOP must auto-suppress the number, logged in Supabase (`opt_outs` table).
- **Quiet hours** (no texts before 8am / after 9pm local) + frequency caps.
- Keep consent + message records. This is the one place "move fast" gets you sued — don't shortcut it.

---

*Stack v1 — solo operator, DFW market.*
