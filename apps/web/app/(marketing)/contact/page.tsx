import Link from 'next/link'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <section className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-brand-400">TechTrack AI</Link>
        <h1 className="mt-6 text-4xl font-bold">Contact</h1>
        <p className="mt-6 leading-7 text-white/70">
          Use this starter page for support, partnerships, feedback, and early access requests.
        </p>
        <form className="mt-8 grid gap-4">
          <input className="input-base" placeholder="Name" />
          <input className="input-base" placeholder="Email" type="email" />
          <textarea className="input-base min-h-32" placeholder="Message" />
          <button className="btn-primary px-5 py-3" type="button">Send message</button>
        </form>
      </section>
    </main>
  )
}
