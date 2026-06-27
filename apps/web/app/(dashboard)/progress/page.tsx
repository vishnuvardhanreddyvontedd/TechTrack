import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProgressPage() {
  const session = await getSession()
  const user = session
    ? await prisma.user.findUnique({ where: { id: session.userId }, include: { userBadges: { include: { badge: true } } } })
    : null

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Progress Analytics</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="card p-5"><p className="text-sm text-white/55">XP</p><p className="mt-2 text-2xl font-bold">{user?.xp ?? 0}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">Level</p><p className="mt-2 text-2xl font-bold">{user?.level ?? 1}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">Streak</p><p className="mt-2 text-2xl font-bold">{user?.currentStreak ?? 0}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">Badges</p><p className="mt-2 text-2xl font-bold">{user?.userBadges.length ?? 0}</p></div>
      </div>
    </main>
  )
}
