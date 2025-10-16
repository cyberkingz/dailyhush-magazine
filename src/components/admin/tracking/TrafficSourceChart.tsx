import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { TrafficSourceStats } from '@/lib/services/trackingAnalytics'

interface TrafficSourceChartProps {
  data: TrafficSourceStats[]
  loading?: boolean
}

export const TrafficSourceChart: React.FC<TrafficSourceChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-96 flex items-center justify-center">
        <p className="text-white/60">No traffic source data available</p>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const chartData = data.map(item => ({
    name: item.displayName,
    revenue: item.revenue,
    orders: item.orders,
    aov: item.averageOrderValue,
  }))

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Revenue by Traffic Source</h3>
          <p className="text-sm text-white/60 mt-1">Where your customers are coming from</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(30, 20, 50, 0.95)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'revenue') return [formatCurrency(value), 'Revenue']
              if (name === 'orders') return [value, 'Orders']
              if (name === 'aov') return [formatCurrency(value), 'AOV']
              return [value, name]
            }}
          />
          <Legend
            wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
            formatter={(value) => {
              if (value === 'revenue') return 'Revenue'
              if (value === 'orders') return 'Orders'
              if (value === 'aov') return 'Average Order Value'
              return value
            }}
          />
          <Bar dataKey="revenue" fill="#8b5cf6" name="revenue" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Stats Grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.slice(0, 4).map((source) => (
          <div key={source.source} className="bg-white/5 rounded-lg p-4">
            <div className="text-white/70 text-xs mb-1">{source.displayName}</div>
            <div className="text-white text-lg font-bold">{formatCurrency(source.revenue)}</div>
            <div className="text-white/50 text-xs">{source.orders} orders</div>
          </div>
        ))}
      </div>
    </div>
  )
}
