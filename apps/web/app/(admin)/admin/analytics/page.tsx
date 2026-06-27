import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  const [completions, xpTransactions, aiMessages] = await Promise.all([
    prisma.taskCompletion.count(),
    prisma.xPTransaction.count(),
    prisma.aIMessage.count(),
  ])
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-5"><p className="text-sm text-white/55">Task completions</p><p className="mt-2 text-2xl font-bold">{completions}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">XP events</p><p className="mt-2 text-2xl font-bold">{xpTransactions}</p></div>
        <div className="card p-5"><p className="text-sm text-white/55">AI messages</p><p className="mt-2 text-2xl font-bold">{aiMessages}</p></div>
      </div>
    </section>
  )
}
