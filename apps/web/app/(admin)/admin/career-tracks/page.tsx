import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminCareerTracksPage() {
  const tracks = await prisma.careerTrack.findMany({ orderBy: { title: 'asc' } })
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Career Tracks</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {tracks.map((track) => (
          <article key={track.id} className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{track.title}</h2>
              <span className="pill bg-white/10">{track.status}</span>
            </div>
            <p className="mt-2 text-sm text-white/60">{track.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
