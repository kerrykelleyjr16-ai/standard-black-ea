import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  disabled?: boolean
  type?: 'button' | 'submit'
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary: { background: '#C9A24A', color: '#050505' },
  ghost:   { background: 'transparent', color: '#aaaaaa', border: '1px solid #333333' },
  danger:  { background: '#2e1a1a', color: '#ff7b7b', border: '1px solid #ff7b7b33' },
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
}

export default function Button({
  children, onClick, variant = 'primary', size = 'md', disabled = false, type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded font-mono font-medium transition-opacity ${sizeStyles[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer'}`}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  )
}
