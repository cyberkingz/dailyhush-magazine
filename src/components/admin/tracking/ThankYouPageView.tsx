import React from 'react'
import { KPICard } from './KPICard'
import { DataTable, PercentageBadge, type Column } from './DataTable'
import { StatsList } from './StatsList'
import { ConversionTrendChart } from './ConversionTrendChart'
import { DeviceBreakdownChart } from './DeviceBreakdownChart'
import { GlassCard } from '../../ui/glass-card'
import { useThankYouAnalytics } from '../../../hooks/useTrackingAnalytics'
import type { DateRange } from '../../../lib/services/trackingAnalytics'
import type { QuizScoreConversion } from '../../../lib/services/trackingAnalytics'

interface ThankYouPageViewProps {
  dateRange?: DateRange
}

export const ThankYouPageView: React.FC<ThankYouPageViewProps> = ({ dateRange }) => {
  const { metrics, revenueData, quizScoreData, scrollDepthData, buttonLocationData, conversionTrendData, deviceData, loading } = useThankYouAnalytics(dateRange)

  if (!metrics && !loading) {
    return (
      <div className="text-center text-white/60 py-12">
        No data available for the selected period
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const quizScoreColumns: Column<QuizScoreConversion>[] = [
    { header: 'Score', accessor: 'quizScore', render: (value) => <span className="font-bold">{value}</span> },
    { header: 'Type', accessor: 'quizType', render: (value) => value || 'N/A' },
    { header: 'Sessions', accessor: 'sessions' },
    { header: 'Conversions', accessor: 'conversions' },
    { header: 'Conv. Rate', accessor: 'conversionRate', render: (value) => <PercentageBadge value={value} /> },
    { header: 'Avg Scroll', accessor: 'avgScrollDepth', render: (value) => `${value}%` },
  ]

  return (
    <div className="space-y-6">
      {/* Revenue KPI Cards */}
      {revenueData && (revenueData.totalRevenue > 0 || revenueData.totalOrders > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard
            label="Total Revenue"
            value={formatCurrency(revenueData.totalRevenue)}
            subtitle="From thank you page visitors"
            variant="amber"
            loading={loading}
          />

          <KPICard
            label="Orders"
            value={revenueData.totalOrders}
            subtitle="Completed purchases"
            loading={loading}
          />

          <KPICard
            label="Avg Order Value"
            value={formatCurrency(revenueData.averageOrderValue)}
            subtitle="Per transaction"
            loading={loading}
          />

          <KPICard
            label="Revenue Per Visitor"
            value={formatCurrency(revenueData.conversionValue)}
            subtitle="Lifetime value indicator"
            variant="success"
            loading={loading}
          />
        </div>
      )}

      {/* Engagement KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          label="Total Sessions"
          value={metrics?.totalSessions || 0}
          subtitle={`${metrics?.totalWithEmail || 0} with email`}
          loading={loading}
        />

        <KPICard
          label="Conversion Rate"
          value={`${metrics?.conversionRate.toFixed(1) || 0}%`}
          subtitle={`${metrics?.clickedBuyButton || 0} conversions`}
          variant="success"
          loading={loading}
        />

        <KPICard
          label="Avg Scroll Depth"
          value={`${metrics?.avgScrollDepth || 0}%`}
          subtitle="User engagement"
          loading={loading}
        />

        <KPICard
          label="Avg Time on Page"
          value={`${metrics?.avgTimeOnPage || 0}s`}
          subtitle="Session duration"
          loading={loading}
        />
      </div>

      {/* Conversion Trend Chart */}
      <ConversionTrendChart data={conversionTrendData} loading={loading} />

      {/* Quiz Score Conversions Table */}
      {quizScoreData.length > 0 && (
        <GlassCard intensity="heavy">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Conversion by Quiz Score</h3>
            <DataTable
              columns={quizScoreColumns}
              data={quizScoreData}
              emptyMessage="No quiz score data available"
            />
          </div>
        </GlassCard>
      )}

      {/* Scroll Depth Distribution & Button Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scrollDepthData.length > 0 && (
          <GlassCard intensity="heavy" className="p-6">
            <StatsList
              title="Scroll Depth Distribution"
              items={scrollDepthData.map(row => ({
                label: row.range,
                value: `${row.sessions} sessions`,
                badge: {
                  value: `${row.conversionRate.toFixed(1)}%`,
                  variant: row.conversionRate >= 30 ? 'success' : row.conversionRate >= 15 ? 'warning' : 'default'
                }
              }))}
            />
          </GlassCard>
        )}

        {buttonLocationData.length > 0 && (
          <GlassCard intensity="heavy" className="p-6">
            <StatsList
              title="Buy Button Clicks by Location"
              items={buttonLocationData.map(row => ({
                label: row.location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                value: `${row.clicks} clicks`,
                badge: {
                  value: `${row.percentage.toFixed(1)}%`,
                  variant: 'success'
                }
              }))}
            />
          </GlassCard>
        )}
      </div>

      {/* Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeviceBreakdownChart data={deviceData} loading={loading} title="Device Breakdown - Thank You Page" />
      </div>
    </div>
  )
}
