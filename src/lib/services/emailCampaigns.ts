/**
 * Email Campaigns Service
 * Handles all database queries for email campaign analytics
 */

import { supabase } from '../supabase'
import type {
  Campaign,
  CampaignSummary,
  EmailSequenceMetric,
  EmailCampaignData,
  DateRange,
} from '../types/emailCampaigns'

/**
 * Get list of all campaigns with metadata
 */
export async function getCampaignList(dateRange?: DateRange): Promise<Campaign[]> {
  try {
    let query = supabase
      .from('email_sends')
      .select('campaign_name, sent_at')
      .not('campaign_name', 'is', null)

    if (dateRange) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      const isSameDay = start.toDateString() === end.toDateString()

      // If same day, expand to full 24 hours to capture all data for that day
      if (isSameDay) {
        const dayStart = new Date(start)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(end)
        dayEnd.setHours(23, 59, 59, 999)

        query = query
          .gte('sent_at', dayStart.toISOString())
          .lte('sent_at', dayEnd.toISOString())
      } else {
        query = query
          .gte('sent_at', dateRange.startDate)
          .lte('sent_at', dateRange.endDate)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching campaign list:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Group by campaign and calculate metadata
    const campaignMap = new Map<string, { sends: number; dates: string[] }>()

    data.forEach((row) => {
      const campaignName = row.campaign_name!
      if (!campaignMap.has(campaignName)) {
        campaignMap.set(campaignName, { sends: 0, dates: [] })
      }
      const campaign = campaignMap.get(campaignName)!
      campaign.sends++
      campaign.dates.push(row.sent_at)
    })

    // Convert to Campaign array
    const campaigns: Campaign[] = Array.from(campaignMap.entries()).map(
      ([campaignName, { sends, dates }]) => {
        const sortedDates = dates.sort()
        return {
          campaignName,
          totalSends: sends,
          firstSend: sortedDates[0],
          lastSend: sortedDates[sortedDates.length - 1],
        }
      }
    )

    // Sort by most recent first
    return campaigns.sort((a, b) =>
      new Date(b.lastSend).getTime() - new Date(a.lastSend).getTime()
    )
  } catch (error) {
    console.error('Error in getCampaignList:', error)
    return []
  }
}

/**
 * Get summary metrics for a specific campaign
 */
export async function getCampaignSummary(
  campaignName: string,
  dateRange?: DateRange
): Promise<CampaignSummary | null> {
  try {
    // Query 1: Total sends
    let sendsQuery = supabase
      .from('email_sends')
      .select('recipient_email, sent_at', { count: 'exact', head: false })
      .eq('campaign_name', campaignName)

    if (dateRange) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      const isSameDay = start.toDateString() === end.toDateString()

      if (isSameDay) {
        const dayStart = new Date(start)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(end)
        dayEnd.setHours(23, 59, 59, 999)

        sendsQuery = sendsQuery
          .gte('sent_at', dayStart.toISOString())
          .lte('sent_at', dayEnd.toISOString())
      } else {
        sendsQuery = sendsQuery
          .gte('sent_at', dateRange.startDate)
          .lte('sent_at', dateRange.endDate)
      }
    }

    const { data: sendsData, count: totalSends, error: sendsError } = await sendsQuery

    if (sendsError) {
      console.error('Error fetching sends:', sendsError)
      return null
    }

    // Query 2: Get all product page sessions matching campaign
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('product_page_sessions')
      .select('email, session_id, created_at')
      .eq('utm_campaign', campaignName)
      .not('email', 'is', null)

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
    }

    // Match sessions to sends (within 48hrs)
    const uniqueOpensSet = new Set<string>()
    if (sessionsData && sendsData) {
      sessionsData.forEach((session) => {
        const matchingSend = sendsData.find(
          (send) =>
            send.recipient_email === session.email &&
            new Date(session.created_at) >= new Date(send.sent_at) &&
            new Date(session.created_at) <=
              new Date(new Date(send.sent_at).getTime() + 48 * 60 * 60 * 1000)
        )
        if (matchingSend) {
          uniqueOpensSet.add(session.email!)
        }
      })
    }

    const uniqueOpens = uniqueOpensSet.size

    // Query 3: Buy button clicks from these sessions
    const sessionIds = sessionsData?.map((s) => s.session_id) || []
    let totalBuyClicks = 0

    if (sessionIds.length > 0) {
      const { count, error: clicksError } = await supabase
        .from('product_page_events')
        .select('*', { count: 'exact', head: true })
        .in('session_id', sessionIds)
        .eq('event_type', 'buy_button_click')

      if (clicksError) {
        console.error('Error fetching clicks:', clicksError)
      } else {
        totalBuyClicks = count || 0
      }
    }

    // Calculate rates
    const openRate = totalSends ? (uniqueOpens / totalSends) * 100 : 0
    const clickThroughRate = uniqueOpens ? (totalBuyClicks / uniqueOpens) * 100 : 0

    return {
      totalSends: totalSends || 0,
      uniqueOpens,
      openRate: Math.round(openRate * 10) / 10,
      totalBuyClicks,
      clickThroughRate: Math.round(clickThroughRate * 10) / 10,
    }
  } catch (error) {
    console.error('Error in getCampaignSummary:', error)
    return null
  }
}

/**
 * Get email-level breakdown for a campaign sequence
 */
