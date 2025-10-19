interface Step {
  number: number
  icon: string
  title: string
  description: string
}

interface ShiftHowItWorksProps {
  steps: Step[]
  title?: string
  subtitle?: string
  videoSrc?: string
}

export function ShiftHowItWorks({
  steps,
  title = 'So How Does It Work?',
  subtitle = "It's embarrassingly simple. That's why it works.",
  videoSrc,
}: ShiftHowItWorksProps) {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              {/* Step Number Badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg mb-4">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Video (if provided) */}
        {videoSrc && (
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={videoSrc}
                controls
                className="w-full h-full"
                poster="/images/video-poster.jpg"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
