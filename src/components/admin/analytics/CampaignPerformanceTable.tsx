import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/table'
import { Badge } from '../../ui/badge'
import { CardHeader, CardTitle, CardDescription, CardContent } from '../../ui/card'
import { GlassCard } from '../../ui/glass-card'
import {
  TrendingUp,
  TrendingDown,
  Mail,
  MousePointerClick,
  CheckCircle2,
  Eye,
  Target,
  ArrowRight,
  Zap
} from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface CampaignMetrics {
  campaign: string
  campaignType: 'cold_email' | 'post_quiz_retargeting'
  views: number
  starts: number
  completions: number
  startRate: number
  completionRate: number
  overallConversionRate: number
}

interface CampaignPerformanceTableProps {
  campaigns: CampaignMetrics[]
  isLoading?: boolean
}

// Mini sparkline component for visual trends
function MetricSparkline({ value, maxValue }: { value: number; maxValue: number }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Progress circle for conversion rates
function ProgressCircle({ rate }: { rate: number }) {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (rate / 100) * circumference

  const color = rate >= 70 ? 'text-emerald-400' : rate >= 50 ? 'text-blue-400' : rate >= 30 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-10 h-10 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          className="text-white/10"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-500", color)}
          strokeLinecap="round"
        />
      </svg>
      <span className={cn("absolute text-xs font-bold", color)}>
        {rate.toFixed(0)}
      </span>
    </div>
  )
}

// Enhanced metric badge with color coding
function MetricBadge({
  value,
  label,
  trend
}: {
  value: number | string
  label?: string
  trend?: 'up' | 'down' | 'neutral'
}) {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const color = numValue >= 70 ? 'emerald' : numValue >= 50 ? 'blue' : numValue >= 30 ? 'amber' : 'red'

  const bgColors = {
    emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
    blue: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
    amber: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
    red: 'bg-red-500/20 border-red-500/30 text-red-300',
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm transition-all duration-200 hover:scale-105",
      bgColors[color]
    )}>
      {trend === 'up' && <TrendingUp className="h-3 w-3" />}
      {trend === 'down' && <TrendingDown className="h-3 w-3" />}
      <span className="text-xs font-bold tabular-nums">
        {typeof value === 'number' ? value.toFixed(1) : value}
        {label && <span className="ml-0.5">{label}</span>}
      </span>
    </div>
  )
}

