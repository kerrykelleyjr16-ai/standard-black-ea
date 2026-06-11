import React from 'react'
import { f, C } from '../../../tokens.js'

export default function TagBadge({ label }: { label: string }) {
  return (
    <span style={{
      borderRadius: 999, padding: '4px 12px', background: 'rgba(96,165,250,0.10)',
      color: C.blue, fontFamily: f.mono, fontSize: 11, whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}
