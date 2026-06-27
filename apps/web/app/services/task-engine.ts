// app/services/task-engine.ts
// Core business logic for the daily planning & smart rescheduling system.
//
// Design:
//   - All functions are pure async, accepting prisma as a parameter so they're
//     testable in isolation (dependency injection via parameter, not import).
//   - No direct HTTP concerns here — that belongs in route handlers / actions.
//   - The DailyPlan model is the scheduling anchor: one row per roadmap per day.

import type { PrismaClient } from '@/app/generated/prisma/client'

export const MAX_TASKS_PER_DAY = 5 // guard against overwhelm

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the UTC midnight Date for a given local-ish date */
export function toDateOnly(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

/** Returns YYYY-MM-DD string for display */
export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// ─── Today's Plan ─────────────────────────────────────────────────────────────

/**
 * getOrCreateTodaysPlan
 *
 * Idempotent: calling it multiple times on the same day returns the same plan.
 *
 * Algorithm:
 *  1. If a DailyPlan for today already exists → return it.
 *  2. Otherwise:
 *     a. Find yesterday's plan; mark it SKIPPED if it had incomplete tasks.
 *     b. Collect carry-over tasks (incomplete from yesterday, up to MAX cap).
 *     c. Fill remaining slots with the next un-scheduled roadmap tasks.
 *     d. Persist the new DailyPlan + DailyPlanTask rows.
 *     e. Return the created plan.
 */
export async function getOrCreateTodaysPlan(
  prisma: PrismaClient,
  roadmapId: string,
  userId: string,
) {
  const today = toDateOnly()

  // 1. Check if today's plan already exists
  const existing = await prisma.dailyPlan.findUnique({
    where: { roadmapId_date: { roadmapId, date: today } },
    include: {
      tasks: {
        include: {
          task: { include: { dayTemplate: true } },
        },
      },
    },
  })
  if (existing) return existing

  // 2. Identify yesterday's plan and mark it SKIPPED if needed
  const yesterday = new Date(today)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)

  const yesterdayPlan = await prisma.dailyPlan.findUnique({
    where: { roadmapId_date: { roadmapId, date: yesterday } },
    include: {
      tasks: {
        include: { task: true },
      },
    },
  })

  // Collect carry-over task IDs (incomplete from yesterday)
  const carryoverTaskIds: string[] = []
  if (yesterdayPlan) {
    const incomplete = yesterdayPlan.tasks.filter((pt) => !pt.task.isComplete)
    carryoverTaskIds.push(...incomplete.map((pt) => pt.taskId))

    // Mark yesterday SKIPPED if all were incomplete
    if (incomplete.length === yesterdayPlan.tasks.length && yesterdayPlan.tasks.length > 0) {
      await prisma.dailyPlan.update({
        where: { id: yesterdayPlan.id },
        data: { status: 'SKIPPED' },
      })
    }
  }

  // 3. Find the last planned day number (to know where to continue curriculum)
  const lastPlan = await prisma.dailyPlan.findFirst({
    where: { roadmapId },
    orderBy: { plannedDay: 'desc' },
  })
  const nextPlannedDay = (lastPlan?.plannedDay ?? 0) + 1

  // 4. Find all incomplete roadmap tasks NOT yet in any daily plan
  //    (i.e., freshly carried-over ones and brand new ones)
  const alreadyScheduledTaskIds = await prisma.dailyPlanTask
    .findMany({
      where: { dailyPlan: { roadmapId } },
      select: { taskId: true },
    })
    .then((rows) => rows.map((r) => r.taskId))

  // Exclude tasks already scheduled (unless they're carryover)
  const unscheduledTasks = await prisma.task.findMany({
    where: {
      roadmapId,
      isComplete: false,
      id: { notIn: alreadyScheduledTaskIds.filter((id) => !carryoverTaskIds.includes(id)) },
    },
    include: { dayTemplate: true },
    orderBy: { dayNumber: 'asc' },
    take: MAX_TASKS_PER_DAY - carryoverTaskIds.length,
  })

  // 5. Build the combined slot list (carryover first, then new tasks)
  const totalSlots = Math.min(
    carryoverTaskIds.length + unscheduledTasks.length,
    MAX_TASKS_PER_DAY,
  )
  const newTaskIds = unscheduledTasks.slice(0, totalSlots - carryoverTaskIds.length).map((t) => t.id)

  // 6. Create the DailyPlan + DailyPlanTask rows in one transaction
  const plan = await prisma.$transaction(async (tx) => {
    const newPlan = await tx.dailyPlan.create({
      data: {
        roadmapId,
        date: today,
        plannedDay: nextPlannedDay,
        status: 'PENDING',
        tasks: {
          create: [
            ...carryoverTaskIds.map((taskId) => ({ taskId, isCarryover: true })),
            ...newTaskIds.map((taskId) => ({ taskId, isCarryover: false })),
          ],
        },
      },
      include: {
        tasks: {
          include: {
            task: { include: { dayTemplate: true } },
          },
        },
      },
    })
    return newPlan
  })

  return plan
}

