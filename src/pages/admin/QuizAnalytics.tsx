import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, Download, Search } from 'lucide-react'
import { subDays, differenceInDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { cn } from '../../lib/utils'
import { quizQuestions } from '../../data/quizQuestions'
import { BasicDateRangePicker } from '../../components/admin/BasicDateRangePicker'
import { QuizFunnelChart } from '../../components/admin/analytics/QuizFunnelChart'
import { FunnelActionItems } from '../../components/admin/analytics/FunnelActionItems'
import {
  getQuizFunnelMetrics,
  getQuestionLevelMetrics,
  getCompletionTimeMetrics,
  getDailyTimeSeriesMetrics,
  type QuestionMetrics as QuizQuestionMetrics,
} from '../../lib/services/quiz'
import {
  KPICardSkeleton,
  FunnelChartSkeleton,
  TableSkeleton,
  ChartSkeleton,
  AlertSkeleton,
} from '../../components/admin/analytics/SkeletonLoader'
import { Input } from '../../components/ui/input'
import { Switch } from '../../components/ui/switch'
import Button from '../../components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../../components/ui/card'
import { GlassCard } from '../../components/ui/glass-card'
import { Badge } from '../../components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../components/ui/table'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../components/ui/chart'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'

interface QuizMetrics {
  totalViews: number
  totalStarts: number
  totalCompletions: number
  totalEmails: number
  startRate: number
  completionRate: number
  emailCaptureRate: number
}

interface QuestionMetrics {
  id: string
  question: string
  section: string
  views: number
  completions: number
  dropoffRate: number
  avgTimeSpent: number
}

interface DeviceMetrics {
  name: string
  views: number
  completions: number
  conversionRate: number
}

export default function QuizAnalytics() {
  const [metrics, setMetrics] = useState<QuizMetrics | null>(null)
  const [previousMetrics, setPreviousMetrics] = useState<QuizMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [questionData, setQuestionData] = useState<QuestionMetrics[]>([])
  const [deviceData, setDeviceData] = useState<DeviceMetrics[]>([])
  const [sourceData, setSourceData] = useState<DeviceMetrics[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [comparisonMode, setComparisonMode] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange, comparisonMode])

  // Filter questions based on search query
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questionData

    const query = searchQuery.toLowerCase()
    return questionData.filter((q) =>
      q.question.toLowerCase().includes(query) ||
      q.section.toLowerCase().includes(query)
    )
  }, [questionData, searchQuery])

  // Calculate percentage change between current and previous period
  const calculateChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    if (previous === 0) return { value: 0, isPositive: true }
    const change = ((current - previous) / previous) * 100
    return { value: Math.abs(change), isPositive: change >= 0 }
  }

  // Export function
  const handleExport = () => {
    // Prepare CSV headers
    const headers = ['Section', 'Question', 'Views', 'Completions', 'Drop-off Rate', 'Avg Time (s)']

    // Prepare CSV rows
    const rows = filteredQuestions.map(q => [
      q.section,
      q.question.replace(/"/g, '""'), // Escape quotes
      q.views.toString(),
      q.completions.toString(),
      `${q.dropoffRate.toFixed(1)}%`,
      `${q.avgTimeSpent}s`
    ])

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    const dateStr = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `quiz-analytics-${dateStr}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function loadAnalyticsData() {
    try {
      setIsLoading(true)

      // Build date range for analytics functions
      const analyticsDateRange = dateRange?.from && dateRange?.to
        ? {
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to.toISOString(),
          }
        : undefined

      // Get real funnel metrics from quiz_events table
      const funnelMetrics = await getQuizFunnelMetrics(analyticsDateRange)

      // Get all quiz submissions for email count
      const { data: allSubmissions, error } = await supabase
        .from('quiz_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Filter submissions by current date range
      const currentPeriodSubmissions = allSubmissions?.filter(s => {
        const submissionDate = new Date(s.created_at)
        return dateRange?.from && dateRange?.to
          ? submissionDate >= dateRange.from && submissionDate <= dateRange.to
          : true
      }) || []

      const totalEmails = currentPeriodSubmissions.length

      const calculatedMetrics: QuizMetrics = {
        totalViews: funnelMetrics.pageViews,
        totalStarts: funnelMetrics.quizStarts,
        totalCompletions: funnelMetrics.quizCompletions,
        totalEmails,
        startRate: funnelMetrics.startRate,
        completionRate: funnelMetrics.completionRate,
        emailCaptureRate: funnelMetrics.quizCompletions > 0 ? (totalEmails / funnelMetrics.quizCompletions) * 100 : 0,
      }

      setMetrics(calculatedMetrics)

      // Calculate previous period metrics for comparison mode
      if (comparisonMode && dateRange?.from && dateRange?.to) {
        const periodLength = differenceInDays(dateRange.to, dateRange.from)
        const previousPeriodEnd = subDays(dateRange.from, 1)
        const previousPeriodStart = subDays(previousPeriodEnd, periodLength)

        // Get previous period funnel metrics
        const previousFunnelMetrics = await getQuizFunnelMetrics({
          startDate: previousPeriodStart.toISOString(),
          endDate: previousPeriodEnd.toISOString(),
        })

        const previousPeriodSubmissions = allSubmissions?.filter(s => {
          const submissionDate = new Date(s.created_at)
          return submissionDate >= previousPeriodStart && submissionDate <= previousPeriodEnd
        }) || []

        const prevTotalEmails = previousPeriodSubmissions.length

        const previousCalculatedMetrics: QuizMetrics = {
          totalViews: previousFunnelMetrics.pageViews,
          totalStarts: previousFunnelMetrics.quizStarts,
          totalCompletions: previousFunnelMetrics.quizCompletions,
          totalEmails: prevTotalEmails,
          startRate: previousFunnelMetrics.startRate,
          completionRate: previousFunnelMetrics.completionRate,
          emailCaptureRate: previousFunnelMetrics.quizCompletions > 0 ? (prevTotalEmails / previousFunnelMetrics.quizCompletions) * 100 : 0,
        }

        setPreviousMetrics(previousCalculatedMetrics)
      } else {
        setPreviousMetrics(null)
      }

      // Get real time series data from quiz_events
      const dailyMetrics = await getDailyTimeSeriesMetrics(analyticsDateRange)
      setTimeSeriesData(dailyMetrics)

      // Device breakdown
      const deviceBreakdown = currentPeriodSubmissions.reduce((acc: any, s) => {
        const device = s.device_type || 'unknown'
        if (!acc[device]) {
          acc[device] = { name: device, views: 0, completions: 0, conversionRate: 0 }
        }
        acc[device].views += 1
        acc[device].completions += 1
        return acc
      }, {})

      const deviceArray = Object.values(deviceBreakdown || {}).map((d: any) => ({
        ...d,
        conversionRate: d.views > 0 ? Math.round((d.completions / d.views) * 100) : 0
      }))

      setDeviceData(deviceArray)

      // Source breakdown
      const sourceBreakdown = currentPeriodSubmissions.reduce((acc: any, s) => {
        const source = s.utm_source || 'direct'
        if (!acc[source]) {
          acc[source] = { name: source, views: 0, completions: 0, conversionRate: 0 }
        }
        acc[source].views += 1
        acc[source].completions += 1
        return acc
      }, {})

      const sourceArray = Object.values(sourceBreakdown || {}).map((s: any) => ({
        ...s,
        conversionRate: s.views > 0 ? Math.round((s.completions / s.views) * 100) : 0
      }))

      setSourceData(sourceArray)

      // Get real question-level metrics
      const realQuestionMetrics = await getQuestionLevelMetrics(analyticsDateRange)

      // Map real metrics to UI format and merge with quiz question data
      const questionAnalytics = quizQuestions.map((q, index) => {
        const realMetric = realQuestionMetrics.find(m => m.questionId === q.id)
        return {
          id: q.id,
          question: q.question,
          section: q.section,
          views: realMetric?.views || 0,
          completions: realMetric?.completions || 0,
          dropoffRate: realMetric?.dropoffRate || 0,
          avgTimeSpent: realMetric?.avgTimeSpent || 0,
        }
      })

      setQuestionData(questionAnalytics)

    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !metrics) {
    return (
      <AdminLayout currentPage="/admin/quiz-analytics">
        <div className="space-y-8">
          {/* Page Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Alert Skeleton */}
          <AlertSkeleton />

          {/* KPI Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </div>

          {/* Funnel Chart Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse mt-2" />
            </CardHeader>
            <CardContent>
              <FunnelChartSkeleton />
            </CardContent>
          </Card>

          {/* Chart Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mt-2" />
            </CardHeader>
            <CardContent>
              <ChartSkeleton height={300} />
            </CardContent>
          </Card>

          {/* Table Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-56 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <TableSkeleton rows={8} columns={6} />
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  const chartConfig = {
    starts: {
      label: "Starts",
      color: "hsl(160, 84%, 39%)", // muted emerald
    },
    completions: {
      label: "Completions",
      color: "hsl(160, 70%, 45%)", // lighter muted emerald
    },
    emails: {
      label: "Emails",
      color: "hsl(38, 92%, 50%)", // amber accent for email metrics
    },
  }

  const getStepColor = (rate: number, goodThreshold: number, warningThreshold: number): 'success' | 'warning' | 'error' => {
    if (rate >= goodThreshold) return 'success'
    if (rate >= warningThreshold) return 'warning'
    return 'error'
  }

  const funnelSteps = [
    {
      label: 'Quiz Page Views',
      count: metrics.totalViews,
      percentage: 100,
      color: 'success' as 'success' | 'warning' | 'error',
    },
    {
      label: 'Quiz Started',
      count: metrics.totalStarts,
      percentage: metrics.startRate,
      color: getStepColor(metrics.startRate, 60, 40),
    },
    {
      label: 'Quiz Completed',
      count: metrics.totalCompletions,
      percentage: metrics.completionRate,
      color: getStepColor(metrics.completionRate, 70, 50),
    },
    {
      label: 'Email Captured',
      count: metrics.totalEmails,
      percentage: metrics.emailCaptureRate,
      color: getStepColor(metrics.emailCaptureRate, 85, 70),
    },
  ]

  return (
    <AdminLayout currentPage="/admin/quiz-analytics">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">Quiz Analytics</h1>
            <p className="text-white/70 mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
              Track quiz performance and conversion metrics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-3 px-3 py-2 bg-[hsla(200,14%,78%,0.18)] backdrop-blur-[16px] backdrop-saturate-[140%] rounded-[12px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_1px_2px_-1px_rgba(31,45,61,0.04),0_1px_0_0_rgba(255,255,255,0.15)_inset]">
              <label htmlFor="comparison-mode" className="text-sm font-medium text-white cursor-pointer whitespace-nowrap">
                Compare vs previous period
              </label>
              <Switch
                id="comparison-mode"
                checked={comparisonMode}
                onCheckedChange={setComparisonMode}
              />
            </div>
            <BasicDateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              className="flex-1 sm:flex-initial"
            />
            <Button
              variant="outline"
              size="md"
              onClick={handleExport}
              className="whitespace-nowrap flex-shrink-0 border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard intensity="heavy" className="p-5">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm">Total Quiz Views</CardDescription>
              <CardTitle className="text-3xl text-white font-bold">{metrics.totalViews.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={timeSeriesData.slice(-7)}>
                  <Line
                    type="monotone"
                    dataKey="starts"
                    stroke="hsl(160, 84%, 39%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {comparisonMode && previousMetrics ? (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {(() => {
                    const change = calculateChange(metrics.totalViews, previousMetrics.totalViews)
                    return (
                      <>
                        {change.isPositive ? (
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className={change.isPositive ? 'text-emerald-400' : 'text-red-400'}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)}%
                        </span>
                        <span className="text-white/60">vs previous period</span>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <p className="text-xs text-white/60 mt-1">Last 7 days trend</p>
              )}
            </CardContent>
          </GlassCard>

          <GlassCard intensity="heavy" className="p-5">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm">Completion Rate</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2 text-white font-bold">
                {metrics.completionRate.toFixed(1)}%
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={timeSeriesData.slice(-7)}>
                  <Line
                    type="monotone"
                    dataKey="completions"
                    stroke="hsl(160, 84%, 39%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {comparisonMode && previousMetrics ? (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {(() => {
                    const change = calculateChange(metrics.completionRate, previousMetrics.completionRate)
                    return (
                      <>
                        {change.isPositive ? (
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className={change.isPositive ? 'text-emerald-400' : 'text-red-400'}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)}%
                        </span>
                        <span className="text-white/60">vs previous period</span>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <p className="text-xs text-white/60 mt-1">Last 7 days trend</p>
              )}
            </CardContent>
          </GlassCard>

          <GlassCard intensity="heavy" className="p-5 ring-1 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm">Email Capture</CardDescription>
              <CardTitle className="text-3xl text-white font-bold">{metrics.emailCaptureRate.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={timeSeriesData.slice(-7)}>
                  <Line
                    type="monotone"
                    dataKey="emails"
                    stroke="hsl(38, 92%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {comparisonMode && previousMetrics ? (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {(() => {
                    const change = calculateChange(metrics.emailCaptureRate, previousMetrics.emailCaptureRate)
                    return (
                      <>
                        {change.isPositive ? (
                          <TrendingUp className="h-3 w-3 text-amber-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className={change.isPositive ? 'text-amber-400' : 'text-red-400'}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)}%
                        </span>
                        <span className="text-white/60">vs previous period</span>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-white/60">Last 7 days</span>
                  <span className="font-medium text-amber-400">{metrics.totalEmails} emails</span>
                </div>
              )}
            </CardContent>
          </GlassCard>

          <GlassCard intensity="heavy" className="p-5 ring-1 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.08)]">
            <CardHeader className="p-0 pb-3">
              <CardDescription className="text-white/70 text-sm">Total Emails</CardDescription>
              <CardTitle className="text-3xl text-white font-bold">{metrics.totalEmails.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={timeSeriesData.slice(-7)}>
                  <Line
                    type="monotone"
                    dataKey="emails"
                    stroke="hsl(38, 92%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {comparisonMode && previousMetrics ? (
                <div className="flex items-center gap-2 text-xs mt-1">
                  {(() => {
                    const change = calculateChange(metrics.totalEmails, previousMetrics.totalEmails)
                    return (
                      <>
                        {change.isPositive ? (
                          <TrendingUp className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <span className={change.isPositive ? 'text-emerald-400' : 'text-red-400'}>
                          {change.isPositive ? '+' : '-'}{change.value.toFixed(1)}%
                        </span>
                        <span className="text-white/60">vs previous period</span>
                      </>
                    )
                  })()}
                </div>
              ) : (
                <p className="text-xs text-white/60 mt-1">Weekly growth trend</p>
              )}
            </CardContent>
          </GlassCard>
        </div>

        {/* Funnel Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
          {/* Left Column - Funnel & Trends */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conversion Funnel */}
            <GlassCard intensity="heavy">
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-semibold text-white">Conversion Funnel</h3>
                <p className="text-sm text-white/70 mt-1">Step-by-step conversion breakdown</p>
              </div>
              <div className="px-6 pb-6">
                <QuizFunnelChart steps={funnelSteps} />
              </div>
            </GlassCard>

            {/* Trends Over Time */}
            <GlassCard intensity="heavy" className="ring-1 ring-amber-500/10 shadow-[0_0_24px_rgba(245,158,11,0.06)]">
              <div className="px-6 pt-6 pb-3">
                <h3 className="text-base font-semibold text-white">Trends Over Time</h3>
                <p className="text-sm text-white/70 mt-1">Last 30 days performance</p>
              </div>
              <div className="px-6 pb-6">
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <AreaChart data={timeSeriesData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }}
                      tickLine={false}
                      axisLine={false}
                      width={30}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="starts"
                      stroke="hsl(160, 84%, 39%)"
                      fill="hsl(160, 84%, 39%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="completions"
                      stroke="hsl(160, 70%, 45%)"
                      fill="hsl(160, 70%, 45%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="emails"
                      stroke="hsl(38, 92%, 50%)"
                      fill="url(#amberGradient)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </GlassCard>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            {/* Action Items */}
            <GlassCard intensity="heavy">
              <div className="p-6">
                <FunnelActionItems steps={funnelSteps} />
              </div>
            </GlassCard>
            {/* Device Performance */}
            {deviceData.length > 0 && (
              <GlassCard intensity="heavy">
                <div className="px-6 pt-6 pb-4">
                  <h4 className="text-sm font-semibold text-white">Device Performance</h4>
                  <p className="text-xs text-white/70 mt-1">Conversion by device type</p>
                </div>
                <div className="px-6 pb-6 space-y-2">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center justify-between py-2.5 border-b border-[hsla(200,16%,80%,0.18)] last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          device.conversionRate >= 70 ? "bg-emerald-400" :
                          device.conversionRate >= 50 ? "bg-amber-400" :
                          "bg-red-400"
                        )} />
                        <span className="text-sm font-medium capitalize text-white">{device.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70">{device.views} views</span>
                        <Badge
                          variant={device.conversionRate >= 70 ? 'success' : device.conversionRate >= 50 ? 'warning' : 'destructive'}
                          className="min-w-[48px] justify-center text-xs"
                        >
                          {device.conversionRate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Source Performance */}
            {sourceData.length > 0 && (
              <GlassCard intensity="heavy">
                <div className="px-6 pt-6 pb-4">
                  <h4 className="text-sm font-semibold text-white">Top Sources</h4>
                  <p className="text-xs text-white/70 mt-1">Conversion by traffic source</p>
                </div>
                <div className="px-6 pb-6 space-y-2">
                  {sourceData.slice(0, 5).map((source) => (
                    <div key={source.name} className="flex items-center justify-between py-2.5 border-b border-[hsla(200,16%,80%,0.18)] last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          source.conversionRate >= 70 ? "bg-emerald-400" :
                          source.conversionRate >= 50 ? "bg-amber-400" :
                          "bg-red-400"
                        )} />
                        <span className="text-sm font-medium capitalize text-white">{source.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/70">{source.views} views</span>
                        <Badge
                          variant={source.conversionRate >= 70 ? 'success' : source.conversionRate >= 50 ? 'warning' : 'destructive'}
                          className="min-w-[48px] justify-center text-xs"
                        >
                          {source.conversionRate}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </div>

        {/* Question-Level Analysis */}
        <GlassCard intensity="heavy" className="ring-1 ring-amber-500/5">
          <div className="px-6 pt-6 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Question-Level Analysis</h3>
                <p className="text-sm text-white/70 mt-1">Drop-off rates and engagement per question</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            {/* Liquid glass table container - matches page aesthetic */}
            <div className="bg-[hsla(200,12%,70%,0.22)] backdrop-blur-[32px] backdrop-saturate-[140%] rounded-[16px] border border-[hsla(200,16%,80%,0.18)] shadow-[0_8px_16px_-4px_rgba(31,45,61,0.1),0_16px_32px_-8px_rgba(31,45,61,0.14),0_1px_0_0_rgba(255,255,255,0.12)_inset] overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-[hsla(200,16%,80%,0.18)] hover:bg-transparent bg-[hsla(200,10%,60%,0.25)] backdrop-blur-[48px] backdrop-saturate-[140%]">
                    <TableHead className="text-white font-bold text-sm py-5 px-6 drop-shadow-sm">Question</TableHead>
                    <TableHead className="text-white font-bold text-sm py-5 px-6 drop-shadow-sm">Section</TableHead>
                    <TableHead className="text-white font-bold text-sm py-5 px-6 drop-shadow-sm">Views</TableHead>
                    <TableHead className="text-white font-bold text-sm py-5 px-6 drop-shadow-sm">Completions</TableHead>
                    <TableHead className="text-white font-bold text-sm py-5 px-6 drop-shadow-sm">Drop-off Rate</TableHead>
                    <TableHead className="text-white font-bold text-sm py-5 px-6 drop-shadow-sm">Avg Time (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question, index) => (
                      <TableRow
                        key={question.id}
                        className={cn(
                          "border-b border-[hsla(200,16%,80%,0.18)] last:border-0",
                          "hover:bg-[hsla(200,14%,78%,0.22)] transition-all duration-200",
                          index % 2 === 1 && "bg-[hsla(200,14%,78%,0.12)] backdrop-blur-[16px] backdrop-saturate-[140%]",
                          // Subtle amber highlight for high drop-off rates
                          question.dropoffRate >= 20 && "border-l-2 border-l-amber-500/30"
                        )}
                      >
                        <TableCell className="font-semibold text-white max-w-md truncate py-5 px-6 drop-shadow-sm">
                          {question.question}
                        </TableCell>
                        <TableCell className="py-5 px-6">
                          <Badge variant="outline">{question.section}</Badge>
                        </TableCell>
                        <TableCell className="text-white font-bold py-5 px-6 drop-shadow-sm">{question.views}</TableCell>
                        <TableCell className="text-white font-bold py-5 px-6 drop-shadow-sm">{question.completions}</TableCell>
                        <TableCell className="py-5 px-6">
                          <Badge
                            variant={question.dropoffRate < 10 ? 'success' : question.dropoffRate < 20 ? 'warning' : 'destructive'}
                          >
                            {question.dropoffRate.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white font-bold py-5 px-6 drop-shadow-sm">{question.avgTimeSpent}s</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-white py-10 px-6 font-semibold drop-shadow-sm">
                        No questions found matching "{searchQuery}"
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}
