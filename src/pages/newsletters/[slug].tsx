import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getNewsletterBySlug } from '@/content/newsletters'
import { ArrowLeft, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import { NewsletterHeader, AuthorBio, NewsletterNavigation } from '@/components/newsletter'

export default function NewsletterEdition() {
  const { slug } = useParams()
  const edition = slug ? getNewsletterBySlug(slug) : undefined

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
        { property: 'og:url', content: `${window.location.origin}/newsletters/${edition.slug}` },
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

  const handleShare = async () => {
    if (navigator.share && edition) {
      try {
        await navigator.share({
          title: edition.title,
          text: edition.summary,
          url: window.location.href,
        })
      } catch (err) {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (!edition) {
    return (
      <main className="container-prose py-10">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Edition Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn't find that newsletter edition. It may have been moved or doesn't exist.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as="link"
              to="/newsletters"
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Browse All Editions
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
      <NewsletterHeader edition={edition} onShare={handleShare} />

      {/* Newsletter Content */}
      <div className="max-w-4xl mx-auto px-6">
        <article 
          className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900" 
          dangerouslySetInnerHTML={{ __html: edition.contentHtml }} 
        />

        <AuthorBio />

        <NewsletterNavigation onShare={handleShare} />
      </div>
    </main>
  )
}

