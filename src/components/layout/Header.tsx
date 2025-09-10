import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="inline-flex items-center" aria-label="DailyHush Home">
            <img src="/inline-logo.png" alt="DailyHush" className="h-6 md:h-8 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/newsletter" className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:bg-yellow-300 transition-colors">Subscribe</Link>
        </div>
      </div>
    </header>
  )
}
