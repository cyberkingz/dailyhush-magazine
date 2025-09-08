export default function Newsletter() {
  return (
    <main className="container-prose py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Newsletter</h1>
      <p>Subscribe via your provider (form POST later).</p>
      <form className="flex gap-2">
        <input className="border px-3 py-2 rounded w-full" placeholder="you@example.com" />
        <button type="button" className="bg-black text-white px-4 py-2 rounded">Subscribe</button>
      </form>
    </main>
  )
}

