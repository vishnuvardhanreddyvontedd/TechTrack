import { z } from 'zod'

export const RoadmapAIResponseSchema = z.object({
  title: z.string(),
  durationWeeks: z.number().int().min(1),
  phases: z.array(z.object({
    title: z.string(),
    description: z.string(),
    modules: z.array(z.object({
      title: z.string(),
      description: z.string(),
      tasks: z.array(z.object({
        title: z.string(),
        description: z.string(),
        estimatedMinutes: z.number().int().min(15),
        xp: z.number().int().min(10),
        type: z.enum(['learning', 'coding', 'quiz', 'project', 'interview', 'portfolio']),
        resources: z.array(z.string()).default([]),
      })),
    })),
  })),
})

export type RoadmapAIResponse = z.infer<typeof RoadmapAIResponseSchema>

export type RoadmapContext = {
  name: string
  careerGoal: string
  skillLevel: string
  dailyAvailableMinutes: number
  existingSkills: string[]
  weakAreas: string[]
  targetTimelineWeeks: number
  preferredLearningStyle: string
}

export function buildRoadmapPrompt(context: RoadmapContext) {
  return `Generate a personalized JSON-only career roadmap for ${context.name}.
Career goal: ${context.careerGoal}
Skill level: ${context.skillLevel}
Daily available time: ${context.dailyAvailableMinutes} minutes
Existing skills: ${context.existingSkills.join(', ') || 'none listed'}
Weak areas: ${context.weakAreas.join(', ') || 'none listed'}
Target timeline: ${context.targetTimelineWeeks} weeks
Preferred learning style: ${context.preferredLearningStyle}

Return JSON only with title, durationWeeks, phases, modules, and tasks. Include projects, interview preparation, portfolio tasks, resources, practice exercises, estimatedMinutes, xp, and type.`
}

export function fallbackStructuredRoadmap(context: RoadmapContext): RoadmapAIResponse {
  const goal = context.careerGoal || 'Full Stack Developer'
  const durationWeeks = Math.max(4, Math.min(context.targetTimelineWeeks || 12, 24))

  return {
    title: `${goal} Roadmap`,
    durationWeeks,
    phases: [
      {
        title: 'Foundation',
        description: `Build the core concepts required for ${goal}.`,
        modules: [
          {
            title: 'Core Skills',
            description: 'Focus on fundamentals, vocabulary, and small exercises.',
            tasks: [
              {
                title: 'Map the role',
                description: `Research ${goal} job descriptions and identify recurring skills.`,
                estimatedMinutes: context.dailyAvailableMinutes,
                xp: 50,
                type: 'learning',
                resources: ['Job descriptions', 'Official documentation'],
              },
              {
                title: 'Build a basics checklist',
                description: 'Create a checklist of topics you can explain and topics that need practice.',
                estimatedMinutes: 45,
                xp: 50,
                type: 'portfolio',
                resources: ['Personal notes'],
              },
            ],
          },
        ],
      },
      {
        title: 'Practice',
        description: 'Turn concepts into daily practical work.',
        modules: [
          {
            title: 'Applied Projects',
            description: 'Ship small projects and get feedback loops running.',
            tasks: [
              {
                title: 'Ship a mini project',
                description: `Build a small ${goal} project that demonstrates one target skill.`,
                estimatedMinutes: context.dailyAvailableMinutes,
                xp: 200,
                type: 'project',
                resources: ['GitHub', 'Portfolio notes'],
              },
              {
                title: 'Interview drill',
                description: 'Answer five role-specific interview questions and review weak answers.',
                estimatedMinutes: 60,
                xp: 80,
                type: 'interview',
                resources: ['Interview question bank'],
              },
            ],
          },
        ],
      },
    ],
  }
}

export async function generateStructuredRoadmap(context: RoadmapContext): Promise<RoadmapAIResponse> {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) return fallbackStructuredRoadmap(context)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_ROADMAP_MODEL ?? 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You are the TechTrack Roadmap Agent. Return valid JSON only.' },
          { role: 'user', content: buildRoadmapPrompt(context) },
        ],
      }),
    })

    if (!response.ok) throw new Error(await response.text())
    const json = await response.json()
    const content = json.choices?.[0]?.message?.content
    const parsed = RoadmapAIResponseSchema.safeParse(JSON.parse(content))
    if (!parsed.success) throw new Error('AI roadmap JSON failed validation')
    return parsed.data
  } catch (error) {
    console.warn('[ai-agents] Roadmap AI failed, using fallback', error)
    return fallbackStructuredRoadmap(context)
  }
}

export async function mentorReply(message: string, context: string) {
  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return `Here is a focused next step: connect your question to today's roadmap task, write down what is unclear, then do one small practice rep. Context I considered: ${context.slice(0, 180)}`
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MENTOR_MODEL ?? 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are TechTrack AI Mentor. Be practical, concise, motivational, and grounded in the learner roadmap.' },
          { role: 'user', content: `Learner context:\n${context}\n\nQuestion:\n${message}` },
        ],
      }),
    })
    if (!response.ok) throw new Error(await response.text())
    const json = await response.json()
    return json.choices?.[0]?.message?.content ?? 'I could not generate a response. Try asking again with a little more context.'
  } catch {
    return 'I hit an AI provider issue. For now, take the smallest next task in your roadmap, timebox it for 25 minutes, and tell me exactly where you get stuck.'
  }
}
