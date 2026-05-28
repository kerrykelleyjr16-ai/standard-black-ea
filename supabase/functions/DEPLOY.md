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
