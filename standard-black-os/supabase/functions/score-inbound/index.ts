import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// STOP word list — must match compliance.ts in src/wholesale/lib/ exactly.
// Duplication is intentional: this Deno bundle cannot import app src.
const STOP_WORDS = new Set(['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'])

const DEFAULT_QUALIFYING_QUESTIONS = [
  'How motivated are you to sell, and what is your ideal timeline?',
  'Have you had any other offers or interest in the property?',
  'What would make this a win for you — price, speed, or something else?',
]

interface ScoreResult {
  score: number
  sentiment: 'positive' | 'neutral' | 'negative'
  qualifying_questions: string[]
  summary: string
}

const NEUTRAL_FALLBACK: ScoreResult = {
  score: 50,
  sentiment: 'neutral',
  qualifying_questions: DEFAULT_QUALIFYING_QUESTIONS,
  summary: '',
}

function parseClaudeJson(text: string): ScoreResult {
  try {
    // Strip markdown fences if present
    const cleaned = text.replace(/```(?:json)?/g, '').trim()
    const parsed = JSON.parse(cleaned)
    const score = typeof parsed.score === 'number' ? Math.min(100, Math.max(0, parsed.score)) : 50
    const sentiment: 'positive' | 'neutral' | 'negative' =
      ['positive', 'neutral', 'negative'].includes(parsed.sentiment)
        ? parsed.sentiment
        : 'neutral'
    const qualifying_questions: string[] =
      Array.isArray(parsed.qualifying_questions) && parsed.qualifying_questions.length >= 3
        ? parsed.qualifying_questions.slice(0, 3)
        : DEFAULT_QUALIFYING_QUESTIONS
    const summary = typeof parsed.summary === 'string' ? parsed.summary : ''
    return { score, sentiment, qualifying_questions, summary }
  } catch {
    return NEUTRAL_FALLBACK
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId, message } = await req.json()

    if (!leadId || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'leadId and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert the inbound conversation row
    const { data: convoData, error: convoError } = await supabase
      .from('conversations')
      .insert({
        lead_id: leadId,
        channel: 'sms',
        direction: 'inbound',
        body: message,
        ai_generated: false,
      })
      .select()
      .single()

    if (convoError || !convoData) {
      return new Response(JSON.stringify({ error: convoError?.message ?? 'Failed to save conversation' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const convoId: string = convoData.id

    // STOP detection (compliance) — list must match compliance.ts exactly
    if (STOP_WORDS.has(message.trim().toUpperCase())) {
      await supabase
        .from('conversations')
        .update({ opted_out: true })
        .eq('id', convoId)

      return new Response(JSON.stringify({ optedOut: true, score: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')

    // No-API-key fallback — returns neutral default so the function is usable pre-key
    if (!apiKey) {
      await supabase
        .from('conversations')
        .update({ motivation_score: NEUTRAL_FALLBACK.score, sentiment: NEUTRAL_FALLBACK.sentiment })
        .eq('id', convoId)

      return new Response(JSON.stringify({ ...NEUTRAL_FALLBACK, optedOut: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const prompt = `You are analyzing a seller's reply in a real estate wholesaling conversation.

Seller message: "${message}"

Analyze the message and return ONLY valid JSON with no markdown or explanation:
{
  "score": <integer 0-100, motivation to sell>,
  "sentiment": <"positive" | "neutral" | "negative">,
  "qualifying_questions": [<string>, <string>, <string>],
  "summary": "<one sentence summary of seller posture>"
}

Score guide: 0-30 cold/uninterested, 31-60 lukewarm/open, 61-100 motivated/ready.
qualifying_questions: 3 natural follow-up questions to qualify this specific seller.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await response.json()
    const rawText: string = aiData.content?.[0]?.text ?? ''
    const result = parseClaudeJson(rawText)

    // Update the conversation row with score + sentiment
    await supabase
      .from('conversations')
      .update({ motivation_score: result.score, sentiment: result.sentiment })
      .eq('id', convoId)

    return new Response(JSON.stringify({ ...result, optedOut: false }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
