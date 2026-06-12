import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Deal, Lead } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import FilterPills, { type FilterPill } from '@wholesale/components/ui/FilterPills'
import DealCard, { type DealCardDeal } from '@wholesale/components/ui/DealCard'
import EmptyState from '@wholesale/components/ui/EmptyState'
import { PrimaryButton, SecondaryButton } from '@wholesale/components/ui/ActionBar'

type DealWithLead = Deal & {
  leads: Pick<Lead, 'address' | 'city' | 'zip' | 'stage'> | null
}

type DealPhase = 'Needs MAO' | 'Needs Offer' | 'Ready to Dispo'

// Derived from existing approval timestamps — mirrors DealCard's nextAction.
function dealPhase(deal: Deal): DealPhase {
  if (deal.mao_approved_at == null) return 'Needs MAO'
  if (deal.offer_approved_at == null) return 'Needs Offer'
  return 'Ready to Dispo'
}

const PHASES: DealPhase[] = ['Needs MAO', 'Needs Offer', 'Ready to Dispo']

export default function Deals() {
  const navigate = useNavigate()
  const [deals, setDeals] = useState<DealWithLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activePhase, setActivePhase] = useState<DealPhase | 'All'>('All')

  useEffect(() => {
    async function fetchDeals() {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          leads (
            address,
            city,
            zip,
            stage
          )
        `)
        .order('analyzed_at', { ascending: false, nullsFirst: false })

      if (error) {
        setError(error.message)
      } else {
        setDeals((data as DealWithLead[]) ?? [])
      }
      setLoading(false)
    }

    fetchDeals()
  }, [])

  const phaseCount = (phase: DealPhase) => deals.filter(d => dealPhase(d) === phase).length

  const filters: FilterPill[] = useMemo(() => [
    { label: 'All', value: 'All', count: deals.length },
    ...PHASES.map(phase => ({ label: phase, value: phase, count: phaseCount(phase) })),
  ], [deals])

  const filtered = useMemo(
    () => (activePhase === 'All' ? deals : deals.filter(d => dealPhase(d) === activePhase)),
    [deals, activePhase],
  )

  return (
    <DesktopShell>
      <PageHeader
        eyebrow="Disposition Desk"
        title="Deals Pipeline"
        subtitle="Qualified acquisition opportunities ready for buyer matching, assignment, and disposition."
        primaryAction="+ New Deal"
        onPrimary={() => navigate('/wholesale/deals/new')}
      />

      {error ? (
        <p style={{ marginTop: 24, fontFamily: f.mono, fontSize: 13, color: C.danger }}>Error: {error}</p>
      ) : loading ? (
        <p style={{ marginTop: 24, fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading deals…</p>
      ) : deals.length === 0 ? (
        <EmptyState
          icon="$"
          title="No Active Deals Yet"
          body="Qualified leads will appear here once they are ready for buyer matching, assignment, or disposition."
          actions={
            <>
              <PrimaryButton label="Review Qualified Leads" onClick={() => navigate('/wholesale/leads')} />
              <SecondaryButton label="Create Deal" onClick={() => navigate('/wholesale/deals/new')} />
            </>
          }
        />
      ) : (
        <>
          <FilterPills filters={filters} active={activePhase} onChange={(v) => setActivePhase(v as DealPhase | 'All')} />
          {filtered.length === 0 ? (
            <EmptyState
              icon="$"
              title="No Deals in This Phase"
              body="Nothing matches the selected phase right now. Switch phases to see other deals."
            />
          ) : (
            <div style={{
              marginTop: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
              gap: 16,
            }}>
              {filtered.map(deal => (
                <DealCard
                  key={deal.id}
                  deal={deal as DealCardDeal}
                  onClick={() => navigate(`/wholesale/deals/${deal.id}`)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </DesktopShell>
  )
}
