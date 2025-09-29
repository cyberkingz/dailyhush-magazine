import { useState, useEffect, type FormEvent } from 'react'
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
  const [shouldRedirectAfterSparkLoop, setShouldRedirectAfterSparkLoop] = useState(false)
  const isArticle = variant === 'article'
  
  useEffect(() => {
    if (shouldRedirectAfterSparkLoop && showSparkLoop) {
      console.log('Setting up SparkLoop modal detection...')
      let modalDetected = false
      let observer: MutationObserver | null = null
      
      const redirectToThankYou = () => {
        console.log('Redirecting to thank you page...')
        window.location.assign(`/subscriptions/thank-you?email=${encodeURIComponent(email)}`)
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
        
        // If modal was detected but is now gone
        if (modalDetected && !hasSparkLoopElements) {
          console.log('SparkLoop no longer detected, redirecting...')
          clearInterval(intervalCheck)
          observer?.disconnect()
          redirectToThankYou()
        }
        
        // Fallback: redirect after 5 seconds if no modal detected
        if (!modalDetected && checkCount > 10) {
          console.log('No SparkLoop modal detected after 5 seconds, redirecting...')
          clearInterval(intervalCheck)
          observer?.disconnect()
          redirectToThankYou()
        }
      }, 500)
      
      // Ultimate fallback: redirect after 30 seconds
      const timeout = setTimeout(() => {
        console.log('Timeout reached, forcing redirect...')
        clearInterval(intervalCheck)
        observer?.disconnect()
        redirectToThankYou()
      }, 30000)
      
      return () => {
        clearInterval(intervalCheck)
        clearTimeout(timeout)
        observer?.disconnect()
      }
    }
  }, [shouldRedirectAfterSparkLoop, showSparkLoop, email])
  
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
        
        if (showSparkLoop) {
          // Show success message and set up redirect after SparkLoop closes
          setResponse({ success: true, message: 'Thanks for subscribing! Looking for more great newsletters?' })
          setShouldRedirectAfterSparkLoop(true)
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
