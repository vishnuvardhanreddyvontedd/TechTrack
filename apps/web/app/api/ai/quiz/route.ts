import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'

const QuizSchema = z.object({ topic: z.string().min(2).max(120) })

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const body = await readJson(request, QuizSchema)
  if (body instanceof Response) return body

  return ok({
    topic: body.topic,
    questions: [
      {
        question: `What is the most important first principle behind ${body.topic}?`,
        choices: ['Understand the concept', 'Skip practice', 'Memorize only syntax', 'Avoid feedback'],
        answerIndex: 0,
      },
    ],
  })
}
