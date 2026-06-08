# SHIP — Standard Black OS to Production

Deployment runbook for the **unified Standard Black OS** — the Vite/React app in `standard-black-os/` with the Wholesale OS built in as `/wholesale/*` routes, magic-link login gate, and PWA support.

> This is the ONLY ship doc to follow. Ignore `wholesale-os/DEPLOY.md` — it targets the old standalone Next.js app and is dead.

Follow the phases **in order**. Commands are PowerShell-friendly (Windows 11). Run them yourself from the paths shown.

---

## Prerequisites

- **Vercel CLI** — installed (v54.4.1). Verify: `vercel --version`
- **Supabase CLI** — NOT installed. Installed in Phase 3 via Scoop, OR skip it and use the dashboard fallback.
- **Supabase project ref:** `fzzlaetptbcqqrtqjyxe` — URL `https://fzzlaetptbcqqrtqjyxe.supabase.co`
- **Anthropic API key** — needed for AI features (draft outreach, deal summary).
- **Twilio creds** — optional, only for live SMS.
- The app directory: `C:\Users\LOVE\OneDrive\Desktop\E.A\standard-black-os`
- Key facts baked in:
  - Frontend uses the **anon key only**.
  - The **service-role key is NEVER** a Vercel env var or `VITE_` var. It lives only in Supabase edge-function secrets (auto-injected as `SUPABASE_SERVICE_ROLE_KEY`).

---

## Phase 1 — Database

Apply the 4-table schema (if not already applied), then enable RLS.

1. Open the SQL Editor: https://supabase.com/dashboard/project/fzzlaetptbcqqrtqjyxe/sql/new

2. **Schema (skip if the 4 tables already exist).** Paste and run:

```sql
create extension if not exists "uuid-ossp";

create table if not exists buyers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company text,
  phone text,
  email text,
  source text,
  notes text,
  active boolean default true,
  created_at timestamptz default now(),
  target_markets text[] default '{}',
  property_types text[] default '{}',
  min_price numeric,
  max_price numeric,
  condition_max text check (condition_max in ('light','moderate','heavy')),
  min_beds numeric,
  min_baths numeric,
  strategy text check (strategy in ('flip','rental','BRRRR','buy-hold')),
  target_margin numeric,
  target_roi numeric,
  cap_rate numeric,
  max_rehab numeric,
  financing text,
  proof_of_funds text
);

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  address text not null,
  city text,
  state text,
  zip text,
  county text,
  property_type text,
  beds numeric,
  baths numeric,
  sqft numeric,
  year_built numeric,
  lot_size numeric,
  source text,
  owner_name text,
  owner_phone text,
  owner_email text,
  skip_trace_status text check (skip_trace_status in ('pending','done')),
  motivation_signals text[] default '{}',
  stage text not null default 'New' check (stage in (
    'New','Skip Traced','Contacted','Responded',
    'Qualified','Analyzed','Matched','Offer Made',
    'Under Contract','Assigned','Closed'
  )),
  created_at timestamptz default now(),
  constraint leads_address_zip_unique unique (address, zip)
);

create table if not exists deals (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  arv numeric,
  comps jsonb,
  repair_level text check (repair_level in ('light','moderate','heavy')),
  repair_estimate numeric,
  asking_price numeric,
  mao numeric,
  mao_override numeric,
  mao_override_reason text,
  assignment_fee numeric default 10000,
  offer_price numeric,
  matched_buyer_ids uuid[] default '{}',
  analysis_notes text,
  analyzed_at timestamptz
);

create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  channel text not null check (channel in ('sms','email')),
  direction text not null check (direction in ('inbound','outbound')),
  body text not null,
  ai_generated boolean default false,
  motivation_score integer check (motivation_score between 0 and 100),
  sentiment text check (sentiment in ('positive','neutral','negative')),
  consent_status text,
  opted_out boolean default false,
  created_at timestamptz default now()
);
```

3. **Enable RLS.** This is required now that the login gate is live — it locks the tables so only logged-in users (and the service role, which bypasses RLS) can touch data. In the SQL Editor, open and run the contents of:

```
standard-black-os/supabase/rls.sql
```

