import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { GlassCard } from '../../ui/glass-card'
import { cn } from '../../../lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'amber'
  loading?: boolean
  trend?: {
    value: number // percentage change
    direction: 'up' | 'down' | 'neutral'
  }
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtitle,
  variant = 'default',
  loading = false,
  trend,
}) => {
  const ringClass = {
    default: '',
    success: 'ring-1 ring-emerald-500/20',
    warning: 'ring-1 ring-amber-500/20',
    amber: 'ring-1 ring-amber-500/20',
  }[variant]

  const subtitleClass = {
    default: 'text-white/60',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    amber: 'text-amber-400',
  }[variant]

  const getTrendColor = () => {
    if (!trend) return ''
    if (trend.direction === 'up') return 'text-emerald-400'
    if (trend.direction === 'down') return 'text-red-400'
    return 'text-white/40'
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.direction === 'up') return <TrendingUp className="w-4 h-4" />
    if (trend.direction === 'down') return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  return (
    <GlassCard intensity="heavy" className={cn('p-5', ringClass)}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-white/70">{label}</div>
        {trend && !loading && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', getTrendColor())}>
            {getTrendIcon()}
            <span>{Math.abs(trend.value).toFixed(1)}%</span>
          </div>
        )}
      </div>
      {loading ? (
        <div className="h-10 bg-white/10 rounded animate-pulse mb-2" />
      ) : (
        <div className="text-3xl font-bold text-white mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
      )}
      {subtitle && (
        <div className={cn('text-sm', subtitleClass)}>
          {subtitle}
        </div>
      )}
    </GlassCard>
  )
}
