import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostCard } from '@/components/blog/PostCard'
import { blogArticlesList } from '@/content/blog/articles'

type FilterOption = 'All' | string

export default function BlogList() {
  useEffect(() => {
    document.title = 'DailyHush Blog — Stop Overthinking, Rumination & Loop Spirals'
  }, [])

  const categories = useMemo<FilterOption[]>(() => {
    const unique = Array.from(new Set(blogArticlesList.map((article) => article.category).filter(Boolean)))
    return ['All', ...unique]
  }, [])

  const intents = useMemo<FilterOption[]>(() => {
    const unique = Array.from(new Set(blogArticlesList.map((article) => article.intentLabel).filter(Boolean)))
    return unique.length ? (['All', ...unique] as FilterOption[]) : ['All']
  }, [])

  const [activeCategory, setActiveCategory] = useState<FilterOption>('All')
  const [activeIntent, setActiveIntent] = useState<FilterOption>('All')

  const filteredArticles = useMemo(() => {
    return blogArticlesList.filter((article) => {
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory
      const matchesIntent = activeIntent === 'All' || article.intentLabel === activeIntent
      return matchesCategory && matchesIntent
    })
  }, [activeCategory, activeIntent])

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/50 to-amber-50/40 py-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl"></div>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            DailyHush Insights
          </p>
          <h1 className="text-4xl font-bold text-emerald-900 sm:text-5xl">
            Break the Loop Faster with Research-Backed Articles
          </h1>
          <p className="mt-4 text-base text-emerald-800/80 md:text-lg">
            Evidence-based insights on overthinking, anxiety, and the DailyHush method.
            Study the loop science, then put your breakthroughs into action.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-emerald-700/80">
            <span className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1 font-semibold">
              {blogArticlesList.length} research-backed posts
            </span>
            <span className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1 font-semibold">
              Loop-method focused
            </span>
          </div>
        </header>

        <section className="rounded-3xl border border-white/40 bg-white/80 p-6 backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-emerald-900">Filter by topic</h2>
              <p className="text-sm text-emerald-700/80">
                Find articles by category or keyword to explore the topics that matter most to you.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                      activeCategory === category
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow'
                        : 'border-emerald-200 bg-white/70 text-emerald-700 hover:border-emerald-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {intents.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {intents.map((intent) => (
                    <button
                      key={intent}
                      onClick={() => setActiveIntent(intent)}
                      className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        activeIntent === intent
                          ? 'border-amber-500 bg-amber-500 text-white shadow'
                          : 'border-amber-200 bg-white/70 text-amber-700 hover:border-amber-300'
                      }`}
                    >
                      {intent}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <PostCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                imageUrl={article.imageUrl}
                slug={article.slug}
                intentLabel={article.intentLabel}
                keywords={article.keywords}
              />
            ))}
          </div>

          {!filteredArticles.length && (
            <div className="mt-12 rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center">
              <p className="text-lg font-semibold text-emerald-900">No articles match that combination yet.</p>
              <p className="mt-2 text-sm text-emerald-800/80">
                Reset the filters or request a new article in the DailyHush community.
              </p>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-10 text-center">
          <h2 className="text-2xl font-bold text-emerald-900 md:text-3xl">Ready to diagnose your loop?</h2>
          <p className="mt-3 text-sm text-emerald-800 md:text-base">
            Every article culminates in the same next step—take the DailyHush quiz, break the loop, and graduate into the F.I.R.E. + Shift experience.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-[0_8px_24px_rgba(245,158,11,0.35)] transition hover:-translate-y-0.5 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              Take the DailyHush Quiz →
            </Link>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700/70">
              60 seconds · Free · Personalized reset
            </span>
          </div>
        </section>
      </div>
    </main>
  )
}
