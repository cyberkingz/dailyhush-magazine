import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, Clock, Sparkles, Zap, Flame } from 'lucide-react'
import { useScarcity } from '../contexts/ScarcityContext'

interface UrgencyBannerProps {
  productName?: string
  tagline?: string
  countdownDuration?: number // in minutes
  storageKey?: string
  showSocialProof?: boolean
  regularPrice?: number
  transparencyMessage?: string
}

export function UrgencyBanner({
  productName = 'F.I.R.E. STARTER KIT',
  tagline = 'Stop planning. Start shipping.',
  countdownDuration = 15,
  storageKey = 'fire_countdown_end',
  showSocialProof = true,
  regularPrice = 47,
  transparencyMessage
}: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isUrgent, setIsUrgent] = useState(false)
  const { spotsRemaining, totalSpots, progressPercentage, isCritical, isSoldOut } = useScarcity()

  // Countdown timer effect
  useEffect(() => {
    const COUNTDOWN_DURATION = countdownDuration * 60 * 1000

    let countdownEnd = localStorage.getItem(storageKey)

    if (!countdownEnd) {
      countdownEnd = String(Date.now() + COUNTDOWN_DURATION)
      localStorage.setItem(storageKey, countdownEnd)
    }

    const calculateTimeLeft = () => {
      const now = Date.now()
      const difference = Number(countdownEnd) - now

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ hours, minutes, seconds })
        setIsUrgent(hours === 0 && minutes < 5)
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        setIsUrgent(false)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [countdownDuration, storageKey])

  const defaultTransparencyMessage = `Only ${totalSpots} spots available at this price today. Once sold out or after ${countdownDuration} minutes (whichever comes first), regular pricing applies ($${regularPrice}). We only show this offer once - no follow-up emails.`

  // Redirect if sold out
  useEffect(() => {
    if (isSoldOut) {
      // Could redirect to regular pricing page
      console.log('🚫 Sold out - regular pricing now applies')
    }
  }, [isSoldOut])

  return (
    <div className={`relative overflow-hidden text-black ${
      isSoldOut
        ? 'bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400'
        : 'bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="space-y-4 sm:space-y-5">

          {/* Welcome Badge with Spots Scarcity */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-1.5 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                New Subscriber Welcome Offer
              </span>
            </div>
            {showSocialProof && (
              <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-3 py-1 rounded-full ${
                isCritical
                  ? 'bg-red-600 text-white animate-pulse'
                  : isSoldOut
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-black/80 text-yellow-400'
              }`}>
                <Flame className={`h-4 w-4 ${isCritical ? 'animate-bounce' : ''}`} />
                <span>
                  {isSoldOut ? 'SOLD OUT TODAY' : `Only ${spotsRemaining}/${totalSpots} spots left!`}
                </span>
              </div>
            )}
          </div>

          {/* Main Headline */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-gray-900">
              {productName}
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-gray-900" />
              {tagline}
            </p>
          </div>

          {/* Progress Bar - Spots Remaining */}
          {!isSoldOut && (
            <div className="max-w-md mx-auto">
              <div className="relative w-full bg-black/20 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isCritical
                      ? 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse'
                      : 'bg-gradient-to-r from-green-600 via-yellow-500 to-yellow-400'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                </div>
              </div>
              <p className={`text-center text-xs sm:text-sm font-bold mt-2 ${
                isCritical ? 'text-red-700 animate-pulse' : 'text-gray-800'
              }`}>
                {isCritical
                  ? `⚠️ Almost Gone! Only ${spotsRemaining} spots left`
                  : `${spotsRemaining} spots available at this price today`
                }
              </p>
            </div>
          )}

          {/* Countdown Timer - Hero Element */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 text-gray-900 ${isUrgent ? 'animate-pulse' : ''}`} />
              <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-gray-900">
                Your Exclusive Price Expires In:
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Hours */}
              <TimerUnit value={timeLeft.hours} label="Hours" isUrgent={isUrgent} />

              <TimerSeparator />

              {/* Minutes */}
              <TimerUnit value={timeLeft.minutes} label="Minutes" isUrgent={isUrgent} />

              <TimerSeparator />

              {/* Seconds */}
              <TimerUnit value={timeLeft.seconds} label="Seconds" isUrgent={isUrgent} />
            </div>
          </div>

          {/* Trust Signals & Urgency Message */}
          {isSoldOut ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-bold uppercase">Today's Special Pricing Sold Out</span>
              </div>
            </div>
          ) : (isUrgent || isCritical) ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 animate-pulse">
              <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-bold uppercase">
                  {isCritical ? `Only ${spotsRemaining} spots left!` : 'Last Chance! Price Increases Soon'}
                </span>
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                <CheckCircle className="h-4 w-4 text-green-700" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <span className="hidden sm:inline text-gray-600">•</span>
              <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                <Zap className="h-4 w-4 text-gray-900" />
                <span>Instant Access After Purchase</span>
              </div>
            </div>
          )}

          {/* Transparency Note */}
          <p className="text-center text-[11px] sm:text-xs text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {transparencyMessage || defaultTransparencyMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

// Timer Unit Component
function TimerUnit({ value, label, isUrgent }: { value: number; label: string; isUrgent: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`
        relative bg-gradient-to-br from-black via-gray-900 to-black
        rounded-lg sm:rounded-xl shadow-2xl
        px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4
        min-w-[3.5rem] sm:min-w-[4.5rem] md:min-w-[5.5rem]
        transform transition-all duration-300
        ${isUrgent ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-yellow-400 animate-pulse' : 'ring-2 ring-yellow-500'}
      `}>
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono tabular-nums tracking-tight block text-center leading-none text-yellow-400">
          {String(value).padStart(2, '0')}
        </span>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-lg sm:rounded-xl" />
      </div>
      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-800">
        {label}
      </span>
    </div>
  )
}

// Timer Separator Component
function TimerSeparator() {
  return (
    <div className="flex flex-col gap-1 pb-6">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black" />
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black" />
    </div>
  )
}
