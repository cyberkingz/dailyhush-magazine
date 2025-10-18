/**
 * Facebook Ads Insights Service
 * Fetches ad performance data from Facebook Marketing API
 *
 * Date Range Handling:
 * - Accepts ISO date strings (e.g., "2025-01-15T23:59:59.999Z")
 * - Converts to YYYY-MM-DD format required by Facebook API
 * - Defaults to last 30 days if no date range provided
 * - All dates are normalized to UTC to avoid timezone issues
 */

export interface FacebookAdsInsights {
  spend: number
  impressions: number
  clicks: number
  cpc: number
  cpm: number
  ctr: number
  reach: number
  frequency: number
  purchases?: number
  purchase_value?: number
}

export interface FacebookAdsMetrics extends FacebookAdsInsights {
  roas: number // Return on Ad Spend
  cpa: number // Cost Per Acquisition
  revenue: number // Revenue from tracked conversions
  profit: number // Revenue - Ad Spend
  roi: number // ROI percentage
}

export interface DateRange {
  startDate: string
  endDate: string
}

const FB_API_VERSION = 'v21.0'
const FB_GRAPH_URL = `https://graph.facebook.com/${FB_API_VERSION}`

/**
 * Get Facebook Ads credentials from environment variables
 */
function getFacebookCredentials() {
  const accessToken = import.meta.env.VITE_FACEBOOK_ACCESS_TOKEN
  const adAccountId = import.meta.env.VITE_FACEBOOK_AD_ACCOUNT_ID

  if (!accessToken || !adAccountId) {
    throw new Error('Facebook Ads credentials not configured in environment variables')
  }

  return { accessToken, adAccountId }
}

/**
 * Convert ISO date string or Date object to YYYY-MM-DD format
 * Normalizes to UTC to avoid timezone issues
 */
function formatDateForFacebook(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date

    // Validate date
    if (isNaN(d.getTime())) {
      throw new Error(`Invalid date: ${date}`)
    }

    // Format as YYYY-MM-DD in UTC
    const year = d.getUTCFullYear()
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const day = String(d.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('❌ Error formatting date for Facebook:', error)
    throw new Error(`Failed to format date: ${date}`)
  }
}

/**
 * Validate date range
 */
function validateDateRange(startDate: string, endDate: string): void {
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime())) {
    throw new Error(`Invalid start date: ${startDate}`)
  }

  if (isNaN(end.getTime())) {
    throw new Error(`Invalid end date: ${endDate}`)
  }

  if (start > end) {
    throw new Error(`Start date (${startDate}) cannot be after end date (${endDate})`)
  }

  // Check if date range is too far in the future
  const now = new Date()
  if (start > now) {
    console.warn('⚠️ Warning: Start date is in the future')
  }
}

/**
 * Fetch Facebook Ads Insights for a given date range
 */
