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
        background: 'rgba(5,5,5,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.borderSoft}`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {TABS.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} style={{ flex: 1, textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '7px 0 6px',
                color: isActive ? C.gold : C.mute,
                transition: 'color 0.15s',
              }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 28, width: 28, borderRadius: 8,
                  background: isActive ? 'rgba(201,162,74,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(201,162,74,0.4)' : '1px solid transparent',
                  transition: 'background 0.15s, border-color 0.15s',
                }}>
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                </span>
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
