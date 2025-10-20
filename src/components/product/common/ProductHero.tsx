import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import ShopifyBuyButton from '@/components/ShopifyBuyButton'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  collapsible?: boolean
}

interface ProductHeroProps {
  productName: string
  tagline: string
  badge?: string
  scarcityMessage?: string
  price: {
    current: number
    original?: number
  }
  images: string[]
  tabs?: Tab[]
  variantOptions?: {
    name: string
    options: Array<{
      value: string
      label: string
      badge?: string
      default?: boolean
    }>
  }
  variantImages?: Record<string, string[]>
  guarantees: string[]
  reviewCount?: number
  reviewRating?: number
  ctaText?: string
  ctaLink?: string
  description?: React.ReactNode
  // Shopify Integration
  shopifyProductId?: string
  shopifyDomain?: string
  shopifyStorefrontAccessToken?: string
}

export function ProductHero({
  productName,
  tagline,
  badge,
  scarcityMessage,
  price,
  images,
  tabs,
  variantOptions,
  variantImages,
  guarantees,
  reviewCount,
  reviewRating,
  ctaText = 'Get The Shift™ Pack',
  ctaLink = '#buy',
  description,
  shopifyProductId,
  shopifyDomain,
  shopifyStorefrontAccessToken,
}: ProductHeroProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(
    variantOptions?.options.find(o => o.default)?.value || variantOptions?.options[0]?.value
  )
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '')
  const [isTabExpanded, setIsTabExpanded] = useState(false)

  // Get current images based on selected variant
  const currentImages = (selectedVariant && variantImages?.[selectedVariant]) || images

  // Reset selected image when variant changes
  useEffect(() => {
    setSelectedImage(0)
  }, [selectedVariant])

  const savings = price.original ? price.original - price.current : 0

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-cream-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-start overflow-hidden">

          {/* Left: Image Gallery */}
          <div className="space-y-4 overflow-hidden w-full">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 shadow-xl w-full">
              <img
                src={currentImages[selectedImage]}
                alt={`${productName} - View ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery - Horizontal Slider */}
            {currentImages.length > 1 && (
              <div className="relative overflow-x-hidden w-full pt-4">
                {/* Left Fade Gradient - Mobile optimized */}
                <div
                  className="absolute left-0 top-4 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-cream-50/80 to-transparent pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Scrollable Container - With vertical padding to show borders */}
                <div
                  className="flex gap-2 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-proximity py-2 pl-4 pr-4 sm:pl-4 sm:pr-4 [&::-webkit-scrollbar]:hidden"
                  role="region"
                  aria-label="Product image thumbnails"
                  style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {currentImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden bg-cream-100 transition-all duration-200 flex-shrink-0 snap-start',
                        // Fixed touch targets - consistent sizing
                        'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
                        // Enhanced visual states with better touch feedback
                        selectedImage === idx
                          ? 'ring-2 ring-emerald-500 shadow-md scale-105'
                          : 'opacity-60 hover:opacity-90 hover:ring-1 hover:ring-emerald-300 active:scale-95 active:opacity-100 active:ring-2 active:ring-emerald-400 active:bg-emerald-50'
                      )}
                      aria-label={`View image ${idx + 1} of ${currentImages.length}`}
                      aria-current={selectedImage === idx ? 'true' : 'false'}
                      type="button"
                    >
                      <img
                        src={img}
                        alt={`${productName} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                      {/* Selected Indicator Badge */}
                      {selectedImage === idx && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Right Fade Gradient - Mobile optimized */}
                <div
                  className="absolute right-0 top-4 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-cream-50/80 to-transparent pointer-events-none z-10"
                  aria-hidden="true"
                />

                {/* Image Counter (Mobile Only) - Bottom center */}
                <div className="flex sm:hidden justify-center mt-2">
                  <span className="text-xs text-gray-600 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm font-medium">
                    {selectedImage + 1} / {currentImages.length}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6 lg:sticky lg:top-8">

            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {badge}
              </div>
            )}

            {/* Product Name */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                {productName}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600">
                {tagline}
              </p>
            </div>

            {/* Reviews */}
            {reviewCount && reviewRating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(reviewRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 fill-current'
                      )}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600">
                  {reviewRating} ({reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            )}

            {/* Price - Only show if no description (value stack) is provided */}
            {!description && (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${price.current}
                </span>
                {price.original && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${price.original}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                      Save ${savings}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Product Details Tabs */}
            {tabs && tabs.length > 0 && (
              <div className="space-y-4">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex gap-6" aria-label="Product details tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id)
                          setIsTabExpanded(false)
                        }}
                        className={cn(
                          'pb-3 text-sm font-medium transition-colors relative whitespace-nowrap',
                          activeTab === tab.id
                            ? 'text-gray-900'
                            : 'text-gray-500 hover:text-gray-700'
                        )}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content with Expand/Collapse */}
                <div>
                  {tabs.map((tab) => {
                    const isCollapsible = tab.collapsible !== false
                    return (
                      <div
                        key={tab.id}
                        className={cn(
                          activeTab === tab.id ? 'block' : 'hidden'
                        )}
                      >
                        {isCollapsible ? (
                          <>
                            <div className="relative">
                              <div className={cn(
                                'overflow-hidden transition-all',
                                !isTabExpanded && 'max-h-40'
                              )}>
                                {tab.content}
                              </div>
                              {!isTabExpanded && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                              )}
                            </div>
                            <button
                              onClick={() => setIsTabExpanded(!isTabExpanded)}
                              className="text-sm text-gray-600 hover:text-gray-900 font-medium mt-2 underline"
                            >
                              {isTabExpanded ? 'Show less' : 'Read more'}
                            </button>
                          </>
                        ) : (
                          <div>{tab.content}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Description */}
            {description && (
              <div>
                {description}
              </div>
            )}

            {/* Variant Selector */}
            {variantOptions && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  {variantOptions.name}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {variantOptions.options.map((option) => {
                    // Map variant values to their subtle, elegant colors
                    const colorMap: Record<string, { bg: string; border: string; borderSelected: string }> = {
                      'gold': {
                        bg: 'bg-gradient-to-br from-amber-50/80 to-yellow-50/60',
                        border: 'border-amber-200/50',
                        borderSelected: 'border-amber-300'
                      },
                      'rose-gold': {
                        bg: 'bg-gradient-to-br from-rose-50/80 to-pink-50/60',
                        border: 'border-rose-200/50',
                        borderSelected: 'border-rose-300'
                      },
                      'silver': {
                        bg: 'bg-gradient-to-br from-slate-50/80 to-gray-50/60',
                        border: 'border-slate-200/50',
                        borderSelected: 'border-slate-300'
                      },
                      'matte-slate': {
                        bg: 'bg-gradient-to-br from-slate-100/80 to-slate-50/60',
                        border: 'border-slate-200/50',
                        borderSelected: 'border-slate-300'
                      },
                    }
                    const colorStyle = colorMap[option.value] || {
                      bg: 'bg-gray-50',
                      border: 'border-gray-200/50',
                      borderSelected: 'border-gray-300'
                    }

                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedVariant(option.value)}
                        className={cn(
                          'relative px-4 py-3 rounded-lg border transition-all',
                          colorStyle.bg,
                          selectedVariant === option.value
                            ? `${colorStyle.borderSelected} shadow-sm`
                            : `${colorStyle.border} hover:${colorStyle.borderSelected} opacity-90 hover:opacity-100`
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Subtle Color Swatch */}
                          <div className={cn(
                            'w-6 h-6 rounded-full border flex-shrink-0',
                            option.value === 'gold' && 'bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-50 border-amber-200/60',
                            option.value === 'rose-gold' && 'bg-gradient-to-br from-rose-100 via-pink-100 to-rose-50 border-rose-200/60',
                            option.value === 'silver' && 'bg-gradient-to-br from-slate-100 via-gray-100 to-slate-50 border-slate-200/60',
                            option.value === 'matte-slate' && 'bg-gradient-to-br from-slate-200 via-slate-150 to-slate-100 border-slate-300/60',
                          )} />

                          {/* Label */}
                          <div className="flex-1 text-left">
                            <span className="font-medium text-gray-900 block text-sm">
                              {option.label}
                            </span>
                            {option.badge && (
                              <span className="block text-xs text-emerald-600 mt-0.5">
                                {option.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        {selectedVariant === option.value && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CTA Button */}
            {shopifyProductId && shopifyDomain && shopifyStorefrontAccessToken ? (
              <ShopifyBuyButton
                productId={shopifyProductId}
                domain={shopifyDomain}
                storefrontAccessToken={shopifyStorefrontAccessToken}
                buttonText={`${ctaText} - $${price.current}`}
                buttonColor="#f59e0b"
                buttonHoverColor="#d97706"
                className="w-full"
              />
            ) : (
              <a
                href={ctaLink}
                className="block w-full bg-amber-500 hover:bg-amber-600 text-white text-center py-4 px-8 rounded-full font-bold text-lg shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95"
              >
                {ctaText} - ${price.current}
              </a>
            )}

            {/* Scarcity Message */}
            {scarcityMessage && (
              <p className="text-sm text-gray-600 text-center -mt-2">
                {scarcityMessage}
              </p>
            )}

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200">
              {guarantees.map((guarantee, idx) => {
                // Icon selection based on guarantee content
                let icon;
                if (guarantee.toLowerCase().includes('money') || guarantee.toLowerCase().includes('guarantee')) {
                  // Money back guarantee icon
                  icon = (
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                } else if (guarantee.toLowerCase().includes('course') || guarantee.toLowerCase().includes('breathwork')) {
                  // Course/learning icon
                  icon = (
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )
                } else {
                  // Delivery truck icon
                  icon = (
                    <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                  )
                }

                return (
                  <div key={idx} className="flex flex-col items-center text-center gap-2">
                    {icon}
                    <span className="text-xs text-gray-600 leading-tight">{guarantee}</span>
                  </div>
                )
              })}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 pt-4 opacity-60">
              <span className="text-xs text-gray-500">Secure Checkout</span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
