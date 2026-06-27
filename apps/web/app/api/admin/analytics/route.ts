import { fail, ok, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const [users, roadmaps, tasks, completions, aiMessages] = await Promise.all([
    prisma.user.count(),
    prisma.roadmap.count(),
    prisma.task.count(),
    prisma.taskCompletion.count(),
    prisma.aIMessage.count(),
  ])
  return ok({ users, roadmaps, tasks, completions, aiMessages })
}
