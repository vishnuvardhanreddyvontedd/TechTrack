import Link from 'next/link'

const nav = [
  ['Dashboard', '/admin'],
  ['Users', '/admin/users'],
  ['Roadmaps', '/admin/roadmaps'],
  ['Career Tracks', '/admin/career-tracks'],
  ['AI Prompts', '/admin/ai-prompts'],
  ['Analytics', '/admin/analytics'],
  ['Settings', '/admin/settings'],
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-black/20 p-5 lg:block">
        <Link href="/" className="font-bold text-brand-400">TechTrack Admin</Link>
        <nav className="mt-8 grid gap-2">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6 lg:ml-64">{children}</main>
    </div>
  )
}
