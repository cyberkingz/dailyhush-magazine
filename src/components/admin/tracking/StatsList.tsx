import React from 'react'
import { Badge } from '../../ui/badge'

interface StatsListItem {
  label: string
  value: string | number
  badge?: {
    value: string | number
    variant?: 'default' | 'success' | 'warning' | 'destructive'
  }
}

interface StatsListProps {
  title: string
  items: StatsListItem[]
}

export const StatsList: React.FC<StatsListProps> = ({ title, items }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between pb-3 border-b border-white/10 last:border-0"
          >
            <span className="text-white font-medium">{item.label}</span>
            <div className="flex items-center gap-3">
              {typeof item.value !== 'undefined' && (
                <span className="text-white/60 text-sm">{item.value}</span>
              )}
              {item.badge && (
                <Badge variant={item.badge.variant || 'default'}>
                  {item.badge.value}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
