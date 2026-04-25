// app/(auth)/login/page.tsx
// Login page — Server Component.

import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/app/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to access your personalized tech career roadmap.',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen mesh-bg flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-600/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">TechTrack</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-[--text-primary] mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-[--text-secondary]">
              Continue where you left off
            </p>
          </div>

          {/* Streak reminder */}
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-[--streak-fire]/10 border border-[--streak-fire]/20">
            <span className="text-2xl flex-shrink-0" role="img" aria-label="fire">🔥</span>
            <p className="text-sm text-[--text-secondary] leading-snug">
              Don&apos;t break your streak! Your progress is waiting.
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[--text-muted]">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Get started today
          </Link>
        </p>
      </div>
    </main>
  )
}
