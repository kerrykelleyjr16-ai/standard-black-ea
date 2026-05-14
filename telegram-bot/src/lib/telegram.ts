export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

export interface TelegramMessage {
  message_id: number;
  from: { id: number; first_name: string; username?: string };
  chat: { id: number; type: string };
  date: number;
  text?: string;
}

function clean(s: string): string {
  let i = 0;
  while (i < s.length && s.charCodeAt(i) === 0xfeff) i++;
  return s.slice(i).trim();
}

export async function getUpdates(
  token: string,
  offset?: number
): Promise<TelegramUpdate[]> {
  const params = new URLSearchParams({ limit: "100", timeout: "0" });
  if (offset !== undefined) params.set("offset", String(offset));

  const res = await fetch(
    `https://api.telegram.org/bot${clean(token)}/getUpdates?${params}`
  );
  const data = (await res.json()) as {
    ok: boolean;
    result: TelegramUpdate[];
    description?: string;
  };
  if (!data.ok)
    throw new Error(`Telegram getUpdates failed: ${data.description ?? "unknown"}`);
  return data.result;
}

export async function sendMessage(
  token: string,
  chatId: number,
  text: string
): Promise<void> {
  const t = clean(token);
  const res = await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });
  const data = (await res.json()) as { ok: boolean };

  if (!data.ok) {
    // Retry without markdown on parse error
    await fetch(`https://api.telegram.org/bot${t}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  }
}

export async function sendTyping(token: string, chatId: number): Promise<void> {
  await fetch(
    `https://api.telegram.org/bot${clean(token)}/sendChatAction`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action: "typing" }),
    }
  );
}
