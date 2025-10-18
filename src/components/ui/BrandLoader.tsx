import { cn } from '@/lib/utils'

interface BrandLoaderProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export function BrandLoader({
  message = 'Loading…',
  fullScreen = true,
  className,
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'w-full flex items-center justify-center',
        fullScreen && 'fixed inset-0 z-50 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950',
        !fullScreen && 'min-h-[400px] py-12',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo with pulsing ring */}
        <div className="relative w-20 h-20 animate-float">
          {/* Pulsing ring */}
          <div className="absolute -inset-2 rounded-full border-2 border-emerald-500/50 animate-pulse-ring" />

          {/* Logo */}
          <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-emerald-500/30 shadow-[0_8px_32px_rgba(16,185,129,0.25)]">
            <img
              src="/rounded-logo.png"
              alt="DailyHush"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Status indicator dot */}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-emerald-900 animate-pulse" />
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className="w-10 h-10 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <p className="text-white/90 font-medium text-base tracking-wide animate-fade">
            {message}
          </p>
          <div className="flex gap-1 justify-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
