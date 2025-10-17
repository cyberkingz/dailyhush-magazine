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

export interface FunnelStage {
  name: string
  value: number
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

export async function getProductFunnelData(dateRange?: DateRange): Promise<FunnelStage[]> {
  try {
    let query = supabase
      .from('product_page_sessions')
      .select('viewed_price, clicked_buy_button')

    if (dateRange) {
      query = query
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data, error } = await query
    if (error) throw error

    const sessions = data || []
    const totalSessions = sessions.length
    const viewedPrice = sessions.filter(s => s.viewed_price).length
    const clickedBuy = sessions.filter(s => s.clicked_buy_button).length

    if (totalSessions === 0) return []

    return [
      {
        name: 'Page Views',
        value: totalSessions,
        percentage: 100
      },
      {
        name: 'Viewed Pricing',
        value: viewedPrice,
        percentage: (viewedPrice / totalSessions) * 100
      },
      {
        name: 'Clicked Buy',
        value: clickedBuy,
        percentage: (clickedBuy / totalSessions) * 100
      }
    ]
  } catch (error) {
    console.error('Error fetching product funnel data:', error)
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

export interface TimeToConvertDistribution {
  range: string
  users: number
  conversions: number
  conversionRate: number
}

export async function getTimeToConvertDistribution(dateRange?: DateRange): Promise<TimeToConvertDistribution[]> {
  try {
    const journeys = await getUserJourneys(dateRange, 1000)

    // Filter to only users who visited product page
    const completedJourneys = journeys.filter(j => j.productDate !== null)

    const ranges = [
      { range: '< 1 hour', minHours: 0, maxHours: 1 },
      { range: '1-6 hours', minHours: 1, maxHours: 6 },
      { range: '6-24 hours', minHours: 6, maxHours: 24 },
      { range: '1-3 days', minHours: 24, maxHours: 72 },
      { range: '3-7 days', minHours: 72, maxHours: 168 },
      { range: '7+ days', minHours: 168, maxHours: Infinity },
    ]

    return ranges.map(({ range, minHours, maxHours }) => {
      const usersInRange = completedJourneys.filter(j => {
        const thankYouTime = new Date(j.thankYouDate).getTime()
        const productTime = new Date(j.productDate!).getTime()
        const hoursDiff = (productTime - thankYouTime) / (1000 * 60 * 60)
        return hoursDiff >= minHours && hoursDiff < maxHours
      })

      const conversions = usersInRange.filter(j => j.productClicked).length

      return {
        range,
        users: usersInRange.length,
        conversions,
        conversionRate: usersInRange.length > 0 ? (conversions / usersInRange.length) * 100 : 0,
      }
    })
  } catch (error) {
    console.error('Error fetching time to convert distribution:', error)
    return []
  }
}

// ============================================================
// EMAIL ATTRIBUTION ANALYTICS
// ============================================================

export interface EmailAttributionMetrics {
  totalEmailsCaptured: number
  visitedProductPage: number
  convertedOnProductPage: number
  productVisitRate: number
  emailConversionRate: number
  avgTimeToReturn: number // in hours
  topCampaign: string | null
  topCampaignConversions: number
}

export async function getEmailAttributionMetrics(dateRange?: DateRange): Promise<EmailAttributionMetrics> {
  try {
    const journeys = await getUserJourneys(dateRange, 1000)

    const totalEmailsCaptured = journeys.length
    const visitedProductPage = journeys.filter(j => j.productDate !== null).length
    const convertedOnProductPage = journeys.filter(j => j.productClicked === true).length

    // Calculate average time to return (in hours)
    const returningUsers = journeys.filter(j => j.productDate !== null)
    const avgTimeToReturn = returningUsers.length > 0
      ? returningUsers.reduce((sum, j) => {
          const thankYouTime = new Date(j.thankYouDate).getTime()
          const productTime = new Date(j.productDate!).getTime()
          const hoursDiff = (productTime - thankYouTime) / (1000 * 60 * 60)
          return sum + hoursDiff
        }, 0) / returningUsers.length
      : 0

    // Find top performing campaign
    const campaignConversions = journeys.reduce((acc, j) => {
      if (j.retargetingCampaign && j.productClicked) {
        acc[j.retargetingCampaign] = (acc[j.retargetingCampaign] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const topCampaignEntry = Object.entries(campaignConversions)
      .sort(([, a], [, b]) => b - a)[0]

    return {
      totalEmailsCaptured,
      visitedProductPage,
      convertedOnProductPage,
      productVisitRate: totalEmailsCaptured > 0 ? (visitedProductPage / totalEmailsCaptured) * 100 : 0,
      emailConversionRate: totalEmailsCaptured > 0 ? (convertedOnProductPage / totalEmailsCaptured) * 100 : 0,
      avgTimeToReturn: Math.round(avgTimeToReturn),
      topCampaign: topCampaignEntry?.[0] || null,
      topCampaignConversions: topCampaignEntry?.[1] || 0,
    }
  } catch (error) {
    console.error('Error fetching email attribution metrics:', error)
    return {
      totalEmailsCaptured: 0,
      visitedProductPage: 0,
      convertedOnProductPage: 0,
      productVisitRate: 0,
      emailConversionRate: 0,
      avgTimeToReturn: 0,
      topCampaign: null,
      topCampaignConversions: 0,
    }
  }
}

export interface CampaignAttributionStats {
  campaign: string
  emailsReached: number
  visited: number
  converted: number
  visitRate: number
  conversionRate: number
  avgTimeToVisit: number // in hours
}

export async function getCampaignAttributionStats(dateRange?: DateRange): Promise<CampaignAttributionStats[]> {
  try {
    const journeys = await getUserJourneys(dateRange, 1000)

    // Group by campaign
    const campaignGroups = journeys.reduce((acc, j) => {
      const campaign = j.retargetingCampaign || 'No Campaign'
      if (!acc[campaign]) {
        acc[campaign] = []
      }
      acc[campaign].push(j)
      return acc
    }, {} as Record<string, UserJourney[]>)

    return Object.entries(campaignGroups)
      .map(([campaign, users]) => {
        const emailsReached = users.length
        const visited = users.filter(u => u.productDate !== null).length
        const converted = users.filter(u => u.productClicked === true).length

        // Calculate avg time to visit
        const visitingUsers = users.filter(u => u.productDate !== null)
        const avgTimeToVisit = visitingUsers.length > 0
          ? visitingUsers.reduce((sum, u) => {
              const thankYouTime = new Date(u.thankYouDate).getTime()
              const productTime = new Date(u.productDate!).getTime()
              const hoursDiff = (productTime - thankYouTime) / (1000 * 60 * 60)
              return sum + hoursDiff
            }, 0) / visitingUsers.length
          : 0

        return {
          campaign,
          emailsReached,
          visited,
          converted,
          visitRate: emailsReached > 0 ? (visited / emailsReached) * 100 : 0,
          conversionRate: emailsReached > 0 ? (converted / emailsReached) * 100 : 0,
          avgTimeToVisit: Math.round(avgTimeToVisit),
        }
      })
      .filter(c => c.campaign !== 'No Campaign') // Exclude users without campaigns
      .sort((a, b) => b.converted - a.converted)
  } catch (error) {
    console.error('Error fetching campaign attribution stats:', error)
    return []
  }
}

// ============================================================
// SHOPIFY ORDERS / REVENUE ANALYTICS
// ============================================================

export interface ShopifyOrder {
  id: string
  shopify_order_id: number
  order_number: number
  order_name: string
  customer_email: string | null
  customer_first_name: string | null
  customer_last_name: string | null
  total_price: number
  currency: string
  product_name: string | null
  quantity: number
  financial_status: string | null
  utm_campaign: string | null
  billing_country: string | null
  order_created_at: string
  created_at: string
}

export interface RevenueMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  todayRevenue: number
  todayOrders: number
  weekRevenue: number
  weekOrders: number
}

export async function getShopifyOrders(dateRange?: DateRange, limit: number = 50): Promise<ShopifyOrder[]> {
  try {
    let query = supabase
      .from('shopify_orders')
      .select('*')
      .order('order_created_at', { ascending: false })
      .limit(limit)

    if (dateRange) {
      query = query
        .gte('order_created_at', dateRange.startDate)
        .lte('order_created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching Shopify orders:', error)
    return []
  }
}

export async function getRevenueMetrics(dateRange?: DateRange): Promise<RevenueMetrics> {
  try {
    let query = supabase
      .from('shopify_orders')
      .select('total_price, order_created_at')

    if (dateRange) {
      query = query
        .gte('order_created_at', dateRange.startDate)
        .lte('order_created_at', dateRange.endDate)
    }

    const { data, error } = await query

    if (error) throw error

    const orders = data || []
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price), 0)

    // Calculate today's metrics
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const todayOrders = orders.filter(o => new Date(o.order_created_at) >= startOfToday)
    const todayRevenue = todayOrders.reduce((sum, o) => sum + Number(o.total_price), 0)

    // Calculate this week's metrics
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weekOrders = orders.filter(o => new Date(o.order_created_at) >= weekAgo)
    const weekRevenue = weekOrders.reduce((sum, o) => sum + Number(o.total_price), 0)

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      todayRevenue,
      todayOrders: todayOrders.length,
      weekRevenue,
      weekOrders: weekOrders.length,
    }
  } catch (error) {
    console.error('Error fetching revenue metrics:', error)
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      todayRevenue: 0,
      todayOrders: 0,
      weekRevenue: 0,
      weekOrders: 0,
    }
  }
}

// ============================================================
// TRAFFIC SOURCE & ATTRIBUTION ANALYTICS
// ============================================================

export interface TrafficSourceStats {
  source: string
  displayName: string
  sessions: number
  orders: number
  revenue: number
  conversionRate: number
  averageOrderValue: number
}

export async function getTrafficSourceStats(dateRange?: DateRange): Promise<TrafficSourceStats[]> {
  try {
    let query = supabase
      .from('shopify_orders')
      .select('utm_source, utm_medium, referring_site, total_price')

    if (dateRange) {
      query = query
        .gte('order_created_at', dateRange.startDate)
        .lte('order_created_at', dateRange.endDate)
    }

    const { data, error } = await query
    if (error) throw error

    // Normalize traffic sources
    const normalizeSource = (order: any): string => {
      const source = (order.utm_source || '').toLowerCase()
      const medium = (order.utm_medium || '').toLowerCase()
      const referring = (order.referring_site || '').toLowerCase()

      // Google
      if (source.includes('google') || referring.includes('google')) return 'google'
      // Facebook
      if (source.includes('facebook') || source.includes('fb') || referring.includes('facebook')) return 'facebook'
      // Instagram
      if (source.includes('instagram') || source.includes('ig') || referring.includes('instagram')) return 'instagram'
      // TikTok
      if (source.includes('tiktok') || referring.includes('tiktok')) return 'tiktok'
      // Twitter/X
      if (source.includes('twitter') || source.includes('x.com') || referring.includes('twitter')) return 'twitter'
      // LinkedIn
      if (source.includes('linkedin') || referring.includes('linkedin')) return 'linkedin'
      // Pinterest
      if (source.includes('pinterest') || referring.includes('pinterest')) return 'pinterest'
      // Email
      if (medium.includes('email') || source.includes('email')) return 'email'
      // Direct
      if (!source && !referring) return 'direct'
      // Other
      return 'other'
    }

    const getDisplayName = (source: string): string => {
      const names: Record<string, string> = {
        google: 'Google',
        facebook: 'Facebook',
        instagram: 'Instagram',
        tiktok: 'TikTok',
        twitter: 'Twitter/X',
        linkedin: 'LinkedIn',
        pinterest: 'Pinterest',
        email: 'Email',
        direct: 'Direct',
        other: 'Other',
      }
      return names[source] || source
    }

    // Group by normalized source
    const grouped = (data || []).reduce((acc, order) => {
      const source = normalizeSource(order)
      if (!acc[source]) {
        acc[source] = {
          orders: 0,
          revenue: 0,
        }
      }
      acc[source].orders++
      acc[source].revenue += Number(order.total_price)
      return acc
    }, {} as Record<string, { orders: number; revenue: number }>)

    // Get total sessions from thank you page (as proxy for total traffic)
    let sessionsQuery = supabase
      .from('thank_you_page_sessions')
      .select('id')

    if (dateRange) {
      sessionsQuery = sessionsQuery
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data: sessionsData } = await sessionsQuery
    const totalSessions = (sessionsData || []).length

    return Object.entries(grouped)
      .map(([source, stats]) => ({
        source,
        displayName: getDisplayName(source),
        sessions: totalSessions, // Approximate - we don't have per-source session tracking yet
        orders: stats.orders,
        revenue: stats.revenue,
        conversionRate: totalSessions > 0 ? (stats.orders / totalSessions) * 100 : 0,
        averageOrderValue: stats.orders > 0 ? stats.revenue / stats.orders : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
  } catch (error) {
    console.error('Error fetching traffic source stats:', error)
    return []
  }
}

export interface PageRevenueAttribution {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  conversionValue: number // Revenue per visitor
}

export async function getThankYouPageRevenue(dateRange?: DateRange): Promise<PageRevenueAttribution> {
  try {
    // Get thank you page sessions with emails
    let sessionsQuery = supabase
      .from('thank_you_page_sessions')
      .select('email, created_at')
      .not('email', 'is', null)

    if (dateRange) {
      sessionsQuery = sessionsQuery
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery
    if (sessionsError) throw sessionsError

    const emails = [...new Set((sessions || []).map(s => s.email))]

    if (emails.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, conversionValue: 0 }
    }

    // Get orders from these emails
    let ordersQuery = supabase
      .from('shopify_orders')
      .select('total_price, customer_email')
      .in('customer_email', emails)

    if (dateRange) {
      ordersQuery = ordersQuery
        .gte('order_created_at', dateRange.startDate)
        .lte('order_created_at', dateRange.endDate)
    }

    const { data: orders, error: ordersError } = await ordersQuery
    if (ordersError) throw ordersError

    const totalOrders = (orders || []).length
    const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total_price), 0)
    const totalVisitors = (sessions || []).length

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      conversionValue: totalVisitors > 0 ? totalRevenue / totalVisitors : 0,
    }
  } catch (error) {
    console.error('Error fetching thank you page revenue:', error)
    return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, conversionValue: 0 }
  }
}

export async function getProductPageRevenue(dateRange?: DateRange): Promise<PageRevenueAttribution> {
  try {
    // Get product page sessions with emails
    let sessionsQuery = supabase
      .from('product_page_sessions')
      .select('email, created_at')
      .not('email', 'is', null)

    if (dateRange) {
      sessionsQuery = sessionsQuery
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate)
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery
    if (sessionsError) throw sessionsError

    const emails = [...new Set((sessions || []).map(s => s.email))]

    if (emails.length === 0) {
      return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, conversionValue: 0 }
    }

    // Get orders from these emails
    let ordersQuery = supabase
      .from('shopify_orders')
      .select('total_price, customer_email')
      .in('customer_email', emails)

    if (dateRange) {
      ordersQuery = ordersQuery
        .gte('order_created_at', dateRange.startDate)
        .lte('order_created_at', dateRange.endDate)
    }

    const { data: orders, error: ordersError } = await ordersQuery
    if (ordersError) throw ordersError

    const totalOrders = (orders || []).length
    const totalRevenue = (orders || []).reduce((sum, o) => sum + Number(o.total_price), 0)
    const totalVisitors = (sessions || []).length

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      conversionValue: totalVisitors > 0 ? totalRevenue / totalVisitors : 0,
    }
  } catch (error) {
    console.error('Error fetching product page revenue:', error)
    return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, conversionValue: 0 }
  }
}

