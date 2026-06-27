import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { xp: true, level: true, currentStreak: true, longestStreak: true, userBadges: { include: { badge: true } } },
  })
  return ok(user)
}
