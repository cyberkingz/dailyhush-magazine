import type { Handler } from '@netlify/functions'

// Beehiiv API credentials
const BEEHIIV_API_KEY = process.env.VITE_BEEHIIV_API || 'FKsKmlKu8djPv4hxsv3KPendj9ry7HKySQycpGTnKN6XRwmtoms1o55qkO4DZSba'
const BEEHIIV_PUBLICATION_ID = process.env.VITE_BEEHIIV_PUBLICATION_ID || 'pub_1b81dc77-29e4-4eaf-9256-ccc5502e0121'

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    
    if (!body.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Email is required' }),
      }
    }

    // Call beehiiv API with snake_case fields
    const beehiivResponse = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({
          email: body.email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: body.utm_source || '',
          utm_medium: body.utm_medium || '', 
          utm_campaign: body.utm_campaign || '',
          referring_site: body.source_page || body.referring_site || ''
        }),
      }
    )

    const responseData = await beehiivResponse.json()

    if (beehiivResponse.status === 201) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Successfully subscribed!',
          data: responseData.data
        }),
      }
    }

    // Handle duplicate subscriber
    if (beehiivResponse.status === 409) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Already subscribed',
          data: responseData
        }),
      }
    }

    return {
      statusCode: beehiivResponse.status,
      headers,
      body: JSON.stringify({
        success: false,
        error: responseData.message || 'Failed to subscribe',
        details: responseData
      }),
    }

  } catch (error) {
    console.error('Beehiiv subscription error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
    }
  }
}