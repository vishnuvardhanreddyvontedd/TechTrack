'use client'
// app/(dashboard)/analytics/AnalyticsClient.tsx
// Fully interactive analytics: SVG bar chart, heatmap, tooltips, tab switcher.
// No external chart library — pure SVG + Framer Motion.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WeeklyStats } from '@/app/services/task-engine'

interface Props { weeklyStats: WeeklyStats[] }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtFull(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', timeZone: 'UTC',
  })
}
function fmtShort(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').toLocaleDateString('en-US', {
    weekday: 'short', timeZone: 'UTC',
  })
}
function fmtDay(dateStr: string) {
  return new Date(dateStr + 'T00:00:00Z').getUTCDate()
}
function isToday(dateStr: string) {
  const t = new Date()
  return dateStr === `${t.getUTCFullYear()}-${String(t.getUTCMonth()+1).padStart(2,'0')}-${String(t.getUTCDate()).padStart(2,'0')}`
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────
function BarChart({ stats }: { stats: WeeklyStats[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  const W = 600   // viewBox width
  const H = 160   // viewBox height
  const PAD = { top: 16, right: 8, bottom: 32, left: 28 }
  const chartH = H - PAD.top - PAD.bottom
  const chartW = W - PAD.left - PAD.right

  const maxVal = Math.max(...stats.map(s => s.tasksPlanned), 1)
  const barW   = chartW / stats.length
  const gap    = barW * 0.25

  // Y-axis grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(v => ({
    y: PAD.top + chartH * (1 - v),
    label: Math.round(v * maxVal),
  }))

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {hovered !== null && stats[hovered] && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 z-20 pointer-events-none"
            style={{ background: 'var(--bg-muted)', boxShadow: 'var(--shadow-lg)', borderRadius: 12, padding: '8px 14px', minWidth: 140, textAlign: 'center' }}>
            <p className="text-xs font-semibold text-[--text-primary]">{fmtFull(stats[hovered].date)}</p>
            <p className="text-xs text-green-400 mt-0.5">✓ {stats[hovered].tasksCompleted} completed</p>
            <p className="text-xs text-[--text-muted]">{stats[hovered].tasksPlanned} planned · {stats[hovered].completionRate}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: 200 }}
        aria-label="14-day activity bar chart"
      >
        {/* Grid lines */}
        {gridLines.map(({ y, label }) => (
          <g key={y}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end"
              fontSize="9" fill="var(--text-muted)">{label}</text>
          </g>
        ))}

        {/* Bars */}
        {stats.map((stat, i) => {
          const x        = PAD.left + i * barW + gap / 2
          const bw       = barW - gap
          const planned  = stat.tasksPlanned > 0 ? (stat.tasksPlanned / maxVal) * chartH : 4
          const done     = stat.tasksPlanned > 0 ? (stat.tasksCompleted / maxVal) * chartH : 0
          const py       = PAD.top + chartH - planned
          const dy       = PAD.top + chartH - done
          const today    = isToday(stat.date)
          const isHov    = hovered === i
          const complete = stat.completionRate === 100

          return (
            <g key={stat.date}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}>

              {/* Planned bar (background) */}
              <rect
                x={x} y={py} width={bw} height={planned}
                rx={4} ry={4}
                fill={today ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'}
                opacity={isHov ? 1 : 0.8}
              />

              {/* Completed bar (animated foreground) */}
              {done > 0 && (
                <motion.rect
                  x={x}
                  initial={{ y: PAD.top + chartH, height: 0 }}
                  animate={{ y: dy, height: done }}
                  transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
                  width={bw}
                  rx={4} ry={4}
                  fill={complete ? '#22c55e' : isHov ? '#818cf8' : '#6366f1'}
                />
              )}

              {/* Day label */}
              <text
                x={x + bw / 2}
                y={H - PAD.bottom + 14}
                textAnchor="middle"
                fontSize="9"
                fill={today ? 'var(--text-brand)' : 'var(--text-muted)'}
                fontWeight={today ? '600' : '400'}
              >
                {fmtShort(stat.date)}
              </text>

              {/* Today indicator dot */}
              {today && (
                <circle cx={x + bw / 2} cy={H - PAD.bottom + 24} r={2.5} fill="var(--text-brand)" />
              )}
            </g>
          )
        })}

        {/* X axis */}
        <line
          x1={PAD.left} x2={W - PAD.right}
          y1={PAD.top + chartH} y2={PAD.top + chartH}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1"
        />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-1 text-[10px] text-[--text-muted]">
        {[
          { color: '#6366f1', label: 'Completed' },
          { color: 'rgba(255,255,255,0.07)', label: 'Planned' },
          { color: '#22c55e', label: '100% done' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────
function Heatmap({ stats }: { stats: WeeklyStats[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  if (stats.length === 0) return <EmptyState />

  const firstDate = new Date(stats[0].date + 'T00:00:00Z')
  const pad       = firstDate.getUTCDay() // 0=Sun
  const cells     = [...Array(pad).fill(null), ...stats]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1.5">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-center text-[9px] text-[--text-muted] pb-1 font-medium">{d}</div>
        ))}

        {cells.map((stat, i) => {
          if (!stat) return <div key={`pad-${i}`} className="aspect-square" />
          const idx = i - pad
          const intensity = stat.tasksPlanned === 0 ? 0 : stat.completionRate / 100
          const today = isToday(stat.date)
          const isHov = hovered === idx

          return (
            <div key={stat.date} className="relative aspect-square" style={{ zIndex: isHov ? 10 : 'auto' }}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.025 }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className="w-full h-full rounded-md cursor-pointer transition-transform duration-150"
                style={{
                  background: intensity === 0
                    ? 'rgba(255,255,255,0.04)'
                    : `rgba(99,102,241,${0.15 + intensity * 0.85})`,
                  boxShadow: today ? '0 0 0 2px rgba(99,102,241,0.8)' : isHov ? 'var(--shadow-sm)' : 'none',
                  transform: isHov ? 'scale(1.15)' : 'scale(1)',
                }}
              />
              {/* Tooltip */}
              {isHov && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  style={{ background: 'var(--bg-muted)', boxShadow: 'var(--shadow-lg)', borderRadius: 10, padding: '6px 10px', minWidth: 110, textAlign: 'center' }}>
                  <p className="text-[10px] font-semibold text-[--text-primary]">{fmtFull(stat.date)}</p>
                  <p className="text-[10px] text-green-400">{stat.tasksCompleted}/{stat.tasksPlanned} · {stat.completionRate}%</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 text-[10px] text-[--text-muted]">
        <span>Less</span>
        {[0, 0.2, 0.4, 0.65, 1].map(v => (
          <div key={v} className="w-3.5 h-3.5 rounded-sm"
            style={{ background: v === 0 ? 'rgba(255,255,255,0.04)' : `rgba(99,102,241,${0.15 + v * 0.85})` }} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}

// ─── Summary row ──────────────────────────────────────────────────────────────
function SummaryRow({ stats }: { stats: WeeklyStats[] }) {
  const activeDays  = stats.filter(s => s.tasksCompleted > 0).length
  const totalDone   = stats.reduce((a, s) => a + s.tasksCompleted, 0)
  const totalPlan   = stats.reduce((a, s) => a + s.tasksPlanned, 0)
  const avgRate     = totalPlan > 0 ? Math.round((totalDone / totalPlan) * 100) : 0
  const perfect     = stats.filter(s => s.completionRate === 100 && s.tasksPlanned > 0).length

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {[
        { label: 'Active Days',   value: `${activeDays} / ${stats.length}`, color: '#818cf8' },
        { label: 'Tasks Done',    value: totalDone,                          color: '#22c55e' },
        { label: 'Avg Rate',      value: `${avgRate}%`,                      color: '#f59e0b' },
        { label: 'Perfect Days',  value: perfect,                            color: '#a78bfa' },
      ].map(s => (
        <div key={s.label} className="rounded-xl px-4 py-3 text-center"
          style={{ background: 'var(--bg-muted)', boxShadow: 'var(--shadow-xs)' }}>
          <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-[10px] text-[--text-muted] mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">📊</div>
      <p className="font-semibold text-[--text-primary] mb-1">No activity yet</p>
      <p className="text-sm text-[--text-secondary] max-w-xs">
        Complete your first daily task and this chart will come alive. Start a roadmap and log in tomorrow!
      </p>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AnalyticsClient({ weeklyStats }: Props) {
  const [view, setView] = useState<'bar' | 'heatmap'>('bar')
  const hasData = weeklyStats.some(s => s.tasksPlanned > 0)

  return (
    <div className="space-y-4">
      {/* Chart card */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-[--text-primary]">14-Day Activity</h2>
            <p className="text-xs text-[--text-muted] mt-0.5">
              {hasData ? 'Hover bars or cells for details' : 'Complete tasks to see your chart'}
            </p>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-muted)' }}>
            {(['bar', 'heatmap'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} id={`chart-${v}-btn`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={view === v
                  ? { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-xs)' }
                  : { color: 'var(--text-muted)' }}>
                {v === 'bar' ? '📊 Bar' : '🗓 Heatmap'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary mini stats */}
        {hasData && <SummaryRow stats={weeklyStats} />}

        {/* Chart area */}
        <AnimatePresence mode="wait">
          {view === 'bar' && (
            <motion.div key="bar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {hasData ? <BarChart stats={weeklyStats} /> : <EmptyState />}
            </motion.div>
          )}
          {view === 'heatmap' && (
            <motion.div key="heatmap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {hasData ? <Heatmap stats={weeklyStats} /> : <EmptyState />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