export async function getFacebookAdsInsights(
  dateRange?: DateRange
): Promise<FacebookAdsInsights> {
  try {
    const { accessToken, adAccountId } = getFacebookCredentials()

    // Calculate date range with proper defaults
    let startDate: string
    let endDate: string

    if (dateRange) {
      // Use provided date range and validate
      validateDateRange(dateRange.startDate, dateRange.endDate)
      startDate = formatDateForFacebook(dateRange.startDate)
      endDate = formatDateForFacebook(dateRange.endDate)
      console.log('📅 Using custom date range:', {
        rawStart: dateRange.startDate,
        rawEnd: dateRange.endDate,
        formattedStart: startDate,
        formattedEnd: endDate
      })
    } else {
      // Default to last 30 days
      const end = new Date()
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      startDate = formatDateForFacebook(start)
      endDate = formatDateForFacebook(end)
      console.log('📅 Using default date range (last 30 days):', { startDate, endDate })
    }

    // Facebook Ads Insights API endpoint
    const url = new URL(`${FB_GRAPH_URL}/${adAccountId}/insights`)

    // Build time_range parameter
    const timeRange = { since: startDate, until: endDate }

    // Query parameters
    url.searchParams.append('access_token', accessToken)
    url.searchParams.append('time_range', JSON.stringify(timeRange))
    url.searchParams.append('level', 'account')
    url.searchParams.append(
      'fields',
      [
        'spend',
        'impressions',
        'clicks',
        'cpc',
        'cpm',
        'ctr',
        'reach',
        'frequency',
        'actions',
        'action_values',
      ].join(',')
    )

    console.log('🔵 Fetching Facebook Ads Insights...', {
      adAccountId,
      timeRange,
      apiUrl: url.toString().replace(accessToken, '[REDACTED]')
    })

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Facebook Ads API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        dateRange: timeRange
      })
      throw new Error(`Facebook Ads API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()

    // Log raw response for debugging
    console.log('📦 Facebook Ads API response:', {
      hasData: !!data.data,
      dataLength: data.data?.length || 0,
      dateRange: timeRange
    })

    // Parse the insights data
    const insights = data.data?.[0] || {}

    // Check if we got empty data (no ads in this date range)
    if (!insights || Object.keys(insights).length === 0) {
      console.warn('⚠️ No Facebook Ads data returned for date range:', timeRange)
    }

    // Extract purchases from actions array
    const purchases =
      insights.actions?.find((action: any) => action.action_type === 'purchase')?.value || 0

    // Extract purchase value from action_values array
    const purchaseValue =
      insights.action_values?.find((action: any) => action.action_type === 'purchase')?.value || 0

    const result: FacebookAdsInsights = {
      spend: parseFloat(insights.spend || 0),
      impressions: parseInt(insights.impressions || 0),
      clicks: parseInt(insights.clicks || 0),
      cpc: parseFloat(insights.cpc || 0),
      cpm: parseFloat(insights.cpm || 0),
      ctr: parseFloat(insights.ctr || 0),
      reach: parseInt(insights.reach || 0),
      frequency: parseFloat(insights.frequency || 0),

      // Purchase metrics
      purchases: parseInt(purchases),
      purchase_value: parseFloat(purchaseValue),
    }

    console.log('✅ Facebook Ads Insights fetched successfully:', {
      dateRange: timeRange,
      spend: result.spend,
      impressions: result.impressions,
      clicks: result.clicks,
      purchases: result.purchases,
      hasData: result.spend > 0 || result.impressions > 0
    })

    return result
  } catch (error) {
    console.error('❌ Error fetching Facebook Ads insights:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      dateRange: dateRange || 'default (last 30 days)'
    })
    // Return zero metrics on error to prevent dashboard from breaking
    return {
      spend: 0,
      impressions: 0,
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      reach: 0,
      frequency: 0,
      purchases: 0,
      purchase_value: 0,
    }
  }
}

/**
 * Calculate ROAS and other marketing metrics by combining Facebook Ads data with revenue data
 */
export async function getFacebookAdsMetrics(
  dateRange?: DateRange,
  revenueAmount?: number
): Promise<FacebookAdsMetrics> {
  try {
    const insights = await getFacebookAdsInsights(dateRange)

    // Use Facebook's tracked purchase_value if available, otherwise use provided revenue
    const revenue = insights.purchase_value || revenueAmount || 0
    const spend = insights.spend

    // Calculate derived metrics
    const roas = spend > 0 ? revenue / spend : 0
    const cpa = insights.purchases && insights.purchases > 0 ? spend / insights.purchases : 0
    const profit = revenue - spend
    const roi = spend > 0 ? (profit / spend) * 100 : 0

    return {
      ...insights,
      revenue,
      roas,
      cpa,
      profit,
      roi,
    }
  } catch (error) {
    console.error('❌ Error calculating Facebook Ads metrics:', error)
    return {
      spend: 0,
      impressions: 0,
      clicks: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      reach: 0,
      frequency: 0,
      purchases: 0,
      purchase_value: 0,
      revenue: 0,
      roas: 0,
      cpa: 0,
      profit: 0,
      roi: 0,
    }
  }
}

/**
 * Get Facebook Ads performance by campaign
 */
export async function getFacebookAdsCampaigns(dateRange?: DateRange) {
  try {
    const { accessToken, adAccountId } = getFacebookCredentials()

    // Calculate date range with proper defaults and validation
    let startDate: string
    let endDate: string

    if (dateRange) {
      validateDateRange(dateRange.startDate, dateRange.endDate)
      startDate = formatDateForFacebook(dateRange.startDate)
      endDate = formatDateForFacebook(dateRange.endDate)
      console.log('📅 Fetching campaigns for custom date range:', {
        formattedStart: startDate,
        formattedEnd: endDate
      })
    } else {
      const end = new Date()
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      startDate = formatDateForFacebook(start)
      endDate = formatDateForFacebook(end)
      console.log('📅 Fetching campaigns for default date range (last 30 days):', { startDate, endDate })
    }

    const url = new URL(`${FB_GRAPH_URL}/${adAccountId}/insights`)
    const timeRange = { since: startDate, until: endDate }

    url.searchParams.append('access_token', accessToken)
    url.searchParams.append('time_range', JSON.stringify(timeRange))
    url.searchParams.append('level', 'campaign')
    url.searchParams.append(
      'fields',
      [
        'campaign_name',
        'spend',
        'impressions',
        'clicks',
        'cpc',
        'cpm',
        'ctr',
        'reach',
        'actions',
        'action_values',
      ].join(',')
    )

    console.log('🔵 Fetching Facebook Ads campaigns...')

    const response = await fetch(url.toString())

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Facebook Ads campaigns API error:', {
        status: response.status,
        error: errorData,
        dateRange: timeRange
      })
      throw new Error('Failed to fetch campaign insights')
    }

    const data = await response.json()

    console.log('✅ Facebook Ads campaigns fetched:', {
      campaignCount: data.data?.length || 0,
      dateRange: timeRange
    })

    return (
      data.data?.map((campaign: any) => ({
        campaign_name: campaign.campaign_name,
        spend: parseFloat(campaign.spend || 0),
        impressions: parseInt(campaign.impressions || 0),
        clicks: parseInt(campaign.clicks || 0),
        cpc: parseFloat(campaign.cpc || 0),
        cpm: parseFloat(campaign.cpm || 0),
        ctr: parseFloat(campaign.ctr || 0),
        reach: parseInt(campaign.reach || 0),
        purchases: parseInt(
          campaign.actions?.find((a: any) => a.action_type === 'purchase')?.value || 0
        ),
        purchase_value: parseFloat(
          campaign.action_values?.find((a: any) => a.action_type === 'purchase')?.value || 0
        ),
      })) || []
    )
  } catch (error) {
    console.error('❌ Error fetching campaign insights:', {
      error: error instanceof Error ? error.message : error,
      dateRange: dateRange || 'default (last 30 days)'
    })
    return []
  }
}
