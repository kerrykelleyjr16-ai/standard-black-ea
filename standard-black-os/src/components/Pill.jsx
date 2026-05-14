import { C, f } from '../tokens.js'

const tones = {
  default: { c: C.sub,    b: C.border,  bg: 'transparent' },
  gold:    { c: C.gold,   b: C.goldDim, bg: 'rgba(201,162,74,0.06)' },
  ok:      { c: C.green,  b: '#1f4a35', bg: 'rgba(62,166,118,0.06)' },
  warn:    { c: '#d9a441',b: '#5c4416', bg: 'rgba(217,164,65,0.06)' },
  off:     { c: C.mute,   b: C.border,  bg: 'transparent' },
  planned: { c: C.mute,   b: C.border,  bg: 'transparent' },
};

export default function Pill({ children, tone = 'default' }) {
  const t = tones[tone] ?? tones.default;
  return (
    <span style={{
      fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: t.c, border: `1px solid ${t.b}`,
      background: t.bg, padding: '3px 8px', borderRadius: 2, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}
