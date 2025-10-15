import React, { useState, useRef } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  review: string;
  overthinkerType?: string;
  verified?: boolean;
}

interface ReviewsSectionProps {
  title?: string;
  overallRating: number;
  totalReviews: number;
  reviews: Review[];
  initialDisplayCount?: number;
  loadMoreCount?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  title = 'What Our Members Say',
  overallRating,
  totalReviews,
  reviews,
  initialDisplayCount = 6,
  loadMoreCount = 3,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialDisplayCount);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  const handleLoadMore = () => {
    setIsLoading(true);

    // Store current scroll position
    const scrollY = window.scrollY;

    // Smooth transition delay
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + loadMoreCount, reviews.length));
      setIsLoading(false);

      // Restore scroll position after render
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          behavior: 'instant'
        });
      });
    }, 300);
  };
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-amber-500 text-amber-500'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mb-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-emerald-900 mb-4">
          {title}
        </h2>

        {/* Overall Rating */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.floor(overallRating)
                    ? 'fill-amber-500 text-amber-500'
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-2xl font-bold text-emerald-900">
            {overallRating.toFixed(1)}
          </span>
        </div>
        <p className="text-emerald-700/80">
          Based on {totalReviews.toLocaleString()} verified reviews
        </p>
      </div>

      {/* Reviews Masonry Layout */}
      <div ref={containerRef} className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {visibleReviews.map((review, index) => (
          <div
            key={review.id}
            data-review-index={index}
            className="break-inside-avoid mb-6 p-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.08)] ring-1 ring-white/40 hover:shadow-[0_8px_32px_rgba(16,185,129,0.12)] transition-all duration-300 animate-fade-in"
            style={{
              animationDelay: `${(index % loadMoreCount) * 50}ms`
            }}
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-emerald-900">
                    {review.name}
                  </h4>
                  {review.verified && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      Verified
                    </span>
                  )}
                </div>
                {review.overthinkerType && (
                  <p className="text-xs text-amber-700 font-medium">
                    {review.overthinkerType}
                  </p>
                )}
              </div>
            </div>

            {/* Rating & Date */}
            <div className="flex items-center justify-between mb-3">
              {renderStars(review.rating)}
              <span className="text-xs text-emerald-700/60">{review.date}</span>
            </div>

            {/* Review Text */}
            <p className="text-emerald-800/90 leading-relaxed">
              {review.review}
            </p>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Reviews'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
