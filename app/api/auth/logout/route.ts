// app/api/auth/logout/route.ts
// Clears the session cookie and redirects to /login.
// Used when a valid JWT session references a userId that no longer exists in DB.

import { deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'

export async function GET() {
  await deleteSession()
  redirect('/login')
}
