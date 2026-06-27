import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DailyTasksPage() {
  const session = await getSession()
  const tasks = session
    ? await prisma.task.findMany({
        where: { roadmap: { userId: session.userId, isActive: true }, isComplete: false },
        orderBy: [{ dayNumber: 'asc' }, { createdAt: 'asc' }],
        take: 8,
      })
    : []

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Daily Tasks</h1>
      <div className="grid gap-3">
        {tasks.map((task) => (
          <article key={task.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-brand-400">Day {task.dayNumber}</p>
                <h2 className="mt-1 font-semibold">{task.customTitle ?? 'Roadmap task'}</h2>
                <p className="mt-2 text-sm text-white/60">{task.customDesc ?? 'Complete this planned roadmap activity.'}</p>
              </div>
              <span className="pill bg-white/10">{task.estimatedMinutes} min</span>
            </div>
          </article>
        ))}
        {tasks.length === 0 ? <p className="text-sm text-white/60">Generate a roadmap to unlock daily tasks.</p> : null}
      </div>
    </main>
  )
}
