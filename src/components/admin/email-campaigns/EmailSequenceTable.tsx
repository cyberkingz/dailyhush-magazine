/**
 * EmailSequenceTable Component
 * Displays per-email metrics with visual performance indicators
 */

import { useMemo } from 'react'
import type { EmailSequenceMetric } from '../../../lib/types/emailCampaigns'
import { getOpenRateStatus } from '../../../lib/services/emailCampaigns'
import { GlassCard } from '../../ui/glass-card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface EmailSequenceTableProps {
  data: EmailSequenceMetric[]
  isLoading?: boolean
}

export function EmailSequenceTable({ data, isLoading }: EmailSequenceTableProps) {
  // Calculate trend direction compared to previous email
  const dataWithTrends = useMemo(() => {
    return data.map((email, index) => {
      if (index === 0) {
        return { ...email, trend: 'neutral' as const }
      }

      const previousEmail = data[index - 1]
      const currentRate = email.openRate
      const previousRate = previousEmail.openRate

      if (currentRate > previousRate + 5) {
        return { ...email, trend: 'up' as const }
      } else if (currentRate < previousRate - 5) {
        return { ...email, trend: 'down' as const }
      }

      return { ...email, trend: 'neutral' as const }
    })
  }, [data])

  // Get status color classes
  const getStatusClasses = (openRate: number) => {
    const status = getOpenRateStatus(openRate)
    switch (status) {
      case 'excellent':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'good':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'poor':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }

  // Get status emoji
  const getStatusEmoji = (openRate: number) => {
    const status = getOpenRateStatus(openRate)
    switch (status) {
      case 'excellent':
        return '🟢'
      case 'good':
        return '🟡'
      case 'poor':
        return '🔴'
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-emerald-400" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-400" />
      case 'neutral':
        return <Minus className="h-4 w-4 text-white/40" />
    }
  }

  if (isLoading) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-white/70">Loading email sequence...</div>
        </div>
      </GlassCard>
    )
  }

  if (data.length === 0) {
    return (
      <GlassCard intensity="heavy" className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-white/70 text-center">
            No email sequence data available for this campaign.
          </p>
          <p className="text-white/50 text-sm mt-2">
            Send emails via n8n to see metrics here.
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard intensity="heavy" className="overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Email Sequence Breakdown</h3>
        <p className="text-sm text-white/70 mb-6">
          Performance metrics for each email in the sequence
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-b border-white/10">
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Day
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                Subject Line
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                Opens
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                Open Rate
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                Buy Clicks
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                CTR
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white/70 uppercase tracking-wider">
                Trend
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {dataWithTrends.map((email) => (
              <tr
                key={email.emailSequenceDay}
                className="hover:bg-white/5 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-semibold text-sm">
                      {email.emailSequenceDay}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-white font-medium max-w-md truncate">
                    {email.emailSubject}
                  </div>
                  <div className="text-xs text-white/50 mt-1">{email.utmContent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-white">{email.emailsSent}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-white font-medium">
                    {email.uniqueOpens}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">{getStatusEmoji(email.openRate)}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusClasses(
                        email.openRate
                      )}`}
                    >
                      {email.openRate}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-white">{email.buyButtonClicks}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-white/70">{email.clickThroughRate}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    {getTrendIcon(email.trend)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/10">
        {dataWithTrends.map((email) => (
          <div key={email.emailSequenceDay} className="p-4 hover:bg-white/5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white font-semibold">
                  {email.emailSequenceDay}
                </span>
                <div className="flex-1">
                  <div className="text-sm text-white font-medium line-clamp-2">
                    {email.emailSubject}
                  </div>
                  <div className="text-xs text-white/50 mt-1">{email.utmContent}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{getStatusEmoji(email.openRate)}</span>
                {getTrendIcon(email.trend)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-white/50">Sent</div>
                <div className="text-lg text-white font-semibold">{email.emailsSent}</div>
              </div>
              <div>
                <div className="text-xs text-white/50">Opens</div>
                <div className="text-lg text-white font-semibold">{email.uniqueOpens}</div>
              </div>
              <div>
                <div className="text-xs text-white/50">Open Rate</div>
                <div
                  className={`inline-block px-2 py-1 rounded text-sm font-semibold border ${getStatusClasses(
                    email.openRate
                  )}`}
                >
                  {email.openRate}%
                </div>
              </div>
              <div>
                <div className="text-xs text-white/50">Buy Clicks</div>
                <div className="text-lg text-white font-semibold">
                  {email.buyButtonClicks}
                  <span className="text-sm text-white/50 ml-2">
                    ({email.clickThroughRate}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-6 py-4 bg-white/5 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <span>🟢 Excellent (&ge;30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🟡 Good (15-29%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔴 Needs Improvement (&lt;15%)</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <TrendingUp className="h-3 w-3" />
            <span>Improving</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-3 w-3" />
            <span>Declining</span>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
