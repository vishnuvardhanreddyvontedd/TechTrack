'use server'
// app/actions/tasks.ts
// Server Action: mark a task complete, award XP, update streak, update daily plan status.

import { revalidatePath } from 'next/cache'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { computeTaskCompletion } from '@/app/services/gamification'
import { updatePlanStatus } from '@/app/services/task-engine'
import type { XPEvent } from '@/app/types/index'

export async function completeTask(taskId: string): Promise<XPEvent | { error: string }> {
  const session = await getSession()
  if (!session) return { error: 'Unauthorized' }

  // Verify task belongs to this user and is not already complete
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      roadmap: { userId: session.userId },
      isComplete: false,
    },
    include: { roadmap: true },
  })

  if (!task) return { error: 'Task not found or already complete.' }

  // Load current user gamification state
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      xp: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
      lastActivityDate: true,
    },
  })
  if (!user) return { error: 'User not found.' }

  // Compute new XP, level, streak using the service layer (pure function)
  const result = computeTaskCompletion({
    currentXP: user.xp,
    currentStreak: user.currentStreak,
    longestStreak: user.longestStreak,
    lastActivityDate: user.lastActivityDate,
  })

  const now = new Date()

  // Atomic DB update: mark task complete + update user stats
  await prisma.$transaction([
    prisma.task.update({
      where: { id: taskId },
      data: {
        isComplete: true,
        completedAt: now,
        xpAwarded: result.xpGained,
      },
    }),
    prisma.user.update({
      where: { id: session.userId },
      data: {
        xp: result.newXP,
        level: result.newLevel,
        currentStreak: result.newStreak,
        longestStreak: result.newLongestStreak,
        lastActivityDate: now,
      },
    }),
  ])

  // Update the DailyPlan status (non-atomic — soft side-effect, ok to fail silently)
  try {
    await updatePlanStatus(prisma, task.roadmapId)
  } catch {
    // DailyPlan may not exist yet (users who started before this feature) — safe to ignore
  }

  // Revalidate the roadmap detail page and dashboard so data refreshes
  revalidatePath(`/roadmap/${task.roadmapId}`)
  revalidatePath('/dashboard')

  return result.xpEvent
}
