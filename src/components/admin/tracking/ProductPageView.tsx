import React from 'react'
import { KPICard } from './KPICard'
import { DataTable, PercentageBadge, type Column } from './DataTable'
import { StatsList } from './StatsList'
import { DeviceBreakdownChart } from './DeviceBreakdownChart'
import { FunnelVisualization } from './FunnelVisualization'
import { GlassCard } from '../../ui/glass-card'
import { useProductAnalytics } from '../../../hooks/useTrackingAnalytics'
import type { DateRange } from '../../../lib/services/trackingAnalytics'
import type { UTMCampaignStats } from '../../../lib/services/trackingAnalytics'

interface ProductPageViewProps {
  dateRange?: DateRange
}

export const ProductPageView: React.FC<ProductPageViewProps> = ({ dateRange }) => {
  const { metrics, utmCampaignData, faqData, deviceData, funnelData, loading } = useProductAnalytics(dateRange)

  if (!metrics && !loading) {
    return (
      <div className="text-center text-white/60 py-12">
        No data available for the selected period
      </div>
    )
  }

  const utmCampaignColumns: Column<UTMCampaignStats>[] = [
    { header: 'Campaign', accessor: 'campaign', render: (value) => <span className="font-medium">{value}</span> },
    { header: 'Sessions', accessor: 'sessions' },
    { header: 'Conversions', accessor: 'conversions' },
    { header: 'Conv. Rate', accessor: 'conversionRate', render: (value) => <PercentageBadge value={value} /> },
    { header: 'Avg Scroll', accessor: 'avgScrollDepth', render: (value) => `${value}%` },
    { header: 'Avg Time', accessor: 'avgTimeOnPage', render: (value) => `${value}s` },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          label="Total Sessions"
          value={metrics?.totalSessions || 0}
          subtitle={`${metrics?.totalWithEmail || 0} from retargeting`}
          loading={loading}
        />

        <KPICard
          label="Conversion Rate"
          value={`${metrics?.conversionRate.toFixed(1) || 0}%`}
          subtitle={`${metrics?.clickedBuyButton || 0} purchases`}
          variant="success"
          loading={loading}
        />

        <KPICard
          label="Price View Rate"
          value={`${metrics?.priceViewRate.toFixed(1) || 0}%`}
          subtitle={`${metrics?.viewedPrice || 0} saw pricing`}
          loading={loading}
        />

        <KPICard
          label="Avg Time on Page"
          value={`${metrics?.avgTimeOnPage || 0}s`}
          subtitle={`Scroll: ${metrics?.avgScrollDepth || 0}%`}
          loading={loading}
        />
      </div>

      {/* Conversion Funnel */}
      <FunnelVisualization
        stages={funnelData}
        loading={loading}
        title="Product Page Conversion Funnel"
      />

      {/* UTM Campaigns Table */}
      {utmCampaignData.length > 0 && (
        <GlassCard intensity="heavy">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Retargeting Campaign Performance</h3>
            <DataTable
              columns={utmCampaignColumns}
              data={utmCampaignData}
              emptyMessage="No campaign data available"
            />
          </div>
        </GlassCard>
      )}

      {/* FAQ Stats & Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqData.length > 0 && (
          <GlassCard intensity="heavy" className="p-6">
            <StatsList
              title="Most Clicked FAQs"
              items={faqData.map(row => ({
                label: row.question,
                value: `${row.clicks} clicks`,
                badge: {
                  value: `${row.percentage.toFixed(1)}%`,
                  variant: 'default'
                }
              }))}
            />
          </GlassCard>
        )}

        <DeviceBreakdownChart data={deviceData} loading={loading} title="Device Breakdown - Product Page" />
      </div>
    </div>
  )
}
