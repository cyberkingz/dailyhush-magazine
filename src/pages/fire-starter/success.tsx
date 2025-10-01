import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, ExternalLink, Mail, Users, FileText, ArrowRight, Download, Zap } from 'lucide-react'
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

interface Resources {
  notionWorkspace: string
  communityAccess: string
  supportEmail: string
}

export default function FireStarterSuccess() {
  const [searchParams] = useSearchParams()
  const { verifyPurchase, loading, error } = useStripe()
  const [purchase, setPurchase] = useState<PurchaseInfo | null>(null)
  const [resources, setResources] = useState<Resources | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    document.title = '🔥 Welcome to F.I.R.E. STARTER KIT!'
    
    if (sessionId) {
      verifyPurchase(sessionId)
        .then((result) => {
          setPurchase(result.purchase)
          setResources(result.resources)
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

        {/* TERTIARY ACTION - Ship48 Challenge */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 md:p-8 text-center border border-gray-700">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            <Zap className="w-3 h-3" />
            BONUS CHALLENGE
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
            Ready to Ship in 48 Hours?
          </h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Join our Ship48 challenge to turn your F.I.R.E. STARTER KIT into a live product this weekend.
          </p>
          <Link
            to="/ship48?utm_source=fire_starter&utm_medium=success_page&utm_campaign=post_purchase"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-semibold transition shadow-lg hover:shadow-xl"
          >
            Join Ship48 Challenge
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-gray-400 text-xs mt-3">Free • 48-hour sprint • Launch-focused</p>
        </div>
      </div>
    </div>
  )
}