import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'
import { getOrCreateTodaysPlan } from '@/app/services/task-engine'

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const roadmap = await prisma.roadmap.findFirst({
    where: { userId: session.userId, isActive: true },
    orderBy: { createdAt: 'desc' },
  })
  if (!roadmap) return ok({ plan: null, tasks: [] })

  const plan = await getOrCreateTodaysPlan(prisma, roadmap.id, session.userId)
  return ok(plan)
}
