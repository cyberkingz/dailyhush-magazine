import { supabase } from '../supabase'

export interface DateRange {
  startDate: string
  endDate: string
}

// ============================================================
// THANK YOU PAGE ANALYTICS
// ============================================================

export interface ThankYouPageMetrics {
  totalSessions: number
  totalWithEmail: number
  clickedBuyButton: number
  avgScrollDepth: number
  conversionRate: number
  emailCaptureRate: number
  avgTimeOnPage: number
}

export interface QuizScoreConversion {
  quizScore: number
  quizType: string | null
  sessions: number
  conversions: number
  conversionRate: number
  avgScrollDepth: number
}

export interface ScrollDepthDistribution {
  range: string
  sessions: number
  conversions: number
  conversionRate: number
}

export interface ButtonLocationStats {
  location: string
  clicks: number
  percentage: number
}

export interface DailyConversionTrend {
  date: string
  sessions: number
  conversions: number
  conversionRate: number
}

export async function getThankYouPageMetrics(dateRange?: DateRange): Promise<ThankYouPageMetrics> {
  try {
    let query = supabase
      .from('thank_you_page_sessions')
      .select('*')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const sessions = data || []
    const totalSessions = sessions.length
    const totalWithEmail = sessions.filter(s => s.email).length
    const clickedBuyButton = sessions.filter(s => s.clicked_buy_button).length
    const avgScrollDepth = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.max_scroll_depth || 0), 0) / sessions.length)
      : 0
    const avgTimeOnPage = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.time_on_page_ms || 0), 0) / sessions.length / 1000)
      : 0

    return {
      totalSessions,
      totalWithEmail,
      clickedBuyButton,
      avgScrollDepth,
      conversionRate: totalSessions > 0 ? (clickedBuyButton / totalSessions) * 100 : 0,
      emailCaptureRate: totalSessions > 0 ? (totalWithEmail / totalSessions) * 100 : 0,
      avgTimeOnPage,
    }
  } catch (error) {
    console.error('Error fetching thank you page metrics:', error)
    return {
      totalSessions: 0,
      totalWithEmail: 0,
      clickedBuyButton: 0,
      avgScrollDepth: 0,
      conversionRate: 0,
      emailCaptureRate: 0,
      avgTimeOnPage: 0,
    }
  }
}

export async function getQuizScoreConversions(dateRange?: DateRange): Promise<QuizScoreConversion[]> {
  try {
    let query = supabase
      .from('thank_you_page_sessions')
      .select('quiz_score, quiz_type, clicked_buy_button, max_scroll_depth')
      .not('quiz_score', 'is', null)

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    // Group by quiz score and type
    const grouped = (data || []).reduce((acc, session) => {
      const key = `${session.quiz_score}-${session.quiz_type || 'unknown'}`
      if (!acc[key]) {
        acc[key] = {
          quizScore: session.quiz_score,
          quizType: session.quiz_type,
          sessions: 0,
          conversions: 0,
          totalScrollDepth: 0,
        }
      }
      acc[key].sessions++
      if (session.clicked_buy_button) acc[key].conversions++
      acc[key].totalScrollDepth += session.max_scroll_depth || 0
      return acc
    }, {} as Record<string, any>)

    return Object.values(grouped).map((g: any) => ({
      quizScore: g.quizScore,
      quizType: g.quizType,
      sessions: g.sessions,
      conversions: g.conversions,
      conversionRate: g.sessions > 0 ? (g.conversions / g.sessions) * 100 : 0,
      avgScrollDepth: g.sessions > 0 ? Math.round(g.totalScrollDepth / g.sessions) : 0,
    })).sort((a, b) => b.quizScore - a.quizScore)
  } catch (error) {
    console.error('Error fetching quiz score conversions:', error)
    return []
  }
}

export async function getScrollDepthDistribution(dateRange?: DateRange): Promise<ScrollDepthDistribution[]> {
  try {
    let query = supabase
      .from('thank_you_page_sessions')
      .select('max_scroll_depth, clicked_buy_button')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const ranges = [
      { range: '0-25%', min: 0, max: 25 },
      { range: '25-50%', min: 25, max: 50 },
      { range: '50-75%', min: 50, max: 75 },
      { range: '75-90%', min: 75, max: 90 },
      { range: '90-100%', min: 90, max: 100 },
    ]

    return ranges.map(({ range, min, max }) => {
      const sessions = (data || []).filter(s => (s.max_scroll_depth || 0) >= min && (s.max_scroll_depth || 0) < max)
      const conversions = sessions.filter(s => s.clicked_buy_button).length
      return {
        range,
        sessions: sessions.length,
        conversions,
        conversionRate: sessions.length > 0 ? (conversions / sessions.length) * 100 : 0,
      }
    })
  } catch (error) {
    console.error('Error fetching scroll depth distribution:', error)
    return []
  }
}

