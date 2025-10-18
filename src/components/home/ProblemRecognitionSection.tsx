import { Brain, Eye, Repeat } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface PhraseCard {
  phrase: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  statistic: string
}

const phrases: PhraseCard[] = [
  {
    phrase: "I should've known better",
    description: "This isn't analysis. This is self-punishment. Not 'What could I learn?' but 'Why am I so stupid?'",
    icon: Brain,
    statistic: "100 women wrote this exact phrase"
  },
  {
    phrase: "Afraid of doing it wrong",
    description: "Not fear of failure. Fear of being exposed as inadequate. Not about the outcome—about being seen.",
    icon: Eye,
    statistic: "104 women shared this fear"
  },
  {
    phrase: "Can't stop replaying",
    description: "Not processing. Punishing. Re-enacting the moment you felt exposed. A ritual your nervous system now expects.",
    icon: Repeat,
    statistic: "92 women experience this daily"
  }
]

export default function ProblemRecognitionSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/30 py-16 md:py-20 lg:py-24"
      aria-labelledby="problem-recognition-heading"
    >
      {/* Background organic blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="problem-recognition-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4"
          >
            You're Not Replaying Tuesday's Meeting Because You're Anxious.
          </h2>
          <p className="text-xl md:text-2xl text-amber-600 max-w-3xl mx-auto font-semibold mb-4">
            You're Punishing Yourself For Being Seen.
          </p>
          <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
            If you've ever thought these three phrases, you don't have anxiety—you have <strong>shame-driven rumination</strong>.
          </p>
        </div>

        {/* Phrase Cards Grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {phrases.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.phrase}
                className={`
                  group relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 md:p-8
                  border border-white/40 shadow-sm
                  hover:bg-white/70 hover:shadow-lg hover:scale-[1.02]
                  transition-all duration-300
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/10 mb-4 group-hover:bg-emerald-500/15 transition-colors">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-emerald-600" aria-hidden="true" />
                </div>

                {/* Phrase */}
                <h3 className="text-xl md:text-2xl font-bold text-amber-600 mb-3 leading-tight">
                  "{item.phrase}"
                </h3>

                {/* Description */}
                <p className="text-emerald-800 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Statistic */}
                <p className="text-sm text-emerald-600 font-semibold">
                  {item.statistic}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom insight */}
        <div className="mt-12 text-center">
          <p className="text-lg md:text-xl text-emerald-900 max-w-4xl mx-auto leading-relaxed">
            <strong>Anxiety</strong> is worry about the FUTURE: "What if something bad happens?"<br />
            <strong className="text-amber-600">Shame</strong> is punishment about the PAST: "I can't believe I did that."
          </p>
          <p className="text-lg md:text-xl text-emerald-900 font-bold max-w-4xl mx-auto mt-4">
            You've been treating the wrong condition for years.
          </p>
        </div>
      </div>
    </section>
  )
}
