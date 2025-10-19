interface HighlightImage {
  src: string
  alt: string
}

interface ShiftHighlightsProps {
  title?: string
  images: HighlightImage[]
}

export function ShiftHighlights({
  title = 'And people are loving it!',
  images,
}: ShiftHighlightsProps) {
  return (
    <section className="py-12 lg:py-16 bg-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            {title}
          </h2>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {images.map((image, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
