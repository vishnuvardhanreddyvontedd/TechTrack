import { ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  return ok(await prisma.badge.findMany({ orderBy: { createdAt: 'asc' } }))
}
