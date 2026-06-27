import { z } from 'zod'
import { fail, ok, readJson, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const CareerUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  skills: z.array(z.string()).optional(),
  outcomes: z.array(z.string()).optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const parsed = await readJson(request, CareerUpdateSchema)
  if (parsed instanceof Response) return parsed
  const { id } = await params
  return ok(await prisma.careerTrack.update({ where: { id }, data: parsed }))
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const { id } = await params
  return ok(await prisma.careerTrack.update({ where: { id }, data: { status: 'ARCHIVED' } }))
}
