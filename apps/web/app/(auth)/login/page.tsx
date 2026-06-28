// app/(auth)/login/page.tsx
// Login page — Server Component.

import type { Metadata } from 'next'
import Link from 'next/link'
import LoginForm from '@/app/components/auth/LoginForm'
import AuthTabs from '@/app/components/auth/AuthTabs'

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

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="TechTrack Logo"
              className="w-10 h-10 rounded-xl shadow-lg border border-[--border-subtle] group-hover:scale-105 transition-all duration-200 object-cover"
            />
            <span className="text-xl font-bold gradient-text">TechTrack</span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8 shadow-2xl border border-[--border-subtle]">
          {/* Navigation Tabs */}
          <AuthTabs activeTab="login" />

          {/* Streak reminder */}
          <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl bg-[--streak-fire]/10 border border-[--streak-fire]/20">
            <span className="text-2xl flex-shrink-0" role="img" aria-label="fire">🔥</span>
            <p className="text-sm text-[--text-secondary] leading-snug">
              Don&apos;t break your streak! Your personalized roadmaps and progress are waiting.
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[--text-muted]">
          By continuing, you agree to our{' '}
          <span className="text-[--text-secondary] hover:text-[--text-primary] cursor-pointer transition-colors">Terms of Service</span>
          {' & '}
          <span className="text-[--text-secondary] hover:text-[--text-primary] cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </main>
  )
}

