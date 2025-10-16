import React from 'react'
import { KPICard } from './KPICard'
import { DataTable, BooleanBadge, type Column } from './DataTable'
import { GlassCard } from '../../ui/glass-card'
import { useUserJourneyAnalytics } from '../../../hooks/useTrackingAnalytics'
import type { DateRange } from '../../../lib/services/trackingAnalytics'
import type { UserJourney } from '../../../lib/services/trackingAnalytics'

interface UserJourneyViewProps {
  dateRange?: DateRange
}

export const UserJourneyView: React.FC<UserJourneyViewProps> = ({ dateRange }) => {
  const { journeyData, journeySummary, loading } = useUserJourneyAnalytics(dateRange, 50)

  if (!journeySummary && !loading) {
    return (
      <div className="text-center text-white/60 py-12">
        No journey data available for the selected period
      </div>
    )
  }

  const journeyColumns: Column<UserJourney>[] = [
    { header: 'Email', accessor: 'email', render: (value) => <span className="text-sm font-mono">{value}</span> },
    { header: 'Quiz Score', accessor: 'quizScore', render: (value) => value || 'N/A' },
    { header: 'TY Scroll', accessor: 'thankYouScroll', render: (value) => `${value}%` },
    { header: 'TY Click', accessor: 'thankYouClicked', render: (value) => <BooleanBadge value={value} /> },
    { header: 'Campaign', accessor: 'retargetingCampaign', render: (value) => <span className="text-sm">{value || '—'}</span> },
    { header: 'Prod Scroll', accessor: 'productScroll', render: (value) => value ? `${value}%` : '—' },
    {
      header: 'Prod Click',
      accessor: 'productClicked',
      render: (value) => value !== null ? <BooleanBadge value={value} /> : <span className="text-white/40">—</span>
    },
  ]

  return (
    <div className="space-y-6">
      {/* Journey Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          label="Total Users Tracked"
          value={journeySummary?.totalUsers || 0}
          subtitle="With email tracking"
          loading={loading}
        />

        <KPICard
          label="Completed Journey"
          value={journeySummary?.completedJourney || 0}
          subtitle="Visited product page"
          variant="amber"
          loading={loading}
        />

        <KPICard
          label="Converted on Thank You"
          value={journeySummary?.convertedOnThankYou || 0}
          subtitle="Immediate purchase"
          variant="success"
          loading={loading}
        />

        <KPICard
          label="Converted on Product"
          value={journeySummary?.convertedOnProduct || 0}
          subtitle="After retargeting"
          variant="success"
          loading={loading}
        />
      </div>

      {/* Top Campaign & Avg Score */}
      {journeySummary?.topRetargetingCampaign && (
        <GlassCard intensity="heavy" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70 mb-1">Top Performing Retargeting Campaign</div>
              <div className="text-2xl font-bold text-white">{journeySummary.topRetargetingCampaign}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70 mb-1">Avg Quiz Score</div>
              <div className="text-2xl font-bold text-white">{journeySummary.avgQuizScore}/10</div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* User Journey Table */}
      {journeyData.length > 0 && (
        <GlassCard intensity="heavy">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Individual User Journeys (Last 50)</h3>
            <DataTable
              columns={journeyColumns}
              data={journeyData}
              emptyMessage="No user journeys available"
            />
          </div>
        </GlassCard>
      )}
    </div>
  )
}
