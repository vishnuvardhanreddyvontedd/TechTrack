import { ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: [{ xp: 'desc' }, { currentStreak: 'desc' }],
    take: 50,
    select: { id: true, name: true, xp: true, level: true, currentStreak: true },
  })
  return ok(users)
}
