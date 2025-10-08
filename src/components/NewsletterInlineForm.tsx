import { useState, useEffect, useRef, type FormEvent } from 'react'
import { createLead, getCurrentTrackingContext } from '@/lib/services/leads'
import { trackNewsletterSignup } from '@/lib/utils/analytics'
import type { LeadSubmissionResponse } from '@/lib/types/leads'

declare global {
  interface Window {
    SparkLoop?: any
    SL?: any
    fbq?: (action: string, event: string, params?: Record<string, any>) => void
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
  onSuccess?: () => void
}

export default function NewsletterInlineForm({
  placeholder = 'you@example.com',
  buttonLabel = 'Subscribe',
  sourcePage,
  className = '',
  redirectOnSuccess = true,
  redirectTo = '/subscriptions/thank-you',
  showSparkLoop = false,
  onSuccess
}: Props) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<LeadSubmissionResponse | null>(null)
  const [waitingForSparkLoop, setWaitingForSparkLoop] = useState(false)
  const emailForRedirect = useRef('')

  useEffect(() => {
    if (!waitingForSparkLoop || !showSparkLoop) return

    let modalDetected = false
    let hasRedirected = false

    const redirectNow = () => {
      if (hasRedirected) return
      hasRedirected = true
      console.log('🚀 Redirecting to thank you page...')
      window.location.assign(`${redirectTo}?email=${encodeURIComponent(emailForRedirect.current)}`)
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
  }, [waitingForSparkLoop, showSparkLoop, redirectTo])

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
          // Show SparkLoop Upscribe inline - it will auto-close after submission
          setResponse({ success: true, message: 'Thanks for subscribing! Looking for more great newsletters?' })
          // Start watching for modal to close
          setWaitingForSparkLoop(true)
        } else if (redirectOnSuccess) {
          // Traditional redirect flow
          const next = `${redirectTo}?email=${encodeURIComponent(email)}`
          setTimeout(() => { window.location.assign(next) }, 150)
        } else {
          setResponse(res)
        }
        setEmail('')

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }
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
          className="border border-emerald-200/40 px-5 py-3 rounded-full w-full bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-emerald-900 placeholder-emerald-600/60 disabled:opacity-50 disabled:cursor-not-allowed ring-1 ring-white/20 shadow-[0_4px_16px_rgba(16,185,129,0.06)]"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 sm:px-10 py-3 rounded-full transition-all shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 w-full sm:w-auto sm:min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
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
