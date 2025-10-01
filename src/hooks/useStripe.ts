import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe (you'll need to add VITE_STRIPE_PUBLISHABLE_KEY to your env)
console.log('Stripe publishable key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Found' : 'Missing')
console.log('Loading Stripe.js...')
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').then(stripe => {
  console.log('Stripe.js loaded:', !!stripe)
  return stripe
}).catch(error => {
  console.error('Failed to load Stripe.js:', error)
  throw error
})

interface CheckoutData {
  email?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export function useStripe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFireStarterCheckout = async (data: CheckoutData = {}) => {
    setLoading(true)
    setError(null)

    try {
      // Create checkout session
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const responseText = await response.text()
      if (!responseText) {
        throw new Error('Empty response from checkout service')
      }

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse response:', responseText)
        throw new Error('Invalid response format from checkout service')
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // Redirect to checkout
      window.location.href = result.url

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      console.error('Stripe checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  const verifyPurchase = async (sessionId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/.netlify/functions/verify-purchase?session_id=${sessionId}`)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to verify purchase')
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify purchase'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createCoachingCheckout = async (originalSessionId: string) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Processing one-click coaching upsell for session:', originalSessionId)

      const response = await fetch('/.netlify/functions/create-coaching-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalSessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || result.error || 'Payment failed')
      }

      console.log('✅ One-click payment successful:', result)
      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process payment'
      setError(errorMessage)
      console.error('Coaching payment error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createFireStarterCheckout,
    createCoachingCheckout,
    verifyPurchase,
    loading,
    error,
  }
}

// Utility function to get UTM parameters from URL
export function getUtmParams() {
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
  }
}