import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import { PostCard } from '@/components/blog/PostCard'
import { blogArticlesList, blogSlugAliases, getBlogArticle } from '@/content/blog/articles'
import type { BlogArticle } from '@/content/blog/articles'


// Default content for any slug not in our content map
const defaultContent: BlogArticle = {
  title: 'Article Not Found',
  excerpt: 'The article you\'re looking for is coming soon.',
  category: 'General',
  author: 'DailyHush Team',
  date: 'Jan 2025',
  readTime: '5 min read',
  imageUrl: 'https://images.unsplash.com/photo-1468779036391-52341f60b55d?auto=format&fit=crop&w=1600&h=900&q=80',
  content: `
    <p>We're working on bringing you this content. In the meantime, check out our other articles for daily insights on wellness, beauty, and technology.</p>
    <p>Our team of writers is constantly creating new content to keep you informed and inspired. Subscribe to our newsletter to be the first to know when new articles are published.</p>
  `
}

export default function BlogDetail() {
  const { slug } = useParams()
  const canonicalSlug = slug ? (blogSlugAliases[slug] ?? slug) : undefined
  const article = canonicalSlug ? (getBlogArticle(canonicalSlug) || { ...defaultContent, title: `Article: ${slug}` }) : defaultContent
  const relatedArticles = blogArticlesList.filter((item) => item.slug !== canonicalSlug).slice(0, 3)
  const showQuizCTA = true
  const showNewsletterCTA = !showQuizCTA

  useEffect(() => {
    document.title = `${article.title} — DailyHush`
    window.scrollTo(0, 0)
  }, [article.title])

  return (
    <>
      {/* Article Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to articles
          </Link>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span className="uppercase tracking-wide font-semibold text-yellow-600">{article.category}</span>
            <span className="text-gray-400">•</span>
            <span>{article.date}</span>
            <span className="text-gray-400">•</span>
            <span>{article.readTime}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">{article.author}</p>
                <p className="text-sm text-gray-600">Contributing Writer</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-2xl overflow-hidden bg-gray-100">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-4xl px-6 py-12">
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-ul:text-gray-700 prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Quiz CTA */}
      <section className="bg-emerald-50/70 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border border-emerald-100 bg-white/70 p-10 shadow-[0_12px_40px_rgba(16,185,129,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Break the Loop</p>
                <h2 className="mt-2 text-2xl font-bold text-emerald-900 md:text-3xl">
                  Diagnose your loop and get your F.I.R.E. reset.
                </h2>
                <p className="mt-3 text-sm text-emerald-800 md:text-base">
                  The DailyHush Quiz maps your overthinking pattern in 60 seconds and sends the exact protocol to interrupt it.
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  to="/quiz"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-[0_8px_24px_rgba(245,158,11,0.35)] transition hover:-translate-y-0.5 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                  Take the Quiz →
                </Link>
                <p className="mt-2 text-xs text-emerald-700/80">
                  No cost. Instant results. Works before meditation does.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showNewsletterCTA && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <NewsletterCTA variant="article" centered />
          </div>
        </section>
      )}

      {/* Related Articles */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More stories you might like</h2>
          {relatedArticles.length ? (
            <div className="grid gap-8 md:grid-cols-3">
              {relatedArticles.map((related) => (
                <PostCard
                  key={related.slug}
                  title={related.title}
                  excerpt={related.excerpt}
                  category={related.category}
                  author={related.author}
                  date={related.date}
                  readTime={related.readTime}
                  imageUrl={related.imageUrl}
                  slug={related.slug}
                  keywords={related.keywords}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center text-sm text-emerald-700/80">
              More DailyHush stories are on the way. Explore the full archive while we finish this loop.
            </div>
          )}
        </div>
      </section>
    </>
  )
}
