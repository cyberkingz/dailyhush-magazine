import { useEffect, useState } from 'react'
import { CheckCircle, DollarSign, ArrowRight } from 'lucide-react'
import { CheckoutButton } from '../../components/stripe/CheckoutButton'
import { UrgencyBanner } from '../../components/UrgencyBanner'
import { ScarcityProvider, useScarcity } from '../../contexts/ScarcityContext'

function ThankYouPageContent() {
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)
  const { decrementSpots } = useScarcity()

  // Get email from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const userEmail = urlParams.get('email') || undefined
  
  // Social proof notifications - mixed with purchases
  const notifications = [
    { name: "Sarah", location: "New York", action: "just purchased F.I.R.E. Kit", time: "Just now", isPurchase: true },
    { name: "Mike", location: "San Francisco", action: "just purchased F.I.R.E. Kit", time: "1 min ago", isPurchase: true },
    { name: "Jessica", location: "Austin", action: "got first customer", time: "3 min ago", isPurchase: false },
    { name: "David", location: "Miami", action: "just purchased F.I.R.E. Kit", time: "4 min ago", isPurchase: true },
    { name: "Emma", location: "Seattle", action: "launched in 48 hours", time: "6 min ago", isPurchase: false },
    { name: "Alex", location: "Chicago", action: "just purchased F.I.R.E. Kit", time: "8 min ago", isPurchase: true },
    { name: "Lisa", location: "Boston", action: "shipped her MVP", time: "10 min ago", isPurchase: false },
    { name: "Tom", location: "Portland", action: "just purchased F.I.R.E. Kit", time: "12 min ago", isPurchase: true }
  ]

  useEffect(() => {
    document.title = 'F.I.R.E. Starter Kit — DailyHush'
  }, [])

  // Social proof notifications effect - connected to spots
  useEffect(() => {
    const showNextNotification = () => {
      const notification = notifications[currentNotification]

      // If it's a purchase notification, decrement spots
      if (notification.isPurchase) {
        decrementSpots()
      }

      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
        setTimeout(() => {
          setCurrentNotification((prev) => (prev + 1) % notifications.length)
        }, 2000)
      }, 5000)
    }

    // Initial delay
    const initialTimeout = setTimeout(() => {
      showNextNotification()
      const interval = setInterval(showNextNotification, 15000)
      return () => clearInterval(interval)
    }, 3000)

    return () => clearTimeout(initialTimeout)
  }, [currentNotification, decrementSpots])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex justify-center items-stretch">
      {/* Floating Social Proof Notification */}
      {showNotification && (
        <div className="fixed bottom-8 left-8 z-50 animate-slide-up">
          <div className={`bg-white rounded-lg shadow-2xl border p-4 flex items-center gap-3 max-w-sm ${
            notifications[currentNotification].isPurchase
              ? 'border-yellow-400 ring-2 ring-yellow-200'
              : 'border-green-200'
          }`}>
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              notifications[currentNotification].isPurchase
                ? 'bg-gradient-to-br from-yellow-500 to-amber-500'
                : 'bg-gradient-to-br from-green-500 to-emerald-500'
            }`}>
              {notifications[currentNotification].isPurchase ? (
                <DollarSign className="w-6 h-6 text-white" />
              ) : (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {notifications[currentNotification].name} from {notifications[currentNotification].location}
              </p>
              <p className="text-xs text-gray-600">
                {notifications[currentNotification].action} • {notifications[currentNotification].time}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className={`text-xs font-bold ${
                notifications[currentNotification].isPurchase ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {notifications[currentNotification].isPurchase ? 'SOLD' : 'VERIFIED'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1">
        <div className="bg-white border-2 border-gray-300 flex-1 flex flex-col overflow-hidden">
          {/* Urgency Banner Component */}
          <UrgencyBanner
            productName="F.I.R.E. STARTER KIT"
            tagline="Stop planning. Start shipping."
            countdownDuration={15}
            storageKey="fire_countdown_end"
            showSocialProof={true}
            socialProofCount={127}
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
          <div className="mb-16 bg-blue-50 border-2 border-blue-200 rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Step 0: Try It Now (Free)
            </h2>
            <div className="space-y-4 text-lg text-gray-900 leading-relaxed">
              <p>Take your 3 favorite business ideas.</p>
              <p>Delete two.</p>
              <p className="font-bold">
                Congrats — you've just done <strong>F (Focus)</strong>.
              </p>
              <p>The kit gives you I, R, and E in the next 48h.</p>
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

          {/* Here's The Deal */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Here's The Deal
            </h2>

            <div className="space-y-6 text-lg text-gray-900 leading-relaxed mb-8">
              <p>I could charge $497 (my advisor says $297 minimum).</p>
              <p>My consulting rate is $300/hour. It takes 6 hours to teach this live = $1,800.</p>
              <div className="bg-green-50 border-2 border-green-300 rounded-xl p-8 text-center">
                <p className="text-2xl font-bold text-gray-900 mb-4">Today: $27 one-time.</p>
                <p className="text-lg text-gray-700 mb-2">30-day money-back guarantee.</p>
                <p className="text-lg text-gray-700">
                  That's less than lunch. Less than the stack of business books on your desk.
                </p>
              </div>
              <p className="text-xl font-bold">
                But it could change your financial future forever.
              </p>
            </div>

            <div className="text-center">
              <CheckoutButton
                email={userEmail}
                variant="cta"
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                showPricing={false}
              >
                <DollarSign className="h-6 w-6" />
                Get F.I.R.E. STARTER KIT Now - $27
                <ArrowRight className="h-5 w-5" />
              </CheckoutButton>
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
          <div className="mb-16 bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Limited-Time Subscriber Deal
            </h2>
            <div className="space-y-4 text-lg text-gray-900 leading-relaxed">
              <p>• Today: $27 (goes up to $47 on December 31, 2025).</p>
              <p>• First 20 buyers get bonus: <strong>"Weekend Ship Checklist"</strong> (printable 48h action map).</p>
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

            {/* Final CTA */}
            <div className="text-center space-y-8 mb-16">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-2xl p-8">
                <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  "Your notes app is full.<br/>Your Stripe is empty.<br/>Fix that in 48h with F.I.R.E."
                </p>
                <CheckoutButton
                  email={userEmail}
                  variant="cta"
                  size="lg"
                  className="w-full sm:w-auto px-12 py-6 text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  showPricing={false}
                >
                  <DollarSign className="h-6 w-6" />
                  Get the Starter Kit for $27 (One-time)
                  <ArrowRight className="h-5 w-5" />
                </CheckoutButton>
                <p className="text-sm text-gray-600 mt-4">
                  ✅ 30-day money-back guarantee • 🔒 Secure payment • ⚡ Instant access
                </p>
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
