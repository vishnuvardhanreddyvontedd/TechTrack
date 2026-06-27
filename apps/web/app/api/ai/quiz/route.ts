import { z } from 'zod'
import { fail, ok, readJson, requireSession } from '@/app/lib/api'

const QuizSchema = z.object({
  topic: z.string().min(2).max(120),
})

export async function POST(request: Request) {
  const session = await requireSession()
  if (!session) return fail('Unauthorized', 401)
  const parsed = await readJson(request, QuizSchema)
  if (parsed instanceof Response) return parsed

  return ok({
    topic: parsed.topic,
    questions: [
      {
        prompt: `What is the most important concept to understand about ${parsed.topic}?`,
        choices: ['Core purpose', 'File name only', 'Color palette', 'Deployment region'],
        answerIndex: 0,
      },
    ],
  })
}
