import { CheckCircle, Users, X } from 'lucide-react'

interface CoachingUpsellModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  loading: boolean
  error: string | null
}

export default function CoachingUpsellModal({
  isOpen,
  onClose,
  onAccept,
  loading,
  error,
}: CoachingUpsellModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-amber-200 w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 opacity-60 rounded-3xl"></div>

        <div className="relative p-6 md:p-10 text-center">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-4 md:mb-6 shadow-lg">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            EXCLUSIVE OFFER • 48 HOURS ONLY
          </div>

          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 md:mb-4 leading-tight">
            Fast-Track Your Launch with<br />Expert 1-on-1 Coaching
          </h2>

          <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Get a <span className="font-bold text-amber-600">60-minute personalized strategy session</span> to accelerate your F.I.R.E. implementation
          </p>

          {/* Enhanced benefits */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 md:p-8 mb-6 md:mb-8 border border-amber-200/50 shadow-inner">
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              <div className="flex items-start gap-2 md:gap-3 text-left">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">Roadmap Review</div>
                  <div className="text-[10px] md:text-xs text-gray-600">Personalized feedback</div>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3 text-left">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">Custom Plan</div>
                  <div className="text-[10px] md:text-xs text-gray-600">Tailored to your goals</div>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3 text-left">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">Expert Q&A</div>
                  <div className="text-[10px] md:text-xs text-gray-600">Get all answers live</div>
                </div>
              </div>
              <div className="flex items-start gap-2 md:gap-3 text-left">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold text-gray-900 mb-0.5">Action Plan</div>
                  <div className="text-[10px] md:text-xs text-gray-600">Clear next steps</div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium pricing display */}
          <div className="mb-6 md:mb-8">
            <div className="inline-flex flex-col items-center">
              <div className="flex items-center gap-2 md:gap-3 mb-2">
                <span className="text-gray-400 text-xl md:text-2xl font-semibold line-through decoration-2">$297</span>
                <div className="px-2 md:px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SAVE 50%</div>
              </div>
              <div className="text-5xl md:text-7xl font-black bg-gradient-to-br from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                $150
              </div>
              <p className="text-gray-500 text-xs md:text-sm font-medium">One-time payment • New customer exclusive</p>
            </div>
          </div>

          {/* Premium CTA button */}
          <button
            onClick={onAccept}
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all shadow-2xl hover:shadow-amber-500/50 w-full disabled:opacity-50 disabled:cursor-not-allowed mb-3 md:mb-4"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 md:w-6 md:h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <Users className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span>Add Coaching Call • $150</span>
                <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          {/* Reject offer button */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium underline transition-colors"
          >
            I reject this offer
          </button>

          {error && (
            <div className="mt-4 md:mt-6 bg-red-50 border-2 border-red-200 text-red-700 px-4 md:px-5 py-3 md:py-4 rounded-xl">
              <p className="text-sm font-semibold">{error}</p>
              <p className="text-xs mt-1">Please try again or contact support.</p>
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-600" strokeWidth={2.5} />
              </div>
              <span className="font-medium">Secure one-click payment</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              <span className="font-medium">Instant confirmation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
