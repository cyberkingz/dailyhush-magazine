import { useState } from 'react'
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
  guarantees: string[]
  reviewCount?: number
  reviewRating?: number
  ctaText?: string
  ctaLink?: string
  description?: string
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
  guarantees,
  reviewCount,
  reviewRating,
  ctaText = 'Add to Cart',
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

  const savings = price.original ? price.original - price.current : 0

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-white to-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 shadow-xl">
              <img
                src={images[selectedImage]}
                alt={`${productName} - View ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'relative aspect-square rounded-lg overflow-hidden bg-cream-100 transition-all',
                      selectedImage === idx
                        ? 'ring-2 ring-emerald-500 shadow-md'
                        : 'opacity-60 hover:opacity-100'
                    )}
                  >
                    <img
                      src={img}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
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
              {scarcityMessage && (
                <p className="text-base text-gray-700 mb-3">
                  {scarcityMessage}
                </p>
              )}
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

            {/* Price */}
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
              <p className="text-gray-700 leading-relaxed">
                {description}
              </p>
            )}

            {/* Variant Selector */}
            {variantOptions && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  {variantOptions.name}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {variantOptions.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedVariant(option.value)}
                      className={cn(
                        'relative px-4 py-3 rounded-lg border-2 transition-all',
                        selectedVariant === option.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      )}
                    >
                      <span className="font-medium text-gray-900">
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className="block text-xs text-emerald-600 mt-1">
                          {option.badge}
                        </span>
                      )}
                      {selectedVariant === option.value && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
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

            {/* Guarantees */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              {guarantees.map((guarantee, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{guarantee}</span>
                </div>
              ))}
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
