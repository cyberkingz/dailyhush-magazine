import React, { useState, useEffect } from 'react'
import { Users, Target, ShoppingCart, Route } from 'lucide-react'
import { subDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import { AdminLayout } from '../../components/admin'
import { AdminGuard } from '../../components/auth'
import { getLeads } from '../../lib/services/leads'
import { getContactSubmissions } from '../../lib/services/contact'
import type { Lead } from '../../lib/types/leads'
import type { ContactSubmission } from '../../lib/types/contact'
import { BasicDateRangePicker } from '../../components/admin/BasicDateRangePicker'
import { cn } from '../../lib/utils'
import {
  OverviewView,
  ThankYouPageView,
  ProductPageView,
  UserJourneyView,
} from '../../components/admin/tracking'
import type { DateRange as AnalyticsDateRange } from '../../lib/services/trackingAnalytics'

type ViewMode = 'overview' | 'thank-you' | 'product' | 'journey'

interface ViewTab {
  id: ViewMode
  label: string
  icon: React.ReactNode
}

const VIEW_TABS: ViewTab[] = [
  { id: 'overview', label: 'Overview', icon: <Users className="inline h-4 w-4 mr-2" /> },
  { id: 'thank-you', label: 'Thank You Page', icon: <Target className="inline h-4 w-4 mr-2" /> },
  { id: 'product', label: 'Product Page', icon: <ShoppingCart className="inline h-4 w-4 mr-2" /> },
  { id: 'journey', label: 'User Journey', icon: <Route className="inline h-4 w-4 mr-2" /> },
]

const AdminDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [leads, setLeads] = useState<Lead[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      setLoading(true)
      const [
        { leads: leadsData },
        { submissions: contactSubmissionsData }
      ] = await Promise.all([
        getLeads(0), // Fetch ALL leads (0 = no limit)
        getContactSubmissions({}, { page: 1, limit: 1000, offset: 0 })
      ])
      setLeads(leadsData)
      setContactSubmissions(contactSubmissionsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyticsDateRange: AnalyticsDateRange | undefined = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: (() => {
          // Set end date to end of day to include full day
          const endOfDay = new Date(dateRange.to)
          endOfDay.setHours(23, 59, 59, 999)
          return endOfDay.toISOString()
        })(),
      }
    : undefined

  const getPageDescription = () => {
    switch (viewMode) {
      case 'overview':
        return 'Overview of your website performance'
      case 'thank-you':
        return 'Thank You Page conversion analytics'
      case 'product':
        return 'Product Page performance metrics'
      case 'journey':
        return 'Complete user journey tracking'
    }
  }

  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/dashboard">
        <div className="space-y-6">
          {/* Header with View Selector */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Analytics Dashboard
              </h1>
              <p className="text-white/70 mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                {getPageDescription()}
              </p>
            </div>
            <BasicDateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {VIEW_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap',
                  viewMode === tab.id
                    ? 'bg-amber-500/50 backdrop-blur-[16px] text-white shadow-[0_2px_8px_rgba(245,158,11,0.2)]'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Content */}
          {viewMode === 'overview' && (
            <OverviewView
              leads={leads}
              contactSubmissions={contactSubmissions}
              loading={loading}
              dateRange={dateRange}
            />
          )}

          {viewMode === 'thank-you' && (
            <ThankYouPageView dateRange={analyticsDateRange} />
          )}

          {viewMode === 'product' && (
            <ProductPageView dateRange={analyticsDateRange} />
          )}

          {viewMode === 'journey' && (
            <UserJourneyView dateRange={analyticsDateRange} />
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

export default AdminDashboard
