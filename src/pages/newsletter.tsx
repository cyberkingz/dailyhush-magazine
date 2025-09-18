import { Mail, Award, Users, Clock } from 'lucide-react'
import NewsletterInlineForm from '@/components/NewsletterInlineForm'

export default function Newsletter() {
  return (
    <main className="py-10 min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 py-20 px-6 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold text-amber-700 mb-6 border border-amber-200">
            <Award className="w-4 h-4" />
            <span>Trusted by 50,000+ beauty insiders</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Subscribe to DailyHush
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-2">
            Evidence‑based beauty and wellness. No fluff, no spam.
          </p>
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2 mb-6">
            <Users className="w-4 h-4" /> 50,000+ readers
            <span>•</span>
            <Clock className="w-4 h-4" /> Weekly, 5‑minute read
          </p>

          {/* Inline email opt-in inside hero */}
          <div className="max-w-xl mx-auto">
            <NewsletterInlineForm 
              sourcePage="newsletter" 
              showSparkLoop={true} 
              redirectOnSuccess={false} 
            />
          </div>
        </div>
      </section>

      {/* Small legal note */}
      <section className="max-w-4xl mx-auto px-6">
        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to our privacy policy. Unsubscribe anytime.
        </p>
      </section>

      {/* Why subscribe */}
      <section className="max-w-5xl mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
              <Mail className="w-4 h-4" />
              <span>Actionable</span>
            </div>
            <p className="text-gray-700">Clear, tested guidance — not product hype.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
              <Users className="w-4 h-4" />
              <span>Community‑vetted</span>
            </div>
            <p className="text-gray-700">50,000+ readers shaping our weekly briefs.</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-amber-700 font-semibold mb-2">
              <Clock className="w-4 h-4" />
              <span>Fast</span>
            </div>
            <p className="text-gray-700">5 minutes to get smarter every week.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
