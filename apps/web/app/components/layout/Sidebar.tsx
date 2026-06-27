'use client'
// app/components/layout/Sidebar.tsx

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { logout } from '@/app/actions/auth'

const NAV = [
  { href: '/dashboard', label: 'Dashboard',  icon: GridIcon },
  { href: '/create',    label: 'Create',     icon: SparklesIcon },
  { href: '/analytics', label: 'Analytics',  icon: BarChartIcon },
  { href: '/profile',   label: 'Profile',    icon: UserIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0 bg-[--bg-surface] overflow-hidden">
      {/* Subtle left edge glow */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.04)] to-transparent" />

      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 px-5 py-6 group">
        <img
          src="/logo.png"
          alt="TechTrack Logo"
          className="w-9 h-9 rounded-xl border border-[--border-subtle] object-cover shadow-lg"
        />
        <div>
          <span className="text-base font-bold gradient-text group-hover:opacity-80 transition-opacity">TechTrack</span>
          <p className="text-[10px] text-[--text-muted] -mt-0.5">Career Navigator</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5" aria-label="Main navigation">
        {NAV.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive ? 'text-white' : 'text-[--text-muted] hover:text-[--text-secondary]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-xl gradient-brand opacity-90"
                  style={{ boxShadow: 'var(--glow-brand)' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[--bg-muted]" />
              )}
              <span className="relative z-10 flex-shrink-0"><item.icon /></span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Create CTA */}
      <div className="px-3 pb-3">
        <Link href="/create" className="block w-full py-2.5 rounded-xl btn-primary text-center text-sm font-semibold" id="sidebar-create-btn">
          + New Roadmap
        </Link>
      </div>

      {/* Logout */}
      <div className="px-3 pb-5">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[--text-muted] hover:text-red-400 hover:bg-red-500/8 transition-all duration-150"
            id="logout-btn"
          >
            <LogoutIcon />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}

function GridIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>
}
function SparklesIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l1.88 5.47L19 10l-5.12 1.53L12 17l-1.88-5.47L5 10l5.12-1.53z"/><path d="M5 3l.94 2.74L8.5 7l-2.56.76L5 10l-.94-2.74L1.5 7l2.56-.76z"/><path d="M19 17l.94 2.74L22.5 21l-2.56.76L19 24l-.94-2.74L15.5 21l2.56-.76z"/></svg>
}
function BarChartIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
}
function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
}
function LogoutIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
}
