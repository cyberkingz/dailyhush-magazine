interface ShiftBonusOfferProps {
  imageSrc: string
  imageAlt?: string
  title: string
  description: string
  layout?: 'image-left' | 'image-right'
}

export function ShiftBonusOffer({
  imageSrc,
  imageAlt = 'Bonus offer',
  title,
  description,
  layout = 'image-left',
}: ShiftBonusOfferProps) {
  return (
    <section className="py-12 lg:py-16 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${layout === 'image-right' ? 'lg:flex-row-reverse' : ''}`}>

          {/* Image */}
          <div className={layout === 'image-right' ? 'lg:order-2' : 'lg:order-1'}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className={`space-y-4 ${layout === 'image-right' ? 'lg:order-1' : 'lg:order-2'}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
