# Skill: Car Sales Workflow

## Trigger
Use this skill when Kerry needs help with any part of his car sales role at Clay Cooley Volkswagen — lead generation, appointment setting, follow-up, or closing.

## Inputs Needed
- Lead type (walk-in, internet lead, referral, cold outreach, social)
- Where the lead is in the process (new, contacted, appointment set, visited, no-sale)
- Any known details about the customer (vehicle interest, budget, timeline)

---

## Workflow

### Stage 1: Lead Sourcing
Sources to work daily, in priority order:
1. **Internet leads** — CRM inbound (respond within 5 minutes — speed wins)
2. **Referrals** — Follow up with every past customer and personal network contact
3. **Walk-ins** — Full floor presence and engagement protocol
4. **Cold outreach** — Social DMs, community groups, local Facebook Marketplace
5. **Social content** — Posts that generate inbound interest (use `social-media-management` skill)

Goal: 15–20 active leads in pipeline at all times.

### Stage 2: First Contact
**Internet leads (phone):**
- Call within 5 minutes of lead coming in
- Use cold call script (see `cold-call-scripts` skill)
- If no answer: send text + voicemail combo immediately

**Text first contact template:**
> "Hey [Name], this is Kerry at Clay Cooley Volkswagen in Richardson. I saw you were interested in [vehicle/general inquiry]. I'd love to find you something you actually want — when's a good time to connect for 10 minutes? I can also answer any questions over text."

**Qualifying questions to ask:**
1. What vehicle caught your eye / what are you looking for?
2. Is this replacing a current vehicle or an addition?
3. What's your ideal monthly payment range?
4. When are you looking to be in something?
5. Are you financing or paying cash?

### Stage 3: Appointment Booking
Once qualified, set the appointment immediately — do not let the conversation end without a date and time.

**Appointment confirmation text (send immediately after booking):**
> "Great, [Name] — I've got you down for [Day] at [Time]. I'll be here specifically for you. My number is [###-###-####]. If anything changes just shoot me a text. Looking forward to it."

**Day-before reminder:**
> "Hey [Name], just a reminder we're set for tomorrow at [Time]. I'll have some options ready that I think you're going to like. See you then."

**Day-of reminder (2 hours before):**
> "Hey [Name], Kerry here — looking forward to seeing you at [Time] today. Come to the main entrance and ask for me. I'll be ready."

### Stage 4: Show-Up Rate Tactics
- Confirm appointment 3 times (booking, day before, day of)
- Make it personal — use their name, reference specific vehicle interest
- Offer a small hook: "I'm going to set aside a couple specific options for you before you get here."
- If they don't show: follow up within 1 hour (use `follow-up-messages` skill — no-show template)

### Stage 5: Desk / Closing Framework
When customer is on the lot:

1. **Greet** — Name, warm energy, no pressure opening
2. **Discovery** — Revisit qualifying info, any updates since contact
3. **Presentation** — Show 2–3 vehicles max (too many = confusion = no decision)
4. **Demo drive** — Always try to get them behind the wheel
5. **Desk** — Present numbers clearly, anchor on monthly payment
6. **Handle objections** — See objection bank below
7. **Close** — Assumptive close: "Let's get the paperwork started." / "Which color works better for you?"
8. **F&I handoff** — Smooth transition, don't oversell the back end yourself

**Top objections and responses:**
- *"I need to think about it"* — "Totally fair. What's the main thing holding you back right now? Let's make sure you have everything you need to feel confident."
- *"The payment is too high"* — "Let's look at a longer term or different vehicle — I want to find something that works. What number would you need to be at?"
- *"I need to talk to my spouse"* — "Makes sense. Can we get them on the phone real quick so we're all on the same page? I'd hate for you to drive back out here."
- *"I'm just looking"* — "That's fine — most of my best customers started that way. What would have to be true today for it to make sense?"
- *"I can get it cheaper somewhere else"* — "I believe it. What I can't match is the experience — but let me see what I can do on the numbers before you leave."

### Stage 6: Post-Sale Referral Ask
Send within 48 hours of delivery:
> "Hey [Name], hope you're loving the [vehicle]! If you know anyone looking for a car — friend, family, coworker — I'd love the introduction. I take good care of referrals. Just send them my way."

---

## Output Format
When generating anything from this skill, deliver:
- Ready-to-use text/scripts (copy-paste format)
- Stage-specific — don't give the whole workflow when Kerry only needs one piece
- Tone: direct, genuine, no sleazy sales language