export async function getButtonLocationStats(dateRange?: DateRange): Promise<ButtonLocationStats[]> {
  try {
    let query = supabase
      .from('thank_you_page_events')
      .select('metadata')
      .eq('event_type', 'buy_button_click')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const locationCounts = (data || []).reduce((acc, event) => {
      const location = event.metadata?.button_location || 'unknown'
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(locationCounts).reduce((sum, count) => sum + count, 0)

    return Object.entries(locationCounts)
      .map(([location, clicks]) => ({
        location,
        clicks,
        percentage: total > 0 ? (clicks / total) * 100 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
  } catch (error) {
    console.error('Error fetching button location stats:', error)
    return []
  }
}

export async function getDailyConversionTrend(dateRange?: DateRange): Promise<DailyConversionTrend[]> {
  try {
    let query = supabase
      .from('thank_you_page_sessions')
      .select('created_at, clicked_buy_button')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    // Group by date
    const dailyStats = (data || []).reduce((acc, session) => {
      const date = new Date(session.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { sessions: 0, conversions: 0 }
      }
      acc[date].sessions++
      if (session.clicked_buy_button) acc[date].conversions++
      return acc
    }, {} as Record<string, { sessions: number; conversions: number }>)

    // Convert to array and calculate conversion rates
    return Object.entries(dailyStats)
      .map(([date, stats]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: stats.sessions,
        conversions: stats.conversions,
        conversionRate: stats.sessions > 0 ? (stats.conversions / stats.sessions) * 100 : 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } catch (error) {
    console.error('Error fetching daily conversion trend:', error)
    return []
  }
}

export async function getThankYouDeviceData(dateRange?: DateRange): Promise<Array<{ device_type?: string }>> {
  try {
    let query = supabase
      .from('thank_you_page_sessions')
      .select('device_type')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching thank you device data:', error)
    return []
  }
}

// ============================================================
// PRODUCT PAGE ANALYTICS
// ============================================================

export interface ProductPageMetrics {
  totalSessions: number
  totalWithEmail: number
  clickedBuyButton: number
  viewedPrice: number
  avgScrollDepth: number
  conversionRate: number
  priceViewRate: number
  avgTimeOnPage: number
}

export interface UTMCampaignStats {
  campaign: string
  sessions: number
  conversions: number
  conversionRate: number
  avgScrollDepth: number
  avgTimeOnPage: number
}

export interface FAQStats {
  question: string
  clicks: number
  percentage: number
}

export async function getProductPageMetrics(dateRange?: DateRange): Promise<ProductPageMetrics> {
  try {
    let query = supabase
      .from('product_page_sessions')
      .select('*')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const sessions = data || []
    const totalSessions = sessions.length
    const totalWithEmail = sessions.filter(s => s.email).length
    const clickedBuyButton = sessions.filter(s => s.clicked_buy_button).length
    const viewedPrice = sessions.filter(s => s.viewed_price).length
    const avgScrollDepth = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.max_scroll_depth || 0), 0) / sessions.length)
      : 0
    const avgTimeOnPage = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.time_on_page_ms || 0), 0) / sessions.length / 1000)
      : 0

    return {
      totalSessions,
      totalWithEmail,
      clickedBuyButton,
      viewedPrice,
      avgScrollDepth,
      conversionRate: totalSessions > 0 ? (clickedBuyButton / totalSessions) * 100 : 0,
      priceViewRate: totalSessions > 0 ? (viewedPrice / totalSessions) * 100 : 0,
      avgTimeOnPage,
    }
  } catch (error) {
    console.error('Error fetching product page metrics:', error)
    return {
      totalSessions: 0,
      totalWithEmail: 0,
      clickedBuyButton: 0,
      viewedPrice: 0,
      avgScrollDepth: 0,
      conversionRate: 0,
      priceViewRate: 0,
      avgTimeOnPage: 0,
    }
  }
}

export async function getUTMCampaignStats(dateRange?: DateRange): Promise<UTMCampaignStats[]> {
  try {
    let query = supabase
      .from('product_page_sessions')
      .select('utm_campaign, clicked_buy_button, max_scroll_depth, time_on_page_ms')
      .not('utm_campaign', 'is', null)
      .not('email', 'is', null) // Only retargeting traffic with email

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    // Group by campaign
    const grouped = (data || []).reduce((acc, session) => {
      const campaign = session.utm_campaign
      if (!acc[campaign]) {
        acc[campaign] = {
          sessions: 0,
          conversions: 0,
          totalScrollDepth: 0,
          totalTimeOnPage: 0,
        }
      }
      acc[campaign].sessions++
      if (session.clicked_buy_button) acc[campaign].conversions++
      acc[campaign].totalScrollDepth += session.max_scroll_depth || 0
      acc[campaign].totalTimeOnPage += session.time_on_page_ms || 0
      return acc
    }, {} as Record<string, any>)

    return Object.entries(grouped).map(([campaign, stats]: [string, any]) => ({
      campaign,
      sessions: stats.sessions,
      conversions: stats.conversions,
      conversionRate: stats.sessions > 0 ? (stats.conversions / stats.sessions) * 100 : 0,
      avgScrollDepth: stats.sessions > 0 ? Math.round(stats.totalScrollDepth / stats.sessions) : 0,
      avgTimeOnPage: stats.sessions > 0 ? Math.round(stats.totalTimeOnPage / stats.sessions / 1000) : 0,
    })).sort((a, b) => b.conversions - a.conversions)
  } catch (error) {
    console.error('Error fetching UTM campaign stats:', error)
    return []
  }
}

export async function getFAQStats(dateRange?: DateRange): Promise<FAQStats[]> {
  try {
    let query = supabase
      .from('product_page_events')
      .select('metadata')
      .eq('event_type', 'faq_expand')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const questionCounts = (data || []).reduce((acc, event) => {
      const question = event.metadata?.faq_question || 'unknown'
      acc[question] = (acc[question] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(questionCounts).reduce((sum, count) => sum + count, 0)

    return Object.entries(questionCounts)
      .map(([question, clicks]) => ({
        question,
        clicks,
        percentage: total > 0 ? (clicks / total) * 100 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10) // Top 10 FAQs
  } catch (error) {
    console.error('Error fetching FAQ stats:', error)
    return []
  }
}

export async function getProductDeviceData(dateRange?: DateRange): Promise<Array<{ device_type?: string }>> {
  try {
    let query = supabase
      .from('product_page_sessions')
      .select('device_type')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching product device data:', error)
    return []
  }
}

// ============================================================
// USER JOURNEY ANALYTICS
// ============================================================

export interface UserJourney {
  email: string
  quizScore: number | null
  quizType: string | null
  thankYouScroll: number
  thankYouClicked: boolean
  retargetingCampaign: string | null
  productScroll: number | null
  productClicked: boolean | null
  timeToDecision: number | null
  thankYouDate: string
  productDate: string | null
}

export async function getUserJourneys(dateRange?: DateRange, limit: number = 100): Promise<UserJourney[]> {
  try {
    let query = supabase
      .from('thank_you_page_sessions')
      .select(`
        email,
        quiz_score,
        quiz_type,
        max_scroll_depth,
        clicked_buy_button,
        created_at
      `)
      .not('email', 'is', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data: thankYouData, error: tyError } = await query

    if (tyError) throw tyError

    // Get all unique emails
    const emails = [...new Set((thankYouData || []).map(s => s.email))]

    // Fetch product page sessions for these emails
    const { data: productData, error: prodError } = await supabase
      .from('product_page_sessions')
      .select('email, utm_campaign, max_scroll_depth, clicked_buy_button, time_on_page_ms, created_at')
      .in('email', emails)

    if (prodError) throw prodError

    // Combine data
    return (thankYouData || []).map(ty => {
      const productSession = (productData || []).find(p => p.email === ty.email)
      return {
        email: ty.email,
        quizScore: ty.quiz_score,
        quizType: ty.quiz_type,
        thankYouScroll: ty.max_scroll_depth || 0,
        thankYouClicked: ty.clicked_buy_button || false,
        retargetingCampaign: productSession?.utm_campaign || null,
        productScroll: productSession?.max_scroll_depth || null,
        productClicked: productSession?.clicked_buy_button || null,
        timeToDecision: productSession?.time_on_page_ms ? Math.round(productSession.time_on_page_ms / 1000) : null,
        thankYouDate: ty.created_at,
        productDate: productSession?.created_at || null,
      }
    })
  } catch (error) {
    console.error('Error fetching user journeys:', error)
    return []
  }
}

export interface JourneySummary {
  totalUsers: number
  completedJourney: number
  convertedOnThankYou: number
  convertedOnProduct: number
  avgQuizScore: number
  topRetargetingCampaign: string | null
}

export async function getJourneySummary(dateRange?: DateRange): Promise<JourneySummary> {
  try {
    const journeys = await getUserJourneys(dateRange, 1000)

    const completedJourney = journeys.filter(j => j.productDate !== null).length
    const convertedOnThankYou = journeys.filter(j => j.thankYouClicked).length
    const convertedOnProduct = journeys.filter(j => j.productClicked).length
    const avgQuizScore = journeys.filter(j => j.quizScore !== null).length > 0
      ? journeys.reduce((sum, j) => sum + (j.quizScore || 0), 0) / journeys.filter(j => j.quizScore !== null).length
      : 0

    // Find top campaign
    const campaignCounts = journeys.reduce((acc, j) => {
      if (j.retargetingCampaign) {
        acc[j.retargetingCampaign] = (acc[j.retargetingCampaign] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const topRetargetingCampaign = Object.entries(campaignCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null

    return {
      totalUsers: journeys.length,
      completedJourney,
      convertedOnThankYou,
      convertedOnProduct,
      avgQuizScore: Math.round(avgQuizScore * 10) / 10,
      topRetargetingCampaign,
    }
  } catch (error) {
    console.error('Error fetching journey summary:', error)
    return {
      totalUsers: 0,
      completedJourney: 0,
      convertedOnThankYou: 0,
      convertedOnProduct: 0,
      avgQuizScore: 0,
      topRetargetingCampaign: null,
    }
  }
}
