// proxy.ts
// Next.js 16 Proxy (formerly middleware) — runs at the Edge before every request.
// Protects /dashboard/* routes: unauthenticated users are redirected to /login.
// Auth routes (/login, /signup) redirect authenticated users to /dashboard.
// The function MUST be named `proxy` (Next.js 16 convention).

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptEdge } from '@/app/lib/session-edge'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/onboarding', '/roadmap', '/profile']

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup']

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Read and decrypt the session cookie
  const sessionToken = request.cookies.get('roadmap_session')?.value
  const session = await decryptEdge(sessionToken)

  // Authenticated user hitting an auth page → redirect to dashboard
  if (isAuthRoute(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Unauthenticated user hitting a protected page → redirect to login
  if (isProtectedRoute(pathname) && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Apply to all routes except static files and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
