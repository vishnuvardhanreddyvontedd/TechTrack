'use client'
// app/(dashboard)/onboarding/OnboardingClient.tsx
// Interactive career-path selection grid with animated cards and API call.

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoadmapTemplate } from '@/app/generated/prisma/client'
import { Button } from '@/app/components/ui/Button'

// Category display metadata
const CATEGORY_META: Record<string, { label: string; gradient: string }> = {
  FRONTEND:     { label: 'Frontend', gradient: 'from-blue-500 to-cyan-400' },
  BACKEND:      { label: 'Backend',  gradient: 'from-green-500 to-emerald-400' },
  FULLSTACK:    { label: 'Full Stack', gradient: 'from-brand-600 to-accent-500' },
  AI_ML:        { label: 'AI / ML',  gradient: 'from-purple-500 to-pink-400' },
  DEVOPS:       { label: 'DevOps',   gradient: 'from-orange-500 to-amber-400' },
  MOBILE:       { label: 'Mobile',   gradient: 'from-red-500 to-rose-400' },
  DATA_SCIENCE: { label: 'Data Science', gradient: 'from-teal-500 to-cyan-400' },
}

interface Props {
  templates: RoadmapTemplate[]
}

export default function OnboardingClient({ templates }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleStart() {
    if (!selected) return
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch('/api/roadmaps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateSlug: selected }),
        })

        const json = await res.json()

        if (!res.ok) {
          setError(json.error ?? 'Something went wrong. Please try again.')
          return
        }

        router.push(`/roadmap/${json.data.id}`)
      } catch {
        setError('Network error. Please check your connection.')
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-[--text-primary] mb-2">
          Choose your career path
        </h1>
        <p className="text-[--text-secondary]">
          Select a goal to get a personalised 30-day roadmap broken into daily tasks.
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {templates.map((template, i) => {
          const meta = CATEGORY_META[template.category] ?? { label: template.category, gradient: 'from-brand-600 to-accent-500' }
          const isSelected = selected === template.slug

          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => setSelected(isSelected ? null : template.slug)}
              className={`
                relative text-left rounded-xl p-5 border transition-all duration-200 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                ${isSelected
                  ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                  : 'border-[--border-subtle] bg-[--bg-card] hover:border-[--border-default] hover:bg-[--bg-muted]'
                }
              `}
              id={`card-${template.slug}`}
              aria-pressed={isSelected}
            >
              {/* Selected glow ring */}
              {isSelected && (
                <motion.div
                  layoutId="selected-ring"
                  className="absolute inset-0 rounded-xl border-2 border-brand-500 pointer-events-none"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}

              {/* Emoji icon with category gradient bg */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-2xl mb-4 shadow`}>
                {template.iconEmoji}
              </div>

              {/* Title + days */}
              <h2 className="font-semibold text-[--text-primary] mb-1">{template.title}</h2>
              <p className="text-xs text-[--text-secondary] mb-3 line-clamp-2">
                {template.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${meta.gradient} text-white`}>
                  {meta.label}
                </span>
                <span className="text-xs text-[--text-muted]">
                  {template.totalDays} days
                </span>
              </div>

              {/* Check icon */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full gradient-brand flex items-center justify-center"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-400 mb-4"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selected ? 1 : 0.4 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={handleStart}
          disabled={!selected}
          isLoading={isPending}
          size="lg"
          className="px-10"
          id="start-roadmap-btn"
        >
          Start my roadmap →
        </Button>
      </motion.div>
    </div>
  )
}
