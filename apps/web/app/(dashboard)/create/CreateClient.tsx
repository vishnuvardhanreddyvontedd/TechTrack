'use client'
// app/(dashboard)/create/CreateClient.tsx

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { RoadmapTemplate } from '@/app/generated/prisma/client'

const DURATION_OPTIONS = [
  { value: 30, label: '30 days', desc: 'Sprint' },
  { value: 60, label: '60 days', desc: 'Deep dive' },
  { value: 90, label: '90 days', desc: 'Mastery' },
]

const EXAMPLE_GOALS = [
  'Get a software engineering job at Google',
  'Become a backend engineer in 3 months',
  'Learn AI and land an ML internship',
  'Build and launch a SaaS product',
  'Master system design for senior interviews',
  'Transition from frontend to full-stack',
  'Learn data science from scratch',
  'Become a DevOps engineer',
]

// Visual metadata for template cards
const TEMPLATE_META: Record<string, { gradient: string; glow: string; emoji: string }> = {
  'frontend-engineer':    { gradient: 'from-blue-600 to-cyan-500',    glow: 'rgba(6,182,212,0.3)',   emoji: '🎨' },
  'backend-engineer':     { gradient: 'from-green-600 to-emerald-500', glow: 'rgba(16,185,129,0.3)',  emoji: '⚙️' },
  'fullstack-engineer':   { gradient: 'from-violet-600 to-indigo-500', glow: 'rgba(99,102,241,0.3)',  emoji: '🚀' },
  'ai-ml-engineer':       { gradient: 'from-purple-600 to-pink-500',   glow: 'rgba(168,85,247,0.3)',  emoji: '🤖' },
  'devops-engineer':      { gradient: 'from-orange-600 to-amber-500',  glow: 'rgba(245,158,11,0.3)',  emoji: '🛠️' },
  'data-scientist':       { gradient: 'from-teal-600 to-cyan-500',     glow: 'rgba(20,184,166,0.3)',  emoji: '📊' },
  'mobile-developer':     { gradient: 'from-red-600 to-rose-500',      glow: 'rgba(239,68,68,0.3)',   emoji: '📱' },
  'cloud-architect':      { gradient: 'from-sky-600 to-blue-500',      glow: 'rgba(14,165,233,0.3)',  emoji: '☁️' },
  'cybersecurity':        { gradient: 'from-slate-600 to-zinc-500',    glow: 'rgba(100,116,139,0.3)', emoji: '🔐' },
  'product-manager':      { gradient: 'from-pink-600 to-rose-500',     glow: 'rgba(236,72,153,0.3)',  emoji: '📋' },
  'ui-ux-designer':       { gradient: 'from-fuchsia-600 to-purple-500',glow: 'rgba(192,38,211,0.3)',  emoji: '🎭' },
  'blockchain-developer': { gradient: 'from-yellow-600 to-orange-500', glow: 'rgba(234,179,8,0.3)',   emoji: '⛓️' },
  'game-developer':       { gradient: 'from-lime-600 to-green-500',    glow: 'rgba(101,163,13,0.3)',  emoji: '🎮' },
}

// Pinned "most popular" slugs shown in the featured row
const FEATURED_SLUGS = ['fullstack-engineer', 'ai-ml-engineer', 'frontend-engineer', 'backend-engineer', 'data-scientist', 'devops-engineer']

function getTemplateMeta(slug: string) {
  return TEMPLATE_META[slug] ?? { gradient: 'from-brand-600 to-accent-600', glow: 'rgba(99,102,241,0.3)', emoji: '🗺️' }
}

interface Props { templates: RoadmapTemplate[] }

