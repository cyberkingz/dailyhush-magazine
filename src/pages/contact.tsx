import { useEffect } from 'react'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'

export default function Contact() {
  useEffect(() => { 
    document.title = 'Contact Us — DailyHush' 
  }, [])

  return (
    <main className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 min-h-screen relative overflow-hidden">
      {/* Organic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-emerald-700 max-w-2xl mx-auto">
              Have a question or want to connect? We're here to help you on your journey to progress and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-16 lg:pb-20 relative z-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:pr-8">
              <ContactInfo />
            </div>

            {/* Contact Form */}
            <div>
              <div className="rounded-3xl bg-white/90 backdrop-blur-xl backdrop-saturate-[200%] border border-emerald-200/40 shadow-[0_16px_48px_-8px_rgba(16,185,129,0.15),0_24px_56px_-12px_rgba(245,158,11,0.12)] ring-1 ring-white/40 p-8">
                <h2 className="text-2xl font-bold text-emerald-900 mb-6">Send us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

