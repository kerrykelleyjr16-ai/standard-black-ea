import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { formatCurrency } from '@wholesale/lib/mao'
import Badge from '@wholesale/components/ui/Badge'
import Button from '@wholesale/components/ui/Button'
import Card from '@wholesale/components/ui/Card'
import type { Deal, Lead, RepairLevel } from '@wholesale/lib/types'
import WholesaleNav from '@wholesale/components/WholesaleNav'

type DealWithLead = Deal & {
  leads: Pick<Lead, 'address' | 'city' | 'zip' | 'stage'> | null
}

const repairBadgeColor: Record<RepairLevel, 'green' | 'yellow' | 'red'> = {
  light: 'green',
  moderate: 'yellow',
  heavy: 'red',
}

export default function Deals() {
  const [deals, setDeals] = useState<DealWithLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <>
      <WholesaleNav />
      <div
        className="min-h-screen font-mono"
        style={{ background: '#0a0a0a', color: '#e5e5e5' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-10 pb-[90px] md:pb-10">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#e5e5e5' }}>
                Deals
              </h1>
              <p className="text-sm mt-1" style={{ color: '#666' }}>
                Qualified leads ready for buyer matching
              </p>
            </div>
            <Link to="/wholesale/deals/new">
              <Button variant="primary">+ New Deal</Button>
            </Link>
          </div>

          {/* States */}
          {loading && (
            <p className="text-sm" style={{ color: '#666' }}>
              Loading deals...
            </p>
          )}

          {error && (
            <p className="text-sm" style={{ color: '#ff7b7b' }}>
              Error: {error}
            </p>
          )}

          {!loading && !error && deals.length === 0 && (
            <Card>
              <div className="text-center py-12">
                <p className="text-sm mb-2" style={{ color: '#666' }}>
                  No deals yet.
                </p>
                <p className="text-sm" style={{ color: '#aaa' }}>
                  Qualify a lead to create your first deal.
                </p>
              </div>
            </Card>
          )}

          {/* Deal Cards */}
          {!loading && !error && deals.length > 0 && (
            <div className="flex flex-col gap-4">
              {deals.map((deal) => {
                const lead = deal.leads
                const effectiveMao = deal.mao_override ?? deal.mao
                const offerOverMao =
                  deal.offer_price != null && effectiveMao != null
                    ? deal.offer_price > effectiveMao
                    : false

                return (
                  <Link key={deal.id} to={`/wholesale/deals/${deal.id}`} className="block">
                    <Card className="hover:border-[#555] transition-colors cursor-pointer">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
                        {/* Left: Address + badges */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-semibold text-sm truncate"
                            style={{ color: '#e5e5e5' }}
                          >
                            {lead?.address ?? 'Unknown address'}
                            {lead?.city ? `, ${lead.city}` : ''}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                            {lead?.zip ?? ''}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {deal.repair_level && (
                              <Badge
                                label={deal.repair_level}
                                color={repairBadgeColor[deal.repair_level]}
                              />
                            )}
                            {lead?.stage && <Badge label={lead.stage} color="blue" />}
                            {deal.mao_override != null && (
                              <Badge label="Override Active" color="yellow" />
                            )}
                          </div>
                        </div>

                        {/* Right: Numbers */}
                        <div className="grid grid-cols-5 gap-3 md:flex md:gap-6 text-left md:text-right shrink-0 pt-2 md:pt-0 border-t md:border-t-0" style={{ borderColor: '#1a1a1a' }}>
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: '#666' }}>
                              ARV
                            </p>
                            <p className="text-sm font-medium" style={{ color: '#e5e5e5' }}>
                              {formatCurrency(deal.arv)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: '#666' }}>
                              MAO
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: deal.mao_override != null ? '#ffff7b' : '#7fff7b' }}
                            >
                              {formatCurrency(effectiveMao)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: '#666' }}>
                              Offer
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{ color: offerOverMao ? '#ff7b7b' : '#e5e5e5' }}
                            >
                              {formatCurrency(deal.offer_price)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: '#666' }}>
                              Fee
                            </p>
                            <p className="text-sm font-medium" style={{ color: '#aaa' }}>
                              {formatCurrency(deal.assignment_fee)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs mb-0.5" style={{ color: '#666' }}>
                              Buyers
                            </p>
                            <p
                              className="text-sm font-medium"
                              style={{
                                color:
                                  (deal.matched_buyer_ids?.length ?? 0) > 0 ? '#7fff7b' : '#666',
                              }}
                            >
                              {deal.matched_buyer_ids?.length ?? 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
