import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg p-4 ${className}`}
      style={{ background: '#111111', border: '1px solid #222222' }}
    >
      {children}
    </div>
  )
}
