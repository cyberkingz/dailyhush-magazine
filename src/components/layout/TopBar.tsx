export function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-center">
        <a href="/" className="inline-flex items-center" aria-label="DailyHush Home">
          <img src="/inline-logo.png" alt="DailyHush" className="h-5 sm:h-6 md:h-8 w-auto" />
        </a>
      </div>
    </header>
  )
}
