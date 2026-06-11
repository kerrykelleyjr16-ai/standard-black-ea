import React from 'react'
import { panelStyle } from './styles'

export default function EntityCard({ children, style, onClick }: {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
}) {
  return (
    <article
      onClick={onClick}
      style={{
        ...panelStyle,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </article>
  )
}
