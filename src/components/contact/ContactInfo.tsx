import React from 'react'

interface ContactInfoItemProps {
  icon: React.ReactNode
  title: string
  content: string
  href?: string
}

function ContactInfoItem({ icon, title, content, href }: ContactInfoItemProps) {
  const ContentWrapper = href ? 'a' : 'div'
  const linkProps = href ? {
    href,
    className: "text-amber-600 hover:text-amber-700 transition-colors"
  } : {}

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center ring-1 ring-emerald-200/40">
        <div className="text-amber-600">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-emerald-900 mb-1">{title}</h3>
        <ContentWrapper {...linkProps} className={href ? "text-amber-600 hover:text-amber-700 transition-colors" : "text-emerald-700"}>
          {content}
        </ContentWrapper>
      </div>
    </div>
  )
}

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-4">Get in Touch</h2>
        <p className="text-emerald-700 leading-relaxed">
          Have a question, suggestion, or just want to say hello? We'd love to hear from you.
          Reach out using the form or contact us directly.
        </p>
      </div>
      
      <div className="space-y-6">
        <ContactInfoItem
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          title="Email"
          content="hello@daily-hush.com"
          href="mailto:hello@daily-hush.com"
        />
        
        <ContactInfoItem
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          title="Phone"
          content="+1 (201) 367-0512"
          href="tel:+12013670512"
        />
        
        <ContactInfoItem
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Response Time"
          content="We typically respond within 24 hours"
        />
      </div>
      
      <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-6 ring-1 ring-white/40">
        <h3 className="font-semibold text-emerald-900 mb-2">Quick Tips</h3>
        <ul className="text-sm text-emerald-700 space-y-1">
          <li>• Be specific about your question or request</li>
          <li>• Include relevant details to help us assist you better</li>
          <li>• Check your spam folder if you don't hear back within 48 hours</li>
        </ul>
      </div>
    </div>
  )
}