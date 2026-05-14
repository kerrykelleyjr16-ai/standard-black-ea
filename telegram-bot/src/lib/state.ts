import { Redis } from "@upstash/redis/cloudflare";

const OFFSET_KEY = "telegram:last_offset";
const HISTORY_KEY = (chatId: number) => `telegram:history:${chatId}`;
const MAX_HISTORY_PAIRS = 10;

export interface Message {
  role: "user" | "assistant";
  content: string;
}

function sanitize(s: string): string {
  // Strip BOM (U+FEFF) that can appear when secrets are copy-pasted
  let i = 0;
  while (i < s.length && s.charCodeAt(i) === 0xfeff) i++;
  return s.slice(i).trim();
}

function getRedis(env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string }) {
  return new Redis({
    url: sanitize(env.UPSTASH_REDIS_REST_URL),
    token: sanitize(env.UPSTASH_REDIS_REST_TOKEN),
  });
}

export async function getLastOffset(env: {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}): Promise<number | null> {
  const val = await getRedis(env).get<number>(OFFSET_KEY);
  return val ?? null;
}

export async function setLastOffset(
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  offset: number
): Promise<void> {
  await getRedis(env).set(OFFSET_KEY, offset);
}

export async function getHistory(
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  chatId: number
): Promise<Message[]> {
  const raw = await getRedis(env).get<Message[]>(HISTORY_KEY(chatId));
  return raw ?? [];
}

export async function appendHistory(
  env: { UPSTASH_REDIS_REST_URL: string; UPSTASH_REDIS_REST_TOKEN: string },
  chatId: number,
  userMessage: string,
  assistantReply: string
): Promise<void> {
  const history = await getHistory(env, chatId);
  history.push({ role: "user", content: userMessage });
  history.push({ role: "assistant", content: assistantReply });
  const trimmed = history.slice(-MAX_HISTORY_PAIRS * 2);
  await getRedis(env).set(HISTORY_KEY(chatId), trimmed, { ex: 86400 });
}
