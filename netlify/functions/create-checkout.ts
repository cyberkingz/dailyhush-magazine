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
    console.log('Checkout function called with method:', event.httpMethod)
    console.log('Environment check - STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('Environment check - STRIPE_FIRE_STARTER_PRICE_ID:', process.env.STRIPE_FIRE_STARTER_PRICE_ID)
    console.log('Environment check - SITE_URL:', process.env.SITE_URL)
    
    const body = JSON.parse(event.body || '{}')
    const { email, utm_source, utm_medium, utm_campaign } = body
    console.log('Parsed request body:', { email, utm_source, utm_medium, utm_campaign })

    // Create or get customer
    let customer
    if (email) {
      const existingCustomers = await stripe.customers.list({
        email: email,
        limit: 1,
      })
      
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: email,
          metadata: {
            utm_source: utm_source || '',
            utm_medium: utm_medium || '',
            utm_campaign: utm_campaign || '',
          },
        })
      }
    }

    // Validate required environment variables
    if (!process.env.STRIPE_FIRE_STARTER_PRICE_ID) {
      throw new Error('STRIPE_FIRE_STARTER_PRICE_ID environment variable is missing')
    }

    console.log('Creating checkout session...')
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_FIRE_STARTER_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer: customer?.id,
      customer_creation: customer ? undefined : 'always',
      customer_email: customer ? undefined : email,
      customer_update: {
        address: 'auto'
      },
      success_url: `${process.env.SITE_URL || 'https://daily-hush.com'}/fire-starter/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL || 'https://daily-hush.com'}/ship48?cancelled=true`,
      automatic_tax: { enabled: true },
      payment_intent_data: {
        setup_future_usage: 'off_session', // Save payment method for future use
        metadata: {
          product: 'fire_starter_kit',
          utm_source: utm_source || '',
          utm_medium: utm_medium || '',
          utm_campaign: utm_campaign || '',
        },
      },
      metadata: {
        product: 'fire_starter_kit',
        utm_source: utm_source || '',
        utm_medium: utm_medium || '',
        utm_campaign: utm_campaign || '',
      },
    })

    console.log('Checkout session created successfully:', session.id)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url: session.url,
        session_id: session.id,
      }),
    }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: error instanceof Error ? error.constructor.name : typeof error
    })
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create checkout session',
      }),
    }
  }
}