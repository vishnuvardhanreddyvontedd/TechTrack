// app/page.tsx
// Public landing page — professional, animated, interactive.
// Animations: Framer Motion scroll-triggered fade-ins, no overdone effects.

import type { Metadata } from 'next'
import Link from 'next/link'
import LandingClient from './LandingClient'

export const metadata: Metadata = {
  title: 'TechTrack — Personalized Career Roadmaps for Any Goal',
  description:
    'Generate a personalized learning roadmap for any career goal. Track daily tasks, earn XP, build streaks, and level up your skills with AI-powered guidance.',
}

export default function LandingPage() {
  return <LandingClient />
}
