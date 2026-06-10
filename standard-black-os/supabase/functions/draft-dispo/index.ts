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

    // Load active buyers
    const { data: buyerRows } = await supabase
      .from('buyers')
      .select('name, company, strategy')
      .eq('active', true)

    const buyers = (buyerRows ?? []) as Array<{ name: string; company: string | null; strategy: string | null }>

    const address = `${lead.address ?? 'Address TBD'}, ${lead.city ?? ''}, ${lead.state ?? ''} ${lead.zip ?? ''}`.trim()
    const beds = lead.beds ?? '?'
    const baths = lead.baths ?? '?'
    const arv = deal.arv != null ? `$${deal.arv.toLocaleString()}` : 'TBD'
    const offerPrice = deal.offer_price != null ? `$${deal.offer_price.toLocaleString()}` : 'TBD'
    const assignmentFee = deal.assignment_fee != null ? `$${deal.assignment_fee.toLocaleString()}` : 'TBD'

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')

    // No-key fallback: templated disposition blast
    if (!apiKey) {
      const blast =
        `DEAL ALERT — Standard Black Wholesale\n\n` +
        `Property: ${address}\n` +
        `Beds/Baths: ${beds}bd / ${baths}ba\n` +
        `ARV: ${arv}\n` +
        `Asking/Offer Price: ${offerPrice}\n` +
        `Assignment Fee: ${assignmentFee}\n\n` +
        `Condition: ${deal.repair_level ?? 'As-Is'} — cash buyers only, quick close.\n\n` +
        `If you're interested or want the full address and details, reply YES or call us directly.\n\n` +
        `— Standard Black`

      return new Response(JSON.stringify({ blast }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const buyerCount = buyers.length
    const prompt = `You are drafting a short disposition blast message for a real estate wholesale deal. This goes out to a cash buyer list of ${buyerCount} active buyers.

Deal details:
- Property: ${address}
- Beds/Baths: ${beds}bd / ${baths}ba
- ARV: ${arv}
- Asking/Offer Price: ${offerPrice}
- Assignment Fee: ${assignmentFee}
- Condition: ${deal.repair_level ?? 'As-Is'}

Write a crisp, compelling 4–6 sentence blast that:
1. Leads with the deal (address, bed/bath, condition)
2. Highlights the ARV and the spread opportunity
3. States the assignment fee and that it's cash-only, quick close
4. Closes with a simple call to action (reply YES or call to get details)
5. Is signed "Standard Black"

No bullet points. Write it as a direct message to buyers. Return only the blast text.`

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

    const data = await response.json()
    const blast = data.content?.[0]?.text ?? ''

    return new Response(JSON.stringify({ blast }), {
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
