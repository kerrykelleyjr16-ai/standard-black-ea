import { Link, NavLink } from 'react-router-dom'
import { C, f } from '../../tokens.js'

const NAV_ITEMS = [
  { to: '/wholesale/command', label: 'Command' },
  { to: '/wholesale/dashboard', label: 'Dashboard' },
  { to: '/wholesale/leads', label: 'Leads' },
  { to: '/wholesale/deals', label: 'Deals' },
  { to: '/wholesale/buyers', label: 'Buyers' },
  { to: '/wholesale/tasks', label: 'Tasks' },
]

export default function WholesaleNav() {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: `1px solid ${C.borderSoft}`,
      background: 'rgba(5,5,5,0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      padding: '14px 16px 0',
      paddingTop: 'calc(env(safe-area-inset-top) + 14px)',
    }}>
      {/* Tier 1: brand */}
      <Link to="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
        <p style={{
          fontFamily: f.mono, fontSize: 11, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: C.mute, whiteSpace: 'nowrap',
        }}>
          ← Standard Black OS
        </p>
        <p style={{
          marginTop: 4, fontFamily: f.mono, fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase', color: C.gold, opacity: 0.8, whiteSpace: 'nowrap',
        }}>
          Acquisition Command Center
        </p>
      </Link>

      {/* Tier 2: scrollable tabs */}
      <nav className="sb-hide-scrollbar" style={{
        marginTop: 10, display: 'flex', gap: 4, overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              if (!el.getAttribute('aria-current')) el.style.color = C.sub
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              if (!el.getAttribute('aria-current')) el.style.color = C.mute
            }}
            style={({ isActive }: { isActive: boolean }) => ({
              display: 'flex',
              alignItems: 'center',
              fontFamily: f.mono,
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              padding: '12px 14px',
              textDecoration: 'none',
              color: isActive ? C.gold : C.mute,
              borderBottom: isActive ? `2px solid ${C.gold}` : '2px solid transparent',
              whiteSpace: 'nowrap' as const,
              transition: 'color 0.15s',
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
