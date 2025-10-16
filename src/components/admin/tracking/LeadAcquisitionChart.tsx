import React, { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns'
import { GlassCard } from '../../ui/glass-card'
import type { Lead } from '../../../lib/types/leads'

interface LeadAcquisitionChartProps {
  leads: Lead[]
  days?: number
  loading?: boolean
}

interface ChartDataPoint {
  date: string
  count: number
  cumulative: number
}

export const LeadAcquisitionChart: React.FC<LeadAcquisitionChartProps> = ({
  leads,
  days = 30,
  loading = false,
}) => {
  const chartData = useMemo(() => {
    const endDate = new Date()
    const startDate = subDays(endDate, days - 1)

    // Generate array of all dates in range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

    // Count leads per day
    const leadsByDate = new Map<string, number>()

    leads.forEach(lead => {
      const leadDate = startOfDay(new Date(lead.created_at))
      const dateKey = format(leadDate, 'yyyy-MM-dd')
      leadsByDate.set(dateKey, (leadsByDate.get(dateKey) || 0) + 1)
    })

    // Build chart data with cumulative count
    let cumulative = 0
    const data: ChartDataPoint[] = dateRange.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd')
      const count = leadsByDate.get(dateKey) || 0
      cumulative += count

      return {
        date: format(date, 'MMM d'),
        count,
        cumulative,
      }
    })

    return data
  }, [leads, days])

  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Lead Acquisition Trend</h3>
        <div className="h-80 bg-white/10 rounded animate-pulse" />
      </GlassCard>
    )
  }

  return (
    <GlassCard intensity="heavy" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Lead Acquisition Trend</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-white/70">Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" />
            <span className="text-white/70">Cumulative</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#fff', fontWeight: 'bold' }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#f59e0b"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCount)"
            name="Daily Leads"
          />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCumulative)"
            name="Total Leads"
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
