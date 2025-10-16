import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { GlassCard } from '../../ui/glass-card'

interface ConversionTrendChartProps {
  data: Array<{
    date: string
    conversionRate: number
    sessions: number
    conversions: number
  }>
  loading?: boolean
}

export const ConversionTrendChart: React.FC<ConversionTrendChartProps> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Conversion Rate Trend</h3>
        <div className="h-80 bg-white/10 rounded animate-pulse" />
      </GlassCard>
    )
  }

  if (data.length === 0) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Conversion Rate Trend</h3>
        <div className="text-center text-white/60 py-12">
          No trend data available
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard intensity="heavy" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Conversion Rate Trend</h3>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConversionRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
            formatter={(value: number, name: string) => {
              if (name === 'conversionRate') return [`${value.toFixed(1)}%`, 'Conversion Rate']
              if (name === 'sessions') return [value, 'Sessions']
              if (name === 'conversions') return [value, 'Conversions']
              return [value, name]
            }}
          />
          <Legend
            wrapperStyle={{ color: '#fff' }}
            formatter={(value) => {
              if (value === 'conversionRate') return 'Conversion Rate'
              if (value === 'sessions') return 'Sessions'
              if (value === 'conversions') return 'Conversions'
              return value
            }}
          />
          <Line
            type="monotone"
            dataKey="conversionRate"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="conversionRate"
          />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
