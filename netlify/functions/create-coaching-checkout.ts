import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil' as any,
})

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { originalSessionId } = JSON.parse(event.body || '{}')

    if (!originalSessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Original session ID is required' }),
      }
    }

    console.log('Processing one-click coaching upsell for session:', originalSessionId)

    // 1. Retrieve the original checkout session
    const originalSession = await stripe.checkout.sessions.retrieve(originalSessionId, {
      expand: ['payment_intent', 'customer'],
    })

    if (!originalSession.payment_intent || typeof originalSession.payment_intent === 'string') {
      throw new Error('Original payment intent not found')
    }

    if (!originalSession.customer || typeof originalSession.customer === 'string') {
      throw new Error('Customer not found')
    }

    const customerId = typeof originalSession.customer === 'string'
      ? originalSession.customer
      : originalSession.customer.id

    const customerEmail = typeof originalSession.customer === 'string'
      ? undefined
      : originalSession.customer.email

    // 2. Get the payment method from the original payment intent
    const originalPaymentIntent = originalSession.payment_intent as Stripe.PaymentIntent
    const paymentMethodId = originalPaymentIntent.payment_method as string

    if (!paymentMethodId) {
      throw new Error('No payment method found from original purchase')
    }

    console.log('Found payment method:', paymentMethodId)
    console.log('Customer:', customerId, customerEmail)

    // 3. Fetch the coaching price to get the current amount
    const coachingPriceId = process.env.STRIPE_COACHING_CALL_PRICE_ID
    if (!coachingPriceId) {
      throw new Error('Coaching price ID not configured')
    }

    const priceObject = await stripe.prices.retrieve(coachingPriceId)
    const amount = priceObject.unit_amount || 15000 // Fallback to $150 if not set

    console.log('Coaching price amount:', amount / 100, priceObject.currency)

    // 4. Create a payment intent for the coaching call
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: priceObject.currency || 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, // Important for one-click payments
      confirm: true, // Automatically confirm the payment
      metadata: {
        product: 'coaching_call_upsell',
        original_purchase: 'fire_starter_kit',
        original_session_id: originalSessionId,
        customer_email: customerEmail || '',
      },
    })

    console.log('✅ One-click payment successful:', paymentIntent.id)
    console.log('Status:', paymentIntent.status)
    console.log('Amount:', paymentIntent.amount / 100)

    // 5. Send n8n webhook notification
    try {
      const n8nWebhookUrl = process.env.VITE_N8N_WEBHOOK_URL
      if (n8nWebhookUrl) {
        console.log('📧 Sending coaching purchase event to n8n:', { email: customerEmail, product: 'coaching_call' })

        // Prepare notification data
        const notificationData = {
          event: 'purchase',
          email: customerEmail,
          product: 'coaching_call',
          productName: 'F.I.R.E. STARTER KIT - 1-on-1 Coaching Call',
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
          originalSessionId: originalSessionId,
          timestamp: new Date().toISOString(),
        }

        // Build URL parameters (same format as F.I.R.E. STARTER KIT)
        const params = new URLSearchParams()
        Object.entries(notificationData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value))
          }
        })

        // Send GET request to n8n webhook
        const webhookUrl = `${n8nWebhookUrl}?${params.toString()}`
        const n8nResponse = await fetch(webhookUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })

        if (n8nResponse.ok) {
          console.log('✅ n8n webhook notification sent successfully')
        } else {
          console.log(`❌ n8n webhook returned status ${n8nResponse.status}`)
        }
      }
    } catch (n8nError) {
      console.error('❌ Failed to send n8n webhook:', n8nError)
      // Don't fail the payment if n8n notification fails
    }

    // 6. Return success
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      }),
    }

  } catch (error: any) {
    console.error('❌ Error processing one-click coaching upsell:', error)

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Failed to process payment',
        message: error.message,
        type: error.type || 'unknown',
      }),
    }
  }
}

export { handler }
