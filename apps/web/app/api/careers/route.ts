import { ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const careers = await prisma.careerTrack.findMany({
    where: { isActive: true },
    orderBy: { title: 'asc' },
  })

  if (careers.length > 0) return ok(careers)

  const templates = await prisma.roadmapTemplate.findMany({ orderBy: { title: 'asc' } })
  return ok(templates.map((template) => ({
    id: template.id,
    title: template.title,
    slug: template.slug,
    description: template.description,
    category: template.category,
  })))
}
