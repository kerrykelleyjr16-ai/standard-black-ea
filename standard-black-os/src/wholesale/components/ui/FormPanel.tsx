import React from 'react'
import { C, f } from '../../../tokens.js'
import DetailPanel from './DetailPanel'

const inputStyle: React.CSSProperties = {
  width: '100%', borderRadius: 12, border: `1px solid ${C.borderSoft}`,
  background: 'rgba(0,0,0,0.3)', padding: '12px 16px',
  fontFamily: f.body, fontSize: 14, color: C.text, outline: 'none',
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontFamily: f.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: C.mute, marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...(props.style ?? {}) }} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputStyle, appearance: 'none', ...(props.style ?? {}) }} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, minHeight: 96, resize: 'vertical', ...(props.style ?? {}) }} />
}

export default function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <DetailPanel title={title}>
      <div style={{ display: 'grid', gap: 16 }}>{children}</div>
    </DetailPanel>
  )
}
