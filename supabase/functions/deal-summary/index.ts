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
    const { dealId } = await req.json()

    if (!dealId) {
      return new Response(JSON.stringify({ error: 'dealId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('*, leads(*)')
      .eq('id', dealId)
      .single()

    if (dealError || !deal) {
      return new Response(JSON.stringify({ error: 'Deal not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const lead = deal.leads
    if (!lead) {
      return new Response(JSON.stringify({ error: 'Lead not found for this deal' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let buyers: Array<{ name: string; company: string | null; strategy: string | null }> = []
    if (deal.matched_buyer_ids?.length > 0) {
      const { data } = await supabase
        .from('buyers')
        .select('name, company, strategy, target_margin')
        .in('id', deal.matched_buyer_ids)
      if (data) buyers = data
    }

    const buyerList = buyers.length > 0
      ? buyers.map(b => b.name + (b.company ? ` (${b.company})` : '') + (b.strategy ? `, ${b.strategy}` : '')).join('; ')
      : 'None matched yet'

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')

    // Fallback if no API key
    if (!apiKey) {
      const summary = `Deal analysis pending API configuration. Property at ${lead.address} with ARV of $${deal.arv?.toLocaleString() ?? 'unknown'}. Set ANTHROPIC_API_KEY in Supabase secrets to generate full AI summary.`
      return new Response(JSON.stringify({ summary }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const prompt = `You are analyzing a real estate wholesale deal. Write a concise deal brief.

Property: ${lead.address}, ${lead.city}, ${lead.state}
Details: ${lead.beds ?? '?'}bd/${lead.baths ?? '?'}ba, ${lead.sqft ? lead.sqft + ' sqft' : 'sqft unknown'}, built ${lead.year_built ?? 'unknown'}, ${deal.repair_level ?? 'unknown repair level'}

Financials:
- ARV: $${deal.arv?.toLocaleString() ?? 'unknown'}
- Repair estimate: $${deal.repair_estimate?.toLocaleString() ?? 'unknown'}
- MAO: $${(deal.mao_override ?? deal.mao)?.toLocaleString() ?? 'unknown'}${deal.mao_override ? ' (manual override)' : ''}
- Offer price: $${deal.offer_price?.toLocaleString() ?? 'not set'}
- Assignment fee target: $${deal.assignment_fee?.toLocaleString() ?? 'unknown'}

Matched buyers: ${buyerList}

Write 3-4 sentences covering: property snapshot, why this is a good deal (use the numbers), best buyer fit if matched, and recommended next step. Be direct and confident. No bullet points, no headers — just a clean paragraph.`

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
    const summary = data.content?.[0]?.text ?? 'Summary unavailable'

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to generate summary'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