export default function CreateClient({ templates }: Props) {
  const router = useRouter()
  const [mode, setMode]               = useState<'custom' | 'explore'>('custom')
  const [goal, setGoal]               = useState('')
  const [duration, setDuration]       = useState(30)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [error, setError]             = useState<string | null>(null)
  const [isPending, startTransition]  = useTransition()

  const featured = templates.filter((t) => FEATURED_SLUGS.includes(t.slug))
  const remaining = templates.filter((t) => !FEATURED_SLUGS.includes(t.slug))

  async function handleGenerate() {
    if (!goal.trim() || goal.trim().length < 3) { setError('Please enter a goal (at least 3 characters)'); return }
    setError(null)
    startTransition(async () => {
      try {
        const res  = await fetch('/api/roadmap/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ goal: goal.trim(), durationDays: duration }) })
        const json = await res.json()
        if (!res.ok) { setError(json.error ?? 'Something went wrong'); return }
        router.push(`/roadmap/${json.data.id}`)
      } catch { setError('Network error. Please try again.') }
    })
  }

  async function handleTemplate() {
    if (!selectedTemplate) return
    setError(null)
    startTransition(async () => {
      try {
        const res  = await fetch('/api/roadmaps', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateSlug: selectedTemplate }) })
        const json = await res.json()
        if (!res.ok) { setError(json.error ?? 'Something went wrong'); return }
        router.push(`/roadmap/${json.data.id}`)
      } catch { setError('Network error. Please try again.') }
    })
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-[--text-primary] mb-1">Create a Roadmap</h1>
        <p className="text-[--text-secondary]">AI-powered or from a proven template — start learning today.</p>
      </motion.div>

      {/* Mode toggle */}
      <div className="flex gap-1 p-1 rounded-2xl mb-8 w-fit" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
        {(['custom', 'explore'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              mode === m ? 'gradient-brand text-white' : 'text-[--text-muted] hover:text-[--text-secondary]'
            }`} id={`mode-${m}`}
            style={mode === m ? { boxShadow: 'var(--glow-brand)' } : {}}>
            {m === 'custom' ? '✨ Custom Goal' : '📚 Templates'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── Custom Goal Mode ── */}
        {mode === 'custom' && (
          <motion.div key="custom" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.2 }} className="space-y-4">

            {/* Goal input card */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <label htmlFor="goal-input" className="block text-sm font-semibold text-[--text-primary] mb-3">
                What do you want to achieve?
              </label>
              <textarea
                id="goal-input"
                value={goal}
                onChange={(e) => { setGoal(e.target.value); setError(null) }}
                placeholder='"Get a software engineering job at Google in 90 days"'
                rows={3}
                className="w-full px-4 py-3 rounded-xl text-sm text-[--text-primary] placeholder:text-[--text-muted] resize-none outline-none transition-all"
                style={{ background: 'var(--bg-muted)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}
                onFocus={(e) => e.currentTarget.style.boxShadow = 'var(--glow-brand), inset 0 1px 2px rgba(0,0,0,0.2)'}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3)'}
              />

              {/* Example pills */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-[--text-muted] uppercase tracking-widest mb-2">Try an example</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_GOALS.map((eg) => (
                    <button key={eg} onClick={() => setGoal(eg)}
                      className="text-xs px-3 py-1.5 rounded-xl text-[--text-secondary] hover:text-[--text-primary] transition-all duration-150"
                      style={{ background: 'var(--bg-muted)', boxShadow: 'var(--shadow-xs)' }}>
                      {eg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Duration picker */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-sm font-semibold text-[--text-primary] mb-4">Duration</p>
              <div className="grid grid-cols-3 gap-3">
                {DURATION_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => setDuration(opt.value)}
                    id={`duration-${opt.value}`}
                    className="p-4 rounded-xl text-left transition-all duration-200 relative"
                    style={duration === opt.value
                      ? { background: 'rgba(99,102,241,0.12)', boxShadow: 'var(--glow-brand)' }
                      : { background: 'var(--bg-muted)', boxShadow: 'var(--shadow-xs)' }}>
                    <p className={`text-xl font-bold leading-none ${duration === opt.value ? 'gradient-text' : 'text-[--text-primary]'}`}>{opt.label}</p>
                    <p className="text-xs text-[--text-muted] mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="px-4 py-3 rounded-xl text-sm text-red-300" role="alert"
                  style={{ background: 'rgba(239,68,68,0.08)', boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.15)' }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <button onClick={handleGenerate} disabled={isPending || !goal.trim()} id="generate-roadmap-btn"
              className="w-full py-4 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-2 transition-all duration-200"
              style={(isPending || !goal.trim())
                ? { background: 'rgba(79,70,229,0.3)', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: 'var(--glow-brand-lg)' }}>
              {isPending
                ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Generating your roadmap…</>
                : <>✨ Generate My {duration}-Day Roadmap</>}
            </button>

            {isPending && <p className="text-center text-xs text-[--text-muted] animate-pulse">AI is crafting your plan… ~10 seconds</p>}
          </motion.div>
        )}

        {/* ── Explore Templates ── */}
        {mode === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-8">

            {/* Featured / Popular */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-semibold text-[--text-primary]">Most Popular</span>
                <span className="pill bg-brand-600/15 text-brand-400">🔥 Hot</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featured.map((t, i) => {
                  const meta = getTemplateMeta(t.slug)
                  const isSelected = selectedTemplate === t.slug
                  return (
                    <motion.button key={t.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      onClick={() => setSelectedTemplate(isSelected ? null : t.slug)} aria-pressed={isSelected}
                      className="text-left rounded-2xl p-5 transition-all duration-200 relative overflow-hidden group"
                      id={`tmpl-${t.slug}`}
                      style={isSelected
                        ? { background: 'rgba(99,102,241,0.1)', boxShadow: `var(--glow-brand), 0 0 0 1px rgba(99,102,241,0.3)` }
                        : { background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                      {/* BG gradient blob */}
                      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${meta.gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />

                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl mb-3 shadow-lg`}
                          style={{ boxShadow: `0 4px 16px ${meta.glow}` }}>
                          {meta.emoji}
                        </div>
                        <p className="font-semibold text-[--text-primary] text-sm mb-1">{t.title}</p>
                        <p className="text-xs text-[--text-secondary] line-clamp-2 mb-3">{t.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[--text-muted]">📅 {t.totalDays} days</span>
                          {isSelected && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* All other templates */}
            {remaining.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-[--text-primary] mb-4">More Paths</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {remaining.map((t, i) => {
                    const meta = getTemplateMeta(t.slug)
                    const isSelected = selectedTemplate === t.slug
                    return (
                      <motion.button key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 + 0.3 }}
                        onClick={() => setSelectedTemplate(isSelected ? null : t.slug)} aria-pressed={isSelected}
                        className="text-left rounded-2xl p-4 transition-all duration-200 flex items-center gap-4"
                        id={`tmpl-${t.slug}`}
                        style={isSelected
                          ? { background: 'rgba(99,102,241,0.1)', boxShadow: 'var(--glow-brand)' }
                          : { background: 'var(--bg-card)', boxShadow: 'var(--shadow-xs)' }}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-lg shrink-0 shadow`}>
                          {meta.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[--text-primary] text-sm truncate">{t.title}</p>
                          <p className="text-xs text-[--text-muted]">{t.totalDays} days</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="px-4 py-3 rounded-xl text-sm text-red-300" role="alert"
                  style={{ background: 'rgba(239,68,68,0.08)', boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.15)' }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={handleTemplate} disabled={isPending || !selectedTemplate} id="start-template-btn"
              className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-200"
              style={(isPending || !selectedTemplate)
                ? { background: 'rgba(79,70,229,0.3)', cursor: 'not-allowed' }
                : { background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: 'var(--glow-brand-lg)' }}>
              {isPending ? 'Setting up…' : 'Start This Roadmap →'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
