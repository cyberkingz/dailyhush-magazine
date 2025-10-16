import React from 'react'
import { GlassCard } from '../../ui/glass-card'
import { ChevronDown } from 'lucide-react'

interface FunnelStage {
  name: string
  value: number
  percentage: number
}

interface FunnelVisualizationProps {
  stages: FunnelStage[]
  loading?: boolean
  title?: string
}

export const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({
  stages,
  loading = false,
  title = 'Conversion Funnel'
}) => {
  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="h-96 bg-white/10 rounded animate-pulse" />
      </GlassCard>
    )
  }

  if (stages.length === 0) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="text-center text-white/60 py-12">
          No funnel data available
        </div>
      </GlassCard>
    )
  }

  const maxValue = stages[0]?.value || 1
  const getColor = (index: number) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
    return colors[index % colors.length]
  }

  return (
    <GlassCard intensity="heavy" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="space-y-4">
        {stages.map((stage, index) => {
          const width = (stage.value / maxValue) * 100
          const dropoff = index > 0 ? stages[index - 1].value - stage.value : 0
          const dropoffRate = index > 0 ? ((dropoff / stages[index - 1].value) * 100).toFixed(1) : '0'

          return (
            <div key={index}>
              {/* Stage */}
              <div className="relative">
                {/* Funnel Bar */}
                <div
                  className="relative h-20 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    width: `${Math.max(width, 20)}%`,
                    background: `linear-gradient(135deg, ${getColor(index)}dd, ${getColor(index)}99)`,
                    boxShadow: `0 4px 12px ${getColor(index)}40`,
                    marginLeft: `${(100 - width) / 2}%`
                  }}
                >
                  {/* Stage Content */}
                  <div className="absolute inset-0 flex items-center justify-between px-6">
                    <div className="flex-1">
                      <div className="text-white font-semibold text-sm">
                        {stage.name}
                      </div>
                      <div className="text-white/80 text-xs mt-1">
                        {stage.percentage.toFixed(1)}% of total
                      </div>
                    </div>
                    <div className="text-white font-bold text-2xl">
                      {stage.value.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Drop-off indicator */}
                {index < stages.length - 1 && dropoff > 0 && (
                  <div className="flex items-center justify-center mt-2 mb-2">
                    <ChevronDown className="w-4 h-4 text-white/40" />
                    <span className="text-xs text-white/60 ml-2">
                      -{dropoff} ({dropoffRate}% drop-off)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-white/60 mb-1">Starting Users</div>
            <div className="text-lg font-bold text-white">{stages[0]?.value.toLocaleString() || 0}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Converted</div>
            <div className="text-lg font-bold text-emerald-400">
              {stages[stages.length - 1]?.value.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/60 mb-1">Overall Rate</div>
            <div className="text-lg font-bold text-white">
              {stages[stages.length - 1]?.percentage.toFixed(1) || 0}%
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
