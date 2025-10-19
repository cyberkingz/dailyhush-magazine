import { cn } from '@/lib/utils'

interface Stat {
  number: string | number
  suffix?: string
  description: string
}

interface SocialProofStatsProps {
  stats: Stat[]
  backgroundColor?: 'white' | 'cream' | 'emerald'
  title?: string
  subtitle?: string
}

export function SocialProofStats({
  stats,
  backgroundColor = 'cream',
  title,
  subtitle,
}: SocialProofStatsProps) {
  const bgClass = {
    white: 'bg-emerald-800',
    cream: 'bg-cream-50',
    emerald: 'bg-emerald-50',
  }[backgroundColor]

  return (
    <section className={cn('py-16 lg:py-24', bgClass)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-white max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              {/* Circular stat background */}
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full bg-white flex items-center justify-center mb-6">
                <div className="text-5xl lg:text-6xl font-bold text-gray-900">
                  {stat.suffix === ':' ? ':' : ''}{stat.number}
                  {stat.suffix && stat.suffix !== ':' && (
                    <span className="text-3xl lg:text-4xl">{stat.suffix}</span>
                  )}
                </div>
              </div>
              {/* Description */}
              <p className="text-white text-base lg:text-lg leading-relaxed max-w-xs">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
