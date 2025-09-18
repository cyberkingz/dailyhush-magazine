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
    // SparkLoop will auto-detect and show popup - no manual trigger needed
  }, [])

  return (
    <div className="bg-white">
      {/* SparkLoop Upscribe renders into this container when the script is present */}
      <div id="sparkloop-upscribe"></div>

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
