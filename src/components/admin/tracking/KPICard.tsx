import React from 'react'
import { GlassCard } from '../../ui/glass-card'
import { cn } from '../../../lib/utils'

interface KPICardProps {
  label: string
  value: string | number
  subtitle?: string
  variant?: 'default' | 'success' | 'warning' | 'amber'
  loading?: boolean
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtitle,
  variant = 'default',
  loading = false,
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

  return (
    <GlassCard intensity="heavy" className={cn('p-5', ringClass)}>
      <div className="text-sm text-white/70 mb-2">{label}</div>
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
