import React from 'react'
import { C, f } from '../../../tokens.js'

const STATUS_COLORS: Record<string, string> = {
  new: C.blue, 'skip traced': C.purple, contacted: C.warning, responded: C.warning,
  qualified: C.success, analyzed: C.blue, matched: C.gold, 'offer made': C.gold,
  'under contract': C.warning, assigned: C.success, closed: C.success,
  dead: C.danger, active: C.success, hot: C.danger, warm: C.warning, cold: C.blue,
  pending: C.warning, done: C.success, 'opted out': C.danger,
}

// hexToRgba fallback instead of CSS color-mix() — guaranteed to render in any
// webview (color-mix support is uneven in older PWA webviews).
function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function tint(color: string, alpha: number): string {
  if (color.startsWith('#')) return hexToRgba(color, alpha)
  return 'rgba(255,255,255,0.08)'
}

export default function StatusBadge({ label, color }: { label: string; color?: string }) {
  const resolved = color ?? STATUS_COLORS[label.toLowerCase()] ?? C.sub
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', flexShrink: 0,
      borderRadius: 999, padding: '4px 12px',
      background: tint(resolved, 0.12),
      color: resolved, fontFamily: f.mono, fontSize: 11, fontWeight: 500,
      letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}
