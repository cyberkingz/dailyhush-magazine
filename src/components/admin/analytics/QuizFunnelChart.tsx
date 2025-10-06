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
    bg: 'bg-emerald-100/80',
    border: 'border-emerald-300',
    text: 'text-emerald-800',
    bar: 'bg-emerald-600',
  },
  warning: {
    bg: 'bg-amber-100/80',
    border: 'border-amber-300',
    text: 'text-amber-800',
    bar: 'bg-amber-600',
  },
  error: {
    bg: 'bg-red-100/80',
    border: 'border-red-300',
    text: 'text-red-800',
    bar: 'bg-red-600',
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
