import React, { useState } from 'react'
import { C, f } from '../../../tokens.js'

export default function SearchBar({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      style={{
        width: '100%', borderRadius: 12,
        border: `1px solid ${focused ? 'rgba(201,162,74,0.5)' : C.borderSoft}`,
        background: 'rgba(0,0,0,0.3)', padding: '12px 16px',
        fontFamily: f.body, fontSize: 14, color: C.text, outline: 'none',
        transition: 'border-color 0.15s',
      }}
    />
  )
}
