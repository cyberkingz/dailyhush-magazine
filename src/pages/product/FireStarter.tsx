import { useEffect, useState, useCallback, useRef } from 'react'
import { CheckCircle, Shield } from 'lucide-react'
import ShopifyBuyButton from '@/components/ShopifyBuyButton'
import AnnouncementBar from '@/components/AnnouncementBar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'
import {
  ComparisonTable,
  CostOfDelaySection,
  ProductFeatureSection,
  TrustSignals,
} from '@/components/product'
import { ReviewsSection } from '@/components/product/ReviewsSection'
import { fireStarterProductData } from '@/data/fireStarterProductData'
import { useScrollDepth } from '@/hooks/useScrollDepth'
import {
  trackProductPageView,
  trackScrollDepth,
  trackBuyButtonClick,
  trackPageExit,
} from '@/lib/services/productPageEvents'

export default function FireStarterProduct() {
  const [showStickyBar, setShowStickyBar] = useState(false)

  // Tracking state
  const sessionIdRef = useRef<string | undefined>(undefined)
  const pageLoadTime = useRef(Date.now())

  useEffect(() => {
    document.title = 'F.I.R.E. Protocol — Stop the Shame Loop Before It Starts ($67)'

    // Track page view with product ID
    trackProductPageView('fire-starter').then((sessionId) => {
      sessionIdRef.current = sessionId
    })

    // Track page exit when user leaves
    const handleBeforeUnload = () => {
      if (sessionIdRef.current) {
        const timeOnPage = Date.now() - pageLoadTime.current
        trackPageExit(sessionIdRef.current, timeOnPage)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Show sticky bar after scrolling 200px down the page
  useEffect(() => {
    const getScrollTop = () => {
      if (typeof window === 'undefined') return 0
      return (
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement?.scrollTop ||
        document.body?.scrollTop ||
        0
      )
    }

    const handleScroll = () => {
      const scrollTop = getScrollTop()
      const shouldShow = scrollTop > 200
      setShowStickyBar(shouldShow)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track scroll depth milestones
  useScrollDepth({
    milestones: [25, 50, 75, 90, 100],
    onMilestone: (milestone) => {
      if (sessionIdRef.current) {
        const timeSincePageLoad = Date.now() - pageLoadTime.current
        trackScrollDepth(sessionIdRef.current, milestone, timeSincePageLoad)
      }
    },
  })

  const handleBuyClick = useCallback((buttonLocation: string) => {
    if (sessionIdRef.current) {
      const timeSincePageLoad = Date.now() - pageLoadTime.current
      trackBuyButtonClick(sessionIdRef.current, timeSincePageLoad, buttonLocation)
    }
    console.log('Buy button clicked from:', buttonLocation)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar
        message={<><strong>🎉 Quiz-Taker Access Unlocked:</strong> Get the F.I.R.E. Protocol for $67 (Regular $197)</>}
        variant="emerald"
      />
      <TopBar />

      <main className="flex-1 bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 relative overflow-hidden">
        {/* Organic Background Blobs - Subtle Tropical Feel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
        </div>

      {/* Product Section - Shopify Style */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-16 relative z-10">

        {/* Breadcrumb */}
        <div className="hidden md:block text-sm text-emerald-700/70 mb-8">
          <a href="/" className="hover:text-emerald-800 transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span className="text-emerald-900 font-medium">F.I.R.E. Protocol</span>
        </div>

        {/* Product Grid - Image Left | Details Right */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">

          {/* LEFT - Product Image */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="aspect-square flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-white/80 via-emerald-50/60 to-amber-50/50 shadow-[0_8px_32px_rgba(16,185,129,0.12),0_16px_48px_rgba(245,158,11,0.08)] ring-1 ring-white/40 backdrop-blur-xl relative">
              {/* Subtle glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-amber-400/10 blur-2xl"></div>
              <img
                src="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/DailyHush.png?v=1760474170"
                alt="F.I.R.E. Protocol - Stop Your 2 AM Thought Spirals"
                className="w-full h-full object-cover relative z-10"
              />
            </div>

          </div>

          {/* RIGHT - Product Details */}
          <div>

            {/* Rating + Social Proof Combined */}
            <div className="mb-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-500 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-emerald-700 text-sm font-medium">4.9/5 (847 reviews)</span>
              </div>
              <p className="text-xs text-emerald-800/80 mb-1">
                847 analytical thinkers • 90-sec avg. reset
              </p>
              <p className="text-xs text-amber-700 font-medium">
                78% use digital daily • 91% print emergency cards
              </p>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-emerald-900 mb-3 leading-tight">
              Your Body Decides You're Exposed 7 Seconds Before Your Thoughts Form.
            </h1>

            {/* Opening Hook */}
            <p className="text-base md:text-lg text-emerald-800 mb-3 leading-[1.7]">
              "I should've known better." If you've said that phrase even once this month, you're experiencing what 296 women described in our research: not regular overthinking, but something deeper.
            </p>

            {/* What it's actually about */}
            <p className="text-base md:text-lg text-emerald-800 mb-3 leading-[1.7]">
              You can't stop replaying how you came across, what they thought, whether they saw through you. That email you sent—did it expose you don't understand this? That meeting where you spoke up—did they notice you were faking it? That exam you took—did it reveal you don't know enough? You're not overthinking <strong>outcomes</strong>. You're obsessing over whether you <strong>exposed your inadequacy</strong>.
            </p>

            {/* F.I.R.E. mechanism - tightened */}
            <p className="text-base md:text-lg text-emerald-800 mb-3 leading-[1.7]">
              Nothing has worked because you've been treating the wrong problem. <strong>F.I.R.E. targets the 7-second window before the spiral starts</strong>—when your body decides you're unsafe.
            </p>

            {/* Why thought-based tools fail */}
            <p className="text-base text-emerald-800 mb-4 leading-[1.7]">
              You can't think your way out of a nervous system response. Journaling, meditation, CBT—they target thoughts. F.I.R.E. targets the physiological shutdown <em>before</em> thoughts form.
            </p>

            {/* Clinical proof */}
            <p className="text-base text-emerald-800 mb-6 leading-[1.7]">
              <strong>Clinical frameworks therapists charge $150/hour to teach:</strong> Polyvagal Theory (Yale), Metacognitive Therapy (Manchester), Rumination-Focused CBT (Exeter)—in a system you can use at 2 AM.
            </p>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-emerald-200/40">
              <div className="flex items-baseline gap-2 md:gap-3 mb-2 flex-wrap">
                <span className="text-2xl md:text-3xl text-emerald-600/60 line-through">$197</span>
                <span className="text-3xl md:text-4xl font-bold text-emerald-900">$67</span>
                <span className="text-base md:text-lg text-emerald-700/70 font-medium">Quiz-Taker Rate</span>
              </div>
              <div className="text-sm text-emerald-700/80 leading-relaxed">
                The same protocol trauma therapists charge $750 to teach over 6 sessions. Quiz-takers who've proven they're coachable get immediate access.
              </div>
            </div>

            {/* What's Included - Tightened */}
            <div className="mb-6 pb-6 border-b border-emerald-200/40">
              <h3 className="font-display font-bold text-emerald-900 mb-3 text-sm">What You Get:</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 items-start text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90"><strong>Digital workspace</strong> with 4-step protocol, emergency cards, rumination diary</span>
                </li>
                <li className="flex gap-2 items-start text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90"><strong>Clinical Exercise Library</strong> — Body-based interruption techniques. No thought-challenging. Just intercept, reset, redirect.</span>
                </li>
                <li className="flex gap-2 items-start text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90"><strong>Printable emergency cards</strong> (91% print them)</span>
                </li>
                <li className="flex gap-2 items-start text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90"><strong>Lifetime updates</strong> as research evolves</span>
                </li>
              </ul>
            </div>

            {/* Buy Button */}
            <div className="mb-6">
              <ShopifyBuyButton
                productId="10761797894447"
                domain="t7vyee-kc.myshopify.com"
                storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                buttonText="Get F.I.R.E. Protocol — $67"
                buttonColor="#16a34a"
                buttonHoverColor="#15803d"
                onClick={() => handleBuyClick('hero')}
                className="w-full"
              />
            </div>

            {/* Trust Signals */}
            <TrustSignals signals={fireStarterProductData.trustSignals} />

            {/* Guarantee Box */}
            <div className="p-6 bg-amber-50/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(245,158,11,0.12)] ring-1 ring-white/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-emerald-900 mb-2">30-Day "Break Overthinking or It's Free" Guarantee</h4>
                  <p className="text-sm text-emerald-800/80 leading-[1.6]">
                    Try F.I.R.E. for 30 days. If you don't break your pattern, email us for a full refund. Keep everything.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Research-Backed Section */}
        <div className="p-8 md:p-10 mb-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-emerald-900 mb-6 text-center leading-[1.2]">
            {fireStarterProductData.research.title}
          </h2>
          <p className="text-center text-emerald-700/80 mb-10 max-w-2xl mx-auto">
            {fireStarterProductData.research.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {fireStarterProductData.research.items.map((item, index) => (
              <div key={index} className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200/30">
                <h3 className="font-bold text-emerald-900 mb-2">{item.title}</h3>
                <p className="text-sm text-emerald-700/70 mb-3">{item.institution}</p>
                <p className="text-sm text-emerald-800/80 leading-[1.6]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Sections */}
        {fireStarterProductData.features.map((feature, index) => (
          <ProductFeatureSection
            key={index}
            title={feature.title}
            description={feature.description}
            subdescription={feature.subdescription}
            features={feature.features}
            imageUrl={feature.imageUrl}
            videoUrl={feature.videoUrl}
            imageAlt={feature.imageAlt}
            imagePosition={feature.imagePosition}
            testimonial={feature.testimonial}
          />
        ))}

        {/* Comparison Table */}
        <ComparisonTable
          title={fireStarterProductData.comparison.title}
          columns={fireStarterProductData.comparison.columns}
          rows={fireStarterProductData.comparison.rows}
          highlightColumn={0}
        />

        {/* Cost of Delay Section */}
        <CostOfDelaySection
          title={fireStarterProductData.costOfDelay.title}
          intro={fireStarterProductData.costOfDelay.intro}
          callout={fireStarterProductData.costOfDelay.callout}
          delayTitle={fireStarterProductData.costOfDelay.delayTitle}
          delayPeriod={fireStarterProductData.costOfDelay.delayPeriod}
          costs={fireStarterProductData.costOfDelay.costs}
          behavioralProof={fireStarterProductData.costOfDelay.behavioralProof}
          conclusion={fireStarterProductData.costOfDelay.conclusion}
        />

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-emerald-900 text-center mb-8 md:mb-10 leading-[1.2]">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 md:space-y-5">
            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Will this actually stop my overthinking?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                The F.I.R.E. protocol doesn't promise you'll never overthink again—that's not realistic. But it gives you a proven 4-step system to interrupt the spiral <em>before</em> it steals hours of your life. Most women notice a difference within the first 48 hours of using it.
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                How is this different from meditation apps?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                Meditation asks you to "clear your mind." F.I.R.E. knows that's impossible when you're spiraling. Instead, it gives you pattern breaks, trigger trackers, and decision frameworks that work <em>with</em> your overthinking brain—not against it.
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                What if F.I.R.E. doesn't work for me?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                We've got you covered. Try F.I.R.E. for 30 days. If you don't break your pattern, email us for a full refund—keep everything. We're confident in the research. We know it works. But if it doesn't work for YOU, we don't want your money.
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                I've tried everything. How is F.I.R.E. different?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                <p className="mb-3">That's the right question. Here's the difference:</p>
                <p className="mb-2"><strong>Meditation apps</strong> target your thoughts. By the time you're thinking, you're already dysregulated. Too late.</p>
                <p className="mb-2"><strong>Therapy</strong> teaches these same frameworks over 6-8 sessions at $150/hour. Total cost: $750-900.</p>
                <p className="mb-2"><strong>Journaling</strong> helps you process after, but doesn't give you a tool to interrupt in the moment.</p>
                <p className="mb-3"><strong className="text-amber-700">F.I.R.E.</strong> gives you the SAME clinical frameworks (Polyvagal regulation, Metacognitive Therapy, Rumination-Focused techniques) in a system you can use at 2 AM when you're spiraling. It targets the physiological shutdown that happens <em>before</em> the thought spiral—the vagal response that traps you in your head.</p>
                <p>If this doesn't work, keep everything and get your money back. That's not a risk—that's me putting my money where my research is.</p>
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Can't I just Google these techniques?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                You could. But here's what happens: You'll find 47 articles, 12 conflicting techniques, and no clear system. You'll spend 3 hours researching, bookmark everything, and never implement it. F.I.R.E. is the distilled version—3 clinical frameworks, 1 system, ready to use tonight. No research rabbit holes.
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Why is this only $67? What's the catch?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                No catch. This is a frontend offer—we make money when buyers love it and come back for advanced training. But F.I.R.E. Protocol stands alone. You don't need anything else. The $67 quiz-taker rate is reserved for people who completed the assessment because your results are calibrated and fresh. It helps you implement faster.
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Is this just a PDF?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                No—it's primarily a digital workspace you can access from any device at 2 AM when your brain won't shut up. The 4-step protocol, emergency reset cards, trigger tracker, rumination diary, and all clinical exercises are organized in one place. 78% of users access it digitally every day. You also get printable versions of the emergency cards if you prefer physical backups—91% print them to keep in their wallet or bedside. Use it digitally, print what helps, or both. It's designed for actual use, not recurring revenue.
              </div>
            </details>

            <details className="group bg-white/70 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                I'm skeptical. How do I know this isn't just pop psychology?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                You should be skeptical—that's why you scored high on the quiz. F.I.R.E. isn't based on Instagram infographics. It's compiled from peer-reviewed research: Rumination-Focused CBT (University of Exeter, 78% reduction in rumination episodes), Polyvagal Theory (Yale), and Metacognitive Therapy (University of Manchester, 70% improvement in worry reduction). We cite our sources. We show the data. If you're analytical, you'll appreciate the research section above.
              </div>
            </details>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          overallRating={fireStarterProductData.reviews.overallRating}
          totalReviews={fireStarterProductData.reviews.totalReviews}
          reviews={fireStarterProductData.reviews.featured}
        />

        {/* Sticky Add to Cart Bar - Using conditional className (not conditional rendering) */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-emerald-200/30 p-4 shadow-[0_-8px_32px_rgba(16,185,129,0.12)] ring-1 ring-white/20 z-50 transition-transform duration-500 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-emerald-900">$67</div>
              <div className="text-xs text-emerald-600/60 line-through">$197</div>
            </div>
            <div className="flex-1">
              <ShopifyBuyButton
                productId="10761797894447"
                domain="t7vyee-kc.myshopify.com"
                storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                buttonText="Get F.I.R.E. Protocol"
                buttonColor="#16a34a"
                buttonHoverColor="#15803d"
                onClick={() => handleBuyClick('sticky-bar')}
                className="w-full"
              />
            </div>
          </div>
        </div>

      </div>

      </main>

      <Footer variant="emerald" />
    </div>
  )
}
