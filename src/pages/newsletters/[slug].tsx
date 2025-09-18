import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { getNewsletterBySlug } from '@/content/newsletters'
import { ArrowLeft, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import { NewsletterHeader, AuthorBio, NewsletterNavigation } from '@/components/newsletter'
import { FAQ } from '@/components/FAQ'
import { SubscribeModal } from '@/components/newsletter/SubscribeModal'

export default function NewsletterEdition() {
  const { slug } = useParams()
  const edition = slug ? getNewsletterBySlug(slug) : undefined
  const contentRef = useRef<HTMLDivElement>(null)
  const [autoPopupOpen, setAutoPopupOpen] = useState(false)

  // Render FAQ component if faqData exists
  useEffect(() => {
    if (edition?.faqData && contentRef.current) {
      const faqSection = contentRef.current.querySelector('#faq-section')
      if (faqSection) {
        const root = createRoot(faqSection)
        root.render(<FAQ items={edition.faqData} />)
        
        return () => {
          root.unmount()
        }
      }
    }
  }, [edition])

  // Auto-popup newsletter signup for non-email visitors
  useEffect(() => {
    // Check if user came from email
    const urlParams = new URLSearchParams(window.location.search)
    const fromEmail = urlParams.get('from_email') === 'true'
    
    if (fromEmail) {
      return // Don't show popup for email subscribers
    }
    
    // Check if popup was already shown today
    const today = new Date().toDateString()
    const lastShown = localStorage.getItem('newsletter-popup-shown')
    
    if (lastShown === today) {
      return // Don't show again today
    }
    
    let hasTriggered = false
    
    const handleScroll = () => {
      if (hasTriggered) return
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollTop / documentHeight) * 100
      
      if (scrollPercentage >= 12) { // 12% scroll threshold
        hasTriggered = true
        setAutoPopupOpen(true)
        localStorage.setItem('newsletter-popup-shown', today)
        window.removeEventListener('scroll', handleScroll)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Set meta tags for SEO and social sharing
  useEffect(() => {
    if (edition) {
      // Update document title
      document.title = `${edition.title} | DailyHush Newsletter`
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', edition.summary)
      } else {
        const meta = document.createElement('meta')
        meta.name = 'description'
        meta.content = edition.summary
        document.head.appendChild(meta)
      }

      // Add Open Graph tags
      const ogTags = [
        { property: 'og:title', content: edition.title },
        { property: 'og:description', content: edition.summary },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: `${window.location.origin}/newsletter/${edition.slug}` },
        { property: 'og:image', content: edition.heroImage || '' },
        { property: 'article:published_time', content: edition.date },
        { property: 'article:author', content: 'DailyHush Editorial Team' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: edition.title },
        { name: 'twitter:description', content: edition.summary },
        { name: 'twitter:image', content: edition.heroImage || '' }
      ]

      ogTags.forEach(tag => {
        const existing = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`)
        if (existing) {
          existing.setAttribute('content', tag.content)
        } else {
          const meta = document.createElement('meta')
          if (tag.property) {
            meta.setAttribute('property', tag.property)
          } else if (tag.name) {
            meta.setAttribute('name', tag.name)
          }
          meta.content = tag.content
          document.head.appendChild(meta)
        }
      })
    }
  }, [edition])

  // Sharing controls removed

  if (!edition) {
    return (
      <main className="container-prose py-10">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Edition Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find that newsletter edition. It may have been moved or doesn't exist.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as="link"
              to="/"
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Latest Editions
            </Button>
            <Button
              as="link"
              to="/newsletter"
              variant="outline"
              size="md"
              leftIcon={<Mail className="w-4 h-4" />}
            >
              Subscribe Instead
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-10">
      <NewsletterHeader edition={edition} />

      {/* Newsletter Content */}
      <div className="max-w-4xl mx-auto px-6" ref={contentRef}>
        <article 
          className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900" 
          dangerouslySetInnerHTML={{ __html: edition.contentHtml }} 
        />

        <AuthorBio />

        <NewsletterNavigation />
      </div>
      
      {/* Auto-popup modal for non-email visitors */}
      <SubscribeModal 
        open={autoPopupOpen} 
        onClose={() => setAutoPopupOpen(false)}
        sourcePage="newsletter-auto-popup"
      />
    </main>
  )
}
