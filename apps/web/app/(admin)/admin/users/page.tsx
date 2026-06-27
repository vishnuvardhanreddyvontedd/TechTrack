import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="card overflow-hidden">
        {users.map((user) => (
          <div key={user.id} className="grid gap-2 border-b border-white/5 p-4 text-sm md:grid-cols-4">
            <span>{user.name}</span>
            <span className="text-white/60">{user.email}</span>
            <span>{user.role}</span>
            <span>{user.xp} XP</span>
          </div>
        ))}
      </div>
    </section>
  )
}
