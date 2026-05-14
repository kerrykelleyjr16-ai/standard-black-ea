import { C, f } from '../tokens.js'

export default function Panel({ title, action, children, dense = false }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderBottom: `1px solid ${C.border}`, background: C.surface2,
        }}>
          <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.sub, fontWeight: 500 }}>
            {title}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding: dense ? 0 : 14 }}>{children}</div>
    </div>
  );
}
