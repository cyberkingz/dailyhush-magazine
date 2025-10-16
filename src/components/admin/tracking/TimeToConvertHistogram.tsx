import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { GlassCard } from '../../ui/glass-card'
import { Clock } from 'lucide-react'

interface TimeToConvertData {
  range: string
  users: number
  conversions: number
  conversionRate: number
}

interface TimeToConvertHistogramProps {
  data: TimeToConvertData[]
  loading?: boolean
  title?: string
}

export const TimeToConvertHistogram: React.FC<TimeToConvertHistogramProps> = ({
  data,
  loading = false,
  title = 'Time to Convert Distribution'
}) => {
  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-white/60">Loading data...</div>
        </div>
      </GlassCard>
    )
  }

  if (!data || data.length === 0 || data.every(d => d.users === 0)) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-white/60">No conversion timeline data available</div>
        </div>
      </GlassCard>
    )
  }

  // Calculate max for dynamic coloring
  const maxUsers = Math.max(...data.map(d => d.users))

  const getBarColor = (value: number) => {
    const intensity = maxUsers > 0 ? value / maxUsers : 0
    if (intensity > 0.7) return '#10b981' // emerald for high
    if (intensity > 0.4) return '#3b82f6' // blue for medium
    return '#8b5cf6' // purple for low
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    return (
      <div className="bg-black/90 border border-white/20 rounded-lg p-3 backdrop-blur-sm">
        <div className="text-white font-semibold mb-2">{data.range}</div>
        <div className="space-y-1 text-sm">
          <div className="text-white/80">
            <span className="text-white/60">Users: </span>
            {data.users}
          </div>
          <div className="text-emerald-400">
            <span className="text-white/60">Conversions: </span>
            {data.conversions}
          </div>
          <div className="text-white/80">
            <span className="text-white/60">Rate: </span>
            {data.conversionRate.toFixed(1)}%
          </div>
        </div>
      </div>
    )
  }

  const totalUsers = data.reduce((sum, d) => sum + d.users, 0)
  const totalConversions = data.reduce((sum, d) => sum + d.conversions, 0)
  const overallRate = totalUsers > 0 ? (totalConversions / totalUsers) * 100 : 0

  return (
    <GlassCard intensity="heavy" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">Overall Conversion Rate</div>
          <div className="text-2xl font-bold text-emerald-400">{overallRate.toFixed(1)}%</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="range"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            label={{
              value: 'Number of Users',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 }
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span style={{ color: 'rgba(255,255,255,0.7)' }}>{value}</span>}
          />
          <Bar dataKey="users" name="Total Users" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.users)} />
            ))}
          </Bar>
          <Bar dataKey="conversions" name="Conversions" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{totalUsers}</div>
            <div className="text-sm text-white/60">Total Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-400">{totalConversions}</div>
            <div className="text-sm text-white/60">Converted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{overallRate.toFixed(1)}%</div>
            <div className="text-sm text-white/60">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Insight */}
      {data.length > 0 && (() => {
        const fastConversions = data.slice(0, 2).reduce((sum, d) => sum + d.conversions, 0)
        const fastPercentage = totalConversions > 0 ? (fastConversions / totalConversions) * 100 : 0
        return (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/80">
              <span className="font-semibold text-white">{fastPercentage.toFixed(0)}%</span> of conversions
              happen within 6 hours, suggesting strong initial interest drives purchases.
            </div>
          </div>
        )
      })()}
    </GlassCard>
  )
}
