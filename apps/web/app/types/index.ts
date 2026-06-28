// types/index.ts
// Shared TypeScript interfaces used across the application.
// These mirror Prisma model shapes but are safe for client-side use
// (no passwordHash, no internal DB fields).

import type { Category } from '@/app/generated/prisma/client'

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string
  email: string
  xp: number
  level: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date | null
  createdAt: Date
}

// ─── Roadmap Templates ────────────────────────────────────────────────────────

export interface RoadmapTemplate {
  id: string
  title: string
  slug: string
  description: string
  category: Category
  totalDays: number
  iconEmoji: string
}

export interface DayTemplate {
  id: string
  templateId: string
  dayNumber: number
  title: string
  description: string
  estimatedMinutes: number
  resources: string[]
}

// ─── User Roadmap Instances ───────────────────────────────────────────────────

export interface Roadmap {
  id: string
  userId: string
  templateId: string
  isActive: boolean
  startDate: Date
  completedAt: Date | null
  createdAt: Date
  // Joined
  template?: RoadmapTemplate
  tasks?: Task[]
}

export interface Task {
  id: string
  roadmapId: string
  dayTemplateId: string
  dayNumber: number
  isComplete: boolean
  completedAt: Date | null
  xpAwarded: number
  // Joined
  dayTemplate?: DayTemplate
}

// ─── Daily Planning Engine ────────────────────────────────────────────────────

export type PlanStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED'

export interface DailyPlan {
  id: string
  roadmapId: string
  date: Date
  plannedDay: number
  status: PlanStatus
  createdAt: Date
  updatedAt: Date
  // Joined
  tasks?: DailyPlanTask[]
}

export interface DailyPlanTask {
  id: string
  dailyPlanId: string
  taskId: string
  isCarryover: boolean
  // Joined
  task?: Task
}

/**
 * Flat shape used in the dashboard's TodayTaskList component.
 * Pre-flattened on the server to avoid deep prop drilling.
 */
export interface PlanTaskFlat {
  taskId: string
  dayNumber: number
  title: string
  description: string
  estimatedMinutes: number
  isComplete: boolean
  isCarryover: boolean
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export interface XPEvent {
  type: 'TASK_COMPLETE' | 'STREAK_BONUS' | 'LEVEL_UP'
  xpGained: number
  newXP: number
  newLevel: number
  levelledUp: boolean
}

// XP required to reach each level (level = index + 1)
export const XP_PER_LEVEL = [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5800, 8000]
export const XP_PER_TASK = 25
export const XP_STREAK_BONUS = 10 // extra XP when on a streak

export function calcLevel(xp: number): number {
  let level = 1
  for (let i = 0; i < XP_PER_LEVEL.length; i++) {
    if (xp >= XP_PER_LEVEL[i]) level = i + 1
    else break
  }
  return level
}

export function xpToNextLevel(xp: number, level: number): { needed: number; current: number } {
  const currentFloor = XP_PER_LEVEL[level - 1] ?? 0
  const nextFloor = XP_PER_LEVEL[level] ?? XP_PER_LEVEL[XP_PER_LEVEL.length - 1]
  return {
    needed: nextFloor - currentFloor,
    current: xp - currentFloor,
  }
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}
