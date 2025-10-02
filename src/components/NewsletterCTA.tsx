import { useState, useEffect, useRef, type FormEvent } from 'react'
import { createLead } from '../lib/services/leads'
import { trackNewsletterSignup } from '../lib/utils/analytics'
import type { LeadSubmissionResponse } from '../lib/types/leads'

declare global {
  interface Window {
    SparkLoop?: any
    SL?: any
  }
}

type NewsletterCTAProps = {
  variant?: 'default' | 'article'
  centered?: boolean
  showSparkLoop?: boolean
  redirectOnSuccess?: boolean
}

export function NewsletterCTA({
  variant = 'default',
  centered = false,
  showSparkLoop = false,
  redirectOnSuccess = true
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<LeadSubmissionResponse | null>(null)
  const [waitingForSparkLoop, setWaitingForSparkLoop] = useState(false)
  const emailForRedirect = useRef('')
  const isArticle = variant === 'article'

  useEffect(() => {
    if (!waitingForSparkLoop || !showSparkLoop) return

    let modalDetected = false
    let hasRedirected = false

    const redirectNow = () => {
      if (hasRedirected) return
      hasRedirected = true
      console.log('🚀 Redirecting to thank you page...')
      window.location.assign(`/subscriptions/thank-you?email=${encodeURIComponent(emailForRedirect.current)}`)
    }

    // MutationObserver detects DOM changes instantly
    const observer = new MutationObserver(() => {
      // Check if modal is visible (not just present in DOM)
      const sparkloopEl = document.querySelector('[id*="sparkloop"]') as HTMLElement
      const upscribeEl = document.querySelector('[class*="upscribe"]') as HTMLElement
      const iframe = document.querySelector('iframe[src*="sparkloop"]') as HTMLElement
      const bodyHasModalClass = document.body.classList.contains('sl-modal-open')

      // Modal is "visible" if element exists AND is displayed OR body has modal class
      const modalVisible = bodyHasModalClass ||
                          !!(sparkloopEl && sparkloopEl.offsetParent !== null) ||
                          !!(upscribeEl && upscribeEl.offsetParent !== null) ||
                          !!(iframe && iframe.offsetParent !== null)

      console.log('🔍 Modal check:', {
        modalVisible,
        modalDetected,
        bodyHasModalClass,
        sparkloopVisible: sparkloopEl ? sparkloopEl.offsetParent !== null : false,
        upscribeVisible: upscribeEl ? upscribeEl.offsetParent !== null : false,
        iframeVisible: iframe ? iframe.offsetParent !== null : false
      })

      if (modalVisible && !modalDetected) {
        modalDetected = true
        console.log('✅ SparkLoop modal OPENED - detected!')
        // Cancel early redirect since modal appeared
        clearTimeout(earlyRedirectTimeout)
      } else if (!modalVisible && modalDetected) {
        // Modal closed (hidden) - redirect instantly
        console.log('❌ SparkLoop modal CLOSED - detected! Redirecting...')
        observer.disconnect()
        clearTimeout(earlyRedirectTimeout)
        clearTimeout(fallbackTimeout)
        redirectNow()
      }
    })

    // Watch entire document for changes (structure AND attributes)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,      // Watch for attribute changes (class, style)
      attributeFilter: ['class', 'style', 'hidden']  // Only watch relevant attributes
    })

    // Early redirect: if modal doesn't appear within 5 seconds, redirect anyway
    // This handles cases where SparkLoop doesn't load (IP location, ad blocker, etc.)
    const earlyRedirectTimeout = setTimeout(() => {
      if (!modalDetected) {
        observer.disconnect()
        console.log('⚠️ SparkLoop modal did not appear after 5s (blocked/restricted?) - redirecting now')
        clearTimeout(fallbackTimeout)
        redirectNow()
      }
    }, 5000)

    // Fallback: redirect after 30 seconds (safety net if something unexpected happens)
    const fallbackTimeout = setTimeout(() => {
      observer.disconnect()
      console.log('⏱️ Fallback timeout reached (30s) - redirecting now')
      clearTimeout(earlyRedirectTimeout)
      redirectNow()
    }, 30000)

    return () => {
      observer.disconnect()
      clearTimeout(earlyRedirectTimeout)
      clearTimeout(fallbackTimeout)
    }
  }, [waitingForSparkLoop, showSparkLoop])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim()) return

    setIsSubmitting(true)
    setResponse(null)

    try {
      const result = await createLead(email)
      setResponse(result)

      if (result.success) {
        // Track successful subscription
        trackNewsletterSignup(variant, email)

        // Fire Facebook Pixel Lead event
        if (window.fbq) {
          window.fbq('track', 'Lead', {
            content_name: '48h Launch Checklist',
            value: 0,
            currency: 'USD'
          })
        }

        // Store email for redirect before clearing form
        emailForRedirect.current = email

        if (showSparkLoop) {
          // Show SparkLoop Upscribe inline - it will auto-show after submission
          setResponse({ success: true, message: 'Thanks for subscribing! Looking for more great newsletters?' })
          // Start watching for modal to close
          setWaitingForSparkLoop(true)
        } else if (redirectOnSuccess) {
          // Traditional redirect flow to thank-you page
          const next = `/subscriptions/thank-you?email=${encodeURIComponent(email)}`
          window.location.assign(next)
        } else {
          setResponse(result)
        }
        setEmail('')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      setResponse({
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: 'network_error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // No success "card" here—redirect handles UX
  
  return (
    <div className={`rounded-2xl p-8 md:p-10 bg-yellow-50 border border-yellow-200 ${centered ? 'text-center' : ''}`}>
      <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isArticle ? 'Enjoyed this article?' : 'Stay in the loop'}
        </h2>
        <p className="text-base md:text-lg text-gray-600 mt-2 md:mt-3">
          {isArticle 
            ? 'Get more insights delivered to your inbox weekly.'
            : 'Subscribe to our newsletter for weekly insights on beauty, wellness, and tech.'}
        </p>
        
        <form onSubmit={handleSubmit} className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input 
            className="border border-gray-300 px-5 py-3 rounded-full w-full bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" 
            placeholder="you@example.com" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
          <button 
            type="submit" 
            disabled={isSubmitting || !email.trim()}
            className="bg-yellow-400 text-black font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-yellow-300 hover:text-black focus:text-black transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z"/>
                </svg>
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
        
        {/* Error message */}
        {response && !response.success && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{response.message}</p>
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-4 space-y-1">
          <p>By subscribing, you agree to receive our newsletter. You can unsubscribe at any time.</p>
          <p>
            <a href="/privacy" className="underline underline-offset-2 hover:text-gray-700">See our Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
