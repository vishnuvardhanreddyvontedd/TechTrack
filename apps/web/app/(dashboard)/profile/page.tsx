// app/(dashboard)/profile/page.tsx
// User profile — stats history and account info.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { calcLevel, xpToNextLevel } from '@/app/types/index'
import { ProgressBar } from '@/app/components/ui/ProgressBar'
import { Badge } from '@/app/components/ui/Badge'
import AvatarUpload from '@/app/components/profile/AvatarUpload'

export const metadata: Metadata = { title: 'Profile' }
export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      roadmaps: {
        include: {
          template: true,
          tasks: { select: { isComplete: true, xpAwarded: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  // User not in DB → stale session. Clear cookie to avoid redirect loop.
  if (!user) redirect('/api/auth/logout')

  const level             = calcLevel(user.xp)
  const { needed, current } = xpToNextLevel(user.xp, level)
  const totalTasksDone    = user.roadmaps.flatMap((r) => r.tasks).filter((t) => t.isComplete).length
  const now               = new Date()
  const memberDays        = Math.floor((now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <AvatarUpload currentAvatarUrl={user.avatarUrl} userName={user.name} />
        <div>
          <h1 className="text-2xl font-bold text-[--text-primary]">{user.name}</h1>
          <p className="text-sm text-[--text-secondary]">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="gold">Level {level}</Badge>
            {user.currentStreak > 0 && (
              <Badge variant="warning">🔥 {user.currentStreak}-day streak</Badge>
            )}
          </div>
        </div>
      </div>

      {/* XP card */}
        <div className="card p-5">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-sm font-semibold text-[--text-primary]">Experience Points</h2>
          <span className="gradient-text-gold font-extrabold text-lg">{user.xp.toLocaleString()} XP</span>
        </div>
        <ProgressBar value={current} max={needed} height={8} color="gold" />
        <p className="text-xs text-[--text-muted] mt-2">{needed - current} XP to Level {level + 1}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Tasks Completed', value: totalTasksDone, icon: '✅' },
          { label: 'Longest Streak',  value: `${user.longestStreak} days`, icon: '🏆' },
          { label: 'Roadmaps',        value: user.roadmaps.length, icon: '🗺️' },
          { label: 'Member For',      value: `${memberDays} days`, icon: '📅' },
        ].map((s) => (
            <div key={s.label} className="card p-4 flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label={s.label}>{s.icon}</span>
            <div>
              <p className="font-bold text-[--text-primary]">{s.value}</p>
              <p className="text-xs text-[--text-muted]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap history */}
      <div>
        <h2 className="text-sm font-semibold text-[--text-primary] mb-3">All Roadmaps</h2>
        <div className="space-y-3">
          {user.roadmaps.map((r) => {
            const total = r.tasks.length
            const done  = r.tasks.filter((t) => t.isComplete).length
            const pct   = total > 0 ? Math.round((done / total) * 100) : 0
            // Template is null for AI-generated roadmaps
            const icon  = r.template?.iconEmoji ?? '✨'
            const title = r.title ?? r.template?.title ?? r.customGoal ?? 'My Roadmap'
              return (
                <div key={r.id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{icon}</span>
                  <span className="font-medium text-[--text-primary] flex-1 truncate">{title}</span>
                  <Badge variant={pct === 100 ? 'success' : r.isActive ? 'brand' : 'muted'}>
                    {pct === 100 ? 'Complete' : r.isActive ? 'Active' : 'Archived'}
                  </Badge>
                </div>
                <ProgressBar value={pct} height={5} color={pct === 100 ? 'green' : 'brand'} animated={false} />
                <p className="text-xs text-[--text-muted] mt-1.5">{done}/{total} tasks</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
