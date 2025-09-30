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
  const [shouldRedirectAfterSparkLoop, setShouldRedirectAfterSparkLoop] = useState(false)

  useEffect(() => {
    if (shouldRedirectAfterSparkLoop && showSparkLoop) {
      console.log('Setting up SparkLoop modal detection...')
      let modalDetected = false
      let observer: MutationObserver | null = null
      
      const redirectToThankYou = () => {
        console.log('Redirecting to thank you page...', { email, redirectTo })
        const finalUrl = `${redirectTo}?email=${encodeURIComponent(email)}`
        console.log('Final redirect URL:', finalUrl)
        setEmail('') // Clear email now that we're redirecting
        window.location.assign(finalUrl)
      }
      
      // Method 1: Check for iframe removal (SparkLoop uses iframes)
      const checkForIframes = () => {
        const iframes = document.querySelectorAll('iframe[src*="sparkloop"], iframe[src*="upscribe"]')
        return iframes.length > 0
      }
      
      // Method 2: Monitor DOM mutations for SparkLoop elements
      observer = new MutationObserver((mutations) => {
        // Check if any SparkLoop-related elements were added or removed
        for (const mutation of mutations) {
          // Check added nodes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const el = node as HTMLElement
              if (el.tagName === 'IFRAME' || 
                  el.className?.includes('sparkloop') || 
                  el.id?.includes('sparkloop') ||
                  el.querySelector?.('iframe')) {
                modalDetected = true
                console.log('SparkLoop modal/iframe detected!')
              }
            }
          })
          
          // Check removed nodes  
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              const el = node as HTMLElement
              if ((el.tagName === 'IFRAME' || 
                   el.className?.includes('sparkloop') || 
                   el.id?.includes('sparkloop')) && modalDetected) {
                console.log('SparkLoop modal/iframe removed, redirecting...')
                observer?.disconnect()
                setTimeout(redirectToThankYou, 500) // Small delay to ensure cleanup
              }
            }
          })
        }
      })
      
      // Start observing the entire document for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
      
      // Method 3: Periodic check with multiple selectors
      let checkCount = 0
      const intervalCheck = setInterval(() => {
        checkCount++
        
        // Check for various possible SparkLoop elements
        const hasSparkLoopElements = 
          checkForIframes() ||
          document.querySelector('.sl-modal') !== null ||
          document.querySelector('[class*="upscribe"]') !== null ||
          document.querySelector('#sparkloop-upscribe') !== null ||
          document.body.classList.contains('sl-modal-open')
        
        // Log what we find for debugging
        if (checkCount === 1) {
          console.log('Checking for SparkLoop elements...', {
            iframes: checkForIframes(),
            bodyClass: document.body.className,
            sparkloopDivs: document.querySelectorAll('[id*="sparkloop"], [class*="sparkloop"]').length
          })
        }
        
        if (hasSparkLoopElements && !modalDetected) {
          modalDetected = true
          console.log('SparkLoop detected via interval check')
        }
        
        // Only redirect if modal was detected AND is now gone AND enough time has passed
        if (modalDetected && !hasSparkLoopElements && checkCount > 4) {
          console.log('SparkLoop no longer detected after user interaction, redirecting...')
          clearInterval(intervalCheck)
          observer?.disconnect()
          redirectToThankYou()
        }
        
        // Extended fallback: redirect after 30 seconds if no modal detected
        if (!modalDetected && checkCount > 60) {
          console.log('No SparkLoop modal detected after 30 seconds, redirecting...')
          clearInterval(intervalCheck)
          observer?.disconnect()
          redirectToThankYou()
        }
      }, 500)
      
      // Ultimate fallback: redirect after 60 seconds
      const timeout = setTimeout(() => {
        console.log('Timeout reached, forcing redirect...')
        clearInterval(intervalCheck)
        observer?.disconnect()
        redirectToThankYou()
      }, 60000)
      
      return () => {
        clearInterval(intervalCheck)
        clearTimeout(timeout)
        observer?.disconnect()
      }
    }
  }, [shouldRedirectAfterSparkLoop, showSparkLoop, email, redirectTo])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return
    console.log('Form submitted with email:', email)
    setIsSubmitting(true)
    setResponse(null)

    try {
      const baseCtx = getCurrentTrackingContext()
      const ctx = sourcePage ? { ...baseCtx, source_page: sourcePage } : baseCtx
      const res = await createLead(email, ctx)
      if (res.success) {
        trackNewsletterSignup('inline', email)
        
        // Store email value before clearing state
        const submittedEmail = email
        
        if (showSparkLoop) {
          // Show success message and set up redirect after SparkLoop closes
          setResponse({
            success: true,
            message: 'Thanks for subscribing! Redirecting...'
          })
          setShouldRedirectAfterSparkLoop(true)
          // Don't clear email yet - SparkLoop redirect needs it
        } else if (redirectOnSuccess) {
          // Traditional redirect flow
          console.log('Traditional redirect flow...', { email: submittedEmail, redirectTo })
          const next = `${redirectTo}?email=${encodeURIComponent(submittedEmail)}`
          console.log('Redirect URL:', next)
          setEmail('') // Clear email for traditional flow
          setTimeout(() => { window.location.assign(next) }, 150)
        } else {
          setResponse(res)
          setEmail('') // Clear email for non-redirect flow
        }
        
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
