import React from 'react'
import { C, f } from '../../../tokens.js'

export default function Metric({ label, value, highlight = false }: {
  label: string; value: React.ReactNode; highlight?: boolean
}) {
  return (
    <div style={{ borderRadius: 12, background: 'rgba(0,0,0,0.3)', padding: 12 }}>
      <p style={{ fontFamily: f.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.mute }}>{label}</p>
      <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, fontWeight: 600, color: highlight ? C.gold : C.text }}>{value}</p>
    </div>
  )
}
