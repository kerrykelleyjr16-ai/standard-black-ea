-- Wholesale OS — Supabase Schema (the queryable backbone)
-- Every lead, conversation, deal, and buyer lives here. n8n reads/writes; the OS UI displays.
-- Run in Supabase SQL editor. RLS policies omitted for brevity — add before exposing publicly.

-- ============ LEADS ============
create table leads (
  id            uuid primary key default gen_random_uuid(),
  address       text not null,
  city          text,
  state         text default 'TX',
  zip           text,
  county        text,
  property_type text,            -- SFR, MF, etc.
  year_built    int,
  beds          int,
  baths         numeric,
  sqft          int,
  lot_size      text,
  owner_name    text,
  owner_phone   text,
  owner_email   text,
  motivation_signals text[],     -- {absentee, vacant, tax_delinquent, pre_foreclosure, inherited, tired_landlord}
  stage         text not null default 'new',
                -- new, skip_traced, contacted, responded, qualified, analyzed,
                -- matched, offer_made, under_contract, assigned, closed, dead
  skip_trace_status text default 'pending',  -- pending, done, failed
  source        text,            -- propstream list name, manual, etc.
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index on leads (stage);
create index on leads (zip);

-- ============ CONVERSATIONS ============
create table conversations (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references leads(id) on delete cascade,
  channel       text default 'sms',         -- sms, email, call
  direction     text not null,              -- outbound, inbound
  body          text,
  ai_generated  boolean default false,
  score         int,                        -- AI motivation/intent score 0-100 (inbound only)
  sent_at       timestamptz default now(),
  created_at    timestamptz default now()
);
create index on conversations (lead_id);

-- ============ DEALS ============
create table deals (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid references leads(id) on delete cascade,
  arv            numeric,
  repair_estimate numeric,
  assignment_fee numeric default 10000,
  mao            numeric,                    -- arv*0.70 - repairs - assignment_fee
  offer_amount   numeric,                    -- human-approved, may differ from mao
  status         text default 'analyzing',   -- analyzing, approved, offer_sent, accepted, dead
  approved_by    text,                       -- 'kerry' once judgment gate passed
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index on deals (lead_id);

-- ============ BUYERS ============
create table buyers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  phone         text,
  email         text,
  buy_box_zips  text[],
  min_price     numeric,
  max_price     numeric,
  property_types text[],
  strategy      text,                        -- flip, buy_hold, brrrr
  active        boolean default true,
  created_at    timestamptz default now()
);

-- ============ BUYER MATCHES ============
create table buyer_matches (
  id          uuid primary key default gen_random_uuid(),
  deal_id     uuid references deals(id) on delete cascade,
  buyer_id    uuid references buyers(id) on delete cascade,
  rank        int,
  status      text default 'matched',        -- matched, blasted, interested, assigned, passed
  created_at  timestamptz default now()
);

-- ============ OUTREACH CADENCE ============
create table cadence_steps (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid references leads(id) on delete cascade,
  step          int,                         -- 1,2,3,4 (day 0,2,4,7,14)
  scheduled_at  timestamptz,
  sent          boolean default false,
  created_at    timestamptz default now()
);
create index on cadence_steps (scheduled_at) where sent = false;

-- ============ OPT-OUTS (TCPA compliance) ============
create table opt_outs (
  id          uuid primary key default gen_random_uuid(),
  phone       text unique not null,
  created_at  timestamptz default now()
);

-- ============ KPI SNAPSHOTS (closed-loop dashboard) ============
create table kpi_snapshots (
  id              uuid primary key default gen_random_uuid(),
  snapshot_date   date default current_date,
  leads_by_stage  jsonb,
  response_rate   numeric,
  deals_in_flight int,
  projected_fees  numeric,
  created_at      timestamptz default now()
);

-- auto-update updated_at
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger leads_touch before update on leads for each row execute function touch_updated_at();
create trigger deals_touch before update on deals for each row execute function touch_updated_at();
