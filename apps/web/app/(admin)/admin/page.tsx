import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [users, roadmaps, tasks] = await Promise.all([
    prisma.user.count(),
    prisma.roadmap.count(),
    prisma.task.count(),
  ])

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-white/55">Users</p><p className="mt-2 text-2xl font-bold">{users}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">Roadmaps</p><p className="mt-2 text-2xl font-bold">{roadmaps}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">Tasks</p><p className="mt-2 text-2xl font-bold">{tasks}</p></div>
      </div>
    </section>
  )
}
