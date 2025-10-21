import { useState, useEffect } from 'react'

interface UseCountdownProps {
  targetDate: Date
  onExpire?: () => void
}

export function useCountdown({ targetDate, onExpire }: UseCountdownProps): string {
  const calculateTimeLeft = (): string => {
    const now = new Date().getTime()
    const target = targetDate.getTime()
    const difference = target - now

    if (difference <= 0) {
      onExpire?.()
      return '00:00:00'
    }

    const hours = Math.floor(difference / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const [timeLeft, setTimeLeft] = useState<string>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return timeLeft
}
