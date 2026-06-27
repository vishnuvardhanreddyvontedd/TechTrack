'use client'
// app/(dashboard)/roadmap/[id]/RoadmapTaskList.tsx
// Accepts a normalised task shape that works for both template and custom roadmaps.

import { useState, useCallback } from 'react'
import TaskItem from '@/app/components/roadmap/TaskItem'
import CompletionAnimation from '@/app/components/roadmap/CompletionAnimation'
import type { XPEvent } from '@/app/types/index'

// Normalised task — template and custom fields already merged by the server
export interface NormalisedTask {
  id: string
  dayNumber: number
  title: string
  description: string
  estimatedMinutes: number
  isComplete: boolean
}

interface Props {
  tasks: NormalisedTask[]
}

export default function RoadmapTaskList({ tasks }: Props) {
  const [xpEvent, setXpEvent] = useState<XPEvent | null>(null)

  const handleComplete = useCallback((event: XPEvent) => setXpEvent(event), [])
  const handleDone     = useCallback(() => setXpEvent(null), [])

  const remaining = tasks.filter((t) => !t.isComplete)
  const completed = tasks.filter((t) => t.isComplete)

  return (
    <>
      <CompletionAnimation event={xpEvent} onDone={handleDone} />

      {/* Remaining tasks */}
      {remaining.length > 0 && (
        <section aria-label="Remaining tasks">
          <h2 className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider mb-3">
            Up next — {remaining.length} task{remaining.length !== 1 ? 's' : ''}
          </h2>
          <div className="space-y-2 mb-8">
            {remaining.map((task) => (
              <TaskItem
                key={task.id}
                taskId={task.id}
                dayNumber={task.dayNumber}
                title={task.title}
                description={task.description}
                estimatedMinutes={task.estimatedMinutes}
                isComplete={task.isComplete}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed tasks */}
      {completed.length > 0 && (
        <section aria-label="Completed tasks">
          <h2 className="text-xs font-semibold text-[--text-muted] uppercase tracking-wider mb-3">
            Completed — {completed.length}
          </h2>
          <div className="space-y-2">
            {completed.map((task) => (
              <TaskItem
                key={task.id}
                taskId={task.id}
                dayNumber={task.dayNumber}
                title={task.title}
                description={task.description}
                estimatedMinutes={task.estimatedMinutes}
                isComplete={task.isComplete}
                onComplete={handleComplete}
              />
            ))}
          </div>
        </section>
      )}

      {/* All done */}
      {tasks.length > 0 && remaining.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-[--text-primary] mb-1">Roadmap complete!</h2>
          <p className="text-[--text-secondary] text-sm">You&apos;ve finished every task. Time to pick a new goal.</p>
        </div>
      )}
    </>
  )
}
