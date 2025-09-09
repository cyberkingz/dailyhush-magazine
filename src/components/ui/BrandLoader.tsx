import { cn } from '@/lib/utils'

interface BrandLoaderProps {
  message?: string
  fullScreen?: boolean
  className?: string
}

export function BrandLoader({
  message = 'Loading DailyHush…',
  fullScreen = true,
  className,
}: BrandLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'w-full flex items-center justify-center bg-white',
        fullScreen ? 'min-h-[60vh] md:min-h-screen' : 'py-12',
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Base ring */}
          <div className="h-12 w-12 rounded-full border-4 border-gray-200" />
          {/* Animated accent ring */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
        </div>
        <div className="text-gray-900 font-semibold tracking-tight">DailyHush</div>
        <div className="text-gray-500 text-sm" aria-hidden>
          {message}
        </div>
      </div>
    </div>
  )
}

