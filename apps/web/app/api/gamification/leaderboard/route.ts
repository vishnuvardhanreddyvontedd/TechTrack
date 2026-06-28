import { ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const leaders = await prisma.user.findMany({
    orderBy: [{ xp: 'desc' }, { currentStreak: 'desc' }],
    take: 25,
    select: { id: true, name: true, xp: true, level: true, currentStreak: true, avatarUrl: true },
  })
  return ok(leaders)
}