export async function getEmailSequenceMetrics(
  campaignName: string,
  dateRange?: DateRange
): Promise<EmailSequenceMetric[]> {
  try {
    // Get all email sends for this campaign
    let sendsQuery = supabase
      .from('email_sends')
      .select('email_sequence_day, email_subject, utm_content, recipient_email, sent_at')
      .eq('campaign_name', campaignName)
      .not('email_sequence_day', 'is', null)

    if (dateRange) {
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      const isSameDay = start.toDateString() === end.toDateString()

      if (isSameDay) {
        const dayStart = new Date(start)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(end)
        dayEnd.setHours(23, 59, 59, 999)

        sendsQuery = sendsQuery
          .gte('sent_at', dayStart.toISOString())
          .lte('sent_at', dayEnd.toISOString())
      } else {
        sendsQuery = sendsQuery
          .gte('sent_at', dateRange.startDate)
          .lte('sent_at', dateRange.endDate)
      }
    }

    const { data: sends, error: sendsError } = await sendsQuery

    if (sendsError) {
      console.error('Error fetching email sends:', sendsError)
      return []
    }

    if (!sends || sends.length === 0) {
      return []
    }

    // Get product page sessions for matching emails
    const recipientEmails = [...new Set(sends.map(s => s.recipient_email))]

    const { data: sessions, error: sessionsError } = await supabase
      .from('product_page_sessions')
      .select('email, utm_content, session_id, created_at')
      .in('email', recipientEmails)
      .eq('utm_campaign', campaignName)

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError)
    }

    // Get buy button clicks
    const sessionIds = sessions?.map(s => s.session_id) || []
    const { data: clicks, error: clicksError } = await supabase
      .from('product_page_events')
      .select('session_id, email')
      .in('session_id', sessionIds)
      .eq('event_type', 'buy_button_click')

    if (clicksError) {
      console.error('Error fetching clicks:', clicksError)
    }

    // Group by email sequence day
    const sequenceMap = new Map<number, {
      emailSubject: string
      utmContent: string
      sends: Set<string>
      opens: Set<string>
      clicks: Set<string>
    }>()

    // Process sends
    sends.forEach((send) => {
      const day = send.email_sequence_day
      if (!sequenceMap.has(day)) {
        sequenceMap.set(day, {
          emailSubject: send.email_subject,
          utmContent: send.utm_content,
          sends: new Set(),
          opens: new Set(),
          clicks: new Set(),
        })
      }
      sequenceMap.get(day)!.sends.add(send.recipient_email)
    })

    // Process opens (match by email + utm_content + within 48hrs)
    sessions?.forEach((session) => {
      const matchingSends = sends.filter(
        (send) =>
          send.recipient_email === session.email &&
          send.utm_content === session.utm_content &&
          new Date(session.created_at) >= new Date(send.sent_at) &&
          new Date(session.created_at) <= new Date(new Date(send.sent_at).getTime() + 48 * 60 * 60 * 1000)
      )

      matchingSends.forEach((send) => {
        const day = send.email_sequence_day
        if (sequenceMap.has(day)) {
          sequenceMap.get(day)!.opens.add(session.email!)
        }
      })
    })

    // Process clicks
    clicks?.forEach((click) => {
      const matchingSession = sessions?.find(s => s.session_id === click.session_id)
      if (matchingSession) {
        const matchingSends = sends.filter(
          (send) =>
            send.recipient_email === matchingSession.email &&
            send.utm_content === matchingSession.utm_content
        )

        matchingSends.forEach((send) => {
          const day = send.email_sequence_day
          if (sequenceMap.has(day)) {
            sequenceMap.get(day)!.clicks.add(click.email!)
          }
        })
      }
    })

    // Convert to EmailSequenceMetric array
    const metrics: EmailSequenceMetric[] = Array.from(sequenceMap.entries()).map(
      ([day, data]) => {
        const emailsSent = data.sends.size
        const uniqueOpens = data.opens.size
        const buyButtonClicks = data.clicks.size

        const openRate = emailsSent > 0 ? (uniqueOpens / emailsSent) * 100 : 0
        const clickThroughRate = uniqueOpens > 0 ? (buyButtonClicks / uniqueOpens) * 100 : 0

        return {
          emailSequenceDay: day,
          emailSubject: data.emailSubject,
          emailsSent,
          uniqueOpens,
          openRate: Math.round(openRate * 10) / 10,
          buyButtonClicks,
          clickThroughRate: Math.round(clickThroughRate * 10) / 10,
          utmContent: data.utmContent,
        }
      }
    )

    // Sort by sequence day
    return metrics.sort((a, b) => a.emailSequenceDay - b.emailSequenceDay)
  } catch (error) {
    console.error('Error in getEmailSequenceMetrics:', error)
    return []
  }
}

/**
 * Get complete campaign data (summary + sequence)
 */
export async function getEmailCampaignData(
  campaignName: string,
  dateRange?: DateRange
): Promise<EmailCampaignData | null> {
  try {
    const [campaigns, summary, sequence] = await Promise.all([
      getCampaignList(dateRange),
      getCampaignSummary(campaignName, dateRange),
      getEmailSequenceMetrics(campaignName, dateRange),
    ])

    const campaign = campaigns.find((c) => c.campaignName === campaignName)

    if (!campaign || !summary) {
      return null
    }

    return {
      campaign,
      summary,
      sequence,
    }
  } catch (error) {
    console.error('Error in getEmailCampaignData:', error)
    return null
  }
}

/**
 * Helper: Determine open rate status for visual indicators
 */
export function getOpenRateStatus(openRate: number): 'excellent' | 'good' | 'poor' {
  if (openRate >= 30) return 'excellent'
  if (openRate >= 15) return 'good'
  return 'poor'
}
