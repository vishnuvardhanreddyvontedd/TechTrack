import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function POST() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const task = await prisma.task.findFirst({
    where: { roadmap: { userId: session.userId, isActive: true }, isComplete: false },
    orderBy: { dayNumber: 'asc' },
  })
  return ok({ task, source: 'rule-based-fallback' })
}
