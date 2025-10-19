interface FinalCTAProps {
  backgroundImage: string
  heading: string
  subheading?: string
  ctaText: string
  ctaLink: string
  guarantee?: string
}

export function FinalCTA({
  backgroundImage,
  heading,
  subheading,
  ctaText,
  ctaLink,
  guarantee,
}: FinalCTAProps) {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/85 to-teal-900/90" />
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          {heading}
        </h2>
        {subheading && (
          <p className="text-xl lg:text-2xl text-white/90 mb-8">
            {subheading}
          </p>
        )}
        <a
          href={ctaLink}
          className="inline-block bg-white hover:bg-gray-50 text-emerald-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        >
          {ctaText}
        </a>
        {guarantee && (
          <p className="mt-6 text-white/80 text-sm">
            {guarantee}
          </p>
        )}
      </div>
    </section>
  )
}
