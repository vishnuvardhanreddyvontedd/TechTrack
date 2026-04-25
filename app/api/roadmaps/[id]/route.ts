// app/api/roadmaps/[id]/route.ts
// GET    /api/roadmaps/[id] — get one roadmap with full task data
// DELETE /api/roadmaps/[id] — soft-delete (set isActive=false)

import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import type { ApiError, ApiSuccess } from '@/app/types/index'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  }

  const { id } = await params

  const roadmap = await prisma.roadmap.findFirst({
    where: { id, userId: session.userId },
    include: {
      template: { include: { dayTemplates: { orderBy: { dayNumber: 'asc' } } } },
      tasks: { orderBy: { dayNumber: 'asc' } },
    },
  })

  if (!roadmap) {
    return Response.json({ error: 'Roadmap not found' } satisfies ApiError, { status: 404 })
  }

  return Response.json({ data: roadmap } satisfies ApiSuccess)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' } satisfies ApiError, { status: 401 })
  }

  const { id } = await params

  const roadmap = await prisma.roadmap.findFirst({
    where: { id, userId: session.userId },
  })

  if (!roadmap) {
    return Response.json({ error: 'Roadmap not found' } satisfies ApiError, { status: 404 })
  }

  await prisma.roadmap.update({
    where: { id },
    data: { isActive: false },
  })

  return Response.json({ data: null, message: 'Roadmap archived.' } satisfies ApiSuccess)
}
