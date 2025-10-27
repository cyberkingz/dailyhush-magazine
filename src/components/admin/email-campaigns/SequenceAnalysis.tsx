/**
 * SequenceAnalysis Component
 * Per-email performance breakdown for email campaigns
 */

import { Mail, MousePointerClick, Eye, TrendingUp, RefreshCw } from 'lucide-react'
import { useEmailCampaign } from '../../../hooks/useEmailCampaign'
import type { DateRange } from '../../../lib/types/emailCampaigns'
import { GlassCard } from '../../ui/glass-card'
import { CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card'
import { CampaignSelector } from './CampaignSelector'
import { EmailSequenceTable } from './EmailSequenceTable'

interface SequenceAnalysisProps {
  dateRange?: DateRange
}

export function SequenceAnalysis({ dateRange }: SequenceAnalysisProps) {
  const {
    campaigns,
    selectedCampaign,
    campaignData,
    isLoadingCampaigns,
    isLoadingData,
    selectCampaign,
    refresh,
  } = useEmailCampaign(dateRange)

  const summary = campaignData?.summary
  const sequence = campaignData?.sequence || []

  return (
    <div className="space-y-6">
      {/* Campaign Selector */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <CampaignSelector
            campaigns={campaigns}
            selectedCampaign={selectedCampaign}
            onSelect={selectCampaign}
            isLoading={isLoadingCampaigns}
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={refresh}
          disabled={isLoadingData}
          className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:bg-white/15 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoadingData ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <GlassCard intensity="heavy" className="p-5 ring-1 ring-blue-500/20">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Total Sent
              </CardDescription>
              <CardTitle className="text-3xl text-white font-bold">
                {isLoadingData ? '...' : summary.totalSends.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/60">Across sequence</span>
                <span className="font-medium text-blue-400">
                  {sequence.length} emails
                </span>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard intensity="heavy" className="p-5 ring-1 ring-emerald-500/20">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Unique Opens
              </CardDescription>
              <CardTitle className="text-3xl text-white font-bold">
                {isLoadingData ? '...' : summary.uniqueOpens.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/60">Product page visits</span>
                <span className="font-medium text-emerald-400">
                  Within 48hrs
                </span>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard intensity="heavy" className="p-5 ring-1 ring-amber-500/20">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Open Rate
              </CardDescription>
              <CardTitle className="text-3xl text-white font-bold">
                {isLoadingData ? '...' : `${summary.openRate}%`}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/60">Campaign average</span>
                <span
                  className={`font-medium ${
                    summary.openRate >= 30
                      ? 'text-emerald-400'
                      : summary.openRate >= 15
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {summary.openRate >= 30
                    ? 'Excellent'
                    : summary.openRate >= 15
                    ? 'Good'
                    : 'Needs work'}
                </span>
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard intensity="heavy" className="p-5 ring-1 ring-purple-500/20">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm flex items-center gap-2">
                <MousePointerClick className="h-4 w-4" />
                Buy Clicks
              </CardDescription>
              <CardTitle className="text-3xl text-white font-bold">
                {isLoadingData ? '...' : summary.totalBuyClicks.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-white/60">Click-through rate</span>
                <span className="font-medium text-purple-400">
                  {summary.clickThroughRate}%
                </span>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* Email Sequence Breakdown Table */}
      <EmailSequenceTable data={sequence} isLoading={isLoadingData} />

      {/* Info Card */}
      {!isLoadingData && sequence.length > 0 && (
        <GlassCard intensity="heavy" className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Email Sequence Performance Insights
              </h3>
              <div className="text-sm text-white/70 space-y-2">
                <p>
                  <strong className="text-white/90">Open Rate Tracking:</strong> Opens are tracked
                  when recipients click email links and visit the product page within 48 hours of
                  send time. This matches industry-standard email attribution windows.
                </p>
                <p>
                  <strong className="text-white/90">Sequence Optimization:</strong> Compare
                  performance across days to identify which emails resonate best. Use high-performing
                  subject lines and messaging in future campaigns.
                </p>
                <p className="mt-3 text-xs text-white/60">
                  💡 Tip: A healthy email sequence shows 40-60% open rate on Day 0, with gradual
                  decline to 15-25% by Day 4. Monitor for sharp drop-offs indicating audience fatigue
                  or poor messaging fit.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Empty State */}
      {!isLoadingCampaigns && campaigns.length === 0 && (
        <GlassCard intensity="heavy" className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white/50" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Campaigns Yet</h3>
            <p className="text-white/70 max-w-md">
              Start sending emails via n8n to see detailed sequence performance metrics here.
              Campaign data will appear once emails are sent and tracked.
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
