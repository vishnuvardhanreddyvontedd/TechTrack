// components/auth/AuthTabs.tsx
// Renders the high-quality interactive tabs at the top of the authentication pages

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface AuthTabsProps {
  activeTab: 'login' | 'signup'
}

export default function AuthTabs({ activeTab }: AuthTabsProps) {
  return (
    <div className="flex p-1.5 rounded-xl bg-[--bg-muted] shadow-inner mb-6 relative border border-[--border-subtle]">
      {/* Background slider for the active tab */}
      <div className="absolute inset-y-1.5 left-1.5 right-1.5 flex pointer-events-none">
        <motion.div
          className="h-full w-1/2 rounded-lg bg-gradient-to-r from-brand-600 to-accent-600 shadow-lg"
          initial={false}
          animate={{
            x: activeTab === 'signup' ? '100%' : '0%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Login Tab */}
      <Link
        href="/login"
        className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-colors relative z-10 outline-none ${
          activeTab === 'login'
            ? 'text-white'
            : 'text-[--text-secondary] hover:text-[--text-primary]'
        }`}
      >
        Sign In
      </Link>

      {/* Signup Tab */}
      <Link
        href="/signup"
        className={`flex-1 py-2 text-center text-sm font-semibold rounded-lg transition-colors relative z-10 outline-none ${
          activeTab === 'signup'
            ? 'text-white'
            : 'text-[--text-secondary] hover:text-[--text-primary]'
        }`}
      >
        Create Account
      </Link>
    </div>
  )
}
