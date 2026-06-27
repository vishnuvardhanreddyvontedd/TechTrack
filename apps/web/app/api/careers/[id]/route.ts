import { fail, ok } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const career = await prisma.careerTrack.findFirst({
    where: { OR: [{ id }, { slug: id }] },
  })
  if (!career) return fail('Career track not found', 404)
  return ok(career)
}
