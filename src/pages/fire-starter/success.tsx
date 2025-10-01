import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, Mail, Users, FileText, ArrowRight, Zap } from 'lucide-react'
import { useStripe } from '@/hooks/useStripe'

interface PurchaseInfo {
  sessionId: string
  customerEmail: string
  paymentStatus: string
  amountPaid: number
  currency: string
  purchaseDate: string
  accessGranted: boolean
}

export default function FireStarterSuccess() {
  const [searchParams] = useSearchParams()
  const { verifyPurchase, createCoachingCheckout, loading, error } = useStripe()
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const [coachingLoading, setCoachingLoading] = useState(false)
  const [coachingPurchased, setCoachingPurchased] = useState(false)
  const [coachingError, setCoachingError] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')

  const handleCoachingClick = async () => {
    if (!sessionId) {
      setCoachingError('Unable to process request. Please refresh the page.')
      return
    }

    setCoachingLoading(true)
    setCoachingError(null)

    try {
      const result = await createCoachingCheckout(sessionId)
      console.log('Coaching payment result:', result)
      setCoachingPurchased(true)
    } catch (err) {
      console.error('Failed to process coaching payment:', err)
      setCoachingError(err instanceof Error ? err.message : 'Failed to process payment')
    } finally {
      setCoachingLoading(false)
    }
  }

  useEffect(() => {
    document.title = '🔥 Welcome to F.I.R.E. STARTER KIT!'
    
    if (sessionId) {
      verifyPurchase(sessionId)
        .then((result) => {
          setPurchase(result.purchase)
        })
        .catch((err) => {
          setVerificationError(err.message)
        })
    } else {
      setVerificationError('No session ID found. Please check your email for access details.')
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your purchase...</p>
        </div>
      </div>
    )
  }

  if (error || verificationError || !purchase) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
          <p className="text-gray-600 mb-6">
            {verificationError || error || 'We couldn\'t verify your purchase right now, but don\'t worry! Your F.I.R.E. STARTER KIT has been sent to your email.'}
          </p>
          <Link
            to="/ship48"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <ArrowRight className="w-4 h-4" />
            Continue to Ship48
          </Link>
        </div>
      </div>
    )
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      <div className="mx-auto max-w-4xl px-6 py-8 md:py-12">

        {/* Success Header - Streamlined */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            You're In!
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
              {' '}Payment Confirmed
            </span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your F.I.R.E. STARTER KIT is ready. Let's get you started in the next 60 seconds.
          </p>
        </div>

        {/* REASSURANCE - Email Confirmation (Supportive, not competing) */}
        <div className="mb-8">
          <div className="bg-blue-50 border-2 border-blue-100 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 mb-1">Confirmation Email Sent</h3>
              <p className="text-sm text-gray-700 mb-2">
                Backup access link and instructions sent to <span className="font-semibold text-blue-600 break-all">{purchase.customerEmail}</span>
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Backup links
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Setup guide
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Support info
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE - Collapsible Receipt */}
        <details className="mb-8 group">
          <summary className="cursor-pointer list-none">
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition group-open:rounded-b-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Order Receipt</h3>
                  <p className="text-xs text-gray-500">
                    {formatAmount(purchase.amountPaid, purchase.currency)} • Order #{purchase.sessionId.slice(-8).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-gray-400 group-open:rotate-180 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </summary>

          <div className="bg-white rounded-b-xl shadow-md px-6 py-5">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <div className="text-gray-500 mb-1">Product</div>
                  <div className="font-semibold text-gray-900">F.I.R.E. STARTER KIT</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Amount</div>
                  <div className="font-semibold text-amber-600">{formatAmount(purchase.amountPaid, purchase.currency)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500 mb-1">Customer Email</div>
                  <div className="text-gray-900 break-all">{purchase.customerEmail}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Payment Status</div>
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-green-600 font-medium capitalize">{purchase.paymentStatus}</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Order ID</div>
                  <div className="text-gray-900 font-mono text-xs">#{purchase.sessionId.slice(-8).toUpperCase()}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500 mb-1">Purchase Date</div>
                  <div className="text-gray-900">{new Date(purchase.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>
          </div>
        </details>

        {/* UPSELL - 1-on-1 Coaching Call */}
        {!coachingPurchased ? (
          <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-amber-200 p-8 md:p-10 text-center overflow-hidden mb-8">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-60"></div>

            <div className="relative">
                {/* Premium badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  EXCLUSIVE OFFER • 48 HOURS ONLY
                </div>

                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 leading-tight">
                  Fast-Track Your Launch with<br />Expert 1-on-1 Coaching
                </h2>

                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Get a <span className="font-bold text-amber-600">60-minute personalized strategy session</span> to accelerate your F.I.R.E. implementation
                </p>

                {/* Enhanced benefits */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 mb-8 max-w-xl mx-auto border border-amber-200/50 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-0.5">Roadmap Review</div>
                        <div className="text-xs text-gray-600">Personalized feedback</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-0.5">Custom Plan</div>
                        <div className="text-xs text-gray-600">Tailored to your goals</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-0.5">Expert Q&A</div>
                        <div className="text-xs text-gray-600">Get all answers live</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-left">
                      <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 mb-0.5">Action Plan</div>
                        <div className="text-xs text-gray-600">Clear next steps</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Premium pricing display */}
                <div className="mb-8">
                  <div className="inline-flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-400 text-2xl font-semibold line-through decoration-2">$297</span>
                      <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SAVE 50%</div>
                    </div>
                    <div className="text-6xl md:text-7xl font-black bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                      $150
                    </div>
                    <p className="text-gray-500 text-sm font-medium">One-time payment • New customer exclusive</p>
                  </div>
                </div>

                {/* Premium CTA button */}
                <button
                  onClick={handleCoachingClick}
                  disabled={coachingLoading}
                  className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl hover:shadow-amber-500/50 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {coachingLoading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Users className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                      <span>Add Coaching Call • $150</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>

                {coachingError && (
                  <div className="mt-6 bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl">
                    <p className="text-sm font-semibold">{coachingError}</p>
                    <p className="text-xs mt-1">Please try again or contact support.</p>
                  </div>
                )}

                {/* Trust indicators */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" strokeWidth={2.5} />
                    </div>
                    <span className="font-medium">Secure one-click payment</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <span className="font-medium">Instant confirmation</span>
                  </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-2xl p-8 md:p-10 text-center border-4 border-green-300/50 mb-8">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={2.5} />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Coaching Call Added! 🎉
            </h2>
            <p className="text-white/95 text-lg mb-6 max-w-xl mx-auto">
              You've been charged <span className="font-bold">$150.00</span> for your 60-minute strategy call.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto border border-white/20">
              <h3 className="text-white font-bold mb-3">What Happens Next?</h3>
              <div className="space-y-2 text-white/90 text-sm text-left">
                <p>📧 You'll receive an email within 5 minutes with:</p>
                <ul className="list-disc list-inside pl-2 space-y-1">
                  <li>Calendar booking link</li>
                  <li>Pre-call questionnaire</li>
                  <li>Zoom meeting details</li>
                </ul>
              </div>
            </div>

            <p className="text-white/70 text-sm mt-6">
              Questions? Email us at{' '}
              <a href="mailto:hello@daily-hush.com" className="underline font-medium">
                hello@daily-hush.com
              </a>
            </p>
          </div>
        )}

        {/* SECONDARY ACTION - What Happens Next */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              What Happens Next
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Duplicate to Your Notion</h4>
                <p className="text-sm text-gray-600">Click the button above. The template will open in a new tab and you can duplicate it with one click.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Follow the 9 Steps</h4>
                <p className="text-sm text-gray-600">Your workspace includes a clear path from idea to launch. Start with Step 1 and work through each framework.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Ship in 48 Hours</h4>
                <p className="text-sm text-gray-600">Use the Ship48 challenge below to turn your template into a launched product this weekend.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}