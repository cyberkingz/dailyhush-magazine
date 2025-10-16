import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { GlassCard } from '../../ui/glass-card'
import type { Lead } from '../../../lib/types/leads'

interface LeadSourceChartProps {
  leads: Lead[]
  loading?: boolean
}

interface SourceData {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

const COLORS = [
  '#10b981', // emerald
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
]

const SOURCE_LABELS: Record<string, string> = {
  home: 'Home Page',
  article: 'Blog Articles',
  'blog-index': 'Blog Index',
  newsletter: 'Newsletter Page',
  category: 'Category Pages',
  contact: 'Contact Page',
  about: 'About Page',
  quiz: 'Quiz Page',
}

export const LeadSourceChart: React.FC<LeadSourceChartProps> = ({ leads, loading = false }) => {
  const sourceData = useMemo(() => {
    const sourceCounts = new Map<string, number>()

    leads.forEach(lead => {
      const source = lead.source_page || 'unknown'
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1)
    })

    const data: SourceData[] = Array.from(sourceCounts.entries())
      .map(([source, count], index) => ({
        name: SOURCE_LABELS[source] || source.charAt(0).toUpperCase() + source.slice(1),
        value: count,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)

    return data
  }, [leads])

  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
        <div className="h-80 bg-white/10 rounded animate-pulse" />
      </GlassCard>
    )
  }

  if (sourceData.length === 0) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>
        <div className="text-center text-white/60 py-12">
          No source data available
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard intensity="heavy" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Lead Sources</h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={sourceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) => {
              const { name, percent } = props
              return `${name}: ${((percent || 0) * 100).toFixed(0)}%`
            }}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {sourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [`${value} leads`, 'Count']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Top Sources List */}
      <div className="mt-6 space-y-2">
        <div className="text-sm font-medium text-white/70 mb-3">Top Performers</div>
        {sourceData.slice(0, 5).map((source, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              <span className="text-sm text-white">{source.name}</span>
            </div>
            <span className="text-sm font-medium text-white">
              {source.value} ({((source.value / leads.length) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}
