interface QuizScoreIndicatorProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function QuizScoreIndicator({
  score,
  maxScore = 100,
  size = 'md',
  showLabel = true,
}: QuizScoreIndicatorProps) {
  const percentage = Math.round((score / maxScore) * 100)

  // Determine color based on score percentage
  const getColorClasses = () => {
    if (percentage >= 75) {
      return {
        bg: 'bg-red-500/20',
        fill: 'bg-red-500',
        text: 'text-red-200',
        border: 'border-red-500/30',
      }
    } else if (percentage >= 50) {
      return {
        bg: 'bg-amber-500/20',
        fill: 'bg-amber-500',
        text: 'text-amber-200',
        border: 'border-amber-500/30',
      }
    } else if (percentage >= 25) {
      return {
        bg: 'bg-emerald-500/15',
        fill: 'bg-emerald-500',
        text: 'text-emerald-200',
        border: 'border-emerald-500/25',
      }
    } else {
      return {
        bg: 'bg-emerald-500/20',
        fill: 'bg-emerald-500',
        text: 'text-emerald-200',
        border: 'border-emerald-500/30',
      }
    }
  }

  const colors = getColorClasses()

  const sizeClasses = {
    sm: {
      container: 'h-2',
      text: 'text-xs',
    },
    md: {
      container: 'h-3',
      text: 'text-sm',
    },
    lg: {
      container: 'h-4',
      text: 'text-base',
    },
  }

  return (
    <div className="flex items-center gap-3">
      {/* Progress bar */}
      <div className={`flex-1 rounded-full border backdrop-blur-[8px] ${colors.bg} ${colors.border} ${sizeClasses[size].container} overflow-hidden`}>
        <div
          className={`h-full rounded-full ${colors.fill} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Score label */}
      {showLabel && (
        <span className={`font-semibold ${colors.text} ${sizeClasses[size].text} min-w-[3rem] text-right`}>
          {score}/{maxScore}
        </span>
      )}
    </div>
  )
}
