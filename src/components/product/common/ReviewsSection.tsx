import { useState } from 'react'

interface Review {
  id: string
  author: string
  location?: string
  rating: number
  verified: boolean
  productVariant: string
  text: string
  date: string
  helpful?: number
}

interface ReviewsSectionProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
  title?: string
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  }

  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function ReviewsSection({
  reviews,
  averageRating,
  totalReviews,
  title = 'Customer Reviews',
}: ReviewsSectionProps) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'questions'>('reviews')
  const [displayCount, setDisplayCount] = useState(6)

  const visibleReviews = reviews.slice(0, displayCount)
  const hasMore = displayCount < reviews.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => Math.min(prev + 6, reviews.length))
  }

  return (
    <section className="py-16 lg:py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            {title}
          </h2>
        </div>

        {/* Header with Rating */}
        <div className="mb-8">
          {/* Rating Display */}
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-gray-900">
              {averageRating.toFixed(2)}
            </div>
            <div className="flex flex-col gap-1">
              <StarRating rating={averageRating} size="md" />
              <div className="text-sm text-gray-600">
                Based on {totalReviews.toLocaleString()} reviews
              </div>
            </div>
          </div>
        </div>

        {/* Controls: Sort, Search, Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-4">
          {/* Sort and Search */}
          <div className="flex items-center gap-4">
            <button className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Sort
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <svg
                className="w-4 h-4 absolute left-2.5 top-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`text-sm font-semibold pb-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Product Reviews
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`text-sm font-semibold pb-2 transition-colors ${
                activeTab === 'questions'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Questions
            </button>
          </div>
        </div>

        {/* Reviews List */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {visibleReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">
                        {getInitials(review.author)}
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        {/* Verified Badge + Author */}
                        {review.verified && (
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs text-gray-600">Verified Customer</span>
                          </div>
                        )}

                        {/* Author and Location */}
                        <div>
                          <div className="font-semibold text-gray-900">{review.author}</div>
                          {review.location && (
                            <div className="text-xs text-gray-500">{review.location}</div>
                          )}
                        </div>
                      </div>

                      {/* Date - Top Right on Mobile */}
                      <div className="text-xs text-gray-500 flex-shrink-0 sm:hidden">{review.date}</div>
                    </div>

                    {/* Stars and Product Variant */}
                    <div className="mb-3">
                      <StarRating rating={review.rating} size="sm" />
                      <div className="text-sm font-semibold text-gray-800 mt-1">
                        {review.productVariant}
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{review.text}</p>

                    {/* Helpful Count */}
                    {review.helpful && review.helpful > 0 && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span className="italic">
                          {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this review helpful.
                        </span>
                      </div>
                    )}

                    {/* Actions and Date */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <span className="font-semibold text-gray-700">Was this review helpful?</span>
                        <button className="text-gray-600 underline hover:text-gray-900">Yes</button>
                        <button className="text-gray-600 underline hover:text-gray-900">Report</button>
                        <button className="text-gray-600 underline hover:text-gray-900">Share</button>
                      </div>
                      {/* Date - Desktop only (shows at top on mobile) */}
                      <div className="text-gray-500 flex-shrink-0 hidden sm:block">{review.date}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-8">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>
        )}

        {/* Questions Tab (placeholder) */}
        {activeTab === 'questions' && (
          <div className="text-center py-12 text-gray-500">
            No questions yet. Be the first to ask!
          </div>
        )}
      </div>
    </section>
  )
}
