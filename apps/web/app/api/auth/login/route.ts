import bcrypt from 'bcryptjs'
import { LoginSchema } from '@/app/lib/definitions'
import { createSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { fail, ok, readJson } from '@/app/lib/api'

export async function POST(request: Request) {
  const body = await readJson(request, LoginSchema)
  if (body instanceof Response) return body

  const user = await prisma.user.findUnique({ where: { email: body.email } })
  if (!user) return fail('Invalid email or password.', 401)

  const passwordMatch = await bcrypt.compare(body.password, user.passwordHash)
  if (!passwordMatch) return fail('Invalid email or password.', 401)

  await createSession({ userId: user.id, name: user.name, email: user.email })
  return ok({ id: user.id, name: user.name, email: user.email, role: user.role })
}
