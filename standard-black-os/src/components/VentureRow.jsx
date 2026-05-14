import { useNavigate } from 'react-router-dom'
import { DollarSign, Layers, BookOpen, Monitor, Building2, Users, ChevronRight } from 'lucide-react'
import { C, f } from '../tokens.js'
import Pill from './Pill.jsx'

const ICONS = { DollarSign, Layers, BookOpen, Monitor, Building2, Users };

export default function VentureRow({ venture }) {
  const navigate = useNavigate();
  const Icon = ICONS[venture.iconName] ?? DollarSign;
  const tone = venture.status === 'active' ? 'gold' : venture.status === 'planning' ? 'warn' : 'off';

  return (
    <div
      style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto auto',
        gap: 14, alignItems: 'center', padding: '14px 16px',
        borderBottom: `1px solid ${C.border}`, cursor: 'default', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = C.surface2}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 3,
        background: 'rgba(201,162,74,0.05)', border: `1px solid ${C.goldDim}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: C.gold }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.text, display: 'flex', alignItems: 'center', gap: 10 }}>
          {venture.name}
          <Pill tone={tone}>{venture.status}</Pill>
        </div>
        <div style={{ fontFamily: f.body, fontSize: 11.5, color: C.mute, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {venture.sub}
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 110 }}>
        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {venture.kpi.label}
        </div>
        <div style={{ fontFamily: f.display, fontSize: 17, color: C.text, fontWeight: 500, marginTop: 2 }}>
          {venture.kpi.value}
        </div>
        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.dim, marginTop: 1 }}>
          → {venture.kpi.target}
        </div>
      </div>
      <button
        onClick={() => navigate(`/venture/${venture.id}`)}
        style={{
          fontFamily: f.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
          padding: '8px 12px', borderRadius: 2, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,162,74,0.08)'; e.currentTarget.style.color = C.goldHi; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; }}
      >
        Open <ChevronRight size={12} />
      </button>
    </div>
  );
}
