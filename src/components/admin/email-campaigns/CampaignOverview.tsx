/**
 * CampaignOverview Component
 * Shows high-level campaign metrics across all email campaigns
 */

import { useState, useEffect } from 'react'
import { Mail, TrendingUp, Users, Target } from 'lucide-react'
import { CampaignPerformanceTable } from '../analytics/CampaignPerformanceTable'
import { getCampaignMetrics, type CampaignMetrics } from '../../../lib/services/quiz'
import type { DateRange } from '../../../lib/services/trackingAnalytics'
import { GlassCard } from '../../ui/glass-card'
import { CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card'

interface CampaignOverviewProps {
  dateRange?: DateRange
}

export function CampaignOverview({ dateRange }: CampaignOverviewProps) {
  const [campaignData, setCampaignData] = useState<CampaignMetrics[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCampaignData()
  }, [dateRange])

  async function loadCampaignData() {
    try {
      setIsLoading(true)
      const allCampaigns = await getCampaignMetrics(dateRange)

      // Filter out Facebook/Instagram ad campaigns based on utm_source
      // Only show actual email campaigns in this view
      const emailOnlyCampaigns = allCampaigns.filter(c => {
        const source = c.utmSource?.toLowerCase()
        // Exclude Facebook and Instagram ads
        const isSocialAd = source === 'facebook' || source === 'instagram' || source === 'fb' || source === 'ig'
        return !isSocialAd
      })

      setCampaignData(emailOnlyCampaigns)
    } catch (error) {
      console.error('Error loading campaign data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate summary statistics
  const coldEmailCampaigns = campaignData.filter(c => c.campaignType === 'cold_email')
  const postQuizCampaigns = campaignData.filter(c => c.campaignType === 'post_quiz_retargeting')

  const calculateTotals = (campaigns: CampaignMetrics[]) => {
    return campaigns.reduce((acc, c) => ({
      views: acc.views + c.views,
      starts: acc.starts + c.starts,
      completions: acc.completions + c.completions,
    }), { views: 0, starts: 0, completions: 0 })
  }

  const overallTotals = calculateTotals(campaignData)

  const calculateAvgRate = (numerator: number, denominator: number) => {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0.0'
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <GlassCard intensity="heavy" className="p-5 ring-1 ring-emerald-500/20">
          <CardHeader className="p-0 pb-3">
            <CardDescription className="text-white/70 text-sm flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Total Campaigns
            </CardDescription>
            <CardTitle className="text-3xl text-white font-bold">
              {isLoading ? '...' : campaignData.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-white/60">Active tracking</span>
              <span className="font-medium text-emerald-400">
                {coldEmailCampaigns.length} cold + {postQuizCampaigns.length} retarget
              </span>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard intensity="heavy" className="p-5 ring-1 ring-blue-500/20">
          <CardHeader className="p-0 pb-3">
            <CardDescription className="text-white/70 text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Views
            </CardDescription>
            <CardTitle className="text-3xl text-white font-bold">
              {isLoading ? '...' : overallTotals.views.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-white/60">Quiz page visits</span>
              <span className="font-medium text-blue-400">
                From email clicks
              </span>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard intensity="heavy" className="p-5 ring-1 ring-amber-500/20">
          <CardHeader className="p-0 pb-3">
            <CardDescription className="text-white/70 text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Completions
            </CardDescription>
            <CardTitle className="text-3xl text-white font-bold">
              {isLoading ? '...' : overallTotals.completions.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-white/60">Quiz finished</span>
              <span className="font-medium text-amber-400">
                {calculateAvgRate(overallTotals.completions, overallTotals.views)}% conversion
              </span>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard intensity="heavy" className="p-5 ring-1 ring-purple-500/20">
          <CardHeader className="p-0 pb-3">
            <CardDescription className="text-white/70 text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Avg Conversion
            </CardDescription>
            <CardTitle className="text-3xl text-white font-bold">
              {isLoading ? '...' : calculateAvgRate(overallTotals.completions, overallTotals.views)}%
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-white/60">Overall performance</span>
              <span className="font-medium text-purple-400">
                {overallTotals.starts.toLocaleString()} starts
              </span>
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {/* Campaign Performance Table */}
      <CampaignPerformanceTable campaigns={campaignData} isLoading={isLoading} />

      {/* Info Card */}
      {!isLoading && campaignData.length > 0 && (
        <GlassCard intensity="heavy" className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Campaign Tracking Guide</h3>
              <div className="text-sm text-white/70 space-y-2">
                <p>
                  <strong className="text-white/90">Cold Email Campaigns:</strong> Track quiz invitation emails sent to existing leads.
                  These campaigns drive traffic to the quiz page to identify overthinking patterns.
                </p>
                <p>
                  <strong className="text-white/90">Post-Quiz Retargeting:</strong> Track product promotion emails sent to quiz-takers.
                  These campaigns drive traffic to the product page to convert leads into customers.
                </p>
                <p className="mt-3 text-xs text-white/60">
                  💡 Tip: Compare conversion rates across campaigns to identify which messaging resonates best with your audience.
                  High-performing campaigns can inform future email sequences.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
