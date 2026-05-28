import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Settings, ExternalLink, Menu, X } from 'lucide-react'
import { C, f } from '../tokens.js'

const NAV_LINKS = [
  { to: '/trading-os', label: 'Trading OS' },
  { to: '/wholesale/dashboard', label: 'Wholesale OS' },
]

export default function Header({ onConfigOpen }) {
  const [now, setNow] = useState(new Date())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const ts = now.toLocaleTimeString('en-US', { hour12: false })

  return (
    <header style={{
      borderBottom: `1px solid ${C.border}`,
      background: 'rgba(5,5,5,0.9)',
      backdropFilter: 'blur(8px)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 2,
              background: C.gold,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: f.display, fontSize: 14, fontWeight: 700, color: C.bg,
              letterSpacing: '0.05em',
            }}>
              SB
            </div>
            <div>
              <div style={{
                fontFamily: f.display, fontSize: 16, fontWeight: 500,
                letterSpacing: '0.1em', color: C.text, lineHeight: 1,
                textTransform: 'uppercase',
              }}>
                Standard Black
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.16em', marginTop: 3, textTransform: 'uppercase' }}>
                Kerry Kelley Jr · Operator
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Desktop nav links — hidden on mobile */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  fontFamily: f.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
                  padding: '6px 12px', borderRadius: 2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                  textDecoration: 'none', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,74,0.08)'; e.currentTarget.style.borderColor = C.gold }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.goldDim }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Heartbeat — hidden on mobile */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green, boxShadow: `0 0 8px ${C.green}`, display: 'inline-block' }} />
            <span style={{ fontFamily: f.mono, fontSize: 11, color: C.sub, letterSpacing: '0.05em' }}>
              Heartbeat · live
            </span>
          </div>

          <div className="desktop-nav" style={{ width: 1, height: 16, background: C.border }} />

          {/* Clock — hidden on mobile */}
          <span className="desktop-nav" style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>{ts}</span>

          <div className="desktop-nav" style={{ width: 1, height: 16, background: C.border }} />

          {/* Standard Black website link — hidden on mobile */}
          <a
            className="desktop-nav"
            href="https://standard-black-scale.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: f.mono, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
              padding: '6px 12px', borderRadius: 2, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,74,0.08)'; e.currentTarget.style.color = C.goldHi }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold }}
          >
            Standard Black <ExternalLink size={10} />
          </a>

          {/* Config button */}
          <button
            onClick={onConfigOpen}
            className="desktop-nav"
            style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              padding: '6px 10px', borderRadius: 2, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              color: C.sub, fontFamily: f.mono, fontSize: 11, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.color = C.text }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.sub }}
          >
            <Settings size={12} /> Config
          </button>

          {/* Mobile hamburger — visible only on mobile */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(o => !o)}
            style={{
              background: 'transparent', border: `1px solid ${C.border}`,
              padding: '6px 8px', borderRadius: 2, cursor: 'pointer',
              display: 'none', alignItems: 'center', justifyContent: 'center',
              color: C.sub,
            }}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className="mobile-menu"
          style={{
            borderTop: `1px solid ${C.border}`,
            background: 'rgba(5,5,5,0.98)',
            padding: '12px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              style={{
                fontFamily: f.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: C.gold, padding: '10px 0',
                borderBottom: `1px solid ${C.border}`,
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://standard-black-scale.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: f.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.sub, padding: '10px 0',
              borderBottom: `1px solid ${C.border}`,
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            Standard Black <ExternalLink size={10} />
          </a>
          <button
            onClick={() => { setMobileOpen(false); onConfigOpen() }}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: f.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.sub, padding: '10px 0', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <Settings size={12} /> Config
          </button>
        </div>
      )}

      {/* Responsive styles injected via style tag */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 768px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  )
}
