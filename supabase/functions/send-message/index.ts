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
    const { leadId, body, channel, aiGenerated } = await req.json()

    if (!leadId || !body || !channel) {
      return new Response(JSON.stringify({ error: 'leadId, body, and channel are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: lead } = await supabase
      .from('leads')
      .select('owner_phone, owner_email')
      .eq('id', leadId)
      .single()

    // Log conversation
    await supabase.from('conversations').insert({
      lead_id: leadId,
      channel,
      direction: 'outbound',
      body,
      ai_generated: aiGenerated ?? false,
      opted_out: false,
    })

    // Send SMS via Twilio if applicable
    if (channel === 'sms' && lead?.owner_phone) {
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
      const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER')

      if (accountSid && authToken && fromNumber) {
        const credentials = btoa(`${accountSid}:${authToken}`)
        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: lead.owner_phone,
            From: fromNumber,
            Body: body,
          }).toString(),
        })

        if (!twilioResponse.ok) {
          const errorBody = await twilioResponse.text()
          return new Response(JSON.stringify({
            success: false,
            error: `Twilio send failed (${twilioResponse.status}): ${errorBody}`,
          }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
