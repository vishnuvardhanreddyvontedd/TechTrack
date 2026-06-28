import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const OnboardingSchema = z.object({
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  careerGoal: z.string().min(2).max(120),
  dailyAvailableMinutes: z.number().int().min(10).max(600),
  preferredLearningStyle: z.enum(['READING', 'VIDEO', 'PROJECT_BASED', 'MIXED']),
  targetTimelineWeeks: z.number().int().min(1).max(104),
  existingSkills: z.array(z.string()).default([]),
  weakAreas: z.array(z.string()).default([]),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const body = await readJson(request, OnboardingSchema)
  if (body instanceof Response) return body

  const profile = await prisma.profile.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId, ...body },
    update: body,
  })

  return ok(profile)
}
