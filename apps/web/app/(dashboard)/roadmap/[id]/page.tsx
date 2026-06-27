// app/(dashboard)/roadmap/[id]/page.tsx
// Roadmap detail — supports both template-based and AI-generated roadmaps.

import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { ProgressBar } from '@/app/components/ui/ProgressBar'
import { Badge } from '@/app/components/ui/Badge'
import RoadmapTaskList from './RoadmapTaskList'

export const dynamic = 'force-dynamic'

function resolveTitle(roadmap: {
  title: string | null
  customGoal: string | null
  template: { title: string } | null
}) {
  return roadmap.title ?? roadmap.template?.title ?? roadmap.customGoal ?? 'My Roadmap'
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params
  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
    include: { template: true },
  })
  return { title: resolveTitle(roadmap ?? { title: null, customGoal: null, template: null }) }
}

export default async function RoadmapPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { id } = await params

  const roadmap = await prisma.roadmap.findFirst({
    where: { id, userId: session.userId },
    include: {
      template: true,
      tasks: {
        include: { dayTemplate: true },
        orderBy: { dayNumber: 'asc' },
      },
    },
  })

  if (!roadmap) notFound()

  const title         = resolveTitle(roadmap)
  const icon          = roadmap.template?.iconEmoji ?? '✨'
  const totalTasks    = roadmap.tasks.length
  const completedTasks = roadmap.tasks.filter((t) => t.isComplete).length
  const pct           = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const totalDays     = roadmap.template?.totalDays ?? roadmap.durationDays
  const now           = new Date()
  const daysSinceStart = Math.floor(
    (now.getTime() - roadmap.startDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Normalise tasks for the client — merge template fields + custom fields
  const normalisedTasks = roadmap.tasks.map((t) => ({
    id:               t.id,
    dayNumber:        t.dayNumber,
    title:            t.dayTemplate?.title ?? t.customTitle ?? 'Task',
    description:      t.dayTemplate?.description ?? t.customDesc ?? '',
    estimatedMinutes: t.dayTemplate?.estimatedMinutes ?? t.estimatedMinutes,
    isComplete:       t.isComplete,
  }))

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl" role="img" aria-label={title}>{icon}</span>
              <Badge variant={pct === 100 ? 'success' : 'brand'} dot>
                {pct === 100 ? 'Complete' : 'In Progress'}
              </Badge>
              {roadmap.customGoal && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 font-medium">
                  AI Generated
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[--text-primary]">{title}</h1>
            {roadmap.customGoal && (
              <p className="text-sm text-[--text-secondary] mt-1 italic">&quot;{roadmap.customGoal}&quot;</p>
            )}
            {roadmap.template?.description && (
              <p className="text-sm text-[--text-secondary] mt-1">{roadmap.template.description}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Completed', value: completedTasks, suffix: ` / ${totalTasks}` },
            { label: 'Progress',  value: `${pct}%`,      suffix: '' },
            { label: 'Day',       value: Math.min(daysSinceStart + 1, totalDays), suffix: ` / ${totalDays}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-[--bg-card] rounded-xl p-4 text-center shadow-sm">
              <p className="text-xl font-bold text-[--text-primary]">
                {stat.value}<span className="text-sm text-[--text-muted]">{stat.suffix}</span>
              </p>
              <p className="text-xs text-[--text-muted] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <ProgressBar value={pct} height={8} color={pct === 100 ? 'green' : 'brand'} />
      </div>

      {/* Task list */}
      <RoadmapTaskList tasks={normalisedTasks} />
    </div>
  )
}
