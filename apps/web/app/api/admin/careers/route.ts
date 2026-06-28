import { z } from 'zod'
import { fail, ok, readJson, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const CareerSchema = z.object({
  title: z.string().min(2).max(120),
  slug: z.string().min(2).max(140),
  description: z.string().min(10).max(1000),
  category: z.enum(['FRONTEND', 'BACKEND', 'FULLSTACK', 'AI_ML', 'DEVOPS', 'MOBILE', 'DATA_SCIENCE', 'CYBERSECURITY', 'DESIGN', 'PRODUCT']),
  isActive: z.boolean().default(true),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  return ok(await prisma.careerTrack.findMany({ orderBy: { title: 'asc' } }))
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const body = await readJson(request, CareerSchema)
  if (body instanceof Response) return body
  return ok(await prisma.careerTrack.create({ data: body }), { status: 201 })
}
