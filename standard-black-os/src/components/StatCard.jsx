import { C, f } from '../tokens.js'
import { ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

export default function StatCard({ label, value, sub, accent = C.gold, trend, mini }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
      padding: '14px 16px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: accent }} />
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: f.display, fontSize: 26, fontWeight: 500, color: C.text, letterSpacing: '-0.01em', lineHeight: 1 }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: f.body, fontSize: 12, color: C.sub, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          {trend === 'up' && <ArrowUpRight size={12} style={{ color: C.green }} />}
          {sub}
        </div>
      )}
      {mini && (
        <div style={{ marginTop: 10, height: 32, marginLeft: -8, marginRight: -8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mini}>
              <defs>
                <linearGradient id={`g-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={accent} strokeWidth={1.5}
                fill={`url(#g-${label.replace(/\s+/g, '')})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
