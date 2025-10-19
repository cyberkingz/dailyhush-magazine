import { cn } from '@/lib/utils'

interface EducationalBlock {
  title: string
  content: string[]
  imageSrc: string
  imageAlt: string
  layout: 'image-left' | 'image-right'
}

interface ShiftEducationalProps {
  blocks: EducationalBlock[]
  sectionTitle?: string
  sectionSubtitle?: string
}

export function ShiftEducational({
  blocks,
  sectionTitle,
  sectionSubtitle,
}: ShiftEducationalProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-16">
            {sectionTitle && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Educational Blocks */}
        <div className="space-y-20">
          {blocks.map((block, idx) => (
            <div
              key={idx}
              className={cn(
                'grid lg:grid-cols-2 gap-8 lg:gap-16 items-center',
                block.layout === 'image-right' && 'lg:flex-row-reverse'
              )}
            >
              {/* Image */}
              <div className={cn(
                'order-1',
                block.layout === 'image-right' && 'lg:order-2'
              )}>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={block.imageSrc}
                    alt={block.imageAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Content */}
              <div className={cn(
                'order-2 space-y-4',
                block.layout === 'image-right' && 'lg:order-1'
              )}>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {block.title}
                </h3>
                <div className="space-y-4">
                  {block.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-lg text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
