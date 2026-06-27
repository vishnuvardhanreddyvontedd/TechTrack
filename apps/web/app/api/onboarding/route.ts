import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const OnboardingSchema = z.object({
  name: z.string().min(2).max(80),
  currentSkillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  careerGoal: z.string().min(2).max(120),
  dailyAvailableMinutes: z.number().int().min(15).max(480),
  preferredLearningStyle: z.enum(['VISUAL', 'READING', 'PROJECT_BASED', 'VIDEO', 'MIXED']),
  targetTimelineWeeks: z.number().int().min(1).max(104),
  existingSkills: z.array(z.string()).default([]),
  weakAreas: z.array(z.string()).default([]),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const parsed = await readJson(request, OnboardingSchema)
  if (parsed instanceof Response) return parsed

  const { name, ...profile } = parsed
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name,
      profile: {
        upsert: {
          create: { ...profile, onboardingCompletedAt: new Date() },
          update: { ...profile, onboardingCompletedAt: new Date() },
        },
      },
    },
    include: { profile: true },
  })

  return ok(user)
}
