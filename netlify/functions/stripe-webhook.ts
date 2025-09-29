import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const handler: Handler = async (event) => {
  // Handle webhook verification and processing
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const sig = event.headers['stripe-signature']
  let stripeEvent: Stripe.Event

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(event.body!, sig!, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    }
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        
        // Verify this is our F.I.R.E. STARTER KIT purchase
        if (session.metadata?.product === 'fire_starter_kit') {
          await handleFireStarterKitPurchase(session)
        }
        break
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
        
        if (paymentIntent.metadata?.product === 'fire_starter_kit') {
          console.log('F.I.R.E. STARTER KIT payment succeeded:', paymentIntent.id)
          // Additional payment success handling if needed
        }
        break
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' }),
    }
  }
}

async function handleFireStarterKitPurchase(session: Stripe.Checkout.Session) {
  try {
    console.log('Processing F.I.R.E. STARTER KIT purchase:', session.id)
    
    // Get customer details
    const customer = session.customer 
      ? await stripe.customers.retrieve(session.customer as string)
      : null
    
    const customerEmail = session.customer_details?.email || 
      (customer && 'email' in customer ? customer.email : null)
    
    if (!customerEmail) {
      console.error('No customer email found for session:', session.id)
      return
    }

    // Here you would integrate with your product delivery system
    // For now, we'll log the successful purchase and prepare for Notion workspace delivery
    
    const purchaseData = {
      sessionId: session.id,
      customerEmail: customerEmail,
      amount: session.amount_total,
      currency: session.currency,
      paymentStatus: session.payment_status,
      utmSource: session.metadata?.utm_source || '',
      utmMedium: session.metadata?.utm_medium || '',
      utmCampaign: session.metadata?.utm_campaign || '',
      purchaseDate: new Date().toISOString(),
    }
    
    console.log('F.I.R.E. STARTER KIT purchase completed:', purchaseData)
    
    // TODO: Implement product delivery logic here
    // - Send welcome email with Notion workspace access
    // - Create/duplicate Notion workspace template
    // - Add customer to exclusive community/resources
    // - Trigger any follow-up sequences
    
    // For immediate implementation, you could:
    // 1. Send email via your email service (Beehiiv, SendGrid, etc.)
    // 2. Store purchase record in your database
    // 3. Grant access to digital resources
    
    await sendFireStarterKitDeliveryEmail(customerEmail, purchaseData)
    
  } catch (error) {
    console.error('Error handling F.I.R.E. STARTER KIT purchase:', error)
    throw error
  }
}

async function sendFireStarterKitDeliveryEmail(email: string, purchaseData: any) {
  // This is a placeholder for email delivery
  // Replace with your actual email service integration
  
  console.log(`Sending F.I.R.E. STARTER KIT to ${email}:`, purchaseData)
  
  // Example email data that would be sent:
  const emailData = {
    to: email,
    subject: '🔥 Your F.I.R.E. STARTER KIT is ready!',
    templateId: 'fire-starter-kit-delivery',
    variables: {
      customerEmail: email,
      sessionId: purchaseData.sessionId,
      accessLink: `${process.env.SITE_URL}/fire-starter/access?session=${purchaseData.sessionId}`,
      notionWorkspaceLink: process.env.FIRE_STARTER_NOTION_TEMPLATE_URL || '#',
      supportEmail: process.env.SUPPORT_EMAIL || 'hello@daily-hush.com',
    }
  }
  
  // TODO: Implement actual email sending
  // await emailService.send(emailData)
  
  return emailData
}