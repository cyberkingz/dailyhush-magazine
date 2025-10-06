import { TrendingDown } from 'lucide-react'

interface FunnelStep {
  label: string
  count: number
  percentage: number
  color: 'success' | 'warning' | 'error'
}

interface QuizFunnelChartProps {
  steps: FunnelStep[]
  layout?: 'horizontal' | 'vertical'
  className?: string
}

const colorStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    bar: 'bg-green-500',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    bar: 'bg-amber-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    bar: 'bg-red-500',
  },
}

export function QuizFunnelChart({
  steps,
  className = '',
}: QuizFunnelChartProps) {
  const maxCount = steps[0]?.count || 1

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Funnel Visualization */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const colors = colorStyles[step.color]
          const widthPercentage = (step.count / maxCount) * 100
          const dropoffFromPrevious = index > 0
            ? ((steps[index - 1].count - step.count) / steps[index - 1].count * 100).toFixed(1)
            : null

          return (
            <div key={step.label} className="space-y-2">
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {step.label}
                  </span>
                  {dropoffFromPrevious && parseFloat(dropoffFromPrevious) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-red-600">
                      <TrendingDown className="h-3 w-3" />
                      -{dropoffFromPrevious}%
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {step.count.toLocaleString()}
                  </div>
                  <div className={`text-xs ${colors.text}`}>
                    {step.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={`rounded-lg border ${colors.border} ${colors.bg} p-1`}>
                <div
                  className={`h-8 rounded-md ${colors.bar} transition-all duration-500 flex items-center justify-center`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {widthPercentage > 15 && (
                    <span className="text-xs font-semibold text-white">
                      {step.percentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
