type TopBarProps = {
  variant?: 'light' | 'dark'
}

export function TopBar({ variant = 'light' }: TopBarProps) {
  const isDark = variant === 'dark'

  return (
    <header className={isDark
      ? "bg-gradient-to-r from-emerald-900 to-emerald-800 border-b border-emerald-950"
      : "bg-white border-b border-gray-200"
    }>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-center">
        <a href="/" className="inline-flex items-center" aria-label="DailyHush Home">
          <img
            src="/inline-logo.png"
            alt="DailyHush"
            className={`h-7 sm:h-8 md:h-9 w-auto ${isDark ? 'invert' : ''}`}
          />
        </a>
      </div>
    </header>
  )
}
