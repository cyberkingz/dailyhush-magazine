import { Link } from 'react-router-dom'

type PostCardProps = {
  title: string
  excerpt: string
  category?: string
  author?: string
  date?: string
  imageUrl?: string
  slug?: string
}

export function PostCard({ title, excerpt, category, author, date, imageUrl, slug }: PostCardProps) {
  const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  
  return (
    <Link to={`/newsletter/article/${postSlug}`} className="block">
      <article className="group overflow-hidden rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      {imageUrl ? (
        <div className="aspect-[16/9] bg-gray-100">
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img src={imageUrl} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gray-100" />
      )}
      <div className="p-5 space-y-3">
        <div className="text-xs text-gray-500 flex gap-2 items-center">
          {category && <span className="uppercase tracking-wide font-semibold text-yellow-600">{category}</span>}
          {(author || date) && <span className="text-gray-400">•</span>}
          {author && <span>{author}</span>}
          {date && <span>{date}</span>}
        </div>
        <h3 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-gray-700 transition-colors">{title}</h3>
        <p className="text-gray-600 line-clamp-3">{excerpt}</p>
      </div>
    </article>
    </Link>
  )
}