That file enables RLS on all 4 tables and grants `authenticated` full access. Run it once.

> Don't run the old wholesale `schema.sql` tail that *disables* RLS — `rls.sql` is the source of truth now.

---

## Phase 2 — Auth Config (Supabase Dashboard)

The whole app is gated behind magic-link login. Configure auth so only pre-created users can get in.

**Dashboard root:** https://supabase.com/dashboard/project/fzzlaetptbcqqrtqjyxe

1. **Enable Email / magic link.**
   - Go to **Authentication → Providers → Email**.
   - Ensure **Email** is enabled. Magic link is the passwordless flow — leave "Confirm email" on; you don't need a password.

2. **Disable public signups** (critical — single-operator tool).
   - Go to **Authentication → Sign In / Providers** (the "User Signups" / settings area; in some dashboard versions this is **Authentication → Settings**).
   - Turn **OFF** "Allow new users to sign up" (Enable user signups). This means only users you manually create can log in.

3. **Create your user.**
   - Go to **Authentication → Users → Add user**.
   - Create `kerrykelleyjr16@gmail.com`. Use **"Send invite"** (or "Create new user" + "Auto-confirm") so the account exists and is confirmed.
   - Because signups are disabled, this manual user is the only one who can log in.

4. **Set Site URL + Redirect URLs.**
   - Go to **Authentication → URL Configuration**.
   - **Site URL:** set to `http://localhost:5174` for now (dev).
   - **Redirect URLs (Additional):** add both:
     ```
     http://localhost:5174
     http://localhost:5174/**
     ```
   - The **production Vercel URL is not known yet** — you'll come back in **Phase 6** to add it. Magic links sent before that won't redirect correctly in prod, so don't skip Phase 6.

---

## Phase 3 — Edge Function Secrets + Deploy

Three functions: `draft-outreach`, `send-message`, `deal-summary`. They run server-side so API keys never hit the browser. `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase — do NOT set those.

### Path A — Supabase CLI (recommended)

The Supabase CLI canNOT be installed with `npm install -g supabase` on Windows (blocked). Use **Scoop**:

```powershell
# Install Scoop (skip if you already have it)
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install + verify the Supabase CLI
scoop install supabase
supabase --version
```

Then link, set secrets, and deploy from the app dir:

```powershell
supabase login
supabase link --project-ref fzzlaetptbcqqrtqjyxe

# Required for AI features
supabase secrets set ANTHROPIC_API_KEY=<your-anthropic-key>

# OPTIONAL — only for live SMS (send-message). Skip if not sending real texts yet.
supabase secrets set TWILIO_ACCOUNT_SID=<your-sid>
supabase secrets set TWILIO_AUTH_TOKEN=<your-token>
supabase secrets set TWILIO_FROM_NUMBER=<your-number>

# Deploy all three
supabase functions deploy draft-outreach
supabase functions deploy send-message
supabase functions deploy deal-summary
```

> Run these from `C:\Users\LOVE\OneDrive\Desktop\E.A\standard-black-os` so the CLI finds the `supabase/` folder.

### Path B — Dashboard fallback (no CLI)

If Scoop/CLI won't cooperate, do it in the dashboard:

1. **Secrets:** **Project Settings → Edge Functions → Secrets** (a.k.a. **Edge Function Secrets**). Add `ANTHROPIC_API_KEY` (and the 3 Twilio secrets if doing live SMS).
2. **Functions:** **Edge Functions → Create a new function**, one per name (`draft-outreach`, `send-message`, `deal-summary`). Paste each function's code from the local `supabase/functions/<name>/` source into the editor, then **Deploy**.

Either path, confirm all three show as deployed in **Edge Functions**.

---

## Phase 4 — Vercel Env Vars

Set **only** these two. Values come from `standard-black-os/.env.local`:

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://fzzlaetptbcqqrtqjyxe.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (the anon JWT from `.env.local`) |

**DO NOT set** `VITE_SUPABASE_SERVICE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, or any service-role/secret key in Vercel. `VITE_` vars get bundled into the public JS — anything secret would leak. Secrets live only in Supabase edge-function secrets (Phase 3).

