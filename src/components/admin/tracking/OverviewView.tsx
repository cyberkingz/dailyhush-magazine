import React from 'react'
import { KPICard } from './KPICard'
import { LeadAcquisitionChart } from './LeadAcquisitionChart'
import type { Lead } from '../../../lib/types/leads'
import type { ContactSubmission } from '../../../lib/types/contact'

interface OverviewViewProps {
  leads: Lead[]
  contactSubmissions: ContactSubmission[]
  loading: boolean
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  leads,
  contactSubmissions,
  loading,
}) => {
  const totalLeads = leads.length

  // Calculate date ranges
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  // Filter leads
  const todayLeads = leads.filter(lead => new Date(lead.created_at) >= startOfToday).length
  const yesterdayLeads = leads.filter(lead => {
    const leadDate = new Date(lead.created_at)
    return leadDate >= startOfYesterday && leadDate < startOfToday
  }).length
  const weekLeads = leads.filter(lead => new Date(lead.created_at) >= weekAgo).length
  const newSubmissions = contactSubmissions.filter(s => s.status === 'new').length

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
        />

        <KPICard
          label="New Contact Submissions"
          value={newSubmissions}
          subtitle="Needs attention"
          variant="amber"
          loading={loading}
        />
      </div>

      {/* Lead Acquisition Chart */}
      <LeadAcquisitionChart leads={leads} days={30} loading={loading} />
    </div>
  )
}
