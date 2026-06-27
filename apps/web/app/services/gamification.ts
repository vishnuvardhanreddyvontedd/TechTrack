// app/services/gamification.ts
// XP award calculation, level-up detection, and streak management.
// Pure functions — no DB calls. Takes current state, returns new state.
// The caller (server action / route handler) is responsible for persisting.

import { XP_PER_TASK, XP_STREAK_BONUS, calcLevel } from '@/app/types/index'
import type { XPEvent } from '@/app/types/index'

export interface GamificationInput {
  currentXP: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date | null
}

export interface GamificationResult {
  xpGained: number
  newXP: number
  newLevel: number
  newStreak: number
  newLongestStreak: number
  levelledUp: boolean
  streakBonus: boolean
  xpEvent: XPEvent
}

/**
 * computeTaskCompletion
 * Given the user's current gamification state, compute the result of completing one task.
 *
 * Streak rules:
 *   - null lastActivityDate → first ever activity → streak = 1
 *   - lastActivityDate is today → same-day task → streak unchanged
 *   - lastActivityDate is yesterday → consecutive day → streak + 1
 *   - anything older → streak broken → reset to 1
 */
export function computeTaskCompletion(input: GamificationInput): GamificationResult {
  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  const lastDate = input.lastActivityDate
    ? new Date(
        Date.UTC(
          input.lastActivityDate.getUTCFullYear(),
          input.lastActivityDate.getUTCMonth(),
          input.lastActivityDate.getUTCDate(),
        ),
      )
    : null

  const diffDays = lastDate
    ? Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    : null

  let newStreak = input.currentStreak
  if (diffDays === null || diffDays > 1) {
    newStreak = 1
  } else if (diffDays === 1) {
    newStreak = input.currentStreak + 1
  }
  // diffDays === 0 → same day, streak unchanged

  const streakBonus = newStreak > 1
  const xpGained = XP_PER_TASK + (streakBonus ? XP_STREAK_BONUS : 0)

  const prevLevel = calcLevel(input.currentXP)
  const newXP = input.currentXP + xpGained
  const newLevel = calcLevel(newXP)
  const levelledUp = newLevel > prevLevel
  const newLongestStreak = Math.max(input.longestStreak, newStreak)

  const xpEvent: XPEvent = {
    type: levelledUp ? 'LEVEL_UP' : 'TASK_COMPLETE',
    xpGained,
    newXP,
    newLevel,
    levelledUp,
  }

  return {
    xpGained,
    newXP,
    newLevel,
    newStreak,
    newLongestStreak,
    levelledUp,
    streakBonus,
    xpEvent,
  }
}

/**
 * getLevelTitle
 * Returns a display title for a given level number.
 * This adds personality to the level-up animation.
 */
export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1:  'Beginner',
    2:  'Explorer',
    3:  'Apprentice',
    4:  'Practitioner',
    5:  'Journeyman',
    6:  'Specialist',
    7:  'Expert',
    8:  'Master',
    9:  'Grandmaster',
    10: 'Legend',
  }
  if (level >= 10) return 'Legend'
  return titles[level] ?? `Level ${level}`
}

/**
 * getStreakMessage
 * Returns an encouraging message based on streak length.
 */
export function getStreakMessage(streak: number): string {
  if (streak >= 30) return '🏆 Legendary streak! One month strong!'
  if (streak >= 14) return '🔥 Two week warrior!'
  if (streak >= 7)  return '⚡ One week streak! Keep the fire!'
  if (streak >= 3)  return '🔥 You\'re on a roll!'
  if (streak === 2) return '✨ Two in a row! Build the habit!'
  return '🌟 Streak started! Come back tomorrow!'
}
