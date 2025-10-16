import { useState, useEffect } from 'react'
import {
  getThankYouPageMetrics,
  getQuizScoreConversions,
  getScrollDepthDistribution,
  getButtonLocationStats,
  getDailyConversionTrend,
  getThankYouDeviceData,
  getProductPageMetrics,
  getUTMCampaignStats,
  getFAQStats,
  getProductDeviceData,
  getProductFunnelData,
  getUserJourneys,
  getJourneySummary,
  getTimeToConvertDistribution,
  getEmailAttributionMetrics,
  getThankYouPageRevenue,
  getProductPageRevenue,
  type DateRange,
  type ThankYouPageMetrics,
  type QuizScoreConversion,
  type ScrollDepthDistribution,
  type ButtonLocationStats,
  type DailyConversionTrend,
  type ProductPageMetrics,
  type UTMCampaignStats,
  type FAQStats,
  type FunnelStage,
  type UserJourney,
  type JourneySummary,
  type TimeToConvertDistribution,
  type EmailAttributionMetrics,
  type PageRevenueAttribution,
} from '../lib/services/trackingAnalytics'

interface UseThankYouAnalyticsResult {
  metrics: ThankYouPageMetrics | null
  revenueData: PageRevenueAttribution | null
  quizScoreData: QuizScoreConversion[]
  scrollDepthData: ScrollDepthDistribution[]
  buttonLocationData: ButtonLocationStats[]
  conversionTrendData: DailyConversionTrend[]
  deviceData: Array<{ device_type?: string }>
  loading: boolean
  error: Error | null
}

export function useThankYouAnalytics(dateRange?: DateRange): UseThankYouAnalyticsResult {
  const [metrics, setMetrics] = useState<ThankYouPageMetrics | null>(null)
  const [revenueData, setRevenueData] = useState<PageRevenueAttribution | null>(null)
  const [quizScoreData, setQuizScoreData] = useState<QuizScoreConversion[]>([])
  const [scrollDepthData, setScrollDepthData] = useState<ScrollDepthDistribution[]>([])
  const [buttonLocationData, setButtonLocationData] = useState<ButtonLocationStats[]>([])
  const [conversionTrendData, setConversionTrendData] = useState<DailyConversionTrend[]>([])
  const [deviceData, setDeviceData] = useState<Array<{ device_type?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [metricsData, revenue, quizScores, scrollDepth, buttonLocations, conversionTrend, devices] = await Promise.all([
          getThankYouPageMetrics(dateRange),
          getThankYouPageRevenue(dateRange),
          getQuizScoreConversions(dateRange),
          getScrollDepthDistribution(dateRange),
          getButtonLocationStats(dateRange),
          getDailyConversionTrend(dateRange),
          getThankYouDeviceData(dateRange),
        ])

        setMetrics(metricsData)
        setRevenueData(revenue)
        setQuizScoreData(quizScores)
        setScrollDepthData(scrollDepth)
        setButtonLocationData(buttonLocations)
        setConversionTrendData(conversionTrend)
        setDeviceData(devices)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching thank you analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate])

  return { metrics, revenueData, quizScoreData, scrollDepthData, buttonLocationData, conversionTrendData, deviceData, loading, error }
}

interface UseProductAnalyticsResult {
  metrics: ProductPageMetrics | null
  revenueData: PageRevenueAttribution | null
  utmCampaignData: UTMCampaignStats[]
  faqData: FAQStats[]
  deviceData: Array<{ device_type?: string }>
  funnelData: FunnelStage[]
  loading: boolean
  error: Error | null
}

export function useProductAnalytics(dateRange?: DateRange): UseProductAnalyticsResult {
  const [metrics, setMetrics] = useState<ProductPageMetrics | null>(null)
  const [revenueData, setRevenueData] = useState<PageRevenueAttribution | null>(null)
  const [utmCampaignData, setUTMCampaignData] = useState<UTMCampaignStats[]>([])
  const [faqData, setFAQData] = useState<FAQStats[]>([])
  const [deviceData, setDeviceData] = useState<Array<{ device_type?: string }>>([])
  const [funnelData, setFunnelData] = useState<FunnelStage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [metricsData, revenue, utmCampaigns, faqs, devices, funnel] = await Promise.all([
          getProductPageMetrics(dateRange),
          getProductPageRevenue(dateRange),
          getUTMCampaignStats(dateRange),
          getFAQStats(dateRange),
          getProductDeviceData(dateRange),
          getProductFunnelData(dateRange),
        ])

        setMetrics(metricsData)
        setRevenueData(revenue)
        setUTMCampaignData(utmCampaigns)
        setFAQData(faqs)
        setDeviceData(devices)
        setFunnelData(funnel)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching product analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate])

  return { metrics, revenueData, utmCampaignData, faqData, deviceData, funnelData, loading, error }
}

interface UseUserJourneyAnalyticsResult {
  journeyData: UserJourney[]
  journeySummary: JourneySummary | null
  timeToConvertData: TimeToConvertDistribution[]
  emailAttributionMetrics: EmailAttributionMetrics | null
  loading: boolean
  error: Error | null
}

export function useUserJourneyAnalytics(dateRange?: DateRange, limit: number = 50): UseUserJourneyAnalyticsResult {
  const [journeyData, setJourneyData] = useState<UserJourney[]>([])
  const [journeySummary, setJourneySummary] = useState<JourneySummary | null>(null)
  const [timeToConvertData, setTimeToConvertData] = useState<TimeToConvertDistribution[]>([])
  const [emailAttributionMetrics, setEmailAttributionMetrics] = useState<EmailAttributionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [journeys, summary, timeToConvert, emailAttribution] = await Promise.all([
          getUserJourneys(dateRange, limit),
          getJourneySummary(dateRange),
          getTimeToConvertDistribution(dateRange),
          getEmailAttributionMetrics(dateRange),
        ])

        setJourneyData(journeys)
        setJourneySummary(summary)
        setTimeToConvertData(timeToConvert)
        setEmailAttributionMetrics(emailAttribution)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching user journey analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate, limit])

  return { journeyData, journeySummary, timeToConvertData, emailAttributionMetrics, loading, error }
}

// ============================================================
// OVERVIEW ANALYTICS (with Revenue & Traffic Sources)
// ============================================================

interface UseOverviewAnalyticsResult {
  revenueMetrics: any | null
  trafficSourceStats: any[]
  loading: boolean
  error: Error | null
}

export function useOverviewAnalytics(dateRange?: DateRange): UseOverviewAnalyticsResult {
  const [revenueMetrics, setRevenueMetrics] = useState<any | null>(null)
  const [trafficSourceStats, setTrafficSourceStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Dynamically import to avoid circular dependencies
        const { getRevenueMetrics, getTrafficSourceStats } = await import('../lib/services/trackingAnalytics')

        const [revenue, trafficSources] = await Promise.all([
          getRevenueMetrics(dateRange),
          getTrafficSourceStats(dateRange),
        ])

        setRevenueMetrics(revenue)
        setTrafficSourceStats(trafficSources)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch overview analytics'))
        console.error('Error fetching overview analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate])

  return { revenueMetrics, trafficSourceStats, loading, error }
}
