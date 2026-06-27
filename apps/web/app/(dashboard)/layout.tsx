// app/(dashboard)/layout.tsx
// Authenticated shell layout — wraps all /(dashboard)/* pages.
// Server-side auth guard: if no session, redirect to /login.

import { redirect } from 'next/navigation'
import { getSession } from '@/app/lib/session'
import Sidebar from '@/app/components/layout/Sidebar'
import TopBar from '@/app/components/layout/TopBar'
import MobileNav from '@/app/components/layout/MobileNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Secondary auth guard (proxy.ts is the primary).
  // This handles edge cases where proxy is bypassed (e.g. direct API calls).
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex h-full min-h-screen bg-[--bg-base]">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar — mobile + desktop */}
        <TopBar />

        {/* Page content — pb-20 on mobile to clear the fixed bottom nav */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <MobileNav />
    </div>
  )
}
