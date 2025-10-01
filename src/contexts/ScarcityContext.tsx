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

const TOTAL_SPOTS = 50
const INITIAL_SPOTS = 43 // Start at 43 to make it more believable

interface ScarcityProviderProps {
  children: ReactNode
}

export function ScarcityProvider({ children }: ScarcityProviderProps) {
  const [spotsRemaining, setSpotsRemaining] = useState(INITIAL_SPOTS)

  // Reset to initial spots on every page load (no persistence)
  useEffect(() => {
    setSpotsRemaining(INITIAL_SPOTS)
  }, [])

  const decrementSpots = () => {
    setSpotsRemaining((prev) => Math.max(0, prev - 1))
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
