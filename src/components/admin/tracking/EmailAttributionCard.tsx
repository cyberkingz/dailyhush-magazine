import React from 'react'
import { GlassCard } from '../../ui/glass-card'
import { Mail, Users, MousePointerClick, Clock, Trophy } from 'lucide-react'

interface EmailAttributionMetrics {
  totalEmailsCaptured: number
  visitedProductPage: number
  convertedOnProductPage: number
  productVisitRate: number
  emailConversionRate: number
  avgTimeToReturn: number
  topCampaign: string | null
  topCampaignConversions: number
}

interface EmailAttributionCardProps {
  metrics: EmailAttributionMetrics | null
  loading?: boolean
}

export const EmailAttributionCard: React.FC<EmailAttributionCardProps> = ({
  metrics,
  loading = false
}) => {
  if (loading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-semibold text-white">Email Attribution Performance</h3>
        </div>
        <div className="h-40 flex items-center justify-center">
          <div className="text-white/60">Loading data...</div>
        </div>
      </GlassCard>
    )
  }

  if (!metrics || metrics.totalEmailsCaptured === 0) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-5 h-5 text-white/70" />
          <h3 className="text-lg font-semibold text-white">Email Attribution Performance</h3>
        </div>
        <div className="h-40 flex items-center justify-center">
          <div className="text-white/60">No email attribution data available</div>
        </div>
      </GlassCard>
    )
  }

  const formatHours = (hours: number): string => {
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
  }

  return (
    <GlassCard intensity="heavy" className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-5 h-5 text-white/70" />
        <h3 className="text-lg font-semibold text-white">Email Attribution Performance</h3>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Email Capture */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Users className="w-4 h-4" />
            <span>Emails Captured</span>
          </div>
          <div className="text-3xl font-bold text-white">{metrics.totalEmailsCaptured}</div>
          <div className="text-sm text-white/50">Total leads with email</div>
        </div>

        {/* Product Visit Rate */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MousePointerClick className="w-4 h-4" />
            <span>Visit Rate</span>
          </div>
          <div className="text-3xl font-bold text-blue-400">{metrics.productVisitRate.toFixed(1)}%</div>
          <div className="text-sm text-white/50">
            {metrics.visitedProductPage} visited product page
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <Trophy className="w-4 h-4" />
            <span>Conversion Rate</span>
          </div>
          <div className="text-3xl font-bold text-emerald-400">{metrics.emailConversionRate.toFixed(1)}%</div>
          <div className="text-sm text-white/50">
            {metrics.convertedOnProductPage} converted
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="mb-6 p-4 bg-white/5 rounded-lg">
        <div className="text-sm text-white/70 mb-3">Email → Product Journey</div>
        <div className="space-y-3">
          {/* Captured */}
          <div>
            <div className="h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-between px-4 text-white">
              <span className="text-sm font-semibold">Emails Captured</span>
              <span className="text-lg font-bold">{metrics.totalEmailsCaptured}</span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center text-white/40 text-2xl">
            ↓
          </div>

          {/* Visited */}
          <div>
            <div
              className="h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-between px-4 text-white ml-auto"
              style={{
                width: `${Math.max(metrics.productVisitRate, 10)}%`,
                minWidth: '200px'
              }}
            >
              <span className="text-sm font-semibold">Visited Product</span>
              <span className="text-lg font-bold">{metrics.visitedProductPage}</span>
            </div>
            <div className="text-xs text-white/50 mt-1 text-right">{metrics.productVisitRate.toFixed(1)}%</div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center text-white/40 text-2xl">
            ↓
          </div>

          {/* Converted */}
          <div>
            <div
              className="h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-between px-4 text-white ml-auto"
              style={{
                width: `${Math.max(metrics.emailConversionRate, 8)}%`,
                minWidth: '180px'
              }}
            >
              <span className="text-sm font-semibold">Converted</span>
              <span className="text-lg font-bold">{metrics.convertedOnProductPage}</span>
            </div>
            <div className="text-xs text-white/50 mt-1 text-right">{metrics.emailConversionRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Avg Time to Return */}
        <div className="p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">Avg Time to Return</span>
          </div>
          <div className="text-2xl font-bold text-white">{formatHours(metrics.avgTimeToReturn)}</div>
        </div>

        {/* Top Campaign */}
        {metrics.topCampaign && (
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-white/60">Top Campaign</span>
            </div>
            <div className="text-lg font-bold text-white truncate">{metrics.topCampaign}</div>
            <div className="text-sm text-white/50">{metrics.topCampaignConversions} conversions</div>
          </div>
        )}
      </div>

      {/* Insight */}
      {metrics.emailConversionRate > 0 && (
        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <div className="text-sm text-white/90">
            <span className="font-semibold text-emerald-400">
              {metrics.emailConversionRate.toFixed(1)}%
            </span>{' '}
            of email leads convert through retargeting campaigns. Average return time is{' '}
            <span className="font-semibold">{formatHours(metrics.avgTimeToReturn)}</span>.
          </div>
        </div>
      )}
    </GlassCard>
  )
}
