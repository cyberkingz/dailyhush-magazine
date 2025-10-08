import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, Shield, Truck, Clock } from 'lucide-react'
import ShopifyBuyButton from '@/components/ShopifyBuyButton'
import AnnouncementBar from '@/components/AnnouncementBar'
import { TopBar } from '@/components/layout/TopBar'
import { Footer } from '@/components/layout/Footer'

export default function FireStarterProduct() {
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    document.title = '🔥 F.I.R.E. KIT — Stop Your 2 AM Thought Spirals'
  }, [])

  // Show sticky bar after scrolling past 40% of page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollTop / docHeight) * 100
      setShowStickyBar(scrollPercentage >= 40)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCheckoutComplete = useCallback(() => {
    console.log('Checkout initiated - track Facebook Pixel event here')
    // TODO: Add Facebook Pixel tracking
    // fbq('track', 'InitiateCheckout', { product: 'fire_starter_kit' })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar
        message={<><strong>🎁 Quiz-Taker Special:</strong> You're getting $70 off — Your personalized F.I.R.E. KIT is waiting for just $27</>}
        variant="emerald"
      />
      <TopBar />

      <main className="flex-1 bg-gradient-to-br from-emerald-50/20 via-white to-amber-50/10 relative overflow-hidden">
        {/* Organic Background Blobs - Subtle Tropical Feel */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl"></div>
        </div>

      {/* Product Section - Shopify Style */}
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-16 relative z-10">

        {/* Breadcrumb */}
        <div className="hidden md:block text-sm text-emerald-700/70 mb-8">
          <a href="/" className="hover:text-emerald-800 transition-colors">Home</a>
          <span className="mx-2">/</span>
          <span className="text-emerald-900 font-medium">F.I.R.E. KIT</span>
        </div>

        {/* Product Grid - Image Left | Details Right */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">

          {/* LEFT - Product Image */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <div className="aspect-square flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-white/70 via-emerald-50/60 to-amber-50/50 shadow-[0_8px_32px_rgba(16,185,129,0.12),0_16px_48px_rgba(245,158,11,0.08)] ring-1 ring-white/40 backdrop-blur-xl relative">
              {/* Subtle glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-amber-400/10 blur-2xl"></div>
              <img
                src="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/Gemini_Generated_Image_xlokz8xlokz8xlok.png?v=1759926873"
                alt="F.I.R.E. KIT - Stop Your 2 AM Thought Spirals"
                className="w-full h-full object-cover relative z-10"
              />
            </div>

            {/* Thumbnails - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-4 gap-3">
              <div className="aspect-square rounded-2xl border-2 border-amber-400/30 ring-1 ring-white/40 overflow-hidden shadow-[0_4px_16px_rgba(245,158,11,0.15)]">
                <img
                  src="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/Gemini_Generated_Image_xlokz8xlokz8xlok.png?v=1759926873"
                  alt="F.I.R.E. KIT thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-white/60 rounded-2xl border border-emerald-200/40 opacity-60 backdrop-blur-xl ring-1 ring-white/30"></div>
              <div className="aspect-square bg-white/60 rounded-2xl border border-emerald-200/40 opacity-60 backdrop-blur-xl ring-1 ring-white/30"></div>
              <div className="aspect-square bg-white/60 rounded-2xl border border-emerald-200/40 opacity-60 backdrop-blur-xl ring-1 ring-white/30"></div>
            </div>
          </div>

          {/* RIGHT - Product Details */}
          <div>

            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-display font-bold text-emerald-900 mb-4">
              F.I.R.E. KIT
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 md:gap-3 mb-2 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-emerald-900">$27</span>
                <span className="text-xl md:text-2xl text-emerald-600/60 line-through">$97</span>
                <span className="bg-amber-500 text-white text-xs md:text-sm font-semibold px-2.5 md:px-3 py-1 rounded-full shadow-[0_4px_16px_rgba(245,158,11,0.4)]">
                  Save $70
                </span>
              </div>
              <div className="text-sm text-amber-700 font-medium">
                ⏰ Limited time quiz-taker price
              </div>
            </div>

            {/* Short Description */}
            <div className="mb-8 pb-8 border-b border-emerald-200/40">
              <p className="text-lg text-emerald-800 mb-4 leading-[1.7]">
                The exact system that helped 127+ women stop 2 AM thought spirals and finally quiet their racing minds—after years of trying meditation apps that didn't work.
              </p>
              <p className="text-emerald-700/80 leading-[1.6]">
                You took the quiz. You know your overthinker type. Now get the proven F.I.R.E. framework that breaks the mental loop the moment it starts.
              </p>
            </div>

            {/* What's Included */}
            <div className="mb-4 pb-4 border-b border-emerald-200/40">
              <h3 className="font-display font-bold text-emerald-900 mb-4">What's included:</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90">Window of Tolerance — Catch your mind before it spirals into overwhelm.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90">Cognitive Distortions — Name the thought trap, break the loop in seconds.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90">Coping Strategies Wheel — Find the right reset for your mood in 30 seconds, not 3 hours.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90">What Do You Value? — Stop chasing "what ifs," reconnect with what actually matters.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-emerald-800/90">Overthinking Journal — Racing thoughts → clarity in 5 minutes flat.</span>
                </li>
              </ul>
            </div>

            {/* Buy Button */}
            <div className="mb-6">
              <ShopifyBuyButton
                productId="10761049702703"
                domain="t7vyee-kc.myshopify.com"
                storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                buttonText="Get F.I.R.E. Kit — $27"
                buttonColor="#f59e0b"
                buttonHoverColor="#d97706"
                onCheckoutComplete={handleCheckoutComplete}
                className="w-full"
              />
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="flex flex-col items-center text-center gap-2 text-sm text-emerald-700/80">
                <Truck className="w-5 h-5 text-amber-600" />
                <span>Instant digital delivery via email</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-sm text-emerald-700/80">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>Secure checkout powered by Shopify</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 text-sm text-emerald-700/80">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>Set up in your Notion in under 2 minutes</span>
              </div>
            </div>

            {/* Guarantee Box */}
            <div className="p-6 bg-amber-50/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(245,158,11,0.12)] ring-1 ring-white/40">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_4px_20px_rgba(245,158,11,0.4)]">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-emerald-900 mb-2">Your Brain Feels Lighter — Or Your Money Back</h4>
                  <p className="text-sm text-emerald-800/80 leading-[1.6]">
                    Use the F.I.R.E. protocol for 30 days. If you're still stuck in the same thought loops, email me and I'll refund you—no questions asked.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Section 1 - Image Left | Text Right */}
        <div className="p-8 md:p-10 mb-20 bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40 hover:shadow-[0_12px_48px_rgba(16,185,129,0.12)] transition-all duration-500 hover:-translate-y-1">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="aspect-square flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/50 shadow-[0_8px_24px_rgba(16,185,129,0.1)] ring-1 ring-white/40 backdrop-blur-md">
              <img
                src="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/Gemini_Generated_Image_h9xlixh9xlixh9xl.png?v=1759927378"
                alt="Stop Overthinking. Start Living."
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-display font-bold text-emerald-900 mb-4 leading-[1.2]">
              Stop Overthinking. Start Living.
            </h2>
            <p className="text-lg text-emerald-800 mb-4 leading-[1.7]">
              Most tools try to help you "think better." This helps you <strong className="text-amber-700">stop thinking so much</strong>.
            </p>
            <p className="text-emerald-700/80 mb-6 leading-[1.6]">
              The F.I.R.E. framework forces you to interrupt the spiral the moment it starts—before it steals hours of your life replaying conversations you can't change.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <span className="text-emerald-800/90">Pre-made pattern break scripts (no more "I can't turn my brain off")</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <span className="text-emerald-800/90">Thought loop tracker to spot triggers before they spiral</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                <span className="text-emerald-800/90">Bedtime reset ritual that quiets your mind in under 5 minutes</span>
              </li>
            </ul>
          </div>
        </div>
        </div>

        {/* Feature Section 2 - Text Left | Image Right */}
        <div className="p-8 md:p-10 mb-20 bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(16,185,129,0.08)] ring-1 ring-white/40 hover:shadow-[0_12px_48px_rgba(16,185,129,0.12)] transition-all duration-500 hover:-translate-y-1">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-emerald-900 mb-4 leading-[1.2]">
              Built For Your Overthinker Type
            </h2>
            <p className="text-lg text-emerald-800 mb-4 leading-[1.7]">
              You already know your type from the quiz. This kit gives you the exact tools to break <em className="text-amber-700 not-italic font-semibold">your</em> specific pattern.
            </p>
            <p className="text-emerald-700/80 mb-6 leading-[1.6]">
              Whether you're a Mindful Thinker, Gentle Analyzer, Chronic Overthinker, or Overthinkaholic—the F.I.R.E. framework gives you the exact steps to interrupt your mental loops before they take over.
            </p>
            <div className="border-l-4 border-amber-500 p-6 bg-amber-50/60 backdrop-blur-xl rounded-r-2xl shadow-[0_4px_16px_rgba(245,158,11,0.08)] ring-1 ring-white/30">
              <p className="text-emerald-800/90 italic">
                "I used to lie awake for 2 hours replaying my workday. With F.I.R.E., I fall asleep in 10 minutes now. My brain finally shuts up."
              </p>
              <p className="text-sm text-emerald-700/70 mt-3">— Sarah K., Chronic Overthinker</p>
            </div>
          </div>
          <div>
            <div className="aspect-square flex items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-white/70 via-emerald-50/60 to-teal-50/50 shadow-[0_8px_24px_rgba(16,185,129,0.1)] ring-1 ring-white/40 backdrop-blur-md">
              <img
                src="https://cdn.shopify.com/s/files/1/0957/4914/4879/files/Gemini_Generated_Image_3mejzc3mejzc3mej.png?v=1759927377"
                alt="Built For Your Overthinker Type"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        </div>

        {/* Social Proof Section - Compact Row */}
        <div className="py-4 md:py-6 mb-12 bg-amber-50/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_24px_rgba(245,158,11,0.1)] ring-1 ring-white/40 max-w-2xl mx-auto">
          <div className="flex flex-row items-center gap-3 md:gap-8 justify-center px-3">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700 leading-none">127+</div>
              <div className="text-[10px] md:text-xs text-emerald-700/70 mt-1">Women Helped</div>
            </div>
            <div className="w-px h-8 md:h-9 bg-emerald-300/30"></div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700 leading-none">90sec</div>
              <div className="text-[10px] md:text-xs text-emerald-700/70 mt-1">Avg. Reset Time</div>
            </div>
            <div className="w-px h-8 md:h-9 bg-emerald-300/30"></div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-amber-700 leading-none">4.9/5</div>
              <div className="text-[10px] md:text-xs text-emerald-700/70 mt-1">Customer Rating</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-emerald-900 text-center mb-8 md:mb-10 leading-[1.2]">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 md:space-y-5">
            <details className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Do I need Notion to use this?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                Yes, but Notion is free! You can use the F.I.R.E. KIT with a free Notion account. Just click the "Duplicate" button and it's yours forever.
              </div>
            </details>

            <details className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Will this actually stop my overthinking?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                The F.I.R.E. protocol doesn't promise you'll never overthink again—that's not realistic. But it gives you a proven 4-step system to interrupt the spiral <em>before</em> it steals hours of your life. Most women notice a difference within the first 48 hours of using it.
              </div>
            </details>

            <details className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                How is this different from meditation apps?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                Meditation asks you to "clear your mind." F.I.R.E. knows that's impossible when you're spiraling. Instead, it gives you pattern breaks, trigger trackers, and decision frameworks that work <em>with</em> your overthinking brain—not against it.
              </div>
            </details>

            <details className="group bg-white/60 backdrop-blur-xl rounded-2xl border border-emerald-200/30 shadow-[0_4px_16px_rgba(16,185,129,0.06)] ring-1 ring-white/30 hover:shadow-[0_6px_24px_rgba(16,185,129,0.1)] transition-all duration-300">
              <summary className="cursor-pointer list-none p-4 md:p-6 font-semibold text-emerald-900 hover:text-amber-700 transition text-sm md:text-base">
                Can I get a refund?
                <span className="float-right group-open:rotate-180 transition-transform text-amber-600">▼</span>
              </summary>
              <div className="px-4 md:px-6 pb-4 md:pb-6 text-emerald-800/80 text-sm md:text-base leading-[1.6]">
                Yes. Use the F.I.R.E. protocol for 30 days. If you're still stuck in the same thought loops, email me at hello@daily-hush.com and I'll refund you—no questions asked.
              </div>
            </details>
          </div>
        </div>

        {/* Sticky Add to Cart Bar (Mobile) */}
        <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-emerald-200/30 p-4 shadow-[0_-8px_32px_rgba(16,185,129,0.12)] ring-1 ring-white/20 z-50 transition-transform duration-500 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-emerald-900">$27</div>
              <div className="text-xs text-emerald-600/60 line-through">$97</div>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-full transition-all shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95"
            >
              Get F.I.R.E. Kit
            </button>
          </div>
        </div>

      </div>

      </main>

      <Footer variant="emerald" />
    </div>
  )
}
