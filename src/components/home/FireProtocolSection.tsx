import { Target, Zap, RefreshCw, CheckCircle } from 'lucide-react'

interface ProtocolStep {
  letter: string
  title: string
  fullTitle: string
  description: string
  mechanism: string
  timing: string
  icon: React.ComponentType<{ className?: string }>
}

const steps: ProtocolStep[] = [
  {
    letter: 'F',
    title: 'FOCUS',
    fullTitle: 'Detect the body signal before the thought',
    description: 'Learn to recognize your body\'s shame-signature 3-7 seconds before the narrative forms. That chest tightness. That stomach drop. YOUR specific pattern.',
    mechanism: 'Catch it in the pre-conscious window',
    timing: 'Seconds 0-3',
    icon: Target
  },
  {
    letter: 'I',
    title: 'INTERRUPT',
    fullTitle: 'Disrupt the pattern at the nervous system level',
    description: 'Deploy a body-based interrupt that resets your vagal nerve. Not thought-challenging (too late). A specific nervous system reset that stops the hijack mid-activation.',
    mechanism: 'Stop the nervous system hijack before it completes',
    timing: 'Seconds 3-7',
    icon: Zap
  },
  {
    letter: 'R',
    title: 'REFRAME',
    fullTitle: 'Install new narrative after nervous system calms',
    description: 'Once your nervous system is calm (not before), install a new narrative. Not "this is irrational" but "I was seen and I\'m safe." Simple. Clear.',
    mechanism: 'Reframe from calm nervous system, not during hijack',
    timing: 'Seconds 7-30',
    icon: RefreshCw
  },
  {
    letter: 'E',
    title: 'EXECUTE',
    fullTitle: 'Return to present without punishment',
    description: 'Complete the 90-second cycle and return to current moment. The replay doesn\'t start. The punishment ritual doesn\'t activate. You move on.',
    mechanism: 'Complete without engaging the narrative',
    timing: 'Seconds 30-90',
    icon: CheckCircle
  }
]

export default function FireProtocolSection() {
  return (
    <section
      className="relative py-16 md:py-20 lg:py-24 bg-emerald-900 overflow-hidden"
      aria-labelledby="fire-protocol-heading"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block px-4 py-2 bg-amber-500 text-white font-bold rounded-full text-sm mb-4">
            90-Second Protocol
          </div>
          <h2
            id="fire-protocol-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            The F.I.R.E. Protocol
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Interrupt shame-driven rumination <strong>before</strong> your brain even knows it's happening
          </p>
        </div>

        {/* Protocol Steps with Timeline */}
        <div className="relative space-y-8 md:space-y-12">
          {/* Timeline line */}
          <div
            className="absolute left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 via-emerald-400 to-amber-400 hidden md:block"
            aria-hidden="true"
          />

          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <div key={step.letter} className="relative md:pl-20">
                {/* Step number circle */}
                <div
                  className={`absolute left-0 w-14 h-14 rounded-full bg-white border-4 ${
                    index % 2 === 0 ? 'border-emerald-400' : 'border-amber-400'
                  } md:flex hidden items-center justify-center font-bold text-2xl text-emerald-900 shadow-lg`}
                  aria-hidden="true"
                >
                  {step.letter}
                </div>

                {/* Mobile step letter */}
                <div className={`md:hidden flex items-center gap-3 mb-4`}>
                  <div className={`w-12 h-12 rounded-full bg-white border-4 ${
                    index % 2 === 0 ? 'border-emerald-400' : 'border-amber-400'
                  } flex items-center justify-center font-bold text-xl text-emerald-900 shadow-lg`}>
                    {step.letter}
                  </div>
                  <span className="px-3 py-1 bg-amber-500/80 text-white text-xs font-semibold rounded-full">
                    {step.timing}
                  </span>
                </div>

                {/* Step content card */}
                <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 hover:border-emerald-400/40 transition-all duration-300">
                  {/* Icon and timing badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-emerald-300" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">
                          {step.title}
                        </h3>
                        <p className="text-emerald-200 text-sm">{step.fullTitle}</p>
                      </div>
                    </div>
                    <span className="hidden md:inline-block px-3 py-1 bg-amber-500/80 text-white text-xs font-semibold rounded-full shrink-0">
                      {step.timing}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-emerald-50 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Mechanism highlight */}
                  <div className="bg-emerald-800/40 rounded-lg p-4 border-l-4 border-amber-400">
                    <p className="text-xs text-emerald-300 font-semibold uppercase mb-1">
                      How it works
                    </p>
                    <p className="text-white font-medium">
                      {step.mechanism}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom summary */}
        <div className="mt-12 text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <p className="text-2xl md:text-3xl font-bold text-white mb-4">
            Total Time: <span className="text-amber-400">90 Seconds</span>
          </p>
          <p className="text-lg text-emerald-100">
            Not 90 minutes of meditation. Not 6 months of therapy. <br className="hidden md:inline" />
            <span className="font-bold">90 seconds to interrupt before 72 hours of punishment begins.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
