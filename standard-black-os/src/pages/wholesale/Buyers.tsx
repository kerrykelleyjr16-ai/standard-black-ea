import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Buyer } from '@wholesale/lib/types'
import { formatCurrency, formatPercent } from '@wholesale/lib/mao'
import Button from '@wholesale/components/ui/Button'
import Badge from '@wholesale/components/ui/Badge'
import WholesaleNav from '@wholesale/components/WholesaleNav'

export default function Buyers() {
  const navigate = useNavigate()
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBuyers() {
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setBuyers(data as Buyer[])
      }
      setLoading(false)
    }
    fetchBuyers()
  }, [])

  const activeCount = buyers.filter(b => b.active).length

  function strategyLabel(s: string | null): string {
    if (!s) return '—'
    return s
  }

  function marketDisplay(markets: string[]): string {
    if (!markets || markets.length === 0) return '—'
    const shown = markets.slice(0, 2).join(', ')
    const extra = markets.length > 2 ? ` +${markets.length - 2}` : ''
    return shown + extra
  }

  return (
    <>
      <WholesaleNav />
      <div className="p-8 font-mono" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium" style={{ color: '#e5e5e5' }}>Buyers</h1>
            {!loading && (
              <p className="text-xs mt-1" style={{ color: '#666' }}>
                {activeCount} active buyer{activeCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <Button onClick={() => navigate('/wholesale/buyers/new')} variant="primary" size="md">
            + Add Buyer
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-sm" style={{ color: '#666' }}>Loading buyers...</div>
        )}

        {/* Empty state */}
        {!loading && buyers.length === 0 && (
          <div
            className="rounded-lg p-12 text-center"
            style={{ background: '#0f0f0f', border: '1px solid #333' }}
          >
            <p className="text-sm mb-1" style={{ color: '#aaa' }}>No buyers yet.</p>
            <p className="text-sm" style={{ color: '#666' }}>
              Add your first buyer to start matching deals.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && buyers.length > 0 && (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid #333', background: '#0f0f0f' }}
          >
            {/* Table header */}
            <div
              className="grid text-xs uppercase tracking-wider px-4 py-2"
              style={{
                gridTemplateColumns: '1.8fr 1.4fr 1.2fr 0.9fr 1.3fr 0.7fr 0.8fr',
                color: '#666',
                borderBottom: '1px solid #222',
              }}
            >
              <span>Name</span>
              <span>Company</span>
              <span>Markets</span>
              <span>Strategy</span>
              <span>Price Range</span>
              <span>Margin</span>
              <span>Status</span>
            </div>

            {/* Rows */}
            {buyers.map((buyer, idx) => {
              const isLast = idx === buyers.length - 1
              const muted = !buyer.active

              return (
                <div
                  key={buyer.id}
                  onClick={() => navigate(`/wholesale/buyers/${buyer.id}`)}
                  className="grid px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-[#111]"
                  style={{
                    gridTemplateColumns: '1.8fr 1.4fr 1.2fr 0.9fr 1.3fr 0.7fr 0.8fr',
                    borderBottom: isLast ? 'none' : '1px solid #1a1a1a',
                    color: muted ? '#555' : '#e5e5e5',
                  }}
                >
                  {/* Name */}
                  <span style={{ color: muted ? '#555' : '#e5e5e5' }}>{buyer.name}</span>

                  {/* Company */}
                  <span style={{ color: muted ? '#444' : '#aaa' }}>
                    {buyer.company || '—'}
                  </span>

                  {/* Markets */}
                  <span style={{ color: muted ? '#444' : '#aaa' }}>
                    {marketDisplay(buyer.target_markets)}
                  </span>

                  {/* Strategy */}
                  <span>
                    {buyer.strategy ? (
                      <Badge
                        label={strategyLabel(buyer.strategy)}
                        color={muted ? 'gray' : 'blue'}
                      />
                    ) : (
                      <span style={{ color: '#555' }}>—</span>
                    )}
                  </span>

                  {/* Price Range */}
                  <span style={{ color: muted ? '#444' : '#aaa' }}>
                    {buyer.min_price || buyer.max_price
                      ? `${formatCurrency(buyer.min_price)} – ${formatCurrency(buyer.max_price)}`
                      : '—'}
                  </span>

                  {/* Margin */}
                  <span style={{ color: muted ? '#444' : '#C9A24A' }}>
                    {formatPercent(buyer.target_margin)}
                  </span>

                  {/* Status */}
                  <span
                    className="flex items-center gap-1 text-xs"
                    style={{ color: buyer.active ? '#7fff7b' : '#555' }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: buyer.active ? '#7fff7b' : '#555' }}
                    />
                    {buyer.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
