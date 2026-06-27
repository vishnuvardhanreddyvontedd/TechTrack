import { prisma } from '@/app/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminPromptsPage() {
  const prompts = await prisma.adminPrompt.findMany({ orderBy: { updatedAt: 'desc' } })
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">AI Prompts</h1>
      <div className="grid gap-3">
        {prompts.map((prompt) => (
          <article key={prompt.id} className="card p-5">
            <p className="text-xs text-brand-400">{prompt.agent} v{prompt.version}</p>
            <h2 className="mt-1 font-semibold">{prompt.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-white/60">{prompt.content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