export function CampaignPerformanceTable({ campaigns, isLoading }: CampaignPerformanceTableProps) {
  if (isLoading) {
    return (
      <GlassCard intensity="heavy">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="text-white">Campaign Performance</CardTitle>
          <CardDescription className="text-white/70">Loading campaign data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-emerald-400"></div>
              <Zap className="absolute inset-0 m-auto h-5 w-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </GlassCard>
    )
  }

  // Separate cold email campaigns from post-quiz retargeting
  const coldEmailCampaigns = campaigns.filter(c => c.campaignType === 'cold_email')
  const postQuizCampaigns = campaigns.filter(c => c.campaignType === 'post_quiz_retargeting')

  const renderCampaignTable = (campaignList: CampaignMetrics[], title: string, description: string, icon: React.ReactNode) => {
    if (campaignList.length === 0) {
      return null
    }

    // Sort by views descending
    const sortedCampaigns = [...campaignList].sort((a, b) => b.views - a.views)

    // Calculate max values for sparklines
    const maxViews = Math.max(...sortedCampaigns.map(c => c.views))
    const maxStarts = Math.max(...sortedCampaigns.map(c => c.starts))
    const maxCompletions = Math.max(...sortedCampaigns.map(c => c.completions))

    // Calculate totals
    const totalViews = sortedCampaigns.reduce((sum, c) => sum + c.views, 0)
    const totalStarts = sortedCampaigns.reduce((sum, c) => sum + c.starts, 0)
    const totalCompletions = sortedCampaigns.reduce((sum, c) => sum + c.completions, 0)
    const avgStartRate = calculateAverage(sortedCampaigns, 'startRate')
    const avgCompletionRate = calculateAverage(sortedCampaigns, 'completionRate')
    const avgOverallConv = calculateAverage(sortedCampaigns, 'overallConversionRate')

    return (
      <GlassCard intensity="heavy" className="mb-6 overflow-hidden group hover:ring-1 hover:ring-emerald-500/20 transition-all duration-300">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
                {icon}
              </div>
              <div>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  {title}
                </CardTitle>
                <CardDescription className="text-white/70 mt-1">{description}</CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-white/10 border-white/20 text-white backdrop-blur-sm px-3 py-1"
            >
              {campaignList.length} campaign{campaignList.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Summary Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Total Views</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">{totalViews.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                <MousePointerClick className="h-3.5 w-3.5" />
                <span>Total Starts</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">{totalStarts.toLocaleString()}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completions</span>
              </div>
              <div className="text-xl font-bold text-white tabular-nums">{totalCompletions.toLocaleString()}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg p-3 backdrop-blur-sm border border-emerald-500/30 hover:from-emerald-500/30 hover:to-emerald-600/20 transition-all duration-200">
              <div className="flex items-center gap-2 text-emerald-300 text-xs mb-1">
                <Target className="h-3.5 w-3.5" />
                <span>Avg Conv. Rate</span>
              </div>
              <div className="text-xl font-bold text-emerald-300 tabular-nums">{avgOverallConv}%</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Responsive table wrapper */}
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5 backdrop-blur-sm border-b border-white/10 hover:bg-white/5">
                    <TableHead className="font-bold text-white/90 py-4 px-6">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        Campaign
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-bold text-white/90 py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <Eye className="h-4 w-4 text-white/70" />
                        <span>Views</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-bold text-white/90 py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <MousePointerClick className="h-4 w-4 text-white/70" />
                        <span>Starts</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-bold text-white/90 py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-white/70" />
                        <span>Completions</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-bold text-white/90 py-4 px-4">Start Rate</TableHead>
                    <TableHead className="text-center font-bold text-white/90 py-4 px-4">Completion Rate</TableHead>
                    <TableHead className="text-center font-bold text-white/90 py-4 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <Target className="h-4 w-4 text-emerald-400" />
                        <span className="text-emerald-300">Overall Conv.</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCampaigns.map((campaign, index) => (
                    <TableRow
                      key={campaign.campaign}
                      className={cn(
                        "border-b border-white/5 hover:bg-white/10 transition-all duration-200 group/row",
                        index % 2 === 0 ? "bg-white/[0.02]" : "bg-white/[0.04]"
                      )}
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-semibold text-white">
                            {getCampaignLabel(campaign.campaign)}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs w-fit bg-white/10 border-white/20 text-white/70 backdrop-blur-sm"
                          >
                            {campaign.campaign}
                          </Badge>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-bold tabular-nums text-white">
                            {campaign.views.toLocaleString()}
                          </span>
                          <div className="w-16">
                            <MetricSparkline value={campaign.views} maxValue={maxViews} />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-bold tabular-nums text-white">
                            {campaign.starts.toLocaleString()}
                          </span>
                          <div className="w-16">
                            <MetricSparkline value={campaign.starts} maxValue={maxStarts} />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4 px-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-sm font-bold tabular-nums text-white">
                            {campaign.completions.toLocaleString()}
                          </span>
                          <div className="w-16">
                            <MetricSparkline value={campaign.completions} maxValue={maxCompletions} />
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center py-4 px-4">
                        <MetricBadge
                          value={campaign.startRate}
                          label="%"
                          trend={campaign.startRate >= 70 ? 'up' : campaign.startRate < 50 ? 'down' : 'neutral'}
                        />
                      </TableCell>

                      <TableCell className="text-center py-4 px-4">
                        <MetricBadge
                          value={campaign.completionRate}
                          label="%"
                          trend={campaign.completionRate >= 70 ? 'up' : campaign.completionRate < 50 ? 'down' : 'neutral'}
                        />
                      </TableCell>

                      <TableCell className="text-center py-4 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <ProgressCircle rate={campaign.overallConversionRate} />
                          <div className="flex flex-col items-start">
                            <span className={cn(
                              "text-sm font-bold tabular-nums",
                              campaign.overallConversionRate >= 70 ? "text-emerald-300" :
                              campaign.overallConversionRate >= 50 ? "text-blue-300" :
                              campaign.overallConversionRate >= 30 ? "text-amber-300" :
                              "text-red-300"
                            )}>
                              {campaign.overallConversionRate.toFixed(1)}%
                            </span>
                            <span className="text-xs text-white/50">conversion</span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Row */}
                  {sortedCampaigns.length > 0 && (
                    <TableRow className="bg-gradient-to-r from-white/10 to-white/5 border-t-2 border-emerald-500/30 backdrop-blur-sm font-semibold hover:bg-white/15 transition-all duration-200">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2 text-white">
                          <Target className="h-4 w-4 text-emerald-400" />
                          <span className="font-bold">Total / Average</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-white py-4 px-4">
                        <span className="text-sm font-bold">{totalViews.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-white py-4 px-4">
                        <span className="text-sm font-bold">{totalStarts.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-center tabular-nums text-white py-4 px-4">
                        <span className="text-sm font-bold">{totalCompletions.toLocaleString()}</span>
                      </TableCell>
                      <TableCell className="text-center py-4 px-4">
                        <MetricBadge value={parseFloat(avgStartRate)} label="%" />
                      </TableCell>
                      <TableCell className="text-center py-4 px-4">
                        <MetricBadge value={parseFloat(avgCompletionRate)} label="%" />
                      </TableCell>
                      <TableCell className="text-center py-4 px-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/30 to-emerald-600/20 rounded-full border border-emerald-500/40 backdrop-blur-sm">
                          <Target className="h-4 w-4 text-emerald-300" />
                          <span className="text-sm font-bold text-emerald-300 tabular-nums">
                            {avgOverallConv}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      {renderCampaignTable(
        coldEmailCampaigns,
        'Cold Email Campaigns',
        'Quiz invitation emails sent to existing leads',
        <Mail className="h-5 w-5 text-emerald-400" />
      )}
      {renderCampaignTable(
        postQuizCampaigns,
        'Post-Quiz Retargeting',
        'Product promotion emails sent to quiz-takers',
        <Target className="h-5 w-5 text-emerald-400" />
      )}
      {campaigns.length === 0 && (
        <GlassCard intensity="heavy">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20">
              <Mail className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="text-lg font-semibold text-white mb-2">No campaign data yet</p>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              Campaign tracking will appear here once you send emails with UTM parameters
            </p>
          </CardContent>
        </GlassCard>
      )}
    </div>
  )
}

// Helper functions
function getCampaignLabel(campaign: string): string {
  const labels: Record<string, string> = {
    // Cold email campaigns
    'email_2': 'Email 2: Brain Science',
    'email_3': 'Email 3: Four Patterns',
    'email_4': 'Email 4: Social Proof',
    'email_5_final': 'Email 5: Final Call',
    'quiz_invite': 'Email 1: Quiz Invitation',
    'email_sequence': 'General Email Sequence',

    // Post-quiz retargeting
    'quiz-retargeting': 'Post-Quiz Retargeting',
    'day-0': 'Day 0: Instant Confirmation',
    'day-1': 'Day 1: Follow-Up',
    'day-3': 'Day 3: Pattern Recognition',
    'day-5': 'Day 5: Risk Reversal',
    'day-7': 'Day 7: Final Urgency',
  }
  return labels[campaign] || campaign
}

function calculateAverage(campaigns: CampaignMetrics[], field: keyof CampaignMetrics): string {
  if (campaigns.length === 0) return '0.0'
  const sum = campaigns.reduce((acc, c) => acc + (c[field] as number), 0)
  return (sum / campaigns.length).toFixed(1)
}
