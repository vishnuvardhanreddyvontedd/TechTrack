import { fail, ok, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const profile = await prisma.profile.findUnique({ where: { userId: session.userId } })
  return ok({ completed: Boolean(profile?.onboardingCompletedAt), profile })
}
