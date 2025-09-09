import { useState, type FormEvent } from 'react'
import { createLead } from '../lib/services/leads'
import { trackNewsletterSignup } from '../lib/utils/analytics'
import type { LeadSubmissionResponse } from '../lib/types/leads'

type NewsletterCTAProps = {
  variant?: 'default' | 'article'
  centered?: boolean
}

export function NewsletterCTA({ variant = 'default', centered = false }: NewsletterCTAProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [response, setResponse] = useState<LeadSubmissionResponse | null>(null)
  const isArticle = variant === 'article'
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email.trim()) return
    
    setIsSubmitting(true)
    setResponse(null)
    
    try {
      const result = await createLead(email)
      setResponse(result)
      
      if (result.success) {
        setEmail('')
        // Track successful subscription
        trackNewsletterSignup(variant, email)
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
  
  // Show success message
  if (response && response.success) {
    return (
      <div className={`rounded-2xl p-8 md:p-10 bg-green-50 border border-green-200 ${centered ? 'text-center' : ''}`}>
        <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Welcome aboard!
          </h2>
          <p className="text-base md:text-lg text-gray-600 mt-2 md:mt-3">
            {response.message}
          </p>
          <button
            onClick={() => setResponse(null)}
            className="mt-6 text-green-600 hover:text-green-700 font-medium"
          >
            Subscribe another email →
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`rounded-2xl p-8 md:p-10 bg-yellow-50 border border-yellow-200 ${centered ? 'text-center' : ''}`}>
      <div className={centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {isArticle ? 'Enjoyed this article?' : 'Stay in the loop'}
        </h2>
        <p className="text-base md:text-lg text-gray-600 mt-2 md:mt-3">
          {isArticle 
            ? 'Get more insights delivered to your inbox weekly.'
            : 'Subscribe to our newsletter for weekly insights.'}
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
            className="bg-yellow-400 text-black font-semibold px-6 sm:px-8 py-3 rounded-full hover:bg-yellow-300 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        
        <p className="text-sm text-gray-500 mt-4">
          Join 10,000+ readers. No spam, unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}