// ============================================================
// BUY BUTTON CLICK RATE ANALYTICS
// ============================================================

export interface BuyButtonClickRates {
  // Global metrics (across both pages)
  globalClickRate: number
  globalClicks: number
  globalSessions: number

  // Thank You page metrics
  thankYouClickRate: number
  thankYouClicks: number
  thankYouSessions: number

  // Product page metrics
  productClickRate: number
  productClicks: number
  productSessions: number
}

export async function getBuyButtonClickRates(dateRange?: DateRange): Promise<BuyButtonClickRates> {
  try {
    // Fetch Thank You page metrics
    const thankYouMetrics = await getThankYouPageMetrics(dateRange)

    // Fetch Product page metrics
    const productMetrics = await getProductPageMetrics(dateRange)

    // Calculate global metrics
    const globalSessions = thankYouMetrics.totalSessions + productMetrics.totalSessions
    const globalClicks = thankYouMetrics.clickedBuyButton + productMetrics.clickedBuyButton
    const globalClickRate = globalSessions > 0 ? (globalClicks / globalSessions) * 100 : 0

    return {
      globalClickRate,
      globalClicks,
      globalSessions,
      thankYouClickRate: thankYouMetrics.conversionRate,
      thankYouClicks: thankYouMetrics.clickedBuyButton,
      thankYouSessions: thankYouMetrics.totalSessions,
      productClickRate: productMetrics.conversionRate,
      productClicks: productMetrics.clickedBuyButton,
      productSessions: productMetrics.totalSessions,
    }
  } catch (error) {
    console.error('Error fetching buy button click rates:', error)
    return {
      globalClickRate: 0,
      globalClicks: 0,
      globalSessions: 0,
      thankYouClickRate: 0,
      thankYouClicks: 0,
      thankYouSessions: 0,
      productClickRate: 0,
      productClicks: 0,
      productSessions: 0,
    }
  }
}

