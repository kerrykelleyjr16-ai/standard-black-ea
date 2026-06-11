import React, { useState } from 'react'
import { C } from '../../../tokens.js'
import { inputBase } from './styles'

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
        ...inputBase,
        border: `1px solid ${focused ? 'rgba(201,162,74,0.5)' : C.borderSoft}`,
        transition: 'border-color 0.15s',
      }}
    />
  )
}
