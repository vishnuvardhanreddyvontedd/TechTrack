import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'
import { computeTaskCompletion } from '@/app/services/gamification'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const { id } = await params

  const task = await prisma.task.findFirst({
    where: { id, roadmap: { userId: session.userId } },
  })
  if (!task) return fail('Task not found', 404)
  if (task.isComplete) return ok({ task, alreadyCompleted: true })

  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) return fail('Unauthorized', 401)

  const result = computeTaskCompletion({
    currentXP: user.xp,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    lastActivityDate: user.lastActivityDate,
  })

  const updated = await prisma.$transaction(async (tx) => {
    const completedTask = await tx.task.update({
      where: { id },
      data: { isComplete: true, status: 'COMPLETED', completedAt: new Date(), xpAwarded: result.xpGained },
    })
    await tx.taskCompletion.create({
      data: { userId: session.userId, taskId: id, xpAwarded: result.xpGained },
    })
    await tx.xPTransaction.create({
      data: { userId: session.userId, amount: result.xpGained, reason: 'TASK_COMPLETED', metadata: { taskId: id } },
    })
    await tx.user.update({
      where: { id: session.userId },
      data: {
        xp: result.newXP,
        level: result.newLevel,
        currentStreak: result.newStreak,
        longestStreak: result.newLongestStreak,
        lastActivityDate: new Date(),
        streak: {
          upsert: {
            create: { currentCount: result.newStreak, longestCount: result.newLongestStreak, lastCompletedAt: new Date() },
            update: { currentCount: result.newStreak, longestCount: result.newLongestStreak, lastCompletedAt: new Date() },
          },
        },
      },
    })
    return completedTask
  })

  return ok({ task: updated, gamification: result })
}
