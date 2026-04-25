'use client'
// app/LandingClient.tsx
// Professional, interactive landing page matching the project's design system.
// Animations: subtle scroll-based fade-ins, no jank or overdone effects.

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '✨',
    title: 'AI Roadmap Generator',
    desc: 'Type any goal — "Get a job at Google", "Learn AI", "Build a SaaS" — and get a structured day-by-day plan instantly.',
    gradient: 'from-violet-600 to-indigo-600',
    glow: 'rgba(99,102,241,0.3)',
  },
  {
    icon: '✅',
    title: 'Daily Task System',
    desc: 'Each roadmap breaks down into bite-sized daily tasks. Complete them one by one, track carry-overs, never lose momentum.',
    gradient: 'from-emerald-600 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: '🔥',
    title: 'Streaks & Momentum',
    desc: 'Build a daily habit with streak tracking. Skipping a day costs you — consistency is the real skill.',
    gradient: 'from-orange-600 to-red-600',
    glow: 'rgba(249,115,22,0.3)',
  },
  {
    icon: '⚡',
    title: 'XP & Level System',
    desc: 'Every completed task earns XP. Level up, climb the ladder, and see your skills grow in real numbers.',
    gradient: 'from-yellow-600 to-amber-500',
    glow: 'rgba(251,191,36,0.3)',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'Track your 14-day history, visualise progress with heatmaps and bar charts, and spot patterns in your learning.',
    gradient: 'from-blue-600 to-cyan-600',
    glow: 'rgba(6,182,212,0.3)',
  },
  {
    icon: '🎯',
    title: '13+ Career Paths',
    desc: 'Frontend, Backend, AI/ML, DevOps, Data Science, Cybersecurity, Design, Product, and more — all with expert curricula.',
    gradient: 'from-pink-600 to-rose-600',
    glow: 'rgba(236,72,153,0.3)',
  },
]

const PATHS = [
  { emoji: '🚀', name: 'Full-Stack',    color: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.3)' },
  { emoji: '🤖', name: 'AI / ML',       color: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.3)' },
  { emoji: '🎨', name: 'Frontend',      color: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.3)' },
  { emoji: '⚙️', name: 'Backend',       color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)' },
  { emoji: '📊', name: 'Data Science',  color: 'rgba(20,184,166,0.15)', border: 'rgba(20,184,166,0.3)' },
  { emoji: '🛠️', name: 'DevOps',        color: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)' },
  { emoji: '🔐', name: 'Cybersecurity', color: 'rgba(100,116,139,0.15)',border: 'rgba(100,116,139,0.3)' },
  { emoji: '🎭', name: 'UI/UX Design',  color: 'rgba(192,38,211,0.15)', border: 'rgba(192,38,211,0.3)' },
  { emoji: '📱', name: 'Mobile',        color: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.3)' },
  { emoji: '☁️', name: 'Cloud',         color: 'rgba(14,165,233,0.15)', border: 'rgba(14,165,233,0.3)' },
]

const STEPS = [
  { n: '01', title: 'Set your goal', desc: 'Type anything — a job title, a skill, a dream. Be as specific or broad as you want.' },
  { n: '02', title: 'Get your roadmap', desc: 'AI generates a structured plan with phases, milestones, and 30–90 daily tasks.' },
  { n: '03', title: 'Track daily', desc: 'Log in each day, complete your tasks, earn XP, and build an unbreakable streak.' },
]

// ─── Animation helpers ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Interactive Goal Preview ─────────────────────────────────────────────────
const DEMO_GOALS = [
  'Get a software engineering job at Google',
  'Become a full-stack developer in 3 months',
  'Learn AI and land an ML internship',
  'Build and launch my own SaaS product',
  'Master system design for senior roles',
]

