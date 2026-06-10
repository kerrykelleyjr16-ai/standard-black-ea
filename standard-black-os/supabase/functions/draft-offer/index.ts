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

    // Gate: MAO must be approved before an offer can be drafted
    if (!deal.mao_approved_at) {
      return new Response(JSON.stringify({ error: 'MAO not approved' }), {
        status: 409,
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

    const effectiveMao: number = deal.mao_override ?? deal.mao ?? 0

    // Suggested offer price: round MAO down to nearest $1,000
    const offerPrice = Math.floor(effectiveMao / 1000) * 1000

    const address = lead.address ?? 'the subject property'
    const city = lead.city ? `${lead.city}, ` : ''
    const state = lead.state ?? ''
    const zip = lead.zip ?? ''
    const fullAddress = `${address}, ${city}${state} ${zip}`.trim()
    const formattedPrice = offerPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')

    // No-key fallback: return a templated offer letter
    if (!apiKey) {
      const letter = `CASH PURCHASE OFFER

Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Property Address: ${fullAddress}

Dear Seller,

Standard Black is pleased to present this cash offer for the above-referenced property.

Purchase Price: ${formattedPrice}

Terms and Conditions:
- Sale is AS-IS with no repairs or credits requested.
- Buyer will pay all cash — no financing contingency.
- Closing within 14–21 days of an accepted contract, or at Seller's convenience.
- Contract is assignable to a vetted end buyer or partner entity.
- Earnest money deposit to be agreed upon execution.

This offer represents a straightforward, no-hassle transaction. We are committed to a smooth, professional close.

Please contact us to discuss terms or to accept this offer.

Sincerely,
Standard Black`

      return new Response(JSON.stringify({ offer_price: offerPrice, letter }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const prompt = `You are drafting a concise written cash offer letter for a real estate wholesaler.

Property: ${fullAddress}
Beds/Baths: ${lead.beds ?? '?'}bd / ${lead.baths ?? '?'}ba
Offer Price: ${formattedPrice}
Effective MAO: $${effectiveMao.toLocaleString()}

Write a professional, direct cash offer letter that:
1. States the purchase price clearly
2. Confirms the property is being purchased AS-IS, with no repairs or credits requested
3. Notes it is an all-cash purchase with no financing contingency
4. States the contract is assignable to a vetted end buyer
5. Mentions a quick close (14–21 days or at Seller's convenience)
6. Is signed "Standard Black"

Keep it under 250 words. Use standard business letter format. Return only the letter text — no explanations or headers outside the letter itself.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const letter = data.content?.[0]?.text ?? ''

    return new Response(JSON.stringify({ offer_price: offerPrice, letter }), {
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
