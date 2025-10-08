import { Link } from 'react-router-dom'

export function Header({ onSubscribeClick }: { onSubscribeClick?: () => void }) {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="inline-flex items-center" aria-label="DailyHush Home">
            <img src="/inline-logo.png" alt="DailyHush" className="h-6 md:h-8 w-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {onSubscribeClick ? (
            <button
              type="button"
              onClick={onSubscribeClick}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95"
            >
              Subscribe
            </button>
          ) : (
            <Link to="/newsletter" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95">Subscribe</Link>
          )}
        </div>
      </div>
    </header>
  )
}
