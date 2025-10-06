import { TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    bg: 'bg-emerald-500/10 backdrop-blur-[8px]',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    bar: 'bg-gradient-to-r from-emerald-500/85 via-teal-500/85 to-cyan-500/85 backdrop-blur-[4px]',
  },
  warning: {
    bg: 'bg-amber-500/10 backdrop-blur-[8px]',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500/85 via-orange-500/85 to-rose-500/85 backdrop-blur-[4px]',
  },
  error: {
    bg: 'bg-red-500/10 backdrop-blur-[8px]',
    border: 'border-red-500/20',
    text: 'text-red-400',
    bar: 'bg-gradient-to-r from-red-500/85 via-pink-500/85 to-purple-500/85 backdrop-blur-[4px]',
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
                  <span className="text-sm font-medium text-white">
                    {step.label}
                  </span>
                  {dropoffFromPrevious && parseFloat(dropoffFromPrevious) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-red-400">
                      <TrendingDown className="h-3 w-3" />
                      -{dropoffFromPrevious}%
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {step.count.toLocaleString()}
                  </div>
                  <div className={`text-xs ${colors.text}`}>
                    {typeof step.percentage === 'number' ? step.percentage.toFixed(1) : step.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar - refined liquid glass */}
              <div className={cn(
                "rounded-[12px] border p-1",
                "shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
                colors.border,
                colors.bg
              )}>
                <div
                  className={cn(
                    "h-7 rounded-[8px] flex items-center justify-center",
                    "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                    "shadow-[0_1px_2px_rgba(0,0,0,0.1)]",
                    colors.bar
                  )}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {widthPercentage > 15 && (
                    <span className="text-xs font-semibold text-white drop-shadow-sm">
                      {typeof step.percentage === 'number' ? step.percentage.toFixed(1) : step.percentage}%
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
