-- Row-Level Security for Standard Black OS wholesale tables.
-- Run this ONCE in the Supabase SQL Editor after the login gate is live.
--
-- Effect: only a logged-in (authenticated) user can read or write these tables.
-- Anonymous visitors get nothing, even if they extract the public anon key from
-- the JS bundle and hit Supabase directly. The edge functions use the service
-- role and bypass RLS, so AI/SMS features keep working.

alter table buyers        enable row level security;
alter table leads         enable row level security;
alter table deals         enable row level security;
alter table conversations enable row level security;

-- Authenticated users get full access. (Single-operator tool — no per-row owner
-- scoping needed yet. Add owner_id checks here if the app ever goes multi-user.)
create policy "authenticated full access" on buyers
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on leads
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on deals
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on conversations
  for all to authenticated using (true) with check (true);
