import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const UpdateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  careerGoal: z.string().min(2).max(120).optional(),
  dailyAvailableMinutes: z.number().int().min(15).max(480).optional(),
  currentSkillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  preferredLearningStyle: z.enum(['VISUAL', 'READING', 'PROJECT_BASED', 'VIDEO', 'MIXED']).optional(),
  targetTimelineWeeks: z.number().int().min(1).max(104).optional(),
  existingSkills: z.array(z.string()).optional(),
  weakAreas: z.array(z.string()).optional(),
})

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      xp: true,
      level: true,
      currentStreak: true,
      longestStreak: true,
      profile: true,
    },
  })
  return ok(user)
}

export async function PUT(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const parsed = await readJson(request, UpdateProfileSchema)
  if (parsed instanceof Response) return parsed

  const { name, ...profile } = parsed
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(name ? { name } : {}),
      profile: {
        upsert: {
          create: profile,
          update: profile,
        },
      },
    },
    include: { profile: true },
  })

  return ok(user)
}
