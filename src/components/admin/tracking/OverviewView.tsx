import React from 'react'
import { KPICard } from './KPICard'
import { LeadAcquisitionChart } from './LeadAcquisitionChart'
import { LeadSourceChart } from './LeadSourceChart'
import { DeviceBreakdownChart } from './DeviceBreakdownChart'
import type { Lead } from '../../../lib/types/leads'
import type { ContactSubmission } from '../../../lib/types/contact'

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

  // Calculate date ranges
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Filter leads (use filtered leads if date range is active)
  const todayLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= startOfToday).length
  const yesterdayLeads = filteredLeads.filter(lead => {
    const leadDate = new Date(lead.created_at)
    return leadDate >= startOfYesterday && leadDate < startOfToday
  }).length
  const weekLeads = filteredLeads.filter(lead => new Date(lead.created_at) >= weekAgo).length
  const newSubmissions = contactSubmissions.filter(s => s.status === 'new').length

  // Calculate week-over-week trends
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

  const weekTrend = calculateTrend(weekLeads, previousWeekLeads)
  const todayTrend = calculateTrend(todayLeads, yesterdayLeads)

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          label="Total Leads"
          value={totalLeads}
          subtitle="All time collection"
          variant="success"
          loading={loading}
        />

        <KPICard
          label="Today"
          value={todayLeads}
          subtitle="Leads today"
          variant="amber"
          loading={loading}
          trend={todayTrend}
        />

        <KPICard
          label="Yesterday"
          value={yesterdayLeads}
          subtitle="Leads yesterday"
          loading={loading}
        />

        <KPICard
          label="This Week"
          value={weekLeads}
          subtitle="Last 7 days"
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadAcquisitionChart leads={filteredLeads} days={30} loading={loading} />
        <LeadSourceChart leads={filteredLeads} loading={loading} />
      </div>

      {/* Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeviceBreakdownChart data={filteredLeads} loading={loading} title="Device Breakdown - Leads" />
      </div>
    </div>
  )
}
