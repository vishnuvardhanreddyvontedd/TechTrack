import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function POST() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const updated = await prisma.task.updateMany({
    where: { roadmap: { userId: session.userId }, status: 'SKIPPED', isComplete: false },
    data: { status: 'PENDING' },
  })
  return ok({ rescheduled: updated.count })
}
