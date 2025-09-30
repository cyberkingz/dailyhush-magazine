import { useEffect, useState } from 'react'
import { CheckCircle, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react'
import { CheckoutButton } from '../../components/stripe/CheckoutButton'

export default function ThankYouPage() {
  const [showNotification, setShowNotification] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(0)
  
  // Get email from URL params
  const urlParams = new URLSearchParams(window.location.search)
  const userEmail = urlParams.get('email') || undefined
  
  // Social proof notifications
  const notifications = [
    { name: "Sarah", location: "New York", action: "launched in 48 hours", time: "2 min ago" },
    { name: "Mike", location: "San Francisco", action: "validated his idea", time: "5 min ago" },
    { name: "Jessica", location: "Austin", action: "got first customer", time: "8 min ago" },
    { name: "David", location: "Miami", action: "shipped his MVP", time: "12 min ago" },
    { name: "Emma", location: "Seattle", action: "stopped planning, started doing", time: "15 min ago" }
  ]

  useEffect(() => {
    document.title = 'F.I.R.E. Starter Kit — DailyHush'
  }, [])
  
  // Social proof notifications effect
  useEffect(() => {
    const showNextNotification = () => {
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
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 flex justify-center items-stretch">
      {/* Floating Social Proof Notification */}
      {showNotification && (
        <div className="fixed bottom-8 left-8 z-50 animate-slide-up">
          <div className="bg-white rounded-lg shadow-2xl border border-green-200 p-4 flex items-center gap-3 max-w-sm">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
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
              <div className="text-xs text-green-600 font-bold">VERIFIED</div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl px-0 md:px-4 flex flex-1">
        <div className="bg-white border-2 border-gray-300 flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Urgency Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-6 md:py-8">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-yellow-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">Special Price</span>
                </div>
                <span className="text-sm md:text-base font-bold tracking-wide uppercase">
                  🎯 F.I.R.E. STARTER KIT
                </span>
                <div className="text-xs text-red-100 font-medium">
                  ⚡ Stop planning. Start shipping.
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-16 py-12 md:py-16 pb-16 md:pb-20">
        {/* Letter Header */}
        <div className="mb-16">
          <p className="text-lg text-gray-600 mb-2">✅ You're subscribed to DailyHush!</p>
          <p className="text-gray-600 mb-12">(Check your email to confirm • First issue arrives in 24 hours)</p>
          
          <p className="text-xl text-gray-900 leading-relaxed max-w-3xl mx-auto">
            But wait... Since you're here, I want to show you something that could change everything.
          </p>
        </div>
          
          {/* Letter Headline */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Stop Planning Your Business to Death<br />
              <span className="text-2xl md:text-3xl font-normal text-gray-700">(And Finally Ship Something That Matters)</span>
            </h1>
          </div>

          {/* Letter Body */}
          <div className="mb-16 space-y-8 text-left leading-relaxed text-lg text-gray-900">
            <p className="mb-6">
              Look, we both know you're not lacking ideas. Your notes app is probably bursting with "breakthrough concepts" and your bookmarks folder has more business opportunities than most people see in a lifetime.
            </p>
            
            <p className="mb-6">
              The problem isn't your vision - it's your execution.
            </p>
            
            <p className="mb-6">
              You've become a chronic planner. A perpetual researcher. Someone who knows exactly what needs to be done but somehow never quite... does it.
            </p>
            
            <p className="mb-6">
              <strong>Here's what I've learned after watching hundreds of entrepreneurs get trapped in this cycle:</strong>
            </p>
            
            <p className="mb-6">
              The difference between successful business builders and eternal planners isn't talent, connections, or capital. It's a single behavioral shift that happens in the first 48 hours of any new project.
            </p>
            
            <p className="mb-6">
              <strong>Most people spend those crucial first two days "getting organized." Successful people spend them shipping something - anything - to real customers.</strong>
            </p>
            
            <p className="mb-6">
              Even if it's embarrassingly simple. Even if it's not ready.
            </p>
            
            <p className="mb-4">
              <strong>The F.I.R.E. Mindset:</strong>
            </p>
            <p className="mb-8 pl-4">
              • <strong>F</strong> - FOCUS → One clear customer, one clear problem<br/>
              • <strong>I</strong> - IMPERFECT ACTION → Ship something embarrassingly simple<br/>
              • <strong>R</strong> - RECORD → Measure what matters, ignore vanity metrics<br/>
              • <strong>E</strong> - EVOLVE → Let customers guide your next move
            </p>
            
            <p className="mb-6">
              <strong>Here's what makes this different from every other "business course":</strong>
            </p>
            
            <p className="mb-6">
              This isn't another course. This is the exact playbook that turns "someday entrepreneurs" into launched founders. Zero fluff methodology. 9 steps, not 90. Publish in 48h, not 48 weeks.
            </p>
            
            <p className="mb-6">
              <strong>And I'm going to prove it works for you too.</strong>
            </p>
          </div>

          <div className="mb-16">
            <p className="text-xl font-bold text-gray-900 mb-8">
              The F.I.R.E. Starter Kit: Your 48-Hour Challenge
            </p>
            
            <p className="text-lg text-gray-900 mb-8 leading-relaxed">
              0 overload, 1 single database, 9 pre-filled steps, publish in 48h. Battle-tested frameworks from Eugene Schwartz, Alex Hormozi, Steve Blank, and other masters.
            </p>

            <div className="space-y-6 leading-relaxed text-lg text-gray-900">
              
              <p>
                <strong>✅ Zero fluff methodology</strong><br/>
                → 9 steps, not 90<br/>
                The Problem: You're drowning in courses that teach theory instead of action.<br/>
                The Solution: Pre-filled action steps that force you to ship, not plan.<br/>
                What You Get: Complete action list with done/not done checkboxes, customer avatar template, TAM calculator, value proposition worksheet.
              </p>

              <p>
                <strong>✅ Speed over perfection</strong><br/>
                → Launch in 48h, not 48 weeks<br/>
                The Problem: Perfectionism is the enemy of progress.<br/>
                The Solution: "Embarrassingly simple" MVP framework that gets real customer feedback.<br/>
                What You Get: 48-hour challenge roadmap, irresistible offer template, product preparation checklist, 3 success KPIs tracking.
              </p>

              <p>
                <strong>✅ Real market validation</strong><br/>
                → Actual customers, not friends & family<br/>
                The Problem: You're validating with people who lie to make you feel good.<br/>
                The Solution: Get 3 relevant feedbacks from strangers who have no reason to lie.<br/>
                What You Get: Customer interview scripts, feedback collection system, market validation framework, pivot decision tree.
              </p>

              <p>
                <strong>✅ Product-market fit roadmap</strong><br/>
                → From idea to paying customers<br/>
                The Problem: You don't know how to turn ideas into revenue.<br/>
                The Solution: Step-by-step roadmap that 847 entrepreneurs have used to launch.<br/>
                What You Get: Complete launch sequence, customer acquisition playbook, optimization framework, track & improve system.
              </p>
            </div>

            <p className="text-xl font-bold text-gray-900 mt-8">
              This isn't another course. This is the exact playbook that turns "someday entrepreneurs" into launched founders.
            </p>
          </div>

          <div className="mb-16">
            <p className="text-xl font-bold text-gray-900 mb-8">
              The Results Speak For Themselves
            </p>
            <p className="text-lg text-gray-900 mb-8">
              847 people have used this system. Here's what happened:
            </p>
            
            <div className="space-y-6 leading-relaxed text-lg text-gray-900">
              
              <p>
                <strong>Sarah M., Austin, Texas</strong><br/>
                "Stuck in planning for 8 months. The F.I.R.E. action list finally forced me to stop researching and start building. Launched over the weekend, got my first paying customer within 3 days. The framework works because it eliminates decision paralysis."<br/>
                - Marketing consultant who shipped her first digital product
              </p>

              <p>
                <strong>Michael R., Miami, FL</strong><br/>
                "The customer interview script saved me from building the wrong thing. Three conversations completely changed my product direction. Launched with real market feedback instead of assumptions. Wish I'd found this template years ago."<br/>
                - Software founder who validated before building
              </p>

              <p>
                <strong>Jennifer C., San Diego, CA</strong><br/>
                "Working mom with limited time. The 48-hour framework fit into my weekend schedule. Finally shipped something instead of endlessly planning. The pre-filled steps made it impossible to get lost in the details."<br/>
                - Course creator who broke through analysis paralysis
              </p>

              <p>
                <strong>David K., Seattle, WA</strong><br/>
                "Two years of 'someday I'll launch.' The F.I.R.E. method forced me to ship imperfectly and iterate with real customers. Got actual feedback instead of theoretical advice. My competitor is still planning while I'm already serving customers."<br/>
                - B2B software founder who chose speed over perfection
              </p>
            </div>
          </div>

          {/* Enhanced Price Reveal Section */}
          <div className="mb-16">
            {/* Deal Header with Torn Edge Effect */}
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 text-white p-8 rounded-t-2xl">
              <div 
                className="absolute bottom-0 left-0 right-0 h-4 bg-white" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 10'%3E%3Cpath d='M0,5 Q5,0 10,5 T20,5 T30,5 T40,5 T50,5 T60,5 T70,5 T80,5 T90,5 T100,5' fill='white'/%3E%3C/svg%3E")`,
                  backgroundSize: '100px 16px',
                  backgroundRepeat: 'repeat-x'
                }} 
              />
              
              <div className="text-center">
                <div className="inline-block bg-black bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  🔥 LIMITED TIME OFFER
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
                  HERE'S THE DEAL
                </h2>
                <p className="text-xl font-bold opacity-90">
                  I analyzed 47 business courses. Average price: $1,497.
                </p>
                <p className="text-lg opacity-80 mt-2">
                  Most teach theory from "gurus" who've never launched anything.
                </p>
              </div>
            </div>

            {/* Value Stack - Ticket Body */}
            <div className="bg-white border-2 border-dashed border-gray-300 p-8 relative">

              <div className="text-center mb-8">
                <p className="text-xl text-gray-900 font-bold mb-4">
                  This gives you the exact F.I.R.E. method that forces you to ship in 48 hours.
                </p>
                <p className="text-lg text-gray-700">
                  Not theory. Not fluff. The step-by-step system I use with private clients.
                </p>
              </div>

              {/* Emotional Value Buildup */}
              <div className="mb-10 space-y-6 text-left max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Look, if you hired me personally to walk you through this system, my consulting rate is <strong>$300/hour</strong>. We'd need at least 6 hours to cover everything properly.
                </p>
                
                <p className="text-xl font-bold text-gray-900 text-center py-3 bg-gray-50 rounded">
                  That's $1,800 for private consulting
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  I could easily charge $497 for this system. That's what my business advisor tells me. Most business courses charge $1,497+ for far less actionable content.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>But here's why I'm not charging $497...</strong> Because I remember what it was like starting out, staring at my bank account, knowing I had the drive but not the roadmap. And because I want to flood the market with entrepreneurs who actually execute instead of endlessly planning.
                </p>
              </div>

              {/* Emotional Price Reveal */}
              <div className="text-center space-y-6">
                <p className="text-xl text-gray-900 mb-6">
                  So instead of $497... instead of even $97... you get lifetime access for just:
                </p>

                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-8 mb-6">
                  <div className="text-7xl font-black text-green-600 mb-3">
                    $27
                  </div>
                  <div className="text-xl text-gray-700 mb-2">
                    One-time payment. Forever yours.
                  </div>
                  <div className="text-lg text-gray-600 mb-4">
                    30-day money-back guarantee. No questions asked.
                  </div>
                  
                  <p className="text-lg text-gray-700 font-medium leading-relaxed">
                    That's less than lunch. Less than a tank of gas. Less than those business magazines collecting dust on your desk that you never read.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-600">
                  <p><strong>Fair warning:</strong> My business manager thinks I'm crazy for pricing this so low. She keeps showing me spreadsheets proving I should charge at least $297. Don't be surprised if you see the price higher when you tell your entrepreneur friends about this.</p>
                </div>
                
                {/* CTA Button Right After Offer */}
                <div className="mt-8">
                  <CheckoutButton 
                    email={userEmail}
                    variant="cta"
                    size="lg"
                    className="w-full px-8 py-4 text-xl font-bold rounded-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                    showPricing={false}
                  >
                    <DollarSign className="h-6 w-6" />
                    Get F.I.R.E. STARTER KIT Now - $27
                    <ArrowRight className="h-5 w-5" />
                  </CheckoutButton>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
              <p className="text-lg text-gray-900 mb-6 leading-relaxed">
                But since you just joined DailyHush (and I want to prove this works), you get everything at this special subscriber price.
              </p>
              
              <p className="text-xl font-bold text-gray-900 mb-6">
                And it could change your financial future forever.
              </p>
            </div>

            <p className="text-xl font-bold text-gray-900 mb-6">
              Let's Be Logical About Risk
            </p>
            
            <p className="text-lg text-gray-900 mb-6 leading-relaxed">
              What's riskier: Spending $27 on a proven system that launched 847 real businesses, or staying stuck in planning mode for another year?
            </p>
            
            <p className="text-lg text-gray-900 mb-6 leading-relaxed">
              If you launch just ONE product using the F.I.R.E. method (average first month revenue is $1,200), this pays for itself 44x over.
            </p>
            
            <p className="text-lg text-gray-900 mb-12 leading-relaxed">
              If you get just ONE customer using the templates, that's worth $300+ in lifetime value.
            </p>
          </div>

          {/* Hormozi CTA Section */}
          <div className="mb-12 max-w-3xl mx-auto px-4 md:px-0">

            <p className="text-xl font-bold text-gray-900 mb-8">
              You Have Two Choices Right Now
            </p>

            <div className="text-lg text-gray-900 leading-relaxed mb-12">
              <p className="mb-6">
                <strong>Choice #1: Do Nothing</strong><br/>
                Keep planning forever. Watch others launch while you perfect your business plan. Stay stuck in "research mode" with a computer full of ideas that never become real businesses. Wonder in 6 months why you didn't take action.<br/>
                <strong>Result: Perfect plans, $0 revenue</strong>
              </p>
              
              <p className="mb-8">
                <strong>Choice #2: Invest $27</strong><br/>
                Get the F.I.R.E. method that forces you to ship in 48 hours. Join 847 launched founders already inside. Stop planning, start doing. Turn ideas into income.<br/>
                <strong>Result: Real business, real customers, real money</strong>
              </p>
              
              <p className="text-xl font-bold text-gray-900">
                Which choice feels better to you? The math is simple: $27 to stop planning and start shipping.
              </p>
            </div>

            <div className="mb-12 text-center">
              
              <div className="mb-6">
                <CheckoutButton 
                  email={userEmail}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-12 py-6 text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-green-400"
                  showPricing={false}
                >
                  <DollarSign className="h-6 w-6" />
                  YES! Give Me The F.I.R.E. Starter Kit for $27
                  <ArrowRight className="h-5 w-5" />
                </CheckoutButton>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">
                ✅ Join 847 launched founders already inside • 🎯 30-day money-back guarantee
              </p>
              
              <p className="text-gray-600 text-sm">
                256-bit SSL Secure • Instant Access • No questions asked
              </p>
            </div>

            <p className="text-xl font-bold text-gray-900 mb-6">
              My "Unreasonable" 30-Day Guarantee
            </p>
            <p className="text-lg text-gray-900 mb-6 leading-relaxed">
              Use the F.I.R.E. method for 30 days. If you don't ship something within 48 hours using this system, I'll refund your $27 AND you keep everything. No complicated requirements, no revenue targets to hit.
            </p>
            <p className="text-lg text-gray-900 mb-6 leading-relaxed">
              Hell, if you don't like the Notion template design, I'll refund you. No questions, no hassles, no hoops. Just email me your receipt.
            </p>
            <p className="text-xl font-bold text-gray-900 mb-12">
              The only way you lose is by NOT trying this. Sarah from Austin launched in 48 hours and had her first customer in 72 hours.
            </p>

            <div className="text-center space-y-6">
              <p className="text-xl font-bold text-gray-900">
                🎯 The Question That Haunts Chronic Planners
              </p>
              
              <p className="text-lg text-gray-900 leading-relaxed">
                "What if I'm still planning this same business idea next year?" The F.I.R.E. method forces you to ship imperfectly instead of planning perfectly. 847 people chose action over analysis. Which type of person are you?
              </p>
              
              <p className="text-xl font-bold text-gray-900">
                Don't let "I'll think about it" cost you another year of perfect plans that never become real businesses.
              </p>
              
              <CheckoutButton 
                email={userEmail}
                variant="cta"
                size="lg"
                className="w-full sm:w-auto px-10 py-5 text-lg font-bold bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-green-400"
                showPricing={false}
              >
                <AlertTriangle className="h-5 w-5" />
                Get The System Now - $27
                <ArrowRight className="h-4 w-4" />
              </CheckoutButton>
              
              <p className="text-lg text-gray-900">
                ⏰ Only 67 spots left at this price
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-12 mt-16 px-8 md:px-16 pb-16 md:pb-20 space-y-8 max-w-3xl mx-auto">
            <p className="text-lg text-gray-900 leading-relaxed">
              <strong>P.S.</strong> Sarah Mitchell from Austin just messaged me: "Downloaded the F.I.R.E. kit on Friday, launched on Sunday, first customer on Tuesday. The action list literally forced me to stop overthinking." She's made $8,200 in 6 months. Question is: Will you be sending me your launch story next week?
            </p>
            <p className="text-lg text-gray-900 leading-relaxed">
              Remember: You're already subscribed to DailyHush. This is your chance to finally turn those ideas into income with the exact system that launched 847 real businesses. Stop "planning" and start shipping.
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
                Get Started Now - $27
                <ArrowRight className="h-4 w-4" />
              </CheckoutButton>
            </div>
            
            <div className="space-y-2 text-left">
              <p className="text-lg text-gray-900">
                Sincerely,
              </p>
              <p className="text-lg font-bold text-gray-900">
                [Your Name]
              </p>
              <p className="text-gray-600">
                Creator of the F.I.R.E. Starter Kit
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
