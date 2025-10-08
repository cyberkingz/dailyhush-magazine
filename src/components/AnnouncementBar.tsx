import type { ReactNode } from 'react'

interface AnnouncementBarProps {
  message: ReactNode
  icon?: string
  variant?: 'emerald' | 'amber' | 'blue'
}

export default function AnnouncementBar({
  message,
  icon = '🎯',
  variant = 'emerald'
}: AnnouncementBarProps) {
  const variantStyles = {
    emerald: 'bg-gradient-to-r from-emerald-900 to-emerald-800',
    amber: 'bg-gradient-to-r from-amber-600 to-amber-500',
    blue: 'bg-gradient-to-r from-blue-600 to-blue-500'
  }

  return (
    <div className={`${variantStyles[variant]} text-white py-3 px-6 text-center`}>
      <p className="text-sm md:text-base font-medium">
        {icon} {message}
      </p>
    </div>
  )
}
