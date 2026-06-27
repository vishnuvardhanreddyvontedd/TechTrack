export default function MentorPage() {
  return (
    <main className="grid min-h-[70vh] gap-4 lg:grid-cols-[1fr_320px]">
      <section className="card flex flex-col p-5">
        <h1 className="text-2xl font-bold">AI Mentor</h1>
        <div className="mt-6 flex-1 rounded-lg bg-black/20 p-4 text-sm text-white/65">
          Ask for explanations, examples, practice questions, answer reviews, motivation, or what to learn next.
        </div>
        <form className="mt-4 flex gap-3">
          <input className="input-base" placeholder="Ask your mentor..." />
          <button className="btn-primary px-5" type="button">Send</button>
        </form>
      </section>
      <aside className="card p-5">
        <h2 className="font-semibold">Mentor context</h2>
        <p className="mt-3 text-sm leading-6 text-white/60">The API uses your goal, active roadmap, progress, XP, streak, and next tasks as context.</p>
      </aside>
    </main>
  )
}
