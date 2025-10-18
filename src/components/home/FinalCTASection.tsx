import { CheckCircle2, Shield, Lock, Users, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const benefits = [
  'Interrupt shame-driven rumination in the 7-second pre-conscious window',
  'Stop replaying conversations for 72 hours after they happen',
  'Sleep through the night without 3am shame spirals',
  'Speak up in meetings without punishment afterwards',
  'Finally use the right tool for the actual problem',
  'Science-backed nervous system protocol, not mindset fluff'
]

const objectionCrushers = [
  {
    objection: "What if I've tried everything?",
    response: "You've tried anxiety tools for a shame problem. This targets the actual mechanism."
  },
  {
    objection: "What if it doesn't work for me?",
    response: "90-day guarantee. If you're still replaying after practicing F.I.R.E., full refund."
  },
  {
    objection: 'How is this different from meditation?',
    response: 'Meditation teaches awareness. F.I.R.E. interrupts pre-conscious nervous system hijack.'
  }
]

export default function FinalCTASection() {
  return (
    <section
      className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      {/* Organic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Benefits and Social Proof */}
          <div>
            <h2
              id="final-cta-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-emerald-900 mb-6 leading-tight"
            >
              Stop Punishing. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">
                Start Interrupting.
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-emerald-800 mb-8 leading-relaxed">
              You're not broken. You were misdiagnosed. Get the right protocol for the actual problem.
            </p>

            {/* Benefits list */}
            <ul className="space-y-4 mb-8" role="list">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-emerald-800">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Social proof stat */}
            <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border-2 border-white/40 ring-1 ring-white/40 shadow-[0_8px_32px_rgba(16,185,129,0.08)] mb-8">
              <Users className="w-8 h-8 text-emerald-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-emerald-900">847 Women</p>
                <p className="text-sm text-emerald-700">Stopped spiraling in 7 days with F.I.R.E.</p>
              </div>
            </div>

            {/* Objection crushers - Desktop only */}
            <div className="hidden lg:block space-y-4">
              {objectionCrushers.map((item, index) => (
                <details
                  key={index}
                  className="bg-white/60 backdrop-blur-xl rounded-lg p-4 border-2 border-white/40 ring-1 ring-white/40 group"
                >
                  <summary className="font-semibold text-emerald-900 cursor-pointer list-none flex items-center justify-between">
                    {item.objection}
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-open:rotate-90 transition-transform" />
                  </summary>
                  <p className="mt-3 text-emerald-800 pl-4 border-l-2 border-amber-500">
                    {item.response}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Right: CTA Box */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 md:p-10 border-2 border-white/40 ring-1 ring-white/40 shadow-[0_8px_32px_rgba(16,185,129,0.08)] relative">
              {/* Guarantee badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-amber-500/20 border-2 border-amber-500/40 text-amber-900 px-4 py-2 rounded-full font-bold text-sm backdrop-blur-xl ring-1 ring-white/40 shadow-[0_4px_16px_rgba(245,158,11,0.15)] flex items-center gap-2">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  90-Day Money-Back Guarantee
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-2 text-center">
                  Take the Free Quiz
                </h3>
                <p className="text-emerald-700/80 text-center mb-6">
                  Discover your specific shame-rumination pattern and get the F.I.R.E. protocol tailored to you.
                </p>

                {/* What they get */}
                <div className="bg-emerald-50/50 rounded-lg p-4 mb-6 border border-emerald-200/50">
                  <p className="text-sm font-semibold text-emerald-900 mb-2">You'll discover:</p>
                  <ul className="text-sm text-emerald-800 space-y-1">
                    <li>• Your overthinker type</li>
                    <li>• Your shame-body signature</li>
                    <li>• Your personalized F.I.R.E. protocol</li>
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  to="/quiz"
                  className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-5 rounded-full transition-all shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 text-lg group"
                >
                  Start Free Quiz
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Micro trust signals */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-700/70">
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    <span>Your data is private and secure</span>
                  </div>
                  <div className="text-center text-xs text-emerald-700/70">
                    No credit card required • 60-second quiz • Instant results
                  </div>
                </div>

                {/* Guarantee details */}
                <div className="mt-6 pt-6 border-t border-emerald-200/50">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="text-sm text-emerald-800">
                      <p className="font-semibold mb-1 text-emerald-900">90-Day Shame-Interruption Guarantee</p>
                      <p className="text-xs leading-relaxed text-emerald-700/80">
                        If you're still replaying conversations for 72 hours after learning and practicing F.I.R.E., we refund everything. We can make this guarantee because nervous system interruption works when targeted correctly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile objection crushers */}
        <div className="lg:hidden mt-12 space-y-4">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">Common Questions</h3>
          {objectionCrushers.map((item, index) => (
            <details
              key={index}
              className="bg-white/60 backdrop-blur-xl rounded-lg p-4 border-2 border-white/40 ring-1 ring-white/40"
            >
              <summary className="font-semibold text-emerald-900 cursor-pointer">
                {item.objection}
              </summary>
              <p className="mt-3 text-emerald-800 pl-4 border-l-2 border-amber-500">
                {item.response}
              </p>
            </details>
          ))}
        </div>

        {/* Final validation message */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/40 ring-1 ring-white/40 shadow-[0_8px_32px_rgba(16,185,129,0.08)]">
            <p className="text-2xl md:text-3xl font-bold text-emerald-900 mb-4">
              You're Not Broken. You Were Misdiagnosed.
            </p>
            <p className="text-lg md:text-xl text-emerald-800 mb-4 leading-relaxed">
              You don't have an anxiety problem that you're bad at managing.
            </p>
            <p className="text-lg text-emerald-700/80 leading-relaxed">
              You have shame-driven rumination that operates 3-7 seconds before conscious thought. You've been using the wrong tools at the wrong timing for the wrong condition.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
