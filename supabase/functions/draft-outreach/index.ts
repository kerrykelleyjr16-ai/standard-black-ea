import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId, channel } = await req.json()

    if (!leadId) {
      return new Response(JSON.stringify({ error: 'leadId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')

    // Fallback if no API key
    if (!apiKey) {
      if (channel === 'sms') {
        return new Response(JSON.stringify({
          draft: `Hi ${lead.owner_name ?? 'there'}, I came across your property at ${lead.address}. Are you open to a quick conversation about a cash offer?`,
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({
        subject: `Your property at ${lead.address}`,
        draft: `Hi ${lead.owner_name ?? 'there'},\n\nI came across your property at ${lead.address} and wanted to reach out. I'm a local cash buyer and would love to learn more about your situation. Would you be open to a quick chat?\n\nBest,\nKerry`,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const signals = (lead.motivation_signals ?? []).join(', ') || 'motivated seller'

    let prompt: string
    if (channel === 'sms') {
      prompt = `You are writing outreach for a real estate wholesaler.
Property: ${lead.address}, ${lead.city}, ${lead.state}
Owner: ${lead.owner_name ?? 'Property Owner'}
Motivation signals: ${signals}

Write a warm, direct SMS (UNDER 160 CHARACTERS) to start a conversation about buying this property. Be genuine, reference their situation naturally, end with a simple yes/no question. Return only the message text, nothing else.`
    } else {
      prompt = `Write a brief outreach email for a real estate wholesaler to ${lead.owner_name ?? 'the property owner'} about their property at ${lead.address}, ${lead.city}, ${lead.state}.
Motivation signals: ${signals}

Return in exactly this format:
Subject: [one short subject line]
Body: [2-3 warm, direct sentences]`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      return new Response(JSON.stringify({ error: `Anthropic API error (${response.status}): ${errorBody}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    if (channel === 'email') {
      const lines = text.split('\n')
      const subjectLine = lines.find((l: string) => l.startsWith('Subject:'))
      const bodyStart = lines.findIndex((l: string) => l.startsWith('Body:'))
      const subject = subjectLine?.replace('Subject:', '').trim() ?? ''
      const draft = bodyStart >= 0
        ? lines.slice(bodyStart).join('\n').replace('Body:', '').trim()
        : text
      return new Response(JSON.stringify({ draft, subject }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ draft: text.trim() }), {
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
