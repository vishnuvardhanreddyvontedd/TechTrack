import { fail, ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const career = await prisma.careerTrack.findUnique({ where: { id } })
  if (career) return ok(career)

  const template = await prisma.roadmapTemplate.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { dayTemplates: { orderBy: { dayNumber: 'asc' } } },
  })
  if (!template) return fail('Career track not found', 404)
  return ok(template)
}
