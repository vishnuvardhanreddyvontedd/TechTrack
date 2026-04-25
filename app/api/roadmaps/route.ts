// app/api/roadmaps/route.ts
// GET  /api/roadmaps  — list current user's roadmaps
// POST /api/roadmaps  — create a new roadmap from a template slug

import { type NextRequest } from 'next/server'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { CreateRoadmapSchema } from '@/app/lib/definitions'
import type { ApiError, ApiSuccess } from '@/app/types/index'

// ─── GET — list user roadmaps ─────────────────────────────────────────────────
export async function GET() {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  }

  const roadmaps = await prisma.roadmap.findMany({
    where: { userId: session.userId },
    include: {
      template: true,
      tasks: { select: { isComplete: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return Response.json({ data: roadmaps } satisfies ApiSuccess)
}

// ─── POST — create roadmap from template ──────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' } satisfies ApiError, { status: 400 })
  }

  const parsed = CreateRoadmapSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors } satisfies ApiError,
      { status: 422 }
    )
  }

  const { templateSlug } = parsed.data

  // Look up template with all day templates
  const template = await prisma.roadmapTemplate.findUnique({
    where: { slug: templateSlug },
    include: { dayTemplates: { orderBy: { dayNumber: 'asc' } } },
  })

  if (!template) {
    return Response.json({ error: 'Template not found' } satisfies ApiError, { status: 404 })
  }

  // Check if user already has an active roadmap for this template
  const existing = await prisma.roadmap.findFirst({
    where: { userId: session.userId, templateId: template.id, isActive: true },
  })
  if (existing) {
    return Response.json(
      { error: 'You already have an active roadmap for this career path.' } satisfies ApiError,
      { status: 409 }
    )
  }

  // Create roadmap + all task instances in one transaction
  const roadmap = await prisma.$transaction(async (tx) => {
    const newRoadmap = await tx.roadmap.create({
      data: {
        userId: session.userId,
        templateId: template.id,
      },
    })

    await tx.task.createMany({
      data: template.dayTemplates.map((dt) => ({
        roadmapId: newRoadmap.id,
        dayTemplateId: dt.id,
        dayNumber: dt.dayNumber,
      })),
    })

    return newRoadmap
  })

  return Response.json(
    { data: roadmap, message: 'Roadmap created successfully!' } satisfies ApiSuccess,
    { status: 201 }
  )
}
