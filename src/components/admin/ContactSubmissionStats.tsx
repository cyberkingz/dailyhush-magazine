import { useEffect, useState } from 'react'
import { 
  MessageSquare, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'
import { getContactSubmissionStats } from '@/lib/services/contact'
import type { ContactSubmissionStats } from '@/lib/types/contact'

export function ContactSubmissionStats() {
  const [stats, setStats] = useState<ContactSubmissionStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await getContactSubmissionStats()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error('Error loading contact submission stats:', err)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button 
          onClick={loadStats}
          className="text-red-600 hover:text-red-700 text-sm font-medium mt-2"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!stats) return null

  const totalSubmissions = stats.status_breakdown.new + stats.status_breakdown.in_progress + 
                          stats.status_breakdown.replied + stats.status_breakdown.closed

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />
      case 'tablet': return <Tablet className="w-4 h-4" />
      default: return <Monitor className="w-4 h-4" />
    }
  }

  const changePercent = stats.total_yesterday > 0 
    ? ((stats.total_today - stats.total_yesterday) / stats.total_yesterday) * 100
    : stats.total_today > 0 ? 100 : 0

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Submissions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Submissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_today}</p>
              <div className="flex items-center mt-3">
                <TrendingUp className={`w-4 h-4 mr-1 ${changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm font-medium ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}% vs yesterday
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* New Submissions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Submissions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.status_breakdown.new}</p>
              <p className="text-sm text-gray-500 mt-3">
                {totalSubmissions > 0 ? ((stats.status_breakdown.new / totalSubmissions) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="relative w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
              {stats.status_breakdown.new > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Overdue Submissions */}
        <div className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all ${
          stats.overdue_count > 0 ? 'border-red-200 bg-red-50/50' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue (&gt;24h)</p>
              <p className={`text-3xl font-bold mt-2 ${stats.overdue_count > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                {stats.overdue_count}
              </p>
              <p className="text-sm text-gray-500 mt-3">Needs immediate attention</p>
            </div>
            <div className={`relative w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.overdue_count > 0 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${stats.overdue_count > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              {stats.overdue_count > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Response Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.response_rate}%</p>
              <p className="text-sm text-gray-500 mt-3">
                Avg: {stats.average_response_time_hours.toFixed(1)}h response time
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">New</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.status_breakdown.new}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.status_breakdown.in_progress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Replied</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.status_breakdown.replied}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-600">Closed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{stats.status_breakdown.closed}</span>
            </div>
          </div>
        </div>

        {/* Device Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Analytics</h3>
          <div className="space-y-3">
            {stats.device_analytics.slice(0, 5).map((device) => (
              <div key={device.device_type} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getDeviceIcon(device.device_type)}
                  <span className="text-sm text-gray-600 ml-3 capitalize">{device.device_type}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{device.count}</span>
              </div>
            ))}
            {stats.device_analytics.length === 0 && (
              <p className="text-sm text-gray-500 italic">No device data available</p>
            )}
          </div>
        </div>
      </div>

      {/* UTM Sources (if available) */}
      {stats.utm_analytics.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Traffic Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.utm_analytics.slice(0, 4).map((utm) => (
              <div key={utm.utm_source} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{utm.count}</p>
                <p className="text-sm text-gray-600 capitalize">{utm.utm_source}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}