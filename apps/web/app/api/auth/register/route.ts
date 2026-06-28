import bcrypt from 'bcryptjs'
import { SignupSchema } from '@/app/lib/definitions'
import { createSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { fail, ok, readJson } from '@/app/lib/api'

export async function POST(request: Request) {
  const body = await readJson(request, SignupSchema)
  if (body instanceof Response) return body

  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) return fail('An account with this email already exists.', 409)

  const passwordHash = await bcrypt.hash(body.password, 12)
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash,
      profile: { create: {} },
    },
    select: { id: true, name: true, email: true, role: true },
  })

  await createSession({ userId: user.id, name: user.name, email: user.email })
  return ok(user, { status: 201 })
}
