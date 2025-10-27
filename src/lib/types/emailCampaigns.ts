/**
 * Email Campaign Types
 * Centralized type definitions for email campaign analytics
 */

export interface Campaign {
  campaignName: string
  totalSends: number
  firstSend: string
  lastSend: string
}

export interface CampaignSummary {
  totalSends: number
  uniqueOpens: number
  openRate: number
  totalBuyClicks: number
  clickThroughRate: number
}

export interface EmailSequenceMetric {
  emailSequenceDay: number
  emailSubject: string
  emailsSent: number
  uniqueOpens: number
  openRate: number
  buyButtonClicks: number
  clickThroughRate: number
  utmContent: string
}

export interface EmailCampaignData {
  campaign: Campaign
  summary: CampaignSummary
  sequence: EmailSequenceMetric[]
}

export type OpenRateStatus = 'excellent' | 'good' | 'poor'

export interface DateRange {
  startDate: string
  endDate: string
}
