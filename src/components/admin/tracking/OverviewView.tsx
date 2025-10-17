import React from 'react'
import { KPICard } from './KPICard'
import { LeadAcquisitionChart } from './LeadAcquisitionChart'
import { LeadSourceChart } from './LeadSourceChart'
import { DeviceBreakdownChart } from './DeviceBreakdownChart'
import { TrafficSourceChart } from './TrafficSourceChart'
import { useOverviewAnalytics } from '../../../hooks/useTrackingAnalytics'
import type { Lead } from '../../../lib/types/leads'
import type { ContactSubmission } from '../../../lib/types/contact'
import type { DateRange } from '../../../lib/services/trackingAnalytics'

interface OverviewViewProps {
  leads: Lead[]
  contactSubmissions: ContactSubmission[]
  loading: boolean
  dateRange?: { from?: Date; to?: Date }
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  leads,
  contactSubmissions,
  loading,
  dateRange,
}) => {
  /**
   * Date Range Conversion Flow:
   * 1. React date picker provides { from: Date, to: Date }
   * 2. Convert to ISO strings for analytics service
   * 3. Set end date to end of day (23:59:59.999) to include full last day
   * 4. Analytics services will:
   *    - Validate the date range
   *    - Convert ISO strings to YYYY-MM-DD format for Facebook API
   *    - Use same date range for both Facebook Ads and Shopify revenue queries
   *    - Default to last 30 days if no date range provided
   */
  const analyticsDateRange: DateRange | undefined = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: (() => {
          const endOfDay = new Date(dateRange.to)
          endOfDay.setHours(23, 59, 59, 999)
          return endOfDay.toISOString()
        })(),
      }
    : undefined

  // Fetch revenue and traffic source data
  // This will trigger comprehensive logging in the browser console for debugging
  const { revenueMetrics, trafficSourceStats, buyButtonMetrics, facebookAdsMetrics, loading: revenueLoading } = useOverviewAnalytics(analyticsDateRange)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  // Filter leads by date range if provided
  const filteredLeads = dateRange?.from && dateRange?.to
    ? leads.filter(lead => {
        const leadDate = new Date(lead.created_at)
        // Set end date to end of day to include full day
        const endOfDay = new Date(dateRange.to!)
        endOfDay.setHours(23, 59, 59, 999)
        return leadDate >= dateRange.from! && leadDate <= endOfDay
      })
    : leads

  const totalLeads = filteredLeads.length

  // Check if custom date range is active
  const hasCustomDateRange = dateRange?.from && dateRange?.to

  // Calculate date ranges
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // If date range is active, calculate metrics within that range
  let todayLeads: number, yesterdayLeads: number, weekLeads: number
  let todayLabel: string, yesterdayLabel: string, weekLabel: string

  if (hasCustomDateRange) {
    // For custom date range, show first day and last day of the selected range
    const rangeStart = new Date(dateRange.from!)
    rangeStart.setHours(0, 0, 0, 0)
    const rangeEnd = new Date(dateRange.to!)
    rangeEnd.setHours(23, 59, 59, 999)

    // First day in range
    const firstDayEnd = new Date(rangeStart)
    firstDayEnd.setHours(23, 59, 59, 999)
    todayLeads = filteredLeads.filter(lead => {
      const leadDate = new Date(lead.created_at)
      return leadDate >= rangeStart && leadDate <= firstDayEnd
    }).length
    todayLabel = 'First Day'

    // Last day in range
    const lastDayStart = new Date(rangeEnd)
    lastDayStart.setHours(0, 0, 0, 0)
    yesterdayLeads = filteredLeads.filter(lead => {
      const leadDate = new Date(lead.created_at)
      return leadDate >= lastDayStart && leadDate <= rangeEnd
    }).length
    yesterdayLabel = 'Last Day'

    // Total in range
    weekLeads = filteredLeads.length
    weekLabel = 'Date Range'
  } else {
    // Use actual today/yesterday when no custom range
    todayLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= startOfToday).length
    yesterdayLeads = filteredLeads.filter(lead => {
      const leadDate = new Date(lead.created_at)
      return leadDate >= startOfYesterday && leadDate < startOfToday
    }).length
    weekLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= weekAgo).length
    todayLabel = 'Today'
    yesterdayLabel = 'Yesterday'
    weekLabel = 'This Week'
  }

  const newSubmissions = contactSubmissions.filter(s => s.status === 'new').length

  // Calculate week-over-week trends (only for non-custom range)
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const previousWeekLeads = filteredLeads.filter(lead => {
    const leadDate = new Date(lead.created_at)
    return leadDate >= twoWeeksAgo && leadDate < weekAgo
  }).length

  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, direction: 'neutral' as const }
    const percentChange = ((current - previous) / previous) * 100
    return {
      value: percentChange,
      direction: percentChange > 0 ? 'up' as const : percentChange < 0 ? 'down' as const : 'neutral' as const
    }
  }

  const weekTrend = hasCustomDateRange ? undefined : calculateTrend(weekLeads, previousWeekLeads)
  const todayTrend = hasCustomDateRange ? undefined : calculateTrend(todayLeads, yesterdayLeads)

  return (
    <div className="space-y-8">
      {/* Revenue & Sales Performance Section */}
      {revenueMetrics && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">💰 Revenue & Sales Performance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Overall revenue and order metrics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard
              label="Total Revenue"
              value={formatCurrency(revenueMetrics.totalRevenue)}
              subtitle="All orders in period"
              variant="amber"
              loading={revenueLoading}
            />

            <KPICard
              label="Total Orders"
              value={revenueMetrics.totalOrders}
              subtitle={`AOV: ${formatCurrency(revenueMetrics.averageOrderValue)}`}
              variant="success"
              loading={revenueLoading}
            />

            <KPICard
              label="Today's Revenue"
              value={formatCurrency(revenueMetrics.todayRevenue)}
              subtitle={`${revenueMetrics.todayOrders} orders today`}
              loading={revenueLoading}
            />

            <KPICard
              label="This Week"
              value={formatCurrency(revenueMetrics.weekRevenue)}
              subtitle={`${revenueMetrics.weekOrders} orders`}
              loading={revenueLoading}
            />
          </div>
        </div>
      )}

      {/* Marketing Performance Section */}
      {facebookAdsMetrics && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Marketing Performance (Facebook Ads)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ad spend, ROAS, and profitability metrics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard
              label="ROAS (Return on Ad Spend)"
              value={`${facebookAdsMetrics.roas.toFixed(2)}x`}
              subtitle={`$${facebookAdsMetrics.revenue.toFixed(0)} revenue / $${facebookAdsMetrics.adSpend.toFixed(0)} spend`}
              variant="amber"
              loading={revenueLoading}
            />

            <KPICard
              label="Ad Spend"
              value={formatCurrency(facebookAdsMetrics.adSpend)}
              subtitle={`${facebookAdsMetrics.impressions.toLocaleString()} impressions`}
              variant="success"
              loading={revenueLoading}
            />

            <KPICard
              label="Profit (Revenue - Ad Spend)"
              value={formatCurrency(facebookAdsMetrics.profit)}
              subtitle={`ROI: ${facebookAdsMetrics.roi.toFixed(1)}%`}
              variant={facebookAdsMetrics.profit >= 0 ? 'success' : 'amber'}
              loading={revenueLoading}
            />

            <KPICard
              label="Cost Per Acquisition (CPA)"
              value={formatCurrency(facebookAdsMetrics.cpa)}
              subtitle={`${facebookAdsMetrics.clicks.toLocaleString()} clicks • ${facebookAdsMetrics.ctr.toFixed(2)}% CTR`}
              loading={revenueLoading}
            />
          </div>
        </div>
      )}

      {/* Conversion Performance Section */}
      {buyButtonMetrics && (
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🎯 Conversion Performance</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Buy button click rates across pages</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KPICard
              label="Global Buy Button Click Rate"
              value={`${buyButtonMetrics.globalClickRate.toFixed(1)}%`}
              subtitle={`${buyButtonMetrics.globalClicks} clicks / ${buyButtonMetrics.globalSessions} sessions`}
              variant="amber"
              loading={revenueLoading}
            />

            <KPICard
              label="Thank You Page Click Rate"
              value={`${buyButtonMetrics.thankYouClickRate.toFixed(1)}%`}
              subtitle={`${buyButtonMetrics.thankYouClicks} clicks / ${buyButtonMetrics.thankYouSessions} sessions`}
              variant="success"
              loading={revenueLoading}
            />

            <KPICard
              label="Product Page Click Rate"
              value={`${buyButtonMetrics.productClickRate.toFixed(1)}%`}
              subtitle={`${buyButtonMetrics.productClicks} clicks / ${buyButtonMetrics.productSessions} sessions`}
              variant="success"
              loading={revenueLoading}
            />
          </div>
        </div>
      )}

      {/* Lead Generation Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📧 Lead Generation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email captures and contact form submissions</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          label="Total Leads"
          value={totalLeads}
          subtitle="All time collection"
          variant="success"
          loading={loading}
        />

        <KPICard
          label={todayLabel}
          value={todayLeads}
          subtitle={hasCustomDateRange ? "First day in range" : "Leads today"}
          variant="amber"
          loading={loading}
          trend={todayTrend}
        />

        <KPICard
          label={yesterdayLabel}
          value={yesterdayLeads}
          subtitle={hasCustomDateRange ? "Last day in range" : "Leads yesterday"}
          loading={loading}
        />

        <KPICard
          label={weekLabel}
          value={weekLeads}
          subtitle={hasCustomDateRange ? "Total in range" : "Last 7 days"}
          loading={loading}
          trend={weekTrend}
        />

        <KPICard
          label="New Contact Submissions"
          value={newSubmissions}
          subtitle="Needs attention"
          variant="amber"
          loading={loading}
        />
        </div>
      </div>

      {/* Traffic & Analytics Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📈 Traffic & Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Traffic sources, acquisition trends, and device breakdown</p>
        </div>

        {/* Traffic Source Chart */}
        {trafficSourceStats.length > 0 && (
          <div className="mb-6">
            <TrafficSourceChart data={trafficSourceStats} loading={revenueLoading} />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <LeadAcquisitionChart leads={filteredLeads} days={30} loading={loading} />
          <LeadSourceChart leads={filteredLeads} loading={loading} />
        </div>

        {/* Device Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DeviceBreakdownChart data={filteredLeads} loading={loading} title="Device Breakdown - Leads" />
        </div>
      </div>
    </div>
  )
}
