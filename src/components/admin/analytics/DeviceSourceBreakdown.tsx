import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Monitor, Smartphone } from 'lucide-react'

interface BreakdownData {
  name: string
  views: number
  completions: number
  conversionRate: number
}

interface DeviceSourceBreakdownProps {
  deviceData: BreakdownData[]
  sourceData: BreakdownData[]
  className?: string
}

type ViewMode = 'device' | 'source'

const COLORS = {
  views: '#f59e0b', // amber-500
  completions: '#10b981', // green-500
}

export function DeviceSourceBreakdown({
  deviceData,
  sourceData,
  className = ''
}: DeviceSourceBreakdownProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('device')

  const currentData = viewMode === 'device' ? deviceData : sourceData

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="text-sm font-semibold text-gray-900 mb-2">{label}</div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-gray-600">Views:</span>
            <span className="font-semibold text-amber-600">
              {data.views.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="text-gray-600">Completions:</span>
            <span className="font-semibold text-green-600">
              {data.completions.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-xs border-t border-gray-200 pt-1 mt-1">
            <span className="text-gray-600">Conversion Rate:</span>
            <span className="font-bold text-gray-900">{data.conversionRate}%</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Performance by {viewMode === 'device' ? 'Device' : 'Source'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('device')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'device'
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <Monitor className="h-4 w-4" />
            Device
          </button>
          <button
            onClick={() => setViewMode('source')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'source'
                ? 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Source
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="views" name="Views" fill={COLORS.views} radius={[8, 8, 0, 0]} />
          <Bar
            dataKey="completions"
            name="Completions"
            fill={COLORS.completions}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Conversion rate summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {currentData.map((item) => (
          <div
            key={item.name}
            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="text-xs text-gray-600 mb-1">{item.name}</div>
            <div className="text-lg font-bold text-gray-900">
              {item.conversionRate}%
            </div>
            <div className="text-xs text-gray-500">conversion</div>
          </div>
        ))}
      </div>
    </div>
  )
}
