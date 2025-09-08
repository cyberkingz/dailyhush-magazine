import { ReactNode, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

export function Providers({ children }: { children: ReactNode }) {
  // Place for theme, toasts, etc.
  useEffect(() => {
    // Example: set dark based on system
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    document.documentElement.classList.toggle('dark', mql.matches)
  }, [])
  
  return <BrowserRouter>{children}</BrowserRouter>
}

