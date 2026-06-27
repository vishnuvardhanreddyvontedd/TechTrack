// app/api/roadmap/generate/route.ts
// POST /api/roadmap/generate
// Generates an AI roadmap from a free-text goal, persists it, returns the roadmap.

import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { generateRoadmap } from '@/app/services/roadmap-generator'
import type { ApiError, ApiSuccess } from '@/app/types/index'

const GenerateSchema = z.object({
  goal:        z.string().min(3, 'Goal must be at least 3 characters').max(200),
  durationDays: z.number().int().min(7).max(90).default(30),
})

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  }

  let body: unknown
  try { body = await request.json() }
  catch { return Response.json({ error: 'Invalid JSON' } satisfies ApiError, { status: 400 }) }

  const parsed = GenerateSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors } satisfies ApiError,
      { status: 422 }
    )
  }

  const { goal, durationDays } = parsed.data

  // Generate — uses OpenAI if key is set, local fallback otherwise
  let generated
  try {
    generated = await generateRoadmap(goal, durationDays)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed'
    return Response.json({ error: message } satisfies ApiError, { status: 502 })
  }

  // Persist roadmap + tasks in one transaction
  const roadmap = await prisma.$transaction(async (tx) => {
    const newRoadmap = await tx.roadmap.create({
      data: {
        userId:      session.userId,
        customGoal:  goal,
        title:       generated.title,
        durationDays,
      },
    })

    await tx.task.createMany({
      data: generated.days.map((day) => ({
        roadmapId:        newRoadmap.id,
        dayNumber:        day.dayNumber,
        customTitle:      day.title,
        customDesc:       day.description,
        estimatedMinutes: day.estimatedMinutes,
      })),
    })

    return newRoadmap
  })

  return Response.json(
    { data: roadmap, message: 'Roadmap generated!' } satisfies ApiSuccess,
    { status: 201 }
  )
}
