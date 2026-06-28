import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const UpdateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  profile: z.object({
    careerGoal: z.string().min(2).max(120).optional(),
    dailyAvailableMinutes: z.number().int().min(10).max(600).optional(),
    existingSkills: z.array(z.string()).optional(),
    weakAreas: z.array(z.string()).optional(),
  }).optional(),
})

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  })
  if (!user) return fail('User not found', 404)

  const { passwordHash: _passwordHash, ...safeUser } = user
  return ok(safeUser)
}

export async function PUT(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)

  const body = await readJson(request, UpdateUserSchema)
  if (body instanceof Response) return body

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: body.name,
      avatarUrl: body.avatarUrl,
      profile: body.profile ? { upsert: { create: body.profile, update: body.profile } } : undefined,
    },
    include: { profile: true },
  })

  const { passwordHash: _passwordHash, ...safeUser } = user
  return ok(safeUser)
}
