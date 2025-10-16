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
  getUserJourneys,
  getJourneySummary,
  type DateRange,
  type ThankYouPageMetrics,
  type QuizScoreConversion,
  type ScrollDepthDistribution,
  type ButtonLocationStats,
  type DailyConversionTrend,
  type ProductPageMetrics,
  type UTMCampaignStats,
  type FAQStats,
  type UserJourney,
  type JourneySummary,
} from '../lib/services/trackingAnalytics'

interface UseThankYouAnalyticsResult {
  metrics: ThankYouPageMetrics | null
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

        const [metricsData, quizScores, scrollDepth, buttonLocations, conversionTrend, devices] = await Promise.all([
          getThankYouPageMetrics(dateRange),
          getQuizScoreConversions(dateRange),
          getScrollDepthDistribution(dateRange),
          getButtonLocationStats(dateRange),
          getDailyConversionTrend(dateRange),
          getThankYouDeviceData(dateRange),
        ])

        setMetrics(metricsData)
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

  return { metrics, quizScoreData, scrollDepthData, buttonLocationData, conversionTrendData, deviceData, loading, error }
}

interface UseProductAnalyticsResult {
  metrics: ProductPageMetrics | null
  utmCampaignData: UTMCampaignStats[]
  faqData: FAQStats[]
  deviceData: Array<{ device_type?: string }>
  loading: boolean
  error: Error | null
}

export function useProductAnalytics(dateRange?: DateRange): UseProductAnalyticsResult {
  const [metrics, setMetrics] = useState<ProductPageMetrics | null>(null)
  const [utmCampaignData, setUTMCampaignData] = useState<UTMCampaignStats[]>([])
  const [faqData, setFAQData] = useState<FAQStats[]>([])
  const [deviceData, setDeviceData] = useState<Array<{ device_type?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [metricsData, utmCampaigns, faqs, devices] = await Promise.all([
          getProductPageMetrics(dateRange),
          getUTMCampaignStats(dateRange),
          getFAQStats(dateRange),
          getProductDeviceData(dateRange),
        ])

        setMetrics(metricsData)
        setUTMCampaignData(utmCampaigns)
        setFAQData(faqs)
        setDeviceData(devices)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching product analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate])

  return { metrics, utmCampaignData, faqData, deviceData, loading, error }
}

interface UseUserJourneyAnalyticsResult {
  journeyData: UserJourney[]
  journeySummary: JourneySummary | null
  loading: boolean
  error: Error | null
}

export function useUserJourneyAnalytics(dateRange?: DateRange, limit: number = 50): UseUserJourneyAnalyticsResult {
  const [journeyData, setJourneyData] = useState<UserJourney[]>([])
  const [journeySummary, setJourneySummary] = useState<JourneySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [journeys, summary] = await Promise.all([
          getUserJourneys(dateRange, limit),
          getJourneySummary(dateRange),
        ])

        setJourneyData(journeys)
        setJourneySummary(summary)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching user journey analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate, limit])

  return { journeyData, journeySummary, loading, error }
}
