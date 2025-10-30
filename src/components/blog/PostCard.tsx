import { Link } from 'react-router-dom'

export type PostCardProps = {
  title: string
  excerpt: string
  category?: string
  author?: string
  date?: string
  readTime?: string
  imageUrl?: string
  slug?: string
  href?: string
  keywords?: string[]
  ctaLabel?: string
  ctaHref?: string
}

export function PostCard(props: PostCardProps) {
  const {
    title,
    excerpt,
    category,
    author,
    date,
    readTime,
    imageUrl,
    slug,
    href,
    keywords,
    ctaLabel,
    ctaHref,
  } = props
  const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const articleHref = href || `/blog/${postSlug}`
  const buttonHref = ctaHref || articleHref
  const buttonLabel = ctaLabel || 'Read the Article →'

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link to={articleHref} className="relative block">
        <div className="aspect-[16/9] w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-amber-100 text-sm font-semibold text-emerald-700">
              DailyHush Insights
            </div>
          )}
        </div>
        {category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600 shadow-sm">
            {category}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-gray-500">
          {author && <span>{author}</span>}
          {date && (
            <>
              <span aria-hidden="true">•</span>
              <time>{date}</time>
            </>
          )}
          {readTime && (
            <>
              <span aria-hidden="true">•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Link to={articleHref} className="group/title block">
            <h3 className="text-xl font-bold leading-tight text-gray-900 transition-colors group-hover/title:text-emerald-700">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-gray-700 line-clamp-4">{excerpt}</p>
        </div>

        {keywords?.length ? (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                #{keyword}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto pt-4">
          <Link
            to={buttonHref}
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-amber-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {buttonLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
