import { ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const careers = await prisma.careerTrack.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { title: 'asc' },
  })
  return ok(careers)
}
