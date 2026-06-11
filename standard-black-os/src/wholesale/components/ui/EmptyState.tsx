import React from 'react'
import { C, f } from '../../../tokens.js'

export default function EmptyState({ icon = '$', title, body, actions }: {
  icon?: React.ReactNode; title: string; body: string; actions?: React.ReactNode
}) {
  return (
    <section style={{
      marginTop: 24, borderRadius: 16, border: `1px dashed rgba(201,162,74,0.25)`,
      background: C.panel, padding: 24, textAlign: 'center',
    }}>
      <div style={{
        margin: '0 auto', display: 'flex', height: 48, width: 48, alignItems: 'center',
        justifyContent: 'center', borderRadius: 999, background: 'rgba(201,162,74,0.1)',
        fontSize: 18, fontWeight: 600, color: C.gold, fontFamily: f.display,
      }}>{icon}</div>
      <h2 style={{ marginTop: 16, fontFamily: f.display, fontSize: 18, fontWeight: 600, color: C.text }}>{title}</h2>
      <p style={{ margin: '8px auto 0', maxWidth: 384, fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.mute }}>{body}</p>
      {actions ? <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>{actions}</div> : null}
    </section>
  )
}
