import type { Conversation } from './types'

// STOP word list — must match the list in supabase/functions/score-inbound/index.ts exactly.
// Duplication is intentional: edge functions are a separate Deno bundle that cannot import app src.
const STOP_WORDS = new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'])

export function isStopKeyword(message: string): boolean {
  return STOP_WORDS.has(message.trim().toUpperCase())
}

export function isContactable(conversations: Conversation[]): boolean {
  return !conversations.some((c) => c.opted_out)
}
