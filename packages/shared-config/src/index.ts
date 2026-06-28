import { z } from 'zod'

export const CAREER_TRACKS = [
  'Flutter Developer',
  'Full Stack Developer',
  'AI Engineer',
  'Data Analyst',
  'DevOps Engineer',
  'Backend Developer',
  'Frontend Developer',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Product Manager',
] as const

export const XP_REWARDS = {
  task: 50,
  quiz: 30,
  project: 200,
  streak7Day: 150,
} as const

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(24),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
