import React from 'react'
import { C, f } from '../../../tokens.js'

export const goldGradient = `linear-gradient(to right, ${C.gold}, ${C.goldDeep})`

export const panelStyle: React.CSSProperties = {
  borderRadius: 16,
  border: `1px solid ${C.borderGold}`,
  background: C.surface,
  padding: 20,
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
}

export const microLabel: React.CSSProperties = {
  fontFamily: f.mono,
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: C.mute,
}

export const inputBase: React.CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: `1px solid ${C.borderSoft}`,
  background: 'rgba(0,0,0,0.3)',
  padding: '12px 16px',
  fontFamily: f.body,
  fontSize: 14,
  color: C.text,
  outline: 'none',
}
