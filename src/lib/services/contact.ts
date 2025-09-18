import { supabase } from '../supabase'
import { getCurrentTrackingContext } from './leads'
import type { 
  ContactSubmission, 
  CreateContactSubmissionData, 
  ContactSubmissionResponse,
  ContactSubmissionAnalytics,
  ContactTrackingContext,
  ContactSubmissionFilters,
  ContactSubmissionPagination,
  ContactSubmissionStats,
  ContactSubmissionsResult,
  ContactSubmissionExportData
} from '../types/contact'

// Create a new contact submission
export async function createContactSubmission(
  data: {
    name: string
    email: string
    subject: string
    message: string
  },
  context?: Partial<ContactTrackingContext>
): Promise<ContactSubmissionResponse> {
  try {
    // Get tracking context
    const trackingContext = context || getCurrentTrackingContext()
    
    const submissionData: CreateContactSubmissionData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      source_url: trackingContext.source_url,
      source_page: trackingContext.source_page || 'contact',
      referrer_url: trackingContext.referrer_url,
      user_agent: navigator.userAgent,
      browser: trackingContext.browser_info?.browser,
      device_type: trackingContext.browser_info?.device_type,
      ...trackingContext.utm_params
    }
    
    // Insert the contact submission (without requiring SELECT access)
    const { error } = await supabase
      .from('contact_submissions')
      .insert([submissionData])
    
    if (error) {
      console.error('Error creating contact submission:', error)
      return {
        success: false,
        message: 'Failed to send your message. Please try again.',
        error: error.message
      }
    }
    
    return {
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
    }
    
  } catch (error) {
    console.error('Unexpected error creating contact submission:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Enhanced admin function: Get contact submissions with advanced filtering
export async function getContactSubmissions(
  filters: ContactSubmissionFilters = {},
  pagination: ContactSubmissionPagination = { page: 1, limit: 50, offset: 0 }
): Promise<ContactSubmissionsResult> {
  try {
    let query = supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(pagination.offset, pagination.offset + pagination.limit - 1)
    
    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.source_page) {
      query = query.eq('source_page', filters.source_page)
    }
    
    if (filters.utm_source) {
      query = query.eq('utm_source', filters.utm_source)
    }
    
    if (filters.device_type) {
      query = query.eq('device_type', filters.device_type)
    }
    
    if (filters.browser) {
      query = query.ilike('browser', `%${filters.browser}%`)
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    
    // Full-text search across name, email, and subject
    if (filters.search) {
      const searchTerm = filters.search.trim()
      query = query.or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`
      )
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Error fetching contact submissions:', error)
      throw new Error(`Failed to fetch contact submissions: ${error.message}`)
    }
    
    const totalCount = count || 0
    const hasMore = (pagination.offset + pagination.limit) < totalCount
    
    return { 
      submissions: data || [], 
      count: totalCount,
      hasMore 
    }
  } catch (error) {
    console.error('Unexpected error fetching contact submissions:', error)
    throw error
  }
}

// Enhanced admin function: Update contact submission status
export async function updateContactSubmissionStatus(
  id: string, 
  status: ContactSubmission['status']
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { 
      status,
      updated_at: new Date().toISOString()
    }
    
    // Automatically set replied_at when status changes to 'replied'
    if (status === 'replied') {
      updateData.replied_at = new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('contact_submissions')
      .update(updateData)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating contact submission status:', error)
      return { 
        success: false, 
        error: `Failed to update status: ${error.message}` 
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error updating contact submission status:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Enhanced admin function: Get comprehensive dashboard statistics
export async function getContactSubmissionStats(): Promise<ContactSubmissionStats> {
  try {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    // Get total submissions today
    const { count: totalToday, error: todayError } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
    
    if (todayError) throw todayError
    
    // Get total submissions yesterday
    const { count: totalYesterday, error: yesterdayError } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
    
    if (yesterdayError) throw yesterdayError
    
    // Get status breakdown
    const { data: statusData, error: statusError } = await supabase
      .from('contact_submissions')
      .select('status')
      .not('status', 'is', null)
    
    if (statusError) throw statusError
    
    const statusBreakdown = statusData?.reduce((acc, row) => {
      const status = row.status as 'new' | 'in_progress' | 'replied' | 'closed'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, { new: 0, in_progress: 0, replied: 0, closed: 0 }) || { new: 0, in_progress: 0, replied: 0, closed: 0 }
    
    // Get device analytics
    const { data: deviceData, error: deviceError } = await supabase
      .from('contact_submissions')
      .select('device_type')
      .not('device_type', 'is', null)
    
    if (deviceError) throw deviceError
    
    const deviceAnalytics = Object.entries(
      deviceData?.reduce((acc, row) => {
        if (row.device_type) {
          acc[row.device_type] = (acc[row.device_type] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>) || {}
    ).map(([device_type, count]) => ({ device_type, count }))
    
    // Get UTM source analytics
    const { data: utmData, error: utmError } = await supabase
      .from('contact_submissions')
      .select('utm_source')
      .not('utm_source', 'is', null)
    
    if (utmError) throw utmError
    
    const utmAnalytics = Object.entries(
      utmData?.reduce((acc, row) => {
        if (row.utm_source) {
          acc[row.utm_source] = (acc[row.utm_source] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>) || {}
    ).map(([utm_source, count]) => ({ utm_source, count }))
    
    // Get overdue submissions (>24h without reply)
    const { count: overdueCount, error: overdueError } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['new', 'in_progress'])
      .lt('created_at', twentyFourHoursAgo.toISOString())
    
    if (overdueError) throw overdueError
    
    // Calculate average response time for replied submissions
    const { data: repliedData, error: repliedError } = await supabase
      .from('contact_submissions')
      .select('created_at, replied_at')
      .eq('status', 'replied')
      .not('replied_at', 'is', null)
    
    if (repliedError) throw repliedError
    
    let averageResponseTime = 0
    if (repliedData && repliedData.length > 0) {
      const totalResponseTime = repliedData.reduce((sum, row) => {
        const created = new Date(row.created_at)
        const replied = new Date(row.replied_at!)
        return sum + (replied.getTime() - created.getTime())
      }, 0)
      averageResponseTime = totalResponseTime / repliedData.length / (1000 * 60 * 60) // in hours
    }
    
    // Calculate response rate
    const totalSubmissions = statusBreakdown.new + statusBreakdown.in_progress + statusBreakdown.replied + statusBreakdown.closed
    const responseRate = totalSubmissions > 0 ? (statusBreakdown.replied / totalSubmissions) * 100 : 0
    
    return {
      total_today: totalToday || 0,
      total_yesterday: totalYesterday || 0,
      status_breakdown: statusBreakdown,
      device_analytics: deviceAnalytics,
      utm_analytics: utmAnalytics,
      overdue_count: overdueCount || 0,
      average_response_time_hours: Math.round(averageResponseTime * 100) / 100,
      response_rate: Math.round(responseRate * 100) / 100
    }
  } catch (error) {
    console.error('Error fetching contact submission stats:', error)
    throw error
  }
}

// Enhanced admin function: Full-text search across submissions
export async function searchContactSubmissions(
  query: string,
  limit = 20
): Promise<ContactSubmission[]> {
  try {
    const searchTerm = query.trim()
    if (!searchTerm) {
      return []
    }
    
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`
      )
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) {
      console.error('Error searching contact submissions:', error)
      throw new Error(`Search failed: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error searching contact submissions:', error)
    throw error
  }
}

// Enhanced admin function: Export contact submissions with filters
export async function exportContactSubmissions(
  filters: ContactSubmissionFilters = {}
): Promise<ContactSubmissionExportData[]> {
  try {
    let query = supabase
      .from('contact_submissions')
      .select(`
        id,
        name,
        email,
        subject,
        message,
        status,
        source_page,
        utm_source,
        utm_medium,
        utm_campaign,
        device_type,
        browser,
        country_code,
        created_at,
        replied_at
      `)
      .order('created_at', { ascending: false })
    
    // Apply same filters as getContactSubmissions
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.source_page) {
      query = query.eq('source_page', filters.source_page)
    }
    
    if (filters.utm_source) {
      query = query.eq('utm_source', filters.utm_source)
    }
    
    if (filters.device_type) {
      query = query.eq('device_type', filters.device_type)
    }
    
    if (filters.browser) {
      query = query.ilike('browser', `%${filters.browser}%`)
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    
    if (filters.search) {
      const searchTerm = filters.search.trim()
      query = query.or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`
      )
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error exporting contact submissions:', error)
      throw new Error(`Export failed: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error exporting contact submissions:', error)
    throw error
  }
}

// Get contact submission analytics (preserved for compatibility)
export async function getContactSubmissionAnalytics(
  days = 30
): Promise<ContactSubmissionAnalytics[]> {
  try {
    const { data, error } = await supabase
      .from('contact_submission_analytics')
      .select('*')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false })
    
    if (error) {
      console.error('Error fetching contact submission analytics:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error fetching contact analytics:', error)
    return []
  }
}

// Get contact submissions by status (preserved for compatibility)
export async function getContactSubmissionsByStatus(
  status: ContactSubmission['status']
): Promise<ContactSubmission[]> {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching contact submissions by status:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Unexpected error fetching contact submissions by status:', error)
    return []
  }
}

// Real-time subscription helper for admin interface
export function subscribeToContactSubmissions(
  callback: (payload: any) => void,
  filters?: { status?: string }
) {
  let subscription = supabase
    .channel('contact-submissions-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contact_submissions',
        ...(filters?.status && { filter: `status=eq.${filters.status}` })
      },
      callback
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}