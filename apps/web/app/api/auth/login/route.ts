import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/app/lib/prisma'
import { createSession } from '@/app/lib/session'
import { fail, ok, readJson } from '@/app/lib/api'

const LoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  const parsed = await readJson(request, LoginSchema)
  if (parsed instanceof Response) return parsed

  const user = await prisma.user.findUnique({ where: { email: parsed.email } })
  if (!user) return fail('Invalid email or password', 401)

  const passwordMatch = await bcrypt.compare(parsed.password, user.passwordHash)
  if (!passwordMatch) return fail('Invalid email or password', 401)

  await createSession({ userId: user.id, name: user.name, email: user.email })
  return ok({ id: user.id, name: user.name, email: user.email, role: user.role })
}
