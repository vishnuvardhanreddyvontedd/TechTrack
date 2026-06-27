import { z } from 'zod'
import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

type JsonStatus = ResponseInit & { status?: number }

export function ok<T>(data: T, init?: JsonStatus) {
  return Response.json({ ok: true, data }, init)
}

export function fail(error: string, status = 400, details?: unknown) {
  return Response.json({ ok: false, error, details }, { status })
}

export async function readJson<T extends z.ZodType>(request: Request, schema: T): Promise<z.infer<T> | Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return fail('Invalid JSON body', 400)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return fail('Validation failed', 422, parsed.error.flatten().fieldErrors)
  }

  return parsed.data
}

export async function requireSession() {
  const session = await getSession()
  if (!session) return null
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, role: true },
  })

  if (!user || user.role !== 'ADMIN') return null
  return { ...session, role: user.role }
}

const buckets = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (current.count >= limit) return false
  current.count += 1
  return true
}
