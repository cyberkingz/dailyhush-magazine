import type { LeadTrackingContext } from './leads'

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  source_url?: string
  source_page?: string
  referrer_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  user_agent?: string
  ip_address?: string
  country_code?: string
  browser?: string
  device_type?: string
  status: 'new' | 'in_progress' | 'replied' | 'closed'
  replied_at?: string
  created_at: string
  updated_at: string
}

export interface CreateContactSubmissionData {
  name: string
  email: string
  subject: string
  message: string
  source_url?: string
  source_page?: string
  referrer_url?: string
  user_agent?: string
  browser?: string
  device_type?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

export interface ContactSubmissionResponse {
  success: boolean
  message: string
  error?: string
  submissionId?: string
}

export interface ContactSubmissionAnalytics {
  date: string
  status: string
  source_page: string
  utm_source?: string
  utm_campaign?: string
  submission_count: number
  replied_count: number
}

// Enhanced types for admin interface
export interface ContactSubmissionFilters {
  search?: string
  status?: ContactSubmission['status']
  source_page?: string
  utm_source?: string
  date_from?: string
  date_to?: string
  device_type?: string
  browser?: string
}

export interface ContactSubmissionPagination {
  page: number
  limit: number
  offset: number
}

export interface ContactSubmissionStats {
  total_today: number
  total_yesterday: number
  status_breakdown: {
    new: number
    in_progress: number
    replied: number
    closed: number
  }
  device_analytics: {
    device_type: string
    count: number
  }[]
  utm_analytics: {
    utm_source: string
    count: number
  }[]
  overdue_count: number
  average_response_time_hours: number
  response_rate: number
}

export interface ContactSubmissionsResult {
  submissions: ContactSubmission[]
  count: number
  hasMore: boolean
}

export interface ContactSubmissionExportData {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  source_page: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  device_type?: string
  browser?: string
  country_code?: string
  created_at: string
  replied_at?: string
}

export interface ContactTrackingContext extends LeadTrackingContext {
  // Inherits all tracking context from leads
}