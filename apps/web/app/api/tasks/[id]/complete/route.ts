import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'
import { calcLevel, XP_PER_TASK } from '@/app/types/index'
import { updatePlanStatus } from '@/app/services/task-engine'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const { id } = await params

  const task = await prisma.task.findFirst({ where: { id, roadmap: { userId: session.userId } } })
  if (!task) return fail('Task not found', 404)
  if (task.isComplete) return ok({ alreadyComplete: true, task })

  const xp = task.xpReward || XP_PER_TASK
  const result = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: { id },
      data: { isComplete: true, status: 'COMPLETED', completedAt: new Date(), xpAwarded: xp },
    })
    await tx.taskCompletion.upsert({
      where: { userId_taskId: { userId: session.userId, taskId: id } },
      create: { userId: session.userId, taskId: id, xpAwarded: xp },
      update: { xpAwarded: xp, completedAt: new Date() },
    })
    const user = await tx.user.findUniqueOrThrow({ where: { id: session.userId } })
    const newXP = user.xp + xp
    const newLevel = calcLevel(newXP)
    const updatedUser = await tx.user.update({
      where: { id: session.userId },
      data: { xp: newXP, level: newLevel, lastActivityDate: new Date() },
      select: { xp: true, level: true },
    })
    await tx.xPTransaction.create({
      data: { userId: session.userId, amount: xp, reason: 'TASK_COMPLETE', sourceType: 'task', sourceId: id },
    })
    return { task: updatedTask, user: updatedUser }
  })

  await updatePlanStatus(prisma, task.roadmapId)
  return ok(result)
}
