import React from 'react'
import { C, f } from '../../../tokens.js'

export function PrimaryButton({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      borderRadius: 12, border: 'none',
      background: `linear-gradient(to right, ${C.gold}, #8a6d2f)`,
      padding: '12px 16px', fontFamily: f.body, fontSize: 14, fontWeight: 600,
      color: '#050505', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export function SecondaryButton({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      borderRadius: 12, border: `1px solid ${C.borderSoft}`, background: 'rgba(255,255,255,0.03)',
      padding: '12px 16px', fontFamily: f.body, fontSize: 14, fontWeight: 500,
      color: C.sub, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export default function ActionBar({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, ...style }}>{children}</div>
}
