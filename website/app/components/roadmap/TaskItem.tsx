// app/components/roadmap/TaskItem.tsx
// Individual task row with completion toggle and micro-animation.

'use client'

import { useState, useTransition, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeTask } from '@/app/actions/tasks'
import type { XPEvent } from '@/app/types/index'

interface Props {
  taskId: string
  dayNumber: number
  title: string
  description: string
  estimatedMinutes: number
  isComplete: boolean
  onComplete: (event: XPEvent) => void
}

export default function TaskItem({
  taskId,
  dayNumber,
  title,
  description,
  estimatedMinutes,
  isComplete: initialComplete,
  onComplete,
}: Props) {
  const [isComplete, setIsComplete] = useState(initialComplete)
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded] = useState(false)

  const handleComplete = useCallback(() => {
    if (isComplete || isPending) return
    startTransition(async () => {
      const result = await completeTask(taskId)
      if ('error' in result) return
      setIsComplete(true)
      onComplete(result)
    })
  }, [isComplete, isPending, taskId, onComplete])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        rounded-xl border transition-all duration-200
        ${isComplete
          ? 'border-green-500/20 bg-green-500/5'
          : 'border-[--border-subtle] bg-[--bg-card] hover:border-[--border-default]'
        }
      `}
    >
      <div className="flex items-start gap-4 p-4">
        {/* Day badge */}
        <div className={`
          shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold
          ${isComplete ? 'gradient-brand text-white' : 'bg-[--bg-muted] text-[--text-muted]'}
        `}>
          {isComplete ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            `D${dayNumber}`
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="w-full text-left"
            aria-expanded={expanded}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className={`font-medium text-sm ${isComplete ? 'text-[--text-muted] line-through' : 'text-[--text-primary]'}`}>
                {title}
              </h3>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-[--text-muted]">~{estimatedMinutes}m</span>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-[--text-muted] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </button>

          {/* Expandable description */}
          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="mt-2 text-xs text-[--text-secondary] leading-relaxed pr-4">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Complete button */}
        {!isComplete && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleComplete}
            disabled={isPending}
            className="shrink-0 w-8 h-8 rounded-lg border border-[--border-default] hover:border-brand-500 hover:bg-brand-500/10 flex items-center justify-center transition-all duration-150 disabled:opacity-50"
            aria-label={`Mark day ${dayNumber} complete`}
            id={`complete-task-${taskId}`}
          >
            {isPending ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="animate-spin text-brand-400" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" opacity="0.3" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[--text-muted]" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
