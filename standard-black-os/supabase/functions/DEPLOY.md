# Supabase Edge Functions — Deployment

## One-time setup (if Supabase CLI not installed)
```
npm install -g supabase
supabase login
```

## Link to your project
Get your project ref from the Supabase dashboard URL: https://supabase.com/dashboard/project/<your-project-ref>

```
supabase link --project-ref <your-project-ref>
```

## Set secrets (run once, replaces .env.local for server-side)
```
supabase secrets set ANTHROPIC_API_KEY=<your-key>
supabase secrets set TWILIO_ACCOUNT_SID=<your-sid>
supabase secrets set TWILIO_AUTH_TOKEN=<your-token>
supabase secrets set TWILIO_FROM_NUMBER=<your-number>
```

## Deploy all three functions
```
supabase functions deploy draft-outreach
supabase functions deploy send-message
supabase functions deploy deal-summary
```

## Test locally (optional)
```
supabase functions serve draft-outreach
# Then POST to http://localhost:54321/functions/v1/draft-outreach
```

## Notes
- SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically by Supabase — no need to set them as secrets
- The frontend calls these via supabase.functions.invoke() using the anon key — CORS is handled in each function

---

## POC functions (Wholesale OS — W-series)

### Apply the migration first
Run the schema migration in the Supabase SQL Editor, or via CLI:
```
supabase db push
```
Alternatively, open the Supabase dashboard → SQL Editor, paste the contents of:
`standard-black-os/supabase/migrations/0001_poc_tasks_and_gates.sql`
and run it.

### Deploy POC edge functions
```
supabase functions deploy score-inbound
supabase functions deploy draft-offer
supabase functions deploy draft-dispo
supabase functions deploy morning-brief
```

### Cron schedule — morning-brief (7 AM Central daily)
Deploy the function first, then wire the schedule via pg_cron in the Supabase SQL Editor:

```sql
-- Central Time is UTC-6 (CST) or UTC-5 (CDT).
-- The expression below fires at 12:00 UTC, which is 7 AM CST (winter).
-- During CDT (summer, approx. Mar–Nov) it fires at 8 AM CT instead.
-- Adjust to '0 11 * * *' (UTC) for a year-round 7 AM CDT target,
-- or accept the one-hour seasonal drift — either is fine for a brief.
select cron.schedule(
  'morning-brief-daily',
  '0 12 * * *',   -- 12:00 UTC = 7 AM CST / 8 AM CDT
  $$
    select net.http_post(
      url := current_setting('app.supabase_functions_url') || '/morning-brief',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.service_role_key')
      ),
      body := '{}'::jsonb
    );
  $$
);
```

Alternatively, use the Supabase dashboard → Edge Functions → morning-brief → Schedule tab to configure a cron trigger without writing SQL.

### Function contracts

| Function | Request body | Success response | Notes |
|---|---|---|---|
| `score-inbound` | `{ leadId, message }` | `{ score, sentiment, qualifying_questions, summary, optedOut }` | Returns `optedOut: true` on STOP words |
| `draft-offer` | `{ dealId }` | `{ offer_price, letter }` | 409 if `mao_approved_at` is null |
| `draft-dispo` | `{ dealId }` | `{ blast }` | AI-generated buyer blast text |
| `morning-brief` | _(none required)_ | Digest JSON (see shape below) | Scheduled — also callable manually |

### Digest shape (morning-brief response)
```ts
interface Digest {
  leadsByStage: Record<string, number>  // count of leads per stage
  openTasks: number                      // tasks with status 'open'
  pendingApprovals: number               // open 'approve_mao' | 'approve_offer' tasks
  generatedAt: string                    // ISO timestamp
}
```
This shape intentionally mirrors `src/wholesale/lib/digest.ts`. Keep them in sync.
