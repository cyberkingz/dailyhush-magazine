import type { Lead } from '../types/leads'

// n8n webhook configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL
const BEEHIIV_PUBLICATION_ID = import.meta.env.VITE_BEEHIIV_PUBLICATION_ID

// Interface for webhook notification data
interface WebhookNotificationData {
  event: string
  email: string
  timestamp: string
  source_page?: string
  source_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  browser?: string
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  referrer_url?: string
  beehiiv_publication_id?: string
  lead_magnet_title?: string
}

/**
 * Send newsletter subscription notification to n8n webhook
 * Uses GET request with URL parameters as tested with curl
 */
export async function notifyN8nSubscription(leadData: Partial<Lead>): Promise<boolean> {
  // Skip if webhook URL not configured
  if (!N8N_WEBHOOK_URL) {
    console.log('n8n webhook URL not configured, skipping notification')
    return true
  }

  try {
    // Determine lead magnet title based on source_page
    let leadMagnetTitle = ''
    if (leadData.source_page === 'home-hero') {
      leadMagnetTitle = 'The Planning Paralysis Test'
    }

    // Prepare webhook notification data
    const notificationData: WebhookNotificationData = {
      event: 'newsletter_subscription',
      email: leadData.email || '',
      timestamp: new Date().toISOString(),
      source_page: leadData.source_page,
      source_url: leadData.source_url,
      utm_source: leadData.utm_source,
      utm_medium: leadData.utm_medium,
      utm_campaign: leadData.utm_campaign,
      utm_term: leadData.utm_term,
      utm_content: leadData.utm_content,
      browser: leadData.browser,
      device_type: leadData.device_type,
      referrer_url: leadData.referrer_url,
      beehiiv_publication_id: BEEHIIV_PUBLICATION_ID,
      lead_magnet_title: leadMagnetTitle
    }

    // Log what we're sending to n8n (which forwards to beehiiv)
    console.log('📧 Sending to n8n/beehiiv:', {
      email: notificationData.email,
      beehiiv_publication_id: notificationData.beehiiv_publication_id,
      source_page: notificationData.source_page,
      utm_params: {
        utm_source: notificationData.utm_source,
        utm_medium: notificationData.utm_medium,
        utm_campaign: notificationData.utm_campaign
      }
    })

    // Build URL parameters, filtering out undefined values
    const params = new URLSearchParams()
    Object.entries(notificationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    // Send GET request to n8n webhook (as it was working before)
    const webhookUrl = `${N8N_WEBHOOK_URL}?${params.toString()}`
    
    // Log the full webhook URL for debugging
    console.log('📤 Full n8n webhook URL:', webhookUrl)
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      console.warn(`❌ n8n webhook returned status ${response.status}:`, await response.text())
      return false
    }

    console.log('✅ Successfully notified n8n webhook - should forward to beehiiv')
    console.log('🔍 Check n8n execution logs for beehiiv API response')
    return true

  } catch (error) {
    // Log error but don't throw - webhook failures shouldn't break subscriptions
    console.error('Failed to notify n8n webhook:', error)
    return false
  }
}

/**
 * Send contact form submission notification to n8n webhook
 */
export async function notifyN8nContact(contactData: {
  name: string
  email: string
  subject: string
  message: string
  source_page?: string
  source_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  browser?: string
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  referrer_url?: string
}): Promise<boolean> {
  // Skip if webhook URL not configured
  if (!N8N_WEBHOOK_URL) {
    console.log('n8n webhook URL not configured, skipping contact notification')
    return true
  }

  try {
    // Prepare webhook notification data for contact form
    const notificationData = {
      event: 'contact_form_submission',
      name: contactData.name,
      email: contactData.email,
      subject: contactData.subject,
      message: contactData.message.substring(0, 500), // Limit message length for URL
      timestamp: new Date().toISOString(),
      source_page: contactData.source_page || 'contact',
      source_url: contactData.source_url,
      utm_source: contactData.utm_source,
      utm_medium: contactData.utm_medium,
      utm_campaign: contactData.utm_campaign,
      utm_term: contactData.utm_term,
      utm_content: contactData.utm_content,
      browser: contactData.browser,
      device_type: contactData.device_type,
      referrer_url: contactData.referrer_url
    }

    // Send POST request to n8n webhook with no-cors mode to bypass CORS
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // This bypasses CORS checks
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      console.warn(`n8n contact webhook returned status ${response.status}:`, await response.text())
      return false
    }

    console.log('Successfully notified n8n of contact form submission')
    return true

  } catch (error) {
    // Log error but don't throw - webhook failures shouldn't break contact submissions
    console.error('Failed to notify n8n contact webhook:', error)
    return false
  }
}

/**
 * Test the n8n webhook connection
 * Useful for debugging and setup verification
 */
export async function testN8nWebhook(): Promise<boolean> {
  const testData: WebhookNotificationData = {
    event: 'test_connection',
    email: 'test@dailyhush.com',
    timestamp: new Date().toISOString(),
    source_page: 'webhook_test',
    source_url: 'https://dailyhush.com/webhook-test',
    utm_source: 'test',
    browser: 'test_browser',
    device_type: 'desktop'
  }

  return await notifyN8nSubscription(testData)
}