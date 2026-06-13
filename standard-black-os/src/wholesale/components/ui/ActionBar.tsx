import React from 'react'
import { C, f } from '../../../tokens.js'
import { goldGradient } from './styles'

export function PrimaryButton({ label, onClick, disabled, type = 'button' }: { label: string; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit' | 'reset' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      borderRadius: 12, border: 'none',
      background: goldGradient,
      padding: '12px 16px', fontFamily: f.body, fontSize: 14, fontWeight: 600,
      color: C.bg, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1,
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export function SecondaryButton({ label, onClick, disabled, type = 'button' }: { label: string; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit' | 'reset' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      borderRadius: 12, border: `1px solid ${C.borderSoft}`, background: 'rgba(255,255,255,0.03)',
      padding: '12px 16px', fontFamily: f.body, fontSize: 14, fontWeight: 500,
      color: C.sub, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

export default function ActionBar({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, ...style }}>{children}</div>
}
