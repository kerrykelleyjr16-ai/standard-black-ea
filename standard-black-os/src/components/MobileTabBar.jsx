import { NavLink } from 'react-router-dom'
import { Home, Users, FileText, Wallet, LineChart } from 'lucide-react'
import { C, f } from '../tokens.js'

// App-wide bottom navigation. Mobile only (hidden >=768px via media query).
// Gives the PWA a native-app feel: thumb-reachable primary destinations.
const TABS = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/wholesale/leads', label: 'Leads', Icon: Users },
  { to: '/wholesale/deals', label: 'Deals', Icon: FileText },
  { to: '/wholesale/buyers', label: 'Buyers', Icon: Wallet },
  { to: '/trading-os', label: 'Trading', Icon: LineChart },
]

export default function MobileTabBar() {
  return (
    <nav
      className="sb-mobile-tabbar"
      style={{
        position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50,
        display: 'none', // revealed on mobile via the media query below
        background: 'rgba(8,8,8,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.border}`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '9px 0 7px',
                color: isActive ? C.gold : C.mute,
                transition: 'color 0.15s',
              }}>
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                <span style={{
                  fontFamily: f.mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <style>{`
        @media (max-width: 767px) {
          .sb-mobile-tabbar { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
