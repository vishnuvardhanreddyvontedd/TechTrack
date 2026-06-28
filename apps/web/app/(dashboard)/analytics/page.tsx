// app/(dashboard)/analytics/page.tsx
// Weekly progress analytics — server renders stats, client renders charts.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { getWeeklyStats, computeAdaptiveDifficulty } from '@/app/services/task-engine'
import { Badge } from '@/app/components/ui/Badge'
import AnalyticsClient from './AnalyticsClient'

export const metadata: Metadata = { title: 'Analytics' }

export default async function AnalyticsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      xp: true, level: true,
      currentStreak: true, longestStreak: true,
      createdAt: true,
    },
  })
  if (!user) redirect('/login')

  // Load 14-day stats
  const weeklyStats = await getWeeklyStats(prisma, session.userId, 14)
  const difficultySignal = computeAdaptiveDifficulty(weeklyStats.slice(-7))

  // Load all roadmaps with task stats
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId: session.userId },
    include: {
      template: true,
      tasks: { select: { isComplete: true, completedAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalTasksComplete = roadmaps.flatMap((r) => r.tasks).filter((t) => t.isComplete).length
  const totalTasks         = roadmaps.flatMap((r) => r.tasks).length
  const overallRate        = totalTasks > 0 ? Math.round((totalTasksComplete / totalTasks) * 100) : 0
  // eslint-disable-next-line react-hooks/purity
  const memberDays         = Math.max(1, Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)))

  // Helper: resolve display fields for both template-based and custom roadmaps
  function roadmapIcon(r: { template: { iconEmoji: string } | null; customGoal: string | null }) {
    return r.template?.iconEmoji ?? '✨'
  }
  function roadmapTitle(r: { template: { title: string } | null; title: string | null; customGoal: string | null }) {
    return r.template?.title ?? r.title ?? r.customGoal ?? 'My Roadmap'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[--text-primary]">Analytics</h1>
          <p className="text-sm text-[--text-muted] mt-0.5">Your last 14 days of progress</p>
        </div>
        <Badge
          variant={
            difficultySignal === 'increase' ? 'success'
            : difficultySignal === 'ease_off' ? 'warning'
            : 'brand'
          }
        >
          {difficultySignal === 'increase' ? '⚡ On fire — keep pushing!'
           : difficultySignal === 'ease_off' ? '⚠️ Ease off — you\'re doing too much'
           : '✅ On track — steady pace'}
        </Badge>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Done',      value: totalTasksComplete,        icon: '✅' },
          { label: 'Completion Rate', value: `${overallRate}%`,         icon: '📊' },
          { label: 'Current Streak',  value: `${user.currentStreak}d`,  icon: '🔥' },
          { label: 'Days Active',     value: memberDays,                 icon: '📅' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="text-2xl mb-2" role="img" aria-label={kpi.label}>{kpi.icon}</div>
            <p className="text-xl font-bold text-[--text-primary]">{kpi.value}</p>
            <p className="text-xs text-[--text-muted] mt-0.5">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart — client component */}
      <AnalyticsClient weeklyStats={weeklyStats} />

      {/* Per-roadmap breakdown */}
      <div>
        <h2 className="text-sm font-semibold text-[--text-primary] uppercase tracking-wider mb-4">
          Roadmap Breakdown
        </h2>
        <div className="space-y-3">
          {roadmaps.map((r) => {
            const total = r.tasks.length
            const done  = r.tasks.filter((t) => t.isComplete).length
            const pct   = total > 0 ? Math.round((done / total) * 100) : 0
            return (
              <div key={r.id} className="rounded-xl p-4" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{roadmapIcon(r)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[--text-primary] text-sm truncate">{roadmapTitle(r)}</p>
                    <p className="text-xs text-[--text-muted]">{done} / {total} tasks complete</p>
                  </div>
                  <Badge variant={pct === 100 ? 'success' : r.isActive ? 'brand' : 'muted'}>
                    {pct}%
                  </Badge>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-[--bg-muted] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : 'bg-brand-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}
