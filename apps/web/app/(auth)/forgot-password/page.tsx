import Link from 'next/link'

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="card w-full max-w-md p-6">
        <Link href="/" className="text-sm text-brand-400">TechTrack AI</Link>
        <h1 className="mt-6 text-2xl font-bold">Reset password</h1>
        <p className="mt-2 text-sm text-white/60">Supabase Auth or transactional email can be connected here for production password recovery.</p>
        <form className="mt-6 grid gap-4">
          <input className="input-base" placeholder="Email" type="email" />
          <button className="btn-primary px-5 py-3" type="button">Send reset link</button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm text-white/60">Back to login</Link>
      </section>
    </main>
  )
}