function GoalDemo() {
  const [activeGoal, setActiveGoal] = useState(0)
  const [typed, setTyped] = useState(DEMO_GOALS[0])

  function selectGoal(i: number) {
    setActiveGoal(i)
    setTyped(DEMO_GOALS[i])
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-xl)' }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'var(--bg-muted)' }}>
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-[--text-muted]">techtrack.app/create</span>
      </div>

      <div className="p-6">
        {/* Goal input */}
        <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-widest mb-2">What do you want to achieve?</p>
        <div className="rounded-xl px-4 py-3 text-sm text-[--text-primary] mb-4"
          style={{ background: 'var(--bg-muted)', boxShadow: 'var(--glow-brand), inset 0 1px 2px rgba(0,0,0,0.3)' }}>
          {typed}
          <span className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 animate-pulse align-middle" />
        </div>

        {/* Example clicks */}
        <div className="flex flex-wrap gap-2 mb-5">
          {DEMO_GOALS.map((g, i) => (
            <button key={i} onClick={() => selectGoal(i)}
              className="text-xs px-3 py-1.5 rounded-lg transition-all duration-150"
              style={activeGoal === i
                ? { background: 'rgba(99,102,241,0.2)', color: 'var(--text-brand)', boxShadow: 'var(--glow-brand)' }
                : { background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
              {g.split(' ').slice(0, 4).join(' ')}…
            </button>
          ))}
        </div>

        {/* Fake roadmap preview */}
        <AnimatePresence mode="wait">
          <motion.div key={activeGoal} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="space-y-2">
              {['Day 1 — Foundations', 'Day 2 — Core Concepts', 'Day 7 — First Project', 'Day 15 — Intermediate', 'Day 30 — Deploy & Ship'].map((label, i) => (
                <div key={label} className="flex items-center gap-3 rounded-xl px-4 py-2.5"
                  style={{ background: 'var(--bg-muted)', opacity: 1 - i * 0.12 }}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-brand-400' : i < 3 ? 'bg-brand-600' : 'bg-[--text-muted]'}`} />
                  <span className="text-xs text-[--text-secondary]">{label}</span>
                  {i === 0 && <span className="ml-auto pill bg-brand-600/20 text-brand-400">Today</span>}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <Link href="/signup"
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: 'var(--glow-brand)' }}>
          ✨ Generate My Roadmap
        </Link>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LandingClient() {
  return (
    <div className="min-h-screen text-[--text-primary]" style={{ background: 'var(--bg-base)' }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 h-16"
        style={{ background: 'rgba(7,7,10,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 1px 0 rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center" style={{ boxShadow: 'var(--glow-brand)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>
              </svg>
            </div>
            <span className="font-bold gradient-text text-base">TechTrack</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-[--text-secondary] hover:text-[--text-primary] transition-colors px-3 py-2 rounded-lg hover:bg-[--bg-muted]">
              Sign in
            </Link>
            <Link href="/signup" id="nav-signup-btn"
              className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all duration-150"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: 'var(--glow-brand)' }}>
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-brand-600/10 blur-[100px]" />
          <div className="absolute top-20 right-0 w-[300px] h-[300px] rounded-full bg-accent-600/8 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-brand-800/10 blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'rgba(99,102,241,0.1)', boxShadow: 'inset 0 0 0 1px rgba(99,102,241,0.25)', color: 'var(--text-brand)' }}>
                ✨ 13 career paths · AI-powered generation
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              Your roadmap to<br />
              <span className="gradient-text">any career goal.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}
              className="text-lg text-[--text-secondary] leading-relaxed mb-8 max-w-lg">
              Tell us what you want to achieve. We generate a personalised day-by-day plan,
              track your progress, and keep you motivated with XP, streaks, and real milestones.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap items-center gap-4">
              <Link href="/signup" id="hero-signup-btn"
                className="inline-flex items-center gap-2 font-semibold text-white px-7 py-3.5 rounded-xl text-sm transition-all duration-200"
                style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: 'var(--glow-brand-lg)' }}>
                Start for free →
              </Link>
              <Link href="/login"
                className="text-sm font-medium text-[--text-secondary] hover:text-[--text-primary] transition-colors">
                Already have an account? Sign in
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['#6366f1','#8b5cf6','#ec4899','#14b8a6'].map((c) => (
                  <div key={c} className="w-7 h-7 rounded-full ring-2 ring-[--bg-base]" style={{ background: c }} />
                ))}
              </div>
              <p className="text-xs text-[--text-muted]">
                <span className="text-[--text-secondary] font-semibold">Free to use</span> · No credit card required
              </p>
            </motion.div>
          </div>

          {/* Right: interactive demo */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <GoalDemo />
          </motion.div>
        </div>
      </section>

      {/* ── Career Paths ── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <FadeIn className="text-center mb-8">
            <p className="text-xs font-semibold text-[--text-muted] uppercase tracking-widest">Choose your path or describe your own</p>
          </FadeIn>
          <div className="flex flex-wrap justify-center gap-3">
            {PATHS.map((p, i) => (
              <FadeIn key={p.name} delay={i * 0.04}>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-default select-none"
                  style={{ background: p.color, boxShadow: `inset 0 0 0 1px ${p.border}`, color: 'var(--text-primary)' }}>
                  <span>{p.emoji}</span>
                  <span>{p.name}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 max-w-5xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[--text-primary] mb-3">How it works</h2>
          <p className="text-[--text-secondary] max-w-md mx-auto">Three steps from goal to growth.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[calc(16.7%)] right-[calc(16.7%)] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3) 20%, rgba(99,102,241,0.3) 80%, transparent)' }} />

          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.12}>
              <div className="relative rounded-2xl p-6 text-center" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="w-14 h-14 rounded-2xl gradient-brand mx-auto flex items-center justify-center text-xl font-black text-white mb-4"
                  style={{ boxShadow: 'var(--glow-brand)' }}>
                  {s.n}
                </div>
                <h3 className="font-semibold text-[--text-primary] mb-2">{s.title}</h3>
                <p className="text-sm text-[--text-secondary] leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 max-w-5xl mx-auto px-5 sm:px-8">
        <FadeIn className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[--text-primary] mb-3">Everything you need to level up</h2>
          <p className="text-[--text-secondary] max-w-md mx-auto">One platform. Every tool to build a consistent learning habit.</p>
        </FadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.07}>
              <div className="group rounded-2xl p-6 h-full transition-all duration-200 cursor-default"
                style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `var(--shadow-md), 0 0 24px ${f.glow}` }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)' }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-xl mb-4 shadow-lg`}
                  style={{ boxShadow: `0 4px 16px ${f.glow}` }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-[--text-primary] mb-2">{f.title}</h3>
                <p className="text-sm text-[--text-secondary] leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <FadeIn>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '13+', label: 'Career Paths' },
              { value: '390+', label: 'Day Templates' },
              { value: '30–90', label: 'Days Per Plan' },
              { value: '∞', label: 'Custom Goals' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold gradient-text mb-1">{s.value}</p>
                <p className="text-sm text-[--text-muted]">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 text-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-600/10 blur-[100px]" />
        </div>
        <FadeIn className="relative max-w-xl mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-[--text-primary] mb-3">Ready to start your journey?</h2>
          <p className="text-[--text-secondary] mb-8">Free to use. No credit card. Any goal.</p>
          <Link href="/signup" id="footer-signup-btn"
            className="inline-flex items-center gap-2 font-semibold text-white px-8 py-4 rounded-xl text-base"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: 'var(--glow-brand-lg)' }}>
            ✨ Create your roadmap — it&apos;s free
          </Link>
          <p className="mt-5 text-xs text-[--text-muted]">Takes less than 30 seconds to set up.</p>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>
              </svg>
            </div>
            <span className="text-sm font-semibold gradient-text">TechTrack</span>
          </div>
          <p className="text-xs text-[--text-muted]">
            © {new Date().getFullYear()} TechTrack · Built with Next.js & Prisma
          </p>
          <div className="flex items-center gap-4 text-xs text-[--text-muted]">
            <Link href="/login" className="hover:text-[--text-secondary] transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-[--text-secondary] transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
