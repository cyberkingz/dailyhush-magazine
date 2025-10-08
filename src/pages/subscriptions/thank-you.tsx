import { useEffect, useState, useRef } from 'react'
import { CheckCircle, DollarSign, Flame } from 'lucide-react'
import ShopifyBuyButton from '../../components/ShopifyBuyButton'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'
import { TopBar } from '../../components/layout/TopBar'
import type { OverthinkerType } from '../../types/quiz'

// Quiz result data for personalized copy
const quizResultData: Record<OverthinkerType, {
  title: string
  description: string
  insight: string
  problem: string
  symptom: string
  offerHeadline: {
    line1: string
    line2: string
  }
}> = {
  'mindful-thinker': {
    title: 'The Mindful Thinker',
    description: 'You reflect, but rarely spiral. Your thoughts work for you, not against you.',
    insight: 'You have healthy awareness. Keep using it to make intentional choices.',
    problem: "You're doing well, but there's always room to sharpen your mental clarity.",
    symptom: "You occasionally second-guess yourself, but it doesn't control you.",
    offerHeadline: {
      line1: "Your thoughts are present.",
      line2: "Your peace is consistent."
    }
  },
  'gentle-analyzer': {
    title: 'The Gentle Analyzer',
    description: 'You think a lot; sometimes it leaks into worry. Awareness is there — you just need light guardrails.',
    insight: 'Your overthinking is manageable — with the right system in place.',
    problem: "You know you overthink sometimes, but it hasn't completely taken over yet.",
    symptom: "You replay conversations. You compare yourself online. But you still move forward.",
    offerHeadline: {
      line1: "Your mind is active.",
      line2: "Your calm is missing."
    }
  },
  'chronic-overthinker': {
    title: 'The Chronic Overthinker',
    description: 'Your mind loops often. You crave peace, but certainty feels safer than calm.',
    insight: "You don't need more certainty. You need a system that works without it.",
    problem: "You think clarity will bring peace. But waiting for certainty keeps you stuck.",
    symptom: "You lie awake replaying mistakes. You need reassurance before deciding. Your brain won't shut off.",
    offerHeadline: {
      line1: "Your head is full.",
      line2: "Your peace is empty."
    }
  },
  'overthinkaholic': {
    title: 'The Overthinkaholic',
    description: "Your brain never clocks out — decisions, looks, texts, sleep. You don't need more plans; you need a reset ritual.",
    insight: "This isn't about willpower. It's about interrupting the pattern.",
    problem: "You think if you think hard enough, you'll find the 'right' answer. But overthinking IS the problem.",
    symptom: "Every small choice feels massive. You imagine worst-case scenarios. Your thoughts spiral constantly.",
    offerHeadline: {
      line1: "Your brain is exhausted.",
      line2: "Your life is passing by."
    }
  }
}

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

  // Get quiz type and score from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const quizType = urlParams.get('type') as OverthinkerType | null
  const quizScore = urlParams.get('score') ? parseInt(urlParams.get('score')!) : null

  // Get personalized quiz result data or use defaults
  const resultData = quizType ? quizResultData[quizType] : null

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

  // Track scroll position for sticky bar - show after 40% scroll, but only above badge
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

      // Show after 40% scroll AND only if above the badge
      setShowStickyBar(scrollPercentage >= 40 && isAboveBadge)
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 flex flex-col relative overflow-hidden">
      {/* Organic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
      </div>

      <TopBar variant="dark" />

      <div className="flex-1 flex justify-center items-stretch">
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
          <ShopifyBuyButton
            productId="10761797894447"
            domain="t7vyee-kc.myshopify.com"
            storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
            buttonText="Get F.I.R.E. Kit • $27"
            buttonColor="#16a34a"
            buttonHoverColor="#15803d"
            className="w-full"
          />

          {/* Trust signal - Simple */}
          <div className="flex items-center justify-center text-xs text-slate-600">
            <CheckCircle className="h-3 w-3 text-emerald-600 flex-shrink-0 mr-1" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>

        {/* Safe area padding for iPhone */}
        <div className="h-safe-area-inset-bottom bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl flex-1 flex flex-col overflow-hidden pb-20 sm:pb-0 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15)]">
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">
        {/* Letter Header */}
        <div className="mb-16">
          {/* Opening Hook - Gary Halbert Greased Slide */}
          <div className="mb-12 space-y-6 text-lg text-emerald-900 leading-relaxed">
            <p className="text-xl font-semibold">Listen… If your brain never shuts up — this will finally make sense.</p>

            <p>I know what just happened.</p>

            <p>You sat there answering those questions — some of them uncomfortably accurate — and with each click, you felt that familiar tightness in your chest. That voice in your head saying <em>"See? I KNEW something was wrong with me. This is proof."</em></p>

            <p>But here's what that voice doesn't want you to know: What you're about to see below isn't a diagnosis. It's not another label to beat yourself up with. It's the first time someone's actually going to explain <strong>WHY</strong> your brain won't shut up — and more importantly, what actually works to quiet it.</p>

            <p className="text-xl font-bold">Your results are waiting just below. But before you look, understand this: The number you got, the "type" you are — that's just the map. What I'm about to show you after that is the way out.</p>
          </div>

          {resultData && quizScore !== null && (
            <div className="mb-16 bg-gradient-to-br from-amber-50 via-amber-100/50 to-orange-50 border-4 border-amber-400 rounded-3xl p-10 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <p className="text-base font-bold text-amber-800 mb-4 tracking-wide">🎯 YOUR QUIZ RESULTS</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-900 mb-6 leading-tight">{resultData.title}</h1>

                {/* Score with Progress Bar */}
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-semibold text-emerald-700">Overthinking Scale</span>
                    <span className="text-2xl font-black text-amber-900">{quizScore}/10</span>
                  </div>
                  <div className="relative w-full bg-amber-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(quizScore / 10) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                    </div>
                  </div>
                </div>

                <p className="text-lg md:text-xl text-emerald-700 italic leading-relaxed max-w-2xl mx-auto">{resultData.description}</p>
              </div>

              <div className="border-t-2 border-amber-300 pt-8 mt-8 bg-white/40 rounded-xl p-6">
                <p className="text-xl md:text-2xl font-bold text-emerald-900 text-center leading-relaxed">{resultData.insight}</p>
              </div>
            </div>
          )}

          <p className="text-xl text-emerald-900 leading-relaxed max-w-3xl mx-auto mb-16">
            <strong>That number above? It's not a diagnosis. It's a warning signal.</strong>
          </p>

          <p className="text-lg text-emerald-900 leading-relaxed max-w-3xl mx-auto mb-16">
            Because every day you've been doing this:
          </p>

          {/* Overthinking Reality Check */}
          <div className="space-y-6 text-lg text-emerald-900 leading-relaxed">
            {resultData ? (
              <>
                <p>You've said <em>"I'll decide tomorrow"</em> about the same thing for weeks.</p>
                <p>{resultData.symptom}</p>
                <p className="text-xl font-bold text-emerald-900">
                  The brutal truth? You're not living your life.
                </p>
                <p className="text-xl">
                  You're not avoiding life — you're <strong>protecting yourself from getting hurt.</strong>
                </p>
                <p>
                  But it's costing you your peace.
                </p>
                <p>
                  And every day you stay in this loop is another day someone less "perfect" than you actually enjoys their life.
                </p>
              </>
            ) : (
              <>
                <p>You've said <em>"I'll decide tomorrow"</em> about the same thing for weeks.</p>
                <p>You've replayed that conversation 47 times. You've changed your mind about what to wear, what to say, what to do.</p>
                <p className="text-xl font-bold text-emerald-900">
                  The brutal truth? You're not living your life.
                </p>
                <p className="text-xl">
                  You're not avoiding life — you're <strong>protecting yourself from getting hurt.</strong>
                </p>
                <p>
                  But it's costing you your peace.
                </p>
                <p>
                  And every day you stay in this loop is another day someone less "perfect" than you actually enjoys their life.
                </p>
              </>
            )}
          </div>
        </div>
          
          {/* Why Smart People Stay Stuck */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
              Why Your Smartest Thoughts Keep You Paralyzed
            </h2>
            <div className="space-y-6 text-lg text-emerald-900 leading-relaxed">
              {resultData ? (
                <>
                  <p>{resultData.problem}</p>
                  <p>
                    Your brain is hooked on the dopamine of "figuring it out" —
                  </p>
                  <p className="text-xl font-bold">
                    while your actual life stays stuck at <strong>0% lived</strong>.
                  </p>
                </>
              ) : (
                <>
                  <p>You think analyzing keeps you safe.</p>
                  <p className="font-semibold">
                    But overthinking is just anxiety in an intelligent disguise.
                  </p>
                  <p>
                    Your brain is hooked on the dopamine of "figuring it out" —
                  </p>
                  <p className="text-xl font-bold">
                    while your actual life stays stuck at <strong>0% lived</strong>.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Hidden Addiction */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
              The Hidden Addiction You Never Noticed
            </h2>
            <div className="space-y-6 text-lg text-emerald-900 leading-relaxed">
              <p>It's not social media keeping you stuck.</p>
              <p>It's replaying moments you can never change.</p>
              <p>You don't need another self-help book.</p>
              <p>You don't need another meditation app.</p>
              <p>You've tried thinking your way out of overthinking.</p>
              <p className="font-semibold">That's like trying to put out fire with gasoline.</p>
              <p className="text-xl font-bold">
                👉 You need to <strong>break the mental loop</strong> — the moment it starts.
              </p>
            </div>
          </div>

          {/* The Cure: F.I.R.E. */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
              How To Stop A 2 AM Spiral Before It Steals Your Sleep
            </h2>
            <p className="text-lg text-emerald-900 mb-8 leading-relaxed">
              A 4-step reset that forces you to be present, not anxious:
            </p>
            <div className="space-y-4 text-lg text-emerald-900 leading-relaxed mb-8">
              <p><strong>F — Feel</strong> → Notice the spiral before it swallows you.</p>
              <p><strong>I — Interrupt</strong> → Stop the loop with a pattern break.</p>
              <p><strong>R — Redirect</strong> → Channel your thoughts into something real.</p>
              <p><strong>E — Ease</strong> → Build calm without needing certainty.</p>
            </div>
            <p className="text-xl font-semibold text-emerald-900">
              With this 4-step protocol, you'll go from <em>"I can't stop thinking"</em> → to <em>"I know exactly how to stop this."</em>
            </p>
          </div>

          {/* Step 0: Try It Now */}
          <div className="mb-16 flex justify-center">
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-4 border-dashed border-blue-400 rounded-2xl p-10 text-center max-w-md w-full aspect-square flex flex-col justify-center items-center shadow-lg">
              <h2 className="text-2xl md:text-3xl font-black text-emerald-900 mb-6 tracking-tight">
                Step 0: Try It Now <span className="text-blue-600">(Free)</span>
              </h2>
              <div className="space-y-4 text-base text-emerald-800 leading-relaxed">
                <p>Notice the next thought spiral.</p>
                <p>Say it out loud: "I'm overthinking again."</p>
                <p className="font-bold bg-white/60 px-4 py-2 rounded-lg">
                  Congrats — you've just done <strong className="text-blue-600">F (Feel)</strong>.
                </p>
                <p className="text-sm">The kit gives you the full I, R, and E protocol to use whenever you need it.</p>
              </div>
            </div>
          </div>

          {/* What You'll Get Inside */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
              The Complete Digital Overthinking Protocol
            </h2>
            <p className="text-lg text-emerald-900 mb-8 leading-relaxed">
              5 digital implementation tools — instant download, zero fluff.
            </p>

            <div className="space-y-8 text-lg text-emerald-900 leading-relaxed">

              <div>
                <p className="font-bold text-xl mb-2">✅ Window of Tolerance</p>
                <p className="mb-2">→ Catch your mind before it spirals into overwhelm.</p>
                <p><strong>Digital tool:</strong> Visual framework to recognize when you're entering dysregulation before the spiral starts.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ Cognitive Distortions</p>
                <p className="mb-2">→ Name the thought trap, break the loop in seconds.</p>
                <p><strong>Digital tool:</strong> Reference guide to identify the 10 most common thinking errors that fuel overthinking.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ Coping Strategies Wheel</p>
                <p className="mb-2">→ Find the right reset for your mood in 30 seconds, not 3 hours.</p>
                <p><strong>Digital tool:</strong> Interactive decision wheel with 20+ proven pattern breaks matched to your current state.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ What Do You Value?</p>
                <p className="mb-2">→ Stop chasing "what ifs," reconnect with what actually matters.</p>
                <p><strong>Digital tool:</strong> Values clarification framework to ground decisions in what you truly care about.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">✅ Overthinking Journal</p>
                <p className="mb-2">→ Racing thoughts → clarity in 5 minutes flat.</p>
                <p><strong>Digital tool:</strong> Structured journaling prompts that transform thought spirals into actionable insights.</p>
              </div>
            </div>
          </div>

          {/* Real Results */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-6">
              What 50,000 Overthinkers Discovered About That Voice In Their Head
            </h2>

            <div className="space-y-6 text-lg text-emerald-900 leading-relaxed mb-8">
              <p>
                • <strong>Jessica (Austin)</strong>: 8 months replaying conversations → stopped the spiral in 3 days → sleeps through the night now.
              </p>
              <p>
                • <strong>Lauren (Miami)</strong>: 2 years analyzing every outfit → made a choice in 5 minutes. The relief was instant.
              </p>
              <p>
                • <strong>Emma (Seattle)</strong>: Friend posts perfect life online. She stopped comparing. Started living. Friend still performing.
              </p>
            </div>

            <p className="text-xl font-bold text-emerald-900">
              Based on data from 847 women who applied this exact framework — and reported measurable drops in their mental spirals within the first week.
            </p>
            <p className="text-base text-emerald-700 italic mt-4">
              Reviewed by licensed CBT coaches & behavior analysts.
            </p>
          </div>

          {/* Limited-Time Subscriber Deal - Scarcity Introduction */}
          <div className="mb-16 flex justify-center">
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border-4 border-dashed border-red-400 rounded-2xl p-10 text-center max-w-md w-full aspect-square flex flex-col justify-center items-center shadow-lg">
              <h2 className="text-2xl md:text-3xl font-black text-emerald-900 mb-6 tracking-tight">
                🎉 50K Celebration — Price Locks Soon
              </h2>
              <div className="space-y-4 text-base text-emerald-800 leading-relaxed">
                {!isSoldOut ? (
                  <>
                    <p className="font-semibold">
                      Only <span className={`font-bold ${isCritical ? 'text-red-600' : 'text-red-600'}`}>{spotsRemaining}/{totalSpots} spots</span> at <span className="text-red-600 font-bold">$27</span> today
                    </p>
                    {/* Progress bar */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="relative w-full bg-red-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isCritical
                              ? 'bg-gradient-to-r from-rose-500 to-red-600'
                              : 'bg-gradient-to-r from-orange-500 to-red-500'
                          }`}
                          style={{ width: `${(spotsRemaining / totalSpots) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="font-semibold text-red-600">
                    SOLD OUT - Price returning to $387
                  </p>
                )}
                <p className="text-sm text-emerald-700">
                  (Regular price: $387)
                </p>
                <p className="bg-white/60 px-4 py-2 rounded-lg font-semibold">
                  Once sold out, price goes back to $387
                </p>
              </div>
            </div>
          </div>

          {/* Phase 1: Teaser - Price Curiosity Hook */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-8 text-center">
              Here's The Truth
            </h2>

            <div className="space-y-6 text-lg text-emerald-900 leading-relaxed mb-8 text-center">
              <p>The regular price for this protocol is $387.</p>
              <p>That's what 847 women already paid to finally have a system that breaks the overthinking loop.</p>

              {/* Teaser Card - Creates Curiosity */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-dashed border-green-400 rounded-2xl p-10 text-center max-w-md w-full aspect-square flex flex-col justify-center items-center shadow-lg">
                  <p className="text-xl font-bold text-emerald-700 mb-4">
                    But today you won't pay<br/>anywhere near that.
                  </p>
                  <p className="text-base text-emerald-700 mb-6 leading-relaxed">
                    For less than lunch, you can get the complete digital protocol with 5 implementation tools that helped 847 women break free from chronic overthinking...
                  </p>
                  <div className="bg-white/80 rounded-xl px-6 py-4 border-2 border-green-500">
                    <p className="text-sm text-emerald-700 mb-1">One-time investment:</p>
                    <p className="text-4xl font-black text-green-600">$27</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4 italic">
                    (You're probably wondering: "What do I get for $27?"<br/>Keep reading... 👇)
                  </p>
                </div>
              </div>

              <p className="text-xl font-bold text-center">
                The price is nothing. The system could change your life forever.
              </p>
            </div>
          </div>

          {/* Let's Be Logical About Risk */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
              Two Truths About Why You Replay Every Conversation
            </h2>

            <div className="space-y-6 text-lg text-emerald-900 leading-relaxed">
              <p>What's riskier?</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Spending $27 on a proven protocol that helped 847 women break the overthinking loop,</li>
                <li>Or another year of comparing yourself to strangers online, lying awake replaying conversations, and spending 20 minutes choosing what to wear because nothing feels "right enough"?</li>
              </ul>
              <p>
                If you <strong>use this system just once when the overthinking starts</strong>, you'll know freedom is possible.
              </p>
              <p className="text-xl font-bold">
                That's infinite ROI on your mental freedom.
              </p>
              <p>
                And once you have a protocol that works, you'll reclaim hours of your life every single day.
              </p>
            </div>
          </div>

          {/* You Have Two Choices */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
              You Have Two Choices Right Now
            </h2>

            <div className="space-y-8 text-lg text-emerald-900 leading-relaxed">
              <div>
                <p className="font-bold text-xl mb-2">Choice #1: Do Nothing</p>
                <p>Stay stuck. Keep analyzing. 6 months from now, still replaying conversations.</p>
              </div>

              <div>
                <p className="font-bold text-xl mb-2">Choice #2: Invest $27</p>
                <p>Get the system that breaks the loop. Start living.</p>
                <p>Join 847 women already inside.</p>
              </div>

              <p className="text-xl font-bold">
                👉 Which choice feels better?
              </p>
            </div>
          </div>

            {/* My Unreasonable Guarantee */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
                My "Unreasonable" Guarantee
              </h2>

              <div className="space-y-6 text-lg text-emerald-900 leading-relaxed">
                <p>Use the protocol for 30 days.</p>
                <p>If it doesn't give you a clear way to interrupt your overthinking pattern, I refund you.</p>
                <p>Keep the kit. No questions asked.</p>
                <p className="text-xl font-bold">
                  The only way you lose…
                </p>
                <p className="text-xl font-bold">
                  …is by staying <strong>{resultData ? resultData.title.toLowerCase() : 'a chronic overthinker'}</strong>.
                </p>
                <p className="text-xl font-semibold mt-8">
                  Imagine lying in bed, and your brain finally… goes quiet.
                </p>
                <p className="text-lg">
                  You're not broken. You just needed a protocol.
                </p>
              </div>
            </div>

            {/* Phase 2: Full Reveal Transition */}
            <div className="mb-12 text-center">
              <div ref={youAskedBadgeRef} className="inline-block bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-400 rounded-full px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 mb-3 sm:mb-4">
                <p className="text-sm sm:text-base md:text-lg font-black text-emerald-900">
                  Stop Overthinking For Less Than What You Spent Worrying About Dinner
                </p>
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold text-emerald-900 max-w-2xl mx-auto px-4">
                Here's everything inside the F.I.R.E. Starter Kit 👇
              </p>
            </div>

            {/* Phase 2: Full Offer Reveal - Compact Stack */}
            <div className="mb-16 flex justify-center">
              <div className="bg-white/90 backdrop-blur-sm border border-emerald-200/40 rounded-2xl p-4 sm:p-6 md:p-10 text-center max-w-lg w-full shadow-xl ring-1 ring-white/40 space-y-3 sm:space-y-4 md:space-y-6">

                {/* Headline */}
                <div className="space-y-1.5">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-900 leading-tight">
                    {resultData?.offerHeadline ? (
                      <>
                        {resultData.offerHeadline.line1}<br/>
                        {resultData.offerHeadline.line2}
                      </>
                    ) : (
                      <>
                        Your thoughts are racing.<br/>
                        Your peace is missing.
                      </>
                    )}
                  </p>
                  <div className="w-12 h-0.5 sm:h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
                </div>

                {/* Promise */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg px-4 py-2.5 sm:px-5 sm:py-3">
                  <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-900">
                    💥 Finally, a system for women whose brains won't shut up.
                  </p>
                </div>

                {/* Value + Price Combined */}
                <div className="bg-emerald-50/50 rounded-xl overflow-hidden border border-emerald-200/40">
                  <div className="p-3 sm:p-4 md:p-6 space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-snug">Window of Tolerance framework</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-snug">Cognitive Distortions guide</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-snug">Coping Strategies Wheel</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-snug">What Do You Value?</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-xs sm:text-sm text-emerald-700 leading-snug">Overthinking Journal prompts</p>
                    </div>
                  </div>

                  <div className="border-t border-emerald-200/40 bg-white px-4 py-3 sm:px-6 sm:py-4 md:py-5 text-center">
                    <p className="text-xs text-emerald-700 mb-2">Therapists charge $150/hour to teach the same techniques.</p>
                    <p className="text-xs text-gray-500 mb-0.5">Was: <span className="line-through">$387</span></p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-900">$27</p>
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

                {/* Pattern Interrupt */}
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg px-4 py-2 sm:px-5 sm:py-2.5 text-center">
                  <p className="text-xs sm:text-sm text-emerald-800 leading-snug">
                    Before you click away and tell yourself <em>"maybe later"</em> — <strong>that's the loop talking.</strong> Let's break it right now.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="w-full space-y-1.5 sm:space-y-2">
                  <ShopifyBuyButton
                    productId="10761797894447"
                    domain="t7vyee-kc.myshopify.com"
                    storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                    buttonText="Yes! I want the protocol → $27"
                    buttonColor="#16a34a"
                    buttonHoverColor="#15803d"
                    className="w-full"
                  />

                  {/* Scarcity - Subtle */}
                  <p className="text-xs text-center text-gray-500">
                    <span className="text-orange-600 font-semibold">⚡ Only {spotsRemaining}/50 spots left today</span>
                  </p>

                  {/* Emotional Micro-ROI */}
                  <p className="text-xs text-center text-emerald-700 italic mt-2">
                    If all it does is help you fall asleep without replaying your day — it's already worth it.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-200/40 pt-12 mt-16 px-8 md:px-16 pb-16 md:pb-20 space-y-8 max-w-3xl mx-auto">
            <p className="text-lg text-emerald-900 leading-relaxed">
              <strong>P.S.</strong> Right now, someone just like you — same thoughts, same doubts — finally stopped overthinking and did something real.
            </p>
            <p className="text-lg text-emerald-900 leading-relaxed">
              The only difference? She stopped waiting to "feel ready."
            </p>
            <p className="text-lg text-emerald-900 leading-relaxed">
              You're already subscribed to DailyHush. But reading about calm isn't the same as feeling it.
            </p>
            <p className="text-lg text-emerald-900 leading-relaxed">
              This kit is what finally helped me break the loop — not because it's magic, but because it's practical.
            </p>
            <p className="text-lg text-emerald-900 leading-relaxed">
              👉 If your brain's been loud all day, this is your sign to do something quiet for once.
            </p>

            <div className="text-center space-y-4">
              <ShopifyBuyButton
                productId="10761797894447"
                domain="t7vyee-kc.myshopify.com"
                storefrontAccessToken="a3bc32a7b8116c3f806d7d16e91eadad"
                buttonText="Stop Overthinking. Start Doing. ($27)"
                buttonColor="#16a34a"
                buttonHoverColor="#15803d"
                className="w-full sm:w-auto"
              />
            </div>

            <div className="space-y-2 text-left">
              <p className="text-lg text-emerald-900">
                — Anna
              </p>
              <p className="text-emerald-700">
                Recovering overthinker & creator of the F.I.R.E. method
              </p>
              <p className="text-sm text-gray-500 italic">
                (After 8 years of therapy, self-help, and 3 a.m. spirals — this is what finally worked.)
              </p>
            </div>
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
