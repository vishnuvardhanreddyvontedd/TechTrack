import Link from 'next/link'

const features = [
  ['AI roadmaps', 'Generate structured phases, modules, daily tasks, portfolio work, resources, and interview prep from a career goal.'],
  ['Daily execution', 'Turn long-term goals into focused daily learning, coding, quiz, and project tasks.'],
  ['Gamification', 'Earn XP, levels, streaks, and badges while keeping progress visible.'],
  ['AI mentor', 'Ask for explanations, examples, practice questions, motivation, and stuck-point diagnosis.'],
  ['Job readiness', 'Future-ready resume, mock interview, portfolio, and job-agent architecture.'],
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm text-brand-400">TechTrack AI</Link>
        <h1 className="mt-6 text-4xl font-bold">Career growth that turns plans into reps.</h1>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {features.map(([title, description]) => (
            <article key={title} className="card p-6">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
