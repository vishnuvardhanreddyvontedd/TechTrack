import { z } from 'zod'
import { fail, ok, readJson, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const PromptSchema = z.object({
  key: z.string().min(2).max(120),
  title: z.string().min(2).max(160),
  content: z.string().min(10),
  agentType: z.enum(['ROADMAP', 'MENTOR', 'INTERVIEW', 'RESUME', 'GITHUB_REVIEW', 'PROGRESS', 'JOB']),
  isActive: z.boolean().default(true),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  return ok(await prisma.adminPrompt.findMany({ orderBy: { updatedAt: 'desc' } }))
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const body = await readJson(request, PromptSchema)
  if (body instanceof Response) return body
  return ok(await prisma.adminPrompt.create({ data: body }), { status: 201 })
}
