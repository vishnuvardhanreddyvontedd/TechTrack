// app/(dashboard)/onboarding/page.tsx
// Career goal selection — the first page new users see.
// Server Component that loads templates; goal selection is a Client Component.

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import { getSession } from '@/app/lib/session'
import OnboardingClient from './OnboardingClient'

export const metadata: Metadata = {
  title: 'Choose Your Path',
  description: 'Pick a tech career goal and get your personalized learning roadmap.',
}

export default async function OnboardingPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  // Check if user already has an active roadmap — redirect to dashboard
  const existing = await prisma.roadmap.findFirst({
    where: { userId: session.userId, isActive: true },
  })
  if (existing) redirect(`/roadmap/${existing.id}`)

  // Load all available templates
  const templates = await prisma.roadmapTemplate.findMany({
    orderBy: { title: 'asc' },
  })

  return <OnboardingClient templates={templates} />
}
