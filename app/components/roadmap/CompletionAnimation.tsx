'use client'
// app/components/roadmap/CompletionAnimation.tsx
// Full-screen celebration overlay for task completion and level-up events.
//
// Two tiers of animation:
//   - Task complete → confetti burst + XP card (auto-dismisses in 2.5s)
//   - Level up      → cinematic full-screen reward screen (auto-dismisses in 4s)

import { useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { XPEvent } from '@/app/types/index'
import { getLevelTitle } from '@/app/services/gamification'

interface Props {
  event: XPEvent | null
  onDone: () => void
}

// ─── Canvas Confetti ──────────────────────────────────────────────────────────

type Particle = {
  x: number; y: number; r: number
  dx: number; dy: number; color: string; alpha: number
  rot: number; drot: number; shape: 'circle' | 'rect'
}

const CONFETTI_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#fbbf24', '#34d399', '#f97316', '#ec4899']

function useConfetti(
  active: boolean,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  density = 80,
) {
  useEffect(() => {
    if (!active || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = Array.from({ length: density }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height * 0.4,
      r:     Math.random() * 7 + 3,
      dx:    (Math.random() - 0.5) * 5,
      dy:    Math.random() * 4 + 1,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      alpha: 1,
      rot:   Math.random() * Math.PI * 2,
      drot:  (Math.random() - 0.5) * 0.15,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }))

    let frame: number
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle   = p.color
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.r, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r)
        }
        ctx.restore()

        p.x    += p.dx
        p.y    += p.dy
        p.dy   += 0.08  // gravity
        p.rot  += p.drot
        p.alpha -= 0.008
      }
      if (particles.some((p) => p.alpha > 0)) {
        frame = requestAnimationFrame(draw)
      }
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [active, canvasRef, density])
}

// ─── Task Complete Overlay ────────────────────────────────────────────────────

function TaskCompleteCard({ event }: { event: XPEvent }) {
  return (
    <motion.div
      initial={{ scale: 0.5, y: 40, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.85, y: -24, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0.45, duration: 0.5 }}
      className="relative glass-strong rounded-2xl px-8 py-6 text-center shadow-2xl border border-[--border-default] max-w-xs w-full"
    >
      {/* Spinning star */}
      <motion.div
        animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
        className="text-5xl mb-3"
        role="img"
        aria-label="star"
      >
        ⭐
      </motion.div>

      <p className="text-lg font-bold text-[--text-primary] mb-1">Task Complete!</p>

      <motion.p
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
        className="gradient-text-gold text-3xl font-extrabold mb-2"
      >
        +{event.xpGained} XP
      </motion.p>

      {event.xpGained > 25 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-[--streak-fire] font-medium"
        >
          🔥 Streak bonus included!
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── Level Up Overlay ────────────────────────────────────────────────────────

function LevelUpScreen({ event }: { event: XPEvent }) {
  const title = getLevelTitle(event.newLevel)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* Dark radial backdrop */}
      <div className="absolute inset-0 bg-[--bg-base]/70 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.3, y: 60, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: -40, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.4, duration: 0.7 }}
        className="relative z-10 flex flex-col items-center text-center px-8 py-10 max-w-sm w-full"
      >
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-brand-500/30 to-accent-500/30 blur-2xl"
        />

        {/* Trophy */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="text-7xl mb-5 relative z-10"
          role="img"
          aria-label="trophy"
        >
          🏆
        </motion.div>

        {/* Level badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.25 }}
          className="relative z-10 px-6 py-2 rounded-full gradient-brand shadow-lg glow-brand mb-4"
        >
          <span className="text-white font-extrabold text-xl">Level {event.newLevel}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 text-2xl font-bold text-[--text-primary] mb-1"
        >
          {title} Unlocked!
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="relative z-10 text-sm text-[--text-secondary]"
        >
          +{event.xpGained} XP earned · Keep going!
        </motion.p>

        {/* Starburst particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              x: Math.cos((i / 8) * Math.PI * 2) * 90,
              y: Math.sin((i / 8) * Math.PI * 2) * 90,
              scale: [0, 1.2, 0],
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.04, ease: 'easeOut' }}
            className="absolute w-3 h-3 rounded-full bg-brand-400"
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function CompletionAnimation({ event, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isActive  = event !== null
  const isLevelUp = event?.levelledUp === true

  // More confetti for level-ups
  useConfetti(isActive, canvasRef, isLevelUp ? 150 : 80)

  // Auto-dismiss: longer for level-up to let the user savour the moment
  const dismissMs = isLevelUp ? 4000 : 2500
  useEffect(() => {
    if (!isActive) return
    const t = setTimeout(onDone, dismissMs)
    return () => clearTimeout(t)
  }, [isActive, onDone, dismissMs])

  const handleClick = useCallback(() => {
    if (isActive) onDone()
  }, [isActive, onDone])

  return (
    <AnimatePresence>
      {isActive && event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClick}
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
          role="status"
        >
          {/* Canvas confetti layer */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Conditional overlay content */}
          {isLevelUp ? (
            <LevelUpScreen event={event} />
          ) : (
            <TaskCompleteCard event={event} />
          )}

          {/* Dismiss hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 text-xs text-[--text-muted] pointer-events-none"
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
