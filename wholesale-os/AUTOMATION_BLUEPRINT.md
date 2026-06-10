# Wholesale OS — One-Person Autopilot Blueprint

**Goal:** Run a wholesaling operation at the throughput of a 6-person team with one operator (Kerry) + AI + n8n.
**Thesis (per Sequoia/YC 2026):** AI handles the *intelligence* work at scale; the human holds the *judgment*. The moat is distribution (outreach volume + buyer network), not the AI itself. 2026 is the window where copilots become autopilots — build pure autopilot now.

---

## Architecture

```
Wholesale OS (UI / pipeline)  ──►  Supabase (queryable backbone)  ◄──  n8n (automation engine)
                                          ▲                              │
                                          └──────── Claude API ──────────┘
                                            (intelligence at each node)
```

- **Wholesale OS** = the interface and pipeline board (New → … → Closed).
- **Supabase** = the single queryable source of truth. Every lead, conversation, deal, buyer. (Photo: "make your company queryable.")
- **n8n** = the connective tissue. Moves leads stage to stage, calls APIs, runs cadences.
- **Claude API** = the brain inside each n8n node — drafting, scoring, comps reasoning, matching.

---

## The 9 Core Workflows

Each maps to a pipeline stage and replaces a role you'd otherwise hire.

### W1 — Lead Ingestion & Dedup → `New`
- **Trigger:** New list export from PropStream (or list source) lands / scheduled pull.
- **Steps:** Parse list → dedupe against Supabase → tag motivation signals (absentee, vacant, tax delinquent, pre-foreclosure, inherited, tired landlord) → insert as `New`.
- **Human gate:** none.

### W2 — Skip Trace Enrichment → `Skip Traced`
- **Trigger:** Lead status = `New`.
- **Steps:** Call skip trace API (BatchSkipTracing / IDI / PropStream) → write phone + email back to Supabase → status `Skip Traced`.
- **Human gate:** none.

### W3 — Outreach Engine (SMS cadence) → `Contacted`
- **Trigger:** Lead status = `Skip Traced`.
- **Steps:** Claude drafts personalized first-touch SMS using property + motivation context → send via compliant SMS provider → log to conversation → status `Contacted` → schedule follow-up cadence (Day 2, 4, 7, 14) until reply or opt-out.
- **Human gate:** none for sends; **compliance gate is hard** (see Compliance below).

### W4 — Inbound Handler + AI Scoring + Qualify → `Responded` → `Qualified`
- **Trigger:** Inbound SMS webhook.
- **Steps:** Log inbound → Claude scores motivation/intent 0–100 (the "score: 92" you already have) → if hot, Claude drafts qualifying reply (timeline, condition, price expectation, occupancy) → status `Responded`, then `Qualified` once criteria met.
- **Human gate:** optional — you can require approval on replies above a deal-size threshold.
- **This is the highest-leverage workflow.** It's the acquisitions manager you'd otherwise pay $3–5k/mo.

### W5 — Deal Analyzer (Comps + MAO) → `Analyzed`
- **Trigger:** Lead status = `Qualified`.
- **Steps:** Pull comps/ARV (PropStream) → estimate repairs from signals/notes → compute MAO = `ARV × 0.70 − repairs − assignment fee` → write deal analysis → status `Analyzed`.
- **Human gate:** **YES — you approve/override the number before anything goes out.** AI does intelligence, you do judgment.

### W6 — Buyer Matcher → `Matched`
- **Trigger:** Lead status = `Analyzed`.
- **Steps:** Match deal against Buyers buy-box (zip, price band, property type, strategy) → rank buyers → status `Matched`.
- **Human gate:** none.

### W7 — Offer + Contract → `Offer Made` → `Under Contract`
- **Trigger:** Lead status = `Matched` + your approval.
- **Steps:** Claude drafts offer at/below MAO → **you approve** → send → on acceptance, generate contract (DocuSign/PandaDoc) → status `Under Contract`.
- **Human gate:** **YES — hard approval before any offer sends.**

### W8 — Disposition Blast + Assignment → `Assigned` → `Closed`
- **Trigger:** Lead status = `Under Contract`.
- **Steps:** Blast deal to matched/ranked buyers → collect interest → assign contract to winning buyer → coordinate title → reminders → status `Assigned` → `Closed`.
- **Human gate:** you own buyer relationships and final assignment call.

### W9 — Command Center (closed-loop KPIs) → daily
- **Trigger:** Scheduled, every morning.
- **Steps:** Query Supabase → leads by stage, response rate, cost per lead, deals in flight, projected assignment fees → push digest (email/Telegram). Feeds the loop back: flags stalled leads, low-response lists, dead cadences.
- **Human gate:** none — this is your morning dashboard.

---

## Human Judgment Gates (you stay in the loop here, nowhere else)
1. **Approve the MAO** before offers are built (W5).
2. **Approve every offer** before it sends (W7).
3. **Own buyer relationships + final assignment** (W8).
4. Optional: approve replies on big deals (W4).

Everything else runs on autopilot.

---

## Tools Required

| Layer | Tool (options) | Status |
|---|---|---|
| Lead source | PropStream / list exports | referenced in OS |
| Skip trace | BatchSkipTracing / IDI / PropStream | TBD |
| SMS sending | Twilio (10DLC) / Smarter Contact / Launch Control / Sherpa | TBD |
| Comps / ARV | PropStream / county data | referenced in OS |
| E-sign | DocuSign / PandaDoc | TBD |
| Database | Supabase | Planned |
| Automation | n8n (self-hosted or cloud) | Planned |
| Intelligence | Claude API | available |

---

## Compliance (do not skip)
Texting motivated sellers is regulated. Before W3 goes live:
- **10DLC registration** for the sending number (carrier requirement).
- **TCPA**: honor opt-out (STOP) automatically — build into W3/W4.
- Quiet hours, frequency caps, and consent records logged in Supabase.
This is a hard gate, not a nice-to-have. AI can draft; the *sending infrastructure* must be compliant.

---

## Recommended Build Order
Don't boil the ocean. Build the front-end acquisitions loop first — it's the throughput bottleneck and the distribution moat.

1. **Loop 1 (front-end engine):** W2 Skip Trace → W3 Outreach → W4 Inbound/Scoring/Qualify. This is the whole acquisitions team in three workflows.
2. **Loop 2 (deal engine):** W5 Analyzer → W6 Matcher.
3. **Loop 3 (back-end):** W7 Offer/Contract → W8 Dispo.
4. **Wrap:** W1 Ingestion + W9 Command Center.

---

*Draft v1 — pending decisions on current n8n / Supabase / SMS state before live build.*
