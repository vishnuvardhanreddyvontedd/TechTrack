import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function POST() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const task = await prisma.task.findFirst({
    where: { roadmap: { userId: session.userId, isActive: true }, isComplete: false },
    orderBy: [{ dayNumber: 'asc' }, { createdAt: 'asc' }],
  })

  return ok({
    task,
    generated: !task,
    fallback: task ? null : 'Review your latest roadmap module and complete one 45-minute practice exercise.',
  })
}
