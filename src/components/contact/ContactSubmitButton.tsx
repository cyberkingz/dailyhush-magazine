import React from 'react'

interface ContactSubmitButtonProps {
  isLoading?: boolean
  isDisabled?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function ContactSubmitButton({
  isLoading = false,
  isDisabled = false,
  loadingText = "Sending...",
  children
}: ContactSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || isDisabled}
      className="w-full bg-yellow-400 hover:bg-yellow-300 hover:text-black focus:text-black text-black font-semibold py-3 px-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading && (
        <svg 
          className="animate-spin h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {isLoading ? loadingText : children}
    </button>
  )
}