Set them via CLI (run from the app dir, you'll be prompted for each value):

```powershell
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

Repeat for `preview` and `development` if you want previews to work too. (Or set them in the Vercel dashboard: **Project → Settings → Environment Variables**.)

---

## Phase 5 — Vercel Deploy

From the app directory. Framework (Vite), build command (`npm run build`), and output dir (`dist`) are already pinned in `vercel.json` — Vercel auto-detects them.

```powershell
Set-Location C:\Users\LOVE\OneDrive\Desktop\E.A\standard-black-os

# First run links the project (accept defaults; root = current dir). Creates a preview.
vercel

# Then ship to production
vercel --prod
```

When `vercel --prod` finishes it prints the **production URL** (e.g. `https://standard-black-os-xxxx.vercel.app`). **Copy it — you need it for Phase 6.**

> If `vercel` asks for root directory, it's the current folder (`standard-black-os`), NOT a subfolder. This is not the old wholesale-os root-directory setup.

---

## Phase 6 — Post-Deploy Auth (add prod URL)

Magic links won't work in production until Supabase knows the prod URL.

1. Back to **Authentication → URL Configuration**.
2. **Site URL:** change to your real Vercel production URL.
3. **Redirect URLs:** add (keep localhost too):
   ```
   https://<your-vercel-prod-url>
   https://<your-vercel-prod-url>/**
   ```
4. Save. Now request a fresh magic link in prod — the old localhost links won't redirect to the live site.

---

## Phase 7 — Rotate Keys

Every key was handled in plaintext during setup (`.env.local`, secrets, this terminal). Rotate them now and update the three places they live.

**Rotate:**
1. **Anthropic key** — console.anthropic.com → API Keys → create new, delete old.
2. **Supabase anon + service keys** — **Project Settings → API → Project API keys → Reset/Roll** the anon and service_role keys.

**Then update everywhere the keys live:**

| New key | Update in |
|---|---|
| Supabase **anon** | `standard-black-os/.env.local` (`VITE_SUPABASE_ANON_KEY`) **and** Vercel env var → then redeploy (`vercel --prod`) |
| Supabase **service_role** | Auto-rotates inside Supabase — edge functions pick up the new injected value, nothing to paste. Confirm functions still run. |
| **Anthropic** | Supabase edge-function secret only: `supabase secrets set ANTHROPIC_API_KEY=<new>` (or dashboard Edge Function Secrets). Re-deploy functions if needed. |

> Do NOT put the new service-role or Anthropic key in `.env.local` or Vercel. Same rule as before — frontend gets the anon key only.

After updating the anon key, redeploy so the live bundle carries the new value:

```powershell
vercel --prod
```

---

## Phase 8 — Smoke Test on Phone

1. Open the **production URL** in your phone browser.
2. You hit the **login gate**. Enter `kerrykelleyjr16@gmail.com`, request the magic link.
3. Open the email on the phone, tap the link — it should drop you into the app logged in.
4. Tap browser menu → **Add to Home Screen** (PWA). Open it from the home screen icon.
5. Confirm it launches **fullscreen / standalone** (no browser chrome).

**Route checklist — verify each loads with live data:**

| Route | Expect |
|---|---|
| `/` | SB Dashboard (ventures, KPIs) |
| `/wholesale/dashboard` | Wholesale KPI tiles, pipeline, activity feed |
| `/wholesale/leads` | Leads list across pipeline stages |
| `/wholesale/deals` | Deals list |
| `/wholesale/deals/new` | New deal form, live MAO calc |
| `/wholesale/buyers` | Buyers list |
| `/wholesale/deals/:id` | Match buyers + **Generate AI deal summary** works (proves `deal-summary` edge fn + Anthropic key) |
| lead detail | **Draft Outreach** works (proves `draft-outreach` edge fn) |

If a route shows no data, check: RLS applied (Phase 1), you're logged in (Phase 2), and Vercel env vars are set (Phase 4). If AI buttons fail, check the Anthropic secret and that the 3 functions deployed (Phase 3).

---

## Done

App is live, gated, installable, and keys are rotated. Custom domain (`os.standardblack.com` via CNAME to Vercel) is optional and can come later.
