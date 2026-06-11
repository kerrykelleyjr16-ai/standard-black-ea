import React from 'react'
import { C, f } from '../../../tokens.js'
import ActionBar, { PrimaryButton, SecondaryButton } from './ActionBar'

export default function PageHeader({ eyebrow, title, subtitle, primaryAction, secondaryAction, onPrimary, onSecondary, children }: {
  eyebrow: string; title: string; subtitle?: string
  primaryAction?: string; secondaryAction?: string
  onPrimary?: () => void; onSecondary?: () => void
  children?: React.ReactNode
}) {
  return (
    <section style={{
      borderRadius: 16, border: `1px solid ${C.borderGold}`, background: C.surface,
      padding: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontFamily: f.mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.25em', color: C.gold }}>{eyebrow}</p>
      <h1 style={{ marginTop: 8, fontFamily: f.display, fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em', color: C.text }}>{title}</h1>
      {subtitle ? <p style={{ marginTop: 8, fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.mute }}>{subtitle}</p> : null}
      {children ? <div style={{ marginTop: 20 }}>{children}</div> : null}
      {(primaryAction || secondaryAction) && (
        <ActionBar style={{ marginTop: 20 }}>
          {primaryAction && <PrimaryButton label={primaryAction} onClick={onPrimary} />}
          {secondaryAction && <SecondaryButton label={secondaryAction} onClick={onSecondary} />}
        </ActionBar>
      )}
    </section>
  )
}
