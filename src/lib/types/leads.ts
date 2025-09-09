// Lead database types
export interface Lead {
  id: string
  email: string
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
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  is_subscribed: boolean
  confirmed_at?: string
  created_at: string
  updated_at: string
}

// Lead creation input (for new lead submissions)
export interface CreateLeadData {
  email: string
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
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
}

// Lead analytics view type
export interface LeadAnalytics {
  date: string
  source_page?: string
  utm_source?: string
  utm_campaign?: string
  lead_count: number
  confirmed_count: number
}

// Lead submission form data
export interface LeadFormData {
  email: string
}

// API response types
export interface LeadSubmissionResponse {
  success: boolean
  message: string
  lead?: Lead
  error?: string
}

// UTM parameters interface
export interface UTMParameters {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
}

// Browser detection result
export interface BrowserInfo {
  browser: string
  device_type: 'desktop' | 'mobile' | 'tablet' | 'unknown'
}

// Lead tracking context (for passing around in components)
export interface LeadTrackingContext {
  source_url: string
  source_page: string
  referrer_url?: string
  utm_params: UTMParameters
  browser_info: BrowserInfo
}