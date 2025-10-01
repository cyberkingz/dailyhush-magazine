import { useEffect } from 'react'
import { CheckCircle, Flame } from 'lucide-react'
import { useScarcity } from '../contexts/ScarcityContext'

interface UrgencyBannerProps {
  productName?: string
  tagline?: string
  showSocialProof?: boolean
  regularPrice?: number
  transparencyMessage?: string
}

export function UrgencyBanner({
  productName = 'F.I.R.E. STARTER KIT',
  tagline = 'Stop planning. Start shipping.',
  showSocialProof = true,
  regularPrice = 47,
  transparencyMessage
}: UrgencyBannerProps) {
  const { spotsRemaining, totalSpots, progressPercentage, isCritical, isSoldOut } = useScarcity()

  const defaultTransparencyMessage = `Only ${totalSpots} spots available at this price today. Once sold out, regular pricing applies ($${regularPrice}). We only show this offer once - no follow-up emails.`

  // Redirect if sold out
  useEffect(() => {
    if (isSoldOut) {
      // Could redirect to regular pricing page
      console.log('🚫 Sold out - regular pricing now applies')
    }
  }, [isSoldOut])

  return (
    <div className={`relative overflow-hidden ${
      isSoldOut
        ? 'bg-gradient-to-br from-slate-100 via-gray-100 to-slate-100'
        : 'bg-gradient-to-br from-amber-50 via-orange-50/40 to-rose-50/30'
    }`}>
      {/* Soft animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
      <div className="absolute inset-0 opacity-60">
        <div
          className="absolute top-0 right-0 w-96 h-96 bg-rose-100/40 rounded-full blur-3xl transition-opacity duration-[3000ms] ease-in-out"
          style={{
            animation: 'gentlePulse 4s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl transition-opacity duration-[3000ms] ease-in-out"
          style={{
            animation: 'gentlePulse 4s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Gentle pulse keyframe animation */}
      <style>{`
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes subtleShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes softBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="space-y-4 sm:space-y-5">

          {/* Main Headline with celebration */}
          <div className="text-center space-y-3">
            <div className="inline-block">
              <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">
                🎉 50,000 subscribers milestone celebration
              </p>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900 px-2">
              {productName}
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-medium text-slate-600 px-2">
              {tagline}
            </p>
          </div>

          {/* Spots Scarcity Badge */}
          {showSocialProof && (
            <div className="flex justify-center">
              <div className={`inline-flex items-center gap-2 text-sm sm:text-base font-semibold px-5 py-2.5 rounded-full transition-all duration-300 ${
                isCritical
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                  : isSoldOut
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-800/90 text-amber-100 shadow-md'
              }`} style={isCritical ? { animation: 'softBounce 2s ease-in-out infinite' } : {}}>
                <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  {isSoldOut ? 'SOLD OUT TODAY' : `Only ${spotsRemaining}/${totalSpots} spots left today`}
                </span>
              </div>
            </div>
          )}

          {/* Progress Bar - Spots Remaining */}
          {!isSoldOut && (
            <div className="max-w-sm mx-auto px-2">
              <div className="relative w-full bg-slate-200/60 rounded-full h-3 overflow-hidden shadow-sm">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    isCritical
                      ? 'bg-gradient-to-r from-rose-400 to-pink-400'
                      : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0"
                    style={{ animation: 'subtleShimmer 3s linear infinite' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Trust Signal */}
          {!isSoldOut && !isCritical && (
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600">
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>30-Day Money-Back Guarantee • Instant Access</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
