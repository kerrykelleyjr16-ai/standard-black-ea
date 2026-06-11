import React from 'react'
import { C } from '../../../tokens.js'

export default function EntityCard({ children, style, onClick }: {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}) {
  return (
    <article
      onClick={onClick}
      style={{
        borderRadius: 16,
        border: `1px solid ${C.borderGold}`,
        background: C.surface,
        padding: 20,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3), 0 4px 6px -4px rgba(0,0,0,0.3)',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </article>
  )
}
