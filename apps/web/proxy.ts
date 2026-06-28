// proxy.ts
// Next.js 16 Proxy (formerly middleware) — runs at the Edge before every request.
// Protects /dashboard/* routes: unauthenticated users are redirected to /login.
// Auth routes (/login, /signup) redirect authenticated users to /dashboard.
// The function MUST be named `proxy` (Next.js 16 convention).

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decryptEdge } from '@/app/lib/session-edge'

// Routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/onboarding', '/roadmap', '/profile', '/career-goals', '/daily-tasks', '/mentor', '/progress', '/settings', '/resume', '/mock-interview', '/admin']

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = ['/login', '/signup', '/register']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
}

function isAllowedApiOrigin(origin: string): boolean {
  if (!origin) return false
  if (origin.startsWith('http://localhost:')) return true
  if (origin.startsWith('http://127.0.0.1:')) return true

  const configured = process.env.MOBILE_APP_ORIGIN?.split(',')
    .map((value) => value.trim())
    .filter(Boolean) ?? []

  return configured.includes(origin)
}

function applyCorsHeaders(response: NextResponse, origin: string): NextResponse {
  if (isAllowedApiOrigin(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin') ?? ''

  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return applyCorsHeaders(new NextResponse(null, { status: 204 }), origin)
    }

    return applyCorsHeaders(NextResponse.next(), origin)
  }

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
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
