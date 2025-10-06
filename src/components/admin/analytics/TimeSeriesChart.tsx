import { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface TimeSeriesData {
  date: string
  [key: string]: string | number
}

interface SeriesConfig {
  key: string
  label: string
  color: string
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[]
  series: SeriesConfig[]
  chartType?: 'line' | 'area'
  className?: string
}

type DateRange = '7d' | '30d' | '90d' | 'all'

export function TimeSeriesChart({
  data,
  series,
  chartType = 'line',
  className = ''
}: TimeSeriesChartProps) {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [visibleSeries, setVisibleSeries] = useState<Set<string>>(
    new Set(series.map(s => s.key))
  )

  const toggleSeries = (key: string) => {
    const newVisible = new Set(visibleSeries)
    if (newVisible.has(key)) {
      newVisible.delete(key)
    } else {
      newVisible.add(key)
    }
    setVisibleSeries(newVisible)
  }

  // Filter data by date range
  const filterDataByRange = (data: TimeSeriesData[], range: DateRange) => {
    if (range === 'all') return data

    const days = parseInt(range)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return data.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    })
  }

  const filteredData = filterDataByRange(data, dateRange)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <div className="text-sm font-medium text-gray-900 mb-2">
          {new Date(label).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Header with controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        {/* Date range selector */}
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', 'all'] as DateRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                dateRange === range
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Series toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {series.map((s) => (
            <button
              key={s.key}
              onClick={() => toggleSeries(s.key)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                visibleSeries.has(s.key)
                  ? 'bg-white border-2 opacity-100'
                  : 'bg-gray-50 border-2 border-transparent opacity-50'
              }`}
              style={{
                borderColor: visibleSeries.has(s.key) ? s.color : 'transparent'
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(date: string) => {
              const d = new Date(date)
              return `${d.getMonth() + 1}/${d.getDate()}`
            }}
          />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {series
            .filter(s => visibleSeries.has(s.key))
            .map((s) => {
              if (chartType === 'area') {
                return (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                )
              }
              return (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ fill: s.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )
            })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
