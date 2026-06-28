import { z } from 'zod'
import { fail, ok, rateLimit, readJson, requireSession } from '@/app/lib/api'
import { prisma } from '@/app/lib/prisma'

const MentorSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  if (!rateLimit(`mentor:${session.userId}`, 12, 60_000)) return fail('Rate limit exceeded', 429)

  const body = await readJson(request, MentorSchema)
  if (body instanceof Response) return body

  const conversation = body.conversationId
    ? await prisma.aIConversation.findFirst({ where: { id: body.conversationId, userId: session.userId } })
    : await prisma.aIConversation.create({ data: { userId: session.userId, type: 'MENTOR', title: 'AI Mentor' } })

  if (!conversation) return fail('Conversation not found', 404)

  await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: 'USER', content: body.message },
  })

  const reply = 'Here is a focused next step: break the topic into one concept, one practice task, and one reflection. Share your answer and I will review it.'

  await prisma.aIMessage.create({
    data: { conversationId: conversation.id, role: 'ASSISTANT', content: reply, model: 'local-fallback' },
  })

  return ok({ conversationId: conversation.id, reply })
}