// ============================================================
// FACEBOOK ADS & ROAS ANALYTICS
// ============================================================

export interface FacebookAdsROASMetrics {
  // Ad spend metrics
  adSpend: number
  impressions: number
  clicks: number
  cpc: number
  cpm: number
  ctr: number
  reach: number

  // Revenue metrics
  revenue: number
  orders: number

  // Calculated ROI metrics
  roas: number // Return on Ad Spend (Revenue / Spend)
  cpa: number // Cost Per Acquisition (Spend / Orders)
  profit: number // Revenue - Ad Spend
  roi: number // ROI percentage
  revenuePerClick: number // Revenue / Clicks
}

export async function getFacebookAdsROASMetrics(dateRange?: DateRange): Promise<FacebookAdsROASMetrics> {
  try {
    console.log('🔄 Fetching Facebook Ads ROAS metrics with date range:', {
      hasDateRange: !!dateRange,
      startDate: dateRange?.startDate,
      endDate: dateRange?.endDate
    })

    // Import Facebook Ads service
    const { getFacebookAdsInsights } = await import('./facebookAds')

    // Fetch both Facebook Ads and Shopify revenue data in parallel
    const [facebookMetrics, revenueMetrics] = await Promise.all([
      getFacebookAdsInsights(dateRange),
      getRevenueMetrics(dateRange),
    ])

    console.log('📊 Raw metrics fetched:', {
      facebookSpend: facebookMetrics.spend,
      facebookImpressions: facebookMetrics.impressions,
      shopifyRevenue: revenueMetrics.totalRevenue,
      shopifyOrders: revenueMetrics.totalOrders,
      dateRange: dateRange || 'default (last 30 days)'
    })

    // Calculate derived metrics
    const revenue = revenueMetrics.totalRevenue
    const orders = revenueMetrics.totalOrders
    const spend = facebookMetrics.spend

    const roas = spend > 0 ? revenue / spend : 0
    const cpa = orders > 0 ? spend / orders : 0
    const profit = revenue - spend
    const roi = spend > 0 ? (profit / spend) * 100 : 0
    const revenuePerClick = facebookMetrics.clicks > 0 ? revenue / facebookMetrics.clicks : 0

    console.log('✅ Facebook Ads ROAS calculated:', {
      roas: roas.toFixed(2),
      cpa: cpa.toFixed(2),
      profit: profit.toFixed(2),
      roi: roi.toFixed(2) + '%',
      dateRange: dateRange || 'default (last 30 days)'
    })

    return {
      // Ad spend metrics
      adSpend: spend,
      impressions: facebookMetrics.impressions,
      clicks: facebookMetrics.clicks,
      cpc: facebookMetrics.cpc,
      cpm: facebookMetrics.cpm,
      ctr: facebookMetrics.ctr,
      reach: facebookMetrics.reach,

      // Revenue metrics
      revenue,
      orders,

      // Calculated ROI metrics
      roas,
      cpa,
      profit,
      roi,
      revenuePerClick,
    }
  } catch (error) {
    console.error('❌ Error fetching Facebook Ads ROAS metrics:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      dateRange: dateRange || 'default (last 30 days)'
    })
    return {
      adSpend: 0,
      impressions: 0,
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      reach: 0,
      revenue: 0,
      orders: 0,
      roas: 0,
      cpa: 0,
      profit: 0,
      roi: 0,
      revenuePerClick: 0,
    }
  }
}
