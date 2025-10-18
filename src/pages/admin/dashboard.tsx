import React, { useState, useEffect } from 'react'
import { Users, Target, ShoppingCart, Route, DollarSign, Mail, ClipboardList } from 'lucide-react'
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
  OrdersView,
  EmailCampaignsView,
  QuizAnalyticsView,
} from '../../components/admin/tracking'
import type { DateRange as AnalyticsDateRange } from '../../lib/services/trackingAnalytics'

type ViewMode = 'overview' | 'thank-you' | 'product' | 'journey' | 'orders' | 'email-campaigns' | 'quiz-analytics'

interface ViewTab {
  id: ViewMode
  label: string
  icon: React.ReactNode
}

const VIEW_TABS: ViewTab[] = [
  { id: 'overview', label: 'Overview', icon: <Users className="inline h-4 w-4 mr-2" /> },
  { id: 'thank-you', label: 'Thank You Page', icon: <Target className="inline h-4 w-4 mr-2" /> },
  { id: 'product', label: 'Product Page', icon: <ShoppingCart className="inline h-4 w-4 mr-2" /> },
  { id: 'email-campaigns', label: 'Email Campaigns', icon: <Mail className="inline h-4 w-4 mr-2" /> },
  { id: 'quiz-analytics', label: 'Quiz Analytics', icon: <ClipboardList className="inline h-4 w-4 mr-2" /> },
  { id: 'journey', label: 'User Journey', icon: <Route className="inline h-4 w-4 mr-2" /> },
  { id: 'orders', label: 'Orders & Revenue', icon: <DollarSign className="inline h-4 w-4 mr-2" /> },
]

const AdminDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [leads, setLeads] = useState<Lead[]>([])
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: today,
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
      case 'email-campaigns':
        return 'Email campaign performance and conversion tracking'
      case 'quiz-analytics':
        return 'Quiz performance, funnel metrics, and campaign tracking'
      case 'journey':
        return 'Complete user journey tracking'
      case 'orders':
        return 'Shopify orders and revenue tracking'
    }
  }

  return (
    <AdminGuard>
      <AdminLayout currentPage="/admin/dashboard">
        <div className="space-y-4 md:space-y-6">
          {/* Header with View Selector */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div className="flex-shrink min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                Analytics Dashboard
              </h1>
              <p className="text-sm md:text-base text-white/70 mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)] truncate">
                {getPageDescription()}
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <BasicDateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
              />
            </div>
          </div>

          {/* View Mode Tabs - Airbnb-style mobile scrolling */}
          <div
            className="relative -mx-4 md:mx-0"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <div
              className="flex gap-2 overflow-x-auto px-4 md:px-0 pb-3 snap-x snap-mandatory scroll-smooth scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {VIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    setViewMode(tab.id)
                    // Smooth scroll active tab into view on mobile
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'center'
                    })
                  }}
                  className={cn(
                    'px-4 md:px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 snap-center',
                    'flex items-center gap-2',
                    viewMode === tab.id
                      ? 'bg-gradient-to-r from-amber-500/60 to-amber-600/50 backdrop-blur-[20px] text-white shadow-[0_4px_12px_rgba(245,158,11,0.25)] border border-amber-400/30 scale-[1.02]'
                      : 'bg-white/8 backdrop-blur-[16px] text-white/70 hover:bg-white/15 hover:text-white border border-white/10 hover:border-white/20 active:scale-95'
                  )}
                >
                  <span className={cn(
                    'transition-transform duration-200',
                    viewMode === tab.id && 'scale-110'
                  )}>
                    {tab.icon}
                  </span>
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Blur fade edges for mobile and desktop */}
            <div
              className="absolute left-0 top-0 bottom-3 w-16 pointer-events-none z-10"
              style={{
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                maskImage: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-3 w-16 pointer-events-none z-10"
              style={{
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                maskImage: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)',
              }}
            />
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

          {viewMode === 'email-campaigns' && (
            <EmailCampaignsView dateRange={analyticsDateRange} />
          )}

          {viewMode === 'quiz-analytics' && (
            <QuizAnalyticsView dateRange={analyticsDateRange} />
          )}

          {viewMode === 'journey' && (
            <UserJourneyView dateRange={analyticsDateRange} />
          )}

          {viewMode === 'orders' && analyticsDateRange && (
            <OrdersView dateRange={analyticsDateRange} />
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  )
}

export default AdminDashboard
