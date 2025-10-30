import { Link } from 'react-router-dom'
import { PostCard } from '@/components/blog/PostCard'
import type { HomeBlogPost } from '@/data/homeBlogPosts'

type HomeBlogSectionProps = {
  posts: HomeBlogPost[]
  eyebrow?: string
  heading?: string
  description?: string
}

export function HomeBlogSection({
  posts,
  eyebrow = 'DailyHush Research',
  heading = 'Latest Research on Overthinking, Rumination & Loop Types',
  description = 'Evidence-based articles on anxiety, overthinking, and the DailyHush method—written to help you understand your patterns and find relief.',
}: HomeBlogSectionProps) {

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/60 to-amber-50/40"
      aria-labelledby="home-blog-heading"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 right-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {eyebrow}
          </p>
          <h2 id="home-blog-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-900">
            {heading}
          </h2>
          <p className="mt-4 text-base md:text-lg text-emerald-800/80 leading-relaxed">
            {description}
          </p>
        </header>

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-6 py-3 text-sm font-semibold text-emerald-800 backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Explore All Articles
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
