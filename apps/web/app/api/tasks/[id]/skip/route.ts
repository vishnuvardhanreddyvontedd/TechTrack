import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const { id } = await params

  const task = await prisma.task.findFirst({ where: { id, roadmap: { userId: session.userId } } })
  if (!task) return fail('Task not found', 404)

  const updated = await prisma.task.update({
    where: { id },
    data: { status: 'SKIPPED' },
  })
  return ok(updated)
}
