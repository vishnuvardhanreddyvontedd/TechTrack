import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-brand-400">TechTrack AI</Link>
        <h1 className="mt-6 text-4xl font-bold">An AI career operating system for learners.</h1>
        <p className="mt-6 leading-7 text-white/70">
          TechTrack AI helps students, job seekers, developers, and professionals turn an ambition into a daily execution loop:
          assess, plan, practice, earn momentum, get mentored, and become job-ready.
        </p>
      </section>
    </main>
  )
}
