import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/app/lib/prisma'
import { createSession } from '@/app/lib/session'
import { fail, ok, readJson } from '@/app/lib/api'

const RegisterSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  const parsed = await readJson(request, RegisterSchema)
  if (parsed instanceof Response) return parsed

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } })
  if (existing) return fail('Email is already registered', 409)

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash: await bcrypt.hash(parsed.password, 12),
      profile: { create: {} },
      streak: { create: {} },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  await createSession({ userId: user.id, name: user.name, email: user.email })
  return ok(user, { status: 201 })
}
