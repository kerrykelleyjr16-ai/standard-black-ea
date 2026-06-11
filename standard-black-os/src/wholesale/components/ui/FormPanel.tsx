import React from 'react'
import DetailPanel from './DetailPanel'
import { inputBase, microLabel } from './styles'

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ ...microLabel, display: 'block', marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputBase, ...(props.style ?? {}) }} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} style={{ ...inputBase, appearance: 'none', ...(props.style ?? {}) }} />
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputBase, minHeight: 96, resize: 'vertical', ...(props.style ?? {}) }} />
}

export default function FormPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <DetailPanel title={title}>
      <div style={{ display: 'grid', gap: 16 }}>{children}</div>
    </DetailPanel>
  )
}
