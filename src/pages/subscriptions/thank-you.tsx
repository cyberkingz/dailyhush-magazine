import { useEffect, useState, useRef } from 'react'
import { CheckCircle, DollarSign, ArrowRight, Flame } from 'lucide-react'
import { CheckoutButton } from '../../components/stripe/CheckoutButton'
import { UrgencyBanner } from '../../components/UrgencyBanner'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'

function ThankYouPageContent() {
  const [showNotification, setShowNotification] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const { decrementSpots, spotsRemaining, totalSpots, isCritical, isSoldOut } = useScarcity()

  // Use ref to track latest spots value without triggering effect re-runs
  const spotsRemainingRef = useRef(spotsRemaining)
  const youAskedBadgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    spotsRemainingRef.current = spotsRemaining
  }, [spotsRemaining])

  // Get email from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const userEmail = urlParams.get('email') || undefined
  
  // Purchase notifications only - each triggers -1 spot
  const notifications = [
    { name: "Sarah", location: "New York", action: "just purchased F.I.R.E. Kit", time: "Just now", isPurchase: true },
    { name: "Mike", location: "San Francisco", action: "just purchased F.I.R.E. Kit", time: "1 min ago", isPurchase: true },
    { name: "Jessica", location: "Austin", action: "just purchased F.I.R.E. Kit", time: "2 min ago", isPurchase: true },
    { name: "David", location: "Miami", action: "just purchased F.I.R.E. Kit", time: "3 min ago", isPurchase: true },
    { name: "Emma", location: "Seattle", action: "just purchased F.I.R.E. Kit", time: "4 min ago", isPurchase: true },
    { name: "Alex", location: "Chicago", action: "just purchased F.I.R.E. Kit", time: "5 min ago", isPurchase: true },
    { name: "Lisa", location: "Boston", action: "just purchased F.I.R.E. Kit", time: "6 min ago", isPurchase: true },
    { name: "Tom", location: "Portland", action: "just purchased F.I.R.E. Kit", time: "7 min ago", isPurchase: true },
    { name: "Rachel", location: "Denver", action: "just purchased F.I.R.E. Kit", time: "8 min ago", isPurchase: true },
    { name: "Kevin", location: "Atlanta", action: "just purchased F.I.R.E. Kit", time: "9 min ago", isPurchase: true }
  ]

  useEffect(() => {
    document.title = 'F.I.R.E. Starter Kit — DailyHush'
  }, [])

  // Track scroll position for sticky bar - show after 15% scroll, but only above badge
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollTop / docHeight) * 100

      // Check if user is above the badge
      let isAboveBadge = true
      if (youAskedBadgeRef.current) {
        const badgePosition = youAskedBadgeRef.current.getBoundingClientRect().top + window.scrollY
        const viewportBottom = scrollTop + window.innerHeight

        // If viewport bottom has passed the badge, we're below/at the badge
        isAboveBadge = viewportBottom < badgePosition
      }

      // Show after 15% scroll AND only if above the badge
      setShowStickyBar(scrollPercentage >= 15 && isAboveBadge)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Purchase notifications effect - each notification decrements spots
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const showNextNotification = () => {
      // Check current spots using ref (always has latest value)
      if (spotsRemainingRef.current <= 0) {
        // Clear interval if sold out
        if (intervalId) {
          clearInterval(intervalId)
        }
        setShowNotification(false)
        return
      }

      // Every notification is a purchase, so decrement spots
      decrementSpots()

      // Show notification with slide-up
      setShowNotification(true)
      setIsExiting(false)

      // After 4 seconds, start exit animation (slide down)
      setTimeout(() => {
        setIsExiting(true)

        // After exit animation completes (500ms), hide and move to next
        setTimeout(() => {
          setShowNotification(false)
          setCurrentNotification((prev) => (prev + 1) % notifications.length)
        }, 500)
      }, 4000)
    }

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showNextNotification()
      intervalId = setInterval(showNextNotification, 28000) // 28 seconds = ~20 minutes total
    }, 5000) // Initial delay: 5 seconds

    return () => {
      clearTimeout(initialTimeout)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [currentNotification, decrementSpots])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex justify-center items-stretch">
      {/* Floating Purchase Notification - iOS Glassmorphic Style */}
      {showNotification && (
        <div className={`fixed top-4 left-4 right-4 sm:top-auto sm:bottom-8 sm:left-8 sm:right-auto z-50 transition-all duration-500 ${
          isExiting ? 'animate-slide-down' : 'animate-slide-from-top sm:animate-slide-up'
        }`}>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-4 flex items-center gap-3 max-w-sm overflow-hidden mx-auto sm:mx-0">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-rose-50/20 to-orange-50/30 pointer-events-none" />

            {/* Content */}
            <div className="relative flex items-center gap-3 w-full">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {notifications[currentNotification].name} from {notifications[currentNotification].location}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {notifications[currentNotification].action} • {notifications[currentNotification].time}
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="text-xs font-semibold text-amber-700 bg-amber-100/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-amber-200/50">
                  SOLD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar - Premium Redesign */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden transition-transform duration-500 ease-out ${
        showStickyBar ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Multi-layer glassmorphic background */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-white/95 backdrop-blur-2xl" />

        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />

        {/* Content container */}
        <div className="relative px-4 py-4 space-y-3">
          {/* Spots Counter Bar */}
          {!isSoldOut && (
            <div className="space-y-2">
              {/* Progress bar */}
              <div className="relative w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isCritical
                      ? 'bg-gradient-to-r from-rose-400 to-pink-400'
                      : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                  }`}
                  style={{ width: `${(spotsRemaining / totalSpots) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                </div>
              </div>

              {/* Counter text */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-700">
                <Flame className={`h-3.5 w-3.5 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
                <span>{spotsRemaining}/{totalSpots} spots left today</span>
              </div>
            </div>
          )}

          {/* Primary CTA - Full width clean button */}
          <CheckoutButton
            email={userEmail}
            variant="cta"
            size="lg"
            className="
              w-full relative group
              px-6 py-4
              rounded-2xl
              text-base font-bold tracking-wide
              transition-all duration-300 ease-out
              active:scale-[0.98]
              bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30
            "
            showPricing={false}
            showTrustSignals={false}
          >
            <span className="flex items-center justify-center gap-2">
              <span>Get F.I.R.E. Kit</span>
              <span className="text-amber-50/80">•</span>
              <span className="font-black">$27</span>
            </span>

            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 via-transparent to-white/10 pointer-events-none" />
          </CheckoutButton>

          {/* Trust signal - Simple */}
          <div className="flex items-center justify-center text-xs text-slate-600">
            <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0 mr-1" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        {/* Safe area padding for iPhone */}
        <div className="h-safe-area-inset-bottom bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1">
        <div className="bg-white border-2 border-gray-300 flex-1 flex flex-col overflow-hidden pb-20 sm:pb-0">
          {/* Urgency Banner Component */}
          <UrgencyBanner
            productName="F.I.R.E. STARTER KIT"
            tagline="Stop planning. Start shipping."
            showSocialProof={true}
            regularPrice={47}
          />

          <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">
        {/* Letter Header */}
        <div className="mb-16">
          <p className="text-lg text-gray-600 mb-2">✅ You're subscribed to DailyHush!</p>
          <p className="text-gray-600 mb-12">(Check your email to confirm • First issue arrives in 24h)</p>

          <p className="text-xl text-gray-900 leading-relaxed max-w-3xl mx-auto mb-16">
            But wait… before you go:
          </p>

          {/* Business Voyeur Section */}
          <div className="space-y-6 text-lg text-gray-900 leading-relaxed">
            <p>You've said <em>"I'm launching soon"</em> for months.</p>
            <p>You've rewritten your plan 3 times.</p>
            <p>You've got more tools than customers.</p>
            <p className="text-xl font-bold text-gray-900">
              The brutal truth? You're not an entrepreneur yet.
            </p>
            <p className="text-xl">
              You're a <strong>business voyeur</strong> — addicted to the <em>feeling</em> of progress without ever getting paid for it.
            </p>
            <p>
              And every week you stay in this loop is another week a less talented founder gets paid with a worse idea.
            </p>
          </div>
        </div>
          
          {/* Why Smart People Stay Broke */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Smart People Stay Broke
            </h2>
            <div className="space-y-6 text-lg text-gray-900 leading-relaxed">
              <p>You think planning keeps you safe.</p>
              <p>You think more research = less risk.</p>
              <p className="font-semibold">
                But in reality, planning is just procrastination in a business suit.
              </p>
              <p>
                Your brain is hooked on the dopamine of "getting ready" —
              </p>
              <p className="text-xl font-bold">
                while your bank account stays stuck at <strong>$0</strong>.
              </p>
            </div>
          </div>

          {/* Hidden Addiction */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Hidden Addiction You Never Noticed
            </h2>
            <div className="space-y-6 text-lg text-gray-900 leading-relaxed">
              <p>It's not Netflix keeping you broke.</p>
              <p>It's collecting business ideas you never ship.</p>
              <p>You don't need another plan.</p>
              <p>You don't need another tool.</p>
              <p className="text-xl font-bold">
                👉 You need your <strong>first payment</strong> — in the next 48 hours.
              </p>
            </div>
          </div>

          {/* The Cure: F.I.R.E. */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              The Cure: The F.I.R.E. Starter Kit (48-Hour Protocol)
            </h2>
            <p className="text-lg text-gray-900 mb-8 leading-relaxed">
              A 4-step reset that forces you to ship, not plan:
            </p>
            <div className="space-y-4 text-lg text-gray-900 leading-relaxed mb-8">
              <p><strong>F — Focus</strong> → Kill the 22 ideas. Pick 1.</p>
              <p><strong>I — Imperfect</strong> → Launch embarrassingly simple.</p>
              <p><strong>R — Revenue</strong> → Get 1 stranger to pay you.</p>
              <p><strong>E — Evolve</strong> → Improve with customer money, not imagination.</p>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              In 48 hours, you'll go from <em>"I'm preparing"</em> → to <em>"I already got paid."</em>
            </p>
          </div>

          {/* Step 0: Try It Now */}
          <div className="mb-16 flex justify-center">
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-4 border-dashed border-blue-400 rounded-2xl p-10 text-center max-w-md w-full aspect-square flex flex-col justify-center items-center shadow-lg">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 tracking-tight">
                Step 0: Try It Now <span className="text-blue-600">(Free)</span>
              </h2>
              <div className="space-y-4 text-base text-gray-800 leading-relaxed">
                <p>Take your 3 favorite business ideas.</p>
                <p>Delete two.</p>
                <p className="font-bold bg-white/60 px-4 py-2 rounded-lg">
                  Congrats — you've just done <strong className="text-blue-600">F (Focus)</strong>.
                </p>
                <p className="text-sm">The kit gives you I, R, and E in the next 48h.</p>
              </div>
            </div>
          </div>

          {/* What You'll Get Inside */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What You'll Get Inside
            </h2>
            <p className="text-lg text-gray-900 mb-8 leading-relaxed">
              9 pre-filled steps, one Notion system, zero fluff.
            </p>

            <div className="space-y-8 text-lg text-gray-900 leading-relaxed">

              <div>
                <p className="font-bold text-xl mb-2">✅ Zero fluff methodology</p>
                <p className="mb-2">→ 9 steps, not 90.</p>
                <p><strong>What you get:</strong> Done/not done checklist, avatar template, TAM calculator, value prop worksheet.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ Speed over perfection</p>
                <p className="mb-2">→ Launch in 48h, not 48 weeks.</p>
                <p><strong>What you get:</strong> 48-hour roadmap, irresistible offer template, MVP checklist, 3 KPI trackers.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ Real validation</p>
                <p className="mb-2">→ Customers, not friends.</p>
                <p><strong>What you get:</strong> Interview scripts, validation framework, pivot tree.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ Product-Market Fit Roadmap</p>
                <p className="mb-2">→ From idea to paying customers.</p>
                <p><strong>What you get:</strong> Launch sequence, acquisition playbook, optimization framework.</p>
              </div>
            </div>
          </div>

          {/* Real Results */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Real Results
            </h2>

            <div className="space-y-6 text-lg text-gray-900 leading-relaxed mb-8">
              <p>
                • <strong>Sarah (Austin)</strong>: 8 months planning → first $500 client in 3 days → $8.2K/month in 6 months.
              </p>
              <p>
                • <strong>Michael (Miami)</strong>: 2 years validating ideas → pre-orders in 1 weekend. Quit job in 3 months.
              </p>
              <p>
                • <strong>David (Seattle)</strong>: Competitor "launching soon." He shipped with 3 features. Got 50 customers. Competitor still planning.
              </p>
            </div>

            <p className="text-xl font-bold text-gray-900">
              847 people used this system.
            </p>
            <p className="text-xl font-bold text-gray-900">
              Average time to <strong>first customer: 72h</strong>.
            </p>
          </div>

          {/* Phase 1: Teaser - Price Curiosity Hook */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Here's The Deal
            </h2>

            <div className="space-y-6 text-lg text-gray-900 leading-relaxed mb-8 text-center">
              <p>The regular price for this system is $387.</p>
              <p>That's what 847 founders already paid to get their first customer in 72 hours.</p>

              {/* Teaser Card - Creates Curiosity */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-dashed border-green-400 rounded-2xl p-10 text-center max-w-md w-full aspect-square flex flex-col justify-center items-center shadow-lg">
                  <p className="text-xl font-bold text-gray-700 mb-4">
                    But today you won't pay<br/>anywhere near that.
                  </p>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    For less than lunch, you can get the exact 48h system that launched 847 businesses...
                  </p>
                  <div className="bg-white/80 rounded-xl px-6 py-4 border-2 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">One-time investment:</p>
                    <p className="text-4xl font-black text-green-600">$27</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 italic">
                    (You're probably wondering: "What do I get for $27?"<br/>Keep reading... 👇)
                  </p>
                </div>
              </div>

              <p className="text-xl font-bold text-center">
                The price is nothing. The system could change your financial future forever.
              </p>
            </div>
          </div>

          {/* Let's Be Logical About Risk */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Let's Be Logical About Risk
            </h2>

            <div className="space-y-6 text-lg text-gray-900 leading-relaxed">
              <p>What's riskier?</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Spending $27 on a proven system that launched 847 businesses,</li>
                <li>Or staying stuck in research mode another year?</li>
              </ul>
              <p>
                If you launch <strong>just one offer</strong>, average first-month revenue = <strong>$1,200</strong>.
              </p>
              <p className="text-xl font-bold">
                That's 44× ROI.
              </p>
              <p>
                If you get <strong>just one customer</strong>, lifetime value = $300+.
              </p>
            </div>
          </div>

          {/* You Have Two Choices */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              You Have Two Choices Right Now
            </h2>

            <div className="space-y-8 text-lg text-gray-900 leading-relaxed">
              <div>
                <p className="font-bold text-xl mb-2">Choice #1: Do Nothing</p>
                <p>Stay stuck. Keep planning. 6 months from now, still broke.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">Choice #2: Invest $27</p>
                <p>Get the F.I.R.E. method. Launch in 48h. Get paid.</p>
                <p>Join 847 founders already inside.</p>
              </div>

              <p className="text-xl font-bold">
                👉 Which choice feels better?
              </p>
            </div>
          </div>

          {/* Limited-Time Subscriber Deal */}
          <div className="mb-16 flex justify-center">
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-4 border-dashed border-red-400 rounded-2xl p-10 text-center max-w-md w-full aspect-square flex flex-col justify-center items-center shadow-lg">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 tracking-tight">
                🎉 50K Subscriber Celebration
              </h2>
              <div className="space-y-4 text-base text-gray-800 leading-relaxed">
                <p className="font-semibold">
                  Only <span className="text-red-600 font-bold">50 spots</span> at <span className="text-red-600 font-bold">$27</span> today
                </p>
                <p className="text-sm text-gray-600">
                  (Regular price: $387)
                </p>
                <p className="bg-white/60 px-4 py-2 rounded-lg font-semibold">
                  Once sold out, price goes back to $387
                </p>
              </div>
            </div>
          </div>

            {/* My Unreasonable Guarantee */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                My "Unreasonable" Guarantee
              </h2>

              <div className="space-y-6 text-lg text-gray-900 leading-relaxed">
                <p>Use the system for 30 days.</p>
                <p>If you don't ship something in 48h, I refund you.</p>
                <p>Keep the kit. No questions asked.</p>
                <p className="text-xl font-bold">
                  The only way you lose…
                </p>
                <p className="text-xl font-bold">
                  …is by staying a <strong>chronic planner</strong>.
                </p>
              </div>
            </div>

            {/* Phase 2: Full Reveal Transition */}
            <div className="mb-12 text-center">
              <div ref={youAskedBadgeRef} className="inline-block bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 mb-3 sm:mb-4">
                <p className="text-sm sm:text-base md:text-lg font-black text-gray-900">
                  You asked: "What do I get for $27?"
                </p>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 max-w-2xl mx-auto px-4">
                Here's everything inside the F.I.R.E. Starter Kit 👇
              </p>
            </div>

            {/* Phase 2: Full Offer Reveal - Compact Stack */}
            <div className="mb-16 flex justify-center">
              <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-10 text-center max-w-lg w-full shadow-xl space-y-3 sm:space-y-4 md:space-y-6">

                {/* Headline */}
                <div className="space-y-1.5">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    Your notes are full.<br/>
                    Your Stripe is empty.
                  </p>
                  <div className="w-12 h-0.5 sm:h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
                </div>

                {/* Promise */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg px-4 py-2.5 sm:px-5 sm:py-3">
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    Your first paying customer in 48h
                  </p>
                </div>

                {/* Value + Price Combined */}
                <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                  <div className="p-3 sm:p-4 md:p-6 space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-700 leading-snug">48h Roadmap (PDF + Notion template)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-700 leading-snug">Customer Validation Script Pack</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-700 leading-snug">MVP Launch Checklist</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-gray-700 leading-snug">Offer Builder Worksheet</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 bg-white px-4 py-3 sm:px-6 sm:py-4 md:py-5 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Was: <span className="line-through">$387</span></p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">$27</p>
                    <p className="text-xs text-gray-500 mt-1">One-time payment</p>
                  </div>
                </div>

                {/* Guarantee Badge - Prominent */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 border-2 border-green-500 rounded-full px-3 py-1.5 sm:px-5 sm:py-2.5">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-green-700">30-Day "Ship or It's Free" Guarantee</span>
                </div>

                {/* CTA Button */}
                <div className="w-full space-y-1.5 sm:space-y-2">
                  <CheckoutButton
                    email={userEmail}
                    variant="cta"
                    size="lg"
                    className="w-full px-6 py-3.5 sm:px-8 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg font-black bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                    showPricing={false}
                    showTrustSignals={false}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Yes! I want my first customer in 48h → $27
                    </span>
                  </CheckoutButton>

                  {/* Scarcity - Subtle */}
                  <p className="text-xs text-center text-gray-500">
                    <span className="text-orange-600 font-semibold">⚡ Only {spotsRemaining}/50 spots left today</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-12 mt-16 px-8 md:px-16 pb-16 md:pb-20 space-y-8 max-w-3xl mx-auto">
            <p className="text-lg text-gray-900 leading-relaxed">
              <strong>P.S.</strong> Right now, someone with your exact skills and less planning just launched and made their first sale.
            </p>
            <p className="text-lg text-gray-900 leading-relaxed">
              The only difference? They stopped being a <strong>business voyeur</strong> and started shipping.
            </p>
            <p className="text-lg text-gray-900 leading-relaxed">
              You're already subscribed to DailyHush. But reading newsletters won't fix your $0 Stripe account. Only <strong>action</strong> will.
            </p>

            <div className="text-center space-y-4">
              <CheckoutButton
                email={userEmail}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-10 py-5 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-green-400"
                showPricing={false}
              >
                <DollarSign className="h-5 w-5" />
                Stop Planning. Start Shipping. ($27)
                <ArrowRight className="h-4 w-4" />
              </CheckoutButton>
            </div>

            <div className="space-y-2 text-left">
              <p className="text-lg text-gray-900">
                — Tony
              </p>
              <p className="text-gray-600">
                Founder, DailyHush
              </p>
              <p className="text-sm text-gray-500 italic">
                (Recovering business voyeur. Launched 3 businesses in 12 months using F.I.R.E.)
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// Wrap with ScarcityProvider
export default function ThankYouPage() {
  return (
    <ScarcityProvider>
      <ThankYouPageContent />
    </ScarcityProvider>
  )
}
