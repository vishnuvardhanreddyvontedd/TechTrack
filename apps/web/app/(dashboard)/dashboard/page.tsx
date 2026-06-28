// app/(dashboard)/dashboard/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { calcLevel, xpToNextLevel } from '@/app/types/index'
import { ProgressBar } from '@/app/components/ui/ProgressBar'
import { getOrCreateTodaysPlan, computePacingStatus } from '@/app/services/task-engine'

// Derive the plan type from the function's return so we never go out of sync.
type TodaysPlan = Awaited<ReturnType<typeof getOrCreateTodaysPlan>>
type PlanTask  = NonNullable<TodaysPlan['tasks']>[number]
import TodayTaskList from '@/app/components/dashboard/TodayTaskList'

export const metadata: Metadata = { title: 'Dashboard' }

function getRoadmapTitle(r: { title: string | null; customGoal: string | null; template: { title: string } | null }) {
  return r.title ?? r.template?.title ?? r.customGoal ?? 'My Roadmap'
}
function getRoadmapIcon(r: { template: { iconEmoji: string } | null }) {
  return r.template?.iconEmoji ?? '✨'
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, xp: true, level: true, currentStreak: true, longestStreak: true },
  })
  // User not in DB → stale session. Clear cookie first to avoid proxy ↔ page redirect loop.
  if (!user) redirect('/api/auth/logout')

  const roadmaps = await prisma.roadmap.findMany({
    where: { userId: session.userId, isActive: true },
    include: { template: true, tasks: { select: { isComplete: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const myRoadmaps    = roadmaps.filter((r) => r.customGoal)
  const templateBased = roadmaps.filter((r) => !r.customGoal)

  let todaysPlan = null
  const primaryRoadmap = roadmaps[0] ?? null
  if (primaryRoadmap) {
    try { todaysPlan = await getOrCreateTodaysPlan(prisma, primaryRoadmap.id, session.userId) }
    catch { /* first login */ }
  }

  const level = calcLevel(user.xp)
  const { needed, current } = xpToNextLevel(user.xp, level)
  const xpPct = needed > 0 ? Math.round((current / needed) * 100) : 0

  const firstName = user.name.split(' ')[0]

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">

      {/* ── Hero Welcome ── */}
      <div className="relative overflow-hidden rounded-3xl p-8"
        style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.1) 50%, rgba(19,19,26,0) 100%)', boxShadow: 'var(--shadow-md)' }}>
        {/* Ambient glow */}
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-accent-600/15 blur-3xl" />

        <div className="relative flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-[--text-muted] mb-1 font-medium">Welcome back</p>
            <h1 className="text-3xl font-bold text-[--text-primary] mb-2">
              {firstName} <span className="animate-float inline-block">👋</span>
            </h1>
            <p className="text-[--text-secondary] text-sm">
              {user.currentStreak > 0
                ? <><span className="text-orange-400 font-semibold">🔥 {user.currentStreak}-day streak</span> — keep the momentum!</>
                : 'Complete a task today to start your streak!'}
            </p>
          </div>
          <Link href="/create" id="create-roadmap-hero-btn"
            className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 flex-shrink-0">
            <span>✨</span> New Roadmap
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total XP',  value: user.xp.toLocaleString(), icon: '⚡', color: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)' },
          { label: 'Level',     value: `Lv.${level}`,            icon: '🏆', color: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
          { label: 'Streak',    value: `${user.currentStreak}d`, icon: '🔥', color: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)' },
          { label: 'Best',      value: `${user.longestStreak}d`, icon: '📈', color: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.2)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: s.color, boxShadow: `var(--shadow-sm), inset 0 0 0 1px ${s.border}` }}>
            <div className="text-2xl mb-3">{s.icon}</div>
            <p className="text-2xl font-bold text-[--text-primary] leading-none">{s.value}</p>
            <p className="text-xs text-[--text-muted] mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── XP Progress ── */}
      <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-600/5 blur-2xl" />
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-[--text-primary]">Level {level} → {level + 1}</p>
            <p className="text-xs text-[--text-muted] mt-0.5">{current} / {needed} XP</p>
          </div>
          <span className="gradient-text-gold text-2xl font-extrabold">Lv.{level}</span>
        </div>
        <ProgressBar value={xpPct} height={8} color="gold" />
      </div>

      {/* ── Today's Tasks ── */}
      {primaryRoadmap && todaysPlan && todaysPlan.tasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[--text-primary]">Today&apos;s Tasks</h2>
              <p className="text-xs text-[--text-muted] mt-0.5">
                {getRoadmapIcon(primaryRoadmap)} {getRoadmapTitle(primaryRoadmap)}
              </p>
            </div>
            <Link href={`/roadmap/${primaryRoadmap.id}`}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
              View roadmap →
            </Link>
          </div>
          <TodayTaskList
            roadmapId={primaryRoadmap.id}
            planTasks={todaysPlan.tasks.map((pt: PlanTask) => ({
              taskId:           pt.task.id,
              dayNumber:        pt.task.dayNumber,
              title:            pt.task.dayTemplate?.title ?? pt.task.customTitle ?? 'Task',
              description:      pt.task.dayTemplate?.description ?? pt.task.customDesc ?? '',
              estimatedMinutes: pt.task.dayTemplate?.estimatedMinutes ?? pt.task.estimatedMinutes,
              isComplete:       pt.task.isComplete,
              isCarryover:      pt.isCarryover,
            }))}
          />
        </section>
      )}

      {/* ── My Roadmaps ── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[--text-primary]">My Roadmaps</h2>
            <p className="text-xs text-[--text-muted] mt-0.5">AI-generated for your goals</p>
          </div>
          <Link href="/create" id="create-custom-btn" className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors">
            + Create
          </Link>
        </div>

        {myRoadmaps.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="w-14 h-14 rounded-2xl gradient-brand mx-auto flex items-center justify-center text-2xl mb-4 glow-brand">✨</div>
            <p className="font-semibold text-[--text-primary] mb-1">No custom roadmaps yet</p>
            <p className="text-sm text-[--text-secondary] mb-5">Enter any goal and AI will build your personalised plan.</p>
            <Link href="/create" id="create-first-custom-btn"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              ✨ Generate My Roadmap
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {myRoadmaps.map((r) => <RoadmapCard key={r.id} roadmap={r} />)}
          </div>
        )}
      </section>

      {/* ── Template Roadmaps ── */}
      {templateBased.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[--text-primary]">From Templates</h2>
            <p className="text-xs text-[--text-muted] mt-0.5">Structured career paths</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {templateBased.map((r) => <RoadmapCard key={r.id} roadmap={r} />)}
          </div>
        </section>
      )}

      {/* ── Empty ── */}
      {roadmaps.length === 0 && (
        <div className="rounded-3xl p-16 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(124,58,237,0.05))', boxShadow: 'var(--shadow-md)' }}>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-brand-600/15 blur-3xl" />
          <div className="relative">
            <div className="text-6xl mb-5">🗺️</div>
            <p className="text-2xl font-bold text-[--text-primary] mb-2">Build your first roadmap</p>
            <p className="text-[--text-secondary] mb-8 max-w-sm mx-auto">
              Enter any career goal and get a personalised day-by-day learning plan in seconds.
            </p>
            <Link href="/create" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base" id="first-roadmap-btn">
              ✨ Create My Roadmap
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Roadmap Card ─────────────────────────────────────────────────────────────
type RoadmapWithRelations = {
  id: string; title: string | null; customGoal: string | null; startDate: Date
  tasks: { isComplete: boolean }[]
  template: { title: string; iconEmoji: string } | null
}

function RoadmapCard({ roadmap: r }: { roadmap: RoadmapWithRelations }) {
  const total  = r.tasks.length
  const done   = r.tasks.filter((t) => t.isComplete).length
  const pct    = total > 0 ? Math.round((done / total) * 100) : 0
  const pacing = computePacingStatus(done, total, r.startDate)
  const title  = getRoadmapTitle(r)
  const icon   = getRoadmapIcon(r)
  const isCustom = !!r.customGoal

  return (
    <Link href={`/roadmap/${r.id}`} className="card-hover block p-5 group" id={`roadmap-${r.id}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${isCustom ? 'gradient-brand glow-brand' : 'bg-[--bg-muted]'}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[--text-primary] text-sm truncate group-hover:text-brand-400 transition-colors">{title}</p>
          <p className="text-xs text-[--text-muted] mt-0.5">{done}/{total} tasks</p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-sm font-bold ${pct === 100 ? 'text-green-400' : 'text-brand-400'}`}>{pct}%</p>
          {pacing === 'behind' && <p className="text-[10px] text-orange-400 mt-0.5">Behind</p>}
          {pacing === 'ahead'  && <p className="text-[10px] text-green-400 mt-0.5">Ahead!</p>}
        </div>
      </div>
      <ProgressBar value={pct} height={4} color={pct === 100 ? 'green' : 'brand'} />
    </Link>
  )
}
