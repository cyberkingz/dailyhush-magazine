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
        bg: 'bg-red-100',
        fill: 'bg-red-500',
        text: 'text-red-700',
      }
    } else if (percentage >= 50) {
      return {
        bg: 'bg-amber-100',
        fill: 'bg-amber-500',
        text: 'text-amber-700',
      }
    } else if (percentage >= 25) {
      return {
        bg: 'bg-blue-100',
        fill: 'bg-blue-500',
        text: 'text-blue-700',
      }
    } else {
      return {
        bg: 'bg-green-100',
        fill: 'bg-green-500',
        text: 'text-green-700',
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
      <div className={`flex-1 rounded-full ${colors.bg} ${sizeClasses[size].container} overflow-hidden`}>
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
