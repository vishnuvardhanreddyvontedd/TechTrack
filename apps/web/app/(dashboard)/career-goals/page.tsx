import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function CareerGoalsPage() {
  const tracks = await prisma.careerTrack.findMany({ where: { status: 'ACTIVE' }, orderBy: { title: 'asc' } })

  return (
    <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Career Goals</h1>
        <p className="mt-2 text-sm text-white/60">Choose a target role to generate a personalized roadmap.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {tracks.map((track) => (
          <article key={track.id} className="card p-5">
            <p className="text-xs uppercase tracking-wide text-brand-400">{track.category}</p>
            <h2 className="mt-2 text-lg font-semibold">{track.title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">{track.description}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
