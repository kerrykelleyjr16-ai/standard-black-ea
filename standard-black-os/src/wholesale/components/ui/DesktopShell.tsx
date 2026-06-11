import React from 'react'
import { C } from '../../../tokens.js'
import WholesaleNav from '../WholesaleNav'

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'calc(env(safe-area-inset-bottom) + 88px)',
    }}>
      <WholesaleNav />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 16px' }}>{children}</main>
    </div>
  )
}
