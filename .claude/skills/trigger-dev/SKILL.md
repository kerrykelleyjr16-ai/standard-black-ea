---
name: trigger-dev
description: Use when building background jobs, scheduled tasks, async workflows, or automations with Trigger.dev SDK v4 — task(), schedules.task(), schemaTask(), triggerAndWait, waits, retry, idempotency, orchestrator/processor pattern.
---

# Trigger.dev v4 Reference

## Overview

Trigger.dev SDK v4 runs background jobs, scheduled tasks, and async workflows. All tasks use `@trigger.dev/sdk`. Full API reference: see `api-reference.md` in this skill folder.

## Task Types

| Type | Import | Use For |
|---|---|---|
| `task()` | `@trigger.dev/sdk` | General background work |
| `schedules.task()` | `@trigger.dev/sdk` | Cron-based scheduled jobs |
| `schemaTask()` | `@trigger.dev/sdk` | Tasks needing Zod payload validation |

## Triggering Quick Reference

**From backend code:**
```ts
// Fire and forget
await tasks.trigger<typeof myTask>("task-id", payload);

// Batch (up to 1,000 items, 3MB per payload)
await tasks.batchTrigger<typeof myTask>("task-id", [
  { payload: { ... } },
]);
```

**From inside a task:**
```ts
// Fire and forget
await childTask.trigger({ data: "value" });

// Trigger and wait — returns Result, NOT raw output
const result = await childTask.triggerAndWait({ data: "value" });
if (result.ok) console.log(result.output);

// Unwrap shorthand — throws on failure
const output = await childTask.triggerAndWait({ data: "value" }).unwrap();

// Batch and wait
const results = await childTask.batchTriggerAndWait([
  { payload: { data: "item1" } },
]);
```

## Orchestrator + Processor Pattern

Standard pattern for automations that poll and process:

```ts
// orchestrator: lightweight, runs on schedule
export const checkTask = schedules.task({
  id: "check-task",
  cron: "0 */8 * * *",
  run: async () => {
    const items = await fetchNewItems();
    for (const item of items) {
      await processItem.trigger(
        { id: item.id, data: item },
        { idempotencyKey: `item-${item.id}` } // prevents duplicates
      );
    }
    return { dispatched: items.length };
  },
});

// processor: handles heavy work per item
export const processItem = task({
  id: "process-item",
  run: async (payload: { id: string; data: any }) => {
    // LLM calls, API requests, output posting
    return { processed: payload.id };
  },
});
```

## Waits

```ts
await wait.for({ seconds: 30 });   // duration
await wait.until({ date: new Date("2026-01-01") }); // specific date
await wait.forToken({ token: "approval-token", timeoutInSeconds: 3600 }); // external signal
```

Waits > 5 seconds auto-checkpoint — no compute consumed while waiting.

## Idempotency & Debounce

```ts
// Prevent duplicate processing
await myTask.trigger(payload, { idempotencyKey: `item-${id}` });

// Debounce — leading (default): executes first, delays on repeat
await myTask.trigger(payload, { debounce: { key: "key", delay: "5s" } });

// Debounce — trailing: executes last payload after delay window
await myTask.trigger(payload, { debounce: { key: "key", delay: "10s", mode: "trailing" } });
```

## Retry Config

```ts
retry: {
  maxAttempts: 10,
  factor: 1.8,           // exponential backoff multiplier
  minTimeoutInMs: 500,
  maxTimeoutInMs: 30_000,
  randomize: false,
}
```

## Common Mistakes

| Mistake | Fix |
|---|---|
| Using v2 `client.defineJob()` | Always use `task()`, `schedules.task()`, or `schemaTask()` |
| Wrapping `triggerAndWait` in `Promise.all` | Not supported — will cause unexpected behavior |
| Expecting `triggerAndWait` to return raw output | Returns a Result object — check `result.ok` first |
| Missing `.js` extension on imports | Required: `import { processItem } from "./process-item.js"` |
| No idempotency key on scheduled pollers | Items can appear in two windows — always key them |

## Common Cron Expressions

| Expression | Meaning |
|---|---|
| `"*/30 * * * *"` | Every 30 minutes |
| `"0 * * * *"` | Every hour |
| `"0 */8 * * *"` | Every 8 hours |
| `"0 9 * * *"` | 9am daily |
| `"0 8 * * 1"` | Every Monday at 8am |
