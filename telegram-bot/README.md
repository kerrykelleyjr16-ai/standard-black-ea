# Standard Black — Telegram EA Bot

Two-way Telegram bot. Kerry messages it from anywhere, gets EA responses within ~1 minute.  
Hosted on **Cloudflare Workers** (free tier). State in **Upstash Redis** (free tier).

---

## How It Works

1. Kerry sends a message to `@standardblack_bot`
2. Cloudflare Worker polls Telegram every minute via cron trigger
3. New message → Claude API with full EA context → reply sent back to Telegram
4. Conversation history (last 10 exchanges) stored in Upstash Redis, resets every 24 hours

---

## Setup

### One-time: Create a Cloudflare account
Sign up free at [cloudflare.com](https://cloudflare.com) — no credit card needed for Workers.

### Install and authenticate
```bash
cd telegram-bot
npm install
npx wrangler login   # opens browser → log in with your Cloudflare account
```

### Set production secrets
Run each command below and paste the value when prompted:
```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_ALLOWED_CHAT_ID
npx wrangler secret put ANTHROPIC_API_KEY
npx wrangler secret put UPSTASH_REDIS_REST_URL
npx wrangler secret put UPSTASH_REDIS_REST_TOKEN
```

### Deploy
```bash
npm run deploy
```

Done. The cron trigger activates automatically — no server to manage.

---

## Local Dev

For testing before deploying, fill in `.dev.vars` (same format as `.env.example`) then:
```bash
npm run dev
```
This runs the Worker locally. To manually trigger the cron handler:
```bash
curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

---

## File Structure

```
src/
  worker.ts          ← entry point — cron handler + fetch handler
  lib/
    telegram.ts      ← Telegram Bot API helpers
    claude.ts        ← Claude API + EA system prompt
    state.ts         ← Upstash Redis (offset + conversation history)
wrangler.toml        ← Cloudflare config + cron schedule
```
