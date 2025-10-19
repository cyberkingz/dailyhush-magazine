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
    white: 'bg-white',
    cream: 'bg-cream-50',
    emerald: 'bg-emerald-50',
  }[backgroundColor]

  return (
    <section className={cn('py-16 lg:py-24', bgClass)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl lg:text-6xl font-bold text-emerald-600 mb-3">
                {stat.number}
                {stat.suffix && (
                  <span className="text-3xl lg:text-4xl">{stat.suffix}</span>
                )}
              </div>
              <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
