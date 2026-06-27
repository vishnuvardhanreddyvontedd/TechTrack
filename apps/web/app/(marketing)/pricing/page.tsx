import Link from 'next/link'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-brand-400">TechTrack AI</Link>
        <h1 className="mt-6 text-4xl font-bold">Start free. Upgrade when the premium layer lands.</h1>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="card p-6">
            <h2 className="text-xl font-semibold">Free MVP</h2>
            <p className="mt-2 text-3xl font-bold">$0</p>
            <p className="mt-4 text-sm text-white/65">Roadmaps, daily tasks, XP, streaks, AI mentor basics, and progress tracking.</p>
          </article>
          <article className="card p-6">
            <h2 className="text-xl font-semibold">Premium Ready</h2>
            <p className="mt-2 text-3xl font-bold">Razorpay</p>
            <p className="mt-4 text-sm text-white/65">Schema, environment docs, and subscription model are ready for future paid plans.</p>
          </article>
        </div>
      </section>
    </main>
  )
}
