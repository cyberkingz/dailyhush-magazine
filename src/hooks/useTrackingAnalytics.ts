import { useState, useEffect } from 'react'
import {
  getThankYouPageMetrics,
  getQuizScoreConversions,
  getScrollDepthDistribution,
  getButtonLocationStats,
  getProductPageMetrics,
  getUTMCampaignStats,
  getFAQStats,
  getUserJourneys,
  getJourneySummary,
  type DateRange,
  type ThankYouPageMetrics,
  type QuizScoreConversion,
  type ScrollDepthDistribution,
  type ButtonLocationStats,
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
  loading: boolean
  error: Error | null
}

export function useThankYouAnalytics(dateRange?: DateRange): UseThankYouAnalyticsResult {
  const [metrics, setMetrics] = useState<ThankYouPageMetrics | null>(null)
  const [quizScoreData, setQuizScoreData] = useState<QuizScoreConversion[]>([])
  const [scrollDepthData, setScrollDepthData] = useState<ScrollDepthDistribution[]>([])
  const [buttonLocationData, setButtonLocationData] = useState<ButtonLocationStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [metricsData, quizScores, scrollDepth, buttonLocations] = await Promise.all([
          getThankYouPageMetrics(dateRange),
          getQuizScoreConversions(dateRange),
          getScrollDepthDistribution(dateRange),
          getButtonLocationStats(dateRange),
        ])

        setMetrics(metricsData)
        setQuizScoreData(quizScores)
        setScrollDepthData(scrollDepth)
        setButtonLocationData(buttonLocations)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching thank you analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate])

  return { metrics, quizScoreData, scrollDepthData, buttonLocationData, loading, error }
}

interface UseProductAnalyticsResult {
  metrics: ProductPageMetrics | null
  utmCampaignData: UTMCampaignStats[]
  faqData: FAQStats[]
  loading: boolean
  error: Error | null
}

export function useProductAnalytics(dateRange?: DateRange): UseProductAnalyticsResult {
  const [metrics, setMetrics] = useState<ProductPageMetrics | null>(null)
  const [utmCampaignData, setUTMCampaignData] = useState<UTMCampaignStats[]>([])
  const [faqData, setFAQData] = useState<FAQStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [metricsData, utmCampaigns, faqs] = await Promise.all([
          getProductPageMetrics(dateRange),
          getUTMCampaignStats(dateRange),
          getFAQStats(dateRange),
        ])

        setMetrics(metricsData)
        setUTMCampaignData(utmCampaigns)
        setFAQData(faqs)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'))
        console.error('Error fetching product analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [dateRange?.startDate, dateRange?.endDate])

  return { metrics, utmCampaignData, faqData, loading, error }
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
