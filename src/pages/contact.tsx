import { useEffect } from 'react'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'

export default function Contact() {
  useEffect(() => { 
    document.title = 'Contact Us — DailyHush' 
  }, [])

  return (
    <main className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have a question or want to connect? We're here to help you on your journey to progress and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:pr-8">
              <ContactInfo />
            </div>
            
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

