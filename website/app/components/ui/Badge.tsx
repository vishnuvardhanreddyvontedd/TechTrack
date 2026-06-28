// app/components/ui/Badge.tsx
import { type HTMLAttributes } from 'react'

type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'muted' | 'gold'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  brand:   'bg-brand-500/10 text-brand-400 border-brand-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:  'bg-red-500/10   text-red-400   border-red-500/20',
  muted:   'bg-[--bg-muted] text-[--text-muted] border-[--border-subtle]',
  gold:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
}

const dotColors: Record<BadgeVariant, string> = {
  brand:   'bg-brand-400',
  success: 'bg-green-400',
  warning: 'bg-amber-400',
  danger:  'bg-red-400',
  muted:   'bg-[--text-muted]',
  gold:    'bg-yellow-400',
}

export function Badge({ variant = 'brand', dot = false, children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}
