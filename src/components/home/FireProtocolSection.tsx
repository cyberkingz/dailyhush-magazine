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
      className="py-20 bg-emerald-900 relative overflow-hidden"
      aria-labelledby="fire-protocol-heading"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border-2 border-amber-500/40 text-amber-200 px-4 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-xl ring-1 ring-white/40 shadow-[0_4px_16px_rgba(245,158,11,0.15)]">
            90-Second Protocol
          </div>
          <h2
            id="fire-protocol-heading"
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 leading-tight md:leading-none"
          >
            The F.I.R.E. Protocol
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Interrupt shame-driven rumination <strong>before</strong> your brain even knows it's happening
          </p>
        </div>

        {/* Protocol Steps */}
        <div className="space-y-8 mb-12">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.letter}
                className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/20 ring-1 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                {/* Step header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-400/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-300" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">
                        {step.letter}. {step.title}
                      </h3>
                      <p className="text-emerald-200 text-sm">{step.fullTitle}</p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-amber-500/80 text-white text-xs font-bold rounded-full shrink-0 ml-4">
                    {step.timing}
                  </span>
                </div>

                {/* Description */}
                <p className="text-emerald-50 leading-relaxed mb-4">
                  {step.description}
                </p>

                {/* Mechanism */}
                <div className="bg-emerald-800/40 p-4 rounded-lg border-l-4 border-amber-400">
                  <p className="text-xs text-emerald-300 font-semibold uppercase mb-1">
                    How it works
                  </p>
                  <p className="text-white font-medium">
                    {step.mechanism}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom summary */}
        <div className="text-center pt-12 border-t-2 border-white/20">
          <p className="text-2xl md:text-3xl font-bold text-white mb-4">
            Total Time: <span className="text-amber-400">90 Seconds</span>
          </p>
          <p className="text-lg md:text-xl text-emerald-100 leading-relaxed">
            Not 90 minutes of meditation. Not 6 months of therapy.<br />
            <span className="font-bold">90 seconds to interrupt before 72 hours of punishment begins.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
