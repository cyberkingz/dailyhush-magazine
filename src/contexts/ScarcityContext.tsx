import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ScarcityContextType {
  spotsRemaining: number
  totalSpots: number
  decrementSpots: () => void
  progressPercentage: number
  isCritical: boolean
  isSoldOut: boolean
}

const ScarcityContext = createContext<ScarcityContextType | undefined>(undefined)

const STORAGE_KEY = 'fire_spots_remaining'
const STORAGE_DATE_KEY = 'fire_spots_date'
const TOTAL_SPOTS = 50
const INITIAL_SPOTS = 47 // Start at 47 to make it more believable

interface ScarcityProviderProps {
  children: ReactNode
}

export function ScarcityProvider({ children }: ScarcityProviderProps) {
  const [spotsRemaining, setSpotsRemaining] = useState(INITIAL_SPOTS)

  // Initialize spots from localStorage or set new daily count
  useEffect(() => {
    const today = new Date().toDateString()
    const storedDate = localStorage.getItem(STORAGE_DATE_KEY)
    const storedSpots = localStorage.getItem(STORAGE_KEY)

    if (storedDate === today && storedSpots) {
      // Same day - use stored value
      setSpotsRemaining(Math.max(0, parseInt(storedSpots, 10)))
    } else {
      // New day - reset to initial spots
      setSpotsRemaining(INITIAL_SPOTS)
      localStorage.setItem(STORAGE_DATE_KEY, today)
      localStorage.setItem(STORAGE_KEY, String(INITIAL_SPOTS))
    }
  }, [])

  const decrementSpots = () => {
    setSpotsRemaining((prev) => {
      const newValue = Math.max(0, prev - 1)
      localStorage.setItem(STORAGE_KEY, String(newValue))
      return newValue
    })
  }

  const progressPercentage = Math.round((spotsRemaining / TOTAL_SPOTS) * 100)
  const isCritical = spotsRemaining <= 10 && spotsRemaining > 0
  const isSoldOut = spotsRemaining === 0

  return (
    <ScarcityContext.Provider
      value={{
        spotsRemaining,
        totalSpots: TOTAL_SPOTS,
        decrementSpots,
        progressPercentage,
        isCritical,
        isSoldOut
      }}
    >
      {children}
    </ScarcityContext.Provider>
  )
}

export function useScarcity() {
  const context = useContext(ScarcityContext)
  if (context === undefined) {
    throw new Error('useScarcity must be used within a ScarcityProvider')
  }
  return context
}
