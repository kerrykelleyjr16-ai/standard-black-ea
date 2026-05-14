import { C, f } from '../tokens.js'

export default function ActivityLog({ items }) {
  return (
    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
      {items.map((a, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: 'auto auto 1fr',
          gap: 10, padding: '10px 14px',
          borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
          fontFamily: f.mono, fontSize: 11.5, lineHeight: 1.5,
        }}>
          <span style={{ color: C.dim }}>{a.t}</span>
          <span style={{
            color: a.kind === 'ok' ? C.green : a.kind === 'warn' ? '#d9a441' : 'rgba(170,130,220,0.9)',
            textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, paddingTop: 1,
          }}>{a.who}</span>
          <span style={{ color: C.sub }}>{a.msg}</span>
        </div>
      ))}
    </div>
  );
}
