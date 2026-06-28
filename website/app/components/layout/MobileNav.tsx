'use client'
// app/components/layout/MobileNav.tsx
// Fixed bottom navigation for mobile screens.
// Mirrors the sidebar nav items for thumb-reachable navigation.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" x2="18" y1="20" y2="10" /><line x1="12" x2="12" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" />
    </svg>
  )
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Home',    icon: <HomeIcon /> },
  { href: '/create',    label: 'Create',  icon: <PlusIcon /> },
  { href: '/analytics', label: 'Stats',   icon: <BarChartIcon /> },
  { href: '/profile',   label: 'Profile', icon: <UserIcon /> },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[--border-subtle] bg-[--bg-surface]/90 backdrop-blur-md"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium
                transition-colors duration-150
                ${isActive ? 'text-brand-400' : 'text-[--text-muted] hover:text-[--text-secondary]'}
              `}
              id={`mobile-nav-${item.href.replace('/', '')}`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.div
                  layoutId="mobile-active-dot"
                  className="absolute top-1.5 w-1 h-1 rounded-full bg-brand-400"
                  transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                />
              )}

              <span className={isActive ? 'text-brand-400' : ''}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* iOS safe area spacer */}
      <div className="h-safe-bottom bg-[--bg-surface]/90" />
    </nav>
  )
}
