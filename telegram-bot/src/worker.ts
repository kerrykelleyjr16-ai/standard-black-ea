import { getUpdates, sendMessage, sendTyping } from "./lib/telegram";
import { generateResponse } from "./lib/claude";
import {
  getLastOffset,
  setLastOffset,
  getHistory,
  appendHistory,
} from "./lib/state";

export interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_ALLOWED_CHAT_ID: string;
  ANTHROPIC_API_KEY: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const redisEnv = {
      UPSTASH_REDIS_REST_URL: env.UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN: env.UPSTASH_REDIS_REST_TOKEN,
    };

    // Strip BOM (U+FEFF) and whitespace from all secrets
    const token = (() => {
      const s = env.TELEGRAM_BOT_TOKEN;
      let i = 0; while (i < s.length && s.charCodeAt(i) === 0xfeff) i++;
      return s.slice(i).trim();
    })();
    const allowedId = (() => {
      const s = env.TELEGRAM_ALLOWED_CHAT_ID;
      let i = 0; while (i < s.length && s.charCodeAt(i) === 0xfeff) i++;
      return s.slice(i).trim();
    })();
    const apiKey = (() => {
      const s = env.ANTHROPIC_API_KEY;
      let i = 0; while (i < s.length && s.charCodeAt(i) === 0xfeff) i++;
      return s.slice(i).trim();
    })();

    const lastOffset = await getLastOffset(redisEnv);
    const offset = lastOffset !== null ? lastOffset + 1 : undefined;
    console.log(`lastOffset=${lastOffset} offset=${offset}`);

    const updates = await getUpdates(token, offset);
    console.log(`updates=${updates.length} allowed=${allowedId}`);
    if (updates.length === 0) return;

    const highestId = Math.max(...updates.map((u) => u.update_id));

    const messages = updates.filter(
      (u) => u.message?.text && String(u.message.chat.id) === allowedId
    );
    console.log(`filtered=${messages.length}`);

    for (const update of messages) {
      const { chat, text } = update.message!;
      console.log(`Processing: "${text}" from chat ${chat.id}`);

      await sendTyping(token, chat.id);

      const history = await getHistory(redisEnv, chat.id);
      console.log(`History length: ${history.length}`);

      const reply = await generateResponse(apiKey, history, text!);
      console.log(`Reply length: ${reply.length}`);

      await sendMessage(token, chat.id, reply);
      console.log(`Message sent`);

      await appendHistory(redisEnv, chat.id, text!, reply);
    }

    await setLastOffset(redisEnv, highestId);
    console.log(`Offset set to ${highestId}`);
  },

  async fetch(_request: Request, _env: Env): Promise<Response> {
    return new Response("Standard Black EA Bot — running.", { status: 200 });
  },
};
