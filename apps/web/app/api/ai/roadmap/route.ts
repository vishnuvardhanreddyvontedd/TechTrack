import { z } from 'zod'
import { fail, ok, rateLimit, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'
import { generateStructuredRoadmap } from '@/app/services/ai-agents'

const RoadmapRequestSchema = z.object({
  careerGoal: z.string().min(2).max(120),
  skillLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).default('BEGINNER'),
  dailyAvailableMinutes: z.number().int().min(15).max(480).default(60),
  existingSkills: z.array(z.string()).default([]),
  weakAreas: z.array(z.string()).default([]),
  targetTimelineWeeks: z.number().int().min(1).max(104).default(12),
  preferredLearningStyle: z.string().default('MIXED'),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  if (!rateLimit(`ai-roadmap:${session.userId}`, 5, 60_000)) return fail('Too many AI requests', 429)

  const parsed = await readJson(request, RoadmapRequestSchema)
  if (parsed instanceof Response) return parsed

  const roadmap = await generateStructuredRoadmap({ name: session.name, ...parsed })

  const saved = await prisma.$transaction(async (tx) => {
    const record = await tx.roadmap.create({
      data: {
        userId: session.userId,
        customGoal: parsed.careerGoal,
        title: roadmap.title,
        durationDays: roadmap.durationWeeks * 7,
        aiProvider: process.env.OPENAI_API_KEY ? 'openai' : 'fallback',
        aiModel: process.env.OPENAI_ROADMAP_MODEL ?? 'local-template',
        promptVersion: 'roadmap.v1',
      },
    })

    for (const [phaseIndex, phase] of roadmap.phases.entries()) {
      const phaseRecord = await tx.roadmapPhase.create({
        data: {
          roadmapId: record.id,
          title: phase.title,
          description: phase.description,
          order: phaseIndex + 1,
        },
      })

      for (const [moduleIndex, module] of phase.modules.entries()) {
        const moduleRecord = await tx.roadmapModule.create({
          data: {
            phaseId: phaseRecord.id,
            title: module.title,
            description: module.description,
            order: moduleIndex + 1,
          },
        })

        await tx.task.createMany({
          data: module.tasks.map((task, taskIndex) => ({
            roadmapId: record.id,
            moduleId: moduleRecord.id,
            dayNumber: taskIndex + 1 + moduleIndex * 7 + phaseIndex * 14,
            customTitle: task.title,
            customDesc: task.description,
            estimatedMinutes: task.estimatedMinutes,
            xpAwarded: task.xp,
            resources: task.resources,
            type: task.type.toUpperCase() as 'LEARNING',
          })),
        })
      }
    }

    return record
  })

  return ok({ roadmap, savedRoadmapId: saved.id }, { status: 201 })
}
