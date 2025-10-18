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
      className="py-16 md:py-24 bg-gray-50"
      aria-labelledby="misdiagnosis-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            id="misdiagnosis-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6"
          >
            Why Everything Has Failed
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-2">
            You've been treating <span className="font-bold text-red-600">anxiety</span> when you actually have <span className="font-bold text-emerald-600">shame</span>.
          </p>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            No wonder nothing worked—you've been using the wrong tools for the wrong diagnosis.
          </p>
        </div>

        {/* Desktop: Table-Style Comparison */}
        <div className="hidden md:block max-w-5xl mx-auto mb-12">
          <div className="bg-white border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-white border-b border-gray-200">
              <div className="col-span-4 p-6">
                <p className="text-sm font-semibold text-gray-700 uppercase">
                  Comparison Point
                </p>
              </div>
              <div className="col-span-4 p-6 border-x border-gray-200">
                <p className="font-bold text-red-600">Anxiety (Wrong)</p>
              </div>
              <div className="col-span-4 p-6">
                <p className="font-bold text-emerald-600">Shame (Correct)</p>
              </div>
            </div>

            {/* Table Rows */}
            {comparisons.map((row, index) => (
              <div
                key={row.aspect}
                className={`grid grid-cols-12 ${
                  index === comparisons.length - 1 ? '' : 'border-b border-gray-200'
                }`}
              >
                {/* Aspect Column */}
                <div className="col-span-4 p-6">
                  <p className="font-semibold text-gray-900">
                    {row.aspect}
                  </p>
                </div>

                {/* Anxiety Column */}
                <div className="col-span-4 p-6 border-x border-gray-200">
                  <p className="text-gray-700">
                    {row.anxiety}
                  </p>
                </div>

                {/* Shame Column */}
                <div className="col-span-4 p-6">
                  <p className="text-gray-900 font-medium">
                    {row.shame}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked Card Comparison */}
        <div className="md:hidden space-y-6 mb-12">
          {comparisons.map((row) => (
            <div
              key={row.aspect}
              className="bg-white border border-gray-200 p-6"
            >
              {/* Aspect Header */}
              <p className="font-bold text-gray-900 mb-4">
                {row.aspect}
              </p>

              {/* Comparison */}
              <div className="space-y-3">
                {/* Wrong - Anxiety */}
                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase mb-1">
                    Anxiety (Wrong)
                  </p>
                  <p className="text-sm text-gray-700">
                    {row.anxiety}
                  </p>
                </div>

                {/* Right - Shame */}
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase mb-1">
                    Shame (Correct)
                  </p>
                  <p className="text-sm text-gray-900 font-medium">
                    {row.shame}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* The 7-Second Window Explanation */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2">
              The 7-Second Window You've Never Heard About
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Your vagal nerve fires <strong className="text-amber-600">3-7 seconds BEFORE</strong> conscious thought forms.
            </p>

            <div className="space-y-6 text-gray-700 mb-8">
              <div className="flex gap-4 items-start">
                <div className="w-20 flex-shrink-0">
                  <span className="font-bold text-amber-600">
                    Second 0
                  </span>
                </div>
                <p className="flex-1">Your nervous system detects a trigger (being seen, speaking up, a memory)</p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 flex-shrink-0">
                  <span className="font-bold text-amber-600">
                    0-3 sec
                  </span>
                </div>
                <p className="flex-1">Your vagal nerve fires. Your body responds: chest tightens, stomach drops, cortisol spikes</p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 flex-shrink-0">
                  <span className="font-bold text-amber-600">
                    3-7 sec
                  </span>
                </div>
                <p className="flex-1">Your brain creates a narrative to explain the body state: "I must be thinking about Tuesday..."</p>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-20 flex-shrink-0">
                  <span className="font-bold text-amber-600">
                    7+ sec
                  </span>
                </div>
                <p className="flex-1"><strong>NOW</strong> you're consciously thinking. The replay loop begins.</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-l-4 border-amber-500">
              <p className="text-gray-900 font-bold text-lg mb-2">
                By the time you notice the thought, you're 7 seconds too late.
              </p>
              <p className="text-gray-700">
                That's why "challenging your thoughts" doesn't work. Your body already decided you're unsafe.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-emerald-900 font-bold mb-4">
            The relief comes from finally being diagnosed correctly.
          </p>
          <p className="text-lg text-gray-700">
            You're not broken. You've been treating the wrong thing for years.
          </p>
        </div>
      </div>
    </section>
  )
}
