import type { Lead } from '../types/leads'

// Beehiiv webhook configuration
const BEEHIIV_WEBHOOK_URL = import.meta.env.VITE_BEEHIIV_WEBHOOK_URL

/**
 * Send newsletter subscription to beehiiv webhook
 * Uses POST request with form data format
 */
export async function notifyBeehiivSubscription(leadData: Partial<Lead>): Promise<boolean> {
  // Skip if webhook URL not configured
  if (!BEEHIIV_WEBHOOK_URL) {
    console.log('Beehiiv webhook URL not configured, skipping notification')
    return true
  }

  try {
    // Determine lead magnet title based on source_page
    let leadMagnetTitle = ''
    if (leadData.source_page === 'home-hero') {
      leadMagnetTitle = 'The Planning Paralysis Test'
    }

    // Prepare form data for beehiiv
    const formData = new URLSearchParams({
      email: leadData.email || '',
      utm_source: leadData.utm_source || '',
      utm_medium: leadData.utm_medium || '',
      utm_campaign: leadData.utm_campaign || '',
      utm_term: leadData.utm_term || '',
      utm_content: leadData.utm_content || '',
      referring_site: leadData.source_page || leadData.referrer_url || '',
      lead_magnet_title: leadMagnetTitle
    })

    // Log what we're sending
    console.log('📧 Sending to beehiiv webhook:', {
      email: leadData.email,
      url: BEEHIIV_WEBHOOK_URL.replace(/\/[^\/]+$/, '/...'), // Hide form ID in logs
    })

    // Send POST request to beehiiv webhook with no-cors mode
    await fetch(BEEHIIV_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Bypass CORS - beehiiv doesn't set CORS headers
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      // Add timeout
      signal: AbortSignal.timeout(5000)
    })

    // With no-cors mode, we can't check the response
    // The request is fire-and-forget
    console.log('✅ Beehiiv webhook notification sent (fire-and-forget)')
    return true

  } catch (error) {
    // Log error but don't throw - webhook failures shouldn't break subscriptions
    console.error('Failed to notify beehiiv webhook:', error)
    return false
  }
}

/**
 * Get beehiiv form ID from your publication
 * Instructions to find your form ID:
 * 1. Go to beehiiv dashboard
 * 2. Navigate to Grow > Forms
 * 3. Create or select a form
 * 4. Click "Embed"
 * 5. Copy the form URL from the embed code
 * 6. It will look like: https://embeds.beehiiv.com/forms/[FORM_ID]/subscribe
 */
export function getBeehiivFormInstructions(): void {
  console.group('🐝 How to get your Beehiiv Form URL')
  console.log('1. Log into beehiiv.com')
  console.log('2. Go to Grow → Forms')
  console.log('3. Create a new form or use existing')
  console.log('4. Click "Embed" button')
  console.log('5. Look for the form URL in the embed code')
  console.log('6. Copy the full URL: https://embeds.beehiiv.com/forms/YOUR_FORM_ID/subscribe')
  console.log('7. Add it to .env.local as VITE_BEEHIIV_WEBHOOK_URL')
  console.groupEnd()
}