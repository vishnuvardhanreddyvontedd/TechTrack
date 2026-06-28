// app/components/ui/ProgressBar.tsx
'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number      // 0–100
  max?: number
  height?: number
  color?: 'brand' | 'gold' | 'green' | 'fire'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const colorMap = {
  brand: 'from-brand-600 to-accent-500',
  gold:  'from-yellow-500 to-amber-400',
  green: 'from-green-600 to-emerald-400',
  fire:  'from-orange-600 to-red-400',
}

export function ProgressBar({
  value,
  max = 100,
  height = 6,
  color = 'brand',
  showLabel = false,
  animated = true,
  className = '',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-[--text-muted] mb-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div
        className="w-full rounded-full bg-[--bg-muted] overflow-hidden"
        style={{ height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {animated ? (
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  )
}
