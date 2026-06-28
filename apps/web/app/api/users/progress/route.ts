import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const [user, completedTasks, badges] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { xp: true, level: true, currentStreak: true, longestStreak: true },
    }),
    prisma.taskCompletion.count({ where: { userId: session.userId } }),
    prisma.userBadge.findMany({ where: { userId: session.userId }, include: { badge: true } }),
  ])

  if (!user) return fail('User not found', 404)
  return ok({ ...user, completedTasks, badges })
}
