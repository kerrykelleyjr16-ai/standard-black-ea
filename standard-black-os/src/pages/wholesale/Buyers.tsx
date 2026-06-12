import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Buyer } from '@wholesale/lib/types'
import { formatCurrency, formatPercent } from '@wholesale/lib/mao'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import BuyerCard from '@wholesale/components/ui/BuyerCard'
import EmptyState from '@wholesale/components/ui/EmptyState'
import { PrimaryButton } from '@wholesale/components/ui/ActionBar'
import { microLabel } from '@wholesale/components/ui/styles'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

const TABLE_COLS = '1.8fr 1.4fr 1.2fr 0.9fr 1.3fr 0.7fr 0.8fr'

function marketDisplay(markets: string[]): string {
  if (!markets || markets.length === 0) return '—'
  const shown = markets.slice(0, 2).join(', ')
  const extra = markets.length > 2 ? ` +${markets.length - 2}` : ''
  return shown + extra
}

export default function Buyers() {
  const navigate = useNavigate()
  const [buyers, setBuyers] = useState<Buyer[]>([])
  const [loading, setLoading] = useState(true)
  const isDesktop = useMediaQuery('(min-width: 1024px)')

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

  return (
    <DesktopShell>
      <PageHeader
        eyebrow="Disposition Network"
        title="Buyer Network"
        subtitle={loading ? 'Loading network…' : `${activeCount} active cash buyer${activeCount === 1 ? '' : 's'} and acquisition partners.`}
        primaryAction="+ Add Buyer"
        onPrimary={() => navigate('/wholesale/buyers/new')}
      />

      {loading ? (
        <p style={{ marginTop: 24, fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading buyers…</p>
      ) : buyers.length === 0 ? (
        <EmptyState
          title="No Buyers Yet"
          body="Add your first cash buyer to start matching deals to the disposition network."
          actions={<PrimaryButton label="Add Buyer" onClick={() => navigate('/wholesale/buyers/new')} />}
        />
      ) : isDesktop ? (
        <div style={{
          marginTop: 24, borderRadius: 16, border: `1px solid ${C.borderGold}`,
          background: C.surface, overflow: 'hidden',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: TABLE_COLS, gap: 12,
            padding: '14px 20px', borderBottom: `1px solid ${C.borderSoft}`,
            ...microLabel, letterSpacing: '0.12em',
          }}>
            <span>Name</span>
            <span>Company</span>
            <span>Markets</span>
            <span>Strategy</span>
            <span>Price Range</span>
            <span>Margin</span>
            <span>Status</span>
          </div>
          {buyers.map((buyer, idx) => {
            const muted = !buyer.active
            const isLast = idx === buyers.length - 1
            return (
              <div
                key={buyer.id}
                onClick={() => navigate(`/wholesale/buyers/${buyer.id}`)}
                style={{
                  display: 'grid', gridTemplateColumns: TABLE_COLS, gap: 12, alignItems: 'center',
                  padding: '16px 20px', cursor: 'pointer',
                  borderBottom: isLast ? 'none' : `1px solid ${C.borderSoft}`,
                  fontFamily: f.body, fontSize: 14,
                  color: muted ? C.mute : C.text,
                }}
              >
                <span style={{ fontWeight: 500, color: muted ? C.mute : C.text }}>{buyer.name}</span>
                <span style={{ color: muted ? C.mute : C.sub }}>{buyer.company || '—'}</span>
                <span style={{ color: muted ? C.mute : C.sub }}>{marketDisplay(buyer.target_markets)}</span>
                <span style={{ color: muted ? C.mute : C.blue, fontFamily: f.mono, fontSize: 12 }}>
                  {buyer.strategy || '—'}
                </span>
                <span style={{ color: muted ? C.mute : C.sub }}>
                  {buyer.min_price || buyer.max_price
                    ? `${formatCurrency(buyer.min_price)} – ${formatCurrency(buyer.max_price)}`
                    : '—'}
                </span>
                <span style={{ color: muted ? C.mute : C.gold, fontFamily: f.mono, fontSize: 13 }}>
                  {formatPercent(buyer.target_margin)}
                </span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: f.mono, fontSize: 12,
                  color: buyer.active ? C.success : C.mute,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 999,
                    background: buyer.active ? C.success : C.mute,
                  }} />
                  {buyer.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: 16,
        }}>
          {buyers.map(buyer => (
            <BuyerCard key={buyer.id} buyer={buyer} onClick={() => navigate(`/wholesale/buyers/${buyer.id}`)} />
          ))}
        </div>
      )}
    </DesktopShell>
  )
}
