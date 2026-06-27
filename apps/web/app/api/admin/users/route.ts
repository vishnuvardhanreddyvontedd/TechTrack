import { fail, ok, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, name: true, email: true, role: true, xp: true, level: true, createdAt: true },
  })
  return ok(users)
}
