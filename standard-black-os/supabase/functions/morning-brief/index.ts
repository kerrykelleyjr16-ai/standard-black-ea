/**
 * morning-brief — scheduled cron edge function (W9)
 *
 * PURPOSE:
 * Runs once each morning (7 AM Central — see DEPLOY.md for pg_cron schedule) and
 * builds a Digest summary of pipeline health: lead counts by stage, open tasks,
 * and pending approvals that need Kerry's attention.
 *
 * EMAIL DELIVERY:
 * Email delivery is intentionally deferred for the POC. No free-tier email provider
 * is wired into this environment yet. When a Resend (or SMTP) key is added, wire the
 * TODO block below. Until then, the in-app Command Center page is the operative
 * morning brief — it reads the same Digest shape from the client side.
 *
 * MANUAL INVOCATION:
 * The function still accepts HTTP requests (OPTIONS/POST) so it can be triggered
 * manually via the Supabase dashboard or supabase.functions.invoke() during dev.
 * No request body is required.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ---------------------------------------------------------------------------
// Digest shape — intentionally mirrors src/wholesale/lib/digest.ts.
// Duplication is required: this Deno bundle cannot import app src.
// If you change the shape here, update digest.ts in the app (and vice-versa).
// ---------------------------------------------------------------------------
interface Digest {
  leadsByStage: Record<string, number>  // count of leads per stage
  openTasks: number                      // tasks with status 'open'
  pendingApprovals: number               // open tasks of type 'approve_mao' | 'approve_offer'
  generatedAt: string                    // ISO timestamp
}

Deno.serve(async (req: Request) => {
  // OPTIONS pre-flight — required for CORS on manual browser invocations
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // -----------------------------------------------------------------------
    // 1. Leads — group by stage
    // -----------------------------------------------------------------------
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('stage')

    if (leadsError) {
      return new Response(JSON.stringify({ error: leadsError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const leadsByStage: Record<string, number> = {}
    for (const lead of leads ?? []) {
      const stage: string = lead.stage ?? 'unknown'
      leadsByStage[stage] = (leadsByStage[stage] ?? 0) + 1
    }

    // -----------------------------------------------------------------------
    // 2. Tasks — open count + pending approvals
    // -----------------------------------------------------------------------
    const { data: openTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('type')
      .eq('status', 'open')

    if (tasksError) {
      return new Response(JSON.stringify({ error: tasksError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const openTaskRows = openTasks ?? []
    const openTaskCount = openTaskRows.length
    const pendingApprovals = openTaskRows.filter(
      (t) => t.type === 'approve_mao' || t.type === 'approve_offer',
    ).length

    // -----------------------------------------------------------------------
    // 3. Build Digest
    // -----------------------------------------------------------------------
    const digest: Digest = {
      leadsByStage,
      openTasks: openTaskCount,
      pendingApprovals,
      generatedAt: new Date().toISOString(),
    }

    // -----------------------------------------------------------------------
    // TODO(after-provider): POST digest to Resend/SMTP
    //
    // When a Resend API key is available, replace this block with:
    //
    //   const resendKey = Deno.env.get('RESEND_API_KEY')
    //   if (resendKey) {
    //     await fetch('https://api.resend.com/emails', {
    //       method: 'POST',
    //       headers: {
    //         'Authorization': `Bearer ${resendKey}`,
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({
    //         from: 'morning-brief@standardblack.com',
    //         to: ['kerrykelleyjr16@gmail.com'],
    //         subject: `Morning Brief — ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}`,
    //         text: JSON.stringify(digest, null, 2),
    //       }),
    //     })
    //   }
    //
    // Until then the in-app Command Center is the operative brief.
    // -----------------------------------------------------------------------

    return new Response(JSON.stringify(digest), {
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
