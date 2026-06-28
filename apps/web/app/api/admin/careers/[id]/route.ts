import { z } from 'zod'
import { fail, ok, readJson, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const CareerPatchSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  slug: z.string().min(2).max(140).optional(),
  description: z.string().min(10).max(1000).optional(),
  isActive: z.boolean().optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const body = await readJson(request, CareerPatchSchema)
  if (body instanceof Response) return body
  const { id } = await params
  return ok(await prisma.careerTrack.update({ where: { id }, data: body }))
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const { id } = await params
  await prisma.careerTrack.delete({ where: { id } })
  return ok({ deleted: true })
}
