import { useState, useEffect, useRef, type FormEvent } from 'react'
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

    const redirectNow = () => {
      console.log('SparkLoop modal closed, redirecting NOW...')
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
      } else if (!modalVisible && modalDetected) {
        // Modal closed (hidden) - redirect instantly
        console.log('❌ SparkLoop modal CLOSED - detected! Redirecting...')
        observer.disconnect()
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

    // Fallback: redirect after 30 seconds
    const timeout = setTimeout(() => {
      observer.disconnect()
      console.log('Timeout reached, redirecting...')
      redirectNow()
    }, 30000)

    return () => {
      observer.disconnect()
      clearTimeout(timeout)
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
