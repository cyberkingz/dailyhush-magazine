import type { Lead } from '../types/leads'

// n8n webhook configuration
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL

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
      referrer_url: leadData.referrer_url
    }

    // Build URL parameters, filtering out undefined values
    const params = new URLSearchParams()
    Object.entries(notificationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    // Send GET request to n8n webhook
    const webhookUrl = `${N8N_WEBHOOK_URL}?${params.toString()}`
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(5000)
    })

    if (!response.ok) {
      console.warn(`n8n webhook returned status ${response.status}:`, await response.text())
      return false
    }

    console.log('Successfully notified n8n of newsletter subscription')
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

    // Build URL parameters, filtering out undefined values
    const params = new URLSearchParams()
    Object.entries(notificationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })

    // Send GET request to n8n webhook
    const webhookUrl = `${N8N_WEBHOOK_URL}?${params.toString()}`
    
    const response = await fetch(webhookUrl, {
      method: 'GET',
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