// ─── Plan Status Update ───────────────────────────────────────────────────────

/**
 * updatePlanStatus
 * Called after each task completion to keep plan status in sync.
 */
export async function updatePlanStatus(
  prisma: PrismaClient,
  roadmapId: string,
) {
  const today = toDateOnly()
  const plan = await prisma.dailyPlan.findUnique({
    where: { roadmapId_date: { roadmapId, date: today } },
    include: { tasks: { include: { task: true } } },
  })
  if (!plan) return

  const total = plan.tasks.length
  const done = plan.tasks.filter((pt) => pt.task.isComplete).length

  let status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'PENDING'
  if (done === total && total > 0) status = 'COMPLETED'
  else if (done > 0) status = 'IN_PROGRESS'

  await prisma.dailyPlan.update({
    where: { id: plan.id },
    data: { status },
  })
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface WeeklyStats {
  date: string        // YYYY-MM-DD
  tasksCompleted: number
  tasksPlanned: number
  completionRate: number
}

/**
 * getWeeklyStats
 * Returns per-day stats for the last N days across ALL user roadmaps.
 */
export async function getWeeklyStats(
  prisma: PrismaClient,
  userId: string,
  days = 7,
): Promise<WeeklyStats[]> {
  const end = toDateOnly()
  const start = new Date(end)
  start.setUTCDate(start.getUTCDate() - (days - 1))

  const plans = await prisma.dailyPlan.findMany({
    where: {
      roadmap: { userId },
      date: { gte: start, lte: end },
    },
    include: {
      tasks: { include: { task: true } },
    },
    orderBy: { date: 'asc' },
  })

  // Build a map of date → aggregate stats
  const statsMap = new Map<string, { planned: number; completed: number }>()

  // Pre-fill all N days with zeros
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setUTCDate(d.getUTCDate() + i)
    statsMap.set(formatDate(d), { planned: 0, completed: 0 })
  }

  for (const plan of plans) {
    const key = formatDate(plan.date)
    const entry = statsMap.get(key) ?? { planned: 0, completed: 0 }
    entry.planned += plan.tasks.length
    entry.completed += plan.tasks.filter((pt) => pt.task.isComplete).length
    statsMap.set(key, entry)
  }

  return Array.from(statsMap.entries()).map(([date, { planned, completed }]) => ({
    date,
    tasksPlanned: planned,
    tasksCompleted: completed,
    completionRate: planned > 0 ? Math.round((completed / planned) * 100) : 0,
  }))
}

// ─── Pacing & Adaptive Difficulty ─────────────────────────────────────────────

export type PacingStatus = 'ahead' | 'on_track' | 'behind'
export type DifficultySignal = 'ease_off' | 'maintain' | 'increase'

/**
 * computePacingStatus
 * Compares tasks completed vs days elapsed since roadmap start.
 */
export function computePacingStatus(
  completedTasks: number,
  totalTasks: number,
  startDate: Date,
): PacingStatus {
  const daysElapsed = Math.max(
    1,
    Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
  )
  const expectedByNow = Math.min(daysElapsed, totalTasks)
  const ratio = completedTasks / expectedByNow

  if (ratio >= 1.1) return 'ahead'
  if (ratio >= 0.75) return 'on_track'
  return 'behind'
}

/**
 * computeAdaptiveDifficulty
 * Reads last 7 days of completion rate.
 * < 40% consistent → ease_off
 * > 80% consistent → increase
 */
export function computeAdaptiveDifficulty(weeklyStats: WeeklyStats[]): DifficultySignal {
  if (weeklyStats.length === 0) return 'maintain'
  const avg =
    weeklyStats.reduce((sum, s) => sum + s.completionRate, 0) / weeklyStats.length
  if (avg < 40) return 'ease_off'
  if (avg > 80) return 'increase'
  return 'maintain'
}
