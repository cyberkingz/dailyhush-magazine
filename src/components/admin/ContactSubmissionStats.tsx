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
          <div key={i} className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] w-1/2 mb-2"></div>
              <div className="h-8 bg-[hsla(200,14%,78%,0.28)] backdrop-blur-[12px] rounded-[8px] w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-[16px] backdrop-saturate-[140%] border border-red-500/20 rounded-[12px] shadow-[0_4px_8px_rgba(239,68,68,0.1)] p-4">
        <p className="text-red-300 text-sm">{error}</p>
        <button
          onClick={loadStats}
          className="text-red-400 hover:text-red-300 text-sm font-medium mt-2 transition-colors"
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
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] hover:shadow-[0_12px_20px_-4px_rgba(31,45,61,0.12),0_20px_36px_-8px_rgba(31,45,61,0.16)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Today's Submissions</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total_today}</p>
              <div className="flex items-center mt-3">
                <TrendingUp className={`w-4 h-4 mr-1 ${changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className={`text-sm font-medium ${changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}% vs yesterday
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-500/20 backdrop-blur-[8px] rounded-[12px] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>

        {/* New Submissions */}
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] hover:shadow-[0_12px_20px_-4px_rgba(31,45,61,0.12),0_20px_36px_-8px_rgba(31,45,61,0.16)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">New Submissions</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.status_breakdown.new}</p>
              <p className="text-sm text-white/60 mt-3">
                {totalSubmissions > 0 ? ((stats.status_breakdown.new / totalSubmissions) * 100).toFixed(1) : 0}% of total
              </p>
            </div>
            <div className="relative w-12 h-12 bg-emerald-500/20 backdrop-blur-[8px] rounded-[12px] flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-400" />
              {stats.status_breakdown.new > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Overdue Submissions */}
        <div className={`bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] hover:shadow-[0_12px_20px_-4px_rgba(31,45,61,0.12),0_20px_36px_-8px_rgba(31,45,61,0.16)] hover:-translate-y-0.5 transition-all duration-300 ${
          stats.overdue_count > 0 ? 'border-red-500/25 ring-1 ring-red-500/15 shadow-[0_0_16px_rgba(239,68,68,0.1)]' : 'border-[hsla(200,16%,80%,0.18)]'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Overdue (&gt;24h)</p>
              <p className={`text-3xl font-bold mt-2 ${stats.overdue_count > 0 ? 'text-red-300' : 'text-white'}`}>
                {stats.overdue_count}
              </p>
              <p className="text-sm text-white/60 mt-3">Needs immediate attention</p>
            </div>
            <div className={`relative w-12 h-12 rounded-[12px] flex items-center justify-center backdrop-blur-[8px] ${
              stats.overdue_count > 0 ? 'bg-red-500/20' : 'bg-white/10'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${stats.overdue_count > 0 ? 'text-red-400' : 'text-white/50'}`} />
              {stats.overdue_count > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Response Rate */}
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] hover:shadow-[0_12px_20px_-4px_rgba(31,45,61,0.12),0_20px_36px_-8px_rgba(31,45,61,0.16)] hover:-translate-y-0.5 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Response Rate</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.response_rate}%</p>
              <p className="text-sm text-white/60 mt-3">
                Avg: {stats.average_response_time_hours.toFixed(1)}h response time
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-[8px] rounded-[12px] flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
          <h3 className="text-lg font-semibold text-white mb-4">Status Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                <span className="text-sm text-white/70">New</span>
              </div>
              <span className="text-sm font-medium text-white">{stats.status_breakdown.new}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-3"></div>
                <span className="text-sm text-white/70">In Progress</span>
              </div>
              <span className="text-sm font-medium text-white">{stats.status_breakdown.in_progress}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3"></div>
                <span className="text-sm text-white/70">Replied</span>
              </div>
              <span className="text-sm font-medium text-white">{stats.status_breakdown.replied}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white/50 rounded-full mr-3"></div>
                <span className="text-sm text-white/70">Closed</span>
              </div>
              <span className="text-sm font-medium text-white">{stats.status_breakdown.closed}</span>
            </div>
          </div>
        </div>

        {/* Device Analytics */}
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
          <h3 className="text-lg font-semibold text-white mb-4">Device Analytics</h3>
          <div className="space-y-3">
            {stats.device_analytics.slice(0, 5).map((device) => (
              <div key={device.device_type} className="flex items-center justify-between">
                <div className="flex items-center text-white/70">
                  {getDeviceIcon(device.device_type)}
                  <span className="text-sm ml-3 capitalize">{device.device_type}</span>
                </div>
                <span className="text-sm font-medium text-white">{device.count}</span>
              </div>
            ))}
            {stats.device_analytics.length === 0 && (
              <p className="text-sm text-white/60 italic">No device data available</p>
            )}
          </div>
        </div>
      </div>

      {/* UTM Sources (if available) */}
      {stats.utm_analytics.length > 0 && (
        <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] p-6 border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset]">
          <h3 className="text-lg font-semibold text-white mb-4">Top Traffic Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.utm_analytics.slice(0, 4).map((utm) => (
              <div key={utm.utm_source} className="text-center">
                <p className="text-2xl font-bold text-white">{utm.count}</p>
                <p className="text-sm text-white/70 capitalize">{utm.utm_source}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
