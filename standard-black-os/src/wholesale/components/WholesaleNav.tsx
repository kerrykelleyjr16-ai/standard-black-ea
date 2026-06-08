import { Link, NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/wholesale/dashboard', label: 'Dashboard' },
  { to: '/wholesale/leads', label: 'Leads' },
  { to: '/wholesale/deals', label: 'Deals' },
  { to: '/wholesale/buyers', label: 'Buyers' },
]

export default function WholesaleNav() {
  return (
    <div className="wholesale-nav" style={{
      borderBottom: '1px solid #222222',
      background: 'rgba(5,5,5,0.95)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 24,
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <style>{`
        @media (max-width: 767px) {
          .wholesale-nav { padding-left: 14px !important; }
          .wholesale-nav::-webkit-scrollbar { display: none; }
        }
      `}</style>
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
          fontSize: 11,
          color: 'rgba(245,241,232,0.65)',
          letterSpacing: '0.06em',
          padding: '13px 16px 13px 0',
          borderRight: '1px solid #222222',
          marginRight: 16,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        ← Standard Black OS
      </Link>

      {NAV_ITEMS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }: { isActive: boolean }) => ({
            display: 'flex',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace",
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
            padding: '14px 16px',
            textDecoration: 'none',
            color: isActive ? '#C9A24A' : 'rgba(245,241,232,0.65)',
            borderBottom: isActive ? '2px solid #C9A24A' : '2px solid transparent',
            whiteSpace: 'nowrap' as const,
            transition: 'color 0.15s',
          })}
        >
          {label}
        </NavLink>
      ))}
    </div>
  )
}
