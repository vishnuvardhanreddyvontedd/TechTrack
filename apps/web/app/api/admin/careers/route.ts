import { z } from 'zod'
import { fail, ok, readJson, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const CareerSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.enum(['FRONTEND', 'BACKEND', 'FULLSTACK', 'AI_ML', 'DEVOPS', 'MOBILE', 'DATA_SCIENCE', 'SECURITY', 'DESIGN', 'PRODUCT']),
  skills: z.array(z.string()).default([]),
  outcomes: z.array(z.string()).default([]),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  return ok(await prisma.careerTrack.findMany({ orderBy: { title: 'asc' } }))
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const parsed = await readJson(request, CareerSchema)
  if (parsed instanceof Response) return parsed
  return ok(await prisma.careerTrack.create({ data: parsed }), { status: 201 })
}
