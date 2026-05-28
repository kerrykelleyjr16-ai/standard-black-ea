interface BadgeProps {
  label: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'cyan' | 'purple' | 'gray' | 'gold'
}

const colorMap: Record<NonNullable<BadgeProps['color']>, { bg: string; text: string }> = {
  blue:   { bg: '#1a1a2e', text: '#7b9fff' },
  green:  { bg: '#1a2e1a', text: '#7fff7b' },
  red:    { bg: '#2e1a1a', text: '#ff7b7b' },
  yellow: { bg: '#2e2e1a', text: '#ffff7b' },
  cyan:   { bg: '#1a2e2e', text: '#7bffff' },
  purple: { bg: '#2e1a2e', text: '#ff7bff' },
  gray:   { bg: '#1a1a1a', text: '#aaaaaa' },
  gold:   { bg: 'rgba(201,162,74,0.12)', text: '#C9A24A' },
}

export default function Badge({ label, color = 'gray' }: BadgeProps) {
  const { bg, text } = colorMap[color]
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  )
}
