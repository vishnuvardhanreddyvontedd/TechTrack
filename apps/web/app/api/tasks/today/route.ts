import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const roadmap = await prisma.roadmap.findFirst({
    where: { userId: session.userId, isActive: true },
    include: {
      tasks: {
        where: { isComplete: false },
        orderBy: [{ dayNumber: 'asc' }, { createdAt: 'asc' }],
        take: 3,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return ok({ date: new Date().toISOString(), roadmapId: roadmap?.id ?? null, tasks: roadmap?.tasks ?? [] })
}
