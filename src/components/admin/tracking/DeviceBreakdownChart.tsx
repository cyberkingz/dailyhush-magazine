import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { GlassCard } from '../../ui/glass-card'
import { Monitor, Smartphone, Tablet, HelpCircle } from 'lucide-react'

interface DeviceBreakdownChartProps {
  data: Array<{ device_type?: string }>
  loading?: boolean
  title?: string
}

const DEVICE_COLORS = {
  desktop: '#10b981',  // emerald
  mobile: '#3b82f6',   // blue
  tablet: '#f59e0b',   // amber
  unknown: '#6b7280',  // gray
}

const DEVICE_ICONS = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: HelpCircle,
}

const DEVICE_LABELS = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  tablet: 'Tablet',
  unknown: 'Unknown',
}

export const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({
  data,
  loading = false,
  title = 'Device Breakdown'
}) => {
  const deviceData = useMemo(() => {
    const deviceCounts = new Map<string, number>()

    data.forEach(item => {
      const device = item.device_type || 'unknown'
      deviceCounts.set(device, (deviceCounts.get(device) || 0) + 1)
    })

    // Ensure all device types are represented
    const allDevices: Array<'desktop' | 'mobile' | 'tablet' | 'unknown'> = ['desktop', 'mobile', 'tablet', 'unknown']

    return allDevices.map(device => ({
      device,
      name: DEVICE_LABELS[device],
      count: deviceCounts.get(device) || 0,
      percentage: data.length > 0 ? ((deviceCounts.get(device) || 0) / data.length) * 100 : 0,
      color: DEVICE_COLORS[device],
    })).filter(d => d.count > 0) // Only show devices with data
  }, [data])

  const totalCount = useMemo(() => data.length, [data])

  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="h-80 bg-white/10 rounded animate-pulse" />
      </GlassCard>
    )
  }

  if (deviceData.length === 0) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
        <div className="text-center text-white/60 py-12">
          No device data available
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard intensity="heavy" className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={deviceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="name"
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
            formatter={(value: number) => [value, 'Leads']}
          />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {deviceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Device Stats List */}
      <div className="mt-6 space-y-3">
        {deviceData.map(device => {
          const Icon = DEVICE_ICONS[device.device]
          return (
            <div key={device.device} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${device.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: device.color }} />
                </div>
                <span className="text-sm text-white/90">{device.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-white">
                  {device.count.toLocaleString()}
                </span>
                <span className="text-xs text-white/60 w-12 text-right">
                  {device.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">Total</span>
        <span className="text-sm font-bold text-white">{totalCount.toLocaleString()}</span>
      </div>
    </GlassCard>
  )
}
