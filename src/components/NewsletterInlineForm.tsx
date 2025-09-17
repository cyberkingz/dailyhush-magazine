import { useState, useEffect, type FormEvent } from 'react'
import { createLead, getCurrentTrackingContext } from '@/lib/services/leads'
import { trackNewsletterSignup } from '@/lib/utils/analytics'
import type { LeadSubmissionResponse } from '@/lib/types/leads'

declare global {
  interface Window {
    SparkLoop?: any
    SL?: any
  }
}

type Props = {
  placeholder?: string
  buttonLabel?: string
  sourcePage?: string
  className?: string
  redirectOnSuccess?: boolean
  redirectTo?: string
  showSparkLoop?: boolean
}

export default function NewsletterInlineForm({
  placeholder = 'you@example.com',
  buttonLabel = 'Subscribe',
  sourcePage,
  className = '',
  redirectOnSuccess = true,
  redirectTo = '/subscriptions/thank-you',
  showSparkLoop = false
}: Props) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<LeadSubmissionResponse | null>(null)

  // Function to trigger SparkLoop Upscribe
  const triggerSparkLoop = (subscriberEmail: string) => {
    const upscribeId = import.meta.env.VITE_SPARKLOOP_UPSCRIBE_ID as string | undefined
    
    if (!upscribeId) {
      console.log('SparkLoop Upscribe ID not configured')
      return
    }

    let tries = 0
    const maxTries = 20
    const interval = window.setInterval(() => {
      const sl = window.SparkLoop || (window as any).SL
      
      if (!sl) {
        if (++tries >= maxTries) {
          console.log('SparkLoop not available after max tries')
          window.clearInterval(interval)
        }
        return
      }

      try {
        // Track the subscriber first
        if (typeof sl.trackSubscriber === 'function') {
          sl.trackSubscriber(subscriberEmail)
        }
        
        // Show Upscribe popup
        const gen = sl.generate || sl
        if (gen && typeof gen.upscribePopup === 'function') {
          console.log('Triggering SparkLoop Upscribe for:', subscriberEmail)
          gen.upscribePopup(upscribeId, subscriberEmail)
          window.clearInterval(interval)
          return
        }
      } catch (error) {
        console.error('SparkLoop error:', error)
      }

      if (++tries >= maxTries) {
        console.log('SparkLoop trigger failed after max tries')
        window.clearInterval(interval)
      }
    }, 200)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSubmitting(true)
    setResponse(null)

    try {
      const baseCtx = getCurrentTrackingContext()
      const ctx = sourcePage ? { ...baseCtx, source_page: sourcePage } : baseCtx
      const res = await createLead(email, ctx)
      if (res.success) {
        trackNewsletterSignup('inline', email)
        
        if (showSparkLoop) {
          // Show SparkLoop Upscribe instead of redirecting
          setResponse({ success: true, message: 'Thanks for subscribing! Looking for more great newsletters?' })
          setTimeout(() => triggerSparkLoop(email), 300)
        } else if (redirectOnSuccess) {
          // Traditional redirect flow
          const next = `${redirectTo}?email=${encodeURIComponent(email)}`
          setTimeout(() => { window.location.assign(next) }, 150)
        } else {
          setResponse(res)
        }
        setEmail('')
      } else {
        setResponse(res)
      }
    } catch (err) {
      console.error(err)
      setResponse({ success: false, message: 'Please try again.', error: 'network_error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="border border-gray-300 px-5 py-3 rounded-full w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="bg-yellow-400 text-black font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z" />
              </svg>
              Subscribing...
            </>
          ) : (
            buttonLabel
          )}
        </button>
      </form>
      {response && (
        <p className={`mt-3 text-sm ${response.success ? 'text-green-700' : 'text-red-600'}`}>
          {response.message}
        </p>
      )}
    </div>
  )
}
