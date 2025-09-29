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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to the
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
              {' '}F.I.R.E. STARTER KIT!
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Your purchase is complete. Time to turn your 'someday' into today! 🚀
          </p>
          
          {/* Purchase Summary */}
          <div className="inline-flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-md">
            <span className="text-sm text-gray-500">Purchase confirmed</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="font-semibold text-green-600">
              {formatAmount(purchase.amountPaid, purchase.currency)}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span className="text-sm text-gray-500">{purchase.customerEmail}</span>
          </div>
        </div>

        {/* Your Resources */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Primary Resource - Notion Workspace */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Your Notion Workspace</h3>
                <p className="text-green-600 text-sm font-medium">Ready to use immediately</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Complete F.I.R.E. system with 9 pre-filled steps, templates, and frameworks to launch in 48 hours.
            </p>
            
            <a
              href={resources?.notionWorkspace || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Access Your Workspace
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Secondary Resources */}
          <div className="space-y-6">
            
            {/* Email Confirmation */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-8 h-8 text-blue-500" />
                <h4 className="font-bold text-gray-900">Check Your Email</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                We've sent detailed instructions and backup links to <strong>{purchase.customerEmail}</strong>
              </p>
              <div className="text-xs text-gray-500">
                <p>📧 Delivery email sent</p>
                <p>🔗 Backup access links included</p>
                <p>📋 Step-by-step getting started guide</p>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-emerald-500" />
                <h4 className="font-bold text-gray-900">Need Help?</h4>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Questions about your F.I.R.E. STARTER KIT? We're here to help you succeed.
              </p>
              <a
                href={`mailto:${resources?.supportEmail || 'hello@dailyhush.com'}?subject=F.I.R.E. STARTER KIT Support (${sessionId})`}
                className="text-emerald-600 hover:text-emerald-700 font-medium text-sm inline-flex items-center gap-1"
              >
                <Mail className="w-4 h-4" />
                Get Support
              </a>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-orange-500" />
            Your Next Steps (Do This Now!)
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Access Your Workspace</h4>
              <p className="text-sm text-gray-600">Click the link above to duplicate the Notion template to your workspace</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Start Your 48h Sprint</h4>
              <p className="text-sm text-gray-600">Use the Ship48 challenge to implement your F.I.R.E. system</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Ship & Share</h4>
              <p className="text-sm text-gray-600">Launch your project and share your success story!</p>
            </div>
          </div>
        </div>

        {/* CTA to Ship48 */}
        <div className="text-center bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Shipping?</h2>
          <p className="text-indigo-100 mb-6">
            Take your new F.I.R.E. STARTER KIT for a spin with our 48-hour shipping challenge
          </p>
          <Link 
            to="/ship48?utm_source=fire_starter&utm_medium=success_page&utm_campaign=post_purchase"
            className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition inline-flex items-center gap-2"
          >
            Start 48-Hour Challenge <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}