import { z } from 'zod'
import { fail, ok, readJson, requireAdmin } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const PromptSchema = z.object({
  key: z.string().min(2),
  agent: z.enum(['ROADMAP', 'MENTOR', 'INTERVIEW', 'RESUME', 'GITHUB_REVIEW', 'PROGRESS', 'JOB']),
  title: z.string().min(2),
  content: z.string().min(10),
})

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  return ok(await prisma.adminPrompt.findMany({ orderBy: { updatedAt: 'desc' } }))
}

export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) return fail('Forbidden', 403)
  const parsed = await readJson(request, PromptSchema)
  if (parsed instanceof Response) return parsed
  return ok(await prisma.adminPrompt.create({ data: parsed }), { status: 201 })
}
