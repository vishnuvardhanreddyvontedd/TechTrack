'use client'
// app/components/dashboard/TodayTaskList.tsx
// Client island: renders today's tasks with completion and carryover indicators.

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskItem from '@/app/components/roadmap/TaskItem'
import CompletionAnimation from '@/app/components/roadmap/CompletionAnimation'
import type { XPEvent, PlanTaskFlat } from '@/app/types/index'

interface Props {
  roadmapId: string
  planTasks: PlanTaskFlat[]
}

export default function TodayTaskList({ roadmapId, planTasks }: Props) {
  const [xpEvent, setXpEvent] = useState<XPEvent | null>(null)

  const handleComplete = useCallback((event: XPEvent) => {
    setXpEvent(event)
  }, [])

  const handleDone = useCallback(() => {
    setXpEvent(null)
  }, [])

  const remaining  = planTasks.filter((t) => !t.isComplete)
  const done       = planTasks.filter((t) => t.isComplete)
  const carryovers = planTasks.filter((t) => t.isCarryover && !t.isComplete)

  if (planTasks.length === 0) {
    return (
      <div className="bg-[--bg-card] border border-dashed border-[--border-default] rounded-xl p-8 text-center">
        <p className="text-3xl mb-2">🎉</p>
        <p className="text-sm font-medium text-[--text-primary]">No tasks scheduled for today</p>
        <p className="text-xs text-[--text-muted] mt-1">Check your roadmap to continue progress</p>
      </div>
    )
  }

  return (
    <>
      <CompletionAnimation event={xpEvent} onDone={handleDone} />

      {/* Carryover warning banner */}
      <AnimatePresence>
        {carryovers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 overflow-hidden"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs">
              <span>⏰</span>
              <span>
                <strong>{carryovers.length} task{carryovers.length > 1 ? 's' : ''}</strong> carried over from yesterday — knock them out first!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remaining tasks */}
      {remaining.length > 0 && (
        <div className="space-y-2 mb-4">
          {remaining.map((task) => (
            <div key={task.taskId} className="relative">
              {task.isCarryover && (
                <span className="absolute -top-1.5 right-3 z-10 text-[10px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium border border-orange-500/20">
                  carry-over
                </span>
              )}
              <TaskItem
                taskId={task.taskId}
                dayNumber={task.dayNumber}
                title={task.title}
                description={task.description}
                estimatedMinutes={task.estimatedMinutes}
                isComplete={task.isComplete}
                onComplete={handleComplete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Progress summary */}
      {done.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-[--text-muted]">
          <span className="text-green-400">✓</span>
          <span>{done.length} of {planTasks.length} done today</span>
          {done.length === planTasks.length && (
            <span className="text-green-400 font-medium ml-1">🎉 All done!</span>
          )}
        </div>
      )}
    </>
  )
}
