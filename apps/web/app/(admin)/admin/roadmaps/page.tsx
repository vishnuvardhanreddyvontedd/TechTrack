import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminRoadmapsPage() {
  const roadmaps = await prisma.roadmap.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, take: 50 })
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Roadmaps</h1>
      <div className="grid gap-3">
        {roadmaps.map((roadmap) => (
          <article key={roadmap.id} className="card p-4">
            <h2 className="font-semibold">{roadmap.title ?? roadmap.customGoal ?? 'Untitled roadmap'}</h2>
            <p className="mt-1 text-sm text-white/60">{roadmap.user.name} - {roadmap.status} - {roadmap.durationDays} days</p>
          </article>
        ))}
      </div>
    </section>
  )
}
