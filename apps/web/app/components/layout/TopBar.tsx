// app/components/layout/TopBar.tsx
// Mobile top bar + desktop user info strip.

import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'
import { calcLevel, xpToNextLevel } from '@/app/types/index'
import { ProgressBar } from '@/app/components/ui/ProgressBar'

export default async function TopBar() {
  const session = await getSession()
  if (!session) return null

  let user = null
  try {
    user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { xp: true, level: true, currentStreak: true, name: true, avatarUrl: true },
    })
  } catch (err) {
    // Log server-side and fail gracefully when the DB is unavailable
    // (e.g. local Postgres not running). Avoid crashing the app UI.
    // eslint-disable-next-line no-console
    console.error('TopBar: failed to load user from Prisma', err)
    return null
  }

  if (!user) return null

  const level = calcLevel(user.xp)
  const { needed, current } = xpToNextLevel(user.xp, level)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-14 border-b border-[--border-subtle] bg-[--bg-surface]/80 backdrop-blur-md">
      {/* Left: Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <img
          src="/logo.png"
          alt="TechTrack Logo"
          className="w-7 h-7 rounded-lg border border-[--border-subtle] object-cover"
        />
        <span className="text-sm font-bold gradient-text">TechTrack</span>
      </div>

      {/* Right: XP bar + streak */}
      <div className="ml-auto flex items-center gap-4">
        {/* Streak */}
        {user.currentStreak > 0 && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-[--streak-fire]">
            <span role="img" aria-label="Fire streak">🔥</span>
            <span>{user.currentStreak}</span>
          </div>
        )}

        {/* XP pill */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold gradient-text-gold">Lv.{level}</span>
              <span className="text-xs text-[--text-muted]">{user.xp} XP</span>
            </div>
            <ProgressBar value={current} max={needed} height={4} color="gold" animated={false} className="w-28" />
          </div>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full border border-[--border-subtle] overflow-hidden select-none" aria-label={`${user.name} avatar`}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
