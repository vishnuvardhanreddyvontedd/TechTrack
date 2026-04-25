// components/auth/LoginForm.tsx
// Client Component — drives the login Server Action via useActionState.

'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { login } from '@/app/actions/auth'
import { type ActionState } from '@/app/lib/definitions'
import { Button } from '@/app/components/ui/Button'
import { Input }  from '@/app/components/ui/Input'

// ─── Icons ───────────────────────────────────────────────────────────────────
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon({ show }: { show: boolean }) {
  return show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LoginForm() {
  const [state, action, isPending] = useActionState<ActionState, FormData>(
    login,
    undefined
  )
  const [showPassword, setShowPassword] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Server-level error */}
      {state?.message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          role="alert"
        >
          {state.message}
        </motion.div>
      )}

      <form action={action} className="space-y-4">
        {/* Email */}
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          autoComplete="email"
          required
          leftIcon={<MailIcon />}
          error={state?.errors?.email?.[0]}
          disabled={isPending}
          id="login-email"
        />

        {/* Password */}
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            leftIcon={<LockIcon />}
            error={state?.errors?.password?.[0]}
            disabled={isPending}
            id="login-password"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-8 text-[--text-muted] hover:text-[--text-secondary] transition-colors"
          >
            <EyeIcon show={showPassword} />
          </button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          className="w-full mt-2"
          id="login-submit"
        >
          Sign in
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[--border-subtle]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="relative z-20 bg-[--bg-card] px-4 py-3 text-[--text-muted]">
            New to TechTrack?
          </span>
        </div>
      </div>

      <Link
        href="/signup"
        className="flex items-center justify-center w-full h-10 rounded-lg border border-[--border-default] text-sm text-[--text-secondary] hover:text-[--text-primary] hover:border-[--border-strong] transition-all duration-150"
      >
        Sign up for free
      </Link>
    </motion.div>
  )
}
