// Analytics tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'get',
      targetId: string,
      config?: {
        event_category?: string
        event_label?: string
        value?: number
        [key: string]: any
      }
    ) => void
  }
}

// Track newsletter signup event
export function trackNewsletterSignup(variant: string, email?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'newsletter_signup', {
        event_category: 'engagement',
        event_label: variant,
        value: 1
      })
    }
    
    // You can add other analytics services here
    // For example, Facebook Pixel, Mixpanel, etc.
    
  } catch (error) {
    console.error('Error tracking newsletter signup:', error)
  }
}

// Track lead source and attribution
export function trackLeadAttribution(source: string, campaign?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_attribution', {
        event_category: 'lead_tracking',
        event_label: source,
        campaign: campaign,
        value: 1
      })
    }
  } catch (error) {
    console.error('Error tracking lead attribution:', error)
  }
}

// Track page view for lead attribution
export function trackPageView(page: string, title?: string) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        event_category: 'navigation',
        event_label: page,
        page_title: title,
        page_location: window.location.href
      })
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}