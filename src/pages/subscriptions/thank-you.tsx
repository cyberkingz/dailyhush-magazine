import { useEffect } from 'react'

declare global {
  interface Window {
    SparkLoop?: any
    SL?: any
  }
}

export default function ThankYouPage() {
  useEffect(() => {
    document.title = 'Thank you — DailyHush'
    const email = new URLSearchParams(window.location.search).get('email') || undefined
    const upscribeId = import.meta.env.VITE_SPARKLOOP_UPSCRIBE_ID as string | undefined

    console.log('Thank you page loaded with:', { email, upscribeId })

    let tries = 0
    const maxTries = 30
    const interval = window.setInterval(() => {
      const sl = window.SparkLoop || (window as any).SL
      console.log(`Try ${tries + 1}: SparkLoop available:`, !!sl)
      
      if (!sl) {
        if (++tries >= maxTries) {
          console.log('SparkLoop not found after max tries')
          window.clearInterval(interval)
        }
        return
      }

      try {
        console.log('SparkLoop object:', sl)
        console.log('Available methods:', Object.keys(sl))
        
        // Try to identify the subscriber first
        if (email && typeof sl.trackSubscriber === 'function') {
          console.log('Tracking subscriber:', email)
          sl.trackSubscriber(email)
        }
        
        // Then try to show Upscribe
        const gen = sl.generate || sl
        console.log('Generator object:', gen)
        
        if (gen && typeof gen.upscribePopup === 'function' && upscribeId) {
          console.log('Calling upscribePopup with:', { upscribeId, email })
          gen.upscribePopup(upscribeId, email)
          
          // Add a delay to check if the modal loaded with content
          setTimeout(() => {
            const modal = document.querySelector('[id*="sparkloop"], [class*="sparkloop"], [class*="upscribe"]')
            if (modal && modal.textContent?.trim() === '') {
              console.log('Upscribe modal is empty, showing fallback message')
              modal.innerHTML = `
                <div style="
                  position: fixed; 
                  top: 50%; 
                  left: 50%; 
                  transform: translate(-50%, -50%); 
                  background: white; 
                  padding: 2rem; 
                  border-radius: 12px; 
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                  max-width: 400px;
                  text-align: center;
                  z-index: 10000;
                ">
                  <h3 style="margin: 0 0 1rem 0; color: #1f2937; font-size: 1.25rem; font-weight: 600;">
                    Newsletter Recommendations
                  </h3>
                  <p style="margin: 0 0 1.5rem 0; color: #6b7280; line-height: 1.5;">
                    Recommendations are being configured for your newsletter. 
                    Check back soon for personalized newsletter suggestions!
                  </p>
                  <button 
                    onclick="this.parentElement.parentElement.remove()" 
                    style="
                      background: #3b82f6; 
                      color: white; 
                      border: none; 
                      padding: 0.5rem 1rem; 
                      border-radius: 6px; 
                      cursor: pointer;
                      font-weight: 500;
                    "
                  >
                    Got it
                  </button>
                </div>
                <div style="
                  position: fixed; 
                  top: 0; 
                  left: 0; 
                  width: 100vw; 
                  height: 100vh; 
                  background: rgba(0, 0, 0, 0.5); 
                  z-index: 9999;
                  cursor: pointer;
                " onclick="this.parentElement.remove()"></div>
              `
            }
          }, 1000)
          
          window.clearInterval(interval)
          return
        } else {
          console.log('upscribePopup not available or missing ID')
        }
      } catch (error) {
        console.error('SparkLoop error:', error)
      }

      if (++tries >= maxTries) {
        console.log('Reached max tries, stopping')
        window.clearInterval(interval)
      }
    }, 250)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="bg-white">
      {/* SparkLoop Upscribe renders into this container when the script is present */}
      <div id="sparkloop-upscribe"></div>
      
      {/* CSS to fix SparkLoop modal positioning */}
      <style>{`
        /* Fix SparkLoop Upscribe modal positioning */
        [id*="sparkloop"], [class*="sparkloop"], [class*="upscribe"] {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          z-index: 9999 !important;
        }
        
        /* Ensure backdrop is properly positioned */
        [id*="sparkloop"] > div:first-child, 
        [class*="sparkloop"] > div:first-child,
        [class*="upscribe"] > div:first-child {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: rgba(0, 0, 0, 0.5) !important;
          z-index: 9998 !important;
        }
        
        /* Style the modal content */
        [id*="sparkloop"] .modal, 
        [class*="sparkloop"] .modal,
        [class*="upscribe"] .modal,
        [id*="sparkloop"] [role="dialog"],
        [class*="sparkloop"] [role="dialog"],
        [class*="upscribe"] [role="dialog"] {
          position: relative !important;
          top: auto !important;
          left: auto !important;
          transform: none !important;
          margin: auto !important;
          max-width: 500px !important;
          max-height: 600px !important;
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
      `}</style>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">You’re in! 🎉</h1>
        <p className="text-lg text-gray-700 mb-8">
          Thanks for subscribing to DailyHush. We just sent a welcome note to your inbox.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">What to expect</h3>
            <ul className="text-gray-700 list-disc pl-5 space-y-1">
              <li>Weekly, evidence‑based beauty and wellness insights</li>
              <li>No fluff, just what actually works</li>
            </ul>
          </div>
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Stay connected</h3>
            <p className="text-gray-700">Add hello@daily-hush.com to your contacts so you never miss an email.</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-10">If a recommendations popup appears, you can choose more great newsletters to follow — or just close it to continue here.</p>
      </section>
    </div>
  )
}
