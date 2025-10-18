import { CheckCircle2, XCircle } from 'lucide-react'

interface ComparisonRow {
  aspect: string
  anxiety: string
  shame: string
}

const comparisons: ComparisonRow[] = [
  {
    aspect: "Time Focus",
    anxiety: "Future-focused",
    shame: "Past-focused"
  },
  {
    aspect: "Core Question",
    anxiety: "What if something bad happens?",
    shame: "I can't believe I did that"
  },
  {
    aspect: "What It Targets",
    anxiety: "Worry about outcomes",
    shame: "Punishment about identity"
  },
  {
    aspect: "Threat Type",
    anxiety: "Threat to safety",
    shame: "Threat to social belonging"
  },
  {
    aspect: "When It Operates",
    anxiety: "Conscious thought (second 7+)",
    shame: "Pre-conscious (seconds 0-7)"
  },
  {
    aspect: "Can Be Rationally Challenged",
    anxiety: "Yes - cognitive tools work",
    shame: "No - operates below rational thought"
  }
]

export default function MisdiagnosisComparisonSection() {
  return (
    <section
      className="py-16 md:py-20 lg:py-24 bg-white"
      aria-labelledby="misdiagnosis-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            id="misdiagnosis-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-4"
          >
            Why Everything Has Failed
          </h2>
          <p className="text-lg md:text-xl text-emerald-700 max-w-3xl mx-auto mb-2">
            You've been treating <span className="font-bold">anxiety</span> when you actually have <span className="font-bold text-emerald-600">shame</span>.
          </p>
          <p className="text-base text-emerald-600/80 max-w-2xl mx-auto">
            No wonder nothing worked—you've been using the wrong tools for the wrong diagnosis.
          </p>
        </div>

        {/* Comparison Layout - Desktop */}
        <div className="hidden md:block relative">
          {/* Vertical divider with VS badge */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent transform -translate-x-1/2 z-10" />
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">VS</span>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-2 gap-8">
            {/* Left: Anxiety */}
            <div className="bg-gray-50/50 rounded-2xl p-8 border-l-4 border-gray-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-700">Anxiety</h3>
                  <p className="text-sm text-gray-600">What you've been told</p>
                </div>
              </div>

              <div className="space-y-4">
                {comparisons.map((row) => (
                  <div key={row.aspect} className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{row.aspect}</p>
                    <p className="text-gray-700">{row.anxiety}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Shame */}
            <div className="bg-emerald-50/30 rounded-2xl p-8 border-l-4 border-emerald-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-emerald-900">Shame</h3>
                  <p className="text-sm text-emerald-700">What you actually have</p>
                </div>
              </div>

              <div className="space-y-4">
                {comparisons.map((row) => (
                  <div key={row.aspect} className="bg-white rounded-lg p-4 shadow-sm border-l-2 border-emerald-400">
                    <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">{row.aspect}</p>
                    <p className="text-emerald-900 font-medium">{row.shame}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Layout - Mobile (Stacked) */}
        <div className="md:hidden space-y-8">
          {/* Anxiety */}
          <div className="bg-gray-50/50 rounded-2xl p-6 border-l-4 border-gray-400">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-8 h-8 text-gray-500" />
              <div>
                <h3 className="text-xl font-bold text-gray-700">Anxiety</h3>
                <p className="text-sm text-gray-600">What you've been told</p>
              </div>
            </div>
            <div className="space-y-3">
              {comparisons.map((row) => (
                <div key={row.aspect} className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">{row.aspect}</p>
                  <p className="text-sm text-gray-700">{row.anxiety}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">VS</span>
            </div>
          </div>

          {/* Shame */}
          <div className="bg-emerald-50/30 rounded-2xl p-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <div>
                <h3 className="text-xl font-bold text-emerald-900">Shame</h3>
                <p className="text-sm text-emerald-700">What you actually have</p>
              </div>
            </div>
            <div className="space-y-3">
              {comparisons.map((row) => (
                <div key={row.aspect} className="bg-white rounded-lg p-3 shadow-sm border-l-2 border-emerald-400">
                  <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">{row.aspect}</p>
                  <p className="text-sm text-emerald-900 font-medium">{row.shame}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The 7-Second Window Explanation */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-amber-50/30 rounded-2xl p-8 md:p-10 border border-emerald-200">
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4">
              The 7-Second Window You've Never Heard About
            </h3>
            <p className="text-lg text-emerald-800 mb-4">
              Your vagal nerve fires <strong className="text-amber-600">3-7 seconds BEFORE</strong> conscious thought forms.
            </p>
            <div className="space-y-3 text-emerald-800">
              <p><strong>Second 0:</strong> Your nervous system detects a trigger (being seen, speaking up, a memory)</p>
              <p><strong>Seconds 0-3:</strong> Your vagal nerve fires. Your body responds: chest tightens, stomach drops, cortisol spikes</p>
              <p><strong>Seconds 3-7:</strong> Your brain creates a narrative to explain the body state: "I must be thinking about Tuesday..."</p>
              <p><strong>Second 7+:</strong> NOW you're consciously thinking. The replay loop begins.</p>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-amber-500">
              <p className="text-emerald-900 font-bold">
                By the time you notice the thought, you're 7 seconds too late.
              </p>
              <p className="text-emerald-700 mt-2">
                That's why "challenging your thoughts" doesn't work. Your body already decided you're unsafe.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-emerald-50/40 rounded-2xl p-8 border border-emerald-200/50">
          <p className="text-xl md:text-2xl text-emerald-900 font-bold mb-4">
            The relief comes from finally being diagnosed correctly.
          </p>
          <p className="text-lg text-emerald-700">
            You're not broken. You've been treating the wrong thing for years.
          </p>
        </div>
      </div>
    </section>
  )
}
