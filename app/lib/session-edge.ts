// lib/session-edge.ts
// Edge-runtime-safe JWT decrypt — NO server-only import, NO Node.js APIs.
// Used ONLY by proxy.ts (edge runtime). All cookie management stays in session.ts.

import { jwtVerify } from 'jose'
import type { SessionPayload } from './session'

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET environment variable is not set.')
  return new TextEncoder().encode(secret)
}

export async function decryptEdge(
  token: string | undefined = ''
): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
