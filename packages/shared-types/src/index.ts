export type UserRole = 'LEARNER' | 'ADMIN' | 'MENTOR' | 'ORG_ADMIN'
export type TaskType = 'LEARNING' | 'CODING' | 'QUIZ' | 'PROJECT' | 'INTERVIEW' | 'PORTFOLIO'
export type RoadmapStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED'

export type ApiSuccess<T> = {
  ok: true
  data: T
}

export type ApiFailure = {
  ok: false
  error: string
  details?: unknown
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export type RoadmapGenerationInput = {
  name: string
  careerGoal: string
  skillLevel: string
  dailyAvailableMinutes: number
  preferredLearningStyle: string
  targetTimelineWeeks: number
  existingSkills: string[]
  weakAreas: string[]
}

export type GeneratedRoadmapTask = {
  title: string
  description: string
  estimatedMinutes: number
  xp: number
  type: TaskType
  resources?: string[]
}

export type GeneratedRoadmapModule = {
  title: string
  description?: string
  tasks: GeneratedRoadmapTask[]
}

export type GeneratedRoadmapPhase = {
  title: string
  description: string
  modules: GeneratedRoadmapModule[]
}

export type GeneratedRoadmap = {
  title: string
  durationWeeks: number
  phases: GeneratedRoadmapPhase[]
}
