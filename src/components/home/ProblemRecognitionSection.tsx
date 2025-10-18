import { Brain, Eye, Repeat } from 'lucide-react'

interface PhraseCard {
  phrase: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  statistic: string
}

const phrases: PhraseCard[] = [
  {
    phrase: "I should've known better",
    description: "Self-punishment disguised as analysis. Not 'What can I learn from this?' but a shame ritual your nervous system now expects. This was MY phrase for 8 years.",
    icon: Brain,
    statistic: "100 women wrote this exact phrase"
  },
  {
    phrase: "Afraid of doing it wrong",
    description: "Not fear of failure. Fear of being exposed as inadequate. Not about the outcome—about being seen. This is what keeps you from speaking up.",
    icon: Eye,
    statistic: "104 women shared this fear"
  },
  {
    phrase: "Can't stop replaying",
    description: "The compulsive loop. Your brain replaying that conversation, that email, that moment—obsessing over whether they saw you were faking it. A pattern I recognized immediately.",
    icon: Repeat,
    statistic: "92 women experience this daily"
  }
]

export default function ProblemRecognitionSection() {
  return (
    <section
      className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 relative overflow-hidden"
      aria-labelledby="problem-recognition-heading"
    >
      {/* Organic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            id="problem-recognition-heading"
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-emerald-900 mb-6 leading-tight md:leading-none"
          >
            You're Not Replaying Tuesday's Meeting Because You're Anxious.
          </h2>
          <p className="text-xl md:text-2xl text-amber-600 max-w-3xl mx-auto font-bold mb-4">
            It's Because You Can't Stop Replaying Whether They Saw Through You.
          </p>
          <p className="text-lg text-emerald-700/80 max-w-3xl mx-auto">
            If you've ever thought these three phrases, you don't have anxiety—you have <strong>shame-driven rumination</strong>.
          </p>
        </div>

        {/* Phrase Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {phrases.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.phrase}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/40 ring-1 ring-white/40 shadow-[0_8px_32px_rgba(16,185,129,0.08)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.12)] transition-all"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-emerald-600" aria-hidden="true" />
                </div>

                {/* Phrase */}
                <h3 className="text-xl font-bold text-amber-600 mb-3">
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
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-lg md:text-xl text-emerald-900 mb-3 leading-relaxed">
            <strong>Anxiety</strong> is worry about the FUTURE: "What if something bad happens?"
          </p>
          <p className="text-lg md:text-xl text-emerald-900 mb-6 leading-relaxed">
            <strong className="text-amber-600">Shame</strong> is punishment about the PAST: "I can't believe I did that."
          </p>
          <p className="text-xl md:text-2xl font-bold text-emerald-900">
            You've been treating the wrong condition for years.
          </p>
        </div>
      </div>
    </section>
  )
}
