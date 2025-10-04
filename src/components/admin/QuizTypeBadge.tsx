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
  'chronic-planner': {
    label: 'Chronic Planner',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '📋',
  },
  'research-addict': {
    label: 'Research Addict',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    icon: '🔍',
  },
  'self-doubter': {
    label: 'Self-Doubter',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    icon: '🤔',
  },
  'vision-hopper': {
    label: 'Vision Hopper',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '✨',
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
