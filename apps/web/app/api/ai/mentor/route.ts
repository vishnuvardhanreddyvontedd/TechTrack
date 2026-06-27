import { z } from 'zod'
import { fail, ok, rateLimit, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'
import { mentorReply } from '@/app/services/ai-agents'

const MentorSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  if (!rateLimit(`ai-mentor:${session.userId}`, 20, 60_000)) return fail('Too many AI requests', 429)

  const parsed = await readJson(request, MentorSchema)
  if (parsed instanceof Response) return parsed

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      profile: true,
      roadmaps: { where: { isActive: true }, include: { tasks: { take: 5, orderBy: { dayNumber: 'asc' } } }, take: 1 },
    },
  })
  if (!user) return fail('Unauthorized', 401)

  const context = JSON.stringify({
    goal: user.profile?.careerGoal,
    level: user.level,
    xp: user.xp,
    streak: user.currentStreak,
    activeRoadmap: user.roadmaps[0]?.title,
    nextTasks: user.roadmaps[0]?.tasks.map((task) => task.customTitle),
  })

  const conversation = parsed.conversationId
    ? await prisma.aIConversation.findFirst({ where: { id: parsed.conversationId, userId: session.userId } })
    : await prisma.aIConversation.create({ data: { userId: session.userId, type: 'MENTOR', title: parsed.message.slice(0, 80) } })

  if (!conversation) return fail('Conversation not found', 404)

  await prisma.aIMessage.create({ data: { conversationId: conversation.id, role: 'USER', content: parsed.message } })
  const reply = await mentorReply(parsed.message, context)
  const assistantMessage = await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: 'ASSISTANT', content: reply },
  })

  return ok({ conversationId: conversation.id, message: assistantMessage })
}
