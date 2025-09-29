import React from 'react'
import { CreditCard, Loader2, Shield, Zap } from 'lucide-react'
import { useStripe, getUtmParams } from '../../hooks/useStripe'

interface CheckoutButtonProps {
  email?: string
  variant?: 'primary' | 'secondary' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  showFeatures?: boolean
  showPricing?: boolean
}

export function CheckoutButton({ 
  email, 
  variant = 'primary',
  size = 'lg',
  className = '',
  children,
  showFeatures = false,
  showPricing = true
}: CheckoutButtonProps) {
  const { createFireStarterCheckout, loading, error } = useStripe()

  const handleCheckout = async () => {
    const utmParams = getUtmParams()
    
    await createFireStarterCheckout({
      email: email || undefined, // Use the email passed as prop if available
      ...utmParams,
    })
  }

  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    cta: "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl animate-pulse hover:animate-none"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <div className="space-y-4">

      {/* Pricing Display */}
      {showPricing && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <span className="text-2xl font-bold text-green-700">$27</span>
            <span className="text-green-600 text-sm">one-time payment</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Lifetime access • 30-day money-back guarantee</p>
        </div>
      )}

      {/* Features List */}
      {showFeatures && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-green-500" />
            <span>Complete Notion workspace template</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span>9 pre-filled launch steps</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4 text-green-500" />
            <span>48-hour execution framework</span>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {children || (
              <>
                <CreditCard className="w-5 h-5" />
                Get F.I.R.E. STARTER KIT
              </>
            )}
          </>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      {/* Trust Signals */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>🔒 Secure payment powered by Stripe</p>
        <p>💡 Instant access • 📧 Email support included</p>
      </div>
    </div>
  )
}