import React from 'react'
import { C, f } from '../../../tokens.js'

export default function DetailPanel({ title, action, children }: {
  title: string; action?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <section style={{
      borderRadius: 16, border: `1px solid ${C.borderGold}`, background: C.surface,
      padding: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 style={{ fontFamily: f.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: C.gold }}>{title}</h2>
        {action ?? null}
      </div>
      <div style={{ marginTop: 16 }}>{children}</div>
    </section>
  )
}
