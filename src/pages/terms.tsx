import { useEffect } from 'react'

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service — DailyHush'
  }, [])

  return (
    <div className="container-prose py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> January 8, 2025<br />
            <strong>Last Updated:</strong> January 8, 2025
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
            <p className="text-sm text-gray-700">
              These Terms of Service ("Terms") govern your use of the DailyHush website 
              located at daily-hush.com (the "Service") operated by Red Impact LLC DBA DailyHush 
              ("us", "we", or "our"). Please read these Terms carefully before using our Service.
            </p>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-6">
            By accessing and using our Service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
          <p className="text-gray-700 mb-4">DailyHush provides:</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Daily content and insights through our blog</li>
            <li>Newsletter subscription services</li>
            <li>Educational and informational content</li>
            <li>Community engagement opportunities</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
          <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
            <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity</li>
            <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
            <li>Attempt to gain unauthorized access to any portion of the Service</li>
            <li>Use the Service for any commercial purpose without our express written consent</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property Rights</h2>
          <p className="text-gray-700 mb-6">
            The Service and its original content, features, and functionality are and will remain the exclusive property of Red Impact LLC DBA DailyHush and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. User-Generated Content</h2>
          <p className="text-gray-700 mb-4">
            Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>
          <p className="text-gray-700 mb-6">
            By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Privacy Policy</h2>
          <p className="text-gray-700 mb-6">
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Disclaimers</h2>
          <p className="text-gray-700 mb-6">
            The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions relating to our Service and the use of this Service. Nothing in this disclaimer will limit our liability for death or personal injury arising from our negligence.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-700 mb-6">
            In no event shall Red Impact LLC DBA DailyHush, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Termination</h2>
          <p className="text-gray-700 mb-6">
            We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Governing Law</h2>
          <p className="text-gray-700 mb-6">
            These Terms shall be interpreted and governed by the laws of the State of Wyoming, United States. Any disputes relating to these Terms will be subject to the exclusive jurisdiction of the courts of Wyoming.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
          <p className="text-gray-700 mb-6">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Information</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">If you have any questions about these Terms of Service, please contact us:</p>
            <div className="text-gray-700 space-y-2">
              <p><strong>Red Impact LLC DBA DailyHush</strong></p>
              <p>30 N Gould St Ste R<br />Sheridan, Wyoming, 82801</p>
              <p>Email: <a href="mailto:hello@daily-hush.com" className="text-yellow-600 hover:text-yellow-700">hello@daily-hush.com</a></p>
              <p>Phone: <a href="tel:+12013670512" className="text-yellow-600 hover:text-yellow-700">+1 201-367-0512</a></p>
              <p>Company #: 2024-001419992</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}