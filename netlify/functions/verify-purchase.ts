import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  // Only accept GET
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const sessionId = event.queryStringParameters?.session_id
    
    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Session ID required' 
        }),
      }
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent'],
    })

    // Verify the session is for our product and was successful
    const isValidPurchase = 
      session.payment_status === 'paid' &&
      session.metadata?.product === 'fire_starter_kit'

    if (!isValidPurchase) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid or unpaid session' 
        }),
      }
    }

    // Return purchase details for access
    const purchaseInfo = {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      paymentStatus: session.payment_status,
      amountPaid: session.amount_total,
      currency: session.currency,
      purchaseDate: new Date(session.created * 1000).toISOString(),
      accessGranted: true,
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        purchase: purchaseInfo,
        resources: {
          notionWorkspace: process.env.FIRE_STARTER_NOTION_TEMPLATE_URL || '#',
          communityAccess: `${process.env.SITE_URL}/fire-starter/community?session=${sessionId}`,
          supportEmail: process.env.SUPPORT_EMAIL || 'hello@daily-hush.com',
        }
      }),
    }

  } catch (error) {
    console.error('Purchase verification error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to verify purchase',
      }),
    }
  }
}