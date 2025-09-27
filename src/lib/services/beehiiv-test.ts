/**
 * Test helper for beehiiv integration
 * This file helps debug the beehiiv API integration
 */

// Get environment variables
const BEEHIIV_API_KEY = import.meta.env.VITE_BEEHIIV_API
const BEEHIIV_PUBLICATION_ID = import.meta.env.VITE_BEEHIIV_PUBLICATION_ID

/**
 * Test beehiiv configuration and display in console
 */
export function checkBeehiivConfig(): void {
  console.group('🐝 Beehiiv Configuration Check')
  
  if (!BEEHIIV_API_KEY) {
    console.error('❌ VITE_BEEHIIV_API not configured in .env.local')
  } else {
    console.log('✅ API Key configured:', `${BEEHIIV_API_KEY.substring(0, 10)}...`)
  }
  
  if (!BEEHIIV_PUBLICATION_ID) {
    console.error('❌ VITE_BEEHIIV_PUBLICATION_ID not configured in .env.local')
  } else {
    console.log('✅ Publication ID:', BEEHIIV_PUBLICATION_ID)
  }
  
  console.log('📝 Expected n8n workflow steps:')
  console.log('1. Receive webhook with email and beehiiv_publication_id')
  console.log('2. Make POST request to: https://api.beehiiv.com/v2/publications/{publication_id}/subscriptions')
  console.log('3. Include Authorization header: Bearer YOUR_BEEHIIV_API_KEY')
  console.log('4. Send JSON body with email and other fields')
  
  console.groupEnd()
}

/**
 * Display what data is being sent to n8n
 */
export function logBeehiivData(email: string, data: any): void {
  console.group('📧 Beehiiv Subscription Data')
  console.log('Email:', email)
  console.log('Publication ID:', BEEHIIV_PUBLICATION_ID)
  console.log('Full data sent to n8n:', data)
  
  console.log('\n🔧 n8n should call beehiiv API:')
  console.log(`POST https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`)
  console.log('Body:', JSON.stringify({
    email: email,
    reactivate_existing: false,
    send_welcome_email: true,
    utm_source: data.utm_source,
    utm_medium: data.utm_medium,
    utm_campaign: data.utm_campaign,
    referring_site: data.source_page
  }, null, 2))
  
  console.groupEnd()
}

// Auto-run config check in development
if (import.meta.env.DEV) {
  console.log('💡 Run checkBeehiivConfig() in console to verify beehiiv setup')
}