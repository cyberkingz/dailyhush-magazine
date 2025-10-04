import type { OverthinkerType } from '../../types/quiz'

interface QuizTypeBadgeProps {
  type: OverthinkerType
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const typeConfig: Record<
  OverthinkerType,
  {
    label: string
    bgColor: string
    textColor: string
    icon: string
  }
> = {
  'mindful-thinker': {
    label: 'Mindful Thinker',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '🧘',
  },
  'gentle-analyzer': {
    label: 'Gentle Analyzer',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🤔',
  },
  'chronic-overthinker': {
    label: 'Chronic Overthinker',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: '🌀',
  },
  'overthinkaholic': {
    label: 'Overthinkaholic',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '🔥',
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export function QuizTypeBadge({
  type,
  size = 'md',
  showIcon = true,
}: QuizTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${config.bgColor} ${config.textColor} ${sizeClasses[size]}
      `}
    >
      {showIcon && <span className="text-sm">{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  )
}
