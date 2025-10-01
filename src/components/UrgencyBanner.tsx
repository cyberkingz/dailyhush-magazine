import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, Clock, Sparkles, Zap } from 'lucide-react'

interface UrgencyBannerProps {
  productName?: string
  tagline?: string
  countdownDuration?: number // in minutes
  storageKey?: string
  showSocialProof?: boolean
  socialProofCount?: number
  regularPrice?: number
  transparencyMessage?: string
}

export function UrgencyBanner({
  productName = 'F.I.R.E. STARTER KIT',
  tagline = 'Stop planning. Start shipping.',
  countdownDuration = 15,
  storageKey = 'fire_countdown_end',
  showSocialProof = true,
  socialProofCount = 127,
  regularPrice = 47,
  transparencyMessage
}: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isUrgent, setIsUrgent] = useState(false)

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

  const defaultTransparencyMessage = `This exclusive new subscriber pricing is only shown once. After ${countdownDuration} minutes, regular pricing applies ($${regularPrice}). We won't spam you with follow-up emails about this offer.`

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-yellow-300 to-amber-400 text-black">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        <div className="space-y-4 sm:space-y-5">

          {/* Welcome Badge with Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-1.5 rounded-full shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                New Subscriber Welcome Offer
              </span>
            </div>
            {showSocialProof && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">S</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">M</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">J</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-[10px] font-bold text-white">+</div>
                </div>
                <span className="text-gray-900">
                  <span className="font-bold">{socialProofCount} people</span> grabbed this today
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
          {isUrgent ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 animate-pulse">
              <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-bold uppercase">Last Chance! Price Increases Soon</span>
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
