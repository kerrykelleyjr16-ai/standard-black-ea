# Wholesale OS — n8n Workflow Specs (node-by-node)

Build these as 9 separate n8n workflows. They chain via the `leads.stage` column in Supabase — each workflow triggers off the stage the previous one set. That's the "closed loop": stage change is the event, n8n is the connective tissue, Claude is the brain.

**Conventions**
- Every workflow that calls Claude uses the **Claude API** node (model: `claude-opus-4-8` for judgment-heavy nodes, `claude-haiku-4-5-20251001` for cheap high-volume nodes like scoring/drafting).
- Supabase nodes via Postgres credentials or Supabase node.
- All times in America/Chicago (CT).

---

## W1 — Lead Ingestion & Dedup  →  stage: `new`
1. **Trigger:** Schedule (daily 7am) OR Webhook (manual list drop).
2. **HTTP Request / CSV:** Pull new list from PropStream export (or read uploaded CSV).
3. **Function:** Normalize fields → map to `leads` schema; derive `motivation_signals` from list tags.
4. **Supabase Select:** Check existing by address+zip (dedup).
5. **IF new:** Supabase Insert into `leads` (stage=`new`).
6. **No human gate.**

## W2 — Skip Trace Enrichment  →  stage: `skip_traced`
1. **Trigger:** Supabase trigger / poll where `stage = 'new' AND skip_trace_status = 'pending'`.
2. **HTTP Request:** Call skip trace API (PropStream/BatchSkipTracing) with owner+address.
3. **Function:** Parse phone + email.
4. **Supabase Update:** Write `owner_phone`, `owner_email`, `skip_trace_status='done'`, `stage='skip_traced'`.
5. **No human gate.**

## W3 — Outreach Engine (SMS cadence)  →  stage: `contacted`
1. **Trigger:** Poll where `stage = 'skip_traced'`.
2. **Supabase Select:** Confirm phone not in `opt_outs`. (Compliance.)
3. **Claude (haiku):** Draft first-touch SMS. Prompt includes address, motivation signals, owner first name. Keep <320 chars, conversational, one question.
4. **IF outside quiet hours (8am–9pm CT):** wait until window.
5. **HTTP Request:** Send via Smarter Contact / Launch Control API.
6. **Supabase Insert:** `conversations` (direction=outbound, ai_generated=true).
7. **Supabase Update:** `stage='contacted'`.
8. **Supabase Insert:** seed `cadence_steps` for day 2,4,7,14.
9. **Sub-workflow (cadence runner):** Schedule every hour → find due `cadence_steps` where `sent=false` and lead hasn't replied → send next touch → mark sent. Stop cadence on reply or opt-out.
10. **No human gate; compliance is the gate.**

## W4 — Inbound Handler + Scoring + Qualify  →  `responded` → `qualified`
**Highest-leverage workflow — this is the acquisitions manager.**
1. **Trigger:** Webhook from SMS platform (inbound message).
2. **IF body = STOP/UNSUBSCRIBE:** Insert `opt_outs`, halt. (Compliance.)
3. **Supabase Insert:** `conversations` (direction=inbound).
4. **Claude (haiku):** Score motivation/intent 0–100 from message + thread context. Output score + reasoning.
5. **Supabase Update:** write `score` on the conversation; `stage='responded'`.
6. **IF score ≥ 70:** **Claude (opus):** draft qualifying reply (timeline, condition, occupancy, price expectation).
7. **Supabase Insert:** outbound `conversations` (ai_generated=true) + send via SMS API.
8. **IF all 4 qualifying criteria captured across thread:** `stage='qualified'`.
9. **Optional human gate:** if estimated deal size > threshold, route reply to you for approval before sending (Telegram/email approve button).

## W5 — Deal Analyzer (Comps + MAO)  →  stage: `analyzed`
1. **Trigger:** Poll where `stage = 'qualified'`.
2. **HTTP Request:** Pull comps/ARV from PropStream for the subject address.
3. **Claude (opus):** Estimate repairs from motivation signals + condition notes in thread; reason an ARV from comps.
4. **Function:** `mao = arv*0.70 - repairs - assignment_fee`.
5. **Supabase Insert:** `deals` (status=`analyzing`).
6. **Supabase Update:** `leads.stage='analyzed'`.
7. **Notify you** (Telegram/email): deal card with ARV, repairs, MAO.
8. **HARD HUMAN GATE:** you approve/override MAO → sets `deals.status='approved'`, `approved_by='kerry'`.

## W6 — Buyer Matcher  →  stage: `matched`
1. **Trigger:** Poll where `deals.status='approved'`.
2. **Supabase Select:** `buyers` where active, zip in buy_box, price band overlaps MAO range, property type matches.
3. **Claude (haiku):** Rank matched buyers by fit.
4. **Supabase Insert:** `buyer_matches` (rank, status=`matched`).
5. **Supabase Update:** `leads.stage='matched'`.
6. **No human gate.**

## W7 — Offer + Contract  →  `offer_made` → `under_contract`
1. **Trigger:** `stage='matched'` AND your go-ahead.
2. **Claude (opus):** Draft seller offer at/below approved MAO + short rationale.
3. **HARD HUMAN GATE:** you approve the offer.
4. **HTTP/SMS/Email:** send offer to seller. `stage='offer_made'`.
5. **On acceptance:** trigger DocuSign/PandaDoc contract.
6. **Supabase Update:** `stage='under_contract'`, `deals.status='accepted'`.

## W8 — Disposition Blast + Assignment  →  `assigned` → `closed`
1. **Trigger:** `stage='under_contract'`.
2. **Supabase Select:** ranked `buyer_matches` for the deal.
3. **Claude (haiku):** Draft deal blast (address, numbers, photos link).
4. **HTTP/SMS/Email:** blast to matched buyers; mark `buyer_matches.status='blasted'`.
5. **Webhook:** collect buyer interest → update status `interested`.
6. **HUMAN GATE:** you pick the buyer + assign contract → `status='assigned'`, `leads.stage='assigned'`.
7. **n8n reminders:** title coordination checklist → on close, `stage='closed'`.

## W9 — Command Center (closed-loop KPIs)  →  daily
1. **Trigger:** Schedule, daily 6:30am CT.
2. **Supabase Select:** counts by stage, response rate (replies/sent), deals in flight, projected fees (sum approved assignment_fee).
3. **Supabase Insert:** `kpi_snapshots`.
4. **Claude (haiku):** Write a 5-line plain-English digest + flag stalled leads, dead lists, cadences with no replies.
5. **Send:** email/Telegram every morning. This feeds the loop back — it tells you which lists and cadences to kill or scale.

---

## Build order (you chose full sequence)
Stand up infra first, then build in dependency order:
**Supabase schema → W1 → W2 → W3 → W4 → W5 → W6 → W7 → W8 → W9.**
Test each on 2–3 seed leads before pointing it at a real list. (Photo: closed loops — verify the loop closes before you scale volume through it.)
