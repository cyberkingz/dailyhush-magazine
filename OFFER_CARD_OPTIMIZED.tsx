// OPTIMIZED OFFER CARD - COGNITIVE LOAD REDUCTION
// Based on Cialdini persuasion principles + working memory research

<div className="bg-white border-2 border-slate-200 rounded-2xl p-6 md:p-8">
  {/* COMMITMENT: Quiz Result Reference */}
  <div className="bg-slate-100 border-l-4 border-slate-900 p-3 mb-4 rounded">
    <p className="text-sm text-slate-900 leading-tight">
      <strong>Your Quiz Result:</strong> {resultData.type_name}
    </p>
    <p className="text-xs text-slate-700 mt-1.5">
      You scored {resultData.user_score}/10. Here's the clinical protocol that targets YOUR specific pattern.
    </p>
  </div>

  {/* SCARCITY: Legitimate Time Window */}
  <div className="bg-amber-50 border border-amber-600 rounded-lg p-3 mb-6">
    <p className="text-sm text-amber-900 font-semibold text-center leading-tight">
      Your quiz results are calibrated for 48 hours
    </p>
    <p className="text-xs text-amber-800 text-center mt-1.5">
      F.I.R.E. is most effective when you start while your patterns are fresh in your mind
    </p>
  </div>

  {/* HEADER: Simple + Clear */}
  <div className="text-center mb-6">
    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
      The F.I.R.E. Kit: $27
    </h3>
    <p className="text-sm md:text-base text-slate-600">
      What therapists charge $750 for — Same clinical frameworks, 1/28th the cost
    </p>
  </div>

  {/* CONTRAST: Visual Comparison Box */}
  <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-5 mb-6">
    <div className="flex justify-between items-center gap-4">
      <div className="text-center flex-1">
        <p className="text-xs text-slate-600 mb-2">Therapy (5-6 sessions)</p>
        <p className="text-3xl md:text-4xl font-black text-slate-400 line-through">$750</p>
      </div>
      <div className="text-2xl md:text-3xl text-slate-400 font-bold">→</div>
      <div className="text-center flex-1">
        <p className="text-xs text-emerald-800 mb-2">F.I.R.E. Kit (same protocols)</p>
        <p className="text-4xl md:text-5xl font-black text-emerald-700">$27</p>
      </div>
    </div>
    <p className="text-center text-sm text-slate-700 mt-4 font-medium">
      Same RF-CBT frameworks. Yours forever. Start tonight.
    </p>
  </div>

  {/* SIMPLIFIED FEATURES: 3 Core Components (7±2 rule) */}
  <div className="mb-6 pb-6 border-b border-slate-200">
    <p className="text-base md:text-lg font-bold text-slate-900 mb-4 text-center">
      What You Get Instantly:
    </p>

    <div className="space-y-5">
      {/* Component 1 */}
      <div>
        <div className="flex items-start gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-base font-semibold text-slate-900">
            The Complete F.I.R.E. Protocol
          </p>
        </div>
        <div className="pl-7 space-y-1">
          <p className="text-sm text-slate-700">
            → 4-step system to interrupt rumination in 90 seconds
          </p>
          <p className="text-sm text-slate-700">
            → Emergency 3AM cards when your brain hijacks you
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            Equivalent to 2-3 therapy sessions ($300-450 value)
          </p>
        </div>
      </div>

      {/* Component 2 */}
      <div>
        <div className="flex items-start gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-base font-semibold text-slate-900">
            Your Personal Pattern Tracker
          </p>
        </div>
        <div className="pl-7 space-y-1">
          <p className="text-sm text-slate-700">
            → Rumination diary that reveals YOUR specific triggers
          </p>
          <p className="text-sm text-slate-700">
            → RF-CBT exercises therapists charge $150/hour to teach
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            Equivalent to 2-3 therapy sessions ($300-450 value)
          </p>
        </div>
      </div>

      {/* Component 3 */}
      <div>
        <div className="flex items-start gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-base font-semibold text-slate-900">
            Lifetime Access + Updates
          </p>
        </div>
        <div className="pl-7 space-y-1">
          <p className="text-sm text-slate-700">
            → Polyvagal regulation exercises for nervous system reset
          </p>
          <p className="text-sm text-slate-700">
            → MCT reframe templates (no toxic positivity)
          </p>
          <p className="text-sm text-slate-700">
            → Every new exercise we add — forever
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            Ongoing value (never pay again)
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* PRICE + CTA */}
  <div className="text-center mb-6">
    <p className="text-sm text-slate-600 mb-2">Your Investment Today:</p>
    <div className="flex items-baseline justify-center gap-3 mb-2">
      <span className="text-5xl md:text-6xl font-black text-slate-900">$27</span>
    </div>
    <p className="text-sm md:text-base text-slate-700 mb-1">
      One-time payment. Yours forever.
    </p>
    <p className="text-sm text-emerald-700 font-semibold">
      Less than one therapy co-pay. Same clinical frameworks.
    </p>
  </div>

  {/* CTA BUTTON */}
  <div className="max-w-md mx-auto mb-5">
    <ShopifyBuyButton
      productId="10761797894447"
      domain="t7vyee-kc.myshopify.com"
      storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
      buttonText="Get F.I.R.E. — Start Tonight"
      buttonColor="#16a34a"
      buttonHoverColor="#15803d"
      className="w-full"
    />
  </div>

  {/* GUARANTEE */}
  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mb-4">
    <p className="text-sm text-center text-emerald-900 font-semibold leading-snug">
      <CheckCircle className="inline w-4 h-4 mr-1.5" />
      30-Day "Break Overthinking or It's Free" Guarantee
    </p>
    <p className="text-xs text-center text-emerald-800 mt-2">
      Try F.I.R.E. for 30 days. If you don't break your pattern, email us for a full refund. Keep everything.
    </p>
  </div>

  {/* TRUST BADGES */}
  <div className="grid grid-cols-3 gap-3 text-sm text-slate-700 text-center">
    <div className="flex flex-col items-center gap-1.5">
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span className="leading-tight">30-day money-back</span>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span className="leading-tight">Instant download</span>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <CheckCircle className="w-4 h-4 text-emerald-600" />
      <span className="leading-tight">50,000+ users</span>
    </div>
  </div>
</div>
