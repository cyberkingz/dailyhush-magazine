import { supabase } from '../supabase'
import { notifyN8nSubscription } from './webhook'
import { notifyBeehiivSubscription } from './beehiiv-webhook'
import type { 
  Lead, 
  CreateLeadData, 
  LeadAnalytics, 
  LeadSubmissionResponse,
  UTMParameters,
  BrowserInfo,
  LeadTrackingContext
} from '../types/leads'

// Browser detection utility
export function detectBrowser(userAgent: string): BrowserInfo {
  const ua = userAgent.toLowerCase()
  
  let browser = 'unknown'
  if (ua.includes('chrome')) browser = 'chrome'
  else if (ua.includes('firefox')) browser = 'firefox'
  else if (ua.includes('safari')) browser = 'safari'
  else if (ua.includes('edge')) browser = 'edge'
  else if (ua.includes('opera')) browser = 'opera'
  
  let device_type: BrowserInfo['device_type'] = 'unknown'
  if (ua.includes('mobile')) device_type = 'mobile'
  else if (ua.includes('tablet') || ua.includes('ipad')) device_type = 'tablet'
  else device_type = 'desktop'
  
  return { browser, device_type }
}

// Extract UTM parameters from URL
export function extractUTMParameters(url: string): UTMParameters {
  try {
    const urlObj = new URL(url)
    const params = urlObj.searchParams
    
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      utm_term: params.get('utm_term') || undefined,
      utm_content: params.get('utm_content') || undefined
    }
  } catch {
    return {}
  }
}

// Get current page tracking context
export function getCurrentTrackingContext(): LeadTrackingContext {
  const currentUrl = window.location.href
  const referrerUrl = document.referrer
  const userAgent = navigator.userAgent
  
  // Determine source page based on current path
  let sourcePage = 'home'
  const path = window.location.pathname
  
  if (path.startsWith('/blog/') && path !== '/blog/') {
    sourcePage = 'article'
  } else if (path === '/blog/') {
    sourcePage = 'blog-index'
  } else if (path.startsWith('/newsletter/') && path !== '/newsletter') {
    // Article URLs aliased under /newsletter/:slug
    sourcePage = 'article'
  } else if (path.startsWith('/categories/')) {
    sourcePage = 'category'
  } else if (path === '/newsletter') {
    sourcePage = 'newsletter'
  } else if (path === '/contact') {
    sourcePage = 'contact'
  } else if (path === '/about') {
    sourcePage = 'about'
  }
  
  return {
    source_url: currentUrl,
    source_page: sourcePage,
    referrer_url: referrerUrl || undefined,
    utm_params: extractUTMParameters(currentUrl),
    browser_info: detectBrowser(userAgent)
  }
}

// Create a new lead
export async function createLead(email: string, context?: Partial<LeadTrackingContext>): Promise<LeadSubmissionResponse> {
  try {
    // Get tracking context
    const trackingContext = context || getCurrentTrackingContext()
    
    const leadData: CreateLeadData = {
      email: email.trim().toLowerCase(),
      source_url: trackingContext.source_url,
      source_page: trackingContext.source_page,
      referrer_url: trackingContext.referrer_url,
      user_agent: navigator.userAgent,
      browser: trackingContext.browser_info?.browser,
      device_type: trackingContext.browser_info?.device_type,
      ...trackingContext.utm_params
    }
    
    // Insert with minimal return to avoid RLS SELECT requirements for anon users
    const { error } = await supabase
      .from('leads')
      .insert([leadData])
    
    if (error) {
      // Handle duplicate email constraint
      if (error.code === '23505' && error.message.includes('unique_email')) {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.',
          error: 'duplicate_email'
        }
      }
      
      console.error('Error creating lead:', error)
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
        error: error.message
      }
    }
    
    // Successfully created lead - notify webhooks
    // Send to beehiiv webhook (just like n8n)
    notifyBeehiivSubscription(leadData).catch(beehiivError => {
      console.warn('Beehiiv webhook notification failed (subscription still successful):', beehiivError)
    })
    
    // Also notify n8n webhook for additional processing
    notifyN8nSubscription(leadData).catch(n8nError => {
      console.warn('n8n webhook notification failed (subscription still successful):', n8nError)
    })
    
    return {
      success: true,
      message: 'Successfully subscribed!'
    }
    
  } catch (error) {
    console.error('Unexpected error creating lead:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get all leads (for admin)
export async function getLeads(limit = 50, offset = 0): Promise<{ leads: Lead[], count: number }> {
  try {
    const { data, error, count } = await supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error('Error fetching leads:', error)
      return { leads: [], count: 0 }
    }
    
    return { leads: data || [], count: count || 0 }
  } catch (error) {
    console.error('Unexpected error fetching leads:', error)
    return { leads: [], count: 0 }
  }
}

// Get lead analytics
export async function getLeadAnalytics(days = 30): Promise<LeadAnalytics[]> {
  try {
    const { data, error } = await supabase
      .from('lead_analytics')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching lead analytics:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error fetching analytics:', error)
    return []
  }
}

// Update lead subscription status
export async function updateLeadSubscription(id: string, isSubscribed: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ 
        is_subscribed: isSubscribed,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating lead subscription:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Unexpected error updating subscription:', error)
    return false
  }
}

// Confirm email (mark as confirmed)
export async function confirmLeadEmail(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ 
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error confirming lead email:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Unexpected error confirming email:', error)
    return false
  }
}

// Get leads by source page (for analytics)
export async function getLeadsBySource(sourcePage?: string): Promise<Lead[]> {
  try {
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (sourcePage) {
      query = query.eq('source_page', sourcePage)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching leads by source:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error fetching leads by source:', error)
    return []
  }
}
