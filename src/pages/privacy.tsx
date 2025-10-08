import { useEffect } from 'react'

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — DailyHush'
  }, [])

  return (
    <div className="bg-gradient-to-br from-emerald-50/80 via-emerald-50/50 to-amber-50/30 min-h-screen relative overflow-hidden">
      {/* Organic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="container-prose py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-emerald-900 mb-8">Privacy Policy</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-emerald-700 mb-8">
              <strong>Effective Date:</strong> January 8, 2025<br />
              <strong>Last Updated:</strong> January 8, 2025
            </p>

            <div className="bg-emerald-50/80 border-l-4 border-emerald-400 p-6 mb-8 rounded-r-lg ring-1 ring-white/40">
              <p className="text-sm text-emerald-800">
                Red Impact LLC DBA DailyHush ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and protect your information when you visit
                our website at daily-hush.com (the "Service").
              </p>
            </div>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-medium text-emerald-800 mb-3">Information You Provide to Us</h3>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li><strong>Newsletter Subscription:</strong> When you subscribe to our newsletter, we collect your email address.</li>
            <li><strong>Contact Information:</strong> When you contact us, we may collect your name, email address, and any other information you choose to provide.</li>
            <li><strong>Feedback and Comments:</strong> Any feedback, comments, or suggestions you provide to us.</li>
          </ul>

          <h3 className="text-xl font-medium text-emerald-800 mb-3">Information We Collect Automatically</h3>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li><strong>Usage Data:</strong> Information about how you access and use our Service, including pages visited, time spent on pages, and navigation patterns.</li>
            <li><strong>Device Information:</strong> Information about your device, browser type, operating system, and IP address.</li>
            <li><strong>Cookies and Similar Technologies:</strong> We use cookies and similar tracking technologies to enhance your experience.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-emerald-700 mb-4">We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li>Provide, maintain, and improve our Service</li>
            <li>Send you newsletters and updates (with your consent)</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Analyze usage patterns to improve our content and user experience</li>
            <li>Protect against fraud and ensure the security of our Service</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">3. Information Sharing and Disclosure</h2>
          <p className="text-emerald-700 mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website and delivering our services (e.g., email marketing platforms, analytics providers).</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety, or that of others.</li>
            <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition of all or a portion of our business.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">4. Data Security</h2>
          <p className="text-emerald-700 mb-6">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">5. Your Rights and Choices</h2>
          <ul className="list-disc pl-6 mb-6 text-emerald-700">
            <li><strong>Newsletter Unsubscribe:</strong> You may unsubscribe from our newsletter at any time by clicking the unsubscribe link in any email or contacting us directly.</li>
            <li><strong>Access and Correction:</strong> You may request access to or correction of your personal information by contacting us.</li>
            <li><strong>Data Deletion:</strong> You may request deletion of your personal information, subject to certain legal limitations.</li>
            <li><strong>Cookies:</strong> You can control cookies through your browser settings, though this may affect website functionality.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">6. Third-Party Links</h2>
          <p className="text-emerald-700 mb-6">
            Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. We encourage you to review their privacy policies before providing any information.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">7. Children's Privacy</h2>
          <p className="text-emerald-700 mb-6">
            Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">8. International Data Transfers</h2>
          <p className="text-emerald-700 mb-6">
            Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and that your information receives adequate protection.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">9. Changes to This Privacy Policy</h2>
          <p className="text-emerald-700 mb-6">
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued use of the Service after such changes constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-semibold text-emerald-900 mt-8 mb-4">10. Contact Us</h2>
          <div className="bg-emerald-50/80 p-6 rounded-xl ring-1 ring-white/40 border border-emerald-200/60">
            <p className="text-emerald-700 mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="text-emerald-700 space-y-2">
              <p><strong>Red Impact LLC DBA DailyHush</strong></p>
              <p>30 N Gould St Ste R<br />Sheridan, Wyoming, 82801</p>
              <p>Email: <a href="mailto:hello@daily-hush.com" className="text-amber-600 hover:text-amber-700">hello@daily-hush.com</a></p>
              <p>Phone: <a href="tel:+12013670512" className="text-amber-600 hover:text-amber-700">+1 201-367-0512</a></p>
              <p>Company #: 2024-001419992</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}