import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const RescheduleSchema = z.object({
  taskId: z.string().min(1),
  dayNumber: z.number().int().min(1),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const parsed = await readJson(request, RescheduleSchema)
  if (parsed instanceof Response) return parsed

  const task = await prisma.task.findFirst({ where: { id: parsed.taskId, roadmap: { userId: session.userId } } })
  if (!task) return fail('Task not found', 404)

  const updated = await prisma.task.update({
    where: { id: parsed.taskId },
    data: { dayNumber: parsed.dayNumber, status: 'RESCHEDULED' },
  })
  return ok(updated)
}
