// app/(auth)/signup/page.tsx
// Signup page — Server Component that renders the branded auth shell
// and lazily loads the client SignupForm.

import type { Metadata } from 'next'
import Link from 'next/link'
import SignupForm from '@/app/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Sign up and start your personalized tech career journey today.',
}

export default function SignupPage() {
  return (
    <main className="min-h-screen mesh-bg flex items-center justify-center p-4">
      {/* Ambient blobs */}
      <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-600/15 blur-3xl" />
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
              Start your journey
            </h1>
            <p className="text-sm text-[--text-secondary]">
              Get a personalized roadmap for your tech career
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {['🎯 Personalized paths', '🔥 Streak tracking', '⚡ XP & levels'].map((label) => (
              <span
                key={label}
                className="px-3 py-1 text-xs font-medium rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Form */}
          <SignupForm />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-[--text-muted]">
          By signing up you agree to our{' '}
          <span className="text-[--text-secondary] hover:text-[--text-primary] cursor-pointer transition-colors">Terms</span>
          {' & '}
          <span className="text-[--text-secondary] hover:text-[--text-primary] cursor-pointer transition-colors">Privacy Policy</span>
        </p>
      </div>
    </main>
  )
}
