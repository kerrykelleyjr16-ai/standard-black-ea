-- POC: single-operator task queue + deal approval gates.
-- Apply in the Supabase SQL Editor (or `supabase db push`) on the project.

-- Deal approval gates (W5 MAO, W7 offer)
alter table deals add column if not exists mao_approved_at   timestamptz;
alter table deals add column if not exists offer_approved_at timestamptz;

-- Single-operator task queue (cockpit)
create table if not exists tasks (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in
              ('call','text','approve_mao','approve_offer','contact_buyer','analyze','other')),
  lead_id     uuid references leads(id) on delete cascade,
  deal_id     uuid references deals(id) on delete cascade,
  title       text not null,
  detail      text,
  status      text not null default 'open' check (status in ('open','done','dismissed')),
  due_date    date,
  created_at  timestamptz not null default now()
);

create index if not exists tasks_status_idx on tasks(status);

-- RLS: matches existing tables — authenticated users get full access (single operator)
alter table tasks enable row level security;
create policy "authenticated full access" on tasks
  for all to authenticated using (true) with check (